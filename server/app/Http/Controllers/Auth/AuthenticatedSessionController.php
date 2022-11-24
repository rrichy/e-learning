<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\FileUploadRequest;
use App\Http\Requests\UpdateSelfRequest;
use App\Models\ExplainerVideo;
use App\Services\AuthenticatedService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Password;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request, AuthenticatedService $service)
    {
        $request->authenticate();

        try {
            $token = $service->store($request->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'access_token' => $token,
            'message' => 'Login Successful!',
        ]);
    }

    public function show(AuthenticatedService $service)
    {
        try {
            $json = $service->show(auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function update(UpdateSelfRequest $request, AuthenticatedService $service)
    {
        try {
            $json = $service->update($request->validated(), auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function destroy(AuthenticatedService $service)
    {
        try {
            $json = $service->logout(auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function upload(FileUploadRequest $request, AuthenticatedService $service)
    {
        try {
            $json = $service->upload($request->validated(), auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function video(Request $request, AuthenticatedService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate', 'individual']]);
        // TODO: check if authenticated is allowed to view

        $valid = $request->validate([
            'url' => 'required|string|starts_with:' . config('constants.prefixes.s3'),
        ]);

        try {
            $json = $service->viewVideo($valid['url']);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function updatePlayback(Request $request, ExplainerVideo $video, AuthenticatedService $service)
    {
        Gate::authorize('check-membership', [['individual']]);
        // TODO: check if individual is authorized to update

        $valid = $request->validate([
            'playback_position' => 'required|numeric',
            'is_complete' => 'boolean'
        ]);

        try {
            $json = $service->updatePlayback($valid, $video);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json($json);
    }

    public function changePassword(Request $request, AuthenticatedService $service)
    {
        $valid = $request->validate([
            'old_password' => 'required|string',
            'new_password' => ['required', 'confirmed', 'different:old_password', Password::defaults()],
        ]);

        try {
            $service->changePassword($valid, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Password changed successfully!'
        ]);
    }
}
