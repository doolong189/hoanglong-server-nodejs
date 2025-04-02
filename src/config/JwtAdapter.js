const jwt = require("jsonwebtoken");
const { envs } = require("./envs");

// const JWT_SEED = envs.JWT_SEED;

class JwtAdapter {
    // Dependency Injection? If not, using static methods
    static async generateJWT(payload, duration = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, "JWT_SEED", { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token);
            });
        });
    }

    static validateJWT(token) {
        return new Promise((resolve) => {
            jwt.verify(token, "JWT_SEED", (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded);
            });
        });
    }
}

module.exports = JwtAdapter;
