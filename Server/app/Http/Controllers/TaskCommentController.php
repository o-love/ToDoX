<?php

namespace App\Http\Controllers;

use App\http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskComment;
use App\Models\Task;
use App\Models\TaskList;
use App\Models\Board;

class TaskCommentController extends Controller
{
    //Returns all comments of a task
    public function index($boardId, $taskListId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $taskComment = TaskComment::where('task_id', $taskId)->get();

        return response()->json($taskComment);
    }

    // Creates a new comment in a specific task
    public function store(Request $request, $boardId, $taskListId, $taskId)
    {
        //TODO: change user_id to track user creating the coment.
        $taskComment = new TaskComment([
            'content' => $request->input('content'),
            'task_id' => $taskId,
            'user_id' => Auth::user(),
        ]);
        $taskComment->save();

        return response()->json($taskComment);
    }

    public function show($boardId, $taskListId, $taskId, $taskCommentId) {
        $task = Task::findOrFail($taskId);
        $taskComment = $task->TaskComment()->findOrFail($taskCommentId);

        return response()->json($taskComment);
    }

    public function destroy($boardId, $taskListId, $taskId, $taskCommentId) {
        $task = Task::findOrFail($taskId);
        $taskComment = $task->TaskComment()->findOrFail($taskCommentId);
        $taskComment->delete();

        return response()->json(null, 204);
    }
    //
}
