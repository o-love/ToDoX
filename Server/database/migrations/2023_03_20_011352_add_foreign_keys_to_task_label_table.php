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
        Schema::table('task_label', function (Blueprint $table) {
            $table->foreign('task_id')->references('id')->on('task')->onDelete('cascade');
            $table->foreign('label_id')->references('id')->on('label')->onDelete('cascade');
            $table->primary(['task_id', 'label_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('task_label', function (Blueprint $table) {
            $table->dropForeign(['task_id']);
            $table->dropForeign(['label_id']);
            $table->dropPrimary(['task_id', 'label_id']);
            $table->dropColumn(['task_id', 'label_id']);
        });
    }
};
