const bcrypt = require('bcrypt')
const User = require('../models/User')
const moongose = require('mongoose')
const { server } = require('../index')

describe('creating a new user', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('pswd', 10)
      const user = new User({
            name: 'Name',
            surnames: 'surnames',
            DNI: 'dni',
            phone: 123456789,
            email: 'email',
            passwordHash
        })
  
        await user.save()
    })

    test('works as expected creating a fresh username', async () => {
        const usersAtStart = await getUsers()
    
        const newUser = {
            name: 'Name',
            surnames: 'surnames',
            DNI: 'dni',
            phone: 123456789,
            email: 'email',
            password: 'tw1tch'
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await getUsers()
    
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
      })

      test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await getUsers()
    
        const newUser = {
            name: 'Name',
            surnames: 'surnames',
            DNI: 'dni',
            phone: 123456789,
            email: 'email',
            password: '12345678'
          
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(409)
          .expect('Content-Type', /application\/json/)
    
        console.log(result.body)
    
        expect(result.body.error).toContain('expected `username` to be unique')
    
        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
      afterAll(() => {
        moongose.connection.close()
        server.close()
      })
    
})