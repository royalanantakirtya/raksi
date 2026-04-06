<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\VisitResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kunjungan' => 'required|unique:visits',
            'tanggal' => 'required|date',
            'location_id' => 'required|exists:locations,id',
            'visit_type_id' => 'required|exists:visit_types,id',
            'terjadwal' => 'required|in:terjadwal,tidak terjadwal',
            'waktu_mulai' => 'nullable',
            'waktu_selesai' => 'nullable',
            'durasi' => 'nullable',
            'responses' => 'required|array',
            'responses.*.template_id' => 'required|exists:checklist_templates,id',
            'responses.*.value' => 'nullable',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $visit = Visit::create([
                'kode_kunjungan' => $validated['kode_kunjungan'],
                'tanggal' => $validated['tanggal'],
                'user_id' => $request->user()->id,
                'location_id' => $validated['location_id'],
                'id_mesin' => $request->id_mesin,
                'visit_type_id' => $validated['visit_type_id'],
                'terjadwal' => $validated['terjadwal'],
                'waktu_mulai' => $validated['waktu_mulai'],
                'waktu_selesai' => $validated['waktu_selesai'],
                'durasi' => $validated['durasi'],
            ]);

            foreach ($validated['responses'] as $resp) {
                VisitResponse::create([
                    'visit_id' => $visit->id,
                    'template_id' => $resp['template_id'],
                    'value' => $resp['value'],
                ]);
            }

            return response()->json([
                'message' => 'Laporan kunjungan berhasil disimpan.',
                'visit' => $visit->load('responses')
            ], 201);
        });
    }

    public function show($id)
    {
        $visit = Visit::with(['user', 'location', 'visitType', 'responses', 'findings'])->findOrFail($id);
        return response()->json($visit);
    }
}
