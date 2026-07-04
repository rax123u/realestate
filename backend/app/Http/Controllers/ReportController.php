<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $propertyQuery = Property::query();
        $inquiryQuery = Inquiry::query();

        if (!$isAdmin) {
            $propertyIds = Property::where('user_id', $user->id)->pluck('id');
            $propertyQuery->where('user_id', $user->id);
            $inquiryQuery->whereIn('property_id', $propertyIds);
        }

        $listingPerformance = (clone $propertyQuery)
            ->select('id', 'title', 'city', 'status', 'listing_type', 'price', 'created_at')
            ->withCount('inquiries')
            ->orderByDesc('inquiries_count')
            ->limit(10)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'city' => $p->city,
                'status' => $p->status,
                'listing_type' => $p->listing_type,
                'price' => (float) $p->price,
                'inquiries_count' => $p->inquiries_count,
                'created_at' => $p->created_at,
            ]);

        $statusBreakdown = (clone $propertyQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $inquiryTrends = (clone $inquiryQuery)
            ->select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('count(*) as count'))
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $inquiryByStatus = (clone $inquiryQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $listingTypeBreakdown = (clone $propertyQuery)
            ->select('listing_type', DB::raw('count(*) as count'))
            ->groupBy('listing_type')
            ->pluck('count', 'listing_type');

        return response()->json([
            'listing_performance' => $listingPerformance,
            'status_breakdown' => $statusBreakdown,
            'listing_type_breakdown' => $listingTypeBreakdown,
            'inquiry_trends' => $inquiryTrends,
            'inquiry_by_status' => $inquiryByStatus,
            'summary' => [
                'total_properties' => (clone $propertyQuery)->count(),
                'active_listings' => (clone $propertyQuery)->where('status', 'active')->count(),
                'total_inquiries' => (clone $inquiryQuery)->count(),
                'new_inquiries' => (clone $inquiryQuery)->where('status', 'new')->count(),
            ],
        ]);
    }
}
