var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')


//Models
const UserModel=require('../models/User');
const app = require('../app');

/* GET users listing. */
router.get("/", function (req, res, next) {
  UserModel.find((err, data) => {
    if (err) res.json(err);
    res.json(data);
  })
});



router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;
UserModel.findOne({username})
            .then((resultUser)=>{
              if(!resultUser) {res.end("The user was not found!")}
              else{
                  bcrypt.compare(password,resultUser.password)
                          .then((loginResult)=>{
                              if(!loginResult)
                              {res.end("Authentication failed, wrong password.")}
                              else
                              {
                                const payload={username}
                                const token = jwt.sign(payload,req.app.get('api_secret_key'),{expiresIn:720/*12*60//12hours*/})
                                res.json({status:true,token})
                              }
                          })
              }
              //res.json(resultUser);

            })
            .catch((err)=>{res.json(err)})
 
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, function (err, hash) {
    const newUser = new UserModel({ username, password:hash });
    newUser
      .save()
      .then((data) => { res.json(data);})
      .catch((err) => {res.json(err); });
  });
});

module.exports = router;
