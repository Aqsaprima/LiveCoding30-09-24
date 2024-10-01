const fs = require("fs");
// const fsAsync = require("fs").promises;
const express = require("express");

const app = express();

// middleware untuk membaca json dari request body ke kita
app.use(express.json());

// default url = health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Aplication is running...",
    // "data": []
  });
});

// req.url === "tegar"
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Ping Succesfully !",
  });
});

//get data from cars.json
const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/assets/data/cars.json`, "utf-8")
);

//kaidah res API /api/v1/(collection name) = collection harus jamak
app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Success get car data",
    isSuccess: true,
    totalData: cars.length,
    data: { cars },
  });
});

// response.data.cars

app.post("/api/v1/cars", (req, res) => {
  const newData = req.body;
  cars.push(newData);
  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "Success get car data",
        isSuccess: true,
        data: { car: newData },
      });
    }
  );
});

//middleware / handler utk url yang tidak dapat diakses karena tidak ada di aplikasi
//membuat middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "URL not exist !!",
  });
});

app.listen("3000", () => {
  console.log("start aplikasi di port 3000");
});

//api get dengan fungsi async
/*app.get("/api/v1/async", async (req, res) => {
  try {
    let cars = JSON.parse(
      await fsAsync.readFile(`${__dirname}/assets/data/cars.json`, "utf-8")
    );
    res.status(200).json({
      status: "success",
      message: "success get data car async",
      isSuccess: true,
      data: cars,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "failed get data car async",
      isSuccess: false,
      data: null,
    });
  }
});*/
