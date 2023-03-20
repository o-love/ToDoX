<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// The name "List" is reserved by PHP. 

class BoardList extends Model
{
    use HasFactory;

    // protected $fillable = ['name', 'description', 'is_active'];
    protected $table='list';
}
