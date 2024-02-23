'use strict'

import { Router } from 'express'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'
import { addProduct, listProducts, searchProduct, updateProduct, deleteProduct } from './product.controller.js'

const api = Router()

api.post('/addProduct', [validateJwt, isAdmin], addProduct)
api.put('/updateProduct/:id', [validateJwt, isAdmin], updateProduct)
api.delete('/deleteProduct/:id', [validateJwt, isAdmin], deleteProduct)
api.get('/listProducts', [validateJwt], listProducts)
api.post('/searchProduct', [validateJwt], searchProduct)

export default api
