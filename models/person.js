const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(result => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error(`Could not connect to database`, error.message)
  })

  const personSchema = mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    phoneNumber: {
      type: String,
      minLength: 8,
      maxLength: 12,
      validate: /^\d{2,3}-\d{5,}$/
    },
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)