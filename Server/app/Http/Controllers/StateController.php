<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\State;

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
        $state = State::find($id);

        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }

        return response()->json(['state' => $state], 200);
    }

    public function update(Request $request, $id)
    {
        $state = State::find($id);

        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'color' => 'required|max:255',
        ]);

        $state->name = $validatedData['name'];
        $state->color = $validatedData['color'];
        $state->save();

        return response()->json(['state' => $state], 200);
    }

    public function destroy($id)
    {
        $state = State::find($id);

        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }

        $state->delete();

        return response()->json(['message' => 'State deleted successfully'], 200);
    }
}
