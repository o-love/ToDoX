<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\BoardList;

class ListController extends Controller
{
    public function create(Request $request, Board $board)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list = new BoardList();
        $list->name = $validatedData['name'];
        $list->board()->associate($board);
        $list->save();

        return response()->json($list);
    }
}
