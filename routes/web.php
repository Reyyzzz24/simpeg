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
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserPermissionController;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->middleware('permission:dashboard.view')->name('dashboard');
    Route::get('dashboard/data', [DashboardController::class, 'data'])->middleware('permission:dashboard.view')->name('dashboard.data');
    Route::get('/dashboard/calendar', [DashboardController::class, 'calendar'])->middleware('permission:dashboard.view')->name('dashboard.calendar');

    // Grouping rute presence
    Route::prefix('presence')->name('presence.')->group(function () {
        Route::get('/', [PresenceController::class, 'index'])->middleware('permission:presence.view')->name('index');
        Route::get('/self', [PresenceController::class, 'self'])->name('self');
        Route::get('/self/history', [PresenceController::class, 'selfHistory'])->name('self.history');
        Route::post('/self/face', [PresenceController::class, 'markFacePresence'])->name('self.face');
        Route::post('/self/face/register', [PresenceController::class, 'registerFace'])->name('self.face.register');
        Route::get('/self/teacher-checkout', [PresenceController::class, 'teacherCheckout'])->name('teacher-checkout');
        Route::post('/self/teacher-checkout', [PresenceController::class, 'storeTeacherCheckout'])->name('teacher-checkout.store');
        Route::put('/time-window', [TimeSettingController::class, 'update'])->middleware('permission:time-settings.edit')->name('time-window.update');
        Route::post('/store', [PresenceController::class, 'store'])->middleware('permission:presence.create')->name('store');
        Route::post('/mark', [PresenceController::class, 'markPresence'])->middleware('permission:presence.create')->name('mark');

        Route::get('/gate', [PresenceController::class, 'gate'])->name('gate');
        Route::get('/scan/{token}', [PresenceController::class, 'markPresence'])->name('scan');
        Route::get('/history-data', [PresenceController::class, 'getHistory'])->name('history-data');
        Route::put('/{presence}', [PresenceController::class, 'update'])->middleware('permission:presence.edit')->name('update');
    });

    Route::prefix('report')->name('report.')->group(function () {
        Route::redirect('/', '/report/presence')->name('index');
        Route::get('/presence', [PresentReportController::class, 'index'])->middleware('permission:reports.view')->name('presence.index');
        Route::get('/salary', [SalaryReportController::class, 'index'])->middleware('permission:reports.view')->name('salary.index');
        Route::get('/overtime', [OvertimeReportController::class, 'index'])->middleware('permission:reports.view')->name('overtime.index');
    });

    Route::prefix('overtime')->name('overtime.')->group(function () {
        Route::get('/', [LemburController::class, 'index'])->middleware('permission:overtime.view')->name('index');
        Route::post('/', [LemburController::class, 'store'])->middleware('permission:overtime.create')->name('store');
        Route::put('/{lembur}', [LemburController::class, 'update'])->middleware('permission:overtime.edit')->name('update');
        Route::delete('/{lembur}', [LemburController::class, 'destroy'])->middleware('permission:overtime.delete')->name('destroy');
    });

    Route::prefix('announcement')->name('announcement.')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index'])->middleware('permission:announcements.view')->name('index');
        Route::post('/', [AnnouncementController::class, 'store'])->middleware('permission:announcements.create')->name('store');
        Route::put('/{announcement}', [AnnouncementController::class, 'update'])->middleware('permission:announcements.edit')->name('update');
        Route::delete('/{announcement}', [AnnouncementController::class, 'destroy'])->middleware('permission:announcements.delete')->name('destroy');
    });

    // Grouping rute pegawai (employee)
    Route::prefix('employee')->name('employee.')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->middleware('permission:employees.view')->name('index');
        Route::post('/store', [EmployeeController::class, 'store'])->middleware('permission:employees.create')->name('store');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employees.edit')->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employees.delete')->name('destroy');
    });

    // Grouping rute guru (teacher)
    Route::prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->middleware('permission:teachers.view')->name('index');

        Route::post('/store', [TeacherController::class, 'store'])->middleware('permission:teachers.create')->name('store');
        Route::put('/{guru}', [TeacherController::class, 'update'])->middleware('permission:teachers.edit')->name('update');
        Route::delete('/{guru}', [TeacherController::class, 'destroy'])->middleware('permission:teachers.delete')->name('destroy');
    });

    // Grouping rute users
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->middleware('permission:users.view')->name('index');
        Route::post('/store', [UserController::class, 'store'])->middleware('permission:users.create')->name('store');
        Route::put('/{user}', [UserController::class, 'update'])->middleware('permission:users.edit')->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('destroy');
    });

    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->middleware('permission:payroll.view')->name('index');

        Route::post('/generate/{user}', [PayrollController::class, 'generate'])->middleware('permission:payroll.create')->name('generate');
        Route::post('/generate-all', [PayrollController::class, 'generateAll'])->middleware('permission:payroll.create')->name('generateAll');

        Route::get('/{id}', [PayrollController::class, 'show'])->middleware('permission:payroll.view')->name('show');
        Route::delete('/{id}', [PayrollController::class, 'destroy'])->middleware('permission:payroll.delete')->name('destroy');
    });

    Route::prefix('payroll-adjustments')->name('adjustments.')->group(function () {
        Route::get('/{adjustment}', [PayrollAdjustmentController::class, 'show'])->name('show');
        Route::post('/bulk-store', [PayrollAdjustmentController::class, 'bulkStore'])->name('bulkStore');
        Route::post('/update', [PayrollAdjustmentController::class, 'update'])->name('update');
        Route::delete('/{id}', [PayrollAdjustmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('positions')->name('positions.')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->middleware('permission:positions.view')->name('index');
        Route::post('/', [PositionController::class, 'store'])->middleware('permission:positions.create')->name('store');
        Route::put('/{position}', [PositionController::class, 'update'])->middleware('permission:positions.edit')->name('update');
        Route::delete('/{position}', [PositionController::class, 'destroy'])->middleware('permission:positions.delete')->name('destroy');
    });
    Route::prefix('position-allowances')->name('position-allowances.')->group(function () {
        Route::get('/', [PositionAllowanceController::class, 'index'])->name('index');
        Route::post('/', [PositionAllowanceController::class, 'store'])->name('store');
        Route::put('/{positionAllowance}', [PositionAllowanceController::class, 'update'])->name('update');
        Route::delete('/{positionAllowance}', [PositionAllowanceController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('salary-components')->name('salary-components.')->group(function () {
        Route::get('/', [SalaryComponentController::class, 'index'])->middleware('permission:salary-components.view')->name('index');
        Route::post('/', [SalaryComponentController::class, 'store'])->middleware('permission:salary-components.create')->name('store');
        Route::put('/{salaryComponent}', [SalaryComponentController::class, 'update'])->middleware('permission:salary-components.edit')->name('update');
        Route::delete('/{salaryComponent}', [SalaryComponentController::class, 'destroy'])->middleware('permission:salary-components.delete')->name('destroy');
    });
    Route::prefix('salary-rules')->name('salary-rules.')->group(function () {
        Route::get('/', [SalaryRuleController::class, 'index'])->middleware('permission:salary-rules.view')->name('index');
        Route::post('/', [SalaryRuleController::class, 'store'])->middleware('permission:salary-rules.create')->name('store');
        Route::put('/{salaryRule}', [SalaryRuleController::class, 'update'])->middleware('permission:salary-rules.edit')->name('update');
        Route::delete('/{salaryRule}', [SalaryRuleController::class, 'destroy'])->middleware('permission:salary-rules.delete')->name('destroy');
    });

    // Grouping rute role management
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->middleware('permission:roles.view')->name('index');
        Route::post('/store', [RoleController::class, 'store'])->middleware('permission:roles.create')->name('store');
        Route::put('/{role}', [RoleController::class, 'update'])->middleware('permission:roles.edit')->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.delete')->name('destroy');
    });

    Route::prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->middleware('permission:permissions.view')->name('index');
        Route::post('/store', [PermissionController::class, 'store'])->middleware('permission:permissions.create')->name('store');
        Route::put('/{permission}', [PermissionController::class, 'update'])->middleware('permission:permissions.edit')->name('update');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:permissions.delete')->name('destroy');
    });

    Route::prefix('user-permissions')->name('user-permissions.')->group(function () {
        Route::get('/', [UserPermissionController::class, 'index'])->middleware('permission:permissions.view')->name('index');
        Route::post('/store', [UserPermissionController::class, 'store'])->middleware('permission:permissions.create')->name('store');
        Route::put('/{userPermission}', [UserPermissionController::class, 'update'])->middleware('permission:permissions.edit')->name('update');
        Route::delete('/{userPermission}', [UserPermissionController::class, 'destroy'])->middleware('permission:permissions.delete')->name('destroy');
    });
    Route::prefix('user-positions')->name('user-positions.')->group(function () {
        Route::get('/', [UserPositionController::class, 'index'])->name('index');
        Route::post('/', [UserPositionController::class, 'store'])->name('store');
        Route::put('/{userPosition}', [UserPositionController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserPositionController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
