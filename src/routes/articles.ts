import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()

const indexPath = path.resolve('dist/articles/index.js') // compiled JS version
const audioDir = path.resolve('public/audio')

// GET /articles
router.get('/', async (req, res) => {
    try {
        const { default: articleMap } = await import(`file://${indexPath}`)

        console.log("📦 Importing article index from:", indexPath)
        const articles = Object.values(articleMap)
            .filter((article: any) => article?.slug)
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

// GET /articles/:slug
router.get('/:slug', async (req, res) => {
    try {
        const { default: articleMap } = await import(`file://${indexPath}`)
        const article = articleMap[req.params.slug]

        if (!article) {
            return res.status(404).json({ error: "Article not found" })
        }

        res.json({
            ...article,
            audioUrl: article.audio?.src || `https://imopeksis-api.onrender.com/audio/${article.slug}.mp3`
        })
    } catch (err) {
        console.error(`❌ Error loading article "${req.params.slug}":`, err)
        res.status(500).json({ error: "Failed to load article" })
    }
})

// GET /articles/:slug/audio
router.get('/:slug/audio', (req, res) => {
    const filePath = path.resolve(`public/audio/${req.params.slug}.mp3`)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send('Audio not found')
    }
})

router.get('/debug', async (req, res) => {
    const fsPath = path.resolve('dist/articles/index.js')
    const fileUrl = `file://${fsPath}`

    console.log("📦 File path:", fsPath)

    try {
        const exists = fs.existsSync(fsPath)
        console.log("🧠 File exists:", exists)

        if (!exists) return res.status(404).json({ error: "index.js does not exist on server" })

        const mod = await import(fileUrl)
        console.log("✅ Loaded module:", Object.keys(mod))

        res.json({ status: "ok", keys: Object.keys(mod.default || {}) })
    } catch (err) {
        console.error("❌ Import failed:", err)
    }
})
export default router
