<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'sex' => ['required', 'numeric', 'in:1,2'],
            'birthday' => ['required', 'date', 'before:today'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // 'department_1' => ['nullable', 'numeric'],
            // 'department_2' => ['nullable', 'numeric'],
            // 'remarks' => ['nullable', 'string'],
        ]);

        $parsed = array_merge($valid, [
            'password' => Hash::make($request->password),
            'birthday' => Carbon::create($request->birthday),
        ]);

        $user = User::create($parsed);

        // ignore but do not comment out
        event(new Registered($user));

        return response()->json([
            'message' => 'Successfully registered a new student!'
        ]);
    }
}
