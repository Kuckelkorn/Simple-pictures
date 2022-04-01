import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'
import 'dotenv/config'

let port = process.env.PORT || 5555


const app = express()
const picturePath = 'public/pictures.json'
const storage = multer.diskStorage({
  destination: 'public/pictures/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})



const upload = multer({ storage: storage })



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
    const id = req.params.id
    res.render('picture')
  })
  .get('/uploaden', (req, res) => {
    res.render('upload')
  })
  .post('/uploaden', upload.single('picture'), (req, res) => {
    const photograph = {
      id: 3,
      path: `/${req.file.path}`,
      description: req.body.description_short,
      descriptionLong: req.body.description,
      location: req.body.location,
      photographer: req.body.photographer,
      uploader: req.body.uploader,
      album: req.body.album
    }
    const photographJSON = JSON.stringify(photograph)
    readWrite(photographJSON, picturePath)
    res.redirect('/')
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


const readWrite = (obj, path) => {
  const oldData = fs.readFile(path, (err, data) => {
    if (err){
      console.log(err)
    } else {
      return JSON.parse(data)
    } 
  })
  console.log(oldData)
  // const data =  JSON.parse(oldData)
  // console.log(data)

  // const newData = oldData.push(obj)
  // fs.writeFile(path, newData, (err) => {
  //   if (err){
  //     console.log(err)
  //   }
  // })
}
