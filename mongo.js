const mongoose = require('mongoose')
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.m0txxg3.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(() => {
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(person)
                })
                mongoose.connection.close()
            })
        })
}

if(process.argv.length === 5) {
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            return person.save()
        })
        .then(() => {
            console.log('person saved')
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}