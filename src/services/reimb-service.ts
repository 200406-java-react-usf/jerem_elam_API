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

	async deleteReimbById(id: object): Promise<boolean>{
		let keys = Object.keys(id);
		if(!keys.every(key=> isPropertyOf(key, Reimbursements))){
			throw new BadRequestError('Invalid key given');
		}
		let key = keys[0];
		let value = +id[key];
		if(!isValidId(value)){
			throw new BadRequestError();
		}
		await this.reimbRepo.deleteById(value);
		return true;
	}

	async addNewReimb(newReimb: Reimbursements): Promise<Reimbursements>{
		if(!isValidObject(newReimb, 'reimb_id', 'resolved', 'resolver_id', 'submitted', 'reimb_status')){
			throw new BadRequestError('Invalid Property values found in provided reimbursement');
		}
		newReimb.resolved = null;
		newReimb.resolver_id = null;
		newReimb.submitted = new Date();
		newReimb.reimb_status = 'pending';
		const newReimbursement = await this.reimbRepo.saveReimb(newReimb);
		return newReimbursement;
	}

	async updateReimb(updateReimb: Reimbursements): Promise<boolean>{
		if(!isValidObject(updateReimb, 'resolved','submitted', 'amount', 'submitted', 'resolved', 'description', 'author_id', 'reimb_type')){
			throw new BadRequestError('Invalid Property values found in provided reimbursement update');
		}
		let keys = Object.keys(updateReimb);
		if(!keys.every(key=> isPropertyOf(key, Reimbursements))){
			throw new BadRequestError('Invalid key given');
		}

		let check = await this.getReimbById(updateReimb.reimb_id)
		if(check.reimb_status != 'pending'){
			throw new BadRequestError('Only pending Reimbursements can be updated')
		}
		
		return await this.reimbRepo.updateReimb(updateReimb.reimb_id, updateReimb.reimb_status, updateReimb.resolver_id);
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
