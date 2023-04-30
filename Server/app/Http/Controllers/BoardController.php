<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Board;
use Symfony\Component\HttpFoundation\Response;

class BoardController extends Controller
{
    // Returns all boards
    public function index()
    {
        // $mc = microtime(true);
        $boards = Board::all(); 
        // dump(gettype($boards));
        // $boards = Board::with('name')->get();
        // $boards = Board::select('id', 'name')->get();
        // dump(microtime(true) - $mc);
        // die();
        return new JsonResponse($boards, Response::HTTP_OK);
        // return new JsonResponse([], Response::HTTP_OK);
        // return response()->json([]);
    }

    // Creates a new board
    public function store(Request $request)
    {
        $board = Board::create($request->all());
        return new JsonResponse($board, Response::HTTP_OK);
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
        $board = Board::findOrFail($id);
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