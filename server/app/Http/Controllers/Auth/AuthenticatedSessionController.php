<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\UpdateSelfRequest;
use App\Models\ExplainerVideo;
use App\Services\AuthenticatedService;
use Illuminate\Http\Request;

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
        return $service->updatePlayback($request, $video);
    }
}
