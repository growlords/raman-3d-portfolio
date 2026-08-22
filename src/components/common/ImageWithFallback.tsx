import React, { useState } from 'react'

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  alt: string
  className?: string
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-[#18191e] ${className}`}>
      {/* Loading Skeleton Pulse */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#18191e] via-[#24262f] to-[#18191e] animate-pulse" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#131418] text-[#D7E2EA]/50 text-xs font-mono">
          <div className="w-8 h-8 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center mb-2">
            3D
          </div>
          <span>{alt || 'Visual Asset'}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  )
}
