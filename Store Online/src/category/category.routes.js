'use strict'

import express from 'express'
import { addCategory, deleteCategory, updateCategory, viewCategories } from './category.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addCategory', [validateJwt, isAdmin], addCategory)
api.put('/updateCategory/:id', [validateJwt, isAdmin], updateCategory)
api.get('/viewCategories', [validateJwt], viewCategories)
api.delete('/deleteCategory/:id', [validateJwt, isAdmin], deleteCategory)

export default api