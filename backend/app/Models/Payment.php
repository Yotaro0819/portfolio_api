<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'amount',
        'currency',
        'payment_id',
        'payer_id',
        'status'
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
