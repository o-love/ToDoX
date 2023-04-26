<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return new UserResource(Auth::user());
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        User::whereId(auth()->user()->id)->update([
            'password' => Hash::make($request->password),
        ]);

        return response("Password updated", 200);
    }
}
