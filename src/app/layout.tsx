import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zephyron Tech - Coming Soon",
  description: "Zephyron Tech is crafting intelligent software solutions. Stay tuned for our launch.",
  generator: "v0.app",
  keywords: ["Zephyron Tech", "software solutions", "technology", "AI", "intelligent software"],
  authors: [{ name: "Zephyron Tech" }],
  openGraph: {
    title: "Zephyron Tech - Coming Soon",
    description: "Crafting intelligent software solutions.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
