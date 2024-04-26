const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://satirtharoy2003:himu2003@mydatabase.ofrvnz1.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase";

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

    app.get('/spots', async(req, res) => {
      const cursor = spots.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/spots', async(req, res) => {
      const spot_data = req.body;
      const result = await spots.insertOne(spot_data);
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