'use strict'

import { Router } from 'express'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'
import { addCategory, updateCategory, deleteCategory, searchCategory, listCategories } from './category.controller.js'

const api = Router()

api.post('/addCategory', [validateJwt, isAdmin], addCategory)
api.put('/updateCategory/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/deleteCategory/:id', [validateJwt, isAdmin], deleteCategory)
api.get('/listCategories', [validateJwt], listCategories)
api.post('/searchCategory', [validateJwt], searchCategory)

export default api
