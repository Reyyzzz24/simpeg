<?php

use App\Http\Controllers\PresenceController;
use App\Http\Controllers\TimeSettingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresentReportController;
use App\Http\Controllers\SalaryReportController;
use App\Http\Controllers\OvertimeReportController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PositionAllowanceController;
use App\Http\Controllers\SalaryComponentController;
use App\Http\Controllers\SalaryRuleController;
use App\Http\Controllers\UserPositionController;
use App\Http\Controllers\PayrollAdjustmentController;
use App\Http\Controllers\LemburController;
use App\Http\Controllers\AnnouncementController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/data', [DashboardController::class, 'data'])->name('dashboard.data');
    Route::get('/dashboard/calendar', [DashboardController::class, 'calendar'])->name('dashboard.calendar');

    // Grouping rute presence
    Route::prefix('presence')->name('presence.')->group(function () {
        Route::get('/', [PresenceController::class, 'index'])->name('index');
        Route::get('/self', [PresenceController::class, 'self'])->name('self');
        Route::get('/self/history', [PresenceController::class, 'selfHistory'])->name('self.history');
        Route::post('/self/face', [PresenceController::class, 'markFacePresence'])->name('self.face');
        Route::post('/self/face/register', [PresenceController::class, 'registerFace'])->name('self.face.register');
        Route::get('/self/teacher-checkout', [PresenceController::class, 'teacherCheckout'])->name('teacher-checkout');
        Route::post('/self/teacher-checkout', [PresenceController::class, 'storeTeacherCheckout'])->name('teacher-checkout.store');
        Route::put('/time-window', [TimeSettingController::class, 'update'])->name('time-window.update');
        Route::post('/store', [PresenceController::class, 'store'])->name('store');
        Route::post('/mark', [PresenceController::class, 'markPresence'])->name('mark');

        Route::get('/gate', [PresenceController::class, 'gate'])->name('gate');
        Route::get('/scan/{token}', [PresenceController::class, 'markPresence'])->name('scan');
        Route::get('/history-data', [PresenceController::class, 'getHistory'])->name('history-data');
        Route::put('/{presence}', [PresenceController::class, 'update'])->name('update');
    });

    Route::prefix('report')->name('report.')->group(function () {
        Route::redirect('/', '/report/presence')->name('index');
        Route::get('/presence', [PresentReportController::class, 'index'])->name('presence.index');
        Route::get('/salary', [SalaryReportController::class, 'index'])->name('salary.index');
        Route::get('/overtime', [OvertimeReportController::class, 'index'])->name('overtime.index');
    });

    Route::prefix('overtime')->name('overtime.')->group(function () {
        Route::get('/', [LemburController::class, 'index'])->name('index');
        Route::post('/', [LemburController::class, 'store'])->name('store');
        Route::put('/{lembur}', [LemburController::class, 'update'])->name('update');
        Route::delete('/{lembur}', [LemburController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('announcement')->name('announcement.')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index'])->name('index');
        Route::post('/', [AnnouncementController::class, 'store'])->name('store');
        Route::put('/{announcement}', [AnnouncementController::class, 'update'])->name('update');
        Route::delete('/{announcement}', [AnnouncementController::class, 'destroy'])->name('destroy');
    });

    // Grouping rute pegawai (employee)
    Route::prefix('employee')->name('employee.')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::post('/store', [EmployeeController::class, 'store'])->name('store');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
    });

    // Grouping rute guru (teacher)
    Route::prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');

        Route::post('/store', [TeacherController::class, 'store'])->name('store');
        Route::put('/{guru}', [TeacherController::class, 'update'])->name('update');
        Route::delete('/{guru}', [TeacherController::class, 'destroy'])->name('destroy');
    });

    // Grouping rute users
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/store', [UserController::class, 'store'])->name('store');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');

        Route::post('/generate', [PayrollController::class, 'generate'])->name('generate');
        Route::post('/generate-all', [PayrollController::class, 'generateAll'])->name('generateAll');

        Route::get('/{id}', [PayrollController::class, 'show'])->name('show');
        Route::delete('/{id}', [PayrollController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('payroll-adjustments')->name('adjustments.')->group(function () {
        Route::get('/{adjustment}', [PayrollAdjustmentController::class, 'show'])->name('show');
        Route::post('/bulk-store', [PayrollAdjustmentController::class, 'bulkStore'])->name('bulkStore');
        Route::post('/update', [PayrollAdjustmentController::class, 'update'])->name('update');
        Route::delete('/{id}', [PayrollAdjustmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('positions')->name('positions.')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::post('/', [PositionController::class, 'store'])->name('store');
        Route::put('/{position}', [PositionController::class, 'update'])->name('update');
        Route::delete('/{position}', [PositionController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('position-allowances')->name('position-allowances.')->group(function () {
        Route::get('/', [PositionAllowanceController::class, 'index'])->name('index');
        Route::post('/', [PositionAllowanceController::class, 'store'])->name('store');
        Route::put('/{positionAllowance}', [PositionAllowanceController::class, 'update'])->name('update');
        Route::delete('/{positionAllowance}', [PositionAllowanceController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('salary-components')->name('salary-components.')->group(function () {
        Route::get('/', [SalaryComponentController::class, 'index'])->name('index');
        Route::post('/', [SalaryComponentController::class, 'store'])->name('store');
        Route::put('/{salaryComponent}', [SalaryComponentController::class, 'update'])->name('update');
        Route::delete('/{salaryComponent}', [SalaryComponentController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('salary-rules')->name('salary-rules.')->group(function () {
        Route::get('/', [SalaryRuleController::class, 'index'])->name('index');
        Route::post('/', [SalaryRuleController::class, 'store'])->name('store');
        Route::put('/{salaryRule}', [SalaryRuleController::class, 'update'])->name('update');
        Route::delete('/{salaryRule}', [SalaryRuleController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('user-positions')->name('user-positions.')->group(function () {
        Route::get('/', [UserPositionController::class, 'index'])->name('index');
        Route::post('/', [UserPositionController::class, 'store'])->name('store');
        Route::put('/{userPosition}', [UserPositionController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserPositionController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
