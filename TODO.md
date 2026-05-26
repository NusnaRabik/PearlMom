# TODO - Login fix (mother/provider/admin)

## Step 1: Diagnose password validation for login-by-name
- Confirm that stored `users.password_hash` contains bcrypt hash.
- Add a temporary log in `loginByName` to print whether `user.password_hash` looks like `$2a$/$2b$/$2y$`.

## Step 2: Implement robust password verification
- Ensure `User.beforeCreate` always hashes plaintext passwords.
- Ensure existing/older users with plaintext passwords get migrated (optional) or login compares plaintext fallback (for debugging only).

## Step 3: Fix backend login-by-name role logic
- Add explicit admin login lookup by `User.name` and role `admin`.
- Improve provider lookup normalization across `Midwife.full_name` and `User.name`.

## Step 4: Frontend navigation reliability
- Ensure LoginPage navigation logic uses the same role strings returned by backend.
- Surface backend error messages in UI.

## Step 5: Verify end-to-end
- Test login for: mother / provider / admin with known correct credentials.
- Confirm navigation to `/mother/dashboard`, `/provider/dashboard`, `/admin/dashboard` works.

