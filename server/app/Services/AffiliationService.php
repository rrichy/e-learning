<?php

namespace App\Services;

use App\Http\Resources\AffiliationResource;
use App\Models\Affiliation;
use Illuminate\Support\Collection;

/**
 * Class AffiliationService
 * @package App\Services
 */
class AffiliationService
{
    public function list(array $pagination, mixed $affiliation_id)
    {
        $order = $pagination['order'] ?? 'asc';
        $per_page = $pagination['per_page'] ?? 10;
        $sort = $pagination['sort'] ?? 'id';

        return AffiliationResource::collection(
            Affiliation::orderBy($sort, $order)
                ->when(
                    $affiliation_id,
                    fn ($q) => $q->where('id', $affiliation_id)
                )->paginate($per_page)
        )->additional([
            'message' => 'Affiliations successfully fetched!',
            'meta' => compact('order', 'sort'),
        ]);
    }

    public function store(array $valid)
    {
        $affiliation = Affiliation::create($valid);

        return $affiliation;
    }

    public function update(array $valid, Affiliation $affiliation)
    {
        $affiliation->update($valid);

        return $affiliation;
    }

    public function deleteIds(Collection $ids)
    {
        return Affiliation::destroy($ids);
    }
}
