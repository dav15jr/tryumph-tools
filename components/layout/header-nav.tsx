"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Instagram, Youtube, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHovered(false)
      }
    }
    document.addEventListener("mouseover", handleClickOutside)
    return () => {
      document.removeEventListener("mouseover", handleClickOutside)
    }
  }, [])

  return (
    <>
      {/* Header with social icons */}
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="w-1/3">
          <Link href="/" className="text-2xl font-bold text-purple-600 md:hidden">
            Tryumph
          </Link>
        </div>
        <div className="w-1/3 flex justify-center">
          {/* Social media icons */}
          <div className="flex gap-4 items-center justify-center flex-grow">
            <Link href="https://instagram.com" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://youtube.com" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>

      {/* Logo section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wol%20screen-t6ZYwHZIPyKHPZGGGkdrp482E4JQqS.png"
          alt="Tryumph Coaching Logo"
          width={300}
          height={90}
          className="mx-auto w-3/4 max-w-xs"
          priority
        />
        <p className="text-yellow-500 text-lg mt-2 font-semibold">TO TRIUMPH YOU MUST FIRST TRY</p>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center py-4 md:py-0">
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <ul
              className={`md:flex md:items-center md:justify-center w-full gap-4 py-4 absolute left-0 md:relative ${
                isMenuOpen ? "fixed inset-0 bg-white z-50 h-full flex flex-col justify-center" : "hidden"
              } md:flex bg-white md:bg-transparent z-20`}
            >
              {isMenuOpen && (
                <li className="md:hidden absolute top-4 right-4 z-50">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </li>
              )}
              {["COACHING PACKAGES", "BOOKING", "CONTACT US", "ABOUT"].map((item, index) => (
                <li key={index} className="text-center">
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className={`block text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li
                className="text-center relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link
                  href="/"
                  className="flex items-center text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md"
                >
                  TOOLS <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                {isHovered && (
                  <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        href="/wheel-of-life"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Wheel of Life
                      </Link>
                      <Link
                        href="/planner"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Productivity Planner
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
          {user && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button
                variant="outline"
                onClick={handleLogout}
                size="sm"
                className="hover:bg-purple-600 hover:text-white transition-colors duration-200"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

