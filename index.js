const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wytdrq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristCollection = client.db('tourDB').collection('add');

 
    app.get('/add', async(req, res) =>{
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/add/sort', async(req,res) =>{
      const sortedTourists = await touristCollection.find().sort({average: 1}).toArray();
      res.json(sortedTourists);
    })


    app.get('/myList/:email', async(req, res) =>{
      console.log(req.params.email)
      const result = await touristCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })


    app.post('/add', async(req,res)=>{
      const addTourist = req.body;
      console.log(addTourist)
      const result = await touristCollection.insertOne(addTourist);
      res.send(result);
    })

    app.delete('/add/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    })
  


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () =>{
    console.log(`server is running at port: ${port}`)
})