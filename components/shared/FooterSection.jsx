import { legalLinks, socialLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LegalLink = ({ name, link }) => {
    return (
        <Link href={link}>
            <span className='text-background lg:text-base'>{name}</span>
        </Link>
    )
}

const SocialLink = ({ name, link, icon }) => {
    return (
        <Link href={link}>
            <Image 
                src={icon}
                alt={name}
                width={20}
                height={20}
            />
        </Link>
    )
}

const FooterSection = () => {
  return (
      <footer className="bg-foreground mt-20">
          <div className='wrapper'>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start">
                {/* legal links */}
                <div className='flex items-center flex-wrap gap-4 py-4'>
                    {
                        legalLinks.map((item, index) => <LegalLink key={index} {...item} />)
                    }
                </div>
                {/* social icons */}
                <div className='flex items-center flex-wrap gap-4 py-4'>
                    {
                        socialLinks.map((item, index) => <SocialLink key={index} {...item} />)
                    }
                </div>
            </div>
            {/* copyright text */}
            <p className="text-xs text-background mt-4">&copy; 2024 CheckMate - All rights reserved.</p>
          </div>       
      </footer>
  )
}

export default FooterSection