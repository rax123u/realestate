<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'price',
        'bedrooms',
        'bathrooms',
        'area',
        'description',
        'video_url',
        'primary_image',
        'amenities',
        'featured',
        'showcase',
        'user_id',
        'city',
        'listing_type',
        'property_type',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'amenities' => 'array',
            'featured' => 'boolean',
            'showcase' => 'boolean',
            'status' => 'string',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}
