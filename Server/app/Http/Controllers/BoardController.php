<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Board;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return BoardResource::collection(Board::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardRequest $request)
    {
        $board = Board::create($request->all());

        return new BoardResource($board);
    }

    // Returns a single Board by ID
    public function show($id)
    {
        return new BoardResource(Board::findOrFail($id));
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