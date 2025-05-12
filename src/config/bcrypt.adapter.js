const { compareSync, genSaltSync, hashSync } = require('bcryptjs');

const bcryptAdapter = {
    hash: (password) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    },
    compare: (password, hash) => {
        return compareSync(password, hash);
    }
};

module.exports = bcryptAdapter;
