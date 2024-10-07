const fs = require("fs");
// const fsAsync = require("fs").promises;
const express = require("express");
const app = express();
const { Product } = require("./models");
// middleware untuk membaca json dari request body ke kita
app.use(express.json());

// get / mengambil data
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
    data: {
      cars,
    },
  });
});

// /:id ini url params
app.get("/api/v1/cars/:id", (req, res) => {
  const idParams = req.params.id * 1;
  const car = cars.find((i) => i.id === idParams);
  //salah satu basic error handling
  if (!car) {
    console.log("not found");
    return res.status(404).json({
      status: "Failed",
      message: `Car data with ID ${idParams} is not found`,
      isSuccess: false,
      data: null,
    });
  }
  res.status(200).json({
    status: "success",
    message: "Success get car data",
    isSuccess: true,
    data: {
      car,
    },
  });
});

//post / input data
app.post("/api/v1/cars", (req, res) => {
  const newCar = req.body;
  cars.push(newCar);
  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "Success add new car data",
        isSuccess: true,
        data: {
          car: newCar,
        },
      });
    }
  );
});

//update
app.patch("/api/v1/cars/:id", (req, res) => {
  const id = req.params.id * 1;

  //object destructuring
  const { name, year, type } = req.body;

  //mencari data by id
  const car = cars.find((i) => i.id === id);

  //mencari index dari data
  const carIndex = cars.findIndex((j) => j.id === id);

  if (!car) {
    console.log("not found");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data with id : ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  //update sesuai request body
  //object assign = menggunakan objek spread operator
  cars[carIndex] = { ...cars[carIndex], ...req.body };

  //get new data for response api
  const newCar = cars.find((i) => i.id === id);

  //masukkan / rewrite data JSON dalam file
  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: `Success update car data id : ${id}`,
        isSuccess: true,
        data: {
          newCar,
        },
      });
    }
  );
});

//delete
app.delete("/api/v1/cars/:id", (req, res) => {
  const id = req.params.id * 1;

  //object destructuring
  const { name, year, type } = req.body;

  //mencari data by id
  const car = cars.find((i) => i.id === id);

  //mencari index dari data
  const carIndex = cars.findIndex((j) => j.id === id);

  if (!car) {
    console.log("not found");
    return res.status(404).json({
      status: "Failed",
      message: `Failed delete car data with id : ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  //melakukan splice untuk hapus data
  cars.splice(carIndex, 1);

  //masukkan / rewrite data JSON dalam file
  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: `Success update car data id : ${id}`,
        isSuccess: true,
        data: {
          car,
        },
      });
    }
  );
});

//api get dengan fungsi async
app.get("/api/v1/async", async (req, res) => {
  try {
    const cars = await Product.findAll();
    res.status(200).json({
      status: "success",
      message: "success get data car async",
      isSuccess: true,
      data: cars,
    });
  } catch (error) {
    res.status(404).json({
      status: "gagal",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
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
