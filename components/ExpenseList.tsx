'use client';

import { Person, Expense } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onRemoveExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, people, onRemoveExpense }: ExpenseListProps) {
  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : '不明';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">支払い履歴</h2>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">まだ支払いが記録されていません</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-lg">{expense.description}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    支払者: {getPersonName(expense.payerId)}
                  </div>
                  <div className="text-sm text-gray-600">
                    金額: {expense.amount.toLocaleString()} {expense.currency}
                  </div>
                  <div className="text-sm text-gray-600">
                    参加者: {expense.participantIds.map(id => getPersonName(id)).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(expense.date).toLocaleString('ja-JP')}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-4"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}