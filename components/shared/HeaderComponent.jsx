"use client";

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const HeaderComponent = () => {
    const pathName = usePathname();

    return (
        <header className="fixed top-2 w-full z-50">
            <div className="wrapper bg-background rounded-full shadow-sm">
                <div className="flex w-full items-center justify-between gap-2">
                    {/* application logo */}
                    <Link href="/">
                        <div className="flex justify-center items-center gap-4">
                            <Image
                                src="/icons/logo.svg"
                                alt="logo"
                                width={50}
                                height={50}
                            />
                            <h3 className="font-extrabold hidden md:block">CheckMate</h3>
                        </div>
                    </Link>

                    {/* Navigation Menus */}
                    <nav className="flex justify-center items-center gap-4">
                        <Link href="/application">
                            <div className="text-base font-semibold px-4 py-2 rounded-full">
                                Application
                            </div>
                        </Link>
                        {pathName !== '/application' && (
                            <>
                                <Link href="#features">
                                    <div className="text-base font-semibold px-4 py-2">
                                        Features
                                    </div>
                                </Link>
                                <Link href="#contact-us">
                                    <div className="hidden md:block text-base font-semibold px-4 py-2">
                                        Contact
                                    </div>
                                </Link>
                            </>
                            )
                        }    
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default HeaderComponent