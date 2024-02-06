const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack) {
    MongoClient.connect('mongodb+srv://babishacb21:<1234babi>@cluster0.iiiz0mm.mongodb.net/?retryWrites=true&w=majority/trackexp').then(function(client) {
        dbConnection = client.db()
        callBack()
    }).catch(function(error) {
        callBack(error)
    })
}

function getDb() {p
    return dbConnection
}

module.exports = {connectToDb, getDb}