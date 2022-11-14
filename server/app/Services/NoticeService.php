<?php

namespace App\Services;

use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Http\Resources\NoticeHomepageResource;
use App\Http\Resources\NoticeIndexResource;
use App\Http\Resources\NoticeShowResource;
use App\Models\Notice;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class NoticeService
{
    public function index(array $pagination, User $user)
    {
        $order = $pagination['order'] ?? 'asc';
        $per_page = $pagination['per_page'] ?? 10;
        $sort = $pagination['sort'] ?? 'id';

        if ($user->isIndividual()) {
            return NoticeHomepageResource::collection(
                Notice::with('user')
                    ->where(fn ($q) => $q->where('affiliation_id', $user->affiliation_id)->orWhereNull('affiliation_id'))
                    ->where('shown_in_bulletin', true)
                    ->orderBy($sort, $order)
                    ->paginate($per_page)
            );
        }

        return JsonResource::collection(
            Notice::query()
                ->select([
                    'notices.id',
                    'notices.subject',
                    'notices.priority',
                    'notices.date_publish_start as publish_start',
                    'notices.date_publish_end as publish_end',
                    'notices.shown_in_bulletin',
                    'notices.shown_in_mail',
                    'users.name as author',
                ])
                ->join('users', 'users.id', '=', 'notices.user_id')
                ->when(
                    $user->isCorporate(),
                    fn ($q) => $q->where('notices.affiliation_id', $user->affiliation_id)
                )->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional([
            'message' => 'Notices successfully fetched!',
            'meta' => compact('order', 'sort'),
        ]);
    }


    public function details(Notice $notice)
    {
        abort_if(
            !auth()->user()->isAdmin() && $notice->affiliation_id && auth()->user()->affiliation_id !== $notice->affiliation_id,
            403,
            "This action is unauthorized."
        );

        return new NoticeShowResource($notice);
    }


    public function store(NoticeStoreUpdateRequest $request)
    {
        $valid = $request->validated();

        $notice = Notice::create(array_merge(
            $valid,
            [
                'shown_in_bulletin' => in_array(1, $valid['posting_method']),
                'shown_in_mail' => in_array(2, $valid['posting_method']),
                'priority' => Notice::max('priority') + 1,
            ]
        ));

        // event(new NoticePost($notice));

        return $notice;
    }

    public function update(NoticeStoreUpdateRequest $request, Notice $notice)
    {
        abort_if(
            auth()->user()->isCorporate() && auth()->user()->affiliation_id !== $notice->affiliation_id,
            403,
            "This action is unauthorized."
        );

        $valid = $request->validated();

        $notice->update(array_merge(
            $valid,
            [
                'shown_in_bulletin' => in_array(1, $valid['posting_method']),
                'shown_in_mail' => in_array(2, $valid['posting_method']),
            ]
        ));

        // event(new NoticePost($notice));

        return $notice;
    }


    public function deleteIds(string $ids)
    {
        $auth = auth()->user();
        $ids = explode(',', $ids);

        if ($auth->isAdmin()) return Notice::destroy($ids);

        $validIdCount = Notice::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these notices'
        );

        return Notice::destroy($ids);
    }
}
