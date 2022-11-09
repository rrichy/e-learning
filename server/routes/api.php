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

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::post('/upload', [AuthenticatedSessionController::class, 'upload']);
    Route::get('/me', [AuthenticatedSessionController::class, 'show']);
    Route::get('/upload', [AuthenticatedSessionController::class, 'upload']);
    Route::get('/video', [AuthenticatedSessionController::class, 'video']);
    Route::put('/me', [AuthenticatedSessionController::class, 'update']);
    Route::put('/video/{video}/update', [AuthenticatedSessionController::class, 'updatePlayback'])->middleware('membership:individual');

    Route::get('/options', [OptionsController::class, 'index']);

    Route::middleware('membership:admin,corporate,individual')->group(function () {

        Route::middleware('membership:admin,corporate')->group(function () {
            Route::prefix('/account')->group(function () {
                Route::post('/', [AccountController::class, 'store']);
                Route::get('/{account}', [AccountController::class, 'show']);
                Route::get('/', [AccountController::class, 'index']);
                Route::put('/{account}', [AccountController::class, 'update']);
                Route::delete('/{ids}', [AccountController::class, 'massDelete']);
            });

            Route::prefix('/department')->group(function () {
                Route::post('/', [DepartmentController::class, 'store']);
                Route::get('/', [DepartmentController::class, 'index']);
                Route::put('/{department}', [DepartmentController::class, 'update']);
                Route::delete('/{department}', [DepartmentController::class, 'destroy']);
            });

            Route::prefix('/category')->group(function () {
                Route::post('/{category}/duplicate', [CategoryController::class, 'duplicate']);
                Route::post('/', [CategoryController::class, 'store']);
                Route::get('/', [CategoryController::class, 'index']);
                Route::put('/{category}', [CategoryController::class, 'update']);
                Route::delete('/{ids}', [CategoryController::class, 'massDelete']);
            });

            Route::prefix('/mail-template')->group(function () {
                Route::post('/', [MailTemplateController::class, 'store']);
                Route::get('/', [MailTemplateController::class, 'index']);
                Route::put('/mass', [MailTemplateController::class, 'massUpdate']);
                Route::put('/{mail_template}', [MailTemplateController::class, 'update']);
                Route::delete('/{ids}', [MailTemplateController::class, 'massDelete']);
            });

            Route::prefix('/affiliation')->group(function () {
                Route::post('/', [AffiliationController::class, 'store'])->middleware('membership:admin');
                Route::get('/', [AffiliationController::class, 'index']);
                Route::put('/{affiliation}', [AffiliationController::class, 'update'])->middleware('membership:admin');
                Route::delete('/{affiliation}', [AffiliationController::class, 'destroy'])->middleware('membership:admin');
            });
        });

        Route::prefix('/course')->group(function () {
            Route::post('/', [CourseController::class, 'store'])->middleware('membership:admin,corporate');
            Route::get('/{course}/attendees', [CourseController::class, 'attendees'])->middleware('membership:admin,corporate');
            Route::get('/{course}', [CourseController::class, 'show']);
            Route::get('/', [CourseController::class, 'index']);
            Route::put('/mass', [CourseController::class, 'massUpdate'])->middleware('membership:admin,corporate');
            Route::put('/toggle', [CourseController::class, 'toggleStatus'])->middleware('membership:admin,corporate');
            Route::put('/{course}', [CourseController::class, 'update'])->middleware('membership:admin,corporate');
            Route::delete('/{ids}', [CourseController::class, 'massDelete'])->middleware('membership:admin,corporate');
        });

        Route::prefix('/notice')->group(function () {
            Route::post('/', [NoticeController::class, 'store'])->middleware('membership:admin,corporate');
            Route::get('/{notice}', [NoticeController::class, 'show']);
            Route::get('/', [NoticeController::class, 'index']);
            Route::put('/{notice}', [NoticeController::class, 'update'])->middleware('membership:admin,coporate');
            Route::delete('/{ids}', [NoticeController::class, 'massDelete'])->middleware('membership:admin,corporate');
        });

        Route::prefix('/inquiry')->group(function () {
            Route::post('/', [InquiryController::class, 'store'])->middleware('membership:corporate,individual');
            Route::get('/{inquiry}', [InquiryController::class, 'show'])->middleware('membership:admin,corporate');
            Route::get('/', [InquiryController::class, 'index'])->middleware('membership:admin,corporate');
        });

        Route::prefix('/chapter')->middleware('membership:individual')->group(function () {
            Route::post('/{chapter}/submit-test', [ChapterController::class, 'submitTest']);
            Route::get('/{chapter}/lecture', [ChapterController::class, 'listVideos']);
            Route::get('/{chapter}/proceed-test', [ChapterController::class, 'proceedTest']);
            Route::get('/{chapter}/test', [ChapterController::class, 'showTest']);
        });

        Route::prefix('/signature')->middleware('membership:admin')->group(function () {
            Route::post('/', [SignatureController::class, 'store']);
            Route::get('/', [SignatureController::class, 'index']);
            Route::put('/{signature}', [SignatureController::class, 'update']);
            Route::delete('/{ids}', [SignatureController::class, 'massDelete']);
        });

        Route::prefix('/attending-course')->middleware('membership:individual')->group(function () {
            Route::get('/', [AttendingCourseController::class, 'index']);
        });
    });
});

require __DIR__ . '/auth.php';
