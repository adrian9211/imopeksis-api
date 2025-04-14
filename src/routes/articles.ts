import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const router = Router()
const articlesDir = path.resolve('articles') // Root-level "articles" folder
const audioDir = path.resolve('public/audio')

router.get('/', async (req, res) => {
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.ts'))

    const articles = await Promise.all(
        files.map(async (file) => {
            try {
                const filePath = path.resolve(articlesDir, file)
                const moduleUrl = pathToFileURL(filePath).href
                const { default: article } = await import(moduleUrl)

                const slug = article.slug || file.replace(/\.ts$/, '')
                const audioFile = `${slug}.mp3`
                const audioExists = fs.existsSync(path.join(audioDir, audioFile))

                return {
                    title: article.title,
                    slug,
                    audience: article.audience,
                    keywords: article.keywords,
                    content: article.content,
                    audioUrl: audioExists ? `/audio/${audioFile}` : null,
                }
            } catch (err) {
                console.error(`❌ Failed to load article "${file}":`, err instanceof Error ? err.message : err)
                return null
            }
        })
    )

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
