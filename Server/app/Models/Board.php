<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    // The $fillable property lists the attributes that can be mass-assigned using the `create()` method
    // or `update()` method of the model. The `name`, `description`, and `manager_id` attributes are fillable.
    protected $fillable = ['name', 'description', 'is_active'];
    protected $table='board';

    // The `manager()` method defines a relationship between the board and the user who manages it.
    // Specifically, it indicates that a board belongs to a user, and that the foreign key for the user
    // is stored in the `manager_id` attribute of the board table.
    //public function manager(): BelongsTo
    //{
    //    return $this->belongsTo(User::class, 'manager_id');
    //}

    public function task_lists(): HasMany {
        return $this->hasMany(TaskList::class, 'board_id');
    }
}
