'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'

export const addProduct = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'Product saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving product', error })
    }
}

export const listProducts = async (req, res) => {
    try {
        let products = await Product.find()
        if (products.length == 0) return res.status(404).send({ message: 'Not fount Products' })
        return res.send({ products })
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Error getting products' })
    }
}

export const searchProduct = async (req, res) => {
    try {
        let { search } = req.body
        let product = await Product.find({
            name: search,
        })
        if (product.length == 0) return res.status(404).send({ message: 'Product not found' })
        return res.send({ message: 'Product found', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching product' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateP = await Product.findOneAndUpdate({ _id: id }, data, { new: true })
        if (!updateP) return res.status(401).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Updated Product', updateP })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params
        let deleteProduct = await Product.deleteOne({ _id: id })
        if (deleteProduct.deletedCount == 0) return res.status(404).send({ message: 'Product not found and not deleted' })
        return res.send({ message: 'Delete product successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting product', error })
    }
}
