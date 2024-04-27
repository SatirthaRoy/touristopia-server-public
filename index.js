const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;
const pass = process.env.USER_PASS;
const name = process.env.USER_NAME;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${name}:${pass}@mydatabase.ofrvnz1.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("Tourists_database");
    const spots = database.collection("spots");
    const countries = database.collection('countries');

    // gets tour spots data
    app.get('/spots', async(req, res) => {
      const cursor = spots.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get specific spot by id

    app.get('/spots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spots.findOne(query);
      res.send(result);
    })

    // adds tour spots
    app.post('/spots', async(req, res) => {
      const spot_data = req.body;
      const result = await spots.insertOne(spot_data);
      res.send(result);
    })

    // gets countries data
    app.get('/countries', async(req, res) => {
      const cursor = countries.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get spots by countries
    app.get('/country/:countryName', async(req, res) => {
      const country = req.params.countryName;
      const query = {country: country}
      console.log(query);
      const cursor = spots.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log('running on port: ', port);
})