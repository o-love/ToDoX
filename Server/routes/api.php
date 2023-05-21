<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\TaskCommentController;

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
Route::middleware(['auth:api'])->group(function () {
    Route::post('boards', [BoardController::class, 'store'])->name('boards.store');
});
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
Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'show']);
Route::put('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'update']);
Route::delete('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'destroy']);
Route::put('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/state',  [TaskController::class, 'changeState']);
Route::put('boards/{boardId}/lists/{taskListId}/tasks/{taskId}', [TaskController::class, 'move']);
// Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/state',  [TaskController::class, 'checkState']);

// Task comments routes
Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/comments', [TaskCommentController::class, 'index']);
Route::middleware('auth:api')->post('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/comments', [TaskCommentController::class, 'store'])->name('taskComment.store');
Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/comments/{taskCommentId}', [TaskCommentController::class, 'show'])->name('taskComment.show');
Route::put('/comments/{commentId}', [TaskCommentController::class, 'update'])->name('taskComment.update');
Route::delete('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/comments/{taskCommentId}', [TaskCommentController::class, 'destroy'])->name('taskComment.destroy');

// State routes
Route::get('boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'index']);
Route::post('boards/{boardId}/lists/{taskListId}/states', [StateController::class, 'store'])->name('states.store');
Route::get('boards/{boardId}/lists/{taskListId}/states/{stateId}', [StateController::class, 'show'])->name('states.show');
Route::put('states/{stateId}', [StateController::class, 'update'])->name('states.update');
Route::delete('states/{stateId}', [StateController::class, 'destroy'])->name('states.destroy');
Route::put('boards/{boardId}/lists/{taskListId}/assignStates', [StateController::class, 'assignToList'])->name('states.assignToList');
Route::put('boards/{boardId}/lists/{taskListId}/deassignStates', [StateController::class, 'deassignFromList'])->name('states.deassignFromList');
Route::get('states/{stateId}/name', [StateController::class, 'getStateName']);

// Label routes
Route::get('boards/{boardId}/lists/{taskListId}/labels', [LabelController::class, 'index']);
Route::post('boards/{boardId}/lists/{taskListId}/labels', [LabelController::class, 'store'])->name('labels.store');
Route::get('boards/{boardId}/lists/{taskListId}/labels/{labelId}', [LabelController::class, 'show'])->name('labels.show');
Route::put('labels/{labelId}', [LabelController::class, 'update'])->name('labels.update');
Route::delete('labels/{labelId}', [LabelController::class, 'destroy'])->name('labels.destroy');
Route::get('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/labels', [LabelController::class, 'getTaskLabels'])->name('labels.getTaskLabels');
Route::post('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/labels', [LabelController::class, 'assignToTask'])->name('labels.assignToTask');
Route::delete('boards/{boardId}/lists/{taskListId}/tasks/{taskId}/labels', [LabelController::class, 'deassignFromTask'])->name('labels.deassignFromTask');

// User routes
Route::apiResource('users', \App\Http\Controllers\UserController::class);

Route::post('login', [\App\Http\Controllers\AuthController::class, 'store']);

Route::middleware('auth:api')->get('myUser', [\App\Http\Controllers\ProfileController::class, 'index']);

Route::middleware('auth:api')->post('/myUser/updatepassword', [\App\Http\Controllers\ProfileController::class, 'updatePassword']);

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful

// Permissions
Route::get ('permissions/{boardUserId}', [PermissionController::class, 'getPermissionsForUser']);