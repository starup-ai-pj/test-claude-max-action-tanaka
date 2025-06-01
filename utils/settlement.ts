import { Person, Expense, Settlement, ExchangeRate } from '@/types/expense';

export function calculateSettlements(
  people: Person[],
  expenses: Expense[],
  exchangeRates: ExchangeRate,
  baseCurrency: string = 'JPY'
): Settlement[] {
  // Calculate balances for each person
  const balances: { [personId: string]: number } = {};

  // Initialize balances
  people.forEach(person => {
    balances[person.id] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    // Convert to base currency if needed
    const rate = expense.currency === baseCurrency ? 1 : (exchangeRates[expense.currency] || 1);
    const amountInBaseCurrency = expense.amount * rate;

    // Calculate per person share
    const sharePerPerson = amountInBaseCurrency / expense.participantIds.length;

    // Payer paid the full amount
    balances[expense.payerId] += amountInBaseCurrency;

    // Each participant owes their share
    expense.participantIds.forEach(participantId => {
      balances[participantId] -= sharePerPerson;
    });
  });

  // Calculate settlements
  const settlements: Settlement[] = [];
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  // Separate creditors and debtors
  Object.entries(balances).forEach(([personId, balance]) => {
    // Round to 2 decimal places to avoid floating point issues
    const roundedBalance = Math.round(balance * 100) / 100;
    
    if (roundedBalance > 0.01) {
      creditors.push({ id: personId, amount: roundedBalance });
    } else if (roundedBalance < -0.01) {
      debtors.push({ id: personId, amount: -roundedBalance });
    }
  });

  // Sort for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Match debtors with creditors
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: Math.round(settlementAmount * 100) / 100
      });
    }

    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
}