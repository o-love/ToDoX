<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\TaskList;

class TaskListController extends Controller
{
    // Returns all lists from a board
    public function index($boardId)
    {
        $board = Board::findOrFail($boardId);
        $taskLists = $board->taskLists()->get();

        return response()->json($taskLists);
    }

    // Creates a new list on a specific board
    public function store(Request $request, $boardId)
    {
        // \Log::info('Request received for creating task list', [
        //     'board_id' => $boardId,
        //     'list_name' => $request->input('name'),
        //     'list_description' => $request->input('description'),
        //     'board' => $boardId
        // ]);

        $list = new TaskList([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'board_id' => $boardId
        ]);
        $list->save();

        return response()->json($list);
    }

    // Returns a single Board by ID
    public function show($boardId, $listId)
    {
        $board = Board::findOrFail($boardId);
        $taskList = $board->taskLists()->findOrFail($listId);

        return response()->json($taskList);
    }

    // Updates an existing Board by ID
    public function update(Request $request, $boardId, $listId)
    {
        $board = Board::findOrFail($boardId);
        $taskList = $board->taskLists()->findOrFail($listId);

        $taskList->name = $request->input('nombre');
        $taskList->description = $request->input('descripcion');

        $taskList->save();

        return response()->json($taskList, 200);
    }

    // Deletes a Board by ID
    public function destroy($boardId, $listId)
    {
        $board = Board::findOrFail($boardId);
        $taskList = $board->taskLists()->findOrFail($listId);

        $taskList->delete();

        return response()->json(null, 204);
    }
}