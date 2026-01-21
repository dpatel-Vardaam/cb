<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Species extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'species';

    protected $keyType = 'string';

    public $incrementing = false;

    /** @var array<int, string> */
    protected $fillable = [
        'id',
        'category_id',
        'title',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'category_id' => 'string',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function listing()
    {
        return $this->hasMany(Listing::class);
    }
}
