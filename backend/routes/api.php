<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/featured', [PropertyController::class, 'featured']);
Route::get('/properties/showcase', [PropertyController::class, 'showcase']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::post('/inquiries', [InquiryController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{property}', [FavoriteController::class, 'toggle']);

    Route::middleware('listing')->group(function () {
        Route::get('/my-properties', [PropertyController::class, 'myListings']);
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{property}', [PropertyController::class, 'update']);
        Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);
        Route::post('/properties/{property}/images', [PropertyImageController::class, 'store']);
        Route::delete('/properties/{property}/images/{propertyImage}', [PropertyImageController::class, 'destroy']);
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/inquiries', [InquiryController::class, 'index']);
        Route::patch('/inquiries/{inquiry}', [InquiryController::class, 'update']);
        Route::delete('/inquiries/{inquiry}', [InquiryController::class, 'destroy']);
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/users', [AdminController::class, 'users']);
    });
});
