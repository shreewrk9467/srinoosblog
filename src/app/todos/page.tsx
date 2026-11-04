import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Supabase SSR Test (Todos)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Connected to project: <code className="text-emerald-400">udankkjapmjuurcveube</code>
            </p>
          </div>
          <Link
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {error ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300 mb-6">
            <p className="font-semibold mb-1">Notice: &apos;todos&apos; table query status</p>
            <p className="text-xs opacity-90">{error.message || 'Table does not exist yet in Supabase database.'}</p>
            <p className="text-xs text-slate-400 mt-2">
              The Supabase SSR connection is active! Once you create a <code>todos</code> table in your Supabase SQL editor, rows will appear here automatically.
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Todo Items ({todos?.length || 0})
          </h2>
          <ul className="divide-y divide-slate-800/60 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            {todos && todos.length > 0 ? (
              todos.map((todo: any) => (
                <li key={todo.id} className="py-2.5 px-3 flex items-center justify-between text-sm">
                  <span className="text-slate-200">{todo.name || todo.title || JSON.stringify(todo)}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Active
                  </span>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-xs text-slate-500">
                No todos found in the database. Add rows to table &apos;todos&apos; in Supabase to see them listed here.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

