import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
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
  .get('/', async (req, res) => {
    const pictures = await readFile(picturePath)
    const albums = await getAlbums()
    res.render(('index'), {albums, pictures})
  })
  .get('/foto/:id', async (req, res) => {
    const pictures= await readFile(picturePath)
    const id = req.params.id
    const picture = pictures.filter((obj) => {
      return obj["id"] === id
    })[0]
    res.render('picture', {picture})
  })
  .get('/uploaden', (req, res) => {
    res.render('upload')
  })
  .post('/uploaden', upload.single('picture'), (req, res) => {

    const path = `${req.file.path}`.replace('public', '')
    const photograph = {
      id: uuidv4(),
      path: `${path}`,
      description: req.body.description_short,
      descriptionLong: req.body.description,
      location: req.body.location,
      photographer: req.body.photographer,
      uploader: req.body.uploader,
      album: req.body.album
    }
    writeFile(photograph, picturePath)
    res.redirect('/')
  })
  .get('/albums/:album', async (req, res) => {
    const album = req.params.album
    const albums = await getAlbums()
    let pictures= await readFile(picturePath)
    pictures = pictures.filter((obj) => {
      return obj["album"] === album
    })
    res.render('index', {album, pictures, albums})
  })
  .get('/albums/:album/uploaden', (req, res) => {
    res.render('upload')
  })


// Start app
app.listen(port, () => {
  console.log('Server started at port ' + port);
});


const readFile = async (path) => {
  let data = fs.readFileSync(path, 'utf8', (err, data) => {
    if (err){
      console.log(err)
    } else {
      return data
    }
  })
  data = JSON.parse(data)
  return data
}

const writeFile = async (obj, path) => {
  let data = await readFile(path)
  data.push(obj)
  const newData = JSON.stringify(data)
  fs.writeFileSync(path, newData)
}

const getAlbums = async () => {
  const pictures = await readFile(picturePath)
  const unique = [...new Set(pictures.map(item => item.album))]
  return unique
}