-- Re-assign demo accounts that were all pinned to org "TEST" (000…002).
-- Client users → NexGen; partner users → UP100X Global Operations; platform roles → no org.

UPDATE public.profiles
SET organization_id = '00000000-0000-4000-a000-000000000003'
WHERE email IN ('client_admin@user.com', 'client_sub@user.com');

UPDATE public.profiles
SET organization_id = '00000000-0000-4000-a000-000000000001'
WHERE email IN ('sp_primary@user.com', 'sp_sub@user.com');

UPDATE public.profiles
SET organization_id = NULL
WHERE email IN ('admin@user.com', 'gcc_reviewer@user.com');

-- Partner primary can see assigned clients (NexGen demo).
INSERT INTO public.sp_client_assignments (sp_user_id, client_org_id)
SELECT sp.id, '00000000-0000-4000-a000-000000000003'::uuid
FROM public.profiles sp
WHERE sp.email = 'sp_primary@user.com'
ON CONFLICT (sp_user_id, client_org_id) DO NOTHING;
