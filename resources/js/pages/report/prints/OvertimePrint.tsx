import { Head } from '@inertiajs/react';
import React, { useEffect, useMemo } from 'react';

export default function OvertimePrint({ data }: any) {
    useEffect(() => {
        setTimeout(() => window.print(), 250);
    }, []);

    // Hitung total durasi lembur
    const totalDurasi = useMemo(() => {
        return (data || []).reduce((acc: number, item: any) => acc + (Number(item.durasi_jam) || 0), 0);
    }, [data]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <Head title="Laporan Lembur - Print" />

            <style>{`
                @media print {
                    @page { size: portrait; margin: 10mm; }
                    body { font-size: 11px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background-color: #f4f4f4 !important; }
                }
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '20px' }}>LAPORAN LEMBUR</h1>
                <p style={{ margin: '5px 0', color: '#666' }}>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>No</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nama</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>NIP</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tanggal</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mulai</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Selesai</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Durasi (Jam)</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tugas</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item: any, idx: number) => (
                        <tr key={item.id ?? idx}>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{item.pegawai_nama}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{item.pegawai_nip}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{item.tanggal}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{item.jam_mulai}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{item.jam_selesai}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{item.durasi_jam}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{item.tugas}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{item.is_approved ? 'Disetujui' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                        <td colSpan={6} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>TOTAL DURASI</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{totalDurasi.toFixed(2)} Jam</td>
                        <td colSpan={2} style={{ border: '1px solid #ccc' }}></td>
                    </tr>
                </tfoot>
            </table>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <p>Mengetahui,</p>
                    <br /><br /><br />
                    <p>( ........................... )</p>
                </div>
            </div>
        </div>
    );
}