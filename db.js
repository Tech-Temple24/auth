const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL )
    .then(() => {
    console.log("connect to MongoDB");
    })
    .catch((err) => {
    console.log("error connecting to MongoDB",err);
})