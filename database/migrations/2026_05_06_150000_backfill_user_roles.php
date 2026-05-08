<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill user_roles from existing users.role values
        $users = DB::table('users')->whereNotNull('role')->get();
        
        foreach ($users as $user) {
            if (!is_string($user->role) || $user->role === '') continue;
            
            $roleId = DB::table('roles')
                ->where('name', $user->role)
                ->where('guard_name', 'web')
                ->value('id');
                
            if ($roleId) {
                DB::table('user_roles')->updateOrInsert([
                    'user_id' => $user->id,
                    'role_id' => $roleId,
                ], [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('user_roles')->truncate();
    }
};
