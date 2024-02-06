const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId}  = require('mongodb')
const {connectToDb,getDb} = require('./dbconnection.cjs')
const { default: path } = require('path')
const { default: e } = require('express')
const app = express('path')
app.use(bodyParser.json())

connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else { 
        const port =process.env.PORT || 8000    
        db = getDb()
        console.log('Listening on port 8000...')
    }
})



app.post('/add-entry', function(request,response) {
    db.collection('trackexpdata').insertOne(request.body).then(function() {
        response.status(201).json({ 
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})
app.get('/get-entries', function(request, response) {
    const entries =[]
    db.collection('trackexpdata')
    .find()
    .forEach(entry =>  entries.push(entry))
    .then(function(){
        response.status(200).json(entries)

    }).catch (function(){
        response.status(500).json({
            "status":"could not fetch document"
        })
    })
        
    })
    app.delete('/delete-entry', function(request, response) {
        console.log(request.query)
            db.collection('trackexpData').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    })

    app.patch('/update-entry/:id', function(request, response) {
        if(ObjectId.isValid(request.params.id)) {
            db.collection('trackexpdata').updateOne(
                { _id : new ObjectId(request.params.id) }, 
                { $set : request.body } 
            ).then(function() {
                response.status(200).json({
                    "status" : "Entry updated successfully"
                })
            }).catch(function() {
                response.status(500).json({
                    "status" : "Unsuccessful on updating the entry"
                })
            })
        } else {
            response.status(500).json({
                "status" : "ObjectId not valid"
            })
        }
    })
