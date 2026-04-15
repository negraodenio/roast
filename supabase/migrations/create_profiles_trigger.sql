-- Migration: Add trigger to automatically create profiles for new users

-- Create the trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, plan, credits)
  values (new.id, 'free', 3);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Create the trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
