<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Location;
use App\Models\Schedule;
use App\Models\VisitType;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('app:sync-legacy-data')]
#[Description('Sync legacy db.json data with PostgreSQL and shift dates to April 2026')]
class SyncLegacyData extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = base_path('../legacy/db.json');
        if (!File::exists($path)) {
            $this->error('db.json not found at ' . $path);
            return;
        }

        $data = json_decode(File::get($path), true);
        if (!$data) {
            $this->error('Failed to parse db.json');
            return;
        }

        // 1. Sync Users
        foreach ($data['users'] as $u) {
            User::updateOrCreate(
                ['kode_user' => $u['kode_user']],
                [
                    'nama_user' => $u['nama_user'],
                    'password' => $u['password'], // User model's $casts will handle hashing if configured
                    'peran' => $u['peran'] ?? 'Petugas',
                    'cabang' => $u['cabang'] ?? 'Jakarta'
                ]
            );
        }
        $this->info('Users synced.');

        // 2. Sync Locations (Derived from jadwal or lokasi)
        $locationsSource = $data['lokasi'] ?? $data['jadwal'] ?? [];
        foreach ($locationsSource as $l) {
            if (!isset($l['kode_lokasi'])) continue;
            
            Location::updateOrCreate(
                ['kode_lokasi' => $l['kode_lokasi']],
                [
                    'lokasi' => $l['lokasi'] ?? $l['nama_lokasi'] ?? 'Unknown',
                    'alamat' => $l['alamat'] ?? $l['lokasi'] ?? 'Tanpa Alamat',
                    'latitude' => $l['latitude'] ?? (-6.1754 + (rand(-100, 100) / 10000)),
                    'longitude' => $l['longitude'] ?? (106.8272 + (rand(-100, 100) / 10000))
                ]
            );
        }
        $this->info('Locations synced.');

        // 3. Sync Schedules and Shift Dates
        $type = VisitType::firstOrCreate(['nama_tipe' => 'Rawat ATM']);
        
        foreach ($data['jadwal'] as $j) {
            $user = User::where('kode_user', $j['kode_user'])->first();
            $location = Location::where('kode_lokasi', $j['kode_lokasi'])->first();
            
            if (!$user || !$location) continue;

            // Date Shifting logic:
            // 06-11-2025 -> 2026-04-06
            // Periodic mapping for test week: April 6 - 12 (Monday - Sunday)
            $dayMap = [
                '06' => '06', // Mon
                '07' => '07', // Tue
                '08' => '08', // Wed
                '09' => '09', // Thu
                '10' => '10', // Fri
                '11' => '11', // Sat
                '12' => '12'  // Sun
            ];
            
            $day = substr($j['tanggal'], 0, 2);
            $newDay = $dayMap[$day] ?? '06';
            $newDate = "2026-04-" . $newDay;
            
            Schedule::updateOrCreate(
                ['kode_jadwal' => $j['kode_jadwal']],
                [
                    'tanggal' => $newDate,
                    'user_id' => $user->id,
                    'location_id' => $location->id,
                    'id_mesin' => $j['id_mesin'],
                    'visit_type_id' => $type->id,
                    'periode_awal' => '2026-04-06',
                    'periode_akhir' => '2026-04-12'
                ]
            );
        }
        $this->info('Schedules synced and dates shifted to April 6-12, 2026.');
    }
}
