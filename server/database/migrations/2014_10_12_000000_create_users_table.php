<?php

use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('image')->nullable();
            $table->string('password');
            $table->date('birthday');
            $table->tinyInteger('sex')->nullable();
            $table->string('remarks')->nullable();
            $table->rememberToken();
            $table->timestamp('last_login_date')->nullable();
            $table->timestamps();
        });

        User::factory()->create([
            'name' => 'Sample Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123'),
            'membership_type_id' => MembershipType::ADMIN,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
