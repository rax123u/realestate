<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
            [
                'title' => 'The Azure Penthouse',
                'location' => 'Manhattan, New York',
                'city' => 'New York',
                'listing_type' => 'sale',
                'property_type' => 'apartment',
                'status' => 'active',
                'price' => 12500000,
                'bedrooms' => 4,
                'bathrooms' => 5,
                'area' => 5200,
                'description' => 'A breathtaking penthouse perched above Manhattan with panoramic skyline views, bespoke Italian marble finishes, and a private rooftop terrace.',
                'video_url' => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'primary_image' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
                'amenities' => ['Infinity Pool', 'Private Cinema', 'Wine Cellar', 'Smart Home System', 'Rooftop Terrace', 'Concierge Service'],
                'featured' => true,
                'showcase' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Villa Serenity',
                'location' => 'Malibu, California',
                'city' => 'Malibu',
                'listing_type' => 'sale',
                'property_type' => 'villa',
                'status' => 'active',
                'price' => 18900000,
                'bedrooms' => 6,
                'bathrooms' => 7,
                'area' => 8400,
                'description' => 'An oceanfront masterpiece blending California modernism with Mediterranean warmth. Floor-to-ceiling glass frames endless Pacific horizons.',
                'video_url' => 'https://assets.mixkit.co/videos/44370/44370-360.mp4',
                'primary_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
                'amenities' => ['Oceanfront Pool', 'Private Beach Access', 'Home Theater', 'Chef\'s Kitchen', 'Spa Suite', 'EV Charging'],
                'featured' => true,
                'showcase' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
                ],
            ],
            [
                'title' => 'The Obsidian Estate',
                'location' => 'Aspen, Colorado',
                'city' => 'Aspen',
                'listing_type' => 'sale',
                'property_type' => 'house',
                'status' => 'active',
                'price' => 24750000,
                'bedrooms' => 8,
                'bathrooms' => 9,
                'area' => 12000,
                'description' => 'A mountain sanctuary where contemporary architecture meets alpine grandeur. Heated driveways, ski-in access, and a glass-walled great room.',
                'video_url' => 'https://assets.mixkit.co/videos/28844/28844-360.mp4',
                'primary_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                'amenities' => ['Ski Room', 'Indoor Pool', 'Wine Vault', 'Helipad', 'Guest Pavilion', 'Wellness Center'],
                'featured' => true,
                'showcase' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Coastal Horizon',
                'location' => 'Miami Beach, Florida',
                'city' => 'Miami',
                'listing_type' => 'rent',
                'property_type' => 'house',
                'status' => 'active',
                'price' => 9800000,
                'bedrooms' => 5,
                'bathrooms' => 6,
                'area' => 6100,
                'description' => 'Art deco elegance reimagined for the modern era. This waterfront residence features a floating staircase and curated art gallery.',
                'primary_image' => 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
                'amenities' => ['Marina Berth', 'Rooftop Lounge', 'Art Gallery', 'Smart Climate', 'Butler\'s Pantry'],
                'featured' => true,
                'showcase' => false,
                'images' => [
                    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
                ],
            ],
            [
                'title' => 'The Kensington Manor',
                'location' => 'London, United Kingdom',
                'city' => 'London',
                'listing_type' => 'sale',
                'property_type' => 'house',
                'status' => 'sold',
                'price' => 31200000,
                'bedrooms' => 7,
                'bathrooms' => 8,
                'area' => 9800,
                'description' => 'A Grade II listed townhouse meticulously restored with contemporary interventions. Private garden, library, and staff quarters.',
                'primary_image' => 'https://images.unsplash.com/photo-1600047509807-ba8f84d4fa67?w=1200&q=80',
                'amenities' => ['Private Garden', 'Library', 'Staff Quarters', 'Period Features', 'Security Suite'],
                'featured' => true,
                'showcase' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600047509807-ba8f84d4fa67?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Desert Mirage',
                'location' => 'Scottsdale, Arizona',
                'city' => 'Scottsdale',
                'listing_type' => 'rent',
                'property_type' => 'villa',
                'status' => 'rented',
                'price' => 7200000,
                'bedrooms' => 4,
                'bathrooms' => 5,
                'area' => 4800,
                'description' => 'Desert modernism at its finest — rammed earth walls, cantilevered pools, and uninterrupted Sonoran Desert vistas.',
                'primary_image' => 'https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1200&q=80',
                'amenities' => ['Desert Pool', 'Outdoor Kitchen', 'Fire Pit Lounge', 'Solar Array', 'Meditation Pavilion'],
                'featured' => false,
                'showcase' => false,
                'images' => [
                    'https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1200&q=80',
                ],
            ],
        ];

        $admin = User::where('role', 'admin')->first();

        foreach ($properties as $data) {
            $images = $data['images'];
            unset($data['images']);

            $property = Property::create([
                ...$data,
                'user_id' => $admin?->id,
            ]);

            foreach ($images as $index => $url) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url' => $url,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
