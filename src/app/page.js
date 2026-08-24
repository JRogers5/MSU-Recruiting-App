import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from './login/actions'
import RosterApp from '@/components/roster/RosterApp'
import './roster.css'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: staffRow } = await supabase
    .from('staff')
    .select('name, role')
    .eq('id', user.id)
    .single()

  if (!staffRow) {
    return (
      <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            The Dawg Vault
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </form>
        </header>
        <main className="flex flex-1 items-center justify-center p-8 text-center text-zinc-500">
          <p>
            Signed in as {user.email}, but no staff record found — ask an
            admin to add you.
          </p>
        </main>
      </div>
    )
  }

  const [{ data: players }, { data: settings }, { data: contacts }] = await Promise.all([
    supabase
      .from('players')
      .select('*')
      .order('position')
      .order('sort_order'),
    supabase.from('settings').select('*').eq('id', true).single(),
    supabase.from('contacts').select('*'),
  ])

  return (
    <RosterApp
      initialPlayers={players || []}
      initialSettings={
        settings || { team_name: 'Mississippi State Basketball', roster_limit: 15 }
      }
      initialContacts={contacts || []}
      role={staffRow.role}
      staffName={staffRow.name}
      logoutAction={logout}
    />
  )
}
