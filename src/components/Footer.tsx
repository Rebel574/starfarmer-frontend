
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Download, HelpCircle, FileText, Users, Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with App Download */}
        <div className="py-12 border-b border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Download Star Farmer App</h3>
              <p className="text-gray-400 max-w-md">
                Get expert farming advice and shop for agricultural products on the go
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100">
                <Download className="h-6 w-6 mr-2" />
                <span>Android</span>
              </a>
              <a href="#" className="flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100">
                <Download className="h-6 w-6 mr-2" />
                <span>iOS</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">About Star Farmer</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="flex items-center text-gray-400 hover:text-green-500">
                  <Users className="h-5 w-5 mr-2" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="flex items-center text-gray-400 hover:text-green-500">
                  <Sprout className="h-5 w-5 mr-2" />
                  <span>Careers</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="flex items-center text-gray-400 hover:text-green-500">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Help & Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/faq" className="flex items-center text-gray-400 hover:text-green-500">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-gray-400 hover:text-green-500">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>1800-123-4567</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Office</h4>
            <div className="flex items-start text-gray-400">
              <MapPin className="h-5 w-5 mr-2 mt-1" />
              <address className="not-italic">
                Star Farmer Technologies Pvt. Ltd.<br />
                123 AgriTech Park,<br />
                Pune - 411001,<br />
                Maharashtra, India
              </address>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex items-center text-gray-400 hover:text-green-500">
                <Facebook className="h-5 w-5 mr-2" />
                <span>Facebook</span>
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-green-500">
                <Twitter className="h-5 w-5 mr-2" />
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-green-500">
                <Instagram className="h-5 w-5 mr-2" />
                <span>Instagram</span>
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-green-500">
                <Youtube className="h-5 w-5 mr-2" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Star Farmer. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Powered by: Rohit Nagtilak
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link to="/privacy" className="text-gray-400 hover:text-green-500 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-green-500 text-sm">
                Terms of Service
              </Link>
              <Link to="/refund" className="text-gray-400 hover:text-green-500 text-sm">
                Refund Policy
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-green-500 text-sm">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}