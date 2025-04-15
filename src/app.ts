import express from 'express'
import cors from 'cors'
import path from 'path'
import articlesRouter from './routes/articles.js'

const app = express()

app.use(cors())
app.use(express.json())

// Serve static files like audio
app.use('/audio', express.static(path.resolve('public/audio')))

// API routes
app.use('/articles', articlesRouter)

export default app
