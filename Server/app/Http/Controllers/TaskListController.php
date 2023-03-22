<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskListRequest;
use App\Http\Requests\UpdateTaskListRequest;
use App\Http\Resources\TaskListCollection;
use App\Http\Resources\TaskListResource;
use App\Models\Board;
use App\Models\TaskList;

class TaskListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Board $board)
    {
        return TaskListResource::collection($board->task_lists()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskListRequest  $request
     */
    public function store(StoreTaskListRequest $request)
    {
        $taskList = TaskList::create($request->all());

        return new TaskListResource($taskList);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TaskList  $taskList
     */
    public function show(TaskList $taskList)
    {
        return new TaskListResource($taskList);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskListRequest  $request
     * @param  \App\Models\TaskList  $taskList
     */
    public function update(UpdateTaskListRequest $request, TaskList $taskList)
    {
        $taskList->update($request->all());

        return new TaskListResource($taskList);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskList  $taskList
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskList $taskList)
    {
        $taskList->delete();

        return response(null, 204);
    }

    public function destroyAll(Board $board)
    {
        $board->task_lists()->delete();

        return response(null, 204);
    }
}
