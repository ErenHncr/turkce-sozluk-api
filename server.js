const express = require('express');
const app = express();
const cors = require('cors');
const { tdkSearch, tdkIcerik, tdkKelimeOneri } = require('./tdk');

app.use(cors());
app.use(express.json());

app.get('/search', (req, res) => tdkSearch(req, res));
app.get('/icerik', (req, res) => tdkIcerik(req, res));
app.get('/oneri', (req, res) => tdkKelimeOneri(req, res));
app.get('/*', (req, res) => res.json('Please use /search or /icerik endpoints.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('app is running on port 3000');
});
