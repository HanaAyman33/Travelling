import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import session from 'express-session';
import { MongoClient } from 'mongodb';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.all('/search', (req, res) => {
    console.warn('Blocked all requests to /search!');
    res.status(404).send('Not Found');
});

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));//the public folder will contain all static files(images and videos)

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//To connect mongodb to our nodejs code
const uri = "mongodb://localhost:27017/"; 
const client = new MongoClient(uri);

let collection;
async function connectToDatabase() {
try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const database = client.db('myDB');
    collection = database.collection('myCollection');
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the database connection fails
}
}
await connectToDatabase();

process.on('SIGINT', async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
});

// Middleware to show search bar on relevant pages
app.use((req, res, next) => {
    const excludedPaths = ['/registration', '/login'];
    if (!excludedPaths.includes(req.path)) {
        res.locals.showSearchBar = true;
    } else {
        res.locals.showSearchBar = false;
    }
    next();
});

// Search results route
app.get('/getsearch', async (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery || searchQuery.trim() === '') {
        return res.json({ results: [] });
    }

    try {
        const regex = new RegExp(searchQuery.trim(), 'i');
        const results = await collection.find({ name: { $regex: regex } }).toArray();
        res.json({ results });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'An error occurred while searching.' });
    }
});

app.post('/getsearch', (req, res) => {
    console.warn('POST request to /getsearch detected!');
    res.status(405).send('POST method not allowed.');
});

// Example destination routes
['annapurna', 'bali', 'inca', 'paris', 'rome', 'santorini'].forEach((destination) => {
    app.get(`/${destination}`, (req, res) => {
        res.render(destination);
    });
});

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
          req.session.username = username;
  
          // Redirect the user to the home page upon successful login
          return res.redirect('/home');
      } else {
        // Send an error message if login credentials are incorrect
        return res.status(401).send('Invalid username or password');
      }
    } catch (err) {
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

// 'Want to go' update route
app.post('/wanttogo', async (req, res) => {
    const { username, destination } = req.body;

    if (!username || !destination) {
        return res.status(400).send('Invalid request.');
    }

    try {
        await collection.updateOne(
            { username },
            { $push: { wanttogo: destination } },
            { upsert: true } // Create user record if it doesn't exist
        );
        res.status(200).send('Destination added to want-to-go list.');
    } catch (error) {
        console.error('Error updating want-to-go list:', error);
        res.status(500).send('An error occurred.');
    }
});

//Want-to-go list
app.post('/search', async (req, res) => {
    const { username, password, destination } = req.body;
    
    try {
        const username = req.session.user.username;
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


  app.post('/Inca', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("Inca");

        if (existingDestination) {
            return res.status(400).send("Inca is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "Inca" } }
        );
            res.status(200).send("Inca added to your want-to-go list.")
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
    } finally {
        await client.close();
    }
});

app.post('/annapurna', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("annapurna");

        if (existingDestination) {
            return res.status(400).send("annapurna is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "annapurna" } }
        );

        res.status(200).send("annapurna added to your want-to-go list.");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
    } finally {
        await client.close();
    }
});


app.post('/bali', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("bali");

        if (existingDestination) {
            return res.status(400).send("bali is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "bali" } }
        );

        res.status(200).send("bali added to your want-to-go list.");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
    } finally {
        await client.close();
    }
});


app.post('/paris', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("paris");

        if (existingDestination) {
            return res.status(400).send("paris is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "paris" } }
        );

        res.status(200).send("paris added to your want-to-go list.");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
    } finally {
        await client.close();
    }
});


app.post('/rome', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("rome");

        if (existingDestination) {
            return res.status(400).send("rome is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "rome" } }
        );

        res.status(200).send("rome added to your want-to-go list.");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
    } finally {
        await client.close();
    }
});



app.post('/santorini', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if "Inca" already exists in the user's wanttogo list
        const existingDestination = user.wanttogo.includes("santorini");

        if (existingDestination) {
            return res.status(400).send("santorini is already in your want-to-go list.");
        }

        // Add "Inca" to the wanttogo array
        await collection.updateOne(
            { username: username },
            { $push: { wanttogo: "santorini" } }
        );

        res.status(200).send("santorini added to your want-to-go list.");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding to the list.");
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

app.get('/home',(req,res) =>{
    res.render('home'); // Passing user data
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

app.get('/wanttogo', async (req, res) => {
    const { username } = req.session;  // Access username from session

    if (!username) {
        return res.status(401).send("User not logged in.");
    }

    try {
        await client.connect();
        const db = client.db('myDB');
        const collection = db.collection('myCollection');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Pass the 'wanttogo' list to the view
        res.render('wanttogo', { destinations: user.wanttogo });

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the list.");
    } finally {
        await client.close();
    }
});

client.close();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});//we are telling the express server to receive the requests coming to the local host on port # 3000
