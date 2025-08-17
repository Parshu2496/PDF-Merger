const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { MergePdfs } = require('./merge');

const upload = multer({ dest: 'uploads/' });
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post('/merge', upload.array('pdfs', 4), async (req, res) => {
  console.log(req.files);
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  
  // Call MergePdfs with the array of file paths
  const mergedPdfBuffer = await MergePdfs(filePaths);

  // Delete the uploaded files
  filePaths.forEach(filePath => {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
    });
  });

  // Set the appropriate headers to prompt the browser to open the PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=merged.pdf');
  res.send(mergedPdfBuffer); // Send the merged PDF buffer as the response
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
