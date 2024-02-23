'use strict'

import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'
import { checkPassword, encrypt, checkUpdate } from '../utils/validator.js'

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Registered successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (user && (await checkPassword(password, user.password))) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
            }
            let token = await generateJwt(loggedUser)
            return res.send({
                message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token,
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to  login' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateUser = await User.findOneAndUpdate({ _id: id }, data, { new: true })
        if (!updateUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'Updated user', updateUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async (req, res) => {
    try {
        let { id } = req.params
        let deleteUser = await User.findOneAndDelete({ _id: id })
        if (!deleteUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.status(200).send({ message: `Account with username ${deleteUser.username} deteled successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user' })
    }
}

export const listUser = async (req, res) => {
    try {
        let users = await User.find()
        if (users.length == 0) return res.status(404).send({ message: 'Not found' })
        return res.send({ users })
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Error getting user' })
    }
}

export const searchUser = async (req, res) => {
    try {
        let { search } = req.body
        let user = await User.find({
            $or: [{ name: search }, { username: search }],
        })
        if (user.length == 0) return res.status(404).send({ message: 'User not found' })
        return res.send({ message: 'User found', user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching user' })
    }
}
