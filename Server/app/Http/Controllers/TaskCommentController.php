<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskCommentController extends Controller
{
    // Display a listing of the resource
    public function index($boardId, $listId, $taskId)
    {
        $comments = TaskComment::where('task_id', $taskId)->latestFirst()->get();
        // $comments = TaskComment::where(function ($query) use ($taskId) {
        //     $query->where('id', $taskId);
        // })->latestFirst()->get();
        return response()->json($comments);
    }

    // Store a newly created resource in storage
    public function store(Request $request, $boardId, $tasklistId, $taskId, $userId)
    {
        $comment = TaskComment::create([
            // 'user_id' => auth()->user()->id,
            'user_id' => $userId,
            'task_id' => $taskId,
            'comment' => $request->input('comment'),
        ]);

        $task = Task::findOrFail($taskId);
        $task->taskcomments($comment);
        
        return response()->json($comment, 201);
    }

    // Display the specified resource
    public function show($commentId)
    {
        $comment = TaskComment::findOrFail($commentId);
        return response()->json($comment, 201);
    }

    // Update the specified resource in storage
    public function update(Request $request, $commentId)
    {
        $comment = TaskComment::findOrFail($commentId);
        $comment->update([
            'comment' => $request->input('comment'),
        ]);

        return response()->json($comment, 201);
    }

    // Remove the specified resource from storage
    public function destroy($commentId)
    {
        $comment = TaskComment::findOrFail($commentId);
        $comment->delete();

        return response()->json(null, 204);
    }
}
