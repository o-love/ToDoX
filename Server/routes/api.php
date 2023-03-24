<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskListController;

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
Route::post('boards', [BoardController::class, 'create'])->name('boards.create');
Route::get('boards/{id}', [BoardController::class, 'show'])->name('boards.show');

// List routes
Route::get('/boards/{board}/lists', [TaskListController::class, 'index']);
Route::post('/boards/{board}/lists', [TaskListController::class, 'create'])->name('lists.create');
Route::get('/boards/{boardId}/lists/{listId}', 'ListController@show')->name('lists.show');
// Route::put('/boards/{boardId}/lists/{listId}', 'ListController@update');
// Route::delete('/boards/{boardId}/lists/{listId}', 'ListController@destroy');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
