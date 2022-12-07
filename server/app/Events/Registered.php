<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;

class Registered
{
    use SerializesModels;

    public $user;
    public $mail;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user, $mail = null)
    {
        $this->user = $user;
        $this->mail = $mail;
    }
}
