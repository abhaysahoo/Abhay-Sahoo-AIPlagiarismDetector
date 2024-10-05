import localFont from "next/font/local";
import "@/styles/globals.css";
import HeaderComponent from "@/components/shared/HeaderComponent";
import FooterSection from "@/components/shared/FooterSection";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CheckMate",
  description: "Get Your Plagiarism Score In Seconds With AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <HeaderComponent />
        {children}
        <FooterSection />
      </body>
    </html>
  );
}
