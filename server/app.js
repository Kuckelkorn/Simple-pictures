import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

let port = process.env.PORT || 5555


const app = express()


//Initialise app
app
  .use(express.static('public'))
  .set('view engine', 'pug')
  .set('views', './server/views')
  .use(bodyParser.urlencoded({ extended: true }))


// Routes
app
  .get('/', (req, res) => {
    res.render('index')
  })
  .get('/foto/:id', (req, res) => {
    // const id = req.params.id
    res.render('picture')
  })
  .get('/uploaden', (req, res) => {
    res.render('upload')
  })
  .post('/uploaden', (req, res) => {

  })
  .get('/albums/:album', (req, res) => {
    const album = req.params.album
    res.render('index', {album})
  })
  .get('/albums/:album/uploaden', (req, res) => {
    res.render('upload')
  })


// Start app
app.listen(port, () => {
  console.log('Server started at port ' + port);
});