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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('membership_type_id')
                ->nullable()
                ->default(MembershipType::TRIAL)
                ->constrained()
                ->nullOnDelete()
                ->cascadeOnUpdate();
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
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
