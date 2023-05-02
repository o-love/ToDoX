<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return new UserResource(Auth::user());
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        if (!Hash::check($request->oldpassword, Auth::user()->password)) {
            return response("Wrong Password", 500);
        }

        User::whereId(auth()->user()->id)->update([
            'password' => Hash::make($request->newpassword),
        ]);

        return response(`{res:"Password Updated"}`, 200);
    }
}
