const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3001",
    // "https://mediquue-client.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL || "http://localhost:3001"}/api/auth/jwks`),
  { ignoreErrors: true }
);

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    next(); 
  }
};

async function run() {
  try {
    const db = client.db("medi-queue-tutor");
    const tutorCollection = db.collection("tutors");
    const bookingCollection = db.collection("bookings");

    app.get("/featured-tutors", async (req, res) => {
      const result = await tutorCollection.find().limit(6).toArray();
      res.json(result);
    });

    app.get("/tutors", async (req, res) => {
      const { search, startDate, endDate } = req.query;
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } }
        ];
      }

      if (startDate && endDate) {
        query.sessionStartDate = {
          $gte: startDate,
          $lte: endDate
        };
      }

      const result = await tutorCollection.find(query).toArray();
      res.json(result);
    });

    app.get("/tutors/my-tutors", verifyToken, async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
      }
      const result = await tutorCollection.find({ createdBy: email }).toArray();
      res.json(result);
    });

    app.get("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Tutor ID Format" });
      }
      
      const result = await tutorCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    app.post("/tutors", verifyToken, async (req, res) => {
      const tutorData = req.body;
      const result = await tutorCollection.insertOne(tutorData);
      res.json(result);
    });

    app.put("/tutors/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Tutor ID Format" });
        }

        const result = await tutorCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update tutor" });
      }
    });

    app.delete("/tutors/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Tutor ID Format" });
        }

        const result = await tutorCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete tutor" });
      }
    });

    app.get("/bookings", verifyToken, async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
      }
      const result = await bookingCollection.find({ studentEmail: email }).toArray();
      res.json(result);
    });

    app.post("/bookings", verifyToken, async (req, res) => {
      const bookingData = req.body;
      
      if (!ObjectId.isValid(bookingData.tutorId)) {
        return res.status(400).json({ message: "Invalid Tutor ID Format in booking" });
      }

      const tutor = await tutorCollection.findOne({ _id: new ObjectId(bookingData.tutorId) });
      if (!tutor || tutor.totalSlot <= 0) {
        return res.status(400).json({ message: "This session is fully booked. You can't join at the moment." });
      }

      const bookingResult = await bookingCollection.insertOne(bookingData);

      await tutorCollection.updateOne(
        { _id: new ObjectId(bookingData.tutorId) },
        { $inc: { totalSlot: -1 } }
      );

      res.json(bookingResult);
    });

    app.patch("/bookings/:bookingId", verifyToken, async (req, res) => {
      const { bookingId } = req.params;
      if (!ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: "Invalid Booking ID Format" });
      }
      const result = await bookingCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status: "cancelled" } }
      );
      res.json(result);
    });

    console.log("Connected successfully to MongoDB for MediQueue!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MediQueue Server is running fine!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});