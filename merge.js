import PDFMerger from 'pdf-merger-js';
import fs from 'fs';
import path from 'path';

const merger = new PDFMerger();

export const MergePdfs = async (filePaths) => {
    // Create a new instance of PDFMerger
    const merger = new PDFMerger();
    
    // Loop through each file path and add it to the merger
    for (const filePath of filePaths) {
        await merger.add(filePath); // Merge all pages from each file
    }

    // Generate a unique filename using the current timestamp
    let timestamp = new Date().getTime();
    const outputFilePath = path.join('public', `${timestamp}.pdf`); // Save in the public directory

    // Save the merged PDF to the specified path
    await merger.save(outputFilePath); // Save under the given name and reset the internal document
    
    return timestamp; // Return the timestamp to use in the download URL
};
