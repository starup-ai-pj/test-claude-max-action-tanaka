import { Expense, Participant, Currency } from '../types'

interface Props {
  expenses: Expense[]
  participants: Participant[]
  currencies: Currency[]
  baseCurrency: string
}

interface Balance {
  [participantId: string]: number
}

export default function Settlement({ expenses, participants, currencies, baseCurrency }: Props) {
  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code
  }

  const convertToBaseCurrency = (amount: number, fromCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const baseRate = currencies.find(c => c.code === baseCurrency)?.rate || 1
    return (amount * fromRate) / baseRate
  }

  const calculateBalances = (): Balance => {
    const balances: Balance = {}
    
    participants.forEach(p => {
      balances[p.id] = 0
    })

    expenses.forEach(expense => {
      const amountInBase = convertToBaseCurrency(expense.amount, expense.currency)
      const perPerson = amountInBase / expense.splitBetween.length

      balances[expense.payerId] += amountInBase

      expense.splitBetween.forEach(participantId => {
        balances[participantId] -= perPerson
      })
    })

    return balances
  }

  const calculateSettlements = () => {
    const balances = calculateBalances()
    const settlements: Array<{ from: string; to: string; amount: number }> = []

    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0.01)
      .sort((a, b) => b[1] - a[1])

    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < -0.01)
      .sort((a, b) => a[1] - b[1])

    const creditorsArray = [...creditors]
    const debtorsArray = [...debtors]

    while (creditorsArray.length > 0 && debtorsArray.length > 0) {
      const [creditorId, creditAmount] = creditorsArray[0]
      const [debtorId, debtAmount] = debtorsArray[0]

      const settleAmount = Math.min(creditAmount, Math.abs(debtAmount))

      if (settleAmount > 0.01) {
        settlements.push({
          from: debtorId,
          to: creditorId,
          amount: settleAmount
        })
      }

      creditorsArray[0][1] -= settleAmount
      debtorsArray[0][1] += settleAmount

      if (creditorsArray[0][1] < 0.01) {
        creditorsArray.shift()
      }

      if (Math.abs(debtorsArray[0][1]) < 0.01) {
        debtorsArray.shift()
      }
    }

    return settlements
  }

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  const settlements = calculateSettlements()
  const balances = calculateBalances()
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + convertToBaseCurrency(expense.amount, expense.currency),
    0
  )

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">個人別収支</h3>
        <div className="space-y-2">
          {participants.map(participant => {
            const balance = balances[participant.id] || 0
            return (
              <div key={participant.id} className="flex justify-between items-center">
                <span>{participant.name}</span>
                <span className={`font-medium ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {balance > 0 ? '+' : ''}{getCurrencySymbol(baseCurrency)}{balance.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">総支出</span>
            <span className="font-semibold">{getCurrencySymbol(baseCurrency)}{totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">精算方法</h3>
        {settlements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            精算の必要はありません
          </p>
        ) : (
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{getParticipantName(settlement.from)}</span>
                  <span>→</span>
                  <span className="font-medium">{getParticipantName(settlement.to)}</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {getCurrencySymbol(baseCurrency)}{settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}