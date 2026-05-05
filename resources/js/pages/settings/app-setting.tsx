import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';

type AppSetting = {
    app_name: string;
    branch_name: string | null;
    logo_url: string | null;
    primary_color: string;
    phone: string | null;
    address: string | null;
};

type FormData = {
    app_name: string;
    branch_name: string;
    logo: File | null;
    primary_color: string;
    phone: string;
    address: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'App setting',
        href: '/settings/app-setting',
    },
];

export default function AppSetting({ appSetting }: { appSetting: AppSetting }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
    } = useForm<FormData>({
        app_name: appSetting.app_name ?? 'SIMPEG',
        branch_name: appSetting.branch_name ?? '',
        logo: null,
        primary_color: appSetting.primary_color ?? '#2563eb',
        phone: appSetting.phone ?? '',
        address: appSetting.address ?? '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/settings/app-setting', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="App setting" />

            <h1 className="sr-only">App Setting</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="App setting"
                        description="Atur identitas aplikasi seperti logo, nama aplikasi, cabang, warna, dan kontak"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="app_name">Nama aplikasi</Label>
                            <Input
                                id="app_name"
                                name="app_name"
                                value={data.app_name}
                                onChange={(event) =>
                                    setData('app_name', event.target.value)
                                }
                                placeholder="SIMPEG"
                                required
                            />
                            <InputError message={errors.app_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="branch_name">Nama cabang</Label>
                            <Input
                                id="branch_name"
                                name="branch_name"
                                value={data.branch_name}
                                onChange={(event) =>
                                    setData('branch_name', event.target.value)
                                }
                                placeholder="Cabang utama"
                            />
                            <InputError message={errors.branch_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="logo">Logo</Label>
                            {appSetting.logo_url && (
                                <div className="flex items-center gap-3 rounded-md border p-3">
                                    <img
                                        src={appSetting.logo_url}
                                        alt={appSetting.app_name}
                                        className="size-12 rounded-md object-contain"
                                    />
                                    <div className="text-sm text-muted-foreground">
                                        Logo saat ini
                                    </div>
                                </div>
                            )}
                            <Input
                                id="logo"
                                name="logo"
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    setData(
                                        'logo',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <InputError message={errors.logo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_color">Warna utama</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="primary_color_picker"
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(event) =>
                                        setData(
                                            'primary_color',
                                            event.target.value,
                                        )
                                    }
                                    className="h-10 w-16 p-1"
                                    aria-label="Pilih warna utama"
                                />
                                <Input
                                    id="primary_color"
                                    name="primary_color"
                                    value={data.primary_color}
                                    onChange={(event) =>
                                        setData(
                                            'primary_color',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="#2563eb"
                                    required
                                />
                            </div>
                            <InputError message={errors.primary_color} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Nomor telepon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(event) =>
                                    setData('phone', event.target.value)
                                }
                                placeholder="021-123456"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(event) =>
                                    setData('address', event.target.value)
                                }
                                placeholder="Alamat instansi atau cabang"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Tersimpan
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
