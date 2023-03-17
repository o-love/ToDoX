<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    use HasFactory;

    // The $fillable property lists the attributes that can be mass-assigned using the `create()` method
    // or `update()` method of the model. The `name` and `description` attributes are fillable.
    protected $fillable = ['name', 'description'];
}
