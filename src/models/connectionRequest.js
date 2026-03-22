const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["rejected", "interested", "accepted", "ignored"],
        message: "{VALUE} is not supported",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function () {
  try {
    if(this.fromUserId.equals(this.toUserId)) {
      throw new Error("Cannot send connection request to yourself");
    }
    const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: this.fromUserId, toUserId: this.toUserId },
          { fromUserId: this.toUserId, toUserId: this.fromUserId },
        ]
     });
    
    if (existingRequest && this.status === existingRequest?.status) {
      throw new Error("Connection request already exists");
    }

  } catch (err) {
    console.log("Error in pre-save hook", err);
    throw err;
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);



module.exports = ConnectionRequest;