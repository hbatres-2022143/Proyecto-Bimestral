'use strict'

import { initServer } from './config/app.js'
import { connect } from './config/mongo.js'
import { defaultAdmin } from './src/user/user.controller.js'
import { defaultCategory } from './src/category/category.controller.js'

initServer()
connect()
defaultCategory()
defaultAdmin()