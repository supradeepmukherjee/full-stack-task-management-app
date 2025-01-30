import { body, param, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { ErrorHandler } from '../util.js'

const validateHandler = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) next()
    else next(new ErrorHandler(400, errors.array().map(({ msg }) => msg).join(', ')))
}

const userValidator = () => [
    body('username', 'Please Enter Username').notEmpty(),
    body('password', 'Please Enter Password').isLength({ min: 8 }),
]

const menuItemValidator = () => [
    body('name', 'Please Enter Name').notEmpty(),
    body('price', 'Please Enter Price').isInt({ min: 1 }),
    body('availability', 'Please Enter Availability').isBoolean({ strict: true })
]

const menuItemIDValidator = () => [param('id', 'Please Enter Menu Item ID').notEmpty().custom(val => {
    if (!mongoose.Types.ObjectId.isValid(val)) return false
    return true
}).withMessage('Invalid Item ID')]

const orderValidator = () => [
    // body('userId', 'Please Enter User ID').notEmpty().custom(val => {
    //     if (!mongoose.Types.ObjectId.isValid(val)) return false
    //     return true
    // }).withMessage('Invalid User ID'),
    body('items').isArray({ min: 1 }).withMessage('There must be atleast 1 item'),
    body('items.*.itemId').custom(val => {
        if (!mongoose.Types.ObjectId.isValid(val)) return false
        return true
    }).withMessage('Invalid Item ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity of each item must be at least 1'),
    // body('status').isIn(['Pending', 'Completed']).withMessage('Invalid Status of Order')
]

const userIDValidator = () => [param('id', 'Please Enter User ID').notEmpty().custom(val => {
    if (!mongoose.Types.ObjectId.isValid(val)) return false
    return true
}).withMessage('Invalid User ID')]

export { userValidator, menuItemIDValidator, menuItemValidator, orderValidator, validateHandler, userIDValidator }
