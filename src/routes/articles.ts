import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const articlesDir = path.resolve('./articles')

router.get('/', async (req, res) => {
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.ts'))

    const articles = await Promise.all(
        files.map(async (file) => {
            const { default: article } = await import(`../../articles/${file}`)
            return {
                title: article.title,
                slug: article.slug,
                audience: article.audience,
                keywords: article.keywords,
                content: article.content,
                audioUrl: article.audioUrl || null
            }
        })
    )

    res.json(articles)
})

router.get('/:slug/audio', (req, res) => {
    const slug = req.params.slug
    const filePath = path.resolve(`public/audio/${slug}.mp3`)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send("Audio not found")
    }
})

export default router
