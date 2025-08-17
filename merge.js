import PDFMerger from 'pdf-merger-js';

export const MergePdfs = async (filePaths) => {
    const merger = new PDFMerger();
    
    // Loop through each file path and add it to the merger
    for (const filePath of filePaths) {
        await merger.add(filePath); // Merge all pages from each file
    }

    // Return the merged PDF as a buffer
    const mergedPdfBuffer = await merger.saveAsBuffer();
    return mergedPdfBuffer; // Return the buffer instead of saving to disk
};
