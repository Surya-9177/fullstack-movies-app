const pool = require("./config/db")
const movies = require("./data/trending.json")
const originals = require("./data/original.json")
const popular = require("./data/popular.json")

const seedPopular = async () => {
  try {
    for (let movie of popular) {
      await pool.query(
        `INSERT INTO popular_list (id, title, overview, poster_path, backdrop_path)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [
          movie.id,
          movie.title,
          movie.overview,
          movie.poster_path,
          movie.backdrop_path,
        ]
      )
    }

    console.log("✅ Popular seeded")
  } catch (err) {
    console.error(err)
  }
}

const seedTrending = async () => {
  for (let movie of movies) {
    await pool.query(
      `INSERT INTO trending_list (id, title, overview, poster_path, backdrop_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
      ]
    )
  }
  console.log("✅ Trending seeded")
}

const seedOriginals = async () => {
  for (let movie of originals) {
    await pool.query(
      `INSERT INTO original_list (id, title, overview, poster_path, backdrop_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
      ]
    )
  }
  console.log("✅ Originals seeded")
}

const seedAll = async () => {
  try {
    await seedTrending()
    await seedOriginals()
    await seedPopular()

    console.log("🔥 All data seeded successfully")
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

seedAll()