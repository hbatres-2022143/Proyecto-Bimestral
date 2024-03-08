'use strict'

import express from 'express'
import { buyProducts, deleteAdmin, deleteU, login, register, registerAdmin, test, update, updateAdmin, updatePassword, updatePasswordAdmin, } from './user.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/deleteU/:id', [validateJwt], deleteU)
api.put('/updatePassword/:id', [validateJwt], updatePassword)

//ADMINS
api.post('/registerAdmin', [validateJwt, isAdmin], registerAdmin)
api.put('/updateAdmin/:id', [validateJwt, isAdmin], updateAdmin)
api.delete('/deleteAdmin/:id', [validateJwt, isAdmin], deleteAdmin)
api.put('/updatePasswordAdmin/:id', [validateJwt, isAdmin], updatePasswordAdmin)
api.post('/buyProducts', [validateJwt], buyProducts)

export default api