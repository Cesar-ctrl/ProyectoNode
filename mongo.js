require('dotenv').config()
const mongoose = require('mongoose');

//const connectionString = 
const connectionString = process.env.MONGO_DB_URI
// consexion con mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })

    process.on('uncaughtException', error => {
        console.error(error)
        mongoose.disconnect()
      })