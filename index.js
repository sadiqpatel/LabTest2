
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('Warehouse.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

  
  app.get("/index.js", (req, res) => {
    res.set("Content-Type", "text/javascript");
    res.sendFile(__dirname + "/index.js");
    });

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
  
    app.get("/style.css", (req, res) => {
      res.set("Content-Type", "text/css");
      res.sendFile(__dirname + "/style.css");
    });
  


    app.post('/findpart', (req, res) => {
      const partNumber = req.body.partNumber;
      const query = `
        SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
        FROM PartNumber
        JOIN Bin ON PartNumber.BinID = Bin.BinID
        JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
        WHERE PartNumber.PartNumbers = ?
      `;
      db.get(query, [partNumber], (err, row) => {
        if (err) {
          console.error(err.message);
        }
        res.send(`
    
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Find Part Number</title>
        <link rel="stylesheet" type="text/css" href="/style.css">
      </head>
        <body>
        <section id="results">
        <h2>Results:</h2>
        <p>Shelf Number: <span id="shelf-number"> ${row.ShelfLocation}</span></p>
        <p>Bin Number: <span id="bin-number">${row.BinID}</span></p>
        <p>Quantity: <span id="quantity">${row['COUNT(PartNumber.PartNumberID)']}</span></p>
      </section>
       
        </body>
      </html>
        `);
      });
    });
    
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
