<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StateController;

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
Route::get('boards/{boardId}', [BoardController::class, 'show'])->name('boards.show');

// List routes
Route::get('boards/{boardId}/lists', [TaskListController::class, 'index']);
Route::post('boards/{boardId}/lists', [TaskListController::class, 'store'])->name('tasklists.store');
Route::get('boards/{boardId}/lists/{taskListId}', [TaskListController::class, 'show'])->name('tasklists.show');
// Route::put('/boards/{boardId}/lists/{taskListId}', [TaskListController::class, 'update']);
// Route::delete('/boards/{boardId}/lists/{taskListId}', 'TaskListController@destroy');

// Task routes
Route::get('boards/{boardId}/lists/{taskListId}/tasks', [TaskController::class, 'index']);
Route::post('boards/{boardId}/lists/{taskListId}/tasks', [TaskController::class, 'store'])->name('tasks.store');
// Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'show'])->name('tasks.show');
// Route::put('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'update'])->name('tasks.update');
// Route::delete('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'destroy'])->name('tasks.destroy');

// State routes
Route::get('/boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'index']);
Route::post('boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'store'])->name('states.store');
// Route::post('/states', 'StateController@show');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
