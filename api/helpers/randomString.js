const bcrypt = require('bcrypt');

async function generateRandomString(length) {
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  let result = '';

	  for (let i = 0; i < length; i++) {
		      const randomIndex = Math.floor(Math.random() * characters.length);
		      result += characters.charAt(randomIndex);
		    }
	  const salt = await bcrypt.genSalt();
	  let hashedPassword = await bcrypt.hash(result, salt);
	  return [result, hashedPassword];
}
module.exports = generateRandomString;
