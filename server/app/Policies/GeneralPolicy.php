<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Collection;

class GeneralPolicy
{
    use HandlesAuthorization;

    // AccountPolicy
    public function viewAccount(User $user, User $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id)
            || $user->id === $model->id;
    }

    public function updateAccount(User $user, User $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id)
            || $user->id === $model->id;
    }

    public function deleteAccount(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = User::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record === $user->affiliation_id);
    }
}
