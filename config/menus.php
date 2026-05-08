<?php

return [
    'items' => [
        [
            'key' => 'dashboard',
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => 'dashboard',
            'permission' => 'dashboard.view',
        ],
        [
            'key' => 'users',
            'name' => 'Pengguna',
            'icon' => 'users',
            'permission' => 'users.view',
            'submenus' => [
                [
                    'key' => 'users.list',
                    'name' => 'Daftar Pengguna',
                    'route' => 'users.index',
                    'permission' => 'users.view',
                ],
                [
                    'key' => 'users.create',
                    'name' => 'Tambah Pengguna',
                    'route' => 'users.create',
                    'permission' => 'users.create',
                ],
            ],
        ],
        [
            'key' => 'roles',
            'name' => 'Roles & Permissions',
            'icon' => 'shield',
            'permission' => 'roles.view',
            'submenus' => [
                [
                    'key' => 'roles.list',
                    'name' => 'Daftar Role',
                    'route' => 'roles.index',
                    'permission' => 'roles.view',
                ],
                [
                    'key' => 'permissions.list',
                    'name' => 'Daftar Permission',
                    'route' => 'permissions.index',
                    'permission' => 'permissions.view',
                ],
            ],
        ],
        [
            'key' => 'employees',
            'name' => 'Karyawan',
            'icon' => 'briefcase',
            'permission' => 'employees.view',
            'submenus' => [
                [
                    'key' => 'employees.list',
                    'name' => 'Daftar Karyawan',
                    'route' => 'employees.index',
                    'permission' => 'employees.view',
                ],
                [
                    'key' => 'employees.create',
                    'name' => 'Tambah Karyawan',
                    'route' => 'employees.create',
                    'permission' => 'employees.create',
                ],
            ],
        ],
        [
            'key' => 'teachers',
            'name' => 'Guru',
            'icon' => 'graduation-cap',
            'permission' => 'teachers.view',
            'submenus' => [
                [
                    'key' => 'teachers.list',
                    'name' => 'Daftar Guru',
                    'route' => 'teachers.index',
                    'permission' => 'teachers.view',
                ],
                [
                    'key' => 'teachers.create',
                    'name' => 'Tambah Guru',
                    'route' => 'teachers.create',
                    'permission' => 'teachers.create',
                ],
            ],
        ],
        [
            'key' => 'presence',
            'name' => 'Kehadiran',
            'icon' => 'calendar',
            'permission' => 'presence.view',
            'submenus' => [
                [
                    'key' => 'presence.list',
                    'name' => 'Daftar Kehadiran',
                    'route' => 'presence.index',
                    'permission' => 'presence.view',
                ],
                [
                    'key' => 'presence.create',
                    'name' => 'Tambah Kehadiran',
                    'route' => 'presence.create',
                    'permission' => 'presence.create',
                ],
            ],
        ],
        [
            'key' => 'overtime',
            'name' => 'Lembur',
            'icon' => 'clock',
            'permission' => 'overtime.view',
            'submenus' => [
                [
                    'key' => 'overtime.list',
                    'name' => 'Daftar Lembur',
                    'route' => 'overtime.index',
                    'permission' => 'overtime.view',
                ],
                [
                    'key' => 'overtime.create',
                    'name' => 'Tambah Lembur',
                    'route' => 'overtime.create',
                    'permission' => 'overtime.create',
                ],
            ],
        ],
        [
            'key' => 'payroll',
            'name' => 'Penggajian',
            'icon' => 'dollar-sign',
            'permission' => 'payroll.view',
            'submenus' => [
                [
                    'key' => 'payroll.list',
                    'name' => 'Daftar Penggajian',
                    'route' => 'payroll.index',
                    'permission' => 'payroll.view',
                ],
                [
                    'key' => 'payroll.create',
                    'name' => 'Buat Penggajian',
                    'route' => 'payroll.create',
                    'permission' => 'payroll.create',
                ],
                [
                    'key' => 'salary-components',
                    'name' => 'Komponen Gaji',
                    'route' => 'salary-components.index',
                    'permission' => 'salary-components.view',
                ],
                [
                    'key' => 'salary-rules',
                    'name' => 'Aturan Gaji',
                    'route' => 'salary-rules.index',
                    'permission' => 'salary-rules.view',
                ],
            ],
        ],
        [
            'key' => 'positions',
            'name' => 'Jabatan',
            'icon' => 'award',
            'permission' => 'positions.view',
            'submenus' => [
                [
                    'key' => 'positions.list',
                    'name' => 'Daftar Jabatan',
                    'route' => 'positions.index',
                    'permission' => 'positions.view',
                ],
                [
                    'key' => 'positions.create',
                    'name' => 'Tambah Jabatan',
                    'route' => 'positions.create',
                    'permission' => 'positions.create',
                ],
            ],
        ],
        [
            'key' => 'reports',
            'name' => 'Laporan',
            'icon' => 'file-text',
            'permission' => 'reports.view',
            'submenus' => [
                [
                    'key' => 'reports.presence',
                    'name' => 'Laporan Kehadiran',
                    'route' => 'reports.presence',
                    'permission' => 'reports.view',
                ],
                [
                    'key' => 'reports.salary',
                    'name' => 'Laporan Gaji',
                    'route' => 'reports.salary',
                    'permission' => 'reports.view',
                ],
                [
                    'key' => 'reports.overtime',
                    'name' => 'Laporan Lembur',
                    'route' => 'reports.overtime',
                    'permission' => 'reports.view',
                ],
            ],
        ],
        [
            'key' => 'announcements',
            'name' => 'Pengumuman',
            'icon' => 'megaphone',
            'permission' => 'announcements.view',
            'submenus' => [
                [
                    'key' => 'announcements.list',
                    'name' => 'Daftar Pengumuman',
                    'route' => 'announcements.index',
                    'permission' => 'announcements.view',
                ],
                [
                    'key' => 'announcements.create',
                    'name' => 'Buat Pengumuman',
                    'route' => 'announcements.create',
                    'permission' => 'announcements.create',
                ],
            ],
        ],
        [
            'key' => 'settings',
            'name' => 'Pengaturan',
            'icon' => 'settings',
            'roles' => ['superadmin', 'admin'],
            'submenus' => [
                [
                    'key' => 'settings.app',
                    'name' => 'Pengaturan Aplikasi',
                    'route' => 'settings.app',
                    'roles' => ['superadmin'],
                ],
                [
                    'key' => 'settings.time',
                    'name' => 'Pengaturan Waktu',
                    'route' => 'settings.time',
                    'permission' => 'time-settings.view',
                ],
                [
                    'key' => 'settings.profile',
                    'name' => 'Profil Saya',
                    'route' => 'settings.profile',
                ],
                [
                    'key' => 'settings.password',
                    'name' => 'Ubah Password',
                    'route' => 'settings.password',
                ],
                [
                    'key' => 'settings.security',
                    'name' => 'Keamanan',
                    'route' => 'settings.security',
                ],
            ],
        ],
    ],
];
