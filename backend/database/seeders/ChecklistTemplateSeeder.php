<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChecklistTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $visitTypes = \App\Models\VisitType::all();
        if ($visitTypes->isEmpty()) {
            $visitTypes = collect([
                \App\Models\VisitType::create(['nama_tipe' => 'Rawat ATM']),
                \App\Models\VisitType::create(['nama_tipe' => 'Checklist Kebersihan']),
            ]);
        }

        foreach ($visitTypes as $type) {
            $fields = [
                ['field_name' => 'lcd_monitor', 'label' => 'Kondisi LCD Monitor', 'field_type' => 'select', 'options' => ['Baik', 'Mati Total', 'Tertempel Tulisan']],
                ['field_name' => 'ac', 'label' => 'Kondisi AC', 'field_type' => 'select', 'options' => ['Dingin', 'Tidak Dingin', 'Bocor', 'Mati Total']],
                ['field_name' => 'fascia_atas', 'label' => 'Fascia Bagian Atas Mesin', 'field_type' => 'select', 'options' => ['Terkunci dan Rapat', 'Terkunci dan Renggang', 'Tidak Terkunci']],
                ['field_name' => 'fascia_bawah', 'label' => 'Fascia Bagian Bawah Mesin', 'field_type' => 'select', 'options' => ['Terkunci dan Rapat', 'Terkunci dan Renggang', 'Tidak Terkunci']],
                ['field_name' => 'lampu_booth', 'label' => 'Kondisi Lampu Booth Akrilik', 'field_type' => 'select', 'options' => ['Hidup', 'Mati']],
                ['field_name' => 'pintu_booth', 'label' => 'Pintu Booth / Kerangkeng', 'field_type' => 'select', 'options' => ['Terkunci', 'Tidak Terkunci']],
                ['field_name' => 'tempat_sampah', 'label' => 'Tempat Sampah', 'field_type' => 'select', 'options' => ['Ada', 'Tidak Ada']],
                ['field_name' => 'stiker_id', 'label' => 'Stiker ID ATM', 'field_type' => 'select', 'options' => ['Ada', 'Tidak Ada']],
                ['field_name' => 'stiker_denom', 'label' => 'Stiker Denom', 'field_type' => 'select', 'options' => ['Ada', 'Tidak Ada']],
                ['field_name' => 'stiker_kaca', 'label' => 'Stiker Kaca / Pintu', 'field_type' => 'select', 'options' => ['Baik', 'Tidak Baik']],
                ['field_name' => 'kondisi_pintu', 'label' => 'Kondisi Pintu / Ruangan', 'field_type' => 'select', 'options' => ['Baik', 'Tidak Baik']],
                ['field_name' => 'instalasi_kabel', 'label' => 'Kondisi Instalasi Kabel', 'field_type' => 'select', 'options' => ['Rapi', 'Tidak Rapi']],
                ['field_name' => 'plafond', 'label' => 'Plafond', 'field_type' => 'select', 'options' => ['Baik', 'Tidak Baik']],
                ['field_name' => 'lampu_ruangan', 'label' => 'Lampu Ruangan', 'field_type' => 'select', 'options' => ['Hidup', 'Redup', 'Mati', 'Tidak Ada Lampu']],
                ['field_name' => 'dinding_ruangan', 'label' => 'Dinding Ruangan', 'field_type' => 'select', 'options' => ['Baik', 'Tidak Baik']],
                ['field_name' => 'lantai_ruangan', 'label' => 'Lantai Ruangan', 'field_type' => 'select', 'options' => ['Baik', 'Tidak Baik']],
                ['field_name' => 'id_pelanggan_kwh', 'label' => 'ID Pelanggan KWH Meter', 'field_type' => 'select', 'options' => ['Sesuai', 'Tidak Sesuai']],
                ['field_name' => 'sisa_token', 'label' => 'Sisa Token Listrik', 'field_type' => 'number', 'options' => null],
                // Photos
                ['field_name' => 'foto_mesin', 'label' => 'Foto Mesin', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_ruangan', 'label' => 'Foto Ruangan', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_lantai', 'label' => 'Foto Lantai', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_sampah', 'label' => 'Foto Tempat Sampah', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_kaca', 'label' => 'Foto Kaca Ruangan', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_booth', 'label' => 'Foto Atas Booth', 'field_type' => 'file', 'options' => null],
                ['field_name' => 'foto_meteran', 'label' => 'Foto KWH Meter', 'field_type' => 'file', 'options' => null],
            ];

            foreach ($fields as $field) {
                \App\Models\ChecklistTemplate::updateOrCreate(
                    ['visit_type_id' => $type->id, 'field_name' => $field['field_name']],
                    ['label' => $field['label'], 'field_type' => $field['field_type'], 'options' => $field['options']]
                );
            }
        }
    }
}
