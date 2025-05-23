const admin = require( "firebase-admin")
const Notification = require("../models/notification.model.js")

const pushNotification = async function (req, res) {
    const registrationToken = req.body.registrationToken;
    const message = {
        token: registrationToken,
        notification: {
            title: req.body.title,
            body: req.body.body,
            image: req.body.imageUrl,
        },
    };
    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
            // Trả về thông tin notification
            return res.status(200).send({
                    message: "Gửi thông báo thành công",
                    notification: message.notification,
                    messageId: response.messageId,
                },
            );
        })
        .catch((error) => {
            console.error("Lỗi gửi thông báo", error);
            return res.status(500).json({ message: error.message });
        });
};


const createNotification = async function(req,res) {
    try {
        const request = new Notification({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            idUser: req.body.idUser,
            type: req.body.type
        })
        await request.save();
        return res.status(200).send({message: 'Tạo thông báo thành công'})
    }catch (err) {
        console.log(err);
        return  res.status(500).json({ message: err.message });
    }
}

const getNotification =  async (req,res) => {
    try {
        const notifications = await Notification.find({idUser: req.body.id});
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'Không có thông báo nào' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', notifications });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getDetailNotification = async (req , res) => {
    try {
        const notification = await Notification.findOne({_id : req.body.id});
        if (!notification || notification.length === 0) {
            return res.status(400).json({ message: 'Không có thông báo nào' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', notification });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    pushNotification, createNotification, getNotification, getDetailNotification
}