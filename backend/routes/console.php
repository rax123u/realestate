<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Property;
use App\Models\PropertyImage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('images:compress', function () {
    $this->info('Starting database image compression...');

    $compressBase64 = function ($base64String) {
        if (strpos($base64String, 'data:image/') !== 0) {
            return $base64String;
        }

        // Extract mime type and base64 data
        preg_match('/^data:([^;]+);base64,(.*)$/', $base64String, $matches);
        if (count($matches) < 3) {
            return $base64String;
        }

        $mimeType = $matches[1];
        $base64Data = $matches[2];
        $binaryData = base64_decode($base64Data);

        // Create temporary file
        $tempPath = tempnam(sys_get_temp_dir(), 'laravel_img_comp');
        file_put_contents($tempPath, $binaryData);

        // Compress
        // Get original dimensions
        list($width, $height) = @getimagesize($tempPath);
        if (!$width || !$height) {
            @unlink($tempPath);
            return $base64String;
        }

        $maxDim = 1200;
        $newWidth = $width;
        $newHeight = $height;

        if ($width > $maxDim || $height > $maxDim) {
            if ($width > $height) {
                $newWidth = $maxDim;
                $newHeight = (int) ($height * ($maxDim / $width));
            } else {
                $newHeight = $maxDim;
                $newWidth = (int) ($width * ($maxDim / $height));
            }
        }

        $srcImage = null;
        if ($mimeType === 'image/jpeg' || $mimeType === 'image/jpg') {
            $srcImage = @imagecreatefromjpeg($tempPath);
        } elseif ($mimeType === 'image/png') {
            $srcImage = @imagecreatefrompng($tempPath);
        } elseif ($mimeType === 'image/webp') {
            $srcImage = @imagecreatefromwebp($tempPath);
        } elseif ($mimeType === 'image/gif') {
            $srcImage = @imagecreatefromgif($tempPath);
        }

        if (!$srcImage) {
            @unlink($tempPath);
            return $base64String;
        }

        $dstImage = imagecreatetruecolor($newWidth, $newHeight);
        if ($mimeType === 'image/png' || $mimeType === 'image/webp') {
            imagealphablending($dstImage, false);
            imagesavealpha($dstImage, true);
            $transparent = imagecolorallocatealpha($dstImage, 255, 255, 255, 127);
            imagefilledrectangle($dstImage, 0, 0, $newWidth, $newHeight, $transparent);
        }

        imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        ob_start();
        if ($mimeType === 'image/png') {
            imagepng($dstImage, null, 7);
        } elseif ($mimeType === 'image/webp') {
            imagewebp($dstImage, null, 70);
        } elseif ($mimeType === 'image/gif') {
            imagegif($dstImage);
        } else {
            imagejpeg($dstImage, null, 70);
        }
        $compressedData = ob_get_clean();

        imagedestroy($srcImage);
        imagedestroy($dstImage);
        @unlink($tempPath);

        return 'data:' . $mimeType . ';base64,' . base64_encode($compressedData);
    };

    // 1. Process Property Primary Images
    $properties = Property::where('primary_image', 'like', 'data:image/%')->get();
    $this->info("Found {$properties->count()} properties with base64 primary images.");
    foreach ($properties as $property) {
        $oldSize = strlen($property->primary_image);
        $compressed = $compressBase64($property->primary_image);
        $newSize = strlen($compressed);
        
        if ($newSize < $oldSize) {
            $property->primary_image = $compressed;
            $property->save();
            $savings = round((($oldSize - $newSize) / $oldSize) * 100, 1);
            $this->line("Compressed property ID {$property->id} primary image: " . round($oldSize/1024) . "KB -> " . round($newSize/1024) . "KB (-{$savings}%)");
        }
    }

    // 2. Process Additional Images
    $images = PropertyImage::where('url', 'like', 'data:image/%')->get();
    $this->info("Found {$images->count()} additional images with base64 strings.");
    foreach ($images as $img) {
        $oldSize = strlen($img->url);
        $compressed = $compressBase64($img->url);
        $newSize = strlen($compressed);
        
        if ($newSize < $oldSize) {
            $img->url = $compressed;
            $img->save();
            $savings = round((($oldSize - $newSize) / $oldSize) * 100, 1);
            $this->line("Compressed property image ID {$img->id}: " . round($oldSize/1024) . "KB -> " . round($newSize/1024) . "KB (-{$savings}%)");
        }
    }

    $this->info('Image compression completed successfully!');
})->purpose('Compress existing base64 images in database');
