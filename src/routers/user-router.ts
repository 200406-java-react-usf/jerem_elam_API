import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validators';
import { ParsedUrlQuery} from 'querystring';
import { adminGuard } from '../middleware/auth-middleware'

export const UserRouter = express.Router();

const UserService = AppConfig.userService;



UserRouter.get('', adminGuard, async (req, resp)=>{
	try{
		
		let reqURL =url.parse(req.url,true);
		if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
			let payload = await UserService.getUserByUniqueKey({...reqURL.query});
			resp.status(200).json(payload);
		} else{
			let payload = await UserService.getAllUsers();
			resp.status(200).json(payload);
		}
	}catch(e){
		resp.status(e.statusCode).json(e);
	}
});

UserRouter.get('/role/:role', async(req, resp) =>{
	const role = req.params.role;
	try{
		let payload = await UserService.getAllUsersByRole(role);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
})

UserRouter.get('/:id', async(req, resp) =>{
	const id = +req.params.id;
	try{
		let payload = await UserService.getUserById(id);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

UserRouter.post('',async (req, resp) =>{
	
	try{
		let newUser = await UserService.addNewUser(req.body);
		return resp.status(201).json(newUser);
	} catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

UserRouter.delete('', async(req, resp) =>{
	try{
		let payload = await UserService.deleteUserById(req.body);
		return resp.status(202).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

UserRouter.put('', async(req, resp) =>{
	try{
		let payload = await UserService.updateUser(req.body);
		return resp.status(201).json(payload);
	}catch (e){
		return resp.status(e.statusCode).json(e);
	}
});
