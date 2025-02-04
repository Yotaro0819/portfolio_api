<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HashtagPost extends Model
{
    public $timestamps = false;
    protected $fillable = ['hashtag_id', 'post_id'];

    public function hashtag()
    {
        return $this->belongsTo(Hashtag::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
