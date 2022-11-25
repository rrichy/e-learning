<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Collection;

class GeneralPolicy
{
    use HandlesAuthorization;

    
    // AccountPolicy --start--
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
        return $records->every(fn ($record) => $record['affiliation_id'] === $user->affiliation_id);
    }
    // AccountPolicy --end--

    
    // CoursePolicy --start--
    public function viewCourse(User $user, Course $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->category->affiliation_id)
            || $user->isIndividual();
    }

    public function updateCourse(User $user, Course $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->category->affiliation_id);
    }

    public function deleteCourse(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = Course::whereIn('id', $ids)
            ->with(['category' => fn ($cat) => $cat->select(['id', 'affiliation_id'])])
            ->get(['id', 'category_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record->category->affiliation_id === $user->affiliation_id);
    }

    public function massUpdateCourse(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = Course::whereIn('id', $ids)
            ->with(['category' => fn ($cat) => $cat->select(['id', 'affiliation_id'])])
            ->get(['id', 'category_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record->category->affiliation_id === $user->affiliation_id);
    }
    // CoursePolicy --end--
}
