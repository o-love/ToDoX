<?php

use App\Http\Controllers\TaskListController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;

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
Route::post('boards/createBoard', [BoardController::class, 'create']);
Route::post('boards/{board}', [BoardController::class, 'show'])->name('boards.show');

// List routes
Route::get('boards/{id}/lists', [TaskListController::class, 'index']);
Route::post('boards/{id}/lists', [TaskListController::class, 'store']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
