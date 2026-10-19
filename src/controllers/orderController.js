const prisma = require('../config/prisma');


// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Đơn hàng phải có ít nhất một sản phẩm'
            });
        }

        const result = await prisma.$transaction(async (tx) => {

            // Tạo Order
            const order = await tx.order.create({
                data: {
                    uid
                }
            });

            // Xử lý từng Product
            for (const item of items) {

                const pid = Number(item.pid);
                const qty = Number(item.qty);

                if (!Number.isInteger(pid) ||
                    !Number.isInteger(qty) ||
                    qty <= 0) {

                    throw new Error('Dữ liệu sản phẩm không hợp lệ');
                }

                const product = await tx.product.findUnique({
                    where: {
                        pid
                    }
                });

                if (!product) {
                    throw new Error(`Không tìm thấy sản phẩm pid=${pid}`);
                }

                if (product.quantity < qty) {
                    throw new Error(
                        `Sản phẩm ${product.pname} không đủ số lượng`
                    );
                }

                // Tạo OrderDetail
                await tx.orderDetail.create({
                    data: {
                        oid: order.oid,
                        pid,
                        qty,
                        unit_price: product.price
                    }
                });

                // Trừ tồn kho
                await tx.product.update({
                    where: {
                        pid
                    },
                    data: {
                        quantity: {
                            decrement: qty
                        }
                    }
                });
            }

            // Trả lại Order đầy đủ
            return tx.order.findUnique({
                where: {
                    oid: order.oid
                },
                include: {
                    orderDetails: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        });

        return res.status(201).json({
            message: 'Tạo đơn hàng thành công',
            order: result
        });

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message
        });
    }
};


// GET MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        const uid = req.user.uid;

        const orders = await prisma.order.findMany({
            where: {
                uid
            },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                },
                shipments: true
            },
            orderBy: {
                oid: 'desc'
            }
        });

        return res.status(200).json(orders);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


// GET ONE ORDER
const getOrderById = async (req, res) => {
    try {
        const oid = Number(req.params.oid);
        const uid = req.user.uid;

        if (!Number.isInteger(oid)) {
            return res.status(400).json({
                message: 'oid không hợp lệ'
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                oid,
                uid
            },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                },
                shipments: true
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy đơn hàng'
            });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};