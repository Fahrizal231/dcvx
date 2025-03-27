const express = require("express")
const chalk = require("chalk")
const fs = require("fs")
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")

const app = express()
const PORT = process.env.PORT || 4000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for simplicity, enable in production with proper config
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    error: "Too many requests, please try again later.",
  },
})

// Apply rate limiting to API routes
app.use("/ai", limiter)
app.use("/search", limiter)

app.enable("trust proxy")
app.set("json spaces", 2)

// Logging middleware
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use("/", express.static(path.join(__dirname, "api-page")))
app.use("/src", express.static(path.join(__dirname, "src")))

const settingsPath = path.join(__dirname, "./src/settings.json")
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))

// Response middleware
app.use((req, res, next) => {
  const originalJson = res.json
  res.json = function (data) {
    if (data && typeof data === "object") {
      const responseData = {
        status: data.status !== undefined ? data.status : true,
        creator: settings.apiSettings.creator || "Created Using Rynn UI",
        timestamp: new Date().toISOString(),
        ...data,
      }
      return originalJson.call(this, responseData)
    }
    return originalJson.call(this, data)
  }
  next()
})

// API Routes
let totalRoutes = 0
const apiFolder = path.join(__dirname, "./src/api")

// Function to load routes recursively
function loadRoutesRecursively(folderPath, basePath = "") {
  fs.readdirSync(folderPath).forEach((item) => {
    const itemPath = path.join(folderPath, item)
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      // Recursively load routes from subdirectories
      loadRoutesRecursively(itemPath, path.join(basePath, item))
    } else if (stats.isFile() && path.extname(item) === ".js") {
      try {
        require(itemPath)(app)
        totalRoutes++
        console.log(
          chalk
            .bgHex("#FFFF99")
            .hex("#333")
            .bold(` Loaded Route: ${path.join(basePath, item)} `),
        )
      } catch (error) {
        console.error(
          chalk
            .bgHex("#FF6961")
            .hex("#FFF")
            .bold(` Error loading route: ${path.join(basePath, item)} `),
        )
        console.error(error)
      }
    }
  })
}

// Load all routes
if (fs.existsSync(apiFolder)) {
  loadRoutesRecursively(apiFolder)
  console.log(chalk.bgHex("#90EE90").hex("#333").bold(" Load Complete! ✓ "))
  console.log(chalk.bgHex("#90EE90").hex("#333").bold(` Total Routes Loaded: ${totalRoutes} `))
} else {
  console.warn(chalk.bgHex("#FFD700").hex("#333").bold(" Warning: API folder not found! "))
}

// Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "index.html"))
})

// 404 handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "api-page", "404.html"))
})

// Error handler
app.use((err, req, res, next) => {
  console.error(chalk.red("Error:"), err.stack)
  res.status(500).sendFile(path.join(__dirname, "api-page", "500.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(chalk.bgHex("#90EE90").hex("#333").bold(` Server is running on port ${PORT} `))
  console.log(chalk.cyan(`Local:            http://localhost:${PORT}`))
  console.log(chalk.cyan(`On Your Network:  http://${getLocalIp()}:${PORT}`))
})

// Helper function to get local IP
function getLocalIp() {
  const { networkInterfaces } = require("os")
  const nets = networkInterfaces()

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address
      }
    }
  }
  return "0.0.0.0"
}

module.exports = app

