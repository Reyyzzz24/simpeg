import { Head, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import AttendanceActionPanel from './attendance-action-panel';
import FaceRecognitionPanel from './face-recognition-panel';
import FlashMessage from './flash-message';
import HistoryView from './history-view';
import PresenceSummaryCards from './presence-summary-cards';
import QrScanPanel from './qr-scan-panel';
import TeacherCheckoutView from './teacher-checkout-view';
import type {
    PresenceType,
    SelfPresence,
    SelfPresenceUser,
    TodayPresence,
} from './types';

type Props = {
    todayPresence: TodayPresence;
    user: SelfPresenceUser;
    teacherCheckoutMode?: boolean;
    historyMode?: boolean;
    selfPresences?: SelfPresence[];
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Absensi Saya', href: '/presence/self' },
];

export default function EmployeePresenceIndex({
    todayPresence,
    user,
    teacherCheckoutMode = false,
    historyMode = false,
    selfPresences = [],
}: Props) {
    const { flash } = usePage<any>().props;
    const [type, setType] = useState<PresenceType>(
        todayPresence.jam_masuk && !todayPresence.jam_pulang
            ? 'pulang'
            : 'masuk',
    );
    const isTeacher = user.role === 'guru';

    if (historyMode) {
        return (
            <HistoryView
                user={user}
                selfPresences={selfPresences}
                flash={flash}
            />
        );
    }

    if (teacherCheckoutMode) {
        return (
            <TeacherCheckoutView user={user} todayPresence={todayPresence} />
        );
    }

    return (
        <>
            <Head title="Absensi Saya" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Absensi Saya"
                    subtitle={`${user.name} - ${user.role}`}
                    description="Lakukan absensi dengan scan QR atau verifikasi wajah melalui kamera perangkat."
                    gradient="bg-linear-to-r from-sky-600 to-emerald-500"
                    icon={<Camera className="size-20 text-white" />}
                />

                <PresenceSummaryCards
                    todayPresence={todayPresence}
                    user={user}
                />

                <FlashMessage success={flash?.success} error={flash?.error} />

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr_360px]">
                    <QrScanPanel />

                    <FaceRecognitionPanel
                        type={type}
                        faceRegistered={user.face_registered}
                        faceRegisteredAt={user.face_registered_at}
                        isTeacherCheckout={isTeacher && type === 'pulang'}
                    />

                    <AttendanceActionPanel
                        type={type}
                        setType={setType}
                        isTeacher={isTeacher}
                        todayPresence={todayPresence}
                    />
                </div>
            </div>
        </>
    );
}

EmployeePresenceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
