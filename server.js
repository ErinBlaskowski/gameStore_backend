const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://erinblask:fAOoIxoTps2MsFtI@cluster1.cqwhhxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String
});

const Product = mongoose.model("Product", productSchema);

app.get('/',(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/*
const products = [
    {
        "id":1,
        "name":"Standard Card Set",
        "price":"$6.99",
        "img_name":"/images/BicycleCardSet.png",
        "contains":"",
        "description":""
    },
    {
        "id":2,
        "name":"Layered Chess Set",
        "price":"$44.99",
        "img_name":"/images/FunkyChessSet.png",
        "contains":"",
        "description":""
    },
    {
        "id":3,
        "name":"Set of 8 Puzzles",
        "price":"$25.99",
        "img_name":"/images/SetOfEightPuzzles.jpeg",
        "contains":"",
        "description":""
    },
    {
        "id":4,
        "name":"White Dice Set",
        "price":"$13.99",
        "img_name":"/images/DiceSet.png",
        "contains":"",
        "description":""
    }, 
    {
        "id":5,
        "name":"Medieval Chess Set",
        "price":"$49.99",
        "img_name":"/images/MedievalChessSet.png",
        "contains":"",
        "description":""
    }, 
    {
        "id":6,
        "name":"VR Headset",
        "price":"$199.99",
        "img_name":"/images/VirtualHeadset.png",
        "contains":"",
        "description":""
    }, 
    {
        "id":7,
        "name":"Dominos",
        "price":"$15.99",
        "img_name":"/images/Dominos.png",
        "contains":"",
        "description":""
    },
    {
        "id":8,
        "name":"Red Dice Set",
        "price":"$13.99",
        "img_name":"/images/RedDiceSet.png",
        "contains":"",
        "description":""
    },  
    {
        "id":9,
        "name":"Monopoly",
        "price":"$24.99",
        "img_name":"/images/Monopoly.png",
        "contains":"",
        "description":""
    }    
] */

app.get("/api/products-json", async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.get("/api/products/:id", async (req, res) => {
    const product = await Product.findOne({ _id: id });
    res.send(product);
  });

app.post("/api/store", upload.single("img"), async (req, res)=>{
    
    const result = validateProduct(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const product = new Product({
    _id: products.length,
    name: req.body.name,
    price: req.body.price,
  });

  if (req.file) {
    product.img_name = "/images/" + req.file.filename;
  };

  /*
  products.push(product);
  res.status(200).send(product);
  */
  const newProduct = await product.save();
  res.send(newProduct);
})

app.put("/api/store/:id", upload.single("img"), async (req, res) => {
    const result = validateProduct(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    let fieldsToUpdate = {
      name: req.body.name,
      price: req.body.price,
    };
  
    if (req.file) {
      fieldsToUpdate.img = "images/" + req.file.filename;
    }
  
    const wentThrough = await Product.updateOne(
      { _id: req.params.id },
      fieldsToUpdate
    );
  
    const updatedProduct = await Product.findOne({ _id: req.params.id });
    res.send(updatedProduct);
  });

app.delete("/api/products/:id", (req, res) => {
    const product = products.find((h) => h._id === parseInt(req.params.id));
  
    if (!product) {
      res.status(404).send("The product with the given id was not found");
    }
  
    const index = products.indexOf(product);
    products.splice(index, 1);
    res.send(product);
});
  
const validateProduct = (product) => {
    const schema = Joi.object({
      _id: Joi.allow(""),
      name: Joi.string().min(3).required(),
      price: Joi.number().required(),
    });
  
    return schema.validate(product);
};
  
app.listen(3000, () => {
    console.log("I'm listening");
});