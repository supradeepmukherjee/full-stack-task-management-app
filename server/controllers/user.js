import { compare } from "bcrypt"
import { tryCatch } from "../middlewares/error.js"
import { User } from "../models/User.js"
import { ErrorHandler } from '../util.js'
import jwt from 'jsonwebtoken'

const register = tryCatch(async (req, res, next) => {
    const { username, password } = req.body
    const userExists = await User.findOne({ username })
    if (userExists) return next(new ErrorHandler(400, 'A user with the same username already exists'))
    const user = await User.create({ username, password })
    res.status(201).json({ success: true, user, msg: 'User Registration Successful' })
})

const login = tryCatch(async (req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')
    if (!user) return next(new ErrorHandler(400, 'Password or username is incorrect'))
    const isMatch = await compare(password, user.password)
    if (!isMatch) return next(new ErrorHandler(400, 'Password or username is incorrect'))
    user.password = undefined
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res
        .status(200)
        .cookie('user', token, {
            maxAge: 60 * 60 * 24 * 15000,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        .json({ success: true, msg: 'Logged in Successfully', user })
})

const getUserDetails = tryCatch(async (req, res, next) => {
    const user = await User.findById(req.user)
    if (!user) return next(new ErrorHandler(404, 'User not found'))
    res.status(200).json({ success: true, user })
})

export { register, login, getUserDetails }