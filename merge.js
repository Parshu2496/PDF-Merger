import PDFMerger from 'pdf-merger-js';
import fs from 'fs';
var merger = new PDFMerger();

export const MergePdfs = async (filePaths) => {
  // await merger.add(p1);  //merge all pages. parameter is the path to file and filename.
  // await merger.add(p2);  //merge all pages. parameter is the path to file and filename.
  const merger = new PDFMerger();
    for (const filePath of filePaths) {
        await merger.add(filePath); // Merge all pages from each file
    }

  let d  = new Date().getTime()
  await merger.save(`public/${d}.pdf`); //save under given name and reset the internal document
  return d;
};
