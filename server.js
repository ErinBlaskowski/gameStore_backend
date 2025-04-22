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
  img: String,
});

const Product = mongoose.model("Product", productSchema);

app.get('/',(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/iframe-json", (req, res) => {
    const iframe = [
        {
            "id":1,
            "name":"D&D in 5 Minutes",
            "url":"https://www.youtube.com/embed/BgvHNlgmKro?si=sX8OzWESY8ovoN__",
            "img_name":"/images/store-products/BicycleCardSet.png"  
        }
    ]
    res.send(iframe);
});

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
]

app.get("/api/products-json", (req, res) => {
    res.send(products);
});

app.post("/api/store", upload.single("img"), (req, res)=>{
    
    const result = validateProduct(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const product = {
    _id: products.length,
    name: req.body.name,
    price: req.body.price,
  };

  if (req.file) {
    product.img_name = "/images/" + req.file.filename;
  }

  products.push(product);
  res.status(200).send(product);
})

app.put("/api/products/id", upload.single("img_name"), (req, res)=>{
    const prod = products.find((product)=>product._id===parseInt(req.params.id));

    if(!prod){
        res.status(404).send("The product with the provided ID was not found.");
        return;
    }

    const result = validateProduct(req.body);

    if(result)

    prod.name = req.body.name;
    prod.price = req.body.price;

    if(req.file){
        prod.main_image = req.file.filename;
    }

    req.status(200).send(prod);
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