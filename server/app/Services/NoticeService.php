<?php

namespace App\Services;

use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Http\Resources\NoticeHomepageResource;
use App\Http\Resources\NoticeIndexResource;
use App\Http\Resources\NoticeShowResource;
use App\Models\Notice;

class NoticeService
{
    public function list()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        if (auth()->user()->isIndividual()) {
            return NoticeHomepageResource::collection(
                Notice::with('user')
                    ->where(fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)->orWhereNull('affiliation_id'))
                    ->where('shown_in_bulletin', true)
                    ->orderBy($sort, $order)
                    ->paginate($per_page)
            );
        }
        
        return NoticeIndexResource::collection(
            Notice::with('user')
                ->when(
                    auth()->user()->isCorporate(), 
                    fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
                )->orderBy($sort, $order)
                ->paginate($per_page)
        )->additional(['message' => 'Notices successfully fetched!']);
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
