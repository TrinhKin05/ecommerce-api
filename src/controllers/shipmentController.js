const prisma = require('../config/prisma');

const createShipment = async (req, res) => {
    try {
        const oid = Number(req.body.oid);
        const status = req.body.status || 'PENDING';

        if (!Number.isInteger(oid)) {
            return res.status(400).json({
                message: 'oid không hợp lệ'
            });
        }

        const order = await prisma.order.findUnique({
            where: {
                oid
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy đơn hàng'
            });
        }

        const shipment = await prisma.shipment.create({
            data: {
                oid,
                status
            }
        });

        return res.status(201).json({
            message: 'Tạo shipment thành công',
            shipment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


const getShipments = async (req, res) => {
    try {
        const shipments = await prisma.shipment.findMany({
            include: {
                order: true
            },
            orderBy: {
                shipid: 'asc'
            }
        });

        return res.status(200).json(shipments);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


const updateShipmentStatus = async (req, res) => {
    try {
        const shipid = Number(req.params.shipid);
        const { status } = req.body;

        if (!Number.isInteger(shipid) || !status) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ'
            });
        }

        const existingShipment = await prisma.shipment.findUnique({
            where: {
                shipid
            }
        });

        if (!existingShipment) {
            return res.status(404).json({
                message: 'Không tìm thấy shipment'
            });
        }

        const shipment = await prisma.shipment.update({
            where: {
                shipid
            },
            data: {
                status
            }
        });

        return res.status(200).json(shipment);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};


module.exports = {
    createShipment,
    getShipments,
    updateShipmentStatus
};