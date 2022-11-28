<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\Course;
use App\Models\Department;
use App\Models\MailTemplate;
use App\Models\Notice;
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


    // MailTemplatePolicy --start--
    public function updateMailTemplate(User $user, MailTemplate $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id);
    }

    public function deleteMailTemplate(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = MailTemplate::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record->affiliation_id === $user->affiliation_id);
    }

    public function massUpdateMailTemplate(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = MailTemplate::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record->affiliation_id === $user->affiliation_id);
    }
    // MailTemplatePolicy --end--


    // CategoryPolicy --start--
    public function updateCategory(User $user, Category $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id);
    }

    public function deleteCategory(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = Category::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record['affiliation_id'] === $user->affiliation_id);
    }
    // CategoryPolicy --end--


    // DepartmentPolicy --start--
    public function updateDepartment(User $user, Department $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id);
    }

    public function deleteDepartment(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = Department::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record['affiliation_id'] === $user->affiliation_id);
    }
    // DepartmentPolicy --end--


    // NoticePolicy --start--
    public function viewNotice(User $user, Notice $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id);
    }

    public function updateNotice(User $user, Notice $model)
    {
        return $user->isAdmin()
            || ($user->isCorporate() && $user->affiliation_id === $model->affiliation_id);
    }

    public function deleteNotice(User $user, Collection $ids)
    {
        // check if all ids exist
        $records = Notice::whereIn('id', $ids)->get(['id', 'affiliation_id']);
        if (!$ids->every(fn ($id) => $records->contains('id', $id))) {
            return false;
        }

        if ($user->isAdmin()) return true;

        // for corporate
        return $records->every(fn ($record) => $record['affiliation_id'] === $user->affiliation_id);
    }
    // NoticePolicy --end--
}
