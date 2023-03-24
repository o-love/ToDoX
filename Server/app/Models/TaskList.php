<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// The name "List" is reserved by PHP. 

class TaskList extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'board_id'];
    protected $table='list';

    // A TaskList belongs to a Board
    public function board() {
        return $this->belongsTo(Board::class, 'board_id');
    }
}
