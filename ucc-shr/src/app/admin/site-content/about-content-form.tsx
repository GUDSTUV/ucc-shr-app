'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContentJson } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type BoardMember = { name: string; role: string; bio: string; imageUrl: string; initials: string }

type Props = {
  initialData: {
    aboutBoard: BoardMember[]
  }
}

export function AboutContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const [board, setBoard] = useState<BoardMember[]>(initialData.aboutBoard)

  // Board Handlers
  const addBoardMember = () => setBoard([...board, { name: '', role: '', bio: '', imageUrl: '', initials: '' }])
  const removeBoardMember = (index: number) => setBoard(board.filter((_, i) => i !== index))
  const updateBoard = (index: number, field: keyof BoardMember, value: string) => {
    const newBoard = [...board]
    newBoard[index][field] = value
    setBoard(newBoard)
  }

  async function handleImageUpload(index: number, file: File) {
    if (!file) return
    setUploadingIndex(index)
    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('kinds', 'board')

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.ok && data.files && data.files.length > 0) {
        // Expected format: "board:URL"
        const uploadedStr = data.files[0]
        const uploadedUrl = uploadedStr.includes('board:') ? uploadedStr.split('board:')[1] : uploadedStr
        updateBoard(index, 'imageUrl', uploadedUrl)
        toast.success('Image uploaded successfully')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      toast.error('An error occurred during upload')
    } finally {
      setUploadingIndex(null)
    }
  }

  async function handleSave() {
    setIsSubmitting(true)
    try {
      const res2 = await updateSiteContentJson('aboutBoard', board)

      if (res2.success) {
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
                <div className="space-y-1">
                  <Input 
                    label="Image URL (optional)" 
                    value={member.imageUrl} 
                    onChange={(e) => updateBoard(index, 'imageUrl', e.target.value)} 
                    placeholder="https://..."
                  />
                  {member.imageUrl && (
                    <div className="pt-2">
                      <img src={member.imageUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-gray-200" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <label className={`text-xs font-medium cursor-pointer hover:underline ${uploadingIndex === index ? 'text-gray-400 cursor-not-allowed' : 'text-navy'}`}>
                      {uploadingIndex === index ? 'Uploading...' : 'Or upload image from computer'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(index, file)
                        }}
                        disabled={uploadingIndex === index}
                      />
                    </label>
                  </div>
                </div>
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
