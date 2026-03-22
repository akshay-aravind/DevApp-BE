const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/connectionrequest/:status/:toUserId", userAuth, async (req, res,) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    console.log(fromUserId, toUserId, status, "keyss" )
    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid status value");
    }
    
    await connectionRequest.save();

    res.status(200).json({
      message: "Connection request sent successfully",
      connectionRequest,
    });
  
  } catch (err) {
    console.log(err, "Error fetching user");
    res.status(400).send("Error fetching user " + err.message);
  }
});

requestRouter.post("/connectionrequest/respond/:requestId/:status", userAuth, async (req, res) => {
  try {    
    const { requestId, status } = req.params;
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid status value");
    }

    const connectionRequest = await ConnectionRequest.findById(requestId);
    if (!connectionRequest) {
      return res.status(404).send("Connection request not found");
    }


    if (connectionRequest.toUserId.toString() !== req.user._id.toString() || connectionRequest.status !== "interested") {
      return res.status(403).send("Unauthorized to respond to this request");
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.status(200).json({
      message: `Connection request ${status} successfully`,
      connectionRequest,
    });

  } catch (err) {
    console.log(err, "Error responding to connection request");
    res.status(400).send("Error responding to connection request " + err.message);
  }
});

module.exports = requestRouter
