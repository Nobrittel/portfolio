import { createInterface } from 'node:readline/promises'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

const rl = createInterface({ input: process.stdin, output: process.stdout })

async function main() {
  const name = (await rl.question('Nom : ')).trim()
  const email = (await rl.question('Email : ')).trim().toLowerCase()
  const password = await rl.question('Mot de passe (12 caractères minimum) : ')

  if (!name || !email.includes('@')) {
    throw new Error('Nom ou email invalide.')
  }
  if (password.length < 12) {
    throw new Error('Le mot de passe doit contenir au moins 12 caractères.')
  }

  const hash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: { name, password: hash },
    create: { name, email, password: hash, role: 'admin' },
  })

  console.log('Administrateur enregistré : ' + email)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })