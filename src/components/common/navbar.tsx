"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart-context";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { items: cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#F5F5F5E5] px-4 py-4 sm:px-6 sm:py-5">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="flex items-center justify-between gap-4">
        <div className="nav-logo flex items-center gap-1 shrink-0">
          <Avatar className="rounded-lg size-8 sm:size-10">
            <AvatarFallback className="font-bold rounded-lg bg-black text-white text-sm sm:text-base">
              {session?.user?.name?.[0] ?? "S"}
            </AvatarFallback>
          </Avatar>
          <Link className="font-bold text-lg sm:text-xl" href="/">
            shopmart
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="nav-links hidden md:block">
          <NavigationMenu className="gap-3">
            {navLinks.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={href} className="hover:bg-black hover:text-white">
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenu>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <div className="nav-actions flex items-center gap-2 sm:gap-4">
          <Link href="/cart" className="relative p-2 rounded hover:bg-black/10" aria-label="Cart">
            <ShoppingCart className="size-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link href="/wishlist" className="p-2 rounded hover:bg-black/10" aria-label="Wishlist">
            <Heart className="size-6" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="p-2 rounded hover:bg-black/10" aria-label="Account">
                <User className="size-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              {status === "authenticated" ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/change-password">Change password</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/your-orders">Your Orders</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/your-orders">Your Orders</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-200 flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-2 px-3 rounded-md hover:bg-black/10 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
