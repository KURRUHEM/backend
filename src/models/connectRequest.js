const mongoose = require('mongoose');

const connectRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    toUserId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      required: true,
      enum : {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incoorect statu type!`
      }
    }
  },
  {
    timestamps: true
  }
);

connectRequestSchema.pre('save', function(next) {
  const connectRequest = this;

  if (connectRequest.fromUserId.equals(connectRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourslef !!!")
  }

  next();
})

const ConnectRequestModel = new mongoose.model("ConnectRequest", connectRequestSchema);

module.exports =  ConnectRequestModel ;