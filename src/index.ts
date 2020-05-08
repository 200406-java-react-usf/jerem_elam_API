const express = require('express')
const app = express()
const port = 8080

app.use('/', express.json());

app.get('/', (req, res) => res.send('HELLO WEEB WORLD'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))