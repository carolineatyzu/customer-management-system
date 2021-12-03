const mongoose = require('mongoose');

const Soldier = require('../soldier/soldier');

const { isValidObjectId } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const str2num = (req,res,next) => {
  const nums = ['asc','pageSize','pageNum','all'];
  Object.entries(req.query).forEach(([key,value]) => {
    if (nums.includes(key)) {
      req.query[key] = +value;
    }
  });
  next();
};

const checkId = (req,res,next) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    Soldier.findOne({_id: id})
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: "User not found"
        });
      } else {
        req.soldier = data;
        next();
      }
    })
  } else {
    res.status(404).json({
      message: "Id not valid"
    });
  }
}

const checkLoop = async (req,res,next) => {
  const sub = await Soldier.findById(req.soldier._id);
  let sup = req.body.superior === "" ? null : await Soldier.findById(req.body.superior);
  // case remove Sup
  if(!sup) {
    console.log("remove");
    next();
    return;
  }
  // case add oneself as sup
  if (sub.equals(sup)) {
    res.status(400).json({
      message: "Loop detected"
    });
    return;
  }
  try {
    while(sup) {
      console.log("Loop",sub,sup);
      if (sub.equals(sup)) {
        res.status(400).json({
          message: "Loop Detected"
        });
        return;
      }
      sup = await Soldier.findById(sup.superior);
    }
    next();
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const deleteSupInfo = (req,res,next) => {
  const { _id } = req.soldier;
  Soldier.updateMany({ superior: _id },{$set : { superior: req.soldier.superior }})
  .then(() => next())
  .catch(err => {
    console.error(err);
    res.status(500).send();
  });
}

module.exports = {
  str2num,
  checkId,
  checkLoop,
  deleteSupInfo,
};