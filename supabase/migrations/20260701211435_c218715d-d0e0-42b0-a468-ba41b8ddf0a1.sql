
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_designated_email() FROM PUBLIC, anon, authenticated;
