const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { MergePdfs } = require('./merge');

const upload = multer({ dest: 'uploads/' });
app.use('/static', express.static('public'));
const port = process.env.PORT || 3000;

// Get the correct domain (localhost for dev, Render URL for production)
const getPublicUrl = (filename) => {
  if (process.env.NODE_ENV === 'production') {
    // If hosted on Render
    return `https://your-render-app-name.onrender.com/static/${filename}.pdf`;
  }
  // For local development
  return `http://localhost:${port}/static/${filename}.pdf`;
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post('/merge', upload.array('pdfs', 4), async (req, res, next) => {
  console.log(req.files);
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  
  // Merge PDFs and save to /public
  let mergedFileId = await MergePdfs(filePaths);

  // Delete the uploaded files (optional cleanup)
  filePaths.forEach(filePath => {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
    });
  });

  // Send the correct public download URL
  res.json({ downloadUrl: getPublicUrl(mergedFileId) });
});

app.listen(port, () => {
  console.log(`PDF Merger running on port ${port}`);
});
