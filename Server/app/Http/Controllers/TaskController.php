<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskList;
use App\Models\Task;
use App\Models\Board;

class TaskController extends Controller
{
    // Display a listing of the resource
    public function index($taskListId, $boardId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $task = $taskList->tasks()->get();

        return response()->json($task);        
    }

    // Store a newly created resource in storage
    public function store(Request $request, TaskList $taskList, Board $boardId)
    {
        $taskList = TaskList::findOrFail($taskList->id);
        $task = new Task([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'list_id' => $taskList->id,
            'state_id' => $request->input('state_id')
        ]);

        $task->save();

        return response()->json($task, 201);
    }

    // Display the specified resource
    public function show(TaskList $taskList, Task $task, Board $board)
    {
        $taskList = TaskList::findOrFail($taskList->id);
        $task = $taskList->tasks()->findOrFail($task->id);

        return response()->json($task);

    }

    // Update the specified resource in storage
    public function update(Request $request, TaskList $taskList, Task $task, Board $board)
    {
        $taskList = TaskList::findOrFail($taskList->id);
        $task = $taskList->tasks()->findOrFail($task->id);

        $task->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'list_id' => $taskList->id,
            'state_id' => $request->input('state_id')
        ]);

        return response()->json($task);
    }

    // Remove the specified resource from storage
    public function destroy(TaskList $taskList, Task $task, Board $board)
    {
        $taskList = TaskList::findOrFail($taskList->id);
        $task = $taskList->tasks()->findOrFail($task->id);

        $task->delete();

        return response()->json(null, 204);
    }
}
