import React, { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

interface ImageCard {
  id: string
  src: string
  alt: string
  rotation: number
}

interface ImageCarouselHeroProps {
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  images?: ImageCard[]
  features?: Array<{
    title: string
    description: string
  }>
}

const defaultImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80', alt: 'Invoice Template', rotation: -5 },
  { id: '2', src: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=400&q=80', alt: 'Proposal Template', rotation: 5 },
  { id: '3', src: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', alt: 'Receipt Template', rotation: -2 },
  { id: '4', src: 'https://images.unsplash.com/photo-1554224154-26032ffc0d04?w=400&q=80', alt: 'Contract Template', rotation: 3 },
  { id: '5', src: 'https://images.unsplash.com/photo-1568225441865-c89b4f9fb578?w=400&q=80', alt: 'Quote Template', rotation: -4 },
];

export function TemplateCarousel({
  title = "Stunning Templates",
  description = "Choose from a wide variety of professionally crafted document templates, ready to be customized with your brand identity.",
  ctaText = "Browse Templates",
  onCtaClick,
  images = defaultImages,
  features = [
    {
      title: "Professional Designs",
      description: "Templates that make your business look world-class.",
    },
    {
      title: "Instant Customization",
      description: "Apply your brand colors and logo in a single click.",
    },
    {
      title: "Pixel-Perfect Export",
      description: "Generate flawless PDFs that look exactly like the preview.",
    },
  ],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [rotatingCards, setRotatingCards] = useState<number[]>([])

  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((val) => (val + 0.5) % 360))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Initialize rotating cards
  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)))
  }, [images.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <div className="relative w-full py-32 bg-surface-950 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div
          className="relative w-full max-w-6xl h-96 sm:h-[450px] mb-12 sm:mb-16"
          onMouseMove={handleMouseMove}
        >
          {/* Rotating Image Cards */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
            {images.map((image, index) => {
              const angle = (rotatingCards[index] || 0) * (Math.PI / 180)
              const radius = 220
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius * 0.3 // Flatten the ellipse

              // 3D perspective effect based on mouse position
              const perspectiveX = (mousePosition.x - 0.5) * 30
              const perspectiveY = (mousePosition.y - 0.5) * 30

              return (
                <div
                  key={image.id}
                  className="absolute w-40 h-56 sm:w-48 sm:h-64 transition-all duration-300"
                  style={{
                    transform: `
                      translate(${x}px, ${y}px)
                      rotateX(${perspectiveY}deg)
                      rotateY(${perspectiveX}deg)
                      rotateZ(${image.rotation}deg)
                    `,
                    transformStyle: "preserve-3d",
                    zIndex: Math.floor(Math.sin(angle) * 100) + 100 // Depth sorting
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer group border border-surface-700`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-20 text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            {title}
          </h2>

          <p className="text-lg sm:text-xl text-surface-400 mb-8 max-w-xl mx-auto">
            {description}
          </p>

          {/* CTA Button */}
          <button
            onClick={onCtaClick}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-600 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group`}
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Section */}
        <div className="relative z-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl bg-surface-900/50 backdrop-blur-sm border border-surface-800 hover:bg-surface-800 hover:border-surface-700 transition-all duration-300 group`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-surface-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
