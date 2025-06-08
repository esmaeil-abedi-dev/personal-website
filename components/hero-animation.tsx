"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full max-w-md aspect-square">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/20">
          <Image src="/placeholder.svg?height=400&width=400" alt="Profile" fill className="object-cover" priority />
        </div>
      </motion.div>
      <motion.div
        className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="font-bold">Developer</span>
      </motion.div>
      <motion.div
        className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground px-6 py-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="font-bold">Writer</span>
      </motion.div>
    </div>
  )
}
