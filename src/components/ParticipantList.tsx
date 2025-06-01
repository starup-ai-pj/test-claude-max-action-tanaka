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
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newName.trim()) {
      setError('名前を入力してください')
      return
    }

    if (participants.some(p => p.name === newName.trim())) {
      setError('同じ名前の参加者が既に存在します')
      return
    }

    onAddParticipant(newName.trim())
    setNewName('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="参加者名"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            追加
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </form>

      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            参加者がまだいません
          </p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span className="font-medium">{participant.name}</span>
              <button
                onClick={() => onRemoveParticipant(participant.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}