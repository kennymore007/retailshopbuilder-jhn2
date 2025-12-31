import { CartDropdown } from "@/components/cart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const marketplaces = [
    { id: "harvest", name: "Harvest Batches", icon: "🌾", to: `${baseHref}/marketplace/harvest` },
    { id: "vehicles", name: "Vehicles", icon: "🚚", to: `${baseHref}/marketplace/vehicles` },
    { id: "storage", name: "Storage", icon: "🏭", to: `${baseHref}/marketplace/storage` },
    { id: "equipment", name: "Equipment", icon: "🚜", to: `${baseHref}/marketplace/equipment` },
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-40">
      <header className="relative h-16 mx-auto border-b bg-green-900 border-green-800">
        <nav className="content-container text-sm font-medium text-green-100 flex items-center justify-between w-full h-full">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link
              to={baseHref || "/"}
              className="text-xl font-bold text-white hover:text-green-100 flex items-center gap-2"
            >
              <span className="text-2xl">🌾</span>
              <span className="font-mono tracking-tight">AGRIMARKET</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden lg:flex items-center h-full">
            <NavigationMenu.List className="flex items-center gap-x-6 h-full">
              {/* Marketplaces dropdown */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Trigger className="text-green-100 hover:text-white h-full flex items-center gap-1 select-none font-semibold">
                  Marketplaces
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="content-container py-12">
                  <div className="grid grid-cols-4 gap-6">
                    {marketplaces.map((market) => (
                      <NavigationMenu.Link key={market.id} asChild>
                        <Link
                          to={market.to}
                          className="flex flex-col items-center text-center p-6 border border-stone-200 hover:border-green-400 hover:bg-green-50 transition-all"
                        >
                          <span className="text-4xl mb-3">{market.icon}</span>
                          <span className="text-stone-900 font-semibold">
                            {market.name}
                          </span>
                        </Link>
                      </NavigationMenu.Link>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <a href={`${baseHref}/how-it-works`} className="text-green-100 hover:text-white">
                    How It Works
                  </a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <a href={`${baseHref}/register`} className="text-green-100 hover:text-white">
                    Become a Vendor
                  </a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <a href={`${baseHref}/vendor-login`} className="text-green-100 hover:text-white">
                    Vendor Login
                  </a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport
              className="absolute top-full bg-white border-b border-stone-200 shadow-lg overflow-hidden
                data-[state=open]:animate-[dropdown-open_300ms_ease-out]
                data-[state=closed]:animate-[dropdown-close_300ms_ease-out]"
              style={{ left: "50%", transform: "translateX(-50%)", width: "100vw" }}
            />
          </NavigationMenu.Root>

          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger className="lg:hidden text-green-100 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </DrawerTrigger>
            <DrawerContent side="left">
              <DrawerHeader>
                <DrawerTitle className="uppercase">Menu</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col py-4">
                <div className="px-6 py-4 text-stone-900 text-lg font-semibold">
                  Marketplaces
                </div>
                <div className="flex flex-col">
                  {marketplaces.map((market) => (
                    <DrawerClose key={market.id} asChild>
                      <Link
                        to={market.to}
                        className="px-10 py-3 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-3"
                      >
                        <span className="text-xl">{market.icon}</span>
                        <span>{market.name}</span>
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
                <div className="border-t border-stone-200 mt-4 pt-4">
                  <DrawerClose asChild>
                    <a
                      href={`${baseHref}/how-it-works`}
                      className="px-6 py-3 text-stone-600 hover:bg-stone-50 transition-colors block"
                    >
                      How It Works
                    </a>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <a
                      href={`${baseHref}/register`}
                      className="px-6 py-3 text-stone-600 hover:bg-stone-50 transition-colors block"
                    >
                      Become a Vendor
                    </a>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Cart & Account */}
          <div className="flex items-center gap-x-4 h-full justify-end">
            <a href={`${baseHref}/login`} className="text-green-100 hover:text-white hidden lg:block">
              Login
            </a>
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}
