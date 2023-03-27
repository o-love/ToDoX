<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'tasklist_id', 'state_id'];
    protected $table='task';

    // A Task belongs to a TaskList
    public function taskList()
    {
        return $this->belongsTo(TaskList::class, 'tasklist_id');
    }

    // A task can have many states
    public function states()
    {
        return $this->belongsTo(State::class, 'state_id');
    }
}
