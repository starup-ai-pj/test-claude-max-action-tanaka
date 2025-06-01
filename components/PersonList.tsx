'use client';

import { Person } from '@/types/expense';
import { useState } from 'react';

interface PersonListProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
}

export default function PersonList({ people, onAddPerson, onRemovePerson }: PersonListProps) {
  const [newPersonName, setNewPersonName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">参加者</h2>
      
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          placeholder="参加者の名前"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </form>

      <ul className="space-y-2">
        {people.map((person) => (
          <li key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="font-medium">{person.name}</span>
            <button
              onClick={() => onRemovePerson(person.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {people.length === 0 && (
        <p className="text-gray-500 text-center py-4">まだ参加者が登録されていません</p>
      )}
    </div>
  );
}