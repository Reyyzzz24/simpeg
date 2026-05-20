<?php

namespace App\Socialite;

use Illuminate\Support\Arr;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\User;

class PortalProvider extends AbstractProvider implements ProviderInterface
{
    protected $scopes = [];
    protected $scopeSeparator = ' ';

    protected function getPortalHost(): string
    {
        return rtrim(config('services.portal.host'), '/');
    }

    protected function getAuthUrl($state): string
    {
        return $this->buildAuthUrlFromBase(
            $this->getPortalHost().'/oauth/authorize', 
            $state
        );
    }

    protected function getTokenUrl(): string
    {
        return $this->getPortalHost().'/oauth/token';
    }

    protected function getUserByToken($token): array
    {
        $response = $this->getHttpClient()->get(
            $this->getPortalHost().'/api/user',
            [
                'headers' => [
                    'Authorization' => 'Bearer '.$token,
                ],
            ]
        );

        $payload = json_decode($response->getBody(), true) ?: [];

        return Arr::get($payload, 'data', $payload);
    }

    protected function mapUserToObject(array $user): User
    {
        return (new User)->setRaw($user)->map([
            'id' => Arr::get($user, 'id') ?? Arr::get($user, 'uuid'),
            'nickname' => Arr::get($user, 'name') ?? Arr::get($user, 'username'),
            'name' => Arr::get($user, 'name') ?? Arr::get($user, 'username'),
            'email' => Arr::get($user, 'email'),
            'avatar' => null,
        ]);
    }
}
