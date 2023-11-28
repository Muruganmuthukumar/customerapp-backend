const express = require('express');
const { getAllUser, getUser, createUser, editUser, deleteUser } = require('../controllers/user.controller');
const router = express.Router();

router.get('/',getAllUser);
router.get('/:id',getUser);
router.post('/', createUser);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

module.exports=router;