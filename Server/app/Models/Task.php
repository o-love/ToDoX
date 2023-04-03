<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'tasklist_id', 'state_id', 'due_date', 'start_date'];
    protected $table = 'task';
    // protected $primaryKey = "uuid";

    // A Task belongs to a TaskList
    public function taskList()
    {
        return $this->belongsTo(TaskList::class, 'tasklist_id');
    }

    // A Task belongs to a State
    public function state()
    {
        return $this->belongsTo(State::class);
    }

    // A Task has many Labels through TaskLabel
    public function labels()
    {
        return $this->belongsToMany(Label::class, 'task_label', 'task_id', 'label_id');
    }

    public function isPastDue()
{
    if ($this->labels()->where('type', 'date')->exists()) {
        $dateLabel = $this->labels()->where('type', 'date')->first();
        $dateValue = $dateLabel->typevalue;

        // Comparar la fecha de fin con la fecha actual
        if (strtotime($dateValue) < time()) {
            return true;
        }
    }

    return false;

    // Try on front - rev api connection
    // $.get('/api/tasks/' + taskId, function(task) {
    //     if (task.isOverdue) {
    //         $('p[data-task-id="' + taskId + '"]').addClass('overdue');
    //     }
    // });
    // .overdue {
    //     color: red;
    // }
}
}
