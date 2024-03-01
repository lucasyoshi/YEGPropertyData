const jwt = require("jsonwebtoken");
var sql = require("mssql");
var bcrypt = require('bcrypt');
var express = require("express");
var router = express.Router();

const addUser = async (username, password) => {
  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Now, store the username and hashedPassword in the database
  // The exact code for this will depend on what kind of database you're using and how it's set up
  const pool = await sql.connect(config);
  await pool.request()
    .input('username', sql.NVarChar, username)
    .input('password', sql.NVarChar, hashedPassword)
    .query('INSERT INTO lhashimoto2Users (username, password) VALUES (@username, @password)');
};

// Create a configuration object
const config = {
  user: "user2015",
  password: "Password2015",
  server: "localhost", // You can use a domain name or IP address
  database: "DMIT2015CourseDB",
  options: {
    encrypt: true,
    trustServerCertificate: true, // Use this if you're on Windows Azure
  },
};

// const getUser = async (username) => {
//   return { userId: 123, password: "Password!123", username };
// };

const getUser = async (username) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('username', sql.NVarChar, username)
    .query('SELECT * FROM lhashimoto2Users WHERE username = @username');

  return result.recordset[0];
};


router.post('/enter', async (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Find the user in the database
  // TODO: Replace this with a call to the database
  const user = await getUser(username);

  if (!user) {
    return res.status(403).json({ error: "Invalid username or password" });
  }
  // Check if the provided password matches the one in the database
  // Use bcrypt to compare the hashed password in the database with the one provided by the user
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(403).json({ error: "Invalid username or password" });
  }

  // Remove the password from the user object
  delete user.password;

  // If the password is valid, create a JWT token containing the user ID
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ message: "Login successful", user, token });
}
);

router.post('/register', async (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Find the user in the database
  const user = await getUser(username);

  if (user) {
    return res.status(403).json({ error: "Username already exists" });
  }
  // Add the user to the database
  await addUser(username, password);

  res.status(200).json({ message: "User added successfully" });
});
module.exports = router;
