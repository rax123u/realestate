<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::all();

        if ($properties->isEmpty()) {
            return;
        }

        $names = [
            'John Doe', 'Emily Watson', 'Michael Chang', 'Sophia Laurent',
            'David Beckham', 'Anna Ivanova', 'Carlos Santana', 'Yasmin Al-Fayed'
        ];

        $emails = [
            'john.doe@example.com', 'emily.w@example.com', 'm.chang@example.com', 'sophia.l@example.com',
            'david.b@example.com', 'anna.i@example.com', 'carlos.s@example.com', 'yasmin.a@example.com'
        ];

        $messages = [
            'I am extremely interested in scheduling a private viewing of this residence. Please let me know your availability for next week.',
            'Could you provide more details regarding the home automation system and security configuration?',
            'Is the price open to negotiation? I am looking to make an offer soon.',
            'Does this property have options for extended lease terms, or is it only short term?',
            'Beautiful property! I would like to review the HOA documents and property disclosures.',
            'Can we arrange a video call walkthrough of the penthouse/estate?',
            'Please contact me at your earliest convenience to discuss the purchasing procedure.'
        ];

        $statuses = ['new', 'read', 'responded', 'archived'];

        // Let's seed inquiries spanning the last 6 months to make reports look gorgeous and complete
        foreach ($properties as $index => $property) {
            $inquiryCount = rand(2, 5);

            for ($i = 0; $i < $inquiryCount; $i++) {
                $nameIndex = rand(0, count($names) - 1);
                $msgIndex = rand(0, count($messages) - 1);
                
                // Random month in the last 6 months
                $monthsAgo = rand(0, 5);
                $createdAt = Carbon::now()->subMonths($monthsAgo)->subDays(rand(1, 28));

                Inquiry::create([
                    'name' => $names[$nameIndex],
                    'email' => $emails[$nameIndex],
                    'message' => $messages[$msgIndex],
                    'property_id' => $property->id,
                    'status' => $statuses[rand(0, count($statuses) - 1)],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }
    }
}
