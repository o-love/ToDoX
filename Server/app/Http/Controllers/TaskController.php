<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskList;
use App\Models\Board;

class TaskController extends Controller
{
    // Display a listing of the resource
    public function index($boardId, $taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $task = Task::where('tasklist_id', $taskListId)->get();

        return response()->json($task);        
    }

    // Store a newly created resource in storage
    public function store(Request $request, $taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $task = new Task([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'taskList_id' => $taskListId,
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
