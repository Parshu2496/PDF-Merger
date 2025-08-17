const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { MergePdfs } = require('./merge');

const upload = multer({ dest: 'uploads/' });
app.use('/static', express.static('public'));
const port = process.env.PORT || 3000;

// In-memory storage for merged PDFs
const pdfStore = new Map();

// Get the correct domain (localhost for dev, Render URL for production)
const getPublicUrl = (filename) => {
  if (process.env.NODE_ENV === 'production') {
    return `https://your-render-app-name.onrender.com/download/${filename}`;
  }
  return `http://localhost:${port}/download/${filename}`;
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post('/merge', upload.array('pdfs', 4), async (req, res) => {
  console.log(req.files);
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  
  // Merge PDFs and get the buffer
  const mergedPdfBuffer = await MergePdfs(filePaths);

  // Generate a unique ID for this merge
  const mergeId = Date.now().toString();

  // Store the merged PDF in memory
  pdfStore.set(mergeId, mergedPdfBuffer);

  // Clean up uploaded files
  filePaths.forEach(filePath => {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
    });
  });

  // Send the correct download URL
  res.json({ downloadUrl: getPublicUrl(mergeId) });
});

// Endpoint to download the merged PDF
app.get('/download/:id', (req, res) => {
  const pdfBuffer = pdfStore.get(req.params.id);
  if (!pdfBuffer) {
    return res.status(404).send('PDF not found');
  }
  
  // Set appropriate headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
  res.send(pdfBuffer);
  
  // Optionally remove from store after download
  pdfStore.delete(req.params.id);
});

app.listen(port, () => {
  console.log(`PDF Merger running on port ${port}`);
});
