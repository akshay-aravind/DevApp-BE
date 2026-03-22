const express = require('express')
const userRouter = express.Router()
const User = require("../models/user");
const Requests = require("../models/connectionRequest");
const { userValidation, userAuth } = require("../middlewares/auth");


userRouter.get("/user", userAuth, async (req, res) => {
  try {
    const userMailID = req.body.mailID;
    const user = await User.findOne({ mailID: userMailID });

    if (!user?.length) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error fetching user");
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const userMailID = req.user._id;

    if (!userMailID) {
      res.status(404).send("User not found");
    }
    const requests = await Requests.find({ toUserId: userMailID, status: "interested" }).populate("fromUserId", "firstName lastName mailID");

    res.status(200).send(requests);
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error fetching user");
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      res.status(404).send("User not found");
    }
    const requests = await Requests.find({
      $or: [{ toUserId: userID }, { fromUserId: userID }],
      status: "accepted",
    }).populate("fromUserId", "firstName lastName mailID").populate("toUserId", "firstName lastName mailID");
    const connections = requests.map((req) => req.fromUserId._id.equals(userID) ? req.toUserId :req.fromUserId)
    res.status(200).send(connections);
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error fetching user");
  }
});


userRouter.get('/user/feed' , userAuth, async (req,res) => {
  try {
     const userID = req.user._id;
     const limit = req.query.limit > 10 ? 10 : req.query.limit
     const page = req.query.page
     const skip = (page -1) * limit
     const connectionRequsts = await Requests.find({
         $or: [{ toUserId: userID }, { fromUserId: userID }],
     }).select("fromUserId toUserId")
     const connectionsreq = new Set()
     connectionRequsts.forEach((requests) => 
      {
        connectionsreq.add(requests.fromUserId.toString())
        connectionsreq.add(requests.toUserId.toString())
      }
    )
    const users =  await User.find({
      _id : { $nin : Array.from(connectionsreq) }
    }).skip(skip).limit(limit)

    console.log(connectionRequsts,'testing123',users)
    res.status(200).json(users)
  } catch (err) {
     res.status(400).send(err)
  }
})

userRouter.put("/updateuser/:userID", userValidation, async (req, res) => {
  try {
    const ID = req.params?.userID;
    const data = req.body;
    console.log(req.body);
    const user = await User.findByIdAndUpdate(
      ID,
      { ...data },
      { returnDocument: "after", runValidators: true },
    );
    console.log(user, "test");
    if (user) {
      res.status(200).send(user);
    } else {
      throw new Error("Update failed");
    }
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error fetching user " + err.message);
  }
});

userRouter.delete("/deleteuser", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete("698738ce60a57d8747c23516");
    res.status(200).send("User removed");
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error deleting user");
  }
});

module.exports = userRouter