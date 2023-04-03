<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\State;
use App\Models\TaskList;

class StateController extends Controller
{
    public function index($boardId, $taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $states = $taskList->states()->get();
        return response()->json($states);
    }

    public function store(Request $request, $boardId, $taskListId)
    {
        $state = new State([
            'name' => $request->input('name'),
        ]);

        $taskList = TaskList::findOrFail($taskListId);
        $taskList->states()->attach($state);

        return response()->json($state, 201);
    }

    public function show($boardId, $taskListId, $stateId)
    {
        $state = State::findOrFail($stateId);

        return response()->json($state, 200);
    }

    public function update(Request $request, $id)
    {
        $state = State::findOrFail($id);
        $state->name = $request->input('name');
        $state->save();

        return response()->json(['state' => $state], 200);
    }

    public function destroy($id)
    {
        $state = State::findOrFail($id);
        $state->delete();

        return response()->json(null, 204);
    }

    public function assignToList(Request $request, $listId)
    {
        $stateIds = $request->input('state_ids');

        $list = TaskList::findOrFail($listId);

        foreach ($stateIds as $stateId) {
            $state = State::findOrFail($stateId);
            $list->states()->attach($state);
        }

        return response()->json($list->states);
    }

    public function getStateName($stateId)
    {
        $state = State::findOrFail($stateId);
        return response()->json($state);
    }
}
