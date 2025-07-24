const express = require('express');
const ConnectRequest = require('../../models/connectRequest');
const { userAuth } = require('./../../middlewares/auth-midddleware');
const User = require('./../../models/user');

const requestRoutes = express.Router();

const USER_INFO = ["firstName", "lastName", "photoUrl", "gender", "skills", "about"]
requestRoutes.post('/request/send/:status/:toUserId', userAuth, async (req, res, next) => {

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;



    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(400).json({
        status: 400,
        message: `Connection can't be established for an unknown user :` + toUserId
      });
    }

    const ALLOWED_STATUS = ['ignored', 'interested'];
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid status Type : ' + status
      });
    }

    const connectionExisted = await ConnectRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (connectionExisted) {
      return res.status(400).json({
        status: 400,
        message: 'Connection request existed between ' + req.user.firstName + ' and ' + toUser.firstName
      });
    }


    const connectRequest = new ConnectRequest({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectRequest.save();
    res.json({
      message: "Connection Request Send Successfully !!!!",
      data
    })
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
});


requestRoutes.post('/request/review/:status/:requestId', userAuth, async (req, res, next) => {

  try {
    const user = req.user;

    const { status, requestId } = req.params;

    const ALLOWED_STATUS = ['accepted', 'rejected'];

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid status passed !! ' + status
      });
    }
    const connectRequest = await ConnectRequest.findOne({
      _id: requestId,
      toUserId: user._id,
      status: 'interested'
    });

    if (!connectRequest) {
      return res.status(400).json({
        status: 400,
        message: 'Connection request not found !!!'
      });
    }

    connectRequest.status = status;

    await connectRequest.save();

    res.json({
      status: 200,
      message: 'Connection ' + status + ' successfully !!'
    });

  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message
    });
  }
});


requestRoutes.get('/requests/received', userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested'
    }).populate('fromUserId', USER_INFO);

    res.json({ data: requests });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
});

requestRoutes.get('/connections', userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' }
      ]
    }).populate('fromUserId', USER_INFO).populate('toUserId', USER_INFO);
    const data = connections.map(item => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString())
        return item.toUserId;
      
      return item.fromUserId
    });
    res.json({ connections: data });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
});

requestRoutes.get('/feeds', userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const skip = (page - 1) * limit;

    const connections = await ConnectRequest.find({
      $or: [
        { toUserId: loggedInUser._id},
        { fromUserId: loggedInUser._id}
      ]
    });

    const connectedUsers = new Set();
    connections.forEach(conn => {
      connectedUsers.add(conn.fromUserId.toString());
      connectedUsers.add(conn.toUserId.toString());
    });

    const feeds = await User.find({
     _id: {$nin: Array.from(connectedUsers) }
    }).select(USER_INFO).skip(skip).limit(limit);
    
    res.json({ feeds: feeds });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
});


module.exports = requestRoutes;