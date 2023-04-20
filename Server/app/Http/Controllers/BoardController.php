<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Board;
use Illuminate\Support\Facades\Cache;

class BoardController extends Controller
{
    // Returns all boards
    public function index()
    {
        // $boards = Board::all();
        // $boards = Board::with('name')->get();
        $boards = Cache::remember('boards', 300, function() {
          return Board::all();  
        });
        return response()->json($boards);
    }

    // Creates a new board
    public function store(Request $request)
    {
        $board = Board::create([
            'name' => $request->name,
            'description' => $request->description
        ]);    

        return response()->json([
            'message' => 'Board created successfully',
            'board' => $board
        ], 201);
    }

    // Returns a single Board by ID
    public function show($id)
    {
        $board = Board::findOrFail($id);

        return response()->json($board);
    }

    // Updates an existing Board by ID
    public function update(Request $request, $id)
    {
        $board = Board::find($id);
        $board->name = $request->name;
        $board->description = $request->description;
        $board->save();
        return response()->json($board, 200);
    }

    // Deletes a Board by ID
    public function destroy($id)
    {
        Board::destroy($id);
        return response()->json(null, 204);
    }
}