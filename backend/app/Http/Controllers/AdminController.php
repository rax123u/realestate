<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'properties' => Property::count(),
            'inquiries' => Inquiry::count(),
            'users' => User::count(),
            'favorites' => Favorite::count(),
            'new_inquiries' => Inquiry::where('status', 'new')->count(),
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->latest()
            ->get();

        return response()->json($users);
    }
}
