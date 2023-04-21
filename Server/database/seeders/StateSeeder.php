<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $state1 = new State;
        $state1->name = "Not started";
        $state1->save();

        $state2 = new State;
        $state2->name = "WIP";
        $state2->save();

        $state3 = new State;
        $state3->name = "Done";
        $state3->save();
    }
}