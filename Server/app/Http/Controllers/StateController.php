<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\State;
use App\Models\TaskList;

class StateController extends Controller
{
    public function index()
    {
        $states = State::all();

        return response()->json($states, 200);
    }

    public function store(Request $request)
    {
        $state = new State;
        $state->name = $request->input('name');
        $state->save();

        return response()->json($state);
    }

    public function show($id)
    {
        $state = State::findOrFail($id);

        return response()->json(['state' => $state], 200);
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
}
