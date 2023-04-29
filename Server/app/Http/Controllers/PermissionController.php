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

    public function permissionsOfRole($permission)
    {
        $permissions = array();

        $roles = array(
            1 => array(
                //Permisos de tablero
                'Crear_tablero' => true,
                'Editar_tablero' => true,
                'Leer_tablero' => true,
                'Eliminar_tablero' => true,

                //Permisos de lista
                'Crear_lista' => true,
                'Editar_lista' => true,
                'Leer_lista' => true,
                'Eliminar_lista' => true,

                //Permisos de tarea
                'Crear_tarea' => true,
                'Editar_tarea' => true,
                'Leer_tarea' => true,
                'Eliminar_tarea' => true,

                //Permisos de estado
                'Crear_estado' => true,
                'Editar_estado' => true,
                'Leer_estado' => true,
                'Eliminar_estado' => true,

                //Otros permisos
                'asignar_usuarios_a_tablero' => true,
                'actualizar_estado_tarea' => true,
                'poner_descripcion_tarea' => true,
                'añadir_comentario_tarea' => true,
                'asignar_tarea_a_usuario' => true,
                'establecer_fecha_en_tarea' => true,
                'añadir_propiedades_a_una_tarea' => true,
                'editar_permisos' => true
            ),
            2 => array(
                //Permisos de tablero
                'Crear_tablero' => false,
                'Editar_tablero' => false,
                'Leer_tablero' => false,
                'Eliminar_tablero' => false,

                //Permisos de lista
                'Crear_lista' => true,
                'Editar_lista' => true,
                'Leer_lista' => true,
                'Eliminar_lista' => true,

                //Permisos de tarea
                'Crear_tarea' => true,
                'Editar_tarea' => true,
                'Leer_tarea' => true,
                'Eliminar_tarea' => true,

                //Permisos de estado
                'Crear_estado' => true,
                'Editar_estado' => true,
                'Leer_estado' => true,
                'Eliminar_estado' => true,

                //Permisos de etiquetas
                'Crear_etiqueta' => true,
                'Editar_etiqueta' => true,
                'Leer_etiqueta' => true,
                'Eliminar_etiqueta' => true,

                //Otros permisos
                'asignar_usuarios_a_tablero' => false,
                'actualizar_estado_tarea' => true,
                'poner_descripcion_tarea' => true,
                'añadir_comentario_tarea' => true,
                'asignar_tarea_a_usuario' => true,
                'establecer_fecha_en_tarea' => true,
                'añadir_propiedades_a_una_tarea' => true,
                'editar_permisos' => false
            ),
            3 => array(
                //Permisos de tablero
                'Crear_tablero' => false,
                'Editar_tablero' => false,
                'Leer_tablero' => true,
                'Eliminar_tablero' => false,

                //Permisos de lista
                'Crear_lista' => false,
                'Editar_lista' => false,
                'Leer_lista' => true,
                'Eliminar_lista' => false,

                //Permisos de tarea
                'Crear_tarea' => true,
                'Editar_tarea' => true,
                'Leer_tarea' => true,
                'Eliminar_tarea' => false,

                //Permisos de estado
                'Crear_estado' => false,
                'Editar_estado' => false,
                'Leer_estado' => true,
                'Eliminar_estado' => false,

                //Permisos de etiquetas
                'Crear_etiqueta' => false,
                'Editar_etiqueta' => false,
                'Leer_etiqueta' => true,
                'Eliminar_etiqueta' => false,

                //Otros permisos
                'asignar_usuarios_a_tablero' => false,
                'actualizar_estado_tarea' => true,
                'poner_descripcion_tarea' => false,
                'añadir_comentario_tarea' => true,
                'asignar_tarea_a_usuario' => false,
                'establecer_fecha_en_tarea' => true,
                'añadir_propiedades_a_una_tarea' => true,
                'editar_permisos' => false
            )
        );

        if(array_key_exists($permission, $roles)) {
            $permissions = $roles[$permission];
        }

        return $permissions;
    }

}
