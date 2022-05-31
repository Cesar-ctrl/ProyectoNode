const mongoose = require('mongoose');

//const connectionString = process.env.MONGO_DB_URI
const connectionString = 'mongodb+srv://amadocesar:zrO7cU3A8txfjUVW@cluster0.tpmtr.mongodb.net/midb?retryWrites=true&w=majority'
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