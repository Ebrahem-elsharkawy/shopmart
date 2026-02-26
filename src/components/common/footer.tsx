import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-white text-xl font-bold">ShopMart</h2>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for the best products, brands, and categories.
              Quality and trust delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors"><Facebook className="size-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Instagram className="size-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="size-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">Shop by Brand</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/your-orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-white" />
                <span>123 E-Commerce St, Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-white" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-white" />
                <span>support@shopmart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ShopMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
