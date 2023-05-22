<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'tasklist_id', 'state_id', 'due_date', 'start_date', 'state_position', 'recurring_period'];
    protected $table = 'task';
    // protected $primaryKey = "uuid";

    // A Task belongs to a TaskList
    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
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

    // A Task can have many TaskComments
    public function taskComment()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function isPastDue()
    {
        if ($this->labels()->where('type', 'date')->exists()) {
            $dateLabel = $this->labels()->where('type', 'date')->first();
            $dateValue = $dateLabel->typevalue;

            if (strtotime($dateValue) < time()) {
                return true;
            }
        }

        return false;
    }
}
