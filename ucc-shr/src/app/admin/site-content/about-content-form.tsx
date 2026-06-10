'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContentJson } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type CarouselImage = { url: string; caption: string }
type BoardMember = { name: string; role: string; bio: string; imageUrl: string; initials: string }

type Props = {
  initialData: {
    aboutCarousel: CarouselImage[]
    aboutBoard: BoardMember[]
  }
}

export function AboutContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [carousel, setCarousel] = useState<CarouselImage[]>(initialData.aboutCarousel)
  const [board, setBoard] = useState<BoardMember[]>(initialData.aboutBoard)

  // Carousel Handlers
  const addCarouselImage = () => setCarousel([...carousel, { url: '', caption: '' }])
  const removeCarouselImage = (index: number) => setCarousel(carousel.filter((_, i) => i !== index))
  const updateCarousel = (index: number, field: keyof CarouselImage, value: string) => {
    const newCarousel = [...carousel]
    newCarousel[index][field] = value
    setCarousel(newCarousel)
  }

  // Board Handlers
  const addBoardMember = () => setBoard([...board, { name: '', role: '', bio: '', imageUrl: '', initials: '' }])
  const removeBoardMember = (index: number) => setBoard(board.filter((_, i) => i !== index))
  const updateBoard = (index: number, field: keyof BoardMember, value: string) => {
    const newBoard = [...board]
    newBoard[index][field] = value
    setBoard(newBoard)
  }

  async function handleSave() {
    setIsSubmitting(true)
    try {
      const res1 = await updateSiteContentJson('aboutCarousel', carousel)
      const res2 = await updateSiteContentJson('aboutBoard', board)

      if (res1.success && res2.success) {
        toast.success('About content saved successfully')
        router.refresh()
      } else {
        toast.error('Failed to save content')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* CAROUSEL SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-navy">About Page Carousel</h2>
            <p className="mt-1 text-sm text-gray-500">Manage the sliding images and captions on the About page.</p>
          </div>
          <Button type="button" onClick={addCarouselImage} variant="outline" size="sm" className="gap-2">
            <Plus size={16} /> Add Image
          </Button>
        </div>

        <div className="space-y-4">
          {carousel.map((item, index) => (
            <div key={index} className="flex gap-4 items-start rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mt-2 text-gray-400 cursor-move"><GripVertical size={20} /></div>
              <div className="flex-1 space-y-3">
                <Input 
                  label="Image URL" 
                  value={item.url} 
                  onChange={(e) => updateCarousel(index, 'url', e.target.value)} 
                  placeholder="https://..."
                />
                <Input 
                  label="Caption" 
                  value={item.caption} 
                  onChange={(e) => updateCarousel(index, 'caption', e.target.value)} 
                />
              </div>
              <button onClick={() => removeCarouselImage(index)} className="mt-8 text-red hover:text-red-dark">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {carousel.length === 0 && <p className="text-sm text-gray-500 italic">No images added. Click "Add Image" above.</p>}
        </div>
      </div>

      {/* BOARD MEMBERS SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-navy">Board Members</h2>
            <p className="mt-1 text-sm text-gray-500">Manage the leadership team displayed on the About page.</p>
          </div>
          <Button type="button" onClick={addBoardMember} variant="outline" size="sm" className="gap-2">
            <Plus size={16} /> Add Member
          </Button>
        </div>

        <div className="space-y-4">
          {board.map((member, index) => (
            <div key={index} className="flex gap-4 items-start rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mt-2 text-gray-400 cursor-move"><GripVertical size={20} /></div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Input 
                  label="Name" 
                  value={member.name} 
                  onChange={(e) => updateBoard(index, 'name', e.target.value)} 
                />
                <Input 
                  label="Role" 
                  value={member.role} 
                  onChange={(e) => updateBoard(index, 'role', e.target.value)} 
                />
                <Input 
                  label="Initials (e.g. JD)" 
                  value={member.initials} 
                  onChange={(e) => updateBoard(index, 'initials', e.target.value)} 
                />
                <Input 
                  label="Image URL (optional)" 
                  value={member.imageUrl} 
                  onChange={(e) => updateBoard(index, 'imageUrl', e.target.value)} 
                  placeholder="https://..."
                />
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <textarea 
                    value={member.bio}
                    onChange={(e) => updateBoard(index, 'bio', e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:text-sm"
                  />
                </div>
              </div>
              <button onClick={() => removeBoardMember(index)} className="mt-8 text-red hover:text-red-dark">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {board.length === 0 && <p className="text-sm text-gray-500 italic">No board members added.</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save About Content'}
        </Button>
      </div>
    </div>
  )
}
