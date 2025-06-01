'use client';

import { Person, Settlement } from '@/types/expense';

interface SettlementViewProps {
  settlements: Settlement[];
  people: Person[];
  baseCurrency: string;
}

export default function SettlementView({ settlements, people, baseCurrency }: SettlementViewProps) {
  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : '不明';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">精算</h2>
      
      {settlements.length === 0 ? (
        <p className="text-gray-500 text-center py-4">精算の必要はありません</p>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{getPersonName(settlement.fromId)}</span>
                <span className="text-gray-600">→</span>
                <span className="font-medium">{getPersonName(settlement.toId)}</span>
              </div>
              <div className="font-bold text-lg">
                {settlement.amount.toLocaleString()} {baseCurrency}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          ※ 金額は{baseCurrency}に換算されています
        </p>
      </div>
    </div>
  );
}