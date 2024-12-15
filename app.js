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

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// To connect MongoDB to our Node.js code
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const database = client.db('myDB');
const collection = database.collection('myCollection');

// Login
app.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        await client.connect();
        const user = await collection.findOne({ username: username });

        if (user && user.password === password) {
            // Store username in session
            req.session.username = username;

            // Redirect the user to the home page upon successful login
            return res.redirect('/home');
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

// Registration
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

// Want-to-go list
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

        res.status(200).send("Inca added to your want-to-go list.");

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










// Get requests
app.get('/', function(req, res) {
    res.render('login');
});

app.get('/registration', function(req, res) {
    res.render('registration');
});

app.get('/annapurna', function(req, res) {
    res.render('annapurna');
});

app.get('/bali', function(req, res) {
    res.render('bali');
});

app.get('/cities', function(req, res) {
    res.render('cities');
});

app.get('/hiking', function(req, res) {
    res.render('hiking');
});

app.get('/home', function(req, res) {
    res.render('home');
});

app.get('/islands', function(req, res) {
    res.render('islands');
});

app.get('/inca', function(req, res) {
    res.render('inca');
});

app.get('/paris', function(req, res) {
    res.render('paris');
});

app.get('/registration', function(req, res) {
    res.render('registration');
});

app.get('/rome', function(req, res) {
    res.render('rome');
});

app.get('/santorini', function(req, res) {
    res.render('santorini');
});

app.get('/searchresults', function(req, res) {
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


app.get('/searchresults', function(req, res) {
    res.render('searchresults');
});

client.close();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});