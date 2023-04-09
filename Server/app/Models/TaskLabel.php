<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskLabel extends Model
{
    protected $table = 'task_label';

    // Define many-to-many relationship with the 'task' table
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_label', 'task_id', 'label_id', 'value');
    }

    // Define many-to-many relationship with the 'label' table
    public function labels()
    {
        return $this->belongsToMany(Label::class, 'task_label', 'label_id', 'task_id');
    }
}
