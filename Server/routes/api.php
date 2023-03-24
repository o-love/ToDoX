<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;

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
Route::get('boards/{id}', [BoardController::class, 'show'])->name('boards.show');

// List routes
Route::post('/boards/{board}/lists', [ListController::class, 'index']);
Route::post('/boards/{board}/lists/createList', [ListController::class, 'create'])->name('lists.create');


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::resource('boards', BoardController::class); // Boards resource routes - resftful
// Route::resource('boards.lists', BoardListController::class)->shallow(); // Lists resource routes - resftful
