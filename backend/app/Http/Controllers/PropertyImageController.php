<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    public function store(Request $request, Property $property): JsonResponse
    {
        $this->authorizePropertyAccess($request, $property);

        // Check if there was an upload error due to server limits
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_INI_SIZE) {
            return response()->json([
                'message' => 'The uploaded file exceeds the server maximum upload limit of ' . ini_get('upload_max_filesize') . '.',
                'errors' => [
                    'image' => ['The uploaded file exceeds the server maximum upload limit of ' . ini_get('upload_max_filesize') . '.']
                ]
            ], 422);
        }

        $request->validate([
            'image' => 'required_without:url|image|max:10240',
            'url' => 'required_without:image|url',
            'is_primary' => 'boolean',
        ]);

        $url = $request->input('url');
        $cloudinaryId = null;

        if ($request->hasFile('image')) {
            $result = $this->uploadToCloudinary($request->file('image'));
            $url = $result['url'];
            $cloudinaryId = $result['public_id'] ?? null;
        }

        if ($request->boolean('is_primary')) {
            $property->images()->update(['is_primary' => false]);
            $property->update(['primary_image' => $url]);
        }

        $image = PropertyImage::create([
            'property_id' => $property->id,
            'url' => $url,
            'cloudinary_id' => $cloudinaryId,
            'is_primary' => $request->boolean('is_primary'),
            'sort_order' => $property->images()->count(),
        ]);

        return response()->json($image, 201);
    }

    public function destroy(Request $request, Property $property, PropertyImage $propertyImage): JsonResponse
    {
        $this->authorizePropertyAccess($request, $property);

        if ($propertyImage->property_id !== $property->id) {
            return response()->json(['message' => 'Image not found for this property'], 404);
        }

        if ($propertyImage->cloudinary_id && config('services.cloudinary.cloud_name')) {
            $this->deleteFromCloudinary($propertyImage->cloudinary_id);
        }

        $propertyImage->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    private function uploadToCloudinary($file): array
    {
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        if ($cloudName && $apiKey && $apiSecret) {
            $timestamp = time();
            $params = "timestamp={$timestamp}" . $apiSecret;
            $signature = sha1($params);

            $response = Http::asMultipart()->post(
                "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload",
                [
                    ['name' => 'file', 'contents' => fopen($file->getRealPath(), 'r'), 'filename' => $file->getClientOriginalName()],
                    ['name' => 'api_key', 'contents' => $apiKey],
                    ['name' => 'timestamp', 'contents' => (string) $timestamp],
                    ['name' => 'signature', 'contents' => $signature],
                ]
            );

            if ($response->successful()) {
                return $response->json();
            }
        }

        $path = $file->store('properties', 'public');

        return [
            'url' => Storage::url($path),
            'public_id' => null,
        ];
    }

    private function deleteFromCloudinary(string $publicId): void
    {
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return;
        }

        $timestamp = time();
        $params = "public_id={$publicId}&timestamp={$timestamp}" . $apiSecret;
        $signature = sha1($params);

        Http::post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
            'public_id' => $publicId,
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
        ]);
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
}
