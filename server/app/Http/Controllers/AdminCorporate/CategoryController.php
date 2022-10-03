<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $order = request()->input('order', 'asc');
        $per_page = request()->input('per_page', '10');
        $sort = request()->input('sort', 'id');

        return CategoryResource::collection(Category::with(['childCategories' => function ($q) use ($sort, $order) {
            $q->orderBy($sort, $order)->get();
        }])->whereNull('parent_id')->orderBy($sort, $order)->paginate($per_page))->additional(['message' => 'Categories successfully fetched!']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'priority' => ['required', 'numeric', 'min:1', Rule::unique('categories')->where(fn ($q) => $q->whereNull('parent_id'))],
            'start_period' => 'required|date',
            'end_period' => 'required|date|after:start_period',
            'child_categories' => 'present|array',
            'child_categories.*.name' => 'required|string|distinct',
            'child_categories.*.priority' => 'required|numeric|min:1|distinct',
        ]);

        DB::transaction(function () use ($valid) {
            $category = Category::create(array_merge(
                $valid,
                [
                    'start_period' => Carbon::parse($valid['start_period'])->toDateString(),
                    'end_period' => Carbon::parse($valid['end_period'])->toDateString(),
                ]
            ));
            $child_categories = collect($valid['child_categories']);

            $child_categories->each(function ($child) use ($category) {
                Category::create(array_merge($child, [
                    'parent_id' => $category->id,
                ]));
            });
        });

        return response()->json([
            'message' => 'Successfully created a category!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, \App\Models\Category $category)
    {
        $valid = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id,
            'priority' => ['required', 'numeric', 'min:1', Rule::unique('categories')->where(fn ($q) => $q->whereNull('parent_id'))->ignore($category->id)],
            'start_period' => 'required|date',
            'end_period' => 'required|date|after:start_period',
            'child_categories' => 'present|array',
            'child_categories.*.name' => 'required|string|distinct',
            'child_categories.*.priority' => 'required|numeric|min:1|distinct',
        ]);

        DB::transaction(function () use ($valid, $category) {
            $category->update(array_merge(
                $valid,
                [
                    'start_period' => Carbon::parse($valid['start_period'])->toDateString(),
                    'end_period' => Carbon::parse($valid['end_period'])->toDateString(),
                ]
            ));
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

        return response()->json([
            'message' => 'Successfully updated a department!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $ids
     * @return \Illuminate\Http\Response
     */
    public function massDelete($ids)
    {
        $ids = explode(",", $ids);
        $deleted_count = \App\Models\Category::destroy($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' categories!',
        ]);
    }

    /**
     * Duplicate the specified resource.
     * 
     * @param  \App\Models\Category
     * @return \Illuminate\Http\Response
     */
    public function duplicate(Category $category)
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

        return response()->json([
            'message' => 'Successfully copied ' . $category->title . ' categories!',
        ]);
    }
}
