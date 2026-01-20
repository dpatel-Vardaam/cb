<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Listing extends Model
{
    use Searchable;

    protected $fillable = [
        'id',
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'state',
        'city',
        'species',
        'morph',
        'age',
        'sex',
        'images',
        'status',
        'is_negotiable',
        'is_delivery_available',
    ];

    public $incrementing = false;

    protected $keyType = 'string';

    protected $appends = [
        'image_urls',
        'uuid',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'is_negotiable' => 'boolean',
        'is_delivery_available' => 'boolean',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,

            // searchable text
            'title' => $this->title,
            'description' => $this->description,

            // 🔥 FILTERABLE FIELDS (TOP-LEVEL ONLY)
            'status' => $this->status,
            'category_id' => (string) $this->category_id,
            'user_id' => (string) $this->user_id,
            'is_negotiable' => (bool) $this->is_negotiable,
            'is_delivery_available' => (bool) $this->is_delivery_available,

            // optional searchable data
            'price' => (float) $this->price,
            'state' => $this->state,
            'city' => $this->city,
            'species' => $this->species,
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($listing) {
            if (empty($listing->id)) {
                $listing->id = Str::uuid()->toString();
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
            return '/storage/listings/'.$this->id.'/'.$image;
        }, $this->images);
    }

    public function getUuidAttribute(): string
    {
        return (string) $this->id;
    }
}
