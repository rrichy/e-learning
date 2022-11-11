<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreUpdateRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function index(CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        return $service->list();
    }

    public function store(CategoryStoreUpdateRequest $request, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->store($request);

        return response()->json([
            'message' => 'Successfully created a category!',
        ]);
    }

    public function update(CategoryStoreUpdateRequest $request, Category $category, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->update($request, $category);

        return response()->json([
            'message' => 'Successfully updated a category!',
        ]);
    }

    public function massDelete(string $ids, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' categories!',
        ]);
    }

    public function duplicate(Category $category, CategoryService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $service->clone($category);

        return response()->json([
            'message' => 'Successfully copied ' . $category->title . ' categories!',
        ]);
    }
}
