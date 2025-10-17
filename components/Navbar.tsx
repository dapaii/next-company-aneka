"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, UserCircle2 } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface BrandItem {
  title: string;
  href: string;
  description: string;
}

const brands: BrandItem[] = [
  {
    title: "Remov",
    href: "/brands/remov",
    description: "Description for Brand 1",
  },
  {
    title: "Supernova",
    href: "/brands/supernova",
    description: "Description for Brand 2",
  },
  {
    title: "Ipro",
    href: "/brands/ipro",
    description: "Description for Brand 3",
  },
]

export function Navbar() {
  const [show, setShow] = React.useState<boolean>(true)
  const [lastScrollY, setLastScrollY] = React.useState<number>(0)
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false)
  const [scrolled, setScrolled] = React.useState<boolean>(false)
  const scrollPositionRef = React.useRef<number>(0)

  React.useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY: number = window.scrollY
      
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setShow(false)
        } else {
          setShow(true)
        }
      } else {
        setShow(true)
      }
      
      if (currentScrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return (): void => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  React.useEffect(() => {
    if (menuOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = scrollPositionRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
    
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleLinkClick = (): void => {
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 text-black px-4 py-2 flex justify-center transition-all duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled 
            ? "bg-[#0f172a] shadow-lg backdrop-blur-sm" 
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl px-4 md:px-8">
          {/* Logo Section */}
          <Link href="#home" className="flex items-center gap-2 min-w-0">
            <img 
              src="/PT ADI.png" 
              alt="ADI Logo" 
              className="h-12 md:h-16 w-auto flex-shrink-0" 
            />
            <span className="hidden md:block text-white font-poppins font-semibold text-lg text-outline text-outline-strong whitespace-nowrap">
              Aneka Distribusi Indonesia
            </span>
          </Link>

          {/* Tombol hamburger */}
          <button
            className="md:hidden text-white z-[60]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>

          {/* Desktop Navigation Menu - TANPA Services & Blog */}
          <div className="hidden md:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="#home" 
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 font-poppins font-semibold text-white text-outline-strong transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="#aboutus" 
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 font-poppins font-semibold text-white text-outline-strong transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                    >
                      About ADI
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className="!bg-transparent hover:!bg-white/10 focus:!bg-white/10 data-[state=open]:!bg-white/10 px-4 py-2 font-poppins font-semibold text-white text-outline-strong transition-colors rounded-md">
                    Our Brand
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="top-full mt-2">
                    <ul className="grid w-[350px] gap-3 p-4 bg-white rounded-md shadow-lg">
                      {brands.map((brand: BrandItem) => (
                        <ListItem
                          key={brand.title}
                          title={brand.title}
                          href={brand.href}
                        >
                          {brand.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="#event" 
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 font-poppins font-semibold text-white text-outline-strong transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                    >
                      Event
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="#contact" 
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 font-poppins font-semibold text-white text-outline-strong transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                    >
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center justify-center !bg-transparent hover:!bg-white/10 focus:!bg-white/10 px-3 py-2 rounded-md transition-colors duration-200"
                    >
                      <UserCircle2 
                        size={28}
                        style={{ width: '28px', height: '28px' }}
                        className="text-white" 
                        strokeWidth={2}
                      />
                      <span className="sr-only">Admin Login</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* ✅ MOBILE MENU - FIXED (TANPA Services & Blog) */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <Link
            href="#home"
            onClick={handleLinkClick}
            className="text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            HOME
          </Link>
          <Link
            href="#about"
            onClick={handleLinkClick}
            className="text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            ABOUT ADI
          </Link>
          <Link
            href="#brands"
            onClick={handleLinkClick}
            className="text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            OUR BRAND
          </Link>
          <Link
            href="#event"
            onClick={handleLinkClick}
            className="text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            EVENT
          </Link>
          <Link
            href="#contact"
            onClick={handleLinkClick}
            className="text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            CONTACT US
          </Link>
          <Link
            href="/admin/login"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-white font-poppins font-semibold text-3xl hover:text-blue-500 transition-colors duration-300"
          >
            <UserCircle2 size={48} className="text-white" aria-hidden />
            ADMIN LOGIN
          </Link>
        </div>
      </div>
    </>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"li"> {
  href: string;
  title: string;
  children: React.ReactNode;
}

function ListItem({ title, children, href, ...props }: ListItemProps) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
