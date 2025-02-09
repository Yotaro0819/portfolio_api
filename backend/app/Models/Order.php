<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'seller_id',
        'order_id',
        'payment_id',
        'invoice_id',
        'price',
        'currency',
        'payer_name',
        'payer_email',
        'seller_email',
        'order_status',
        'order_method'
    ];
}
