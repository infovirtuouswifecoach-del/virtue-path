
-- touch_updated_at: set search_path, switch to SECURITY INVOKER, restrict execute
alter function public.touch_updated_at() set search_path = public;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- handle_new_user: already SECURITY DEFINER and search_path set; restrict execute
revoke execute on function public.handle_new_user() from public, anon, authenticated;
