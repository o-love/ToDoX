<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Board;

class BoardController extends Controller
{
    // Returns all boards
    public function index()
    {
        $boards = Board::all();
        return response()->json($boards);
    }

    // Creates a new board
    public function create(Request $request)
    {
        // Validates the request data
        $request->validate([
            'name' => 'required|unique:boards,name', //Name is required and must be unique
            'description' => 'nullable|string',
            // 'active' => 'boolean',
        ]);

        // Creates the Board
        $board = new Board();
        $board->name = $request->input('name');
        $board->description = $request->input('description');
        $board->active = true; // A new board is always active
        $board->save();

        // Add register to Board_user

        return response()->json(['message' => 'Board created successfully']);
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
        // Finds the Board to be updated
        $board = Board::findOrFail($id);

        // Validates the request data
        $request->validate([
            'name' => 'required|unique:boards,name,'.$id.',id,manager_id,'.$request->manager_id,
            'description' => 'nullable|string',
        ]);

        // Updates the Board
        $board->update($request->all());

        return response()->json($board);
    }

    // Deletes a Board by ID
    public function destroy($id)
    {
        $Board = Board::findOrFail($id);

        $Board->delete();

        return response()->json(['success' => true]);
    }
}