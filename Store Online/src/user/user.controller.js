'use strict'

import User from './user.model.js'
import Invoice from '../invoice/invoice.model.js'
import Product from '../product/product.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = async (req, res) => {
    return res.send('Hello World')
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.totalshopping = 0
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let existUser = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ],
        })
        if (existUser)
            return res.status(400).send({ message: 'User already exists' })
        let user = new User(data)
        await user.save()
        return res.send({ message: 'User created succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ],
        })
        if (user && (await checkPassword(password, user.password))) {
            let loggedUser = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
            let token = await generateJwt(loggedUser)
            let myInvoice = await Invoice.find({ user: user._id, state: true }).populate({ path: 'user', select: 'username' }).populate({ path: 'products.product', select: 'name' }).select('-_id -products._id')
            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token,
                myInvoice,
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({
            message:
                'You are not authorized to update another users password',
        })
        let update = checkUpdate(data, userIdU)
        if (!update) return res.status(400).send({ message: 'Could not update because data is missing' })
        let updatedUser = await User.findOneAndUpdate(
            { _id: userIdU },
            data,
            { new: true, }
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'User updated successfully', updatedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const updatePassword = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        let user = await User.findOne({ _id: userIdU })
        let password = data.password
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({
            message:
                'You are not authorized to update another users password',
        })
        if (user && (await checkPassword(password, user.password))) {
            if (data.passwordNew) data.passwordNew = await encrypt(data.passwordNew)
            let update = checkUpdate(data, userIdU)
            if (!update) return res.status(400).send({
                message: 'Could not update because data is missing',
            })
            let updatedUser = await User.findOneAndUpdate(
                { _id: userIdU },
                { password: data.passwordNew },
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'User password successfully updated' })
        }
        return res.status(404).send({ message: 'The password is not correct' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating password' })
    }
}

export const deleteU = async (req, res) => {
    try {
        let userIdL = req.user._id
        let userIdD = req.params.id
        let user = await User.findOne({ _id: userIdD })
        if (!user) return res.status(401).send({ message: 'User not found' })
        let { password } = req.body
        if (user && (await checkPassword(password, user.password))) {
            if (userIdL.toString() !== userIdD.toString()) return res.status(404).send({
                message: 'You only can delete your user'
            })
            let deleteUser = await User.findOneAndDelete({ _id: userIdD })
            if (!deleteUser) return res.status(401).send({
                message: 'You are not authorized to remove another user.',
            })
            return res.send({
                message: `User ${deleteUser.username} deleted succesfully`,
            })
        }
        return res.status(404).send({ message: 'Password is not correct' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user' })
    }
}

//ADMINS
export const defaultAdmin = async () => {
    try {
        let existingAdmin = await User.findOne({ role: 'ADMIN' })
        if (!existingAdmin) {
            let data = {
                name: 'Hermes',
                surname: 'Batres',
                username: 'hbatres-2022143',
                email: 'hbatres-2022143@kinal.edu.gt',
                phone: '36437689',
                password: await encrypt('12345678'),
                role: 'ADMIN',
                totalshopping: 0,
            }
            let user = new User(data)
            await user.save()
            return console.log('Default administrator created')
        } else {
            return console.log('The default administrator already exists')
        }
    } catch (err) {
        console.error(err)
    }
}

export const registerAdmin = async (req, res) => {
    try {
        let data = req.body
        data.totalshopping = 0
        data.password = await encrypt(data.password)
        let existUser = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ],
        })
        if (existUser) return res.status(400).send({ message: 'User already exists' })
        let user = new User(data)
        await user.save()
        return res.send({ message: 'User created succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating administrator' })
    }
}

export const updateAdmin = async (req, res) => {
    try {
        let data = req.body
        let updateUser = req.params.id
        let userId = req.user._id
        let existingUser = await User.findOne({ _id: updateUser })
        if (existingUser.role == 'ADMIN' && updateUser != userId) return res.status(400).send({
            message:
                'You are not authorized to update another administrator',
        })
        if (data.password) await encrypt(data.password)
        let updatedUser = await User.findOneAndUpdate(
            { _id: updateUser },
            data,
            { new: true, }
        )
        if (!updatedUser)
            return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'User updated successfully', updatedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const updatePasswordAdmin = async (req, res) => {
    try {
        let data = req.body
        let updateUser = req.params.id
        let userId = req.user._id
        let existingUser = await User.findOne({ _id: updateUser })
        let password = data.password
        if (existingUser.role == 'ADMIN' && updateUser != userId) return res.status(400).send({
            message:
                'You are not authorized to update the password to another administrator',
        })
        if (existingUser && await checkPassword(password, existingUser.password)) {
            if (data.passwordNew) data.passwordNew = await encrypt(data.passwordNew)
            let updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { password: data.passwordNew },
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'User password updated successfully' })
        }
        return res.status(404).send({ message: 'The password is not correct' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating password' })
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        let deletedUser = req.params.id
        let userId = req.user._id
        let existingUser = await User.findOne({ _id: deletedUser })
        if (existingUser.role === 'ADMIN' && userId != deletedUser) return res.status(400).send({
            message:
                'You are not authorized to remove another administrator',
        })
        let deleteUser = await User.findOneAndDelete({ _id: deletedUser })
        if (!deleteUser) return res.status(401).send({ message: 'User not found and not deleted' })
        return res.send({ message: `User ${existingUser.username} deleted successfully`, })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting administrator' })
    }
}

export const buyProducts = async (req, res) => {
    try {
        let data = req.body
        let userId = req.user._id
        let existingUser = await User.findOne({ _id: userId })
        let shoppingCart = existingUser.shoppingCart
        for (let productCart of shoppingCart) {
            let existingStock = await Product.findOne({ _id: productCart.product })
            if (existingStock.stock < productCart.quantity) return res.status(400).send({ message: `Not enough stock for the product ${productCart.product}` })
        }
        for (let productCart of shoppingCart) {
            let product = await Product.findOne({ _id: productCart.product })
            let stock = product.stock - productCart.quantity
            let updateStock = await Product.findOneAndUpdate(
                { _id: productCart.product },
                { stock: stock })
        }
        let invoiceData = {
            user: userId,
            NIT: data.NIT,
            products: existingUser.shoppingCart,
            date: Date.now(),
            amount: existingUser.totalshopping
        }
        if (invoiceData.products.length == 0) return res.status(404).send({ message: 'You need add products to shopping cart' })
        let invoice = new Invoice(invoiceData)
        let newInvoice = await invoice.save()
        let userInvoice = await Invoice.findOne({ _id: newInvoice._id }).populate({ path: 'user', select: ['username', 'name', 'email'] }).populate({ path: 'products.product', select: 'name' }).select('-_id -products._id')
        let clearTotalCart = 0
        let emptyCart = []
        await User.findOneAndUpdate(
            { _id: userId },
            { totalshopping: clearTotalCart, shoppingCart: emptyCart },
            { new: true })
        let productsInvoice = userInvoice.products
        for (let productSales of productsInvoice) {
            let product = await Product.findOne({ _id: productSales.product })
            let sales = product.sales + productSales.quantity
            let updateSales = await Product.findOneAndUpdate(
                { _id: productSales.product },
                { sales: sales }
            )
        }
        return res.send({ message: 'Products bought succesfully', userInvoice })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error buying products' })
    }
}