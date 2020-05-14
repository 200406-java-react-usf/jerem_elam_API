import {Users} from '../models/users';
import {UserRepository} from '../repos/user-repo';
import validators, {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validators';
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
		return users.map(this.removePassword); 
	}
	async getAllUsersByRole(role: string): Promise<Users[]>{
		
		if(!isValidStrings(role)){
			throw new BadRequestError('the value you provided was not a string. Please provided a proper string');
		}
		let userRoles = await this.isValidRole(role);
		if(!userRoles){
			throw new BadRequestError('the role you provided is invalid');
		}

		let users = await this.userRepo.getAllByRole(role);
		
		if(users.length === 0){
			throw new ResourceNotFoundError();
		}
		return users;
	}
	async getUserById(id:number): Promise<Users>{
		if(!isValidId(id)){
			throw new BadRequestError();
		}
		let user = {...await this.userRepo.getById(id)};
		if(isEmptyObject(user)){
			throw new ResourceNotFoundError()
		}
		return this.removePassword(user);
	}

	async getUserByUniqueKey(queryObj: any): Promise<Users>{
		
		let queryKeys = Object.keys(queryObj);
		
		if(!queryKeys.every(key => isPropertyOf(key, Users))){
			throw new BadRequestError('Invalid key provided please provided a valid key');
		}
		let key = queryKeys[0];
		let val = queryObj[key];
		if(key === 'ers_user_id'){
			return await this.getUserById(+val);
		}
		if(!isValidStrings(val)){
			throw new BadRequestError('test 2');
		}
		let user = await this.userRepo.getUserByUniqueKey(key, val);
		if(isEmptyObject(user)){
			throw new ResourceNotFoundError('test 1');
		}
		return this.removePassword(user);
	}
	async addNewUser(newUser:Users): Promise<Users>{
		console.log(Users);
		
		if(!isValidObject(newUser,'ers_user_id')){
			throw new BadRequestError('Invalid property values fround in provided user.');
		}
		let emailAvailable = await this.isEmailAvailable(newUser.email);
		let usernameAvailable = await this.isUsernameAvailable(newUser.username);

		if(!usernameAvailable){
			throw new ResourcePersistenceError('The provided username is already in use.');
		}
		if(!emailAvailable){
			throw new ResourcePersistenceError('The provided email is already in use.');
		}
		newUser.role_name = 'employee';
		const persistedUser = await this.userRepo.save(newUser);
		return this.removePassword(persistedUser);
	}

	async deleteUserById(id: object): Promise<boolean>{
		let keys = Object.keys(id);
		if(!keys.every(key=> isPropertyOf(key, Users))){
			throw new BadRequestError('Invalid key given');
		}
		let key = keys[0];
		let value = +id[key];
		if(!isValidId(value)){
			throw new BadRequestError();
		}
		await this.userRepo.deleteById(value);
		return true;
	}

	async updateUser(updateUser: Users):Promise<boolean>{
		try{
			if(!isValidObject(updateUser)){
				throw new BadRequestError();
			}
			let usernameAvailable = await this.isUsernameAvailable(updateUser.username);
			let usernameDatabase = await this.getUserById(updateUser.ers_user_id);
			
			let databaseUsername = await this.getUserByUniqueKey({'username':updateUser.username});
			if(usernameDatabase.username == databaseUsername.username){
				usernameAvailable = true;
			}
			if(!usernameAvailable){
				throw new ResourceNotFoundError('The username passed through is already in use')
			}
			let emailAvailable = await this.isEmailAvailable(updateUser.email);
			let emailDatabase = await this.getUserById(updateUser.ers_user_id);
			let databaseEmail = await this.getUserByUniqueKey({'email': updateUser.email});
			if(emailDatabase.email == databaseEmail.email){
				emailAvailable = true;
			}
			
			if(!emailAvailable){
				throw new ResourcePersistenceError('The email address passed through is already in use');
			}
			return await this.userRepo.update(updateUser);
		}catch(e){
			throw e;
		}
	}

	async isValidRole(role: string):Promise<boolean>{
		try{
			await this.getUserByUniqueKey({'role_name': role});
		}catch(e){
			console.log('role is not in database');
			return false;
		}
		console.log('role is in database');
		return true;
	}
	async isUsernameAvailable(un: string): Promise<boolean>{
		try{
		await this.getUserByUniqueKey({'username':un});
		}catch(e){
			console.log('username is available');
			return true
		}
		console.log('email is available');
		return false;
	}
	async isEmailAvailable(email: string): Promise<boolean>{
		try{
		await this.getUserByUniqueKey({'email':email});
		}catch(e){
			console.log('email is available');
			return true
		}
		console.log('email is not available');
		return false;
	}
		
	
	removePassword(user: Users): Users {
		if(!user || !user.password) return user;
		let usr = {...user};
		delete usr.password;
		return usr;   
	}

	
}

