import { Head } from '@inertiajs/react';
import React, { useEffect, useMemo } from 'react';
import { formatReportLabel } from '../lib/format-label';

export default function SalaryPrint({ data }: any) {
    useEffect(() => {
        setTimeout(() => window.print(), 250);
    }, []);

    // Hitung total di bawah
    const { totalGaji, totalDetails } = useMemo(() => {
        return (data || []).reduce(
            (acc: any, p: any) => {
                const detailSum = (p.details || []).reduce(
                    (s: number, d: any) => s + Number(d.amount || 0),
                    0,
                );

                return {
                    totalGaji: acc.totalGaji + Number(p.total_gaji || 0),
                    totalDetails: acc.totalDetails + detailSum,
                };
            },
            { totalGaji: 0, totalDetails: 0 },
        );
    }, [data]);

    const formatRupiah = (val: number) =>
        val.toLocaleString('id-ID', { minimumFractionDigits: 2 });

    return (
        <div
            style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                padding: '40px',
            }}
        >
            <Head title="Laporan Penggajian - Print" />

            {/* Header Laporan */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>
                    LAPORAN PENGGAJIAN
                </h1>
                <p style={{ margin: '5px 0', color: '#666' }}>
                    Periode: {data?.[0]?.periode || '-'}
                </p>
            </div>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            No
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            Nama
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            Role
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            Jabatan
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            Periode
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'left',
                            }}
                        >
                            Detail Payroll
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'right',
                            }}
                        >
                            Nominal
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'right',
                            }}
                        >
                            Total Gaji
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((p: any, idx: number) => (
                        <tr key={p.id ?? idx}>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                {idx + 1}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                {p.nama}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                {formatReportLabel(p.role)}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                {p.jabatan ?? ''}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                {p.periode}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '0',
                                }}
                            >
                                {(p.details || []).map((d: any, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '8px',
                                            borderBottom:
                                                i === p.details.length - 1
                                                    ? 'none'
                                                    : '1px solid #ccc',
                                        }}
                                    >
                                        {d.component}
                                    </div>
                                ))}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '0',
                                    textAlign: 'right',
                                }}
                            >
                                {(p.details || []).map((d: any, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '8px',
                                            borderBottom:
                                                i === p.details.length - 1
                                                    ? 'none'
                                                    : '1px solid #ccc',
                                        }}
                                    >
                                        {formatRupiah(Number(d.amount || 0))}
                                    </div>
                                ))}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    textAlign: 'right',
                                }}
                            >
                                {formatRupiah(Number(p.total_gaji || 0))}
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
                            colSpan={6}
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'right',
                            }}
                        >
                            TOTAL KESELURUHAN
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'right',
                            }}
                        >
                            {formatRupiah(totalDetails)}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                textAlign: 'right',
                            }}
                        >
                            {formatRupiah(totalGaji)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Signature Area */}
            <div
                style={{
                    marginTop: '50px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <p>
                        Dicetak pada: {new Date().toLocaleDateString('id-ID')}
                    </p>
                    <br />
                    <br />
                    <br />
                    <p>( ........................... )</p>
                    <p>HRD / Keuangan</p>
                </div>
            </div>
        </div>
    );
}
