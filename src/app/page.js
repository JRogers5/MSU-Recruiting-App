import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from './login/actions'

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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            MSU Roster
          </h1>
          {staffRow ? (
            <p className="text-sm text-zinc-500">
              {staffRow.name} · {staffRow.role === 'admin' ? 'Admin' : 'View only'}
            </p>
          ) : (
            <p className="text-sm text-red-600">
              Signed in as {user.email}, but no staff record found — ask an
              admin to add you.
            </p>
          )}
        </div>
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
        {staffRow?.role === 'admin' ? (
          <p>You&apos;re signed in as an admin. The roster board gets ported here next.</p>
        ) : staffRow ? (
          <p>You&apos;re signed in as view-only. The roster board will show up here.</p>
        ) : (
          <p>Once an admin adds your staff record, you&apos;ll see the roster here.</p>
        )}
      </main>
    </div>
  )
}
