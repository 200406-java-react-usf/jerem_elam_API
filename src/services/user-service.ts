import {Users} from '../models/users';
import {UserRepository} from '../repos/user-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validators';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';

export class UserService{
	constructor(private userRepo: UserRepository){
		this.userRepo = userRepo;
	}
	
	async getAllUsers(): Promise<Users[]>{
		let users = await this.userRepo.getAll();
		if(users.length === 0){
			throw new ResourceNotFoundError();
		}
		return users.map(this.removePassword)
	}
	removePassword(user: Users): Users {
		if(!user || !user.password) return user;
		let usr = {...user};
		delete usr.password;
		return usr;   
	}
}

