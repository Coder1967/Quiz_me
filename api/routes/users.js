const router = require('express').Router();
const {hash_pwd, authenticateToken} = require('../middleWares');

const {
    getUser, createUser, verifyAccount, 
    updateUser, deleteUser, recoverPassword
} = require('../controllers/userControl')

router.get('/:userId', getUser);

router.post('/recover', recoverPassword)

router.get('/:userId/verify', verifyAccount)

router.post('/', hash_pwd, createUser);

router.put('/', [authenticateToken, hash_pwd], updateUser);

router.delete('/', authenticateToken, deleteUser);


module.exports = router;