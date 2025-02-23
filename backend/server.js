require('dotenv').config()


const express = require('express');
const aiRoutes = require('./src/routes/ai.routes')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
  }));


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist"))); // ✅ Change build → dist

  // Serve React app for non-API requests
  app.get("*", (req, res) => {
    if (!req.originalUrl.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "../client/dist/index.html")); // ✅ Change build → dist
    }
  });
}

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})