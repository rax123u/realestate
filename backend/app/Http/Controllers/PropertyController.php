<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::query();

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        if ($request->filled('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }
        if ($request->filled('property_type')) {
            $query->where('property_type', $request->property_type);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('min_area')) {
            $query->where('area', '>=', $request->min_area);
        }
        if ($request->filled('max_area')) {
            $query->where('area', '<=', $request->max_area);
        }
        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } elseif (!$request->user()?->isAdmin() || !$request->boolean('all_statuses')) {
            $query->where('status', 'active');
        }

        if ($request->has('featured')) {
            $query->where('featured', true);
        }
        if ($request->has('showcase')) {
            $query->where('showcase', true);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'area_asc' => $query->orderBy('area', 'asc'),
            'area_desc' => $query->orderBy('area', 'desc'),
            default => $query->latest(),
        };

        $perPage = $request->integer('per_page', 12);
        $properties = $query->paginate($perPage);

        $properties->getCollection()->transform(fn ($property) => $this->formatProperty($property));

        return response()->json($properties);
    }

    public function myListings(Request $request): JsonResponse
    {
        $properties = Property::where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($property) => $this->formatProperty($property));

        return response()->json($properties);
    }

    public function featured(): JsonResponse
    {
        $properties = Property::where('featured', true)
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(fn ($property) => $this->formatProperty($property));

        return response()->json($properties);
    }

    public function showcase(): JsonResponse
    {
        $properties = Property::where('showcase', true)
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(fn ($property) => $this->formatProperty($property));

        return response()->json($properties);
    }

    public function show(Property $property): JsonResponse
    {
        $property->load('images');

        return response()->json($this->formatProperty($property));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'area' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'primary_image' => 'nullable|string',
            'amenities' => 'nullable|array',
            'featured' => 'boolean',
            'showcase' => 'boolean',
            'city' => 'required|string|max:255',
            'listing_type' => 'required|in:sale,rent',
            'property_type' => 'required|in:house,apartment,villa,commercial,land',
            'status' => 'sometimes|in:active,sold,rented,expired',
        ]);

        if (!$request->user()->isAdmin()) {
            $validated['featured'] = false;
            $validated['showcase'] = false;
        }

        $property = Property::create([
            ...$validated,
            'status' => $validated['status'] ?? 'active',
            'user_id' => $request->user()->id,
        ]);

        return response()->json($this->formatProperty($property->load('images')), 201);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $this->authorizePropertyAccess($request, $property);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'listing_type' => 'sometimes|in:sale,rent',
            'property_type' => 'sometimes|in:house,apartment,villa,commercial,land',
            'status' => 'sometimes|in:active,sold,rented,expired',
            'price' => 'sometimes|numeric|min:0',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'area' => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'primary_image' => 'nullable|string',
            'amenities' => 'nullable|array',
            'featured' => 'boolean',
            'showcase' => 'boolean',
        ]);

        if (!$request->user()->isAdmin()) {
            unset($validated['featured'], $validated['showcase']);
        }

        $property->update($validated);

        return response()->json($this->formatProperty($property->fresh()->load('images')));
    }

    public function destroy(Request $request, Property $property): JsonResponse
    {
        $this->authorizePropertyAccess($request, $property);
        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    private function authorizePropertyAccess(Request $request, Property $property): void
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return;
        }

        if (!in_array($user->role, ['agent', 'owner'], true) || $property->user_id !== $user->id) {
            abort(403, 'You do not have permission to manage this property.');
        }
    }

    private function formatProperty(Property $property): array
    {
        return [
            'id' => $property->id,
            'title' => $property->title,
            'location' => $property->location,
            'city' => $property->city,
            'listing_type' => $property->listing_type,
            'property_type' => $property->property_type,
            'status' => $property->status,
            'price' => (float) $property->price,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'area' => $property->area,
            'description' => $property->description,
            'video' => $property->video_url,
            'video_url' => $property->video_url,
            'image' => $property->primary_image,
            'primary_image' => $property->primary_image,
            'amenities' => $property->amenities ?? [],
            'featured' => $property->featured,
            'showcase' => $property->showcase,
            'user_id' => $property->user_id,
            'images' => $property->relationLoaded('images') ? $property->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'is_primary' => $img->is_primary,
            ]) : [],
            'created_at' => $property->created_at,
            'updated_at' => $property->updated_at,
        ];
    }
}
