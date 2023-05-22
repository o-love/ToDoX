<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Label;
use App\Models\Task;
use App\Models\TaskList;

class LabelController extends Controller
{
    public function index($boardId, $taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $labels = $taskList->labels()->get();
        // $labels = Label::all();
        return response()->json($labels);
    }

    public function store(Request $request, $boardId, $taskListId)
    {
        $label = new Label([
            'name' => $request->input('name'),
            'color' => $request->input('color') ?: '',
            'description' => $request->input('description'),
        ]);
        $label->save();

        $taskList = TaskList::findOrFail($taskListId);
        $taskList->labels()->attach($label);

        return response()->json($label, 201);
    }

    public function show($boardId, $taskId, $labelId)
    {
        $label = Label::findOrFail($labelId);
        return response()->json($label, 200);
    }

    public function update(Request $request, $labelId)
    {
        $label = Label::findOrFail($labelId);
        $label->name = $request->input('name');
        $label->color = $request->input('color');
        $label->description = $request->input('description');
        $label->save();
        
        return response()->json($label, 200);
    }

    public function destroy($labelId)
    {
        $label = Label::findOrFail($labelId);
        $label->delete();

        return response()->json(null, 204);
    }

    public function assignToTask(Request $request, $boardId, $taskListId, $taskId)
    {
        $labelIds = $request->input('label_ids');

        $task = Task::findOrFail($taskId);

        foreach ($labelIds as $labelId) {
            $label = Label::findOrFail($labelId);
            $task->labels()->attach($label);
        }

        return response()->json($task->labels);
    }

    public function deassignFromTask(Request $request, $boardId, $taskListId, $taskId)
    {
        $labelIds = $request->input('label_ids');
        $task = Task::findOrFail($taskId);

        foreach ($labelIds as $labelId) {
            $label = Label::findOrFail($labelId);
            $task->labels()->detach($label);
        }

        return response()->json($task->labels);
    }

    public function getTaskLabels($boardId, $taskListId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $labels = $task->labels()->get();
        return response()->json($labels);
    }
}
