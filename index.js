//crud using mongodb
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const app = express();

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log('Could not connect');

  const db = client.db('raina-db');
  const quotesCollection = db.collection('quotes');

  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // app.get('/', (req, res) => {
  //   res.sendFile(__dirname + '/index.html');
  // });

  app.post('/quotes', (req, result) => {
    quotesCollection
      .insertOne(req.body)
      .then((res) => {
        result.redirect('/');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/', (req, res) => {
    quotesCollection
      .find()
      .toArray()
      .then((result) => {
        res.render('index.ejs', { quotes: result });
      })
      .catch((err) => {});
  });

  app.put('/quotes', (req, res) => {
    quotesCollection
      .findOneAndUpdate(
        { name: 'api' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        { upsert: true }
      )
      .then((result) => {})
      .catch((err) => {});
  });

  app.delete('/quotes', (req, res) => {
    quotesCollection
      .deleteOne({ name: '' })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete');
        }
        res.json(`Deleted Darth Vadar's quote`);
      })
      .catch((err) => {});
  });

  app.listen('3000', () => {
    console.log('listening on  localhost:3000');
  });
});
