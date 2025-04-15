import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const indexPath = path.resolve('articles/index.ts')
const audioDir = path.resolve('public/audio')

// GET /articles - List all articles
router.get('/', async (req, res) => {
    try {
        const { default: articleMap } = await import(`file://${indexPath}`)

        const articles = Object.values(articleMap)
            .filter((article: any) => article && article.slug)
            .map((article: any) => ({
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

// GET /articles/:slug - Get a single article by slug
router.get('/:slug', async (req, res) => {
    try {
        const { default: articleMap } = await import(`file://${indexPath}`)
        const slug = req.params.slug
        const article = articleMap[slug]

        if (!article) {
            return res.status(404).json({ error: "Article not found" })
        }

        res.json({
            ...article,
            audioUrl: article.audio?.src || `https://imopeksis-api.onrender.com/audio/${slug}.mp3`
        })
    } catch (err) {
        console.error(`❌ Error loading article "${req.params.slug}":`, err)
        res.status(500).json({ error: "Failed to load article" })
    }
})

// GET /articles/:slug/audio - Serve article audio file
router.get('/:slug/audio', (req, res) => {
    const slug = req.params.slug
    const filePath = path.join(audioDir, `${slug}.mp3`)

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send('Audio not found')
    }
})

export default router
