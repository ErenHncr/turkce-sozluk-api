const express = require('express');
const app = express();
const cors = require('cors');
const { tdkSearch, tdkIcerik } = require('./tdk');

app.use(cors());

app.get('/search', (req, res) => tdkSearch(req, res));
app.get('/icerik', (req, res) => tdkIcerik(req, res));
app.get('/*', (req, res) => res.json('Please use /search or /icerik endpoints.'));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
