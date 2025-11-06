const mongoose = require('mongoose');

function connecttoDb(){
    mongoose.connect(process.env.DB_CONNECT).then(()=>{ console.log('Connect to DB'); }).catch(err => console.log(err))
}

module.exports = connecttoDb;