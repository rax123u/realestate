<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Victoria Ashford',
                'role' => 'CEO, Ashford Holdings',
                'quote' => 'Aurelius transformed our property search into an experience of pure elegance. Their attention to detail is unmatched in the luxury market.',
                'avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                'sort_order' => 1,
            ],
            [
                'name' => 'Marcus Chen',
                'role' => 'Tech Entrepreneur',
                'quote' => 'From the first viewing to closing, every interaction felt bespoke and refined. This is how luxury real estate should be done.',
                'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
                'sort_order' => 2,
            ],
            [
                'name' => 'Elena Rodriguez',
                'role' => 'Art Collector',
                'quote' => 'The properties they curate are architectural masterpieces. Aurelius doesn\'t just sell homes — they deliver lifestyles.',
                'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
