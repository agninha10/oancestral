import { prisma } from '../lib/prisma'

async function main() {
    try {
        await prisma.$connect()
        console.log('✅ Database connection successful!')

        // Test query
        const userCount = await prisma.user.count()
        console.log(`📊 Current user count: ${userCount}`)

        await prisma.$disconnect()
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        process.exit(1)
    }
}

main()
