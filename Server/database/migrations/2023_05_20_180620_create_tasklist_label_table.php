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
        Schema::create('tasklist_label', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tasklist_id');
            $table->unsignedBigInteger('label_id');
            $table->timestamps();

            $table->foreign('tasklist_id')
                ->references('id')
                ->on('tasklist')
                ->onDelete('cascade');

            $table->foreign('label_id')
                ->references('id')
                ->on('label')
                ->onDelete('cascade');

            $table->unique(['tasklist_id', 'label_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasklist_label');
    }
};