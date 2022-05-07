const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
    throw new Error('Error while loading environment variables', result.error);
}

function getEnvVariables() {
    const vars = process.env;
    const jsonVars = {};
    for (const key in vars) jsonVars[key] = vars[key];
    return jsonVars;
};

module.exports = getEnvVariables();
