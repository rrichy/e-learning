<?php

namespace App\Services;

use App\Http\Resources\InquiryListResource;
use App\Models\Inquiry;

class InquiryService
{
    public static function list(array $pagination = [])
    {
        return InquiryListResource::collection(
            Inquiry::query()
                ->leftJoin('users', 'users.id', '=', 'inquiries.user_id')
                ->select([
                    'inquiries.id',
                    'inquiries.content',
                    'inquiries.created_at',
                    'users.name',
                    'users.email',
                ])
                ->orderBy($pagination['sort'] ?? 'id', $pagination['order'] ?? 'desc')
                ->paginate($pagination['per_page'] ?? 10)
        )->additional([
            'message' => 'Inquiries successfully fetched!',
            'meta' => [
                'sort' => $pagination['sort'] ?? 'id', 
                'order' => $pagination['order'] ?? 'desc',
            ],
        ]);
    }


    // public function details(Model $model)
    // {
    // }


    // public function update(Request $request, Model $model)
    // {
    // }


    // public function store(Request $request)
    // {
    // }


    // public function deleteIds(string $ids)
    // {
    // }


    // public function updatePriorities(Request $request)
    // {
    // }


    // public function clone(Model $model)
    // {
    // }


    // public function updateStatus(Request $request)
    // {
    // }
}