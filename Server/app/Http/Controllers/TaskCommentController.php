<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskCommentController extends Controller
{
    //Returns all comments of a task
    public function index($boardId, $listId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $taskComment = TaskComment::where('task_id', $taskId)->get();

        return response()->json($taskComment);
    }

    // Creates a new comment in a specific task
    public function store(Request $request, $boardId, $tasklistId, $taskId)
    {
        //TODO: change user_id to track user creating the coment.
        $taskComment = new TaskComment([
            'content' => $request->input('content'),
            'task_id' => $taskId,
            'user_id' => Auth::user(),
        ]);
        $taskComment->save();

        $task = Task::findOrFail($taskId);
        $task->TaskComment($taskComment);

        return response()->json($taskComment, 201);
    }

    public function show($boardId, $taskListId, $taskId, $taskCommentId)
    {
        $task = Task::findOrFail($taskId);
        $taskComment = $task->TaskComment()->findOrFail($taskCommentId);
    
        return response()->json($taskComment);
    }

    public function update(Request $request, $commentId)
    {
        $comment = TaskComment::findOrFail($commentId);
        $comment->update([
            'comment' => $request->input('comment'),
        ]);

        return response()->json($comment, 201);
    }

    public function destroy($boardId, $taskListId, $taskId, $taskCommentId)
    {
        $task = Task::findOrFail($taskId);
        $taskComment = $task->TaskComment()->findOrFail($taskCommentId);
        $taskComment->delete();

        return response()->json(null, 204);
    }
}
