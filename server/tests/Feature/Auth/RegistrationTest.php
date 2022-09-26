<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register()
    {
        $response = $this->post('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'sex' => 1,
            'birthday' => now()->subYears(18),
            'remarks' => 'Test remarks',
        ]);

        $response->assertJson(fn (AssertableJson $json) => 
            $json->has('message')
        );
    }
}
