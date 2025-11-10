"use client";

import { useEffect, useState } from "react"

export default function ComingSoonPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsVisible(true)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient sphere - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-cyan-500 via-violet-600 to-transparent opacity-20 blur-3xl animate-float-slow" />

        {/* Large gradient sphere - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-tr from-fuchsia-600 via-violet-500 to-transparent opacity-20 blur-3xl animate-float-medium" />

        {/* Medium gradient sphere - center right */}
        <div className="absolute top-1/2 -right-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-l from-violet-500 to-transparent opacity-15 blur-2xl animate-float-fast" />

        {/* Sharp gradient rectangle - top left */}
        <div className="absolute top-20 left-10 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-br from-cyan-400 to-violet-600 opacity-10 blur-2xl rotate-45 animate-pulse-slow" />
      </div>

      {/* Content container with fade-in animation */}
      <div
        suppressHydrationWarning
        className={`relative z-10 flex flex-col items-center justify-center text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 md:mb-8">
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(139,92,246,0.6)] animate-glow">
            Zephyron Tech
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-16 md:mb-20 max-w-3xl px-4 font-light tracking-wide">
          Crafting intelligent software solutions.
        </p>

        {/* Coming Soon with animated dots */}
        <div className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl text-violet-300 font-medium">
          <span>Coming Soon</span>
          <span className="flex gap-1">
            <span className="animate-bounce-dot-1">.</span>
            <span className="animate-bounce-dot-2">.</span>
            <span className="animate-bounce-dot-3">.</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 md:bottom-8 left-0 right-0 text-center z-10">
        <p className="text-sm md:text-base text-gray-500 font-light">© 2025 Zephyron Tech s.r.o.</p>
      </footer>
    </main>
  )
}
