<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'price',
        'owner_id',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likedUser()
    {
        return $this->belongsToMany(User::class, 'likes', 'post_id', 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function hashtagPost()
    {
        return $this->belongsToMany(HashtagPost::class);
    }

    public function hashtags()
    {
        return $this->hasMany(Hashtag::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }
}
