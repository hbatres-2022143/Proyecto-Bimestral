'use strict'

import User from '../user/user.model.js'
import Invoice from './invoice.model.js'
import Product from '../product/product.model.js'
import fs from 'fs'
import PDF from 'pdfkit'
import bwipjs from 'bwip-js';


export const viewInvoice = async (req, res) => {
    try {
        let userId = req.params.id
        let invoice = await Invoice.find({ user: userId, state: true }).populate({ path: 'user', select: 'username' }).populate({ path: 'products.product', select: 'name' }).select('-_id -products._id')
        if (!invoice) return res.status(404).send({ message: 'User has not invoice' })
        if (!invoice || invoice.length === 0) {
            return res.status(404).send({ message: 'The user does not have any active invoice' })
        }
        return res.send({ message: 'User invoice: ', invoice })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when viewing the invoice' })
    }
}

export const viewProductInvoice = async (req, res) => {
    try {
        let invoiceId = req.params.id
        let existingInvoice = await Invoice.findOne({ _id: invoiceId })
        if (!existingInvoice) return res.status(404).send({ message: 'Invoice not found' })
        let productsId = existingInvoice.products.map(product => product.product)
        let existingProducts = await Product.find({ _id: { $in: productsId } })
        if (!existingProducts) return res.status(404).send({ message: 'Product not found' })
        return res.send({ message: 'Products found:', existingProducts })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when viewing invoice ID products' })
    }
}

export const updateInvoice = async (req, res) => {
    try {
        let invoiceId = req.params.id
        let data = req.body
        let quantity = 0
        let amount = 0
        let existingInvoice = await Invoice.findOne({ _id: invoiceId, "products.product": data.product })
        if (!existingInvoice) return res.status(404).send({ message: 'Product not found' })
        let existingProduct = await Product.findOne({ _id: data.product })
        for (let product of existingInvoice.products) {
            if (product.product == data.product) quantity = product.quantity
        }
        if (data.quantity > quantity) amount = existingProduct.stock - (data.quantity - quantity)
        if (data.quantity < quantity) amount = existingProduct.stock + (quantity - data.quantity)
        if (data.quantity == quantity) amount = existingProduct.stock
        if (existingProduct.stock < quantity) return res.status(400).send({ message: 'Not enough stock for the product' })
        let updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: invoiceId },
            { $set: { products: { quantity: data.quantity, product: data.product } } },
            { new: true }
        )
        let updateProductStock = await Product.findOneAndUpdate(
            { _id: data.product },
            { stock: amount },
            { new: true }).select('stock')
        return res.send({ message: 'Invoice updated successfully', updateInvoice })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating invoice' })
    }
}

export const pdfInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id
        const invoice = await Invoice.findOne({ _id: invoiceId })
        const user = await User.findOne({ _id: invoice.user })
        const date = invoice.date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
        const pdf = new PDF()
        const output = fs.createWriteStream(`Invoices/${invoice._id}.pdf`)
        pdf.pipe(output)
        pdf.fontSize(40).text(`Invoice`, { align: 'center' })
        pdf.moveDown()
        pdf.fontSize(15)
            .text(`User: ${user.username}`)
            .text(`Name: ${user.name} ${user.surname}`)
            .text(`Email: ${user.email}`)
            .text(`Phone: ${user.phone}`)
            .text(`Date: ${date}`);
        pdf.moveDown().fontSize(17).text(`Products:`)
        const products = invoice.products
        for (const productInvoice of products) {
            const product = await Product.findOne({ _id: productInvoice.product })
            pdf.fontSize(15).text(`${product.name}: Q.${product.price}.00`).text(`Quantity: ${productInvoice.quantity}`).moveDown()
        }
        pdf.moveDown().fontSize(17).text(`Amount: Q${invoice.amount}.00`)
        pdf.moveDown()
        const barcodeData = 'Store Online'
        const barcodeImage = await generateBarcode(barcodeData)
        const barcodeWidth = 270
        const barcodeX = (pdf.page.width - barcodeWidth) / 2
        pdf.image(barcodeImage, barcodeX, pdf.y + 20, { width: barcodeWidth })
        pdf.end()
        return res.send({ message: 'The invoice was created successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error generating invoice' })
    }
}

// Función para generar el código de barras
async function generateBarcode(code) {
    return new Promise((resolve, reject) => {
        const options = {
            bcid: 'code128',  // Tipo de código de barras
            text: code,       // El texto que se convertirá en código de barras
            scale: 3,         // Escala del código de barras
            height: 10,       // Altura del código de barras
            includetext: true // Incluir el texto debajo del código de barras
        }
        bwipjs.toBuffer(options, function (err, png) {
            if (err) {
                reject(err)
            } else {
                const base64Image = `data:image/png;base64,${png.toString('base64')}`
                resolve(base64Image)
            }
        })
    })
}