'use client'

import React from 'react'
import Link from 'next/link'
import {
  FaFacebookF, FaInstagram, FaYoutube,
  FaLinkedinIn, FaWhatsapp, FaTelegram, FaRss,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronRight
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Image from 'next/image'


const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  const footerLinks = {
    categories: [
      { name: 'World', href: '/Pages/world' },
      { name: 'Sports', href: '/Pages/sports' },
      { name: 'Business', href: '/Pages/business' },
      { name: 'Awards', href: '/Pages/awards' },
      { name: 'Entertainment', href: '/Pages/entertainment' },
      { name: 'Fashion', href: '/Pages/lifestyle' }
    ],
    policy: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  }

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://www.facebook.com/TimeCyberMedia/', label: 'Facebook', platform: 'facebook' },
    { icon: FaXTwitter, href: 'https://x.com/timecybermedia', label: 'X (Twitter)', platform: 'x' },
    { icon: FaInstagram, href: 'https://www.instagram.com/timecybermedia/', label: 'Instagram', platform: 'instagram' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@timecybermedia', label: 'YouTube', platform: 'youtube' },
    { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/timecybermedia?originalSubdomain=in', label: 'LinkedIn', platform: 'linkedin' },
    { icon: FaWhatsapp, href: 'https://whatsapp.com/channel/0029Vb314OB05MUbS6xEvU3g', label: 'WhatsApp', platform: 'whatsapp' }
  ]

  const contactInfo = {
    offices: [
      {
        city: 'Delhi Office',
        address: 'C-31, 3rd Floor, Nawada Housing Complex, Opp. Metro Pillar No 792, Shivaji Marg, New Delhi 110059'
      },
      {
        city: 'Mumbai Office',
        address: 'A /201 202, Vinayak Shopping Centre, Pravati Cross, Vasai Station Rd, opp. Union Bank, Vasai West, Mumbai Maharashtra 401202'
      }
    ],
    phones: [
      { number: '+91 98210 20995', label: 'Call Us' },
      { number: '+91 98730 94416', label: 'Support' }
    ],
    email: 'info@timecybermedia.com'
  }

  const platformColors: Record<string, string> = {
    facebook: 'bg-[#1877F2]',
    x: 'bg-black',
    instagram: 'bg-[#E4405F]',
    youtube: 'bg-[#FF0000]',
    linkedin: 'bg-[#0A66C2]',
    whatsapp: 'bg-[#25D366]',
    telegram: 'bg-[#26A5E4]',
    rss: 'bg-[#F26522]'
  }

  return (
    <footer id="footer" className="bg-[var(--background)] text-[var(--text-color)] pt-20 relative overflow-hidden transition-colors duration-400 after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-px after:h-full after:bg-linear-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none">
      <div className="max-w-[1400px] mx-auto px-8 relative z-1 md:px-6 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] xl:grid-cols-[1.5fr_1fr_1fr] gap-14 lg:gap-16 xl:gap-24 mb-[4.5rem] pb-[4.5rem] border-b border-[var(--border)] transition-colors duration-400">
          <div className="flex flex-col gap-[1.4rem]">
            <div className="mb-[1.2rem]">
              <Image
                src="/logo.png"
                alt="Time Cyber Media News"
                className="w-20 h-20 rounded-xl object-contain shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-400 hover:scale-[1.06] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                width={80}
                height={80}
                priority
              />
              <h3 className="font-['Lora',serif] text-[1.65rem] font-bold text-[var(--heading-color)] mt-2 mb-1 tracking-tight transition-colors duration-300">Time Cyber Media</h3>
              <p className="font-['Lora',serif] text-base text-[var(--primary)] italic font-medium m-0 transition-colors duration-300">Truth in Every Story</p>
            </div>
            <p className="font-['Inter',sans-serif] text-[0.97rem] leading-[1.75] text-[var(--text-color)] m-0 transition-colors duration-300">
              Your trusted source for breaking news, global awards coverage, and in-depth analysis.
            </p>
            <div className="flex flex-col gap-4 mt-[0.6rem]">
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 text-[0.97rem] text-[var(--text-color)] no-underline transition-all duration-300 hover:text-[var(--heading-color)] hover:translate-x-1.5 group">
                <FaEnvelope className="text-[var(--primary)] text-[1.2rem] shrink-0 transition-all duration-300 group-hover:scale-[1.12]" />
                <span>{contactInfo.email}</span>
              </a>
              {contactInfo.phones.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.number.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 text-[0.97rem] text-[var(--text-color)] no-underline transition-all duration-300 hover:text-[var(--heading-color)] hover:translate-x-1.5 group"
                >
                  <FaPhone className="text-[var(--primary)] text-[1.2rem] shrink-0 transition-all duration-300 group-hover:scale-[1.12]" />
                  <span>{phone.number} <small className="opacity-75 text-[0.88rem]">({phone.label})</small></span>
                </a>
              ))}
              {contactInfo.offices.map((office, index) => (
                <div key={index} className="flex items-start gap-4 text-[0.97rem] text-[var(--text-color)]">
                  <FaMapMarkerAlt className="text-[var(--primary)] text-[1.2rem] shrink-0 mt-1 transition-all duration-300" />
                  <div className="flex flex-col">
                    <span className="font-bold text-[0.85rem] uppercase tracking-wider text-[var(--primary)]">{office.city}</span>
                    <span>{office.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>



          <div className="flex flex-col gap-[1.4rem]">
            <h3 className="font-['Lora',serif] text-[1.3rem] font-bold mb-[1.3rem] text-[var(--heading-color)] relative pb-[0.9rem] tracking-tight transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[55px] after:h-[3px] after:bg-gradient-to-r after:from-[var(--primary)] after:to-[var(--accent)] after:rounded-[2px] after:shadow-[0_4px_12px_var(--primary)]">Categories</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {footerLinks.categories.map((link, index) => (
                <li key={index} className="flex items-center gap-[0.8rem] transition-transform duration-300 hover:translate-x-2 group/item">
                  <FaChevronRight className="text-[var(--primary)] text-[0.85rem] shrink-0 transition-all duration-300 group-hover/item:translate-x-1 sm:text-[0.8rem]" />
                  <Link href={link.href} className="font-['Inter',sans-serif] text-[var(--text-color)] no-underline text-[0.97rem] transition-colors duration-300 hover:text-[var(--heading-color)]">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-[1.4rem]">
            <h3 className="font-['Lora',serif] text-[1.3rem] font-bold mb-[1.3rem] text-[var(--heading-color)] relative pb-[0.9rem] tracking-tight transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[55px] after:h-[3px] after:bg-gradient-to-r after:from-[var(--primary)] after:to-[var(--accent)] after:rounded-[2px] after:shadow-[0_4px_12px_var(--primary)]">Policy</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {footerLinks.policy.map((link, index) => (
                <li key={index} className="flex items-center gap-[0.8rem] transition-transform duration-300 hover:translate-x-2 group/item">
                  <FaChevronRight className="text-[var(--primary)] text-[0.85rem] shrink-0 transition-all duration-300 group-hover/item:translate-x-1 sm:text-[0.8rem]" />
                  <Link href={link.href} className="font-['Inter',sans-serif] text-[var(--text-color)] no-underline text-[0.97rem] transition-colors duration-300 hover:text-[var(--heading-color)]">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-[3.5rem] lg:my-[4.5rem] text-center">
          <h3 className="font-['Lora',serif] text-[1.6rem] font-bold mb-[1.6rem] text-[var(--heading-color)] tracking-tight transition-colors duration-300">Follow Us</h3>
          <div className="flex justify-center gap-[1.2rem] flex-wrap">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-white text-[1.3rem] border border-transparent transition-all duration-[350ms] relative overflow-hidden shadow-md hover:-translate-y-[5px] hover:brightness-110 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${platformColors[social.platform]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Icon className="text-white" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="py-[2.2rem] border-t border-[var(--border)] bg-[var(--nav-hover-bg)] transition-all duration-400">
          <div className="flex justify-center items-center text-center">
            <p className="font-['Inter',sans-serif] text-[0.95rem] font-medium text-[var(--muted-foreground)] m-0 tracking-[0.02em] transition-colors duration-300">
              © {year} Time Cyber Media Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer