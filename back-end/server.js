const nodemailer = require('nodemailer');
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'usersData',
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.use(express.static('public'));

app.post('/register', (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const newUser = { firstName, lastName, phone, email, password };

  connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
    } else {
      res.status(200).json({ message: 'User registered successfully' });
      console.log('Sending email...');
      transporter.sendMail(
        {
          from: 'edutots.en@gmail.com',
          to: newUser.email,
          subject: 'Registration Successful',
          html: `
          <p>Congratulations! You have successfully registered.</p>
          <p>Start studying now by visiting our website:</p>
          <a href="https://www.google.com" style="display: inline-block; background-color: #6e93f7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Website</a>
        `,
        },
        (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        }
      );
    }
  });
});
  
  // Login route
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
      } else if (results.length === 0) {
        res.status(401).json({ error: 'Invalid email or password' });
      } else {
        const user = results[0];
        if (user.password === password) {
          const userId = results[0].id;
          res.status(200).json({ message: 'Login successful', userId: user.id });
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    });
  });

  app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
  
    const newMessage = { name, email, message };
  
    connection.query('INSERT INTO usersmessages SET ?', newMessage, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
      } else {
        res.status(200).json({ message: 'Message sent successfully' });
        console.log('Sending message...');
        transporter.sendMail(
          {
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: 'New question',
            text: `${newMessage.email}\n\n${newMessage.message}`
          },
          (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          }
        );
      }
    });
  });

  app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
  
    connection.query('SELECT * FROM users WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user information' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const user = results[0];
        res.status(200).json({ user });
      }
    });
  });

  app.post('/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
  
    connection.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user information' });
      } else {
        if (results.affectedRows > 0) {
          res.status(200).json({ message: 'User information updated successfully' });
        } else {
          res.status(500).json({ error: 'Failed to update user information' });
        }
      }
    });
  });

  app.post('/save-image/:id', (req, res) => {
    const userId = req.params.id;
    const image = req.body.image;
    console.log(userId);

    connection.query('UPDATE users SET image = ? WHERE id = ?', [image, userId], (error, result) => {
    if (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    } else {
      console.log('Image saved successfully');
      res.status(200).json({ message: 'Image saved successfully' });
    }
  });
  })

  app.post('/add-subjects/:id', (req, res) => {
    const userId = req.params.id;
    const selectedSubjects = req.body;
  
    connection.query('UPDATE users SET ? WHERE id = ?', [selectedSubjects, userId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user information' });
      } else {
        res.status(200).json({ message: 'User information updated successfully' });
      }
    });
  });

  app.get('/get-subjects/:id', (req, res) => {
    const userId = req.params.id;
  
    connection.query('SELECT subjects FROM users WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user information' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const user = results[0];
        res.status(200).json({ user });
      }
    });
  });

  app.get('/get-classes/:subject', (req, res) => {
    const subject = req.params.subject;
  
    connection.query('SELECT * FROM classes WHERE subject = ?', subject, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch classes' });
      } else {
        res.status(200).json({ classes: results });
      }
    });
  });

  app.get('/home.html', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });