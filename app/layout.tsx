import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { HeaderNav } from "@/components/layout/header-nav"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Tryumph Coaching - Tools",
  description: "Empowering tools for personal and professional growth",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderNav />
            <main className="flex-grow px-4 md:px-0">{children}</main>
            <footer className="bg-gray-100 py-6 mt-12">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>&copy; 2023 Tryumph Coaching. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

