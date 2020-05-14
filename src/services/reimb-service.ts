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
}
