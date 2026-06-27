import { Head } from '@inertiajs/react';
import React, { useEffect, useMemo } from 'react';
import { formatReportLabel } from '../lib/format-label';

export default function PresencePrint({ data }: any) {
    useEffect(() => {
        setTimeout(() => window.print(), 250);
    }, []);

    // Perhitungan total untuk kolom numerik
    const totals = useMemo(() => {
        return (data || []).reduce(
            (acc: any, item: any) => ({
                normatifTeori:
                    acc.normatifTeori + (Number(item.jam_normatif_teori) || 0),
                produktifTeori:
                    acc.produktifTeori +
                    (Number(item.jam_produktif_teori) || 0),
                produktifPraktik:
                    acc.produktifPraktik +
                    (Number(item.jam_produktif_praktik) || 0),
                totalProduktif:
                    acc.totalProduktif +
                    (Number(item.total_jam_produktif) || 0),
                eskul: acc.eskul + (Number(item.jam_eskul) || 0),
            }),
            {
                normatifTeori: 0,
                produktifTeori: 0,
                produktifPraktik: 0,
                totalProduktif: 0,
                eskul: 0,
            },
        );
    }, [data]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <Head title="Laporan Kehadiran - Print" />

            <style>{`
                @media print {
                    @page { size: landscape; margin: 10mm; }
                    body { font-size: 10px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background-color: #f4f4f4 !important; }
                }
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '20px' }}>
                    LAPORAN KEHADIRAN
                </h1>
                <p style={{ margin: '5px 0', color: '#666' }}>
                    Dicetak pada: {new Date().toLocaleString('id-ID')}
                </p>
            </div>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '10px',
                }}
            >
                <thead>
                    <tr>
                        {[
                            'No',
                            'Nama',
                            'Role',
                            'Tanggal',
                            'Masuk',
                            'Pulang',
                            'Disiplin',
                            'Jam Kerja',
                            'Total Ajar',
                            'Jenis',
                            'Normatif Teori',
                            'Produktif Teori',
                            'Produktif Praktik',
                            'Total Produktif',
                            'Eskul',
                            'Piket',
                            'Selisih',
                            'Validasi',
                        ].map((h) => (
                            <th
                                key={h}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item: any, idx: number) => (
                        <tr key={item.id ?? idx}>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {idx + 1}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {item.nama}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {formatReportLabel(item.role)}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {item.tanggal}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_masuk}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_pulang}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {formatReportLabel(item.status_disiplin)}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_kerja}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.total_jam_ajar}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {formatReportLabel(item.jenis_ajar)}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_normatif_teori}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_produktif_teori}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_produktif_praktik}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.total_jam_produktif}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.jam_eskul}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.ada_piket ? 'Ya' : 'Tdk'}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                    textAlign: 'center',
                                }}
                            >
                                {item.selisih_jam_ajar_menit}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '6px',
                                }}
                            >
                                {formatReportLabel(item.status_validasi_ajar)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr
                        style={{
                            backgroundColor: '#f9f9f9',
                            fontWeight: 'bold',
                        }}
                    >
                        <td
                            colSpan={10}
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'right',
                            }}
                        >
                            TOTAL
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {totals.normatifTeori}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {totals.produktifTeori}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {totals.produktifPraktik}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {totals.totalProduktif}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {totals.eskul}
                        </td>
                        <td
                            colSpan={3}
                            style={{ border: '1px solid #ccc' }}
                        ></td>
                    </tr>
                </tfoot>
            </table>

            <div
                style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <p>Mengetahui,</p>
                    <br />
                    <br />
                    <br />
                    <p>( ........................... )</p>
                </div>
            </div>
        </div>
    );
}
