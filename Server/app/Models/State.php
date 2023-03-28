<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $fillable = ['name'];
    protected $table='state';
    // protected $primaryKey = "uuid";

    // A Task can have one or more States
    public function task()
    {
        return $this->hasMany(Task::class);
    }

    // A State has many TaskLists through TaskListState
    public function taskLists()
    {
        return $this->belongsToMany(TaskList::class, 'tasklist_state', 'state_id', 'tasklist_id');
    }
}
