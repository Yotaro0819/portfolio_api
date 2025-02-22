<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'payment_id',
        'product_name',
        'quantity',
        'amount',
        'currency',
        'payer_name',
        'payer_email',
        'seller_id',
        'seller_stripe_account_id',
        'payment_status',
        'process_status',
        'payment_method'
    ];

}
