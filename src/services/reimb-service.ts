import {Reimbursements} from '../models/reimb';
import {ReimbRepository} from '../repos/reimb-repo';
import validators, {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validators';
import { 
	BadRequestError,
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';

export class ReimbService{
	constructor(private reimbRepo: ReimbRepository){
		this.reimbRepo = reimbRepo;
	}
	async getAllReimb():Promise<Reimbursements[]>{
		let reimb = await this.reimbRepo.getAll();
		if(reimb.length === 0){
			throw new ResourceNotFoundError('No Reimbursements found');
		}
		return reimb;
	}

	async getReimbById(id:number): Promise<Reimbursements>{
		if(!isValidId(id)){
			throw new BadRequestError();
		}
		let reimb = {...await this.reimbRepo.getById(id)};
		if(isEmptyObject(reimb)){
			throw new ResourceNotFoundError()
		}
		return reimb;
	}
	async getReimbByUniqueKey(queryObj: any): Promise<Reimbursements>{
		
		let queryKeys = Object.keys(queryObj);
		
		if(!queryKeys.every(key => isPropertyOf(key, Reimbursements))){
			throw new BadRequestError('Invalid key provided please provided a valid key');
		}
		let key = queryKeys[0];
		let val = queryObj[key];
		if(key === 'reimb_id'){
			return await this.getReimbById(+val);
		}
		if(!isValidStrings(val)){
			throw new BadRequestError();
		}
		let reimb = await this.reimbRepo.getReimbByUniqueKey(key, val);
		if(isEmptyObject(reimb)){
			throw new ResourceNotFoundError();
		}
		return reimb;
	}

	//need to add second to make sure the string given is a type in database. for now mvp
	async getAllReimbByType(type:string): Promise<Reimbursements[]>{
		if(!isValidStrings(type)){
			throw new BadRequestError();
		}
		
		let reimb = await this.reimbRepo.getAllByType(type);
		if(reimb.length === 0){
			throw new ResourceNotFoundError('Type provided is invalid');
		}
		return reimb;
	}

	//need to add second check to make sure string given is a status in database. for now mvp
	async getAllReimbByStatus(status: string): Promise<Reimbursements[]>{
		if(!isValidStrings(status)){
			throw new BadRequestError();
		}
		let reimb = await this.reimbRepo.getAllByStatus(status);
		if(reimb.length === 0){
			throw new ResourceNotFoundError('Status provided is invalid');
		}
		return reimb;
	}

}
