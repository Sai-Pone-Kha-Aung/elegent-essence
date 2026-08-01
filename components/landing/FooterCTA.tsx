import Link from "next/link";
import { socialLinks } from "@/lib/landing-data";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products" },
    { label: "Best Sellers", href: "/products" },
  ],
  support: [
    { label: "Contact Us", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
  ],
};

export default function FooterCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 px-6 py-12 sm:px-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
                Elegant Essence
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Handcrafted fragrances for the discerning individual. Discover your signature scent.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Shop</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} Elegant Essence. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
