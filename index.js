const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http")

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connect
// connectDB();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// all issues
async function run() {
  try {
    await client.connect();
    const db = client.db("PH-A10");
    const allIssues = db.collection("allIssues");
    const contribution = db.collection("contribution");

    // ------------------------------------------------------

    // get
    app.get("/allIssues", async (req, res) => {
      try {
        const result = await allIssues.find().toArray();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch data" });
      }
    });
    // get - latest 6 data
    app.get("/latestissues", async (req, res) => {
      try {
        const result = await allIssues
          .find()
          .sort({ _id: 1 })
          .limit(6)
          .toArray();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch data" });
      }
    });
    // get-contribution api
    app.get("/contribution", async (req, res) => {
      try {
        const result = await contribution.find().toArray();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch data" });
      }
    });

    // ---------------------------------------------------------
    // post
    app.post("/allIssues", async (req, res) => {
      try {
        const data = await req.body;
        const result = await allIssues.insertOne(data);
        res.send(result);
        console.log("data", data);
      } catch (error) {
        console.log("error", error);
      }
    });
    // post contribution data
    app.post("/contribution", async (req, res) => {
      try {
        const data = req.body;
        const result = await contribution.insertOne(data);
        res.send(result);
        console.log("data", data);
      } catch (error) {
        console.log("error", error);
      }
    });

    // ------------------------------------------------------

    // patch - update
    app.patch("/allIssues/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateData = req.body;

        const query = { _id: new ObjectId(id) };
        const update = { $set: updateData };

        const result = await allIssues.updateOne(query, update);
        if (result.modifiedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Issue updated successfully" });
        } else {
          res.status(404).json({
            success: false,
            message: "Issue not found or no changes made",
          });
        }
      } catch (error) {
        console.error("error updating issue", error);
        res
          .status(500)
          .json({ success: false, error: "failed to udpate data" });
      }
    });

    // ------------------------------------------------------

    // delete
    app.delete("/allIssues/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };

        const result = await allIssues.deleteOne(query);
        if (result.deletedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Issue deleted successfully" });
        } else {
          res.status(404).json({ success: false, message: "Issue not found" });
        }
      } catch (error) {
        console.error("error updating issue", error);
        res
          .status(500)
          .json({ success: false, error: "failed to udpate data" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("connected db");
  } finally {
  }
}
// ------------------------------------------------------

run().catch(console.dir);
// ---------------

app.get("/", (req, res) => {
  res.send("Hello World! ");
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
export default serverless(app);
