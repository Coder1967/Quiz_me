const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user.js')
const _ = require('../helpers/handleRefreshTokens')


function generateAcessToken(user, expirationTime) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expirationTime});
}


async function login(req, res){
	if (!req.body.email || !req.body.password) {
		return res.status(401).json({error: 'enter your details'});
	}
	try {
		let user = await User.findOne({ email: req.body.email})
		if (user === null) return res.status(404).json({error: 'User not found'});

		if (!user.verified) {
			return res.status(401).json({error: 'user is unverified'})
		}
		if (!await bcrypt.compare(req.body.password, user.password)){
			return res.status(401).json({error: 'password is incorrect'})
		}
		user = {email: user.email, id: user.id, fresh: true}
		const accessToken = generateAcessToken(user, '30m')
		user.fresh = false;
		const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
		await _.saveRefreshToken(refreshToken)
		return res.status(200).json({accessToken, refreshToken})
	}catch(err) {
		console.log(err.message);
		res.status(500).json({error: 'Something went wrong'});
	}
}

async function refreshAuthToken(req, res) {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401)
	if (!await _.checkRefreshToken(refreshToken)) return res.sendStatus(403)

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
		if (err) return res.sendStatus(403)
		const accessToken = generateAcessToken(user, '30m');
		return res.status(200).json({accessToken})
	});
}


async function logOut(req, res) {
	await _.deleteRefreshToken(req.body.token)
	return res.status(200).json({})
}
module.exports = {login, refreshAuthToken, logOut}