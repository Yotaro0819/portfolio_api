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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->string('payment_id');
            $table->string('product_name');
            $table->string('quantity');
            $table->string('amount');
            $table->string('currency');
            $table->string('post_id');
            $table->string('payer_id');
            $table->string('seller_id');
            $table->string('seller_stripe_account_id');
            $table->string('payment_status');
            $table->string('process_status');
            $table->string('payment_method');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
