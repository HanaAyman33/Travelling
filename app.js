import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import session from 'express-session';
import { MongoClient } from 'mongodb';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 
//the public folder will contain all static files(images and videos)

//To connect mongodb to our nodejs code
const uri = "mongodb://localhost:27017/"; 
const client = new MongoClient(uri);

const database = client.db('myDB'); 
const collection = database.collection('myCollection');

//Login
app.post('/', async (req, res) => {  
  try {
    // Extract the username and password from the request body
    const { username, password } = req.body;
    await client.connect();
    // Query MongoDB for a user with the given username
    const user = await collection.findOne({ username: username });

    // Check if the user exists and if the password matches
    if (user && user.password === password) {
      // Store user session data
      
      //req.session.user = user;

      // Redirect the user to the home page upon successful login
      return res.redirect('/home');
    } else {
      // Send an error message if login credentials are incorrect
      return res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

//Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

      await client.connect();
      const db = client.db('myDB');
      const collection = db.collection('myCollection');

      if (await collection.findOne({ username })) {
          return res.status(400).send("Username already exists. Please choose another.");
      }

      await collection.insertOne({ 
          username: username, 
          password: password, 
          wanttogo: [] 
      });

      res.redirect('/');
 
      await client.close();
  
});

//Want-to-go list
app.post('/search', async (req, res) => {
    const { username, password, destination } = req.body;
    
    try {
        await client.connect();
        const user = await collection.findOne({ username: username });
  
        const existingDestination = user.wtg.includes(destination);
        
        if (existingDestination) {
            return res.status(400).json({ message: `${destination} already exists in your want-to-go list.` });
        }
  
        // Update the user's "want-to-go" list
        await collection.updateOne(
            { username: username },
            { $push: { wtg: destination } }
        );
        
        // Send success message upon successful addition
        return res.status(200).json({ message: `${destination} added to your want-to-go list.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding to the list.' });
    } finally {
        await client.close();
    }
  });

//get requests
app.get('/',function(req,res){
    res.render('login')
});

app.get('/registration',function(req,res){
    res.render('registration');
});

app.get('/annapurna',function(req,res){
    res.render('annapurna');
});

app.get('/bali',function(req,res){
    res.render('bali');
});

app.get('/cities',function(req,res){
    res.render('cities');
});

app.get('/hiking',function(req,res){
    res.render('hiking');
});

app.get('/home',function(req,res){
    res.render('home');
});

app.get('/islands',function(req,res){
    res.render('islands');
});

app.get('/inca',function(req,res){
    res.render('inca');
});

app.get('/paris',function(req,res){
    res.render('paris');
});

app.get('/registration',function(req,res){
    res.render('registration');
});

app.get('/rome',function(req,res){
    res.render('rome');
});

app.get('/santorini',function(req,res){
    res.render('santorini');
});

app.get('/searchresults',function(req,res){
    res.render('searchresults');
});

app.get('/wanttogo',function(req,res){
    res.render('wanttogo');
});

app.get('/searchresults',function(req,res){
    res.render('searchresults');
});

client.close();
app.listen(3000);//we are telling the express server to receive the requests coming to the local host on port # 3000
