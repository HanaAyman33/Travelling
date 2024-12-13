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

//await client.connect();
const database = client.db('myDB'); 
const collection = database.collection('myCollection');

//trial
//const result = await collection.insertOne({username:'Hana.Ayman',password:'hanoon33',wanttogo:[]});    

//client.close();

const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="Annapurna"></div> 
      </body>
    </html>
  `);
const document = dom.window.document; 

const list = document.getElementById('wanttogo_list');

const annapurna = document.getElementById('Annapurna');//annapurna
annapurna.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Annapurna"] } 
        });
    
        if (existingDocument) {
            alert("Annapurna already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Annapurna");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Annapurna" } }
            );
          }
      
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
            client.close();
        }
});


const bali = document.getElementById('Bali');//bali
  bali.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Bali"] } 
        });
    
        if (existingDocument) {
            alert("Bali already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Bali");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Bali" } }
            );
          }
    } 
    catch (error) {
        console.error("An error occurred:", error);
    }
    finally {
        client.close();
    }
});

const inca = document.getElementById('Inca');//inca
inca.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Inca"] } 
        });
    
        if (existingDocument) {
            alert("Inca already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Inca");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Inca" } }
            );
          }
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
    finally {
        client.close();
    }
});

const paris = document.getElementById('Paris');//paris
paris.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Paris"] } 
        });
    
        if (existingDocument) {
            alert("Paris already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Paris");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Paris" } }
            );
          }
      
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
            client.close();
        }
});

const rome = document.getElementById('Rome');//rome
rome.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Rome"] } 
        });
    
        if (existingDocument) {
            alert("Rome already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Rome");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Rome" } }
            );
          }
      
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
            client.close();
        }
});

const santorini = document.getElementById('Santorini');//santorini
santorini.addEventListener('click', () => {
    try{
        client.connect();
        const usernameInput = document.getElementsByName("username")[0];
        const passwordInput = document.getElementsByName("password")[0];

        const existingDocument = collection.findOne({
        username: usernameInput.value,
        password: passwordInput.value,
        wtg: { $in: ["Santorini"] } 
        });
    
        if (existingDocument) {
            alert("Santorini already exists in your want-to-go list.");
          } 
        else {
            const text = document.createElement('div');
            text.textContent("Santorini");
            const item = document.createElement('li');
            item.append(text);
            list.append(item);
      
            collection.updateOne(
              { username: usernameInput.value, password: passwordInput.value },
              { $push: { "wtg": "Santorini" } }
            );
          }
      
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
            client.close();
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

app.listen(3000);//we are telling the express server to receive the requests coming to the local host on port # 3000
