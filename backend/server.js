const express = require("express")
const cors = require("cors")
const pool = require("./config/db")
const authRoutes = require("./routes/authRoutes")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/", authRoutes)

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error")
  }
})

app.post("/trendinglist", async (req, res) => {
  try {
    const {
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      category,
    } = req.body

    // ✅ Validation (important)
    if (!id || !title) {
      return res.status(400).json({
        error: "id and title are required",
      })
    }

    const result = await pool.query(
      `INSERT INTO trending_list (id, title, overview, poster_path, backdrop_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, title, overview, poster_path, backdrop_path]
    )

    res.status(201).json({
      message: "Movie added successfully",
      data: result.rows[0],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

app.get("/trendinglist", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trending_list")

    const formatted = result.rows.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }))

    res.json({
      results: formatted,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

app.post("/originallist", async (req, res) => {
  try {
    const {
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      category,
    } = req.body

    // ✅ Validation (important)
    if (!id || !title) {
      return res.status(400).json({
        error: "id and title are required",
      })
    }

    const result = await pool.query(
      `INSERT INTO original_list (id, title, overview, poster_path, backdrop_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, title, overview, poster_path, backdrop_path]
    )

    res.status(201).json({
      message: "Movie added successfully",
      data: result.rows[0],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

app.get("/originallist", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM original_list")

    const formatted = result.rows.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }))

    res.json({
      results: formatted,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

app.post("/popularlist", async (req, res) => {
  try {
    const {
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      category,
    } = req.body

    // ✅ Validation (important)
    if (!id || !title) {
      return res.status(400).json({
        error: "id and title are required",
      })
    }

    const result = await pool.query(
      `INSERT INTO popular_list (id, title, overview, poster_path, backdrop_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, title, overview, poster_path, backdrop_path]
    )

    res.status(201).json({
      message: "Movie added successfully",
      data: result.rows[0],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

app.get("/popularlist", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM popular_list")

    const formatted = result.rows.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
    }))

    res.json({
      results: formatted,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
})

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀")
})

// ✅ Get All Movies
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies")
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

// ✅ Get Movie by ID
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [id]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

// ✅ Add Movie (optional)
app.post("/movies", async (req, res) => {
  const { title, poster_path, rating } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO movies (title, poster_path, rating) VALUES ($1, $2, $3) RETURNING *",
      [title, poster_path, rating]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send("Error adding movie")
  }
})

// 🚀 Start Server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})