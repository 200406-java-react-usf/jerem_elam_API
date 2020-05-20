import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validators';
import { ParsedUrlQuery} from 'querystring';
import { financeGuard } from '../middleware/auth-middleware';

export const ReimbRouter = express.Router();

const ReimbService = AppConfig.reimbService;

ReimbRouter.get('', async (req, resp)=>{
	try{
		let reqURL =url.parse(req.url,true);
		if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
			let payload = await ReimbService.getReimbByUniqueKey({...reqURL.query});
			resp.status(200).json(payload);
		} else{
			let payload = await ReimbService.getAllReimb();
			resp.status(200).json(payload);
		}
	}catch(e){
		resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.get('/type/:type', async(req, resp)=>{
	const reimb_type = req.params.type;
	try{
		let payload = await ReimbService.getAllReimbByType(reimb_type);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.get('/status/:status', async(req, resp)=>{
	const reimb_status = req.params.status;
	console.log(reimb_status);
	
	try{
		let payload = await ReimbService.getAllReimbByStatus(reimb_status);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.get('/:id', async(req, resp)=>{
	const id = +req.params.id;
	try{
		let payload = await ReimbService.getReimbById(id)
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});
ReimbRouter.get('/user/:id', async(req, resp)=>{
	const id = +req.params.id;
	console.log(id);
	
	try{
		let payload = await ReimbService.getAllReimbById(id)
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.delete('', async(req, resp) =>{
	try{
		let payload = await ReimbService.deleteReimbById(req.body);
		return resp.status(202).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.post('',async (req, resp) =>{	
	try{
		let newUser = await ReimbService.addNewReimb(req.body);
		return resp.status(201).json(newUser);
	} catch(e){
		return resp.status(e.statusCode).json(e);
	}
});
ReimbRouter.put('', async(req, resp) =>{
	try{
		let payload = await ReimbService.updateStatus(req.body);
		return resp.status(201).json(payload);
	}catch (e){
		return resp.status(e.statusCode).json(e);
	}
});

ReimbRouter.put('/update', async(req, resp) =>{
	try{
		let payload = await ReimbService.updateReimb(req.body);
		return resp.status(201).json(payload);
	}catch (e){
		return resp.status(e.statusCode).json(e);
	}
});

