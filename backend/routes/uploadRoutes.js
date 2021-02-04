import path from 'path'
import express from 'express'
import asyncHandler from 'express-async-handler'
import multer from 'multer'
import pkg from 'cloudinary'

const router = express.Router()
const cloudinary = pkg

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        console.log(file)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const checkFileType = (file, cb) => {
    const fileTypes = /jpg|jpeg|png/
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimeType = fileTypes.test(file.mimetype)

    if (extName && mimeType) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})

// router.post('/', upload.single('image'), (req, res) => {
//     console.log(req.file.path)
//     res.send(`${req.file.path}`)
// })

router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
    const uploadPhoto = await cloudinary.uploader.upload(`${req.file.path}`)
    console.log(uploadPhoto)
    console.log(uploadPhoto.url)
    // res.send(`${req.file.path}`)
    res.send(uploadPhoto.url)
}))

export default router
