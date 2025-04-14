import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const articlesDir = path.resolve('articles') // ✅ points to root-level articles folder
const audioDir = path.resolve('public/audio')

router.get('/', async (req, res) => {
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.ts'))

    const articles = await Promise.all(
        files.map(async (file) => {
            try {
                // Use file:// URL scheme for dynamic import in ESM
                const filePath = path.resolve(articlesDir, file)
                const { default: article } = await import(`file://${filePath}`)

                return {
                    title: article.title,
                    slug: article.slug,
                    audience: article.audience,
                    keywords: article.keywords,
                    content: article.content,
                    audioUrl: article.audioUrl || null
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`❌ Failed to load article "${file}":`, err.message)
                } else {
                    console.error(`❌ Failed to load article "${file}":`, err)
                }
                return null
            }
        })
    )

    // Filter out failed/null results
    res.json(articles.filter(Boolean))
})

router.get('/:slug/audio', (req, res) => {
    const slug = req.params.slug
    const filePath = path.resolve(audioDir, `${slug}.mp3`)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send('Audio not found')
    }
})
export default router





