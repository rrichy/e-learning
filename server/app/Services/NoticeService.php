<?php

namespace App\Services;

use App\Http\Requests\NoticeStoreUpdateRequest;
use App\Models\Notice;

class NoticeService
{
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
}
