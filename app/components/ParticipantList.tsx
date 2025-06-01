import { useState } from 'react'
import { Participant } from '../types'

interface Props {
  participants: Participant[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export default function ParticipantList({ participants, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="参加者名"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            追加
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span>{participant.name}</span>
            <button
              onClick={() => onRemove(participant.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          参加者を追加してください
        </p>
      )}
    </div>
  )
}