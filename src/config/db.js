const mongoose = require("mongoose");

exports.connectDB = () => {
    const url = "mongodb+srv://hoanglong180903:Hoanglong180903@atlascluster.6r7fs.mongodb.net/HoangLong-ServerDev";
    try {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
}