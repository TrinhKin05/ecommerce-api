const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const register = async (req, res) => {
    try {
        const {
            username,
            fullname,
            password
        } = req.body;

        if (!username || !fullname || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username đã tồn tại'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                fullname,
                password: hashedPassword,

                // User mới mặc định là CUSTOMER
                roleid: 2,

                // Membership mặc định BASIC
                mid: 1
            },
            include: {
                role: true,
                membership: true
            }
        });

        return res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                uid: user.uid,
                username: user.username,
                fullname: user.fullname,
                role: user.role.rolename,
                membership: user.membership.mname
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập username và password'
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            },
            include: {
                role: true,
                membership: true
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Username hoặc password không đúng'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Username hoặc password không đúng'
            });
        }

        const token = jwt.sign(
            {
                uid: user.uid,
                username: user.username,
                role: user.role.rolename
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                uid: user.uid,
                username: user.username,
                fullname: user.fullname,
                role: user.role.rolename,
                membership: user.membership.mname
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                uid: req.user.uid
            },
            include: {
                role: true,
                membership: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy user'
            });
        }

        return res.status(200).json({
            user: {
                uid: user.uid,
                username: user.username,
                fullname: user.fullname,
                role: user.role.rolename,
                membership: user.membership.mname
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};
module.exports = {
    register,
    login,
    getProfile
};