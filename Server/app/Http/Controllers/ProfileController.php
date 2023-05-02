<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return new UserResource(Auth::user());
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        if (!Hash::check($request->oldpassword, Auth::user()->password)) {
            error_log("wrong password");
            return response("Wrong Password", 500);
        }

        User::whereId(auth()->user()->id)->update([
            'password' => Hash::make($request->newpassword),
        ]);

        return response("{}", 200);
    }
}
