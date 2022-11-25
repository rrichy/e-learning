<?php

namespace App\Services;

use App\Http\Resources\AccountShowResource;
use App\Models\Category;
use App\Models\Course;
use App\Models\ExplainerVideo;
use App\Models\MembershipType;
use App\Models\TemporaryUrl;
use App\Models\User;
use App\Models\ViewingInformation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Exception;

class AuthenticatedService
{
    public function store(User $auth)
    {
        $token = $auth->createToken('access_token')->plainTextToken;
        $auth->last_login_date = now();
        $auth->save();

        return $token;
    }


    public function show(User $auth)
    {
        return $this->getAuthData($auth, 'Login Successful!');
    }


    public function update(array $valid, User $auth)
    {
        DB::transaction(function () use ($valid, $auth) {
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

        return [
            'message' => 'Update successful!',
            'user' => new AccountShowResource($auth->load('departments')),
        ];
    }


    public function logout(User $auth)
    {
        $auth->currentAccessToken()->delete();

        return [
            'message' => 'Logout Successful!',
        ];
    }


    /**
     * Types of upload
     * - user edits own profile
     * - admin/corporate edits other user's profile
     * - admin/corporate uploads course
     * - admin/corporate uploads video
     */
    public function upload(array $valid, User $auth)
    {
        $type = $valid['type'];

        abort_if(($auth->isIndividual() || $auth->isTrial()) && $type !== 'profile_image', 403, 'You are not authorized to upload with this type!');

        $directory = [
            'profile_image' => 'profiles/',
            'course_image' => 'courses/',
            'chapter_video' => 'chapters/'
        ][$type];

        $client = Storage::getClient();
        $expiry = "+3 minutes";

        // Single file upload
        if ($directory === 'profiles/' || $directory === 'courses/') {
            $command = $client->getCommand('PutObject', [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $directory . now()->valueOf()
            ]);

            $url = $client->createPresignedRequest($command, $expiry)->getUri();

            TemporaryUrl::create([
                'directory' => $directory,
                'url' => explode('?', $url)[0],
                'user_id' => $auth->id,
            ]);

            return $url;
            // Multipart file upload
        } else {
            $upload_id = $valid['upload_id'] ?? null;
            $part_number = $valid['part_number'] ?? null;
            $filename = $valid['filename'] ?? null;
            $parts = $valid['parts'] ?? null;

            // Generating a multipart upload temporaryurl
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
                    'user_id' => $auth->id,
                ]);

                return [
                    'url' => $url,
                    'generated_key' => $generated_key,
                ];
                // get upload part temporaryurl
            } else if (!is_null($part_number)) {
                $command = $client->getCommand('UploadPart', [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Key'    => $directory . $filename,
                    'UploadId' => $upload_id,
                    'PartNumber' => $part_number,
                ]);

                $url = $client->createPresignedRequest($command, "+60 minutes")->getUri();

                TemporaryUrl::updateOrCreate([
                    'directory' => $directory,
                    'url' => explode('?', $url)[0],
                    'user_id' => $auth->id,
                ]);

                return $url;
                // get end multipart temporaryurl
            } else {
                $command = $client->getCommand('CompleteMultipartUpload', [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Key'    => $directory . $filename,
                    'UploadId' => $upload_id,
                    'MultipartUpload' => [
                        'Parts' => $parts,
                    ],
                ]);

                $url = $client->createPresignedRequest($command, "+30 minutes")->getUri();

                TemporaryUrl::updateOrCreate([
                    'directory' => $directory,
                    'url' => explode('?', $url)[0],
                    'user_id' => $auth->id,
                ]);

                return $url;
            }
        }
    }


    public function viewVideo($url)
    {
        return [
            'url' => Storage::temporaryUrl(
                str_replace(config('constants.prefixes.s3'), '', $url),
                '+10 minutes'
            )
        ];
    }


    public function updatePlayback(array $valid, ExplainerVideo $video)
    {
        ViewingInformation::updateOrCreate([
            'user_id' => auth()->id(),
            'explainer_video_id' => $video->id,
        ], $valid);

        return [
            'message' => 'Updated playback position!'
        ];
    }


    public function changePassword(array $valid, User $auth)
    {
        if (!Hash::check($valid['old_password'], $auth->password)) {
            throw new Exception('The inputted old password is incorrect.');
        }

        $auth->password = Hash::make($valid['new_password']);
        $auth->save();

        return $auth;
    }


    // Helper functions
    private function getAuthData(User $auth, string $message)
    {
        switch ($auth->membership_type_id) {
            case MembershipType::ADMIN:
                return [
                    'user' => $auth,
                    'users_count' => User::where('membership_type_id', '<', MembershipType::ADMIN)
                        ->select(DB::raw('count(membership_type_id) as count, (CASE WHEN membership_type_id = 1 THEN "trial" WHEN membership_type_id = 2 THEN "individual" ELSE "corporate" END) AS membership_type'))
                        ->groupBy('membership_type_id')->get()
                        ->mapWithKeys(fn ($item) => [$item['membership_type'] => $item['count']]),
                    'message' => $message,
                ];
            case MembershipType::CORPORATE:
                // Count individuals under the same affiliation as the Corporate (UNFINISHED)
                return [
                    'user' => new AccountShowResource($auth->load('departments')),
                    'users_count' => [
                        'individual' => User::query()
                            ->where('membership_type_id', MembershipType::INDIVIDUAL)
                            ->where('affiliation_id', $auth->affiliation_id)
                            ->count()
                    ],
                    'message' => $message,
                ];
            case MembershipType::INDIVIDUAL:
                return [
                    'user' => new AccountShowResource($auth->load('departments')),
                    'message' => $message,
                    'categories' => Category::query()
                        ->whereHas('courses', fn ($q) => $q->where('status', Course::STATUS['public']))
                        ->with(
                            ['courses' => fn ($q) => $q->where('status', Course::STATUS['public'])->select('id', 'title', 'category_id')]
                        )->get(['id', 'name'])
                ];
            default:
                return [
                    'user' => $auth,
                    'message' => $message,
                ];
        }
    }
}
