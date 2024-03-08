'use strict'

import express from 'express'
import { pdfInvoice, updateInvoice, viewInvoice, viewProductInvoice } from './invoice.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()
api.put('/updateInvoice/:id', [validateJwt, isAdmin], updateInvoice)
api.get('/pdfInvoice/:id', [validateJwt, isAdmin], pdfInvoice)
api.get('/viewInvoice/:id', [validateJwt, isAdmin], viewInvoice)
api.get('/viewProductInvoice/:id', [validateJwt, isAdmin], viewProductInvoice)

export default api