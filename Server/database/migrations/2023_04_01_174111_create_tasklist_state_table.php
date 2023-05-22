<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasklist_state', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tasklist_id');
            $table->unsignedBigInteger('state_id');
            $table->timestamps();
            
            $table->foreign('tasklist_id')
                ->references('id')
                ->on('tasklist')
                ->onDelete('cascade');
            
            $table->foreign('state_id')
                ->references('id')
                ->on('state')
                ->onDelete('cascade');
                
            $table->unique(['tasklist_id', 'state_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasklist_state');
    }
};
