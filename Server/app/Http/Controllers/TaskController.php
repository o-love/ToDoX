<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\TaskList;
use App\Models\Board;
use App\Models\Label;

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
    public function store(Request $request, $boardId, $taskListId)
    {
        \Log::info('Request received for creating task', [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'tasklist_id' => $taskListId,
            'state_id' => $request->input('state_id'),
            'selectedLabels' => $request->input('selectedLabels'),
            'due_date' => $request->input('start_date'),
            'start_date' => $request->input('due_date'),
        ]);

        $start_date = $this->convertDate($request->input('start_date'));
        $due_date = $this->convertDate($request->input('due_date'));

        /* Validate start and due dates */
        // If a due date is selected, a start date must be selected as well
        if ($due_date && !$start_date)
            return response()->json(['error' => 'Due date must be selected if start date is selected'], 400);
        // Check that the due date is greater than the start date
        if ($start_date && $due_date && $start_date > $due_date)
            return response()->json(['error' => 'Start date cannot be greater than due date'], 400);
        
        $task = new Task([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'tasklist_id' => $taskListId,
            'state_id' => $request->input('state_id'),
            'due_date' => $due_date,
            'start_date' => $start_date,
        ]);
        $task->save();

        $taskList = TaskList::findOrFail($taskListId);
        // $taskList->tasks()->save($task);

        $selectedLabels = $request->input('selectedLabels');
        foreach ($selectedLabels as $label)
            $task->labels()->attach($label['id']);

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

        $start_date = $request->input('start_date');
        $due_date = $request->input('due_date');

        // Validate the start and due dates
        $this->validateDates($start_date, $due_date);

        $task->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'list_id' => $taskList->id,
            'state_id' => $request->input('state_id'),
            'due_date' => $due_date,
            'start_date' => $start_date
        ]);

        return response()->json($task, 201);
    }

    // Remove the specified resource from storage
    public function destroy(TaskList $taskList, Task $task, Board $board)
    {
        $taskList = TaskList::findOrFail($taskList->id);
        $task = $taskList->tasks()->findOrFail($task->id);
        $task->delete();

        return response()->json(null, 204);
    }

    private function convertDate($date) {
        if ($date != null)
            return Carbon::parse($date)->setTimezone('Europe/Madrid')->format('Y-m-d');
        else return null;
    }
}
