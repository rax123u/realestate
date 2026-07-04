<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::with(['property.images'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($fav) => $fav->property);

        return response()->json($favorites);
    }

    public function toggle(Request $request, Property $property): JsonResponse
    {
        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $property->id)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'favorited' => false,
                'message' => 'Removed from favorites',
            ]);
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'favorited' => true,
            'message' => 'Added to favorites',
        ]);
    }
}
