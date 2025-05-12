// Import any required models here
const AuthService = require('../models/User');

// Define your service methods
exports.getExamples = async () => {
    return await AuthService.find();
};

exports.createExample = async (name) => {
    const example = new AuthService({ name });
    return await example.save();
};