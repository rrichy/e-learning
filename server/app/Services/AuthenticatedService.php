<?php

namespace App\Services;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\UpdateSelfRequest;
use App\Http\Resources\AccountShowResource;
use App\Models\Category;
use App\Models\Course;
use App\Models\MembershipType;
use App\Models\TemporaryUrl;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AuthenticatedService
{
    public function details()
    {
        return $this->getAuthData('Login Successful!');
    }


    public function update(UpdateSelfRequest $request)
    {
        $valid = $request->validated();

        DB::transaction(function () use ($valid) {
            $auth = auth()->user();

            $s3_image_url = $auth->temporaryUrls()->where('directory', 'profiles/')->first();

            if ($s3_image_url) {
                $s3_image_url->delete();
                abort_if($s3_image_url->url !== $valid['image'], 403, 'Image url mismatch!');
            }

            $old_image = $auth->image;

            $auth->update($valid);

            $newdepartments = [];
            if (isset($valid['department_1'])) {
                $newdepartments[$valid['department_1']] = ['order' => 1];
                if (isset($valid['department_2'])) $newdepartments[$valid['department_2']] = ['order' => 2];
            }
            $auth->departments()->sync($newdepartments);

            if ($s3_image_url) {
                Storage::delete(str_replace(config('constants.prefixes.s3'), '', $old_image));
            }
        });

        return response()->json([
            'message' => 'Update successful!',
            'user' => new AccountShowResource(auth()->user()->load('departments')),
        ]);
    }


    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $auth = $request->user();
        $token = $auth->createToken('access_token')->plainTextToken;
        $auth->last_login_date = now();
        $auth->save();

        return response()->json([
            'access_token' => $token,
            'message' => 'Login Successful!',
        ]);
    }

    /**
     * Types of upload
     * - user edits own profile
     * - admin/corporate edits other user's profile
     * - admin/corporate uploads course
     * - admin/corporate uploads video
     */
    public function upload(Request $request)
    {
        $auth = auth()->user();
        $type = $request->input('type');
        // $user_id = $request->input('user_id');

        abort_if(is_null($type) || !in_array($type, ['profile_image', 'course_image', 'chapter_video']), 403, 'No upload type in the request!');
        abort_if(($auth->isIndividual() || $auth->isTrial()) && $type !== 'profile_image', 403, 'You are not authorized to upload with this type!');
        // abort_if(in_array($type, ['course_image', 'chapter_video']) && !($auth->isAdmin() || $auth->isCorporate()), 403, 'You are not authorized to upload with this type!');
        // abort_if($type === 'profile_image' && $auth->isIndividual() && $user_id, 403, 'You cannot modify someone else\'s image');

        $directory = [
            'profile_image' => 'profiles/',
            'course_image' => 'courses/',
            'chapter_video' => 'chapters/'
        ][$type];

        $client = Storage::getClient();
        $expiry = "+3 minutes";
        if ($directory === 'profiles/' || $directory === 'courses/') {
            $command = $client->getCommand('PutObject', [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $directory . now()->valueOf()
            ]);

            $url = $client->createPresignedRequest($command, $expiry)->getUri();

            TemporaryUrl::create([
                'directory' => $directory,
                'url' => explode('?', $url)[0],
                'user_id' => auth()->id(),
            ]);

            return response()->json($url);
        } else {
            $upload_id = $request->input('upload_id');
            $part_number = $request->input('part_number');
            $filename = $request->input('filename');

            if (is_null($upload_id)) {
                $generated_key = now()->valueOf();
                $command = $client->getCommand('CreateMultipartUpload', [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Key'    => $directory . $generated_key,
                ]);

                $url = $client->createPresignedRequest($command, $expiry)->getUri();

                TemporaryUrl::create([
                    'directory' => $directory,
                    'url' => explode('?', $url)[0],
                    'user_id' => auth()->id(),
                ]);

                return response()->json([
                    'url' => $url,
                    'generated_key' => $generated_key,
                ]);
            } else if (!is_null($part_number) && !is_null($filename)) {
                $command = $client->getCommand('UploadPart', [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Key'    => $directory . $filename,
                    'UploadId' => $upload_id,
                    'PartNumber' => $part_number,
                ]);

                $url = $client->createPresignedRequest($command, "+60 minutes")->getUri();

                TemporaryUrl::create([
                    'directory' => $directory,
                    'url' => explode('?', $url)[0],
                    'user_id' => auth()->id(),
                ]);

                return response()->json($url);
            } else {
                $valid = $request->validate([
                    'parts' => 'array',
                    'parts.*.ETag' => 'required|string',
                    'parts.*.PartNumber' => 'required|numeric',
                    'contentType' => 'required|string',
                ]);

                $command = $client->getCommand('CompleteMultipartUpload', [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Key'    => $directory . $filename,
                    'UploadId' => $upload_id,
                    'MultipartUpload' => [
                        'Parts' => $valid['parts'],
                    ],
                ]);

                $url = $client->createPresignedRequest($command, "+30 minutes")->getUri();

                TemporaryUrl::create([
                    'directory' => $directory,
                    'url' => explode('?', $url)[0],
                    'user_id' => auth()->id(),
                ]);

                return response()->json($url);
            }
        }
    }


    public function viewVideo(Request $request)
    {
        $url = $request->input('url');

        abort_if(is_null($url) || !str_contains($url, config('constants.prefixes.s3')), 403, 'Not a valid url');

        // check if authorized
        // here


        return response()->json([
            'url' => Storage::temporaryUrl(
                str_replace(config('constants.prefixes.s3'), '', $url),
                '+10 minutes'
            )
        ]);
    }


    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout Successful!',
        ]);
    }


    private function getAuthData(string $message)
    {
        switch (auth()->user()->membership_type_id) {
            case MembershipType::ADMIN:
                return response()->json([
                    'user' => auth()->user(),
                    'users_count' => User::where('membership_type_id', '<', MembershipType::ADMIN)
                        ->select(DB::raw('count(membership_type_id) as count, (CASE WHEN membership_type_id = 1 THEN "trial" WHEN membership_type_id = 2 THEN "individual" ELSE "corporate" END) AS membership_type'))
                        ->groupBy('membership_type_id')->get()
                        ->mapWithKeys(fn ($item) => [$item['membership_type'] => $item['count']]),
                    'message' => $message,
                ]);
            case MembershipType::CORPORATE:
                // Count individuals under the same affiliation as the Corporate (UNFINISHED)
                return response()->json([
                    'user' => new AccountShowResource(auth()->user()->load('departments')),
                    'users_count' => [
                        'individual' => User::query()
                            ->where('membership_type_id', MembershipType::INDIVIDUAL)
                            ->where('affiliation_id', auth()->user()->affiliation_id)
                            ->count()
                    ],
                    'message' => $message,
                ]);
            case MembershipType::INDIVIDUAL:
                return response()->json([
                    'user' => new AccountShowResource(auth()->user()->load('departments')),
                    'message' => $message,
                    'categories' => Category::query()
                        ->whereHas('courses', fn ($q) => $q->where('status', Course::STATUS['public']))
                        ->with(
                            ['courses' => fn ($q) => $q->where('status', Course::STATUS['public'])->select('id', 'title', 'category_id')]
                        )->get(['id', 'name'])
                ]);
            default:
                return response()->json([
                    'user' => auth()->user(),
                    'message' => $message,
                ]);
        }
    }
}
