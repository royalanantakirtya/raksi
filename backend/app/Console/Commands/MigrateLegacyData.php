<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use App\Models\User;
use App\Models\Location;
use App\Models\VisitType;
use App\Models\Schedule;
use App\Models\Visit;
use App\Models\Finding;
use App\Models\ChecklistTemplate;

class MigrateLegacyData extends Command
{
    protected $signature = 'migrate:legacy-data';
    protected $description = 'Migrate data from legacy db.json to Supabase';

    public function handle()
    {
        $jsonPath = base_path('../legacy/db.json');
        if (!File::exists($jsonPath)) {
            $this->error("File db.json tidak ditemukan di $jsonPath");
            return;
        }

        $data = json_decode(File::get($jsonPath), true);
        $this->info("Memulai migrasi data...");

        DB::transaction(function () use ($data) {
            // 1. Migrate Visit Types & Templates
            $this->migrateVisitTypesAndTemplates($data);

            // 2. Migrate Users
            $this->migrateUsers($data['users'] ?? []);

            // 3. Migrate Locations
            $this->migrateLocations($data['lokasi'] ?? []);

            // 4. Migrate Schedules
            $this->migrateSchedules($data['jadwal'] ?? []);

            // 5. Migrate Visits & Findings
            $this->migrateVisits($data['kunjungan'] ?? []);
            $this->migrateFindings($data['temuan'] ?? []);
        });

        $this->info("Migrasi selesai!");
    }

    private function migrateVisitTypesAndTemplates($data)
    {
        $this->info("Migrasi Tipe Kunjungan & Template...");
        // Ambil tipe unik dari jadwal
        $types = collect($data['jadwal'] ?? [])->pluck('tipe')->unique();
        
        foreach ($types as $typeName) {
            if (!$typeName) continue;
            $visitType = VisitType::firstOrCreate(['nama_tipe' => $typeName]);
            
            // Jika "Rawat ATM", buat template default berdasarkan field di db.json
            if ($typeName == 'Rawat ATM') {
                $fields = [
                    ['kondisi_lcd_monitor', 'Kondisi LCD Monitor', 'select', ['Baik', 'Rusak']],
                    ['kondisi_ac', 'Kondisi AC', 'select', ['Dingin', 'Tidak Dingin']],
                    ['pintu_booth_kerangkeng', 'Pintu Booth/Kerangkeng', 'select', ['Terkunci', 'Tidak Terkunci']],
                    ['sisa_token_listrik', 'Sisa Token Listrik', 'number', null],
                ];

                foreach ($fields as [$name, $label, $type, $options]) {
                    ChecklistTemplate::updateOrCreate(
                        ['visit_type_id' => $visitType->id, 'field_name' => $name],
                        [
                            'label' => $label, 
                            'field_type' => $type, 
                            'options' => $options ? json_encode($options) : null,
                            'is_required' => true
                        ]
                    );
                }
            }
        }
    }

    private function migrateUsers($users)
    {
        $this->info("Migrasi User (" . count($users) . " data)...");
        foreach ($users as $u) {
            User::updateOrCreate(
                ['kode_user' => $u['kode_user']],
                [
                    'nama_user' => $u['nama_user'],
                    'password' => Hash::make($u['password']),
                    'peran' => $u['peran'],
                    'cabang' => $u['cabang'],
                ]
            );
        }
    }

    private function migrateLocations($locations)
    {
        $this->info("Migrasi Lokasi (" . count($locations) . " data)...");
        foreach ($locations as $l) {
            Location::updateOrCreate(
                ['kode_lokasi' => $l['kode_lokasi']],
                [
                    'lokasi' => $l['nama_lokasi'],
                    'alamat' => $l['alamat'],
                    'latitude' => $l['latitude'],
                    'longitude' => $l['longitude'],
                ]
            );
        }
    }

    private function migrateSchedules($schedules)
    {
        $this->info("Migrasi Jadwal (" . count($schedules) . " data)...");
        foreach ($schedules as $s) {
            $user = User::where('kode_user', $s['kode_user'])->first();
            $location = Location::where('kode_lokasi', $s['kode_lokasi'])->first();
            $type = VisitType::where('nama_tipe', $s['tipe'])->first();

            if ($user && $location && $type) {
                Schedule::updateOrCreate(
                    ['kode_jadwal' => $s['kode_jadwal']],
                    [
                        'tanggal' => date('Y-m-d', strtotime($s['tanggal'])),
                        'user_id' => $user->id,
                        'location_id' => $location->id,
                        'id_mesin' => $s['id_mesin'],
                        'visit_type_id' => $type->id,
                        'periode_awal' => date('Y-m-d', strtotime($s['periode_awal'])),
                        'periode_akhir' => date('Y-m-d', strtotime($s['periode_akhir'])),
                    ]
                );
            }
        }
    }

    private function migrateVisits($visits)
    {
        $this->info("Migrasi Riwayat Kunjungan (" . count($visits) . " data)...");
        foreach ($visits as $v) {
            $user = User::where('kode_user', $v['kode_user'])->first();
            $location = Location::where('kode_lokasi', $v['kode_lokasi'])->first();
            $type = VisitType::where('nama_tipe', $v['jenis_kunjungan'])->first();

            if ($user && $location && $type) {
                Visit::updateOrCreate(
                    ['kode_kunjungan' => $v['kode_kunjungan']],
                    [
                        'tanggal' => date('Y-m-d', strtotime($v['tanggal'])),
                        'user_id' => $user->id,
                        'location_id' => $location->id,
                        'id_mesin' => $v['id_mesin'] ?? null,
                        'visit_type_id' => $type->id,
                        'terjadwal' => $v['terjadwal'] ?? 'terjadwal',
                        'waktu_mulai' => $v['waktu_mulai'] ?? null,
                        'waktu_selesai' => $v['waktu_selesai'] ?? null,
                        'durasi' => $v['durasi'] ?? null,
                    ]
                );
            }
        }
    }

    private function migrateFindings($findings)
    {
        $this->info("Migrasi Temuan (" . count($findings) . " data)...");
        foreach ($findings as $f) {
            $visit = Visit::where('kode_kunjungan', $f['kode_kunjungan'])->first();
            $user = User::where('kode_user', $f['kode_user'])->first();
            $location = Location::where('kode_lokasi', $f['kode_lokasi'])->first();

            if ($visit && $user && $location) {
                Finding::updateOrCreate(
                    ['nomor_tiket' => $f['nomor_tiket']],
                    [
                        'visit_id' => $visit->id,
                        'tanggal' => date('Y-m-d', strtotime($f['tanggal'])),
                        'user_id' => $user->id,
                        'location_id' => $location->id,
                        'temuan' => $f['temuan'],
                        'foto_temuan' => $f['foto_temuan'],
                        'status' => 'closed'
                    ]
                );
            }
        }
    }
}
