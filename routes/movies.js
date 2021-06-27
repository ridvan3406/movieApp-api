var express = require("express");
var router = express.Router();
var movieModel = require("../models/Movie");




/* GET movies with directors. */
//localhost:3000/api/movies/listWithDirectors
router.get("/listWithDirectors", function (req, res, next) {
  
  movieModel.aggregate([
    {
      $lookup:{
        from:'directors',
        foreignField:'_id',
        localField:'director_id',
        as:'director'
      }
    }
  ]).then((data)=>{res.json(data);})
    .catch((err)=>{res.json(err);})
});


/* GET BETWEEN DATES */
//localhost:3000/api/movies/between/:startDate/:endDate
router.get("/between/:startDate/:endDate", function (req, res, next) {

  /*const startDate = req.params.startDate;
  const endDate = req.params.endDate;*/
  const {startDate,endDate} = req.params;
//greater than or equal & less than or equal
//year>=startDate           year<=endDate
  movieModel.find({year:{"$gte":parseInt(startDate),"$lte":parseInt(endDate)}})
              .then((data)=>{res.json(data);})
              .catch((err)=>{res.json(err);})
});


/* GET TOP 10 movies. */
//localhost:3000/api/movies/top10
router.get("/top10", function (req, res, next) {
  movieModel.find().sort({imdb_score:-1}).limit(10)
              .then((data)=>{res.json(data);})
              .catch((err)=>{res.json(err);})
});

/* GET movie by MovieId. */
//localhost:3000/api/movies/:movieId
router.get("/:movieId", function (req, res, next) {
  movieModel.findById(req.params.movieId)
              .then((data)=>{
                if(!data)
                next({message:'The movie was not found.',status:404})
                res.json(data);})
              .catch((err)=>{res.json(err);})
});

/* GET movies listing. */
router.get("/", function (req, res, next) {
  movieModel.find((err, data) => {
    if (err) res.json(err);
    res.json(data);
  })
});



/*POST a movie. */
router.post("/", (req, res,next) => {
  var newMovie = new movieModel(req.body);
  /*newMovie.save((err, data) => {
    if (err) res.json(err);
    res.json(data);
  });*/

  newMovie.save()
            .then((data)=>{res.json(data);})
            .catch((err)=>{res.json(err);})
});

/*PUT a movie. */
router.put("/:movieId", (req, res,next) => {
    movieModel.findByIdAndUpdate(req.params.movieId,req.body,{new:true})
                  .then((data)=>{res.json(data);})
                  .catch((err)=>{res.json(err);})
});

/*DELETE a movie. */
router.delete("/:movieId", (req, res,next) => {
  movieModel.findByIdAndRemove(req.params.movieId)
                .then((data)=>{res.json(data);})
                .catch((err)=>{res.json(err);})
});

module.exports = router;