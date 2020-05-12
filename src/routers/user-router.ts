import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validators';
import { ParsedUrlQuery} from 'querystring';

export const UserRouter = express.Router();

const UserService = AppConfig.userService;

UserRouter.get('', async(req, resp)=>{
	try{
		let payload = await UserService.getAllUsers();
		resp.status(200).json(payload);
	}catch(e){
		resp.status(e.statusCode).json(e);
	}
});