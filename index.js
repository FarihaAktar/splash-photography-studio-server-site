const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const app = express()
const port = 4000;



app.use(cors());
app.use(express.json());
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssth5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("splashUser").collection("services");
    const bookingsCollection = client.db("splashUser").collection("bookings");
    const reviewCollection = client.db("splashUser").collection("reviews");
    const adminCollection = client.db("splashUser").collection("admin");

   
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('new product added', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    });

    app.get('/book/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, product) => {
                res.send(product)
            })
    })

    app.post('/addBooking', (req, res) => {
        const order = req.body;
        // console.log('new product added', order);
        bookingsCollection.insertOne(order)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
    
      })

      app.get('/bookings', (req, res) => {
        bookingsCollection.find({ email: req.query.email })
          .toArray((err, documents) => {
            console.log(documents)
            res.send(documents)
          })
      })

      app.post('/review', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
    
      })

      app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    });

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
    
      })

      app.get('/orderlist', (req, res) => {
          console.log(req.query.email)
        // adminCollection.find({ email: req.query.email })
        //   .toArray((err, admins) => {
        //     console.log(admins)
        //     if(admins.length === 0){
        //         res.send([])
        //     }
        //     bookingsCollection.find()
        //     .toArray((err, documents)=>{
        //         res.send(documents)
        //     })
        //   })
      })


});




app.listen(process.env.PORT || port)