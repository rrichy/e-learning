<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdminCorporate\AffiliationController;
use App\Http\Controllers\AdminCorporate\CategoryController;
use App\Http\Controllers\AdminCorporate\DepartmentController;
use App\Http\Controllers\AdminCorporate\CourseController;
use App\Http\Controllers\AdminCorporate\MailTemplateController;
use App\Http\Controllers\AdminCorporate\NoticeController;
use App\Http\Controllers\AdminCorporate\OptionsController;
use App\Http\Controllers\AdminCorporate\SignatureController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
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
    Route::put('/me', [AuthenticatedSessionController::class, 'update']);
    Route::get('/options', [OptionsController::class, 'index']);

    Route::group([
        'middleware' => ['membership:admin,corporate']
    ], function () {
        Route::get('/affiliation', [AffiliationController::class, 'index']);

        Route::delete('/account/{ids}', [AccountController::class, 'massDelete']);
        Route::resource('/account', AccountController::class)->except(['create', 'edit', 'destroy']);

        Route::resource('/department', DepartmentController::class)->except([
            'create', 'edit', 'show'
        ]);

        Route::post('/category/{category}/duplicate', [CategoryController::class, 'duplicate']);
        Route::delete('/category/{ids}', [CategoryController::class, 'massDelete']);
        Route::resource('/category', CategoryController::class)->only(['index', 'store', 'update']);

        Route::put('/mail-template/mass', [MailTemplateController::class, 'massUpdate']);
        Route::delete('/mail-template/{ids}', [MailTemplateController::class, 'massDelete']);
        Route::resource('/mail-template', MailTemplateController::class)->only(['index', 'store', 'update']);

        Route::put('/course/mass', [CourseController::class, 'massUpdate']);
        Route::put('/course/toggle', [CourseController::class, 'toggleStatus']);
        Route::delete('/course/{ids}', [CourseController::class, 'massDelete']);
        Route::resource('/course', CourseController::class)->only([
            'index', 'store', 'show', 'update',
        ]);

        Route::delete('/notice/{ids}', [NoticeController::class, 'massDelete']);
        Route::resource('/notice', NoticeController::class)->only(['index', 'store', 'show', 'update']);
    });

    Route::group(['middleware' => ['membership:admin']], function () {
        Route::resource('/affiliation', AffiliationController::class)->only(['store', 'update', 'destroy']);

        Route::delete('/signature/{ids}', [SignatureController::class, 'massDelete']);
        Route::resource('/signature', SignatureController::class)->only(['index', 'store', 'update']);
    });
});

require __DIR__ . '/auth.php';
