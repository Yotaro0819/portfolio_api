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

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_FAILED = 'failed';
    const STATUS_REJECTED = 'rejected';

    public function isPending()
    {
        return $this->status = self::STATUS_PENDING;
    }

    public function isApproved()
    {
        return $this->status = self::STATUS_APPROVED;
    }

    public function isFailed()
    {
        return $this->status = self::STATUS_FAILED;
    }

    public function isRejected()
    {
        return $this->status = self::STATUS_REJECTED;
    }
}
