<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// The name "List" is reserved by PHP. 

class TaskList extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'board_id'];
    protected $table='tasklist';
    // protected $primaryKey = "uuid";

    // A TaskList belongs to a Board
    public function board()
    {
        return $this->belongsTo(Board::class, 'board_id');
    }

    // A TaskList can have many Tasks
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // A TaskList has many States through TaskListState
    public function states()
    {
        return $this->belongsToMany(State::class, 'tasklist_state', 'tasklist_id', 'state_id');
    }

    // A TaskList has many Labels through TaskListLabel
    public function labels()
    {
        return $this->belongsToMany(State::class, 'tasklist_label', 'tasklist_id', 'label_id');
    }
}
