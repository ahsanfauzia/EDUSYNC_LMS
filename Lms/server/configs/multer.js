import multer from "multer";
import path from "path";
import fs from "fs";


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const extension =
    path
      .extname(file.originalname)
      .toLowerCase();

  const mimeType =
    file.mimetype.toLowerCase();


  // ===================================================
  // COURSE THUMBNAIL
  // ===================================================

  if (
    file.fieldname === "image"
  ) {
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      allowedExtensions.includes(
        extension
      ) &&
      allowedMimeTypes.includes(
        mimeType
      )
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed for course thumbnail."
      )
    );
  }


  // ===================================================
  // COURSE NOTES / PDF
  // ===================================================

  if (
    file.fieldname === "notes"
  ) {
    const allowedExtensions = [
      ".pdf",
    ];

    const allowedMimeTypes = [
      "application/pdf",
    ];

    if (
      allowedExtensions.includes(
        extension
      ) &&
      allowedMimeTypes.includes(
        mimeType
      )
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PDF files are allowed for course notes."
      )
    );
  }


  // ===================================================
  // UNKNOWN FIELD
  // ===================================================

  return cb(
    new Error(
      "Invalid upload field."
    )
  );
};


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      100 * 1024 * 1024,
  },
});


export default upload;