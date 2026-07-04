<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ListingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, ['admin', 'agent', 'owner'], true)) {
            return response()->json(['message' => 'Unauthorized. Listing access required.'], 403);
        }

        return $next($request);
    }
}
