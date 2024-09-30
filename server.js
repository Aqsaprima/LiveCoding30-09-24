const fs = require("fs");
const express = require("express");

const app = express();

// default url = health check
app.get("/", (req, res) => {
  res.status(200).json({
    "status": "Success",
    "message": "Aplication is running...",
    // "data": []
  });
});

// req.url === "tegar"
app.get("/test", (req, res) => {
  res.status(200).json({
    "message": "Ping Succesfully !"
  });
});

//middleware / handler utk url yang tidak dapat diakses karena tidak ada di aplikasi
//membuat middleware
app.use((req, res, next) => {
  res.status(404).json({
    "status": "Failed",
    "message": "URL not exist !!"
  });
});

app.listen("3000", () => {
  console.log("start aplikasi di port 3000");
})