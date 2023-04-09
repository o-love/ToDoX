<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Label;
use App\Models\Task;

class LabelController extends Controller
{
    public function index()
    {
        $labels = Label::all();
        return response()->json($labels);
    }

    public function store(Request $request)
    {
        $label = new Label([
            'name' => $request->input('name'),
            'color' => $request->input('color') ?: '',
            'description' => $request->input('description'),
            // 'type' => $request->input('type') ?: '',
        ]);
        $label->save();

        return response()->json($label, 201);
    }

    public function show($boardId, $taskId, $labelId)
    {
        $label = Label::findOrFail($labelId);

        // return response()->json([
        //     'id' => $label->id,
        //     'name' => $label->name,
        //     'color' => $label->color,
        //     'description' => $label->description,
        //     'type' => $label->type,
        //     'typevalue' => $label->typevalue
        // ], 200);

        return response()->json($label, 200);
    }

    public function update(Request $request, $id)
    {
        $label = Label::findOrFail($id);
        $label->update($request->all());
        
        return response()->json($label, 200);

        // return response()->json(['label' => $label], 200);
        // return response()->json([
        //     'id' => $label->id,
        //     'name' => $label->name,
        //     'color' => $label->color,
        //     'description' => $label->description,
        //     'type' => $label->type,
        //     'typevalue' => $label->typevalue
        // ], 200);
    }

    public function destroy($id)
    {
        $label = Label::findOrFail($id);
        $label->delete();

        return response()->json(null, 204);
    }

    public function assignToTask(Request $request, $taskId)
    {
        // $task->labels()->sync($labelIds);
        $labelIds = $request->input('label_ids');

        // $task = Task::findOrFail($taskId);
        // $task->labels()->attach($label);

        $task = Task::findOrFail($taskId);

        foreach ($labelIds as $labelId) {
            $label = Label::findOrFail($labelId);
            $task->labels()->attach($label);
        }

        return response()->json($task->labels);
    }

    public function getTaskLabels($taskId)
    {
        // $labels = Label::whereHas('tasks', function ($query) use ($taskId) {
        //     $query->where('task_id', $taskId);
        // })->get();
        $task = Task::findOrFail($taskId);
        $labels = $task->labels()->get();
        return response()->json($labels);
    }
}
