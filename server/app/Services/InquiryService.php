<?php

namespace App\Services;

use App\Http\Resources\InquiryListResource;
use App\Http\Resources\InquiryShowResource;
use App\Models\Inquiry;
use App\Models\User;

class InquiryService
{
    public static function index(array $pagination = [])
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


    public function show(Inquiry $inquiry)
    {
        return new InquiryShowResource(
            $inquiry->load([
                'user' => fn ($q) => $q->select('id', 'name', 'email')
            ])
        );
    }


    // public function update(Request $request, Model $model)
    // {
    // }


    public function store(string $content, User $auth)
    {
        $inquiry = Inquiry::create([
            'content' => $content,
            'user_id' => $auth->id,
        ]);

        return $inquiry;
    }


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