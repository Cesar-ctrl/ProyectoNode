const mongoose = require('mongoose');

const connectionString = process.env.MONGO_DB_URI   

// consexion con mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFinAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })

