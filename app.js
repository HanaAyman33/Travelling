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

app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // Session expires after 1 hour
    }
  }));  
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
        // Store user data in the session
        req.session.user = {
          id: user._id,
          username: user.username,
          wanttogo: user.wanttogo || [],
        };
      
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
app.post('/search', isAuthenticated, async (req, res) => {
    const { username, password, destination } = req.body;
    
    try {
        const username = req.session.user.username;
        await client.connect();
        const user = await collection.findOne({ username: username });
  
        const existingDestination = user.wanttogo.includes(destination);
        
        if (existingDestination) {
            return res.status(400).json({ message: `${destination} already exists in your want-to-go list.` });
        }
  
        // Update the user's "want-to-go" list
        await collection.updateOne(
            { username: username },
            { $push: { wtg: destination } }
        );

         // Update the session data
        req.session.user.wanttogo.push(destination);
        
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

//To protect routes and ensure only logged-in users can access them
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/');
  }
  
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

app.get('/home',isAuthenticated,(req,res) =>{
    const user = req.session.user;
    res.render('home',{ user }); // Passing user data
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
    res.render('wanttogo', { wanttogo: req.session.user.wanttogo });
    // res.render('wanttogo');
});

app.get('/searchresults',function(req,res){
    res.render('searchresults');
});

client.close();
app.listen(3000);//we are telling the express server to receive the requests coming to the local host on port # 3000
