<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\LabelController;

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

// Board routes
Route::get('boards', [BoardController::class, 'index']);
Route::post('boards', [BoardController::class, 'store'])->name('boards.store');
// Route::put('boards', [BoardController::class, 'update'])->name('boards.update');
// Route::delete('boards', [BoardController::class, 'destroy'])->name('boards.store');
Route::get('boards/{boardId}', [BoardController::class, 'show'])->name('boards.show');
Route::put('boards/{boardId}', [BoardController::class, 'update'])->name('boards.update');
Route::delete('boards/{boardId}', [BoardController::class, 'destroy'])->name('boards.destroy');

// Tasklist routes
Route::get('boards/{boardId}/lists', [TaskListController::class, 'index']);
Route::post('boards/{boardId}/lists', [TaskListController::class, 'store'])->name('tasklists.store');
// Route::put('boards/{boardId}/lists', [TaskListController::class, 'update'])->name('tasklists.update');
// Route::delete('boards/{boardId}/lists', [TaskListController::class, 'destroy'])->name('tasklists.destroy');
Route::get('boards/{boardId}/lists/{taskListId}', [TaskListController::class, 'show'])->name('tasklists.show'); // REV lists/{taskListId}
Route::put('boards/{boardId}/lists/{taskListId}', [TaskListController::class, 'update'])->name('tasklists.update'); // lists/{taskListId}
Route::delete('boards/{boardId}/lists/{taskListId}', [TaskListController::class, 'destroy'])->name('tasklists.destroy'); // lists/{taskListId}

// Task routes
Route::get('boards/{boardId}/lists/{taskListId}/tasks', [TaskController::class, 'index']); // REV lists/{taskListId}/tasks
Route::post('boards/{boardId}/lists/{taskListId}/tasks', [TaskController::class, 'store'])->name('tasks.store');
// Route::put('lists/{taskListId}/tasks', [TaskController::class, 'update'])->name('tasks.update');
// Route::delete('lists/{taskListId}/tasks', [TaskController::class, 'destroy'])->name('tasks.destroy');
Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'show'])->name('tasks.show');
Route::put('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'update'])->name('tasks.update');
Route::delete('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'destroy'])->name('tasks.destroy');

// State routes
Route::get('/boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'index']);
// Route::post('boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'store'])->name('states.store');
Route::get('/states/{stateId}/name', [StateController::class, 'getStateName']);
// Route::post('/states', 'StateController@show');

// Label routes
Route::get('labels', [LabelController::class, 'index']);
Route::post('labels', [LabelController::class, 'store'])->name('labels.store');
// Route::get('tasks/{taskId}/labels', [LabelController::class, 'show']); // Get label assigned to a task REV

// REV
// Route::group(['prefix' => 'boards/{boardId}/lists/{taskListId}'], function () {
//     Route::get('/states', [StateController::class, 'index']);
//     Route::post('/states', [StateController::class, 'store']);
// });

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
