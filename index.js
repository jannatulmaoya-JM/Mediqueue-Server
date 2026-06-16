// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// dotenv.config();

// const uri = process.env.DB_URI;
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());


// function verifyToken(req, res, next) {
//   next();
// }

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     const db = client.db("medi-queue-tutor");
//     const tutorCollection = db.collection("tutors");
//     const bookingCollection = db.collection("bookings");

//     app.get("/tutors", async (req, res) => {
//       try {
//         const { search, startDate, endDate, limit } = req.query;
//         let query = {};

//         if (search) {
//           query.name = { $regex: search, $options: "i" };
//         }

//         if (startDate || endDate) {
//           query.sessionStartDate = {};
//           if (startDate) query.sessionStartDate.$gte = startDate;
//           if (endDate) query.sessionStartDate.$lte = endDate;
//         }

//         let cursor = tutorCollection.find(query);
        
//         if (limit) {
//           cursor = cursor.limit(parseInt(limit));
//         }

//         const result = await cursor.toArray();
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.get("/featured-tutors", async (req, res) => {
//       try {
//         const result = await tutorCollection.find().limit(4).toArray();
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.post("/tutors", async (req, res) => {
//       try {
//         const tutorData = req.body;
//         const result = await tutorCollection.insertOne(tutorData);
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.get("/tutors/:id", verifyToken, async (req, res) => {
//       try {
//         const { id } = req.params;
        
//         if (!ObjectId.isValid(id)) {
//           return res.status(400).json({ error: "Invalid ID format" });
//         }

//         const result = await tutorCollection.findOne({ _id: new ObjectId(id) });
//         if (!result) {
//           return res.status(404).json({ error: "Tutor not found" });
//         }
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.patch("/tutors/:id", async (req, res) => {
//       try {
//         const { id } = req.params;
//         const updatedData = req.body;
//         const result = await tutorCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedData }
//         );
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.delete("/tutors/:id", async (req, res) => {
//       try {
//         const { id } = req.params;
//         const result = await tutorCollection.deleteOne({ _id: new ObjectId(id) });
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });


//     app.get("/bookings/:userId", async (req, res) => {
//       try {
//         const { userId } = req.params;

//         const result = await bookingCollection.find({
//           $or: [
//             { userId: userId },
//             { studentEmail: userId }
//           ]
//         }).toArray();
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

  
//     app.post("/bookings", verifyToken, async (req, res) => {
//       try {
//         const bookingData = req.body;
//         const { tutorId } = bookingData;

//         const result = await bookingCollection.insertOne(bookingData);

//         if (tutorId && ObjectId.isValid(tutorId)) {
//           await tutorCollection.updateOne(
//             { _id: new ObjectId(tutorId) },
//             { $inc: { totalSlot: -1 } }
//           );
//         }

//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     app.delete("/bookings/:bookingId", verifyToken, async (req, res) => {
//       try {
//         const { bookingId } = req.params;
//         const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });
//         res.json(result);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });

//     console.log("Connected successfully to MongoDB!");
//   } catch (error) {
//     console.error("Database connection fail:", error);
//   }
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//   res.send('Mediqueue Backend Server is running successfully!');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// // const crypto = require("crypto");

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(cors({ origin: ["http://localhost:3000",] }));
// // app.use(express.json());

// // const client = new MongoClient(process.env.DB_URI, {
// //   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
// // });

// // async function run() {
// //   await client.connect();
// //   console.log(" MongoDB connected");

// //   const db = client.db("medi-queue-tutor");
// //   const tutors = db.collection("tutors");
// //   const bookings = db.collection("bookings");

  
// //   app.get("/tutors", async (req, res) => {
// //     try {
// //       const { search, startDate, endDate, limit } = req.query;
// //       const query = {};
// //       if (search) query.name = { $regex: search, $options: "i" };
// //       if (startDate || endDate) {
// //         query.sessionStartDate = {};
// //         if (startDate) query.sessionStartDate.$gte = startDate;
// //         if (endDate) query.sessionStartDate.$lte = endDate;
// //       }
// //       let cursor = tutors.find(query);
// //       if (limit) cursor = cursor.limit(parseInt(limit));
// //       res.json(await cursor.toArray());
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

// //   app.get("/tutors/:id", async (req, res) => {
// //     try {
// //       const { id } = req.params;
// //       if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });
// //       const result = await tutors.findOne({ _id: new ObjectId(id) });
// //       if (!result) return res.status(404).json({ error: "Tutor not found" });
// //       res.json(result);
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

// //   app.post("/tutors", async (req, res) => {
// //     try {
// //       const result = await tutors.insertOne(req.body);
// //       res.json({ ...result, message: "Tutor added successfully" });
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

  
// //   app.patch("/tutors/:id", async (req, res) => {
// //     try {
// //       const result = await tutors.updateOne(
// //         { _id: new ObjectId(req.params.id) },
// //         { $set: req.body }
// //       );
// //       res.json(result);
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

  
// //   app.delete("/tutors/:id", async (req, res) => {
// //     try {
// //       const result = await tutors.deleteOne({ _id: new ObjectId(req.params.id) });
// //       res.json(result);
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

  
// //   app.get("/bookings/:email", async (req, res) => {
// //     try {
// //       const result = await bookings.find({ studentEmail: req.params.email }).toArray();
// //       res.json(result);
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

// //   app.post("/bookings", async (req, res) => {
// //     try {
// //       const { tutorId, tutorName, studentName, studentEmail, phone } = req.body;

// //       // Check tutor slot
// //       const tutor = await tutors.findOne({ _id: new ObjectId(tutorId) });
// //       if (!tutor) return res.status(404).json({ message: "Tutor not found" });
// //       if (tutor.totalSlot <= 0) return res.status(400).json({ message: "This session is fully booked. You can't join at the moment." });

// //       const today = new Date(); today.setHours(0, 0, 0, 0);
// //       const sessionDate = new Date(tutor.sessionStartDate); sessionDate.setHours(0, 0, 0, 0);
// //       if (today < sessionDate) return res.status(400).json({ message: `Booking is not available yet for this tutor` });

// //       const sessionToken = "MQ-" + crypto.randomBytes(4).toString("hex").toUpperCase();
// //       const booking = {
// //         tutorId, tutorName, studentName, studentEmail, phone,
// //         sessionToken, status: "confirmed", createdAt: new Date().toISOString(),
// //       };

// //       const result = await bookings.insertOne(booking);
// //       await tutors.updateOne({ _id: new ObjectId(tutorId) }, { $inc: { totalSlot: -1 } });

// //       res.json({ ...result, sessionToken, message: "Booking confirmed!" });
// //     } catch (e) { res.status(500).json({ error: e.message }); }
// //   });

  
// //   app.patch("/bookings/:id", async (req, res) => {
// //     try {
// //       const result = await bookings.updateOne(
// //         { _id: new ObjectId(req.params.id) },
// //         { $set: req.body }
// //       );
// //       res.json(result);
// //     } catch (e) { 
// //       res.status(500).json({ error: e.message });
// //      }
// //   });

// //   app.get("/", (_, res) =>
// //      res.send("MediQueue Server is running!"));
// // }

// // run().catch(console.dir);
// // app.listen(PORT, () =>
// //    console.log(` Server on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const uri = process.env.DB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

// CORS কনফিগারেশন আপডেট করা হয়েছে যাতে ফ্রন্টএন্ডের সাথে কোনো ঝামেলা না হয়
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

    // ১. নির্দিষ্ট ইউজারের তৈরি করা টিউটরদের ডাটা গেট করার রাউট (FIXED FOR 400 ERROR)
    app.get("/tutors/my-tutors", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).json({ error: "Email query parameter is required" });
        }
        
        // ফ্রন্টএন্ড 'createdBy' ফিল্ডে ইমেইল সেভ করে, তাই createdBy দিয়ে খোঁজা হচ্ছে
        const query = { createdBy: email };
        const result = await tutorCollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ২. সব টিউটর খোঁজা ও ফিল্টার করার রাউট
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

    // ৩. ফিচারড টিউটর রাউট
    app.get("/featured-tutors", async (req, res) => {
      try {
        const result = await tutorCollection.find().limit(4).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ৪. নতুন টিউটর অ্যাড করার রাউট
    app.post("/tutors", async (req, res) => {
      try {
        const tutorData = req.body;
        const result = await tutorCollection.insertOne(tutorData);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ৫. আইডি দিয়ে নির্দিষ্ট একটি টিউটরের ডাটা দেখা
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

    // ৬. টিউটর আপডেট করার রাউট (PUT এবং PATCH দুটাই হ্যান্ডেল করবে যাতে ফ্রন্টএন্ডে এরর না আসে)
    const handleUpdateTutor = async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;
        
        // আইডি সিকিউরিটি চেক
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        // মঙ্গোডিবি আইডি আপডেট করা যায় না, তাই বডি থেকে _id প্রোপার্টি থাকলে তা রিমুভ করে দেওয়া ভালো
        delete updatedData._id;

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
    app.put("/tutors/:id", handleUpdateTutor); // FIXED: ফ্রন্টএন্ডের axios.put সাপোর্ট করার জন্য

    // ৭. টিউটর ডিলিট করার রাউট
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

    // ৮. বুকিং দেখার রাউট
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

    // ৯. নতুন বুকিং করার রাউট এবং স্লট কমানো
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

    // ১০. বুকিং ডিলিট করার রাউট
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
  res.send('Mediqueue Backend Server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});