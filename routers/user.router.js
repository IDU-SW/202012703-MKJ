const router = require('express').Router();
const s3 = require('../utils/s3.utils');
const { sessCheck } = require('../utils/session.utils');
const userController = require('../controller/user.controller');

router.get('/users', userController.userLoginView);
/**
 * @api {get} /users 
 * @apiGroup User
 * @apiName User Login View
 *
 * @apiSuccess {View} UserLoginView
 */
router.get('/users/logout', sessCheck, userController.logoutUser);
/**
 * @api {get} /users/logout
 * @apiGroup User
 * @apiName User Logout
 *
 * @apiSuccess {View} UserLoginView
 */
router.get('/users/list', sessCheck, userController.userListView);
/**
 * @api {get} /users/list
 * @apiGroup User
 * @apiName User List View
 *
 * @apiSuccess {View} UserListView
 */
router.get('/users/add', userController.userAddView);
/**
 * @api {get} /users/add
 * @apiGroup User
 * @apiName User Add View
 *
 * @apiSuccess {View} UserAddView
 */
router.get('/users/imgUpload', sessCheck, userController.userUploadView);
/**
 * @api {get} /users/upload
 * @apiGroup User
 * @apiName User Image Upload View
 *
 * @apiSuccess {View} UserImageUploadView
 */
router.get('/users/:_id', sessCheck, userController.userDetailView);
/**
 * @api {get} /users/:_id
 * @apiGroup User
 * @apiName User Detail View
 *
 * @apiSuccess {View} UserDetailView
 */
router.get('/users/update/:_id', sessCheck, userController.userUpdateView);
/**
 * @api {get} /users/update/:_id
 * @apiGroup User
 * @apiName User Update View
 *
 * @apiSuccess {View} UserUpdateView
 */
router.get('/users/delete', sessCheck, userController.userDeleteView);
/**
 * @api {get} /users/delete
 * @apiGroup User
 * @apiName User Delete View
 *
 * @apiSuccess {View} UserDeleteView
 */
router.post('/upload', sessCheck, s3.s3Upload.single('imgFile'), userController.userImgUpload);
/**
 * @api {post} upload
 * @apiGroup User
 * @apiName User Image Upload 
 *
 * @apiSuccess {200} Success
 *
 * @apiError (400) {json} Bad Request
 * @apiError (401) {json} UnAthorized
 * @apiError (500) {json} Fail to Excute Sql
 */
router.post('/users', userController.addUser);
/**
 * @api {post} /users
 * @apiGroup User
 * @apiName Insert User 
 *
 * @apiSuccess {200} Success
 * @apiSuccess {View} UserLoginView
 *
 * @apiError (400) {json} Bad Request
 * @apiError (401) {json} UnAthorized
 * @apiError (500) {json} Fail to Excute Sql
 */
router.post('/users/login', userController.loginUser)
/**
 * @api {post} /users/login
 * @apiGroup User
 * @apiName User Login
 *
 * @apiSuccess {200} Success
 * @apiSuccess {View} UserLoginCompleteView
 *
 * @apiError (400) {json} Bad Request
 * @apiError (401) {json} UnAthorized
 * @apiError (500) {json} Fail to Excute Sql
 */
router.post('/users/update/:_id', sessCheck, userController.updateUser);
/**
 * @api {post} /users/update/:_id
 * @apiGroup User
 * @apiName Update User Info
 *
 * @apiSuccess {200} Success
 * @apiSuccess {View} UserDetailView
 *
 * @apiError (400) {json} Bad Request
 * @apiError (401) {json} UnAthorized
 * @apiError (500) {json} Fail to Excute Sql
 */
router.post('/users/:_id', sessCheck, userController.deleteUser);
/**
 * @api {post} /users/upload
 * @apiGroup User
 * @apiName User Image Upload 
 *
 * @apiSuccess {200} Success
 * @apiSuccess {View} UserLoginView
 *
 * @apiError (400) {json} Bad Request
 * @apiError (401) {json} UnAthorized
 * @apiError (500) {json} Fail to Excute Sql
 */

module.exports = router;

