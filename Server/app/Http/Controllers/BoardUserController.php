<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BoardUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class BoardUserController extends Controller
{
    public function grantPermission(Request $request)
    {
        $boardId = $request->input('board_id');
        $userId = $request->input('user_id');
        $permission = $request->input('permission');

         $boardUser = new BoardUser([
            'board_id' => $boardId,
            'user_id' => $userId,
            'permission' => $permission
         ]);

         $boardUser -> save();
         return new JsonResponse($boardUser, Response::HTTP_OK);
    }

    public function updatePermission($boardId, $userId, $permission)
    {
        $boardUser = BoardUser::where('board_id', $boardId)
            ->where('user_id', $userId)
            ->firstOrFail();
        
        $boardUser->permission = $permission;

        $boardUser->save();
        return response()->json($boardUser, 200);

    }

    public function index()
    {
        $boardsUsers = BoardUser::all();
        return response()->json($boardsUsers);
    }
}
