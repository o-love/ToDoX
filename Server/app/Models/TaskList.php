<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskList extends Model
{
    use HasFactory;

    protected $table = 'list';

    protected $fillable = ['name', 'description', 'board_id'];

    //public function tasks(): HasMany {
    //    return $this->hasMany(Task::class);
    //}

    public function board(): BelongsTo {
        return $this->belongsTo(Board::class, 'board_id');
    }
}
