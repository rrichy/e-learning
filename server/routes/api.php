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
use App\Http\Controllers\AttendingCourseController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\Student\ChapterController;
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

/* 
TODO: how attending course is populated, updated
TODO: course management searching functionalities
TODO: fix double requests due to React18 strict mode
    known pages: [individual]: homepage, course, test, lecture
        [admin]: notice-management/{id}/edit,
    all: fetching logged in data

TODO: #2322 unnecessary option request on [admin] my-page
TODO: account-management/{id}/detail tables

TODO: comprehension test details ???
TODO: targets on notice and course info

TODO: supply only what is required on course/{id}?tabulated=true
TODO: account search: affiliation_id, department_1 and department_2 should have no options
 */

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::post('/upload', [AuthenticatedSessionController::class, 'upload']);
    Route::get('/me', [AuthenticatedSessionController::class, 'show']);
    Route::get('/upload', [AuthenticatedSessionController::class, 'upload']);
    Route::get('/video', [AuthenticatedSessionController::class, 'video']);
    Route::put('/me', [AuthenticatedSessionController::class, 'update']);
    Route::put('/video/{video}/update', [AuthenticatedSessionController::class, 'updatePlayback']);

    Route::get('/options', [OptionsController::class, 'index']);

    Route::prefix('/account')->group(function () {
        Route::post('/', [AccountController::class, 'store']);
        Route::get('/{account}', [AccountController::class, 'show']);
        Route::get('/', [AccountController::class, 'index']);
        Route::put('/{account}', [AccountController::class, 'update']);
        Route::delete('/{ids}', [AccountController::class, 'massDelete']);
    });

    Route::prefix('/affiliation')->group(function () {
        Route::post('/', [AffiliationController::class, 'store']);
        Route::get('/', [AffiliationController::class, 'index']);
        Route::put('/{affiliation}', [AffiliationController::class, 'update']);
        Route::delete('/{affiliation}', [AffiliationController::class, 'destroy']);
    });

    Route::prefix('/attending-course')->group(function () {
        Route::get('/', [AttendingCourseController::class, 'index']);
    });

    Route::prefix('/category')->group(function () {
        Route::post('/{category}/duplicate', [CategoryController::class, 'duplicate']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/', [CategoryController::class, 'index']);
        Route::put('/{category}', [CategoryController::class, 'update']);
        Route::delete('/{ids}', [CategoryController::class, 'massDelete']);
    });

    Route::prefix('/chapter')->group(function () {
        Route::post('/{chapter}/submit-test', [ChapterController::class, 'submitTest']);
        Route::get('/{chapter}/lecture', [ChapterController::class, 'listVideos']);
        Route::get('/{chapter}/proceed-test', [ChapterController::class, 'proceedTest']);
        Route::get('/{chapter}/test', [ChapterController::class, 'showTest']);
    });

    Route::prefix('/course')->group(function () {
        Route::post('/', [CourseController::class, 'store']);
        Route::get('/{course}/attendees', [CourseController::class, 'attendees']);
        Route::get('/{course}', [CourseController::class, 'show']);
        Route::get('/', [CourseController::class, 'index']);
        Route::put('/mass', [CourseController::class, 'massUpdate']);
        Route::put('/toggle', [CourseController::class, 'toggleStatus']);
        Route::put('/{course}', [CourseController::class, 'update']);
        Route::delete('/{ids}', [CourseController::class, 'massDelete']);
    });

    Route::prefix('/department')->group(function () {
        Route::post('/', [DepartmentController::class, 'store']);
        Route::get('/', [DepartmentController::class, 'index']);
        Route::put('/{department}', [DepartmentController::class, 'update']);
        Route::delete('/{department}', [DepartmentController::class, 'destroy']);
    });

    Route::prefix('/inquiry')->group(function () {
        Route::post('/', [InquiryController::class, 'store']);
        Route::get('/{inquiry}', [InquiryController::class, 'show']);
        Route::get('/', [InquiryController::class, 'index']);
    });

    Route::prefix('/mail-template')->group(function () {
        Route::post('/', [MailTemplateController::class, 'store']);
        Route::get('/', [MailTemplateController::class, 'index']);
        Route::put('/mass', [MailTemplateController::class, 'massUpdate']);
        Route::put('/{mail_template}', [MailTemplateController::class, 'update']);
        Route::delete('/{ids}', [MailTemplateController::class, 'massDelete']);
    });

    Route::prefix('/notice')->group(function () {
        Route::post('/', [NoticeController::class, 'store']);
        Route::get('/{notice}', [NoticeController::class, 'show']);
        Route::get('/', [NoticeController::class, 'index']);
        Route::put('/{notice}', [NoticeController::class, 'update']);
        Route::delete('/{ids}', [NoticeController::class, 'massDelete']);
    });

    Route::prefix('/signature')->group(function () {
        Route::post('/', [SignatureController::class, 'store']);
        Route::get('/', [SignatureController::class, 'index']);
        Route::put('/{signature}', [SignatureController::class, 'update']);
        Route::delete('/{ids}', [SignatureController::class, 'massDelete']);
    });
});

require __DIR__ . '/auth.php';
