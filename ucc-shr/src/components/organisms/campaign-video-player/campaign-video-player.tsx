'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { Text } from '@/src/components/atoms/text/text'

interface CampaignVideoPlayerProps {
  videoUrl?: string | null
}

export function CampaignVideoPlayer({ videoUrl }: CampaignVideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null
  const isYouTube = Boolean(youtubeId)
  const embedUrl = isYouTube ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : videoUrl

  const hasVideo = Boolean(videoUrl && embedUrl)

  return (
    <>
      <div 
        className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 border border-white/10 group ${hasVideo ? 'cursor-pointer' : ''}`}
        onClick={() => hasVideo && setIsOpen(true)}
      >
        {/* Background Thumbnail Preview */}
        {hasVideo && (
          isYouTube ? (
            <img src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`} alt="Video Thumbnail" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <video src={videoUrl as string} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
          )
        )}

        {/* Overlay Cover */}
        <div className={`absolute inset-0 flex items-center justify-center ${hasVideo ? 'bg-black/10 transition-all duration-500 group-hover:bg-black/30' : 'bg-gray-100'}`}>
          <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${hasVideo ? 'bg-red text-white' : 'bg-white text-navy border border-gray-200'}`}>
            <Play fill="currentColor" size={24} className="ml-1" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasVideo && embedUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/70 hover:bg-black/70 hover:text-white transition-colors backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              {isYouTube ? (
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls autoPlay className="absolute inset-0 h-full w-full outline-none">
                  <source src={embedUrl} type="video/mp4" />
                </video>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
