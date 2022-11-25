<?php

namespace App\Services;

use App\Http\Requests\CategoryStoreUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function index(array $pagination, User $auth)
    {
        $order = $pagination['order'] ?? 'asc';
        $per_page = $pagination['per_page'] ?? 10;
        $sort = $pagination['sort'] ?? 'id';

        return CategoryResource::collection(
            Category::query()
            ->when(
                $auth->isCorporate(),
                fn ($q) => $q->where('affiliation_id', auth()->user()->affiliation_id)
            )->with([
                'childCategories' => function ($q) use ($sort, $order) { $q->orderBy($sort, $order)->get(); }
            ])->whereNull('parent_id')
            ->orderBy($sort, $order)
            ->paginate($per_page)
        )->additional([
            'message' => 'Categories successfully fetched!',
            'meta' => compact('order', 'sort'),
        ]);
    }


    public function update(array $valid, Category $category, User $auth)
    {
        DB::transaction(function () use ($valid, $category) {
            $category->update($valid);
            $child_categories = collect($valid['child_categories']);

            $child_category_ids = collect();
            $child_categories->each(function ($child) use ($category, &$child_category_ids) {
                $child_category = Category::updateOrCreate(array_merge($child, [
                    'parent_id' => $category->id,
                ]));

                $child_category_ids->push($child_category->id);
            });

            $category->childCategories()->whereNotIn('id', $child_category_ids)->delete();
        });
    }


    public function store(array $valid)
    {
        DB::transaction(function () use ($valid) {
            $category = Category::create($valid);
            $child_categories = collect($valid['child_categories']);

            $child_categories->each(function ($child) use ($category) {
                Category::create(array_merge($child, [
                    'parent_id' => $category->id,
                ]));
            });
        });
    }


    public function deleteIds(string $ids, User $auth)
    {
        $ids = explode(',', $ids);

        if ($auth->isAdmin()) return Category::destroy($ids);

        $validIdCount = Category::where('affiliation_id', $auth->affiliation_id)->whereIn('id', $ids)->count();
        abort_if(
            count($ids) !== $validIdCount,
            403,
            'You have no authority of deleting some of these categories'
        );

        return Category::destroy($ids);
    }


    public function clone(Category $category, User $auth)
    {
        $newCategory = $category->replicate();
        $newCategory['name'] = (function () use ($category) {
            $instance = 2;
            $name = $category['name'] . ' - Copy';
            while (Category::where('name', $name)->exists()) {
                $name = $category['name'] . ' - Copy (' . $instance++ . ')';
            }
            return $name;
        })();
        $newCategory['priority'] = (function () use ($category) {
            $counter = 1;
            do {
                $priority = $category->priority + $counter++;
            } while (Category::query()
                ->where('priority', $priority)
                ->when($category->parent_id, function ($q) use ($category) {
                    $q->where('parent_id', $category->parent_id);
                }, fn ($q) => $q->whereNull('parent_id'))
                ->exists()
            );
            return $priority;
        })();
        $newCategory->created_at = now();
        $newCategory->save();
    }
}
