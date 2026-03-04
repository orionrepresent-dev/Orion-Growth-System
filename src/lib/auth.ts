import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'
import { User, SafeUser } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'orion-growth-studio-secret-key-2024'
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// Read users from JSON file
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write users to JSON file
export async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: SafeUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers()
  return users.find(u => u.id === id) || null
}

// Create user
export async function createUser(data: {
  email: string
  password: string
  name: string
  company?: string
  plan?: 'presenca' | 'autoridade' | 'dominacao'
}): Promise<User> {
  const users = await getUsers()
  
  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Email já cadastrado')
  }
  
  const hashedPassword = await hashPassword(data.password)
  
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name,
    company: data.company,
    plan: data.plan || 'presenca',
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  await saveUsers(users)
  
  return newUser
}

// Remove password from user object
export function toSafeUser(user: User): SafeUser {
  const { password: _, ...safeUser } = user
  return safeUser
}
