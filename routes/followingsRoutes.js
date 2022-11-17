const express = require("express");
const router = express.Router();
const Following = require("../models/followingModel");
const User = require("../models/userModel");

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const followingsData = await Following.find({ userId });
    const followings = []
    followingsData[0].followingId.forEach(async (item)=>{
      var user = await User.findById( item );
      // console.log(user)
      followings.push(user)
    if(followings.length == followingsData[0].followingId.length){
        res.status(200).json({
          message: "Followings fetched successfully.",
          response: {
            followings,
          },
        });
      }
    })
    // console.log(data)
    // res.status(200).json({
    //   message: "Followings fetched successfully.",
    //   response: {
    //     followings,
    //   },
    // });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});



router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const following = await Following.findOne({ userId });
    following.followingId.push(req.body.followingId);
    await following.save();
    res.status(201).json({
      message: "following added successfully.",
      response: {
        following,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    // console.log(req.body)
    // const id = req.params.id;
    const userId = req.body.userId;

    // const following = await Following.findOneAndDelete({ _id: id });
    const following = await Following.findOne({ userId });

    if (!following) {
      return res.status(404).json({
        message: "following does not exist.",
      });
    }
    // console.log(following.followingId)
    var deleted = following.followingId.filter(function(el) { 
      // console.log(el.toString(), req.body.deleteId)
      return el.toString() !== req.body.deleteId; 
    });
    following.followingId = deleted
    // console.log(deleted)
    await following.save();

    res.status(200).json({
      message: "following removed successfully.",
      response: {
        following,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;

//     const following = await Following.findOneAndDelete({ _id: id });
//     if (!following) {
//       return res.status(404).json({
//         message: "following does not exist.",
//       });
//     }
//     res.status(200).json({
//       message: "following removed successfully.",
//       response: {
//         following,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Something went wrong.",
//       error: error.message,
//     });
//   }
// });

module.exports = router;
