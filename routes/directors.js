var express = require("express");
var router = express.Router();
var directorModel = require("../models/Director");

/* GET directors listing. */
router.get("/lookup", function (req, res, next) {
 
  const result = directorModel.aggregate([
    {
      $lookup:{
              from:'movies',
              localField:'_id',
              foreignField:'director_id',
              as:'movies'
      }
    },
    {
      $project:{
              _id:0,
              name:1,
              surname:true,
              'movies.title':1,
              'movies.imdb_score':1
      }
    },
    {
      $unwind:{
        path:'$movies',        
        preserveNullAndEmptyArrays:false
      }
    }
  ])

  result
        .then((data)=>{res.json(data);})
        .catch((err)=>{res.json(err);})

});



/* GET director by DirectorId. */
//localhost:3000/api/directors/:directorId
router.get("/:directorId", function (req, res, next) {
  directorModel.findById(req.params.directorId)
              .then((data)=>{
                if(!data)
                next({message:'The director was not found.',status:404})
                res.json(data);})
              .catch((err)=>{res.json(err);})
});

/* GET directors listing. */
router.get("/", function (req, res, next) {
  directorModel.find((err, data) => {
    if (err) res.json(err);
    res.json(data);
  })
});

/*POST a director. */
router.post("/", (req, res,next) => {
  var newDirector = new directorModel(req.body);
  /*newDirector.save((err, data) => {
    if (err) res.json(err);
    res.json(data);
  });*/

  newDirector.save()
            .then((data)=>{res.json(data);})
            .catch((err)=>{res.json(err);})
});

/*PUT a director. */
router.put("/:directorId", (req, res,next) => {
    directorModel.findByIdAndUpdate(req.params.directorId,req.body,{new:true})
                  .then((data)=>{res.json(data);})
                  .catch((err)=>{res.json(err);})
});

/*DELETE a director. */
router.delete("/:directorId", (req, res,next) => {
  directorModel.findByIdAndRemove(req.params.directorId)
                .then((data)=>{res.json(data);})
                .catch((err)=>{res.json(err);})
});

module.exports = router;