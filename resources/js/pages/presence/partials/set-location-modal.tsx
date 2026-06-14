import { useForm } from '@inertiajs/react';
import { ExternalLink, LocateFixed, MapPinned } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LocationSetting = {
    latitude: number | null;
    longitude: number | null;
    radius_meters: number;
    enabled?: boolean;
    configured?: boolean;
};

type LocationForm = {
    latitude: string;
    longitude: string;
    radius_meters: string;
    enabled: boolean;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    locationSetting: LocationSetting;
};

const extractCoordinatesFromGoogleMaps = (value: string) => {
    const decodedValue = decodeURIComponent(value.trim());
    const patterns = [
        /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
        /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
        /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
        /\/search\/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    ];

    for (const pattern of patterns) {
        const match = decodedValue.match(pattern);

        if (match) {
            return {
                latitude: Number(match[1]).toFixed(7),
                longitude: Number(match[2]).toFixed(7),
            };
        }
    }

    return null;
};

export default function SetLocationModal({
    isOpen,
    onClose,
    locationSetting,
}: Props) {
    const [geoMessage, setGeoMessage] = useState('');
    const [mapsUrl, setMapsUrl] = useState('');
    const { data, setData, put, processing, errors, reset } =
        useForm<LocationForm>({
            latitude: locationSetting.latitude?.toString() ?? '',
            longitude: locationSetting.longitude?.toString() ?? '',
            radius_meters: (locationSetting.radius_meters ?? 100).toString(),
            enabled: locationSetting.enabled ?? true,
        });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setGeoMessage('');
            setMapsUrl('');
            setData({
                latitude: locationSetting.latitude?.toString() ?? '',
                longitude: locationSetting.longitude?.toString() ?? '',
                radius_meters: (
                    locationSetting.radius_meters ?? 100
                ).toString(),
                enabled: locationSetting.enabled ?? true,
            });
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [isOpen, locationSetting, setData]);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoMessage('Browser belum mendukung fitur lokasi.');

            return;
        }

        setGeoMessage('Mengambil lokasi perangkat...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData({
                    ...data,
                    latitude: position.coords.latitude.toFixed(7),
                    longitude: position.coords.longitude.toFixed(7),
                });
                setGeoMessage('Lokasi perangkat berhasil diambil.');
            },
            () => {
                setGeoMessage(
                    'Lokasi tidak bisa diambil. Pastikan izin lokasi sudah dinyalakan.',
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    const parsedLatitude = Number(data.latitude);
    const parsedLongitude = Number(data.longitude);
    const hasCoordinate =
        Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude);
    const previewLatitude = hasCoordinate ? parsedLatitude : -6.2;
    const previewLongitude = hasCoordinate ? parsedLongitude : 106.816666;
    const googleMapsPreviewUrl = `https://maps.google.com/maps?q=${previewLatitude},${previewLongitude}&z=18&output=embed`;
    const googleMapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${previewLatitude},${previewLongitude}`;

    const applyCoordinates = (
        coordinates: { latitude: string; longitude: string },
        message: string,
    ) => {
        setData({
            ...data,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        });
        setGeoMessage(message);
    };

    const handleMapsUrlChange = (value: string) => {
        setMapsUrl(value);
        const coordinates = extractCoordinatesFromGoogleMaps(value);

        if (coordinates) {
            applyCoordinates(
                coordinates,
                'Koordinat dari anchor Google Maps berhasil dipasang.',
            );
        }
    };

    const applyGoogleMapsUrl = () => {
        const coordinates = extractCoordinatesFromGoogleMaps(mapsUrl);

        if (!coordinates) {
            setGeoMessage(
                'Link Google Maps belum berisi koordinat yang valid. Gunakan URL panjang yang memuat @latitude,longitude atau !3d...!4d....',
            );

            return;
        }

        applyCoordinates(
            coordinates,
            'Koordinat dari anchor Google Maps berhasil dipasang.',
        );
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put('/presence/location-setting', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Atur Lokasi Presensi</DialogTitle>
                    <DialogDescription>
                        Tentukan titik koordinat sekolah dan radius absensi.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
                            <Checkbox
                                id="enabled"
                                checked={data.enabled}
                                onCheckedChange={(checked) =>
                                    setData('enabled', checked === true)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="enabled">
                                    Aktifkan validasi radius lokasi
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Jika dimatikan, user bisa absen tanpa dicek
                                    koordinat lokasi.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border bg-black">
                            <div className="relative aspect-video min-h-72">
                                <iframe
                                    title="Google Maps lokasi presensi"
                                    src={googleMapsPreviewUrl}
                                    className="h-full w-full"
                                    loading="lazy"
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="rounded-full bg-white/95 p-2 text-red-600 shadow-lg">
                                        <MapPinned className="size-6" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="justify-center"
                                onClick={useCurrentLocation}
                            >
                                <LocateFixed className="mr-2 size-4" />
                                Targetkan Lokasi Saat Ini
                            </Button>
                            <a
                                href={googleMapsOpenUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-center"
                                >
                                    <ExternalLink className="mr-2 size-4" />
                                    Buka Google Maps
                                </Button>
                            </a>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maps_url">Link Google Maps</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="maps_url"
                                    value={mapsUrl}
                                    onChange={(event) =>
                                        handleMapsUrlChange(event.target.value)
                                    }
                                    placeholder="Tempel URL Google Maps yang memuat anchor koordinat"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={applyGoogleMapsUrl}
                                >
                                    Pakai
                                </Button>
                            </div>
                        </div>

                        {geoMessage && (
                            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                                {geoMessage}
                            </p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="0.0000001"
                                    value={data.latitude}
                                    onChange={(event) =>
                                        setData('latitude', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.latitude} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="0.0000001"
                                    value={data.longitude}
                                    onChange={(event) =>
                                        setData('longitude', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.longitude} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="radius_meters">Radius absen</Label>
                            <Input
                                id="radius_meters"
                                type="number"
                                min="1"
                                max="10000"
                                value={data.radius_meters}
                                onChange={(event) =>
                                    setData('radius_meters', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.radius_meters} />
                            <p className="text-xs text-muted-foreground">
                                Default yang disarankan: 100 meter.
                            </p>
                        </div>
                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Lokasi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
