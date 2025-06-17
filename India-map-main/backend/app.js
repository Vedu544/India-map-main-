import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import tagRoutes from "./routes/tagRoutes.js"
import dataRoutes from "./routes/dataRoutes.js"
import stateRoutes from "./routes/stateRoutes.js"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '50kb'  }))
app.use(express.urlencoded({extended:true, limit: '50kb'  }))

// Mount routes
app.use('/api/data', dataRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/states', stateRoutes)

app.use(express.static('public'))
app.use(cookieParser())

export {app}