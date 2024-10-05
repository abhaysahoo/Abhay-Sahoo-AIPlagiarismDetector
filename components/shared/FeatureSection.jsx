"use client";

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { featureSection } from '@/constants';
import Image from 'next/image';

const FeatureCard = ({ title, icon, altText, description }) => {
  return (
    <div className='border-2 border-border min-h-[200px] hover:shadow-md rounded-lg p-4 flex items-start justify-start gap-2'>
      <div className='basis-1/5'>
        <Image
          src={icon}
          alt={altText}
          width={50}
          height={50}
        />
      </div>
      <div className='basis-4/5'>
        <p className='text-lg font-bold text-stone-secondary'>{title}</p>
        <p className='text-stone-primary mt-2'>{description}</p>
      </div>
    </div>
  )
}

const FeatureSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this only runs on the client
  }, []);

  return (
    <section id="features" className='py-24'>
      <div className='flex flex-col gap-8 items-center'>
        <p className='font-bold text-center text-4xl md:text-5xl leading-[50px] md:leading-[60px]'>Check Originality in Seconds to Stand Out</p>
        <p className='max-w-3xl text-center text-base md:text-xl font-semibold text-stone-primary'>
          {featureSection.subHeading}
        </p>

        {/* Feature Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 w-full mt-16'>
          {/* Feature Cards */}
          <div className='flex flex-col gap-4'>
            {
              featureSection.features.map((item, index) => <FeatureCard key={index} {...item} />)
            }
          </div>
          {/* Media Player */}
          <div className='lg:col-start-2 lg:col-end-4 row-start-1 row-end-2 self-center justify-self-center'>
            {/* Conditionally render ReactPlayer only on client-side */}
            {isClient && (
              <ReactPlayer
                url="/videos/product-demo.mp4"
                controls={true}
                width="100%"
                height="auto"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection;
