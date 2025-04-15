import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const articlesDir = path.resolve('articles') // ✅ points to root-level articles folder

router.get('/', async (req, res) => {
    res.json([
        {
            title: "Intro to Imopeksis",
            slug: "intro-imopeksis",
            audience: ["Parents", "Teachers"],
            keywords: ["method", "basics"],
            content: "Imopeksis is a philosophy of training and development...",
            audioUrl: "https://imopeksis-api.onrender.com/audio/intro-imopeksis.mp3"
        }
    ])
})

router.get('/:slug/audio', (req, res) => {
    const slug = req.params.slug
    const filePath = path.resolve(`public/audio/${slug}.mp3`)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send('Audio not found')
    }
})

export default router
