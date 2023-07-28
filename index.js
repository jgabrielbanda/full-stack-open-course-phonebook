require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function getBody (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('build'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let personsCollection = [
//   {
//     "name": "Arto Hellas",
//     "phoneNumber": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "phoneNumber": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "phoneNumber": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Mary Poppendieck",
//     "phoneNumber": "39-23-6423122",
//     "id": 4
//   },
//   {
//     "name": "Luis Gabriel",
//     "phoneNumber": "39-23-6423122",
//     "id": 5
//   },
//   {
//     "name": "Rodrigo Banda",
//     "phoneNumber": "39-23-6423123",
//     "id": 6
//   }
// ]


app.get('/info', (request, response, next) => {

  Person
    .find({})
    .count()
    .then(documents => {
      console.log(documents)
      response.send(`
        Phonebook has info for ${documents} people
        <br/>
        ${new Date()}
      `)
    } )

})

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then((person)=>{
      if (person) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error));
})


// const generateId = () => {
//   const maxId = Math.floor(Math.random() * 1000)
//   return maxId + 1
// }

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phoneNumber: body.phoneNumber,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
    .then(personUpdate => {
      response.json(personUpdate)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const personBody = request.body

  // if (!personBody.name) {
  //   return response.status(400).json({
  //     error: 'name missing'
  //   })
  // }

  // if (!personBody.phoneNumber) {
  //   return response.status(400).json({
  //     error: 'phoneNumber missing'
  //   })
  // }

  const person = new Person({
    name: personBody.name,
    phoneNumber: personBody.phoneNumber,
  })

  person
    .save()
    .then(personSaved => {
      response.json(personSaved)
    })
    .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {

  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})