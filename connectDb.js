const mongoose = require('mongoose')

const DB_URI = process.env.SCALINGO_MONGO_URL || 'mongodb://localhost:27017/scrumbag-db'
mongoose.connect(DB_URI).then(()=>{
    console.log("******** CONNECTED TO DATABASE ********");   
    console.log("********     UP DOWN STREET    ********");
    console.log(process.env.JWT_SECRET)
    /* LE LOG DU PROCESS ENV JWT SECRET WILL BE REMOVED. DEV ONLY FEATURE. BIG SECURITY ISSUE */
})