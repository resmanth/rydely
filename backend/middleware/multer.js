// =============================================================
// middleware/multer.js — File upload middleware.
// Multer handles multipart/form-data (file uploads) in Express.
// We use the default disk storage so uploaded files are saved to
// a temporary location on disk. The controllers then read the
// file, upload it to ImageKit, and delete the temp file.
// =============================================================

import multer from "multer";

// --- Configure Multer with Default Disk Storage ---
// multer.diskStorage({}) uses the OS default temp directory.
// The uploaded file is available at req.file in the controller.
const upload = multer({
    storage: multer.diskStorage({})
});

export default upload;
