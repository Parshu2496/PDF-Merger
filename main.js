const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { MergePdfs } = require('./merge');

const upload = multer({ dest: 'uploads/' });
app.use('/static', express.static('public')); // Serve static files from the public directory
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post('/merge', upload.array('pdfs', 4), async (req, res, next) => {
    console.log(req.files);
    const filePaths = req.files.map(file => path.join(__dirname, file.path));
    
    // Call MergePdfs with the array of file paths
    let pdfFileName = await MergePdfs(filePaths);
    
    // Assuming MergePdfs saves the merged PDF in the public directory
    const mergedPdfPath = path.join(__dirname, 'public', `${pdfFileName}.pdf`);

    // Delete the uploaded files
    filePaths.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err);
        });
    });
    
    // Send back the URL of the generated PDF
    res.json({ downloadUrl: `http://localhost:3000/static/${pdfFileName}.pdf` });
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
