'use strict'

import express from 'express'
import { buyProducts } from './shopping.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addCart', [validateJwt], buyProducts)

export default api