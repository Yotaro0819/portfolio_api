<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users');
            $table->string('order_id');
            $table->string('payment_id');
            $table->string('invoice_id');
            $table->string('amount');
            $table->string('currency');
            $table->string('payer_name');
            $table->string('payer_email');
            $table->string('seller_email');
            $table->string('order_status');
            $table->string('order_method');
            $table->enum('status', ['pending', 'approved', 'failed', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
