import express from 'express'
import articlesRouter from './routes/articles.js'
import path from 'path'
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// Serve static audio
app.use('/audio', express.static(path.resolve('public/audio')))

// Routes
app.use('/articles', articlesRouter)

export default app
