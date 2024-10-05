import Link from 'next/link'

const HeroSection = () => {
  return (
      <section>
          <div className="flex items-center h-screen">
              <div className="mx-auto w-full max-w-3xl text-center">
                  <div
                      className="p-4 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] 
                      bg-clip-text text-3xl font-extrabold text-transparent md:text-6xl"
                  >
                      Real-time AI-Powered <br /> Plagiarism Detection
                  </div>

                  <h5 className="mx-auto mt-4 max-w-xl text-base md:text-xl text-stone-primary">
                      Your Trusted Ally in Academic Integrity and Originality, One Scan at a Time
                  </h5>

                  <Link href="/application">
                      <div className='mt-8 text-xl md:text-3xl rounded-full shadow-md mx-auto max-w-max px-8 py-4 
                      sm:px-16 sm:py-8 font-bold text-background bg-gradient-to-r from-[bg-gradient-to-r from-[#11998e] to-[#38ef7d]'>
                        Upload Your Document
                    </div>
                  </Link>
              </div>
          </div>
      </section>
  )
}

export default HeroSection