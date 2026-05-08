# Role-Based Permission System

This document explains the role-based permission system implemented in the SIMPEG application.

## Overview

The permission system provides granular access control to different parts of the application based on user roles and individual permissions. It includes:

- **Role Management**: Define roles (superadmin, admin, pegawai, guru, user)
- **Permission Management**: Define permissions using `module.action` format
- **Menu Access Control**: Show/hide menu items based on permissions
- **Route Protection**: Middleware to protect routes based on permissions
- **Flexible Assignment**: Users can have multiple roles and direct permissions

## Database Structure

### Tables
- `roles` - Available roles
- `permissions` - Available permissions (module.action format)
- `role_has_permissions` - Role-permission relationships
- `user_roles` - User-role relationships
- `user_permissions` - User-permission relationships (direct assignments)

### Default Roles
- **superadmin**: Full access to all features
- **admin**: Most administrative features
- **pegawai**: Employee-specific features
- **guru**: Teacher-specific features
- **user**: Basic access

### Permission Format
Permissions follow the pattern: `module.action`

Examples:
- `users.view` - View user list
- `users.create` - Create new users
- `users.edit` - Edit existing users
- `users.delete` - Delete users
- `dashboard.view` - Access dashboard
- `reports.view` - View reports

## Usage Examples

### Checking Permissions in Code

```php
// In controllers
if (!auth()->user()->hasPermission('users.view')) {
    abort(403, 'Access denied');
}

// Check role
if (auth()->user()->hasRole('superadmin')) {
    // Superadmin specific logic
}

// Using middleware in routes
Route::get('/users', [UserController::class, 'index'])
    ->middleware('permission:users.view');
```

### Menu Configuration

Menu items are configured in `config/menus.php`:

```php
[
    'key' => 'users',
    'name' => 'Pengguna',
    'icon' => 'users',
    'permission' => 'users.view', // Required permission
    'submenus' => [
        [
            'key' => 'users.list',
            'name' => 'Daftar Pengguna',
            'route' => 'users.index',
            'permission' => 'users.view',
        ],
    ],
]
```

### Using the Menu Service

```php
use App\Services\MenuService;

// Get user menus (filtered by permissions)
$userMenus = MenuService::getUserMenus();

// Check if user can access specific menu
$canAccess = MenuService::canAccessMenu('users');
```

## Implementation Steps

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Run Seeder
```bash
php artisan db:seed --class=RolePermissionSeeder
```

### 3. Update Existing Users
The seeder includes a migration to backfill existing user roles from the `users.role` field.

### 4. Default Login
- Email: `superadmin@example.com`
- Password: `password`

## Middleware

### CheckPermission Middleware
Protects routes based on specific permissions:

```php
Route::middleware('permission:users.view')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

### CheckRole Middleware
Protects routes based on user roles:

```php
Route::middleware('role:superadmin')->group(function () {
    Route::get('/admin-panel', [AdminController::class, 'index']);
});
```

### ShareMenus Middleware
Shares filtered menu data with all views:

```php
// In Blade views
@foreach ($userMenus as $menu)
    <li>{{ $menu['name'] }}</li>
@endforeach
```

## Model Methods

### User Model
```php
// Check if user has specific role
$user->hasRole('admin');

// Check if user has specific permission
$user->hasPermission('users.view');

// Get user roles
$user->roles;

// Get user permissions (direct + from roles)
$user->permissions;
```

### Role Model
```php
// Check if role has specific permission
$role->hasPermission('users.view');

// Get role permissions
$role->permissions;

// Get users with this role
$role->users;
```

## Best Practices

1. **Use Middleware**: Always protect routes with permission middleware
2. **Check in Controllers**: Add permission checks in controllers for sensitive operations
3. **Granular Permissions**: Use specific permissions rather than broad ones
4. **Role-Based Access**: Use roles for common access patterns
5. **Direct Permissions**: Use direct permissions for exceptional cases
6. **Menu Filtering**: Always filter menus based on permissions
7. **Testing**: Test permission boundaries thoroughly

## Adding New Permissions

1. Add permission to seeder or create via UI
2. Update menu configuration if needed
3. Add middleware to routes
4. Add permission checks in controllers
5. Assign to appropriate roles

## Security Considerations

- Always validate permissions on the server-side
- Never rely solely on UI hiding
- Use HTTPS in production
- Regularly review permission assignments
- Implement audit logging for sensitive operations
- Consider implementing permission caching for performance

## Troubleshooting

### Common Issues

1. **Permission Not Working**: Check if permission exists in database
2. **Menu Not Showing**: Verify menu configuration and permission assignment
3. **Middleware Not Applied**: Ensure routes are properly grouped
4. **User Access Denied**: Check user's role and permission assignments

### Debug Commands

```bash
// Check user permissions
php artisan tinker
$user = User::find(1);
$user->hasPermission('users.view');

// Check role permissions
$role = Role::where('name', 'admin')->first();
$role->permissions()->pluck('name');
```
