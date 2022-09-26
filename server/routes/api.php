<?php

use App\Http\Controllers\Admin\AffiliationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\SignatureController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/me', [AuthenticatedSessionController::class, 'show']);
    Route::get('/options', [OptionsController::class, 'index']);

    Route::group([
        'middleware' => ['membership:admin,corporate']
    ], function () {
        Route::resource('/affiliation', AffiliationController::class)->except([
            'create', 'edit', 'show'
        ]);
        Route::resource('/department', DepartmentController::class)->except([
            'create', 'edit', 'show'
        ]);

        Route::post('/category/{category}/duplicate', [CategoryController::class, 'duplicate']);
        Route::delete('/category/{ids}', [CategoryController::class, 'massDelete']);
        Route::resource('/category', CategoryController::class)->only(['index', 'store', 'update']);
        
        Route::delete('/signature/{ids}', [SignatureController::class, 'massDelete']);
        Route::resource('/signature', SignatureController::class)->only(['index', 'store', 'update']);

        Route::put('/course/mass', [CourseController::class, 'massUpdate']);
        Route::put('/course/toggle', [CourseController::class, 'toggleStatus']);
        Route::delete('/course/{ids}', [CourseController::class, 'massDelete']);
        Route::resource('/course', CourseController::class)->only([
            'index', 'store', 'show', 'update',
        ]);
    });

    // Route::group([
    //     'prefix' => 'admin',
    //     'middleware' => ['membership:admin'],
    // ], function () {
    // });
});

require __DIR__ . '/auth.php';
