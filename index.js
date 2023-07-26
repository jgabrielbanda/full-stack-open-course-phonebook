const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function getBody (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let personsCollection = [
  {
    "name": "Arto Hellas",
    "phoneNumber": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "phoneNumber": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "phoneNumber": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "phoneNumber": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Luis Gabriel",
    "phoneNumber": "39-23-6423122",
    "id": 5
  },
  {
    "name": "Rodrigo Banda",
    "phoneNumber": "39-23-6423123",
    "id": 6
  }
]


app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${personsCollection.length} people <br/>
    ${new Date()}
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(personsCollection)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = personsCollection.find(personItem => personItem.id === id)

  if (!person) {
    return response.status(404).json({
      error: 'Not found'
    })
  }

  response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  personsCollection = personsCollection.filter(personItem => personItem.id !== id)

  response.status(204).end()
})


const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000)
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const personBody = request.body

  if (!personBody.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!personBody.phoneNumber) {
    return response.status(400).json({
      error: 'phoneNumber missing'
    })
  }

  const personExists = personsCollection.find(personItem => personItem.name === personBody.name)
  if (personExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const personObject = {
    name: personBody.name,
    phoneNumber: personBody.phoneNumber,
    id: generateId()
  }

  personsCollection = personsCollection.concat(personObject)

  response.json(personObject)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})