'use strict'

import Category from './category.model.js'
import Product from '../product/product.model.js'

export const defaultCategory = async () => {
    try {
        let data = {
            name: 'DEFAULT',
            description: 'Default by category'
        }
        let existingCategory = await Category.findOne({ name: 'DEFAULT' })
        if (existingCategory) return console.log('Category by default already exists')
        let defCategory = new Category(data)
        await defCategory.save()
        return console.log('Default category created')
    } catch (err) {
        return console.error(err)
    }
}

export const addCategory = async (req, res) => {
    try {
        let data = req.body
        let existingCategory = await Category.findOne({ name: data.name })
        if (existingCategory) return res.status(400).send({ message: 'Category already exist' })
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Category added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error adding category' })
    }
}

export const updateCategory = async (req, res) => {
    try {
        let data = req.body
        let categoryId = req.params.id
        let defaultCategory = await Category.findOne({ name: 'DEFAULT' })
        if (defaultCategory._id == categoryId) return res.status(401).send({
            message: 'You cant update the default category'
        })
        let updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId },
            data,
            { new: true }
        )
        if (!updatedCategory) return res.status(404).send({ message: 'Category not found and not updated' })
        return res.send({ message: 'Category updated successfully', updatedCategory })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating category' })
    }
}

export const viewCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        return res.send({ message: 'The categories: ', categories })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when viewing categories' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let categoryId = req.params.id
        let defaultCategory = await Category.findOne({ name: 'DEFAULT' })
        if (defaultCategory._id == categoryId) return res.status(401).send({
            message: 'You cant delete the default category'
        })
        await Product.updateMany(
            { category: categoryId },
            { category: defaultCategory._id }
        )
        let deletedCategory = await Category.findOneAndDelete({ _id: categoryId })
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found and not deleted' })
        return res.send({ message: 'Category successfully deleted' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}