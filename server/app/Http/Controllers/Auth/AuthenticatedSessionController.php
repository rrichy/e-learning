<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
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
        return $service->store($request);
    }

    public function show(Request $request, AuthenticatedService $service)
    {
        return $service->details();
    }

    public function update(UpdateSelfRequest $request, AuthenticatedService $service)
    {
        return $service->update($request);
    }

    public function destroy(Request $request, AuthenticatedService $service)
    {
        return $service->logout();
    }

    public function upload(Request $request, AuthenticatedService $service)
    {
        return $service->upload($request);
    }

    public function video(Request $request, AuthenticatedService $service)
    {
        return $service->viewVideo($request);
    }

    public function updatePlayback(Request $request, ExplainerVideo $video, AuthenticatedService $service)
    {
        Gate::authorize('check-membership', [['individual']]);

        return $service->updatePlayback($request, $video);
    }

    public function changePassword(Request $request, AuthenticatedService $service)
    {
        $valid = $request->validate([
            'old_password' => ['required', 'string'],
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
