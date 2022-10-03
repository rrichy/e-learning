<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreUpdateRequest;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    public function index(CategoryService $service)
    {
        return $service->list();
    }

    public function store(CategoryStoreUpdateRequest $request, CategoryService $service)
    {
        $service->store($request);

        return response()->json([
            'message' => 'Successfully created a category!',
        ]);
    }

    public function update(CategoryStoreUpdateRequest $request, Category $category, CategoryService $service)
    {
        $service->update($request, $category);

        return response()->json([
            'message' => 'Successfully updated a category!',
        ]);
    }

    public function massDelete(string $ids, CategoryService $service)
    {
        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' categories!',
        ]);
    }

    public function duplicate(Category $category, CategoryService $service)
    {
        $service->clone($category);

        return response()->json([
            'message' => 'Successfully copied ' . $category->title . ' categories!',
        ]);
    }
}
