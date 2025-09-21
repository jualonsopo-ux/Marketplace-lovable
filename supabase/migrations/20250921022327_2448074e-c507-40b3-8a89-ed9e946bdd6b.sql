-- Add missing roles to the user_role_enum
ALTER TYPE user_role_enum ADD VALUE 'psychologist';
ALTER TYPE user_role_enum ADD VALUE 'staff';