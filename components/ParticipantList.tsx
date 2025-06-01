'use client'

import { useState } from 'react'
import { Participant } from '@/types'

interface ParticipantListProps {
  participants: Participant[]
  onAddParticipant: (name: string) => void
  onRemoveParticipant: (id: string) => void
}

export default function ParticipantList({
  participants,
  onAddParticipant,
  onRemoveParticipant,
}: ParticipantListProps) {
  const [newName, setNewName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      onAddParticipant(newName.trim())
      setNewName('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">参加者</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="参加者名を入力"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            追加
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {participants.map((participant) => (
          <li
            key={participant.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
          >
            <span>{participant.name}</span>
            <button
              onClick={() => onRemoveParticipant(participant.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {participants.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          参加者を追加してください
        </p>
      )}
    </div>
  )
}