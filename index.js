const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const uri = process.env.DB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());


function verifyToken(req, res, next) {
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
    const db = client.db("medi-queue-tutor");
    const tutorCollection = db.collection("tutors");
    const bookingCollection = db.collection("bookings");

    app.get("/tutors/my-tutors", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).json({ error: "Email query parameter is required" });
        }
        
        const query = { createdBy: email };
        const result = await tutorCollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/tutors", async (req, res) => {
      try {
        const { search, startDate, endDate, limit } = req.query;
        let query = {};

        if (search) {
          query.name = { $regex: search, $options: "i" };
        }

        if (startDate || endDate) {
          query.sessionStartDate = {};
          if (startDate) query.sessionStartDate.$gte = startDate;
          if (endDate) query.sessionStartDate.$lte = endDate;
        }

        let cursor = tutorCollection.find(query);
        
        if (limit) {
          cursor = cursor.limit(parseInt(limit));
        }

        const result = await cursor.toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/featured-tutors", async (req, res) => {
      try {
        const result = await tutorCollection.find().limit(4).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/tutors", async (req, res) => {
      try {
        const tutorData = req.body;
        const result = await tutorCollection.insertOne(tutorData);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/tutors/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await tutorCollection.findOne({ _id: new ObjectId(id) });
        if (!result) {
          return res.status(404).json({ error: "Tutor not found" });
        }
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const handleUpdateTutor = async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await tutorCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    app.patch("/tutors/:id", handleUpdateTutor);
    app.put("/tutors/:id", handleUpdateTutor); 

 
    app.delete("/tutors/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }
        const result = await tutorCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/bookings/:userId", async (req, res) => {
      try {
        const { userId } = req.params;

        const result = await bookingCollection.find({
          $or: [
            { userId: userId },
            { studentEmail: userId }
          ]
        }).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        const bookingData = req.body;
        const { tutorId } = bookingData;

        const result = await bookingCollection.insertOne(bookingData);

        if (tutorId && ObjectId.isValid(tutorId)) {
          await tutorCollection.updateOne(
            { _id: new ObjectId(tutorId) },
            { $inc: { totalSlot: -1 } }
          );
        }

        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.delete("/bookings/:bookingId", verifyToken, async (req, res) => {
      try {
        const { bookingId } = req.params;
        if (!ObjectId.isValid(bookingId)) {
          return res.status(400).json({ error: "Invalid Booking ID" });
        }
        const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    console.log("Connected successfully to MongoDB!");
  } catch (error) {
    console.error("Database connection fail:", error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Mediqueue Server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});