const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rlfbbtk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const usersCollection = client.db('developers-society').collection('users');
        const usersInfoCollection = client.db('developers-society').collection('usersInfo');
        const blogsCollection = client.db('developers-society').collection('blogs');


        app.get('/', (req, res) => {
            res.send('Developer society server is running')
        })

        // //get all users
        // app.get('/users',async(req,res)=>{
        //     const query ={};
        //     const result = await usersCollection.find(query).toArray();
        //     res.send(result);
        // })
        // //get single user
        // app.get('/users/:email',async(req,res)=>{
        //     const email = req.params.email;
        //     const query = {email:email};
        //     const result = await usersCollection.findOne(query);
        //     res.send(result);
        // })

        // //insert a user
        // app.post('/users',async(req,res)=>{
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user);
        //     res.send(result);
        // })

        //get all usersInfo
        app.get('/users-info',async(req,res)=>{
            const query ={};
            const result = await usersInfoCollection.find(query).toArray();
            res.send(result);
        })
        //get single userInfo
        app.get('/users-info/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {regEmail:email};
            const result = await usersInfoCollection.findOne(query);
            res.send(result);
        })
        //update users info 
        app.patch('/users-info/:email',async(req,res)=>{
            const email = req.params.email;
            const filter = {regEmail:email};
            const updatedFile = req.body;
            const options = { upsert: true };
            const doc ={
                $set:{
                    name:updatedFile.name,
                    email:updatedFile.email,
                    education:updatedFile.education,
                    address:updatedFile.address,  
                    image:updatedFile.image
                }
            };
            const result = await usersInfoCollection.updateOne(filter,doc,options);
            res.send(result);

        })

        //insert userInfo
        app.post('/users-info',async(req,res)=>{
            const user = req.body;
            const result = await usersInfoCollection.insertOne(user);
            res.send(result);
        })
        
        //blogs
        //get all blogs
        app.get('/blogs',async(req,res)=>{
            const query ={};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        });
        //get all blogs with media
        app.get('/blogs-media',async(req,res)=>{
            const query ={media:true};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        });
        //get all blogs without media
        app.get('/blogs-text',async(req,res)=>{
            const query ={media:false};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        });
        //single person blog
        app.get('/blogs/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email:email};
            const result = await blogsCollection.find(query).toArray;
            res.send(result);
        })
        //insert post
        app.post('/blogs',async(req,res)=>{
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.send(result);
        })

    }
    finally {
        // https://developer-society-server.vercel.app
    }
}
run().catch((error)=>console.log(error));

app.listen(port, () => {
    console.log(`Developer society running on ${port}`)
})