const Soldier = require('./soldier');
const sharp = require('sharp');
const { ObjectId } = require('mongoose').Types;

const thumbSize = 30;

const getSoldiers = (req,res) => {
  const { q=".*",field="",sub="",supid="",asc=1,pageSize=5,pageNum=1,all=0 } = req.query;
  // case send name:id pairs
  if (all === 1) {
    Soldier.find({},"name")
    .then(data => {
      res.json({
        data
      });
    }).catch(err => {
      res.status(500).json(err);
    })
  } else {
    
    const popQuery = {
      path: 'superior',
      select: 'name',
    };
    const comparator = {};
    if (field !== "" && asc !== 0) {
      comparator[field] = asc;
    }
    comparator._id = -1;

    let query = {};
    if (sub !== "") {
      query = { 'superior': sub };
    }
    if (supid !== "") {
      query = { '_id': supid }
    };
    Soldier.find(query).sort(comparator).populate(popQuery)
    .then(data => {
      if (field === "superior") {
        data = data.sort((a,b) => {
          if (a.superior && b.superior) {
            return asc * a.superior.name.localeCompare(b.superior.name);
          }
          return 0;
        });
      }
      data = data.filter(({ name,sex,rank,phone,email,superior: superiorObj}) => {
        if (q===".*") return true;
        const reg = new RegExp(q,'ig');
        const res = [name,sex,rank,phone,email].reduce((a,e) => {
          return a || reg.test(e);
        },false);
        let sup = false;
        if (superiorObj) {
          sup = reg.test(superiorObj.name);
          return res || sup;
        }
        return res;
      });
      const thumbPromise = data.map(elem => {
        if (elem.avatar && elem.avatar.byteLength !== 0)  {
          return sharp(elem.avatar).resize(thumbSize).toBuffer();
        }
        else return null;
      });
      const subsPromise = data.map(elem => Soldier.countDocuments({ superior: elem._id }));
      return Promise.all(thumbPromise)
      .then((thumbs) => {
        return Promise.all(subsPromise)
        .then(subs => {
          return data.map((elem,i) => {
            return {
              ...elem._doc,
              avatar: thumbs[i],
              numOfSubs: subs[i]
            }
          });
        })
      });
    })
    .then(docs => {
      const totalDocs = docs.length;
      const limit = pageSize;
      const totalPages = Math.ceil(totalDocs/limit);
      const page = pageNum;
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1: null;
      const nextPage = hasNextPage ? page+1: null;
      res.json({
        docs: docs.slice((page-1)*limit,page*limit),
        totalDocs,
        limit,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
  }
};

const getSoldiersFind = (req,res) => {
  const { q=".*",field="",sub="",supid="",asc=1,pageSize=5,pageNum=1,all=0 } = req.query;
  // case send name:id pairs
  if (all === 1) {
    Soldier.find({},"name")
    .then(data => {
      res.json({
        data
      });
    }).catch(err => {
      res.status(500).json(err);
    })
  } else {
    const reg = new RegExp(q,'ig');
    const popQuery = {
      path: 'superior',
      select: 'name',
    };
    const comparator = {};
    if (field === "superior") {
      comparator['superior.name'] = asc;
    } else if (field !== "" && asc !== 0) {
      comparator[field] = asc;
    }
    comparator._id = -1;

    let query = {
      $or: [
        { 'name': { $regex: reg }},
        { 'sex': { $regex: reg }},
        { 'rank': { $regex: reg }},
        { 'phone': { $regex: reg }},
        { 'email': { $regex: reg }},
        { 'superior.name': { $regex: reg }},
      ],
    };
    if (sub !== "") query['$and'] = [{'superior': sub}];
    if (supid !== "") query = { '_id': supid };
    
    const countPromise = Soldier.find({}).populate(popQuery).where(query).countDocuments();
    let findPromise = Soldier.find({}).populate(popQuery).where(query).sort(comparator).skip((pageNum-1)*pageSize).limit(pageSize);
    findPromise.then(data => {
      const getThumbPromise = Promise.all(data.map(elem => {
        if (elem.avatar && elem.avatar.byteLength !== 0)  return sharp(elem.avatar).resize(thumbSize).toBuffer();
        else return null;
      }));
      const getSubPromise = Promise.all(data.map(elem => {
        return Soldier.countDocuments({ superior: elem._id });
      }))
      return Promise.all([getThumbPromise,getSubPromise])
      .then(([thumbs,subs]) => {
        data.map((elem,i) => {
          return {
            ...elem,
            numOfSubs: subs[i],
            avatar: thumbs[i],
          };
        });
      });
    })
    Promise.all([
      countPromise,
      findPromise
      ])
    .then(([count,data]) => {
      // count subs and make thumbs
      res.json({
        docs: data,
        totalDocs: count,
        limit: pageSize,
        totalPages: Math.ceil(count/pageSize),
        page: pageNum,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < Math.ceil(count/pageSize),
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        nextPage: pageNum < Math.ceil(count/pageSize) ? pageNum+1 : null 
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    })
  }
}

const getSoldiersOld = (req,res) => {
  const { q=".*",field="",sub="",supid="",asc=1,pageSize=5,pageNum=1,all=0 } = req.query;
  // case send name:id pairs
  if (all === 1) {
    Soldier.find({},"name")
    .then(data => {
      res.json({
        data
      });
    }).catch(err => {
      res.status(500).json(err);
    })
  } else {
    // case send soldier list
    const reg = new RegExp(q,'ig');
    const popQuery = {
      path: 'superior',
      select: 'name',
    };
    const comparator = {};
    if (field === "superior") {
      popQuery.sort = { 'name': asc };
      comparator[field] = asc;
    } else if (field !== "" && asc !== 0) {
      comparator[field] = asc;
    }
    comparator._id = -1;

    // superior should be filtered too
    let query = {
      $or: [
        { 'name': { $regex: reg }},
        { 'sex': { $regex: reg }},
        { 'rank': { $regex: reg }},
        { 'phone': { $regex: reg }},
        { 'email': { $regex: reg }},
        { 'superior.name': { $regex: reg }},
      ],
    };
    if (sub !== "") query['$and'] = [{'superior': sub}];
    if (supid !== "") query = { '_id': supid };
    Soldier.paginate(query,{
      page: pageNum,
      limit: pageSize,
      sort: comparator,
      populate: {
        path: 'superior',
        select: 'name'
      }
    })
    .then(data => {
      Promise.all(data.docs.map(elem => {
        return Soldier.countDocuments({ superior: elem._id })
      }))
      .then(subs => {
        Promise.all(data.docs.map(elem => {
          if (elem.avatar && elem.avatar.byteLength !== 0)  return sharp(elem.avatar).resize(thumbSize).toBuffer();
          else return null;
        }))
        .then(thumbs => {
          data.docs.forEach((elem,i) => {
            data.docs[i] = {
              ...elem._doc,
              numOfSubs: subs[i],
              avatar: thumbs[i],
            }
          });
          res.json(data);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send();
        })
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({});
    });
  }
}

const getSoldier = (req,res) => {
  res.json({
    soldier: req.soldier
  });
};

const createSoldier = (req,res) => {
  const { superior=null,startDate=new Date() } = req.body;
  Soldier.create({
    ...req.body,
    superior: superior === "" ? null : superior,
    startDate
  })
  .then(soldier => {
    res.json({ id:soldier._id });
  })
  .catch(err => {
    res.status(500).json({});
    console.error(err);
  });
};

const updateAvatar = (req,res) => {
  const id = req.params.id;
  const avatar = req.file.buffer;
  Soldier.updateOne({ _id: id },{ avatar })
  .then(() => {
    res.send();
  })
  .catch(err => {
    console.error(err);
    res.status(500).send();
  });
}

const updateSoldier = (req,res) => {
  const { name,rank,sex,startDate,email,phone,superior } = req.body;
  console.log("Updating1");
  console.log(req.url);
  Soldier.updateOne({ _id: req.params.id },{
    name,rank,sex,startDate,email,phone,
    superior: superior === "" ? null : superior,
  })
  .then(() => {
    console.log("Updating2");
    res.status(200).json({});
  })
  .catch(err => {
    console.log("Updating3");
    res.status(500).json({});
    console.error(err);
  });
};

const deleteSoldier = (req,res) => {
  Soldier.deleteOne({ _id: req.params.id })
  .then(data => {
    res.json({});
  })
  .catch(err => {
    res.status(500).json({});
    console.error(err);
  });
};

module.exports = {
  getSoldiers,
  getSoldier,
  createSoldier,
  updateSoldier,
  deleteSoldier,
  updateAvatar,
};