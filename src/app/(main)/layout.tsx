import NavBar from '@/components/custom/nav-bar'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden`}>
      <header className="block shadow-lg bg-primary">
        <div className="container md:max-w-5xl lg:max-w-7xl">
          <div className="flex items-center justify-between p-4 gap-4 h-16">
            <Link href="/">
              <Image src="/images/logo-icon.png" width={50} height={50} alt="logo" />
            </Link>
            <NavBar />
            <div className="space-x-2">
              <SignedOut>
                <SignInButton>
                  <Button className="bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-full px-4 py-2">
                    <Link href="/sign-in" className="text-black">
                      Sign in
                    </Link>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
      {children}
      <footer className="bg-indigo-950 text-white py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top Section: Logo and Social Media */}
          <div className="flex justify-between items-center mb-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <h1 className="text-xl font-bold">Educrat</h1>
            </div>
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="uppercase text-sm font-bold">Follow us on social media</span>
              <div className="flex space-x-3">
                <Link href="#" className="text-gray-400 hover:text-white">
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-facebook-icon lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-instagram-icon lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>

                <Link href="#" className="text-gray-400 hover:text-white">
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-linkedin-icon lucide-linkedin"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content: Four Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Column */}
            <div>
              <h2 className="uppercase font-semibold mb-4">About</h2>
              <ul className="space-y-2">
                {['About', 'Contact', 'Help Center', 'Refund', 'Conditions', 'Privacy Policy'].map(
                  (item) => (
                    <li key={item}>
                      <Link href="#" className="text-gray-400 hover:text-white">
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Category Column */}
            <div>
              <h2 className="uppercase font-semibold mb-4">Category</h2>
              <ul className="space-y-2">
                {[
                  'Design',
                  'Development',
                  'Marketing',
                  'Finance & Accounting',
                  'IT & Software',
                  'Sales Marketing',
                  'Photography',
                  'Art & Humanities',
                  'Social Sciences',
                  'Personal',
                  'Lifestyle',
                  'SEO',
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h2 className="uppercase font-semibold mb-4">Support</h2>
              <ul className="space-y-2">
                {['Profile', 'Contact', 'Help Center', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get in Touch Column */}
            <div>
              <h2 className="uppercase font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-400 mb-4">We don’t send spam so don’t worry.</p>
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Your Email..."
                  className="bg-transparent border border-gray-500 rounded-l-full py-2 px-4 text-gray-300 focus:outline-none"
                />
                <Button>Submit</Button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Copyright and Links */}
          <div className="flex justify-between items-center border-t border-gray-700 pt-4">
            <p className="text-gray-400">© 2022 Educrat, All Right Reserved.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                Help
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Term & Conditions
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Security
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Return Policy
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 3.055A15 15 0 0121 21m0 0a15 15 0 01-17.945-17.945m12.89 5.657a6 6 0 11-8.486 8.486m8.486-8.486a6 6 0 00-8.486 8.486"
                />
              </svg>
              <span className="text-gray-400">English</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
