<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\TaskList;

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
        // \Log::info('Request received for creating task', [
        //     'name' => $request->input('name'),
        //     'description' => $request->input('description'),
        //     'tasklist_id' => $taskListId,
        //     'state_id' => $request->input('state_id'),
        //     'selectedLabels' => $request->input('selectedLabels'),
        //     'due_date' => $request->input('start_date'),
        //     'start_date' => $request->input('due_date'),
        // ]);

        $start_date = $this->convertDate($request->input('start_date'));
        $due_date = $this->convertDate($request->input('due_date'));
        [$start_date, $due_date] = $this->validateDates($start_date, $due_date);

        $task = new Task([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'tasklist_id' => $taskListId,
            'state_id' => $request->input('state_id'),
            'due_date' => $due_date,
            'start_date' => $start_date,
            'state_position' => $request->input('state_position'),
        ]);
        $task->save();

        // TODO: Unknown column 'task_list_id' - even forcing tasklist_id, ask a teac
        // $taskList = TaskList::findOrFail($taskListId);
        // $taskList->tasks()->save($task);

        $selectedLabels = $request->input('selectedLabels');
        foreach ($selectedLabels as $label)
            $task->labels()->attach($label['id']);

        return response()->json($task, 201);
    }

    // Display the specified resource
    public function show($boardId, $tasklistId, $taskId)
    {
        // $taskList = TaskList::findOrFail($tasklistId);
        // $task = Task::with(['taskList', 'state', 'labels', 'comments.user'])->findOrFail($task->id);
        // $task = $taskList->tasks()->findOrFail($taskId);
        $task = Task::findOrFail($taskId);

        return response()->json($task);
    }

    // Update the specified resource in storage
    public function update(Request $request, $boardId, $tasklistId, $taskId)
    {
        // \Log::info('Request received for editing task', [
        //     'task_id' => $taskId,
        // ]);

        // $taskList = TaskList::findOrFail($taskList->id);
        // $task = $taskList->tasks()->findOrFail($task->id);

        $task = Task::findOrFail($taskId);

        $start_date = $this->convertDate($request->input('start_date'));
        $due_date = $this->convertDate($request->input('due_date'));
        [$start_date, $due_date] = $this->validateDates($start_date, $due_date);

        $task->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'state_id' => $request->input('state_id'),
            'due_date' => $due_date,
            'start_date' => $start_date,
            'state_position' => $request->input('state_position'),
        ]);

        return response()->json($task, 201);
    }

    // Remove the specified resource from storage
    public function destroy($boardId, $tasklistId, $taskId)
    {
        // \Log::info('Request received for deleting task', [
        // ]);

        // $taskList = TaskList::findOrFail($tasklistId);
        // $task = $taskList->tasks()->find($taskId);
        $task = Task::findOrFail($taskId);
        $task->delete();

        return response()->json(null, 204);
    }

    // Change the state of a task
    public function changeState(Request $request, $boardId, $taskListId, $taskId)
    {
        // $taskList = TaskList::findOrFail($taskListId);
        // $task = $taskList->tasks()->findOrFail($taskId);

        $task = Task::findOrFail($taskId);

        $task->state_id = $request->input('state_id');
        $task->save();

        return response()->json($task, 200);
    }

    public function checkState($boardId, $taskListId, $taskId) {
        $task = Task::findOrFail($taskId);
        return response()->json($task->state);
    }

    private function convertDate($date)
    {
        if ($date != null)
            return Carbon::parse($date)->setTimezone('Europe/Madrid')->format('Y-m-d');
        else
            return null;
    }

    private function validateDates($start_date, $due_date)
    {
        /* Validate start and due dates */
        // If a due date is selected, a start date must be selected as well
        if ($due_date && !$start_date)
            return response()->json(['error' => 'Due date must be selected if start date is selected'], 400);
        // Check that the due date is greater than the start date
        if ($start_date && $due_date && $start_date > $due_date)
            return response()->json(['error' => 'Start date cannot be greater than due date'], 400);

        return [$start_date, $due_date];
    }
}
