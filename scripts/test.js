const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const Soldier = require('../src/server/soldier/soldier');

const main = async () => {
  const json = JSON.parse(fs.readFileSync('./MOCK_DATA.json',{ encoding: 'utf-8' }));
  const endPoint = "http://localhost:4000/api/soldier"
  Promise.all(json.map(elem => {
    return axios.post(endPoint,elem)
  }))
  .then(() => console.log('done'))
  .catch(err => console.error(err));
};

const getSoldier = () => {
  return Soldier;
};
const initMongoose = () => {
  mongoose.connect("mongodb+srv://test:test@cluster0.hh8tk.mongodb.net/us-army?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true });
  return mongoose.connection;
};
const db = initMongoose();

const reg = /^m/ig;
const query = {
  $or: [
    { 'name': { $regex: reg }},
    // { 'sex': { $regex: reg }},
    // { 'rank': { $regex: reg }},
    // { 'phone': { $regex: reg }},
    // { 'email': { $regex: reg }},
    { 'superior.name': { $regex: reg }},
  ],
};
const aggr = [
  { $lookup: {
    from: 'soldiers',
    localField: 'superior',
    foreignField: '_id',
    as: 'superior'
    },
  },
  { $unwind: {path: '$superior'} },
  { $match: {
    $or : [
      {name: query},
      {'superior.name': query}
    ]
  }},
  { $project: {
    'superior.rank': 0,
    'superior.sex': 0,
    'superior.startDate': 0,
    'superior.phone': 0,
    'superior.email': 0,
    'superior.avatar': 0,
    'superior.superior': 0,
  }}
];
const aggr2 = [
  { $lookup: {
    from: 'soldiers',
    localField: 'superior',
    foreignField: '_id',
    as: 'superior'
    },
  },
  { $unwind: {path: '$superior'} },
  { $match: {
    $or : [
      {name: reg},
      {'superior.name': reg}
    ]
  }},
  { $project: {
    'superior.rank': 0,
    'superior.sex': 0,
    'superior.startDate': 0,
    'superior.phone': 0,
    'superior.email': 0,
    'superior.avatar': 0,
    'superior.superior': 0,
  }},
  { $facet: {
    docs: [
      {$skip: 0},
      {$limit: 10}
    ],
    totalCount: [
      {$count: 'totalCount'}
    ]
  }},
];
let start = new Date();
// Soldier.aggregate(aggr)
// .then(res => {
//   console.log(res.length);
//   console.log("aggregate",new Date() - start);
// });



Soldier.aggregate(aggr2)
.then(res => {
  // console.log(res[0].docs);
  console.log(res[0].totalCount[0])
  console.log("aggregate",new Date() - start);
  start = new Date();
})
// .then(() => {
//   return Soldier.paginate({'name': query},{
//     page: 1,
//     limit: 5,
//     populate: {
//       path: 'superior',
//       select: 'name'
//     }
//   })
//   .then(res => {
//     // console.log(res);
//     console.log("Query",new Date() - start);
//     start = new Date();
//   });
// })
.then(() => {
  const page = 1, limit = 10;
  return Soldier.find({})
  .populate('superior','name')
  .where(query)
  .sort({'superior.name': -1})
  .then(data => {
    console.log(data);
    
    let offset = (page-1)*limit;
    // const dat = data.filter(elem => {
    //   return /m/i.test(elem.name) || elem.superior && /m/i.test(elem.superior.name)
    // });
    // let totalCount = dat.length;
    console.log("Find",new Date() - start);
    start = new Date();
    return data;
  });
});

module.exports = {
  initMongoose,
  getSoldier
};

