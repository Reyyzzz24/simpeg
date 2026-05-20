<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SSOController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('portal')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $portalUser = Socialite::driver('portal')->user();

            $portalId = (string) $portalUser->getId();
            $email = $portalUser->getEmail();
            $name = $portalUser->getName() ?: $portalUser->getNickname() ?: $email;
            $portalRole = $this->resolvePortalRole($portalUser->getRaw());

            if (!$portalId || !$email) {
                throw new \RuntimeException('Portal SSO tidak mengirim id atau email user.');
            }

            $user = DB::transaction(function () use ($portalId, $email, $name, $portalRole) {
                $user = User::query()
                    ->where('portal_id', $portalId)
                    ->orWhere('email', $email)
                    ->first();

                if (!$user) {
                    $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => bcrypt(str()->random(32)),
                        'role' => $portalRole ?? 'user',
                        'email_verified_at' => now(),
                        'portal_id' => $portalId,
                    ]);
                } else {
                    $user->update([
                        'name' => $user->name ?: $name,
                        'email_verified_at' => $user->email_verified_at ?: now(),
                        'portal_id' => $user->portal_id ?: $portalId,
                        'role' => $portalRole ?? $user->role ?? 'user',
                    ]);
                }

                $this->syncPortalRole($user);

                return $user->fresh();
            });

            Auth::login($user, true);
            request()->session()->regenerate();

            return redirect()->intended('/dashboard');
        } catch (\Exception $e) {
            Log::error('SSO Callback Error: ' . $e->getMessage());
            return redirect()->route('login')
                ->with('error', 'Gagal login menggunakan SSO.');
        }
    }

    private function syncPortalRole(User $user): void
    {
        $role = Role::firstOrCreate(
            ['name' => $user->role ?: 'user'],
            ['guard_name' => 'web']
        );

        $user->roles()->sync([$role->id]);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');
    }

    private function resolvePortalRole(array $rawUser): ?string
    {
        $role = Arr::get($rawUser, 'role.name')
            ?? Arr::get($rawUser, 'role')
            ?? Arr::get($rawUser, 'roles.0.name')
            ?? Arr::get($rawUser, 'roles.0');

        if (is_array($role)) {
            $role = Arr::get($role, 'name');
        }

        if (!$role) {
            return null;
        }

        $role = strtolower((string) $role);

        return Role::where('name', $role)->exists() ? $role : 'user';
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    }
}
