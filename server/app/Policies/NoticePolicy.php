<?php

namespace App\Policies;

use App\Models\MembershipType;
use App\Models\Notice;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NoticePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Notice $notice)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Notice $notice)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Notice $notice)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }

    /**
     * Determine whether the user can mass delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  mixed  $ids
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function massDelete(User $user, mixed $ids)
    {
        return $user->membership_type_id === MembershipType::ADMIN;
    }
}
