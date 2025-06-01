'use client';

import { Person } from '@/types/expense';
import { useState } from 'react';

interface ExpenseFormProps {
  people: Person[];
  onAddExpense: (expense: {
    payerId: string;
    amount: number;
    currency: string;
    description: string;
    participantIds: string[];
  }) => void;
  currencies: string[];
}

export default function ExpenseForm({ people, onAddExpense, currencies }: ExpenseFormProps) {
  const [payerId, setPayerId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('JPY');
  const [description, setDescription] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (!payerId || !numAmount || numAmount <= 0 || participantIds.length === 0) {
      alert('すべての項目を正しく入力してください');
      return;
    }

    onAddExpense({
      payerId,
      amount: numAmount,
      currency,
      description,
      participantIds,
    });

    // Reset form
    setPayerId('');
    setAmount('');
    setCurrency('JPY');
    setDescription('');
    setParticipantIds([]);
  };

  const toggleParticipant = (personId: string) => {
    setParticipantIds(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const selectAllParticipants = () => {
    setParticipantIds(people.map(p => p.id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">支払い追加</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            支払者
          </label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            金額
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0.01"
              step="0.01"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 夕食代"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              割り勘対象者
            </label>
            <button
              type="button"
              onClick={selectAllParticipants}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              全員選択
            </button>
          </div>
          <div className="space-y-2">
            {people.map((person) => (
              <label key={person.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={participantIds.includes(person.id)}
                  onChange={() => toggleParticipant(person.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{person.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          支払いを追加
        </button>
      </form>
    </div>
  );
}