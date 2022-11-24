<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreUpdateRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function index(Request $request, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,name,priority,start_period,end_period'
        ]);

        try {
            $categories = $service->index($valid, auth()->user());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $categories;
    }

    public function store(CategoryStoreUpdateRequest $request, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validated();

        $service->store($valid);

        return response()->json([
            'message' => 'Successfully created a category!',
        ]);
    }

    public function update(CategoryStoreUpdateRequest $request, Category $category, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validated();

        $service->update($valid, $category, auth()->user());

        return response()->json([
            'message' => 'Successfully updated a category!',
        ]);
    }

    public function massDelete(string $ids, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $deleted_count = $service->deleteIds($ids, auth()->user());

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' categories!',
        ]);
    }

    public function duplicate(Category $category, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->clone($category, auth()->user());

        return response()->json([
            'message' => 'Successfully copied ' . $category->title . ' categories!',
        ]);
    }
}
