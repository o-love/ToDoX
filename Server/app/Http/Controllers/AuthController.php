<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()]);
        }
        $postArray = $request->all();

        $postArray['password'] = bcrypt($postArray['password']);
        $user = User::create($postArray);

        $success['name'] = $user->name;
        $success['token'] = $user->createToken();
        return response()->json([
            'status' => 'success',
            'data' => $success,
        ]);
    }


    public function login(Request $request)
    {
        //User check
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            //Setting login response

            $success['name'] = $user->name;
            $success['token'] = $this->apiToken;
            return response()->json([
                'status' => 'success',
                'data' => $success
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'data' => 'Unauthorized Access'
            ]);
        }
    }


}
