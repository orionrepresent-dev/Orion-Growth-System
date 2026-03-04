import fs from 'fs'
import path from 'path'
import { Transaction, PaymentStatus } from './payments'

// Caminho do arquivo de transações
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json')

// Garante que o diretório data existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Lê todas as transações
export function getTransactions(): Transaction[] {
  try {
    ensureDataDir()
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      return []
    }
    const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Erro ao ler transações:', error)
    return []
  }
}

// Salva uma nova transação
export function saveTransaction(transaction: Transaction): void {
  try {
    ensureDataDir()
    const transactions = getTransactions()
    transactions.push(transaction)
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    throw error
  }
}

// Busca transação por referência externa
export function getTransactionByExternalRef(externalReference: string): Transaction | undefined {
  const transactions = getTransactions()
  return transactions.find(t => t.externalReference === externalReference)
}

// Busca transação por ID
export function getTransactionById(id: string): Transaction | undefined {
  const transactions = getTransactions()
  return transactions.find(t => t.id === id)
}

// Atualiza status da transação
export function updateTransactionStatus(
  externalReference: string, 
  status: PaymentStatus, 
  mercadoPagoId?: string
): Transaction | undefined {
  try {
    ensureDataDir()
    const transactions = getTransactions()
    const index = transactions.findIndex(t => t.externalReference === externalReference)
    
    if (index === -1) {
      return undefined
    }
    
    transactions[index] = {
      ...transactions[index],
      status,
      updatedAt: new Date().toISOString(),
      ...(mercadoPagoId && { mercadoPagoId })
    }
    
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
    return transactions[index]
  } catch (error) {
    console.error('Erro ao atualizar transação:', error)
    throw error
  }
}

// Gera ID único para transação
export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}
