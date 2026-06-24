<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teacher_id',
        // Identitas & Pribadi
        'nik',
        'no_kk',
        'agama',
        'nama_ibu_kandung',
        'status_perkawinan',
        'kewarganegaraan',
        // Keluarga
        'nama_suami_istri',
        'nip_suami_istri',
        'pekerjaan_suami_istri',
        // Domisili & Kontak
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
        // Kepegawaian & Riwayat
        'nip',
        'jenis_ptk',
        'sk_cpns',
        'tanggal_cpns',
        'sk_pengangkatan',
        'tmt_pengangkatan',
        'lembaga_pengangkatan',
        'pangkat_golongan',
        'sumber_gaji',
        'tmt_pns',
        // Administrasi & Keahlian
        'karpeg',
        'karis_karsu',
        'nuks',
        'lisensi_kepala_sekolah',
        'diklat_kepengawasan',
        'keahlian_braille',
        'keahlian_bahasa_isyarat',
        // Keuangan & Lokasi
        'npwp',
        'nama_wajib_pajak',
        'bank',
        'nomor_rekening_bank',
        'rekening_atas_nama',
        'lintang',
        'bujur',
    ];

    /**
     * Get the teacher that owns the profile.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}