const prisma = require('../config/prisma');

// CREATE
const createProduct = async (req, res) => {
    try {
        const { pname, price, quantity } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ pname, price và quantity'
            });
        }

        if (Number(price) < 0 || Number(quantity) < 0) {
            return res.status(400).json({
                message: 'Price và quantity không được âm'
            });
        }

        const product = await prisma.product.create({
            data: {
                pname,
                price: Number(price),
                quantity: Number(quantity)
            }
        });

        return res.status(201).json(product);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


// READ ALL
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                pid: 'asc'
            }
        });

        return res.status(200).json(products);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


// READ ONE
const getProductById = async (req, res) => {
    try {
        const pid = Number(req.params.pid);

        if (!Number.isInteger(pid)) {
            return res.status(400).json({
                message: 'pid không hợp lệ'
            });
        }

        const product = await prisma.product.findUnique({
            where: {
                pid
            }
        });

        if (!product) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


// UPDATE
const updateProduct = async (req, res) => {
    try {
        const pid = Number(req.params.pid);
        const { pname, price, quantity } = req.body;

        if (!Number.isInteger(pid)) {
            return res.status(400).json({
                message: 'pid không hợp lệ'
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: {
                pid
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const product = await prisma.product.update({
            where: {
                pid
            },
            data: {
                ...(pname !== undefined && { pname }),
                ...(price !== undefined && { price: Number(price) }),
                ...(quantity !== undefined && { quantity: Number(quantity) })
            }
        });

        return res.status(200).json(product);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


// DELETE
const deleteProduct = async (req, res) => {
    try {
        const pid = Number(req.params.pid);

        if (!Number.isInteger(pid)) {
            return res.status(400).json({
                message: 'pid không hợp lệ'
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: {
                pid
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        await prisma.product.delete({
            where: {
                pid
            }
        });

        return res.status(200).json({
            message: 'Xóa sản phẩm thành công'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};