<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BoardUser;

class PermissionController extends Controller
{
    public function getPermissionsForUser($boardId, $userId)
    {
        $permission = BoardUser::where('board_id', $boardId)
                                ->where('user_id', $userId)
                                ->value('permission');
        return $this->permissionsOfRole($permission);
    }

    public function getRole($permission)
    {
        $roles = [
                    1 => 'Gestor',
                    2 => 'Desarrollador',
                    3 => 'Integrante'
                ];
        return isset($roles[$permission]) ? $roles[$permission] : null;
    }

    function permissionsOfRole($permission)
    {
        return [
            1 => [
                //Board permissions
                'Create_board' => true,
                'Update_board' => true,
                'Read_board' => true,
                'Delete_tablero' => true,

                //TaskList permissions
                'Create_tasklist' => true,
                'Update_tasklist' => true,
                'Read_tasklist' => true,
                'Delete_tasklist' => true,

                //Task permissions
                'Create_task' => true,
                'Update_task' => true,
                'Read_task' => true,
                'Delete_task' => true,

                //State permissions
                'Create_state' => true,
                'Update_state' => true,
                'Read_state' => true,
                'Delete_state' => true,

                //Label permissions
                'Create_label' => true,
                'Update_label' => true,
                'Read_label' => true,
                'Delete_label' => true,

                //Other permissions
                'assign_users_to_board' => true,
                'update_task_status' => true,
                'put_task_description' => true,
                'add_comment_task' => true,
                'assign_task_to_user' => true,
                'set_date_on_task' => true,
                'add_properties_to_a_task' => true,
                'edit_permissions' => true,
            ],
            2 => [
                //Board permissions
                'Create_board' => false,
                'Update_board' => false,
                'Read_board' => false,
                'Delete_board' => false,

                //TaskList permissions
                'Create_tasklist' => true,
                'Update_tasklist' => true,
                'Read_tasklist' => true,
                'Delete_tasklist' => true,

                //Task permissions
                'Create_task' => true,
                'Update_task' => true,
                'Read_task' => true,
                'Delete_task' => true,

                //State permissions
                'Create_state' => true,
                'Update_state' => true,
                'Read_state' => true,
                'Delete_state' => true,

                //Label permissions
                'Create_label' => true,
                'Update_label' => true,
                'Read_label' => true,
                'Delete_label' => true,

                //Other permissions
                'assign_users_to_board' => false,
                'update_task_status' => true,
                'put_task_description' => true,
                'add_comment_task' => true,
                'assign_task_to_user' => true,
                'set_date_on_task' => true,
                'add_properties_to_a_task' => true,
                'edit_permissions' => false,
            ],
            3 => [
                //Board permissions
                'Create_board' => false,
                'Update_board' => false,
                'Read_board' => true,
                'Delete_board' => false,

                //TaskList permissions
                'Create_tasklist' => false,
                'Update_tasklist' => false,
                'Read_tasklist' => true,
                'Delete_tasklist' => false,

                //Task permissions
                'Create_task' => true,
                'Update_task' => true,
                'Read_task' => true,
                'Delete_task' => false,

                //State permissions
                'Create_state' => false,
                'Update_state' => false,
                'Read_state' => true,
                'Delete_state' => false,

                //Label permissions
                'Create_label' => false,
                'Update_label' => false,
                'Read_label' => true,
                'Delete_label' => false,

                //Other permissions
                'assign_users_to_board' => false,
                'update_task_status' => true,
                'put_task_description' => false,
                'add_comment_task' => true,
                'assign_task_to_user' => false,
                'set_date_on_task' => true,
                'add_properties_to_a_task' => true,
                'edit_permissions' => false,
            ]
        ];
    }
}
