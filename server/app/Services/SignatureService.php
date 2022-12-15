<?php

namespace App\Services;

use App\Http\Resources\SignatureIndexResource;
use App\Models\Signature;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class SignatureService
 * @package App\Services
 */
class SignatureService
{
    public function index(array $pagination)
    {
        $sort = $pagination['sort'] ?? 'id';
        $order = $pagination['order'] ?? 'desc';
        $per_page = $pagination['per_page'] ?? 10;

        return SignatureIndexResource::collection(
            Signature::orderBy($sort, $order)
                ->paginate($per_page)
        )->additional([
            'message' => 'Signatures successfully fetched!',
            'meta' => compact('sort', 'order'),
        ]);
    }


    public function store(array $valid)
    {
        $max = Signature::max('priority');

        return Signature::create($valid + [
            'priority' => $max + 1
        ]);
    }


    public function update(Signature $signature, array $valid)
    {
        return $signature->update($valid);
    }


    public function deleteIds(Collection $ids)
    {
        $count = DB::transaction(function () use ($ids) {
            $delete = Signature::destroy($ids);
            $signatures = Signature::orderBy('priority', 'asc')->get();

            $signatures->each(function ($signature, $index) {
                $signature->priority = $index + 1;
                $signature->save();
            });

            return $delete;
        });

        return $count;
    }
}
