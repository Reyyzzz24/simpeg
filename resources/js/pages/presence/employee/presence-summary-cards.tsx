import { CheckCircle2, Clock, Monitor, ScanFace } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard-card';
import { CardContent } from '@/components/ui/card';
import type { TodayPresence, SelfPresenceUser } from './types';

type Props = {
    todayPresence: TodayPresence;
    user: SelfPresenceUser;
};

export default function PresenceSummaryCards({ todayPresence, user }: Props) {
    const statusText = (() => {
        if (!todayPresence.jam_masuk) {
            return 'Belum absen masuk';
        }

        if (!todayPresence.jam_pulang) {
            return 'Sudah absen masuk';
        }

        return 'Absensi hari ini lengkap';
    })();

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <DashboardCard>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                        <Clock />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Jam Masuk
                        </p>
                        <h3 className="text-2xl font-bold">
                            {todayPresence.jam_masuk ?? '--:--'}
                        </h3>
                    </div>
                </CardContent>
            </DashboardCard>

            <DashboardCard>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
                        <CheckCircle2 />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Jam Pulang
                        </p>
                        <h3 className="text-2xl font-bold">
                            {todayPresence.jam_pulang ?? '--:--'}
                        </h3>
                    </div>
                </CardContent>
            </DashboardCard>

            <DashboardCard>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-violet-100 p-3 text-violet-600">
                        {user.face_registered ? <ScanFace /> : <Monitor />}
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <h3 className="text-xl font-bold">{statusText}</h3>
                    </div>
                </CardContent>
            </DashboardCard>
        </div>
    );
}
