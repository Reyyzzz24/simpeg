import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Clock,
    FileText,
    ChevronDown,
    UserCog,
    UserCircle,
    UserCheck,
    Users2,
    DollarSign,
    Briefcase,
    Layers,
    Settings,
    GitBranch,
    Timer,
    Megaphone,
    BookOpenCheck,
    History,
    CalendarCheck,
    ShieldCheck,
    KeyRound,
} from 'lucide-react';

import { route } from 'ziggy-js';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const hasPermission = (permission: string) => auth.permissions.includes(permission);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        },
        ...(hasPermission('overtime.view') ? [{
            title: 'Lembur',
            href: route('overtime.index'),
            icon: Timer,
        }] : []),
        ...(hasPermission('announcements.view') ? [{
            title: 'Pengumuman',
            href: route('announcement.index'),
            icon: Megaphone,
        }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarMenu className="px-2">
                    {(hasPermission('presence.view') || hasPermission('presence.self')) && (
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Presensi">
                                        <CalendarCheck className="h-4 w-4" />
                                        <span>Presensi</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {hasPermission('presence.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('presence.index')}>
                                                        <Clock className="h-4 w-4" />
                                                        <span>Presensi Pegawai</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('presence.self') && (
                                            <>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={route('presence.self')}>
                                                            <UserCheck className="h-4 w-4" />
                                                            <span>Absensi Saya</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href="/presence/self/history">
                                                            <History className="h-4 w-4" />
                                                            <span>Riwayat Absensi</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </>
                                        )}
                                        {auth.user.role === 'guru' && hasPermission('teacher-checkout.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/presence/self/teacher-checkout">
                                                        <BookOpenCheck className="h-4 w-4" />
                                                        <span>Absen Pulang Guru</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )}

                    {hasPermission('reports.view') && (
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Laporan">
                                        <FileText className="h-4 w-4" />
                                        <span>Laporan</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={route('report.presence.index')}>
                                                    <Clock className="h-4 w-4" />
                                                    <span>Kehadiran</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={route('report.salary.index')}>
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Penggajian</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={route('report.overtime.index')}>
                                                    <Timer className="h-4 w-4" />
                                                    <span>Lembur</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )}

                    {hasPermission('payroll.view') && (
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Payroll">
                                        <DollarSign className="h-4 w-4" />
                                        <span>Payroll</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={route('payroll.index')}>
                                                    <FileText className="h-4 w-4" />
                                                    <span>Manajemen Payroll</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        {hasPermission('positions.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('positions.index')}>
                                                        <Briefcase className="h-4 w-4" />
                                                        <span>Position</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('allowances.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('position-allowances.index')}>
                                                        <Layers className="h-4 w-4" />
                                                        <span>Tunjangan Jabatan</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('salary-components.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('salary-components.index')}>
                                                        <Settings className="h-4 w-4" />
                                                        <span>Komponen Gaji</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('salary-rules.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('salary-rules.index')}>
                                                        <GitBranch className="h-4 w-4" />
                                                        <span>Aturan Gaji</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('user-positions.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('user-positions.index')}>
                                                        <Users2 className="h-4 w-4" />
                                                        <span>Assign Jabatan</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )}

                    {hasPermission('users.view') && (
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Manajemen User">
                                        <UserCog className="h-4 w-4" />
                                        <span>Manajemen User</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {hasPermission('employees.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('employee.index')}>
                                                        <Users2 className="h-4 w-4" />
                                                        <span>Pegawai</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('teachers.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('teacher.index')}>
                                                        <UserCheck className="h-4 w-4" />
                                                        <span>Guru</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={route('users.index')}>
                                                    <UserCircle className="h-4 w-4" />
                                                    <span>Semua Pengguna</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        {hasPermission('roles.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('roles.index')}>
                                                        <KeyRound className="h-4 w-4" />
                                                        <span>Manajemen Role</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('permissions.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('permissions.index')}>
                                                        <ShieldCheck className="h-4 w-4" />
                                                        <span>Manajemen Permission</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                        {hasPermission('permissions.view') && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={route('user-permissions.index')}>
                                                        <KeyRound className="h-4 w-4" />
                                                        <span>User Permissions</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}