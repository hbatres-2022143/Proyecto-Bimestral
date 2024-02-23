'use strict'

import { compare, hash } from 'bcrypt'

export const encrypt = async (password) => {
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(error)
    }
}

export const checkPassword = async (password, hash) => {
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkUpdate = async (data, userId) => {
    if (userId) {
        if ((Object.entries(data).length === 0 || data.password == '', data.role == '')) return false
        return true
    }
}
