<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return new UserResource(Auth::user());
    }
}
