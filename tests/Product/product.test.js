const Product = require("../../models/product")
const Category = require("../../models/category")
const User = require("../../models/user")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestTestDB",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    },() => done());
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

describe('admin product test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";

    ///////////////////////Testing Create Category////////////////////////
    test("POST /api/category/create/:userId", async () => {
    const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        });
        const data = { name : "Mobiles" };
        //const header = {'Authorization': `Bearer `+ token, 'Content-Type': 'application/json'};
      
        await supertest(app)
          .post("/api/category/create/" + "115560636549278411291") 
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(data)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Category///////////////////////
            // Check the response
            expect(response.body.category._id).toBeTruthy();
            expect(response.body.category.name).toBe(data.name);
      
            // Check data in the database
            const post = await Category.findOne({ _id: response.body.category._id });
            expect(post).toBeTruthy();
            expect(post.name).toBe(data.name);
            /////////////////Check For Category End///////////////////////


            /////////////////Check For Create Product///////////////////////
                    

            /////////////////Check For Create Product End///////////////////////
          })
      });


    ///////////////////////Testing Creating the Product///////////////////
    test("POST /api/product/create/:userId", async () => {
        const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        });
        const data = { 
            name: "Iphone 12 Pro max", 
            description: "Iphone description",
            price :  130000,
            stock :  500,
            sold : 0,
            category : "612b813e0cc9fa8cb0f416f7"
        };
        //const header = {'Authorization': `Bearer `+ token, 'Content-Type': 'application/json'};
        await supertest(app)
          .post("/api/product/create/" + "115560636549278411291")
          // .set('Content-Type','application/json')
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .field("name","Iphone 12 Pro max")
          .field("description","Iphone description")
          .field("price",130000)
          .field("stock",500)
          .field("sold",0)
          .field("category","612b813e0cc9fa8cb0f416f7")   //random hex code
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.name).toBe(data.name);
            expect(response.body.description).toBe(data.description);
            expect(response.body.price).toBe(data.price)
            expect(response.body.stock).toBe(data.stock)
            expect(response.body.sold).toBe(data.sold)
            // expect(response.body.category).toBe(data.category)
      
            // Check data in the database
            const post = await Product.findOne({ _id: response.body._id });
            expect(post).toBeTruthy();
            expect(post.name).toBe(data.name);
            expect(post.description).toBe(data.description);
            expect(post.price).toBe(data.price)
            expect(post.stock).toBe(data.stock)
            expect(post.sold).toBe(data.sold)
            // expect(post.category).toBe(data.category)
          })
      });

      test("GET /api/product/:productId", async () => {
        const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:0
        }); ///////////////////////User Request/////////////////////////
        const data = await Product.create({ 
          name: "Iphone 12 Pro max", 
          description: "Iphone description",
          price :  130000,
          stock :  500,
          sold : 0,
          category : "612b813e0cc9fa8cb0f416f7"
        });
        await supertest(app).get("/api/product/" + data._id)
          .expect(200)
          .then((response) => {
            // Check type and length
            expect(response.body._id).toBeTruthy();
            expect(response.body.name).toBe(data.name);
            expect(response.body.description).toBe(data.description);
            expect(response.body.price).toBe(data.price)
            expect(response.body.stock).toBe(data.stock)
            expect(response.body.sold).toBe(data.sold)
            // expect(response.body.category).toBe(data.category
          })
        })

      test("PUT /api/product/:productId/:userId", async () => {
        const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        }); ///////////////////////Admin Request/////////////////////////
        const product = await Product.create({ 
          name: "Iphone 12 Pro max", 
          description: "Iphone description",
          price :  130000,
          stock :  500,
          sold : 0,
          category : "612b813e0cc9fa8cb0f416f7"
        });
        const body ={
          price : 135000
        }
      // console.log("productid" + product._id )
      // console.log("userid" + user._id )
        await supertest(app).put("/api/product/" + product._id +"/"+  user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .field("price",135000)
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body.price).toBe(body.price)
          });
      });

      test("DELETE /api/product/:productId/:userId", async () => {
        const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        }); ///////////////////////Admin Request/////////////////////////
        const product = await Product.create({ 
          name: "Iphone 12 Pro max", 
          description: "Iphone description",
          price :  130000,
          stock :  500,
          sold : 0,
          category : "612b813e0cc9fa8cb0f416f7"
        });
       
        await supertest(app)
        .delete("/api/product/" + product._id +"/"+  user._id)
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async () => {
          expect(await Product.findOne({ _id: product._id })).toBeFalsy();
        });
      });
})