'use strict'

import Category from './category.model.js'

export const addCategory = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Category saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saved category' })
    }
}

export const updateCategory = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateC = await Category.findOneAndUpdate({ _id: id }, data, { new: true })
        if (!updateC) return res.status(401).send({ message: 'Category not found and not updated' })
        return res.send({ message: 'Updated category', updateC })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: ' Error updating account' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let { id } = req.params
        let deleteC = await Category.deleteOne({ _id: id })
        if (deleteC.deletedCount == 0) return res.status(404).send({ message: 'Category not found and not deleted' })
        return res.send({ message: 'Deleted category successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ messaje: 'Error deleting category' })
    }
}

export const searchCategory = async (req, res) => {
    try {
        let { search } = req.body
        let category = await Category.find({
            name: search,
        })

        if (category.length == 0) return res.status(404).send({ message: 'Category not found' })
        return res.send({ message: 'Category found', category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching category' })
    }
}

export const listCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        if (categories.length == 0) return res.status(404).send({ message: 'Not found categories' })
        return res.send({ categories })
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Error getting categories' })
    }
}
