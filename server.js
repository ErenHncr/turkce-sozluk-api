const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { tdkSearch, tdkIcerik } = require('./tdk');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => tdkSearch(req, res));

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
