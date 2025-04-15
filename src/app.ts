import express from 'express'
import cors from 'cors'
import path from 'path'
import articlesRouter from './routes/articles' // no change if articles.ts is still in routes/

const app = express()

app.use(cors())
app.use(express.json())

// Serve static files like audio
app.use('/audio', express.static(path.resolve('public/audio')))

// API routes
app.use('/articles', articlesRouter)

export default app
