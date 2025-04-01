const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
    if (file.mimetype === 'application/pdf') {
        next(null, true);
    } else {
        next(new Error('Type de fichier non autorisé. Seuls les fichiers PDF sont acceptés.'), false);
    }
};

const limits = {
    fileSize: 2 * 1024 * 1024, 
    files: 1,
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
});

module.exports = upload;
