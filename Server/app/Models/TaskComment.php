<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskComment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'task_id', 'comment'];
    protected $table = 'task_comment';

    // A TaskComment belongs to a Task
    public function task()
    {
        return $this->belongsTo(Task::class, 'tasklist_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
