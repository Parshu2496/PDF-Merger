const express = require('express')
const path = require('path')
const app = express()
const multer = require('multer')
const fs = require('fs');
const {MergePdfs} = require('./merge')

const upload = multer({dest: 'uploads/'})
app.use('/static',express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"template/index.html"))
})
app.post('/merge',upload.array('pdfs',4), async (req, res,next)=> {
  console.log(req.files)
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
        // Call MergePdfs with the array of file paths
        let d = await MergePdfs(filePaths);
        // Delete the uploaded files
  filePaths.forEach(filePath => {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting file: ${filePath}`, err);
            });
        });
  res.redirect(`http://localhost:3000/static/${d}.pdf`)
  // res.send({data: req.files})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})