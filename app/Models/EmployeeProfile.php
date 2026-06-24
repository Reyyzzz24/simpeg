<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeProfile extends Model
{
    protected $fillable = [
        'employee_id',
        'nuptk',
        'agama',
        'alamat_jalan',
        'rt',
        'rw',
        'nama_dusun',
        'desa_kelurahan',
        'kecamatan',
        'kode_pos',
        'telepon',
        'hp',
        'email_pribadi',
        'nama_ibu_kandung',
        'status_perkawinan',
        'nama_suami_istri',
        'nip_suami_istri',
        'pekerjaan_suami_istri',
        'kewarganegaraan',
        'nik',
        'no_kk',
        'jenis_ptk',
        'tugas_tambahan',
        'sk_cpns',
        'tanggal_cpns',
        'sk_pengangkatan',
        'tmt_pengangkatan',
        'lembaga_pengangkatan',
        'pangkat_golongan',
        'sumber_gaji',
        'tmt_pns',
        'karpeg',
        'karis_karsu',
        'nuks',
        'lisensi_kepala_sekolah',
        'diklat_kepengawasan',
        'keahlian_braille',
        'keahlian_bahasa_isyarat',
        'npwp',
        'nama_wajib_pajak',
        'bank',
        'nomor_rekening_bank',
        'rekening_atas_nama',
        'lintang',
        'bujur'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}