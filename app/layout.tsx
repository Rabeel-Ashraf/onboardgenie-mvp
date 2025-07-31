import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {  { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow">
            <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">OnboardGenie</Link>
              {session && (
                <Link href="/dashboard/flows" className="text-blue-600">Dashboard</Link>
              )}
            </div>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
