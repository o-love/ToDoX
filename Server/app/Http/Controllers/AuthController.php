<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, true))
        {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json(['token' => $token, 'user' => $user]);
        }
        else
        {
            return response()->json(['error' => 'Login Invalid'], 503);
        }
    }
}
