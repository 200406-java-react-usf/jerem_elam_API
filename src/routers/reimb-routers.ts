import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validators';
import { ParsedUrlQuery} from 'querystring';

export const ReimbRouter = express.Router();

const ReimbService = AppConfig.reimbService;

ReimbRouter.get('', async(req, resp)=>{
	try{
	let payload = await ReimbService.getAllReimb();
	resp.status(200).json(payload);
	}catch(e){
		resp.status(e.statusCode).json(e);
	}
})