<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TaskList;

class Board extends Model
{
    use HasFactory;

    // The $fillable property lists the attributes that can be mass-assigned using the `create()` method
    // or `update()` method of the model. The `name`, `description`, and `manager_id` attributes are fillable.
    protected $fillable = ['name', 'description', 'is_active'];
    protected $table='board';
    // protected $primaryKey = "uuid";

    // A Board can have many TaskLists
    public function taskLists()
    {
        return $this->hasMany(TaskList::class);
    }

    // A Board can have many BoardUsers
    public function boardUsers()
    {
        return $this->belongsToMany(User::class, BoardUser::class);
    }

    // The `manager()` method defines a relationship between the board and the user who manages it.
    // Specifically, it indicates that a board belongs to a user, and that the foreign key for the user
    // is stored in the `manager_id` attribute of the board table.
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
