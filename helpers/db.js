// const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://ridvan: 6XGFNA7xDbTOHIM0@cluster1.uvbcn.mongodb.net/movieppdbEurope?retryWrites=true&w=majority',
//  {useNewUrlParser: true, useUnifiedTopology: true})
//  .then(()=>{console.log('MongoDB Connection has been made.')})
//  .catch((err)=>{console.log('Connection  failed. Detail:',err)});

// module.exports= mongoose

const mongoose = require("mongoose");
module.exports = () => {
  mongoose.connect(
    "mongodb+srv://ridvan:6XGFNA7xDbTOHIM0@cluster1.uvbcn.mongodb.net/movieApp?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.on("open", function () {
    console.log("we're connected!");
  });
};
