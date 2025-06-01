import { Expense, Participant, Currency } from '../types'

interface Props {
  expenses: Expense[]
  participants: Participant[]
  currencies: Currency[]
  baseCurrency: string
  onDelete: (id: string) => void
}

export default function ExpenseList({ expenses, participants, currencies, baseCurrency, onDelete }: Props) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code
  }

  const convertToBaseCurrency = (amount: number, fromCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const baseRate = currencies.find(c => c.code === baseCurrency)?.rate || 1
    return (amount * fromRate) / baseRate
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          支払い記録がありません
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">内容</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">金額</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">支払者</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">割り勘対象</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">一人当たり</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => {
                const perPerson = expense.amount / expense.splitBetween.length
                const convertedAmount = convertToBaseCurrency(expense.amount, expense.currency)
                const convertedPerPerson = convertToBaseCurrency(perPerson, expense.currency)
                
                return (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3">
                      {getCurrencySymbol(expense.currency)}{expense.amount.toFixed(2)}
                      {expense.currency !== baseCurrency && (
                        <div className="text-xs text-gray-500">
                          ≈ {getCurrencySymbol(baseCurrency)}{convertedAmount.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getParticipantName(expense.payerId)}</td>
                    <td className="px-4 py-3 text-sm">
                      {expense.splitBetween.map(id => getParticipantName(id)).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      {getCurrencySymbol(expense.currency)}{perPerson.toFixed(2)}
                      {expense.currency !== baseCurrency && (
                        <div className="text-xs text-gray-500">
                          ≈ {getCurrencySymbol(baseCurrency)}{convertedPerPerson.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}