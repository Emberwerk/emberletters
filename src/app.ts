import Fastify from 'fastify'
import formBody from '@fastify/formbody'

interface AuthBody {
    password: string;
    locker: number
}

import passwords from './passwords.json' assert { type: 'json' }

const fastify = Fastify({
    logger: true
})

fastify.register(formBody)

fastify.get('/', async function handler(request, reply) {
    return { status: 'ok' }
})

fastify.post<{ Body: AuthBody }>('/api/auth', async function handler(request, reply) {
    const { locker: lockerId, password } = request.body
    
    if(!lockerId || !password)
        return reply.code(400).send({ status: 'ko', message: 'Invalid Fields in body'})
    
    console.log("ID:", lockerId)
    console.log('password:', password)
    
    console.log(passwords[1])

    const lockers = passwords.filter((locker) => locker.id == lockerId && locker.password == password)
    console.log(lockers)
    if(lockers.length === 0) {
        return reply.code(401).send({ status: 'ko', message: 'Invalid Information'})
    }
    const locker = lockers[0]
    return { status: 'ok', path: locker.path }
})

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}