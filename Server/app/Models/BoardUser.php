<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardUser extends Model
{
    use HasFactory;

    // The $fillable property lists the attributes that can be mass-assigned using the `create()` method
    // or `update()` method of the model. The `board_id`, `user_id`, and `permission` attributes are fillable.
    protected $fillable = ['board_id', 'user_id', 'permission'];
    protected $table='board_user';

    public function users()
    {
        return $this->belongsToMany(User::class, BoardUser::class);
    }

    public function boards()
    {
        return $this->belongsToMany(Board::class, BoardUser::class);
    }

}
