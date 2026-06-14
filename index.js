const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
//const {createRemoteJWKSet,jwtVerify } = require("jose.cjs");
dotenv.config();


const uri = process.env.DB_URI;

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyToken(req,res,next){
  next();
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("medi-queue-tutor");
    const tutorCollection = db.collection("tutors");
    const bookingCollection = db.collection("bookings");

    app.get("/featured", async (req, res) => {
      const result = await destinationCollection.find().limit(4).toArray()
      res.json(result)
    })

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    });

    app.get("/destination/:id", verifyToken, async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      console.log(updatedData);

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.json(result);
    });

    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.get("/booking/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingCollection.find({ userId: userId }).toArray();

      res.json(result);
    });

    app.post("/booking", verifyToken, async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });

    app.delete("/booking/:bookingId", verifyToken, async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(bookingId),
      });

      res.json(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Mediqueue is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} PORT`);
});