<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    //Returns all comments of a task
    public function index($boardId, $taskListId, $taskId)
    {
        $task = $this->findTaskOrFail($taskId);
        $taskComments = $task->TaskComment;

        return response()->json($taskComments);
    }

    // Creates a new comment in a specific task
    public function store(Request $request, $boardId, $tasklistId, $taskId)
    {
        //TODO: change user_id to track user creating the coment.
        $taskComment = new TaskComment([
            'content' => $request->input('content'),
            'task_id' => $taskId,
            'user_id' => Auth::user()->id,
            // 'user_id' => '1'
        ]);
        $taskComment->save();

        // $task = $this->findTaskOrFail($taskId);
        // $task->TaskComment($taskComment);

        $task = $this->findTaskOrFail($taskId);
        $task->TaskComment()->save($taskComment);

        return response()->json($taskComment, 201);
    }

    public function show(Request $request, $boardId, $taskListId, $taskId, $taskCommentId)
    {
        $comment = TaskComment::findOrFail($taskCommentId);
        $comment->update([
            'content' => $request->input('content'),
        ]);
        return response()->json($comment, 201);
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
        $task = $this->findTaskOrFail($taskId);
        $taskComment = $this->findTaskCommentOrFail($task, $taskCommentId);
        $taskComment->delete();

        return response()->json(null, 204);
    }

    private function findTaskOrFail($taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        return $task;
    }

    private function findTaskCommentOrFail($task, $taskCommentId)
    {
        try {
            $taskComment = $task->TaskComment()->findOrFail($taskCommentId);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Task comment not found'], 404);
        }

        return $taskComment;
    }
}
