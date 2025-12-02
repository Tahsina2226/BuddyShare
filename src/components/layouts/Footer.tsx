'use client'

import Link from 'next/link'
import { 
  FiMail,  
  FiMapPin, 
  FiPhone, 
  FiHeart,
  FiUsers,
  FiMusic,
  FiCoffee,
  FiBriefcase,
  FiGlobe,
} from 'react-icons/fi'
import { FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FiMail, href: '#', label: 'Email' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ]

  const infoLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support' },
  ]

  const eventCategories = [
    { href: '/events?category=music', label: 'Music Concerts', icon: FiMusic, count: '1.2k+' },
    { href: '/events?category=conference', label: 'Conferences', icon: FiBriefcase, count: '850+' },
    { href: '/events?category=workshop', label: 'Workshops', icon: FiCoffee, count: '650+' },
    { href: '/events?category=sports', label: 'Sports Events', icon: FiGlobe, count: '420+' },
    { href: '/events?category=networking', label: 'Networking', icon: FiUsers, count: '780+' },
    { href: '/events?category=charity', label: 'Charity Events', icon: FiHeart, count: '320+' },
  ]

  return (
    <>
      {/* Top decorative line */}
      <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent h-1" />
      
      <footer className="relative bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] overflow-hidden text-white">
        {/* Background decorative elements */}
        <div className="top-0 absolute inset-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px" />
        
        {/* Animated floating elements */}
        <div className="top-20 left-10 absolute bg-gradient-to-r from-[#D2C1B6]/5 to-transparent blur-3xl rounded-full w-64 h-64" />
        <div className="right-10 bottom-20 absolute bg-gradient-to-l from-[#96A78D]/5 to-transparent blur-3xl rounded-full w-96 h-96" />

        <div className="z-10 relative mx-auto px-4 py-16 max-w-7xl">
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Company Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Link href="/" className="group inline-flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-lg rounded-xl" />
                  <div className="relative flex justify-center items-center bg-white/10 group-hover:bg-white/15 backdrop-blur-sm border border-white/20 group-hover:border-white/30 rounded-xl w-12 h-12 transition-all duration-300">
                    <span className="font-bold text-white text-2xl">E</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="bg-clip-text bg-gradient-to-r from-white to-white/80 font-bold text-transparent text-3xl tracking-tight">
                    EventBuddy
                  </span>
                  <span className="font-light text-white/60 text-xs tracking-widest">
                    CONNECT • EXPERIENCE • CELEBRATE
                  </span>
                </div>
              </Link>
              
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted partner for discovering and creating unforgettable events. Connect with communities, experience amazing moments, and celebrate life's special occasions with EventBuddy.
              </p>
              
              <div>
                <h4 className="mb-3 font-bold text-white text-sm uppercase tracking-wider">Follow Us</h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      href={social.href}
                      aria-label={social.label}
                      className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2.5 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                      <div className="-top-10 left-1/2 absolute bg-white/20 opacity-0 group-hover:opacity-100 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs whitespace-nowrap transition-opacity -translate-x-1/2 duration-200">
                        {social.label}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Event Categories */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="relative mb-6 font-bold text-white text-xl">
                <span className="z-10 relative">Popular Categories</span>
                <div className="-bottom-1 left-0 absolute bg-gradient-to-r from-white via-white/50 to-transparent w-12 h-0.5" />
              </h3>
              
              <div className="gap-3 grid grid-cols-1">
                {eventCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group relative bg-gradient-to-r from-white/5 hover:from-white/10 to-transparent p-3 border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors">
                          <category.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/80 group-hover:text-white transition-colors">
                          {category.label}
                        </span>
                      </div>
                      <span className="bg-white/10 px-2 py-1 rounded-full font-medium text-white/60 text-xs">
                        {category.count}
                      </span>
                    </div>
                    <div className="bottom-0 left-0 absolute bg-gradient-to-r from-white via-white/50 to-transparent w-0 group-hover:w-full h-0.5 transition-all duration-500" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="relative mb-6 font-bold text-white text-xl">
                <span className="z-10 relative">Stay Connected</span>
                <div className="-bottom-1 left-0 absolute bg-gradient-to-r from-white via-white/50 to-transparent w-12 h-0.5" />
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-white/5 p-3 border border-white/10 rounded-xl">
                  <FiMapPin className="flex-shrink-0 mt-0.5 w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-sm">
                    123 Event Street, City Center<br />
                    Dhaka 1212, Bangladesh
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/5 p-3 border border-white/10 rounded-xl">
                  <FiPhone className="flex-shrink-0 w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-sm">+880 1234 567890</span>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/5 p-3 border border-white/10 rounded-xl">
                  <FiMail className="flex-shrink-0 w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-sm">support@eventbuddy.com</span>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="pt-4">
                <h4 className="mb-3 font-bold text-white text-sm uppercase tracking-wider">Newsletter</h4>
                <p className="mb-4 text-white/60 text-sm">
                  Subscribe to get updates on trending events and exclusive offers
                </p>
                <form className="space-y-3">
                  <div className="relative">
                    <FiMail className="top-1/2 left-4 absolute text-white/50 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="bg-white/10 py-3 pr-4 pl-12 border border-white/20 hover:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white text-sm transition-all duration-300 placeholder-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl px-4 py-3 border border-white/30 hover:border-white/50 rounded-xl w-full font-medium text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="border-white/10 border-t w-full"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-r from-[#234C6A] via-[#1a3d57] to-[#152a3d] px-4 text-white/50 text-sm">
                ✨
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex md:flex-row flex-col justify-between items-center space-y-6 md:space-y-0"
          >
            <div className="md:text-left text-center">
              <div className="text-white/50 text-sm">
                © {currentYear} EventBuddy. All rights reserved.
              </div>
              <div className="flex justify-center md:justify-start items-center space-x-2 mt-2 text-white/40 text-xs">
                <FiHeart className="w-3 h-3 text-red-400/70 animate-pulse" />
                <span>Made with passion in Bangladesh</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/50 hover:text-white text-sm hover:scale-105 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
                <span className="text-white/50 text-sm">Live Support</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="text-white/50 text-sm">
                <span className="font-medium text-white/70">24/7</span> Available
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent h-px" />
      </footer>
    </>
  )
}