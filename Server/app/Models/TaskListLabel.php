<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskListState extends Model
{
    protected $table = 'tasklist_label';

    // Define many-to-many relationship with the 'label' table
    public function labels()
    {
        return $this->belongsToMany(State::class, 'tasklist_label', 'tasklist_id', 'label_id');
    }

    // Define many-to-many relationship with the 'tasklist' table
    public function tasklists()
    {
        return $this->belongsToMany(TaskList::class, 'tasklist_label', 'label_id', 'tasklist_id');
    }
}
