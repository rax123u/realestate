-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2026 at 11:15 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aurelius_realestate`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `message`, `property_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Michael Chang', 'm.chang@example.com', 'Is the price open to negotiation? I am looking to make an offer soon.', NULL, 'responded', '2026-05-27 14:05:39', '2026-05-27 14:05:39'),
(2, 'David Beckham', 'david.b@example.com', 'Beautiful property! I would like to review the HOA documents and property disclosures.', NULL, 'new', '2026-03-27 14:05:39', '2026-03-27 14:05:39'),
(3, 'Carlos Santana', 'carlos.s@example.com', 'Beautiful property! I would like to review the HOA documents and property disclosures.', NULL, 'read', '2026-06-22 14:05:39', '2026-06-22 14:05:39'),
(4, 'David Beckham', 'david.b@example.com', 'Could you provide more details regarding the home automation system and security configuration?', 2, 'responded', '2026-07-01 14:05:39', '2026-07-01 14:05:39'),
(5, 'Carlos Santana', 'carlos.s@example.com', 'I am extremely interested in scheduling a private viewing of this residence. Please let me know your availability for next week.', 2, 'responded', '2026-05-21 14:05:39', '2026-07-03 14:11:34'),
(6, 'Carlos Santana', 'carlos.s@example.com', 'Is the price open to negotiation? I am looking to make an offer soon.', 3, 'new', '2026-02-14 14:05:39', '2026-02-14 14:05:39'),
(7, 'Anna Ivanova', 'anna.i@example.com', 'I am extremely interested in scheduling a private viewing of this residence. Please let me know your availability for next week.', 3, 'responded', '2026-05-31 14:05:39', '2026-05-31 14:05:39'),
(8, 'Yasmin Al-Fayed', 'yasmin.a@example.com', 'Beautiful property! I would like to review the HOA documents and property disclosures.', 3, 'new', '2026-06-12 14:05:39', '2026-06-12 14:05:39'),
(9, 'Michael Chang', 'm.chang@example.com', 'Please contact me at your earliest convenience to discuss the purchasing procedure.', 3, 'archived', '2026-03-22 14:05:39', '2026-03-22 14:05:39'),
(10, 'David Beckham', 'david.b@example.com', 'Beautiful property! I would like to review the HOA documents and property disclosures.', 4, 'archived', '2026-04-18 14:05:39', '2026-04-18 14:05:39'),
(11, 'Michael Chang', 'm.chang@example.com', 'Could you provide more details regarding the home automation system and security configuration?', 4, 'read', '2026-04-08 14:05:39', '2026-04-08 14:05:39'),
(12, 'Carlos Santana', 'carlos.s@example.com', 'I am extremely interested in scheduling a private viewing of this residence. Please let me know your availability for next week.', 4, 'responded', '2026-05-16 14:05:39', '2026-05-16 14:05:39'),
(13, 'Yasmin Al-Fayed', 'yasmin.a@example.com', 'Could you provide more details regarding the home automation system and security configuration?', 4, 'new', '2026-03-01 14:05:39', '2026-03-01 14:05:39'),
(14, 'Anna Ivanova', 'anna.i@example.com', 'I am extremely interested in scheduling a private viewing of this residence. Please let me know your availability for next week.', 4, 'archived', '2026-02-19 14:05:39', '2026-02-19 14:05:39'),
(15, 'Emily Watson', 'emily.w@example.com', 'Can we arrange a video call walkthrough of the penthouse/estate?', 5, 'responded', '2026-03-16 14:05:39', '2026-03-16 14:05:39'),
(16, 'Emily Watson', 'emily.w@example.com', 'Is the price open to negotiation? I am looking to make an offer soon.', 5, 'archived', '2026-03-11 14:05:39', '2026-03-11 14:05:39'),
(17, 'Anna Ivanova', 'anna.i@example.com', 'Could you provide more details regarding the home automation system and security configuration?', 5, 'responded', '2026-01-15 14:05:39', '2026-01-15 14:05:39'),
(18, 'Sophia Laurent', 'sophia.l@example.com', 'Could you provide more details regarding the home automation system and security configuration?', 5, 'new', '2026-05-07 14:05:39', '2026-05-07 14:05:39'),
(19, 'Sophia Laurent', 'sophia.l@example.com', 'Beautiful property! I would like to review the HOA documents and property disclosures.', 6, 'responded', '2026-01-28 14:05:39', '2026-01-28 14:05:39'),
(20, 'Carlos Santana', 'carlos.s@example.com', 'Is the price open to negotiation? I am looking to make an offer soon.', 6, 'new', '2026-06-29 14:05:39', '2026-06-29 14:05:39'),
(21, 'Admin User', 'admin@aurelius.com', 'uhuhuh', 2, 'new', '2026-07-03 14:52:33', '2026-07-03 14:52:33'),
(22, 'Muhammad Rayyan', 'rayyanmuhammad224@gmail.com', 'fhfhfhffh', NULL, 'new', '2026-07-04 05:13:23', '2026-07-04 05:13:23'),
(23, 'Muhammad Rayyan', 'rayyanmuhammad224@gmail.com', '223', NULL, 'new', '2026-07-04 05:14:35', '2026-07-04 05:14:35'),
(24, 'James Sterling', 'owner@aurelius.com', 'hbhb', 11, 'read', '2026-07-04 06:32:37', '2026-07-04 06:33:30');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_02_000001_add_role_to_users_table', 1),
(5, '2024_01_02_000002_create_properties_table', 1),
(6, '2024_01_02_000003_create_property_images_table', 1),
(7, '2024_01_02_000004_create_favorites_table', 1),
(8, '2024_01_02_000005_create_inquiries_table', 1),
(9, '2024_01_02_000006_create_testimonials_table', 1),
(10, '2024_01_02_000007_create_personal_access_tokens_table', 1),
(11, '2026_07_03_174729_add_listing_fields_to_properties_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 2, 'auth-token', '5e318e4fb63fac24465a2100a53b44f49e6e2fa32acd0930422cf34cd5dd5c4f', '[\"*\"]', '2026-07-04 13:34:30', NULL, '2026-07-03 14:12:22', '2026-07-04 13:34:30'),
(18, 'App\\Models\\User', 3, 'auth-token', 'dc9ba284a45865054738b8dc7bee823380916d202f354529f8a85baf1d8a46ab', '[\"*\"]', '2026-07-04 11:47:35', NULL, '2026-07-04 05:14:46', '2026-07-04 11:47:35'),
(19, 'App\\Models\\User', 4, 'auth-token', 'c60213c70206663ebd1c9c7d520f9704961a87ca82bf53a9a7e02e08c10f70c4', '[\"*\"]', '2026-07-04 06:33:31', NULL, '2026-07-04 06:30:48', '2026-07-04 06:33:31'),
(20, 'App\\Models\\User', 5, 'auth-token', '75c4ffb52e57c0172d092ad35f979a27981820e45d30ddcd552b2f123b078ce4', '[\"*\"]', '2026-07-04 06:38:06', NULL, '2026-07-04 06:36:40', '2026-07-04 06:38:06');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `bedrooms` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `bathrooms` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `area` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `primary_image` varchar(255) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `showcase` tinyint(1) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `listing_type` enum('sale','rent') NOT NULL DEFAULT 'sale',
  `property_type` enum('house','apartment','villa','commercial','land') NOT NULL DEFAULT 'house',
  `status` enum('active','sold','rented','expired') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title`, `location`, `city`, `price`, `bedrooms`, `bathrooms`, `area`, `description`, `video_url`, `primary_image`, `amenities`, `featured`, `showcase`, `user_id`, `created_at`, `updated_at`, `listing_type`, `property_type`, `status`) VALUES
(2, 'Villa Serenity', 'Malibu, California', 'Malibu', 18900000.00, 6, 7, 8400, 'An oceanfront masterpiece blending California modernism with Mediterranean warmth. Floor-to-ceiling glass frames endless Pacific horizons.', 'https://assets.mixkit.co/videos/44370/44370-360.mp4', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', '[\"Oceanfront Pool\",\"Private Beach Access\",\"Home Theater\",\"Chef\'s Kitchen\",\"Spa Suite\",\"EV Charging\"]', 1, 1, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39', 'sale', 'villa', 'active'),
(3, 'The Obsidian Estate', 'Aspen, Colorado', 'Aspen', 24750000.00, 8, 9, 12000, 'A mountain sanctuary where contemporary architecture meets alpine grandeur. Heated driveways, ski-in access, and a glass-walled great room.', 'https://assets.mixkit.co/videos/28844/28844-360.mp4', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', '[\"Ski Room\",\"Indoor Pool\",\"Wine Vault\",\"Helipad\",\"Guest Pavilion\",\"Wellness Center\"]', 1, 1, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39', 'sale', 'house', 'active'),
(4, 'Coastal Horizon', 'Miami Beach, Florida', 'Miami', 9800000.00, 5, 6, 6100, 'Art deco elegance reimagined for the modern era. This waterfront residence features a floating staircase and curated art gallery.', NULL, 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80', '[\"Marina Berth\",\"Rooftop Lounge\",\"Art Gallery\",\"Smart Climate\",\"Butler\'s Pantry\"]', 1, 0, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39', 'rent', 'house', 'active'),
(5, 'The Kensington Manor', 'London, United Kingdom', 'London', 31200000.00, 7, 8, 9800, 'A Grade II listed townhouse meticulously restored with contemporary interventions. Private garden, library, and staff quarters.', NULL, 'https://images.unsplash.com/photo-1600047509807-ba8f84d4fa67?w=1200&q=80', '[\"Private Garden\",\"Library\",\"Staff Quarters\",\"Period Features\",\"Security Suite\"]', 1, 1, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39', 'sale', 'house', 'sold'),
(6, 'Desert Mirage', 'Scottsdale, Arizona', 'Scottsdale', 7200000.00, 4, 5, 4800, 'Desert modernism at its finest — rammed earth walls, cantilevered pools, and uninterrupted Sonoran Desert vistas.', NULL, 'https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1200&q=80', '[\"Desert Pool\",\"Outdoor Kitchen\",\"Fire Pit Lounge\",\"Solar Array\",\"Meditation Pavilion\"]', 0, 0, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39', 'rent', 'villa', 'rented'),
(7, 'flat', 'smt', 'mardan', 122222333.00, 2, 3, 1200, NULL, NULL, NULL, '[]', 1, 1, 1, '2026-07-03 14:11:04', '2026-07-03 14:11:04', 'sale', 'apartment', 'rented'),
(9, 'New apartment', 'mardan', 'Mardan', 222222.00, 2, 3, 3212, NULL, NULL, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D', '[]', 0, 0, 3, '2026-07-04 04:19:47', '2026-07-04 04:23:54', 'sale', 'house', 'active'),
(11, 'New apartment', 'KPK', 'Peshawar', 200000.00, 3, 4, 1200, NULL, NULL, 'http://localhost:8000/storage/properties/YbxSV5b1NQ8Elvuyj2B8jem7lLRTBr5q6Nhf89Nv.jpg', '[]', 0, 0, 4, '2026-07-04 06:32:03', '2026-07-04 06:32:03', 'rent', 'house', 'active'),
(12, 'Apartment', 'Punjab', 'Islamabad', 120000.00, 3, 2, 1300, NULL, NULL, 'http://localhost:8000/storage/properties/G2znUsslFdcMuurFnOxMhgxD4eZQGnS1qHMSniEw.jpg', '[]', 0, 0, 5, '2026-07-04 06:37:51', '2026-07-04 06:37:52', 'rent', 'house', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `cloudinary_id` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `url`, `cloudinary_id`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(4, 2, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', NULL, 1, 0, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(5, 2, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', NULL, 0, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(6, 3, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', NULL, 1, 0, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(7, 3, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80', NULL, 0, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(8, 4, 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80', NULL, 1, 0, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(9, 5, 'https://images.unsplash.com/photo-1600047509807-ba8f84d4fa67?w=1200&q=80', NULL, 1, 0, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(10, 6, 'https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1200&q=80', NULL, 1, 0, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(11, 9, 'http://localhost:8000/storage/properties/EizXZpGgnQ3JYwow8DFuSlZaVDQAfAWm72HyPOgp.jpg', NULL, 1, 0, '2026-07-04 04:22:17', '2026-07-04 04:22:17'),
(12, 11, 'http://localhost:8000/storage/properties/YbxSV5b1NQ8Elvuyj2B8jem7lLRTBr5q6Nhf89Nv.jpg', NULL, 1, 0, '2026-07-04 06:32:03', '2026-07-04 06:32:03'),
(13, 12, 'http://localhost:8000/storage/properties/G2znUsslFdcMuurFnOxMhgxD4eZQGnS1qHMSniEw.jpg', NULL, 1, 0, '2026-07-04 06:37:52', '2026-07-04 06:37:52');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fqUBRCCrVgdUzt6uyu0qD182k5HreMtisa4KYuox', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.121.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2dTSDdyMGxRMklNeDlDNGo4WVF2RlhJRWNqMko4dm1ESUQwa296TCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783488414),
('fZq3aFAftttkTT9WxSNa0oHUcyn9piF0FW1DaMFS', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.121.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRWIwbFpNS0hwNlZ6RkNqNE9GZ1VUZVpKVndrMTJJNEFuZE1TRHZVbiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783105586),
('Zs6Nyjl2APg6SKl7yMMEpvpZV6Z0cNBmIvrfs2AK', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.121.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjJDOEV4b3BjTFN3NFU0bUxNallMMEhzMXdnREZpakxyNWRqdWQ4dyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783488434);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `quote` text NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `role`, `quote`, `avatar`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Victoria Ashford', 'CEO, Ashford Holdings', 'Aurelius transformed our property search into an experience of pure elegance. Their attention to detail is unmatched in the luxury market.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 1, 1, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(2, 'Marcus Chen', 'Tech Entrepreneur', 'From the first viewing to closing, every interaction felt bespoke and refined. This is how luxury real estate should be done.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 1, 2, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(3, 'Elena Rodriguez', 'Art Collector', 'The properties they curate are architectural masterpieces. Aurelius doesn\'t just sell homes — they deliver lifestyles.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 1, 3, '2026-07-03 14:05:39', '2026-07-03 14:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@aurelius.com', NULL, '$2y$12$.Uy2Xq9KJM.jvFw3iZOiK.ucJHxFrQAu5Zps.IH9sekClJ0ONRTWW', 'admin', NULL, '2026-07-03 14:05:38', '2026-07-03 14:05:38'),
(2, 'Demo Buyer', 'user@aurelius.com', NULL, '$2y$12$Y2t1AguWE3QhcCAucQtS6O3rGGmaF0HrckcJj9o8Zidm/5.aLJ0Iu', 'user', NULL, '2026-07-03 14:05:38', '2026-07-03 14:05:38'),
(3, 'Sarah Mitchell', 'agent@aurelius.com', NULL, '$2y$12$UyTFVs6OkRqc88GPlzoPOuPYjuJQaXWaqwvwwJ3jDjFkTdnCG83QK', 'agent', NULL, '2026-07-03 14:05:38', '2026-07-03 14:05:38'),
(4, 'James Sterling', 'owner@aurelius.com', NULL, '$2y$12$N14t7iibB59i667s2pS/A.qoRLEPeFUp9s5VGv0gC.L8FZQW6t1Wu', 'owner', NULL, '2026-07-03 14:05:39', '2026-07-03 14:05:39'),
(5, 'Muhammad Rayyan', 'rayyanmuhammad224@gmail.com', NULL, '$2y$12$LltILcSjbjKz3GnoQttqwuJ5KFZ0PIR3sTg9fHeqqXLd1VuLsDgr2', 'owner', NULL, '2026-07-04 06:36:40', '2026-07-04 06:36:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorites_user_id_property_id_unique` (`user_id`,`property_id`),
  ADD KEY `favorites_property_id_foreign` (`property_id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inquiries_property_id_foreign` (`property_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `properties_user_id_foreign` (`user_id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_images_property_id_foreign` (`property_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
