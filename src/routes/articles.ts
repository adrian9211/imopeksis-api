import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const articlesDir = path.resolve('articles') // ✅ points to root-level articles folder

router.get('/', async (req, res) => {
    try {
        // Dynamically import the index.ts from the articles folder
        const indexPath = path.resolve('articles/index.ts')
        const { default: articleMap } = await import(`file://${indexPath}`)

        const articles = Object.values(articleMap).map((article: any) => ({
            title: article.title,
            slug: article.slug,
            audience: article.audience,
            keywords: article.keywords,
            content: article.content,
            audioUrl: article.audio?.src || `https://imopeksis-api.onrender.com/audio/${article.slug}.mp3`
        }))

        res.json(articles)
    } catch (err) {
        console.error("❌ Failed to load articles:", err)
        res.status(500).json({ error: "Failed to load articles" })
    }
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
