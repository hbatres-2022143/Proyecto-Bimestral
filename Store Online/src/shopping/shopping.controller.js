'use strict'

import User from '../user/user.model.js'
import Invoice from '../invoice/invoice.model.js'
import Product from '../product/product.model.js'

export const buyProducts = async (req, res) => {
    try {
        let data = req.body
        let userId = req.user._id
        let existingUser = await User.findOne({ _id: userId })
        let shopping = existingUser.shopping
        for (let productS of shopping) {
            let existingStock = await Product.findOne({ _id: productS.product })
            if (existingStock.stock < productS.quantity)
                return res.status(400).send({
                    message: `Not enough stock for the product ${productS.product}`,
                })
        }
        for (let productS of shopping) {
            let product = await Product.findOne({ _id: productS.product })
            let stock = product.stock - productS.quantity
            let updateStock = await Product.findOneAndUpdate(
                { _id: productS.product },
                { stock: stock }
            )
        }
        let invoiceData = {
            user: userId,
            NIT: data.NIT,
            products: existingUser.shopping,
            date: Date.now(),
            amount: existingUser.totalCart,
        }
        if (invoiceData.products.length == 0)
            return res
                .status(404)
                .send({ message: 'You need add products to shopping' })
        let invoice = new Invoice(invoiceData)
        let newInvoice = await invoice.save()
        let userInvoice = await Invoice.findOne({ _id: newInvoice._id })
            .populate({ path: 'user', select: ['username', 'name', 'email'] })
            .populate({ path: 'products.product', select: 'name' })
            .select('-_id -products._id')
        let clearTotalCart = 0
        let emptyCart = []
        await User.findOneAndUpdate(
            { _id: userId },
            { totalCart: clearTotalCart, shopping: emptyCart },
            { new: true }
        )
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

