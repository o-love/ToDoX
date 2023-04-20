<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        State::create([
            'name' => 'To Do',
        ]);

        State::create([
            'name' => 'In Progress',
        ]);

        State::create([
            'name' => 'Done',
        ]);
    }
}