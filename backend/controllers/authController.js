const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { createUser, getUserByUsername } = require("../models/userModel")

const register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password required",
      })
    }

    const existingUser = await getUserByUsername(username)

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser(username, hashedPassword)

    res.status(201).json({
      message: "User registered successfully",
      user,
    })
  } catch (err) {
    res.status(500).json({ error: "Server Error" })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: "Server Error" })
  }
}

module.exports = { register, login }