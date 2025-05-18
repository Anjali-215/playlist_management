
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');

// const Admin = require("./modals/admin.js");
// const User = require("./modals/user.js");
// const playlistRoutes = require('./routes/playlistRoutes');
// // Create a model for the contact form
// // const Contact = require('./models/contact.js');  // Make sure the path is correct
// const Contact = require('./modals/contact.js');  // Make sure the path is correct


// mongoose.connect('mongodb://localhost:27017/onemusic');

// const app = express();
// app.use(express.json());
// let PORT = 4000;
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

// app.use('/', playlistRoutes);
// //user login
// app.post('/login', (req, res) => {
//     console.log(req.body)
//     console.log(req.query)
//     login(req, res)
// })

// //admin login
// app.post('/loginadmin', (req, res) => {
//     console.log(req.body)
//     console.log(req.query)
//     loginadmin(req, res)
// })

// //user sign
// app.post('/signup', async (req, res) => {
//     console.log(req.body)
//     if (await User.findOne({ "email": req.body.email })) return res.send({ "status": 404, "data": "User already exist" })
//     console.log(req.body)
//     res.send({ "status": 200, "data": "User created Sus" })
//     User.create(req.body);
// })

// //Admin sign
// app.post('/signupadmin', (req, res) => {
//     console.log(req.body)
//     console.log(req.body)
//     res.send({ "status": 200, "data": "User created Sus" })
//     Admin.create(req.body);
// })

// //user
// async function login(req, res) {
//     var data = await User.findOne(req.body);
//     data = data || 0;
//     if (data != 0) {
//         data.password = '';
//         res.send({ "status": 200, "data": "valid user", "user": data })
//     }
//     else {
//         res.send({ "status": 404, "data": "invalid user" })
//     }
// }

// async function loginadmin(req, res) {
//     var data = await Admin.findOne(req.body);
//     data = data || 0;
//     if (data != 0) {
//         data.password = '';
//         res.send({ "status": 200, "data": "valid user", "user": data })
//     }
//     else (
//         res.send({ "status": 404, "data": "invalid user" })
//     )
// }

// app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}/`));

// // Route to handle POST requests to store form data
// app.post('/contact', async (req, res) => {
//     const { name, email, subject, message } = req.body;
  
//     // Create a new Contact document
//     const newContact = new Contact({ name, email, subject, message });
  
//     try {
//       // Save the document to the database
//       await newContact.save();
//       res.send('Data saved successfully!');
//     } catch (err) {
//       console.error('Error saving data:', err);
//       res.status(500).send('Error saving data');
//     }
//   });
  

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import models
const Admin = require("./modals/admin.js");
const User = require("./modals/user.js");
const playlistRoutes = require('./routes/playlistRoutes');
const Contact = require('./modals/contact.js');  // Ensure this path is correct

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/onemusic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create an Express app
const app = express();

// Middleware to parse incoming request bodies
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS Middleware to allow cross-origin requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Use routes from playlistRoutes
app.use('/', playlistRoutes);

// User and Admin login routes
app.post('/login', (req, res) => {
    console.log(req.body);
    console.log(req.query);
    login(req, res);
});

app.post('/loginadmin', (req, res) => {
    console.log(req.body);
    console.log(req.query);
    loginadmin(req, res);
});

// User signup route
app.post('/signup', async (req, res) => {
    console.log(req.body);
    if (await User.findOne({ "email": req.body.email })) {
        return res.send({ "status": 404, "data": "User already exists" });
    }
    console.log(req.body);
    res.send({ "status": 200, "data": "User created successfully" });
    User.create(req.body);
});

// Admin signup route
app.post('/signupadmin', (req, res) => {
    console.log(req.body);
    res.send({ "status": 200, "data": "Admin created successfully" });
    Admin.create(req.body);
});

// Login function for users
async function login(req, res) {
    var data = await User.findOne(req.body);
    data = data || 0;
    if (data !== 0) {
        data.password = '';  // Don't send the password back
        res.send({ "status": 200, "data": "Valid user", "user": data });
    } else {
        res.send({ "status": 404, "data": "Invalid user" });
    }
}

// Login function for admins
async function loginadmin(req, res) {
    var data = await Admin.findOne(req.body);
    data = data || 0;
    if (data !== 0) {
        data.password = '';  // Don't send the password back
        res.send({ "status": 200, "data": "Valid admin", "user": data });
    } else {
        res.send({ "status": 404, "data": "Invalid admin" });
    }
}

// Route to handle contact form data submission
app.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a new Contact document
    const newContact = new Contact({ name, email, subject, message });

    try {
        // Save the contact form data to the database
        await newContact.save();
        res.send('Data saved successfully!');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data');
    }
});

// Start the server on port 4000
let PORT = 4000;
app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}/`));


