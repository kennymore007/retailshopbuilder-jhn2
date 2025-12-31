# Admin User Management System

Complete admin user management system for AgriConnect marketplace.

## Features

✅ **User Management**
- Create, update, delete admin users
- Role-based access control (Super Admin, Admin, Moderator)
- Password reset functionality
- User activation/deactivation

✅ **Roles & Permissions**
- **Super Admin**: Full access, can create/delete users
- **Admin**: Standard admin access
- **Moderator**: Limited admin access

✅ **Admin Dashboard UI**
- User list with search and filters
- Create user modal
- Edit user page
- Password reset interface

✅ **CLI Scripts**
- Bootstrap super admin
- Reset passwords
- List users

---

## Quick Start

### 1. Create Your First Super Admin

Run this command to create your super admin account:

```bash
cd apps/backend
npx medusa exec ./src/scripts/create-super-admin.ts
```

**Default Credentials:**
- Email: `kehindeadebayotola@gmail.com`
- Password: `AgriConnect2024!`

⚠️ **IMPORTANT**: Change the password after first login!

### 2. Login to Admin Dashboard

Visit the admin dashboard:
- **Local**: http://localhost:9000/app
- **Production**: https://your-domain.com/app

Use the credentials from step 1 to login.

### 3. Manage Users

Once logged in as super admin:
1. Navigate to **"Users"** in the sidebar
2. Click **"Create User"** to add new admins
3. Assign roles and permissions
4. Edit or delete users as needed

---

## CLI Scripts

### Create Super Admin
```bash
npx medusa exec ./src/scripts/create-super-admin.ts
```
Creates the first super admin user with default credentials.

### Reset Password
```bash
npx medusa exec ./src/scripts/reset-admin-password.ts
```
Resets password for an existing admin user.

**To customize:**
Edit the script and change:
```typescript
const EMAIL = "your-email@example.com"
const NEW_PASSWORD = "YourNewPassword123!"
```

### List All Users
```bash
npx medusa exec ./src/scripts/list-admin-users.ts
```
Displays all admin users with their details.

---

## API Endpoints

All endpoints require admin authentication.

### List Users
```http
GET /admin/users?q=search&limit=20&offset=0
```

### Create User
```http
POST /admin/users
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin"
}
```

**Roles**: `admin`, `super_admin`, `moderator`

### Get Single User
```http
GET /admin/users/:id
```

### Update User
```http
POST /admin/users/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "super_admin",
  "is_active": true
}
```

### Delete User
```http
DELETE /admin/users/:id
```

### Reset Password
```http
POST /admin/users/:id/reset-password
Content-Type: application/json

{
  "new_password": "NewSecurePass123!"
}
```

---

## Permissions Matrix

| Action | Super Admin | Admin | Moderator |
|--------|------------|-------|-----------|
| Create users | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| Update any user | ✅ | ❌ | ❌ |
| Update own profile | ✅ | ✅ | ✅ |
| Reset any password | ✅ | ❌ | ❌ |
| Reset own password | ✅ | ✅ | ✅ |
| View users | ✅ | ✅ | ✅ |

---

## Workflows

### Create Admin User Workflow
**File**: `src/workflows/admin-user/create-admin-user.ts`

Creates user and auth identity with rollback support.

### Update Admin User Workflow
**File**: `src/workflows/admin-user/update-admin-user.ts`

Updates user details with rollback support.

### Reset Password Workflow
**File**: `src/workflows/admin-user/reset-admin-password.ts`

Resets user password securely.

### Delete Admin User Workflow
**File**: `src/workflows/admin-user/delete-admin-user.ts`

Deletes user and auth identity with rollback support.

---

## Security Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - Enforce strong passwords in production

2. **Role-Based Access**
   - Only super admins can create/delete users
   - Users can only edit their own profiles (unless super admin)

3. **Self-Protection**
   - Users cannot delete their own account
   - Prevents accidental lockouts

4. **Audit Trail**
   - User metadata tracks creation date
   - Role changes are logged

---

## Troubleshooting

### Can't Login?
1. Run the list users script to verify user exists:
   ```bash
   npx medusa exec ./src/scripts/list-admin-users.ts
   ```

2. Reset password:
   ```bash
   npx medusa exec ./src/scripts/reset-admin-password.ts
   ```

### No Users Found?
Create the super admin:
```bash
npx medusa exec ./src/scripts/create-super-admin.ts
```

### Permission Denied?
Make sure your user has the correct role:
- Only **super_admin** can create/delete users
- Check role in user list script

### Database Errors?
Run migrations:
```bash
cd apps/backend
npx medusa db:migrate
```

---

## Customization

### Change Default Credentials
Edit `src/scripts/create-super-admin.ts`:
```typescript
const SUPER_ADMIN_EMAIL = "your-email@example.com"
const DEFAULT_PASSWORD = "YourSecurePassword!"
```

### Add More Roles
1. Update role enum in workflows
2. Update permissions in API routes
3. Add role to UI dropdowns

### Custom Password Rules
Edit validation in API routes:
```typescript
if (password.length < 12) { // Change minimum length
  return res.status(400).json({
    message: "Password must be at least 12 characters long",
  })
}
```

---

## Files Structure

```
apps/backend/
├── src/
│   ├── api/
│   │   └── admin/
│   │       └── users/
│   │           ├── route.ts              # List & Create
│   │           └── [id]/
│   │               ├── route.ts          # Get, Update, Delete
│   │               └── reset-password/
│   │                   └── route.ts      # Reset Password
│   ├── admin/
│   │   └── routes/
│   │       └── users/
│   │           ├── page.tsx              # Users List UI
│   │           └── [id]/
│   │               └── page.tsx          # Edit User UI
│   ├── workflows/
│   │   └── admin-user/
│   │       ├── create-admin-user.ts
│   │       ├── update-admin-user.ts
│   │       ├── reset-admin-password.ts
│   │       └── delete-admin-user.ts
│   └── scripts/
│       ├── create-super-admin.ts         # Bootstrap script
│       ├── reset-admin-password.ts       # Password reset script
│       └── list-admin-users.ts           # List users script
└── README-ADMIN-USERS.md                 # This file
```

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review backend logs
3. Verify database migrations are up to date
4. Ensure authentication middleware is properly configured

---

## Next Steps

After creating your super admin:

1. ✅ Login to admin dashboard
2. ✅ Change default password
3. ✅ Create additional admin users
4. ✅ Assign appropriate roles
5. ✅ Test user permissions
6. ✅ Configure Paystack for payment escrow
7. ✅ Manage vendor approvals
8. ✅ Launch AgriConnect! 🚀
