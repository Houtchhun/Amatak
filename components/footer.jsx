import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold mb-4 relative pb-3">
              AMATAK
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premium footwear for every occasion. Quality, comfort, and style that lasts.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4 relative pb-3">
              Shop
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Women's Shoes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Kids' Shoes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4 relative pb-3">
              Help
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4 relative pb-3">
              Contact
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2" />
                123 Fashion St, Cambodia
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                (123) 456-7890
              </li>
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                info@amatak.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; 2025 AMATAK Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
