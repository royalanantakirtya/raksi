<?php

namespace App\Services;

use App\Models\Visit;
use App\Models\VisitResponse;
use App\Repositories\VisitRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * VisitService - Ver: 1.0.6 (Last Sync: 2026-04-14)
 */
class VisitService
{
    public function __construct(private VisitRepositoryInterface $visitRepository) {}

    public function store(array $data, int $userId): Visit
    {
        return DB::transaction(function () use ($data, $userId) {
            // Format ISO Datetime from frontend to Database-friendly TIME (H:i:s)
            $waktuMulai = isset($data['waktu_mulai']) ? Carbon::parse($data['waktu_mulai'])->toTimeString() : null;
            $waktuSelesai = isset($data['waktu_selesai']) ? Carbon::parse($data['waktu_selesai'])->toTimeString() : null;

            $visit = $this->visitRepository->create([
                'kode_kunjungan' => $data['kode_kunjungan'],
                'tanggal'        => $data['tanggal'],
                'user_id'        => $userId,
                'location_id'    => $data['location_id'],
                'id_mesin'       => $data['id_mesin'] ?? null,
                'visit_type_id'  => $data['visit_type_id'],
                'terjadwal'      => $data['terjadwal'],
                'waktu_mulai'    => $waktuMulai,
                'waktu_selesai'  => $waktuSelesai,
                'durasi'         => $data['durasi'] ?? null,
            ]);

            // Save Responses
            foreach ($data['responses'] as $resp) {
                $value = $resp['value'];
                
                // Handle file uploads in responses if passed as file objects
                if ($value instanceof \Illuminate\Http\UploadedFile) {
                    if (!$value->isValid()) {
                        throw new \Exception("Gagal mengunggah file responses: " . $value->getErrorMessage());
                    }
                    $path = $value->store('uploads/responses', 'public');
                    $value = $path;
                }

                VisitResponse::create([
                    'visit_id'    => $visit->id,
                    'template_id' => $resp['template_id'],
                    'value'       => $value,
                ]);
            }

            // Save Findings
            if (!empty($data['findings'])) {
                foreach ($data['findings'] as $findingData) {
                    $fotoPath = null;
                    if (isset($findingData['foto_temuan']) && $findingData['foto_temuan'] instanceof \Illuminate\Http\UploadedFile) {
                        if (!$findingData['foto_temuan']->isValid()) {
                            throw new \Exception("Gagal mengunggah foto temuan: " . $findingData['foto_temuan']->getErrorMessage());
                        }
                        $fotoPath = $findingData['foto_temuan']->store('uploads/findings', 'public');
                    }

                    // Generate Ticket Number (Legacy style: UserID + YYMMDD + HHMMSS + Rand)
                    $user = \App\Models\User::find($userId);
                    $kodeUser = $user ? substr($user->kode_user, -6) : '000000';
                    $ticket = $kodeUser . date('ymdHis') . rand(100, 999);

                    \App\Models\Finding::create([
                        'nomor_tiket' => $ticket,
                        'visit_id'    => $visit->id,
                        'tanggal'     => $data['tanggal'],
                        'user_id'     => $userId,
                        'location_id' => $data['location_id'],
                        'temuan'      => $findingData['temuan'],
                        'foto_temuan' => $fotoPath,
                        'status'      => 'open',
                    ]);
                }
            }

            // Update Schedule Status if exists
            \App\Models\Schedule::where('location_id', $data['location_id'])
                ->where('user_id', $userId)
                ->where('tanggal', $data['tanggal'])
                ->where('status', 'open')
                ->update(['status' => 'closed']);

            return $visit->load(['responses', 'findings']);
        });
    }

    public function findById(int $id): Visit
    {
        return $this->visitRepository->findById($id);
    }

    /**
     * fetchAllVisits - Unique method for history records
     */
    public function fetchAllVisits(?int $userId = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->visitRepository->getAll($userId);
    }
}
