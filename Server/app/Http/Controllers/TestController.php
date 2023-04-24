<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class TestController extends Controller
{
    public function index(Request $request)
    {
        $token = PersonalAccessToken::findToken(trim(substr($request->header('Authorization'), 6)));
        return new UserResource(User::findOrFail($token->tokenable_id));
    }
}
