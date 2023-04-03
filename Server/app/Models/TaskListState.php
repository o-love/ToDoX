<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskListState extends Model
{
    protected $table = 'tasklist_state';

    // Define many-to-many relationship with the 'state' table
    public function states()
    {
        return $this->belongsToMany(State::class, 'tasklist_state', 'tasklist_id', 'state_id');
    }

    // Define many-to-many relationship with the 'taslist' table
    public function tasklists()
    {
        return $this->belongsToMany(TaskList::class, 'tasklist_state', 'state_id', 'tasklist_id');
    }
}
