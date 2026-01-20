<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Listing extends Model
{
    protected $fillable = [
        'uuid',
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'location',
        'species',
        'morph',
        'age',
        'sex',
        'images',
        'status',
        'is_negotiable',
        'is_delivery_available',
    ];

    protected $appends = [
        'image_urls',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'is_negotiable' => 'boolean',
        'is_delivery_available' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($listing) {
            if (empty($listing->uuid)) {
                $listing->uuid = Str::uuid()->toString();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlsAttribute(): array
    {
        if (empty($this->images)) {
            return [];
        }

        return array_map(function ($image) {
            return asset('storage/listings/' . $this->uuid . '/' . $image);
        }, $this->images);
    }
}
