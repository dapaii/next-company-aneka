import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ROOT_ADMIN_EMAIL!;
  const password = process.env.ROOT_ADMIN_PASSWORD!;
  if (!email || !password) {
    throw new Error('ROOT_ADMIN_EMAIL/ROOT_ADMIN_PASSWORD missing in env');
  }
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: 'admin' },
    create: { email, passwordHash: hash, role: 'admin', name: 'Admin' },
  });

  console.log(`✅ Admin ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
