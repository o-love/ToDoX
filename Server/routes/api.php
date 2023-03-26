<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;

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
Route::get('boards/{boardId}/lists/{listId}', [TaskListController::class, 'show'])->name('tasklists.show');
// Route::put('/boards/{boardId}/lists/{listId}', [TaskListController::class, 'update']);
// Route::delete('/boards/{boardId}/lists/{listId}', 'TaskListController@destroy');

// Task routes
Route::get('boards/{boardId}/lists/{listId}/tasks', [TaskController::class, 'index']);
Route::post('boards/{boardId}/lists/{listId}/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::get('boards/{boardId}/lists/{listId}/tasks/{taskId}', [TaskController::class, 'show'])->name('tasks.show');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
