require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

let persons = [
              { 
                "id": 1,
                "name": "Arto Hellas", 
                "number": "040-123456"
              },
              { 
                "id": 2,
                "name": "Ada Lovelace", 
                "number": "39-44-5323523"
              },
              { 
                "id": 3,
                "name": "Dan Abramov", 
                "number": "12-43-234345"
              },
              { 
                "id": 4,
                "name": "Mary Poppendieck", 
                "number": "39-23-6423122"
              }
            ]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people</div>
                <div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  } 
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    const message = !body.name ? 'name is missing' : 'number is missing'
    return response.status(400).json({
      error: message
    })
    }

  if (persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  const person = {
    id: genId(),
    name: request.body.name,
    number: request.body.number 
  }

  persons = persons.concat(person)

  response.json(person)

})

const genId = () => {
  return Math.floor((Math.random() * 100))
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})