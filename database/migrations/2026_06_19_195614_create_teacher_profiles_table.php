<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            
            // Informasi Domisili & Kontak
            $table->string('agama')->nullable();
            $table->string('alamat_jalan')->nullable();
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->string('nama_dusun')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kode_pos')->nullable();
            $table->string('telepon')->nullable();
            $table->string('hp')->nullable();
            $table->string('email_pribadi')->nullable();
            
            // Data Pribadi & Keluarga
            $table->string('nik')->nullable();
            $table->string('no_kk')->nullable();
            $table->string('nama_ibu_kandung')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('nama_suami_istri')->nullable();
            $table->string('nip_suami_istri')->nullable();
            $table->string('pekerjaan_suami_istri')->nullable();
            $table->string('kewarganegaraan')->nullable();
            
            // Data Kepegawaian Detail
            $table->string('nip')->nullable();
            $table->string('jenis_ptk')->nullable();
            $table->string('sk_cpns')->nullable();
            $table->date('tanggal_cpns')->nullable();
            $table->string('sk_pengangkatan')->nullable();
            $table->date('tmt_pengangkatan')->nullable();
            $table->string('lembaga_pengangkatan')->nullable();
            $table->string('pangkat_golongan')->nullable();
            $table->string('sumber_gaji')->nullable();
            $table->date('tmt_pns')->nullable();
            
            // Administrasi & Sertifikasi
            $table->string('karpeg')->nullable();
            $table->string('karis_karsu')->nullable();
            $table->string('nuks')->nullable();
            $table->boolean('lisensi_kepala_sekolah')->default(false);
            $table->boolean('diklat_kepengawasan')->default(false);
            $table->boolean('keahlian_braille')->default(false);
            $table->boolean('keahlian_bahasa_isyarat')->default(false);
            
            // Pajak & Keuangan
            $table->string('npwp')->nullable();
            $table->string('nama_wajib_pajak')->nullable();
            $table->string('bank')->nullable();
            $table->string('nomor_rekening_bank')->nullable();
            $table->string('rekening_atas_nama')->nullable();
            
            // Koordinat
            $table->string('lintang')->nullable();
            $table->string('bujur')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
