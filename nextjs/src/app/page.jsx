import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div>
        <h1>Home Page</h1>
        <Link href="/mailus" className="text-xl font-semibold no-underline">Contact Us</Link>
      </div>
    </main>
  );
}