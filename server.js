const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(cors());

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

app.get("/api/products-json", (req, res) => {
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
    res.send(products);
});

app.listen(3000, () => {
    console.log("I'm listening");
});