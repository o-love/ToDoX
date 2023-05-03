<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskComment extends Model
{
    use HasFactory;
    protected $fillable = ['task_id', 'user_id', 'content'];
    protected $table = 'task_comment';

    // A comment belongs to a task.
    public function task() 
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    // A comment belongs to a user.
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
