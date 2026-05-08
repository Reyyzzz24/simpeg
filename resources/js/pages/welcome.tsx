import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutGrid, BookOpen, ArrowRight } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Selamat Datang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#F4F7FA] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* Header / Navbar */}
                <header className="mb-8 w-full max-w-5xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src="./images/logo.webp"
                                alt="Logo"
                                className='w-10 h-10 rounded-full object-cover'
                            />
                            <span className="font-bold text-lg tracking-tight">SIMPEG SMKKPDM</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold transition-all hover:bg-gray-50 shadow-sm"
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-100/50 lg:flex dark:bg-[#161615] dark:shadow-none">
                    {/* Left Section: Content */}
                    <div className="flex flex-1 flex-col justify-center p-8 lg:p-16">
                        <div className="max-w-md">
                            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                                Mari Mulai!
                            </h1>
                            <p className="mb-8 text-lg text-gray-500 dark:text-[#A1A09A]">
                                Selamat datang di Platform Kepegawaian. Kelola administrasi dan laporan Anda dalam satu tempat yang terintegrasi.
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-4 group">
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <LayoutGrid size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Eksplorasi Fitur</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Pelajari Panduan</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={login()}
                                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-200"
                                >
                                    Eksplorasi Sekarang
                                    <ArrowRight size={18} />
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-xl bg-gray-100 px-8 py-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200"
                                    >
                                        Daftar Baru
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Illustration */}
                    <div className="relative hidden flex-1 items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 lg:flex dark:from-[#1c1c1b] dark:to-[#161615]">
                        <img
                            src="./images/bg.png"
                            alt="Illustration"
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-90"
                        />  
                        {/* Decorative blobs */}
                        <div className="absolute top-10 right-10 size-32 rounded-full bg-blue-200/30 blur-3xl" />
                        <div className="absolute bottom-10 left-10 size-32 rounded-full bg-indigo-200/30 blur-3xl" />
                    </div>
                </main>

                <footer className="mt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} SIMPEG SMKKPDM. All rights reserved.
                </footer>
            </div>
        </>
    );
}