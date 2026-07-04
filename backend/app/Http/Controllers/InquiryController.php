<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Inquiry::with('property:id,title,city,status')->latest();

        if (!$request->user()->isAdmin()) {
            $propertyIds = Property::where('user_id', $request->user()->id)->pluck('id');
            $query->whereIn('property_id', $propertyIds);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
            'property_id' => 'nullable|exists:properties,id',
        ]);

        $inquiry = Inquiry::create([
            ...$validated,
            'status' => 'new',
        ]);

        $inquiry->load('property:id,title');

        return response()->json($inquiry, 201);
    }

    public function update(Request $request, Inquiry $inquiry): JsonResponse
    {
        $this->authorizeInquiryAccess($request, $inquiry);

        $validated = $request->validate([
            'status' => 'required|in:new,read,responded,archived',
        ]);

        $inquiry->update($validated);

        return response()->json($inquiry->load('property:id,title'));
    }

    public function destroy(Request $request, Inquiry $inquiry): JsonResponse
    {
        $this->authorizeInquiryAccess($request, $inquiry);
        $inquiry->delete();

        return response()->json(['message' => 'Inquiry deleted successfully']);
    }

    private function authorizeInquiryAccess(Request $request, Inquiry $inquiry): void
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return;
        }

        if (!$inquiry->property_id) {
            abort(403, 'You do not have permission to manage this inquiry.');
        }

        $ownsProperty = Property::where('id', $inquiry->property_id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$ownsProperty) {
            abort(403, 'You do not have permission to manage this inquiry.');
        }
    }
}
