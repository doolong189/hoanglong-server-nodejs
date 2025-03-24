var admin = require("firebase-admin");
var express = require("express");
var router = express.Router();
var serviceAccount = require("../key_service_account.json");
const Notification = require("../../models/Notification");
const {token} = require("morgan");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};
// require('../../models/notification/Notification')
// const Notification = mongoose.model("notification");
// router.post("/firebase/notification", function(req, res) {
//     const registrationToken = req.body.registrationToken;

//     const message = {
//         token: registrationToken, // Đúng theo yêu cầu của Firebase
//         notification: {
//             title: req.body.title,
//             body: req.body.body,
//             image: req.body.imageUrl,
//         }
//     };

//     const options = notification_options;

//     admin
//         .messaging()
//         .send(message)
//         .then((response) => {
//             console.log("Successfully sent message:", response);
//             res.status(200).send('Notification sent successfully with messageId: ' + response.notification);
//         })
//         .catch((error) => {
//             console.error("Error sending message:", error);
//             res.status(400).send(error);
//         });
// });

router.post("/pushNotification", function (req, res) {
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
            res.status(200).send({
                message: "Notification sent successfully.",
                notification: message.notification,
                messageId: response.messageId,
            },
        );
        })
        .catch((error) => {
            console.error("Error sending message:", error);

            res.status(400).send({
                message: "Failed to send notification.",
                error: error.message,
                notification: message.notification,
            });
        });
});


router.post("/addNotification", function(req,res) {
    const request = new Notification({
        title: req.body.title,
        body: req.body.body,
        image : req.body.image,
        idUser: req.body.idUser,
        type: req.body.type
    })
    request.save()
    .then(data => {
        res.send({ message: 'Không tìm thấy người dùng' })
    }).catch(err => {
        console.log(err)
    })
})

router.post("/getNotification", async(req,res) => {
    try {
    const notifications = await Notification.find({idUser: req.body.id});
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'Không có thông báo nào' });
    }
      return res.status(200).json({ message: 'Lấy dữ liệu thành công', notifications });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

router.post("/getDetailNotification" , async(req , res) => {
    try {
        const notification = await Notification.findOne({_id : req.body.id});
        if (!notification || notification.length === 0) {
            return res.status(400).json({ message: 'Không có thông báo nào' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', notification });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

module.exports = router;
