const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxpun0e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewCollection = client.db("bistroDB").collection("reviews");
    const cartCollection = client.db("bistroDB").collection("carts");
    const userCollection = client.db("bistroDB").collection("users");
    const paymentCollection = client.db("bistroDB").collection("payments");
    

    // JWT related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // User
    app.post("/users", async (req, res) => {
      const user = req.body;

      // Insert email if user doesn't exist:
      // We can do this many ways: (1. email unique, 2. Upsert, 3.simple checking)
      const query = { email: user.email };
      const exisingUser = await userCollection.findOne(query);
      if (exisingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // middleware
    const verifyToken = (req, res, next) => {
      // console.log("Inside verifyToken: ", req.headers);

      // This is recieved from client side after every axios secure req:
      // const res = await axiosSecure.get("/users", {
      //     headers: {
      //         authorization: `Bearer ${localStorage.getItem("access-token")}`
      //     }
      // In req interceptor this is writiten as config.headers.authorization
      // This is sent to backend where verifyToken function recieves and access it as req.headers.authorization
      // });

      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Forbidden Access" });
      }

      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .send({ message: "Wrong Access Token! Forbidden Access" });
        }

        // Decoded contains this -> const userInfo = {email: currentUser.email}; <- from the client side authProvider.jsx
        req.decoded = decoded;
        next();
      });

      // next();
    };

    // Use verifyAdmin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        console.log("You are not admin");
        return res
          .status(403)
          .send({ message: "You are not admin. So forbidden access" });
      }

      next();
    };


    // Check if someone(an user) is an Admin. Return boolean.
    // Get the email from the client side, verify token, if verification passed then, get the user based
    // on the email recieved from client side. 
    // Check if the user has a role? If they have it, then check if the role is an admin or not
    // Return that boolean.
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Unauthorized access!" });
      }

      const query = { email: email };
      const user = await userCollection.findOne(query);

      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      // console.log("GET /users: ", req.headers);
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Make a user an Admin
    // First verify token
    // Secondly, verfiy admin
    // Then, patch the user document with the role of an admin.
    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: "admin",
          },
        };

        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      }
    );

    // menu
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    app.get("/menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.findOne(query);
      res.send(result);

      // res.send(await menuCollection.findOne({_id: new ObjectId(req.params.id)}));
    });

    app.post("/menu", verifyToken, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await menuCollection.insertOne(item);
      res.send(result);
    });

    app.patch("/menu/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: item.name,
          category: item.category,
          price: item.price,
          recipe: item.recipe,
          image: item.image,
        },
      };

      const result = await menuCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      // console.log("/menu/:id DELETE: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.deleteOne(query);
      res.send(result);
    });

    // review
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Carts collection
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email };
      }

      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100); //Stripe always counts the "poisa". e.g $5.2 = 520 penny

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"]
      });

      res.send({
        clientSecret: paymentIntent.client_secret
      })


    });

    app.post('/payments', async(req, res) => {
      const payment = req.body;
      const paymentResult = await paymentCollection.insertOne(payment);

      // Carefully delete each item from the cart
      // console.log("Payment Info: ", payment);
      const query = {_id: {
        $in: payment.cartIds.map(id => new ObjectId(id))
      }};
      console.log("Query: ", query);
      const deleteResult = await cartCollection.deleteMany(query);

      res.send({paymentResult, deleteResult});

    });

    app.get("/payments/:email", verifyToken, async(req, res) => {
      const query = {email: req.params.email};
      if(req.params.email !== req.decoded.email){
        return res.status(403).send({message: "Forbidden Access! Why are you trying to access other peoples data! BAD!"})
      }
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });


    // Stats or analytics
    app.get("/admin-stats", verifyToken, verifyAdmin, async(req, res) => {
      const users = await userCollection.estimatedDocumentCount();
      const menuItems = await menuCollection.estimatedDocumentCount();
      const orders = await paymentCollection.estimatedDocumentCount(); 

      // This is not the best way
      // const payments = await paymentCollection.find().toArray();
      // const revenue = payments.reduce((total, payment) => total + payment.price, 0);

      //Effiecient: Using mongo operator to get the revenue;
      const result = await paymentCollection.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {$sum : "$price"}
          }
        }
      ]).toArray();

      const revenue = result.length > 0 ? result[0].totalRevenue : 0;

      res.send({
        users,
        menuItems,
        orders,
        revenue
      })
    });


    app.get("/order-stats",  async(req, res) => {

      const result = await paymentCollection.aggregate([
        {
          $unwind: "$menuItemIds"
        },
        {
          $lookup: {
            from: "menu",
            localField: "menuItemIds",
            foreignField: "_id",
            as: "menuItems"
          }
        },
        {
          $unwind: "$menuItems"
        },
        {
          $group: {
            _id: "$menuItems.category",
            quantity: {$sum : 1},
            revenue: {$sum : "$menuItems.price"}
          }
        },
        {
          $project: {
            category: '$_id',
            quantity: 1,
            revenue: 1,
            _id: 0,
          },
        },
      ]).toArray();

      res.send(result);

    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
