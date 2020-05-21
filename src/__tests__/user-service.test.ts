import {Users} from '../models/users';
import {UserService} from '../services/user-service';
import validator from '../util/validators';
import {  
	BadRequestError,  
	ResourceNotFoundError, 
	ResourcePersistenceError,
} from '../errors/errors';

jest.mock('../repos/user-repo',()=>{
	return new class UserRepository{
		getAll = jest.fn();
		getAllByRole=  jest.fn();
		getById =jest.fn();
		save = jest.fn();
		getUserByUniqueKey=  jest.fn();
		update =  jest.fn();
		deleteById =  jest.fn();
		getUserByCreds = jest.fn();

	}
});

describe('userService',()=>{
	let sut: UserService;
	let mockRepo;

	let mockUsers = [
		new Users(1,'lazy','password','jeremy', 'elam', 'jeremyelam@gmail.com', 'admin'),
		new Users(2,'lazyspell','password','pepper', 'cat', 'peppercat@gmail.com', 'employee'),
		new Users(3,'spelly','password','salt', 'elam', 'saltelam@gmail.com', 'finance'),
		new Users(4,'spellyspell','password','jax', 'elam', 'jaxelam@gmail.com', 'employee'),
		new Users(5,'godspell','password','may', 'dog', 'maydog@gmail.com', 'employee')
	];
	
	beforeEach(()=>{
		mockRepo = jest.fn(()=>{
			return {
				getAll: jest.fn(),
				getAllByRole:jest.fn(),
				getById:jest.fn(),
				save: jest.fn(),
				getUserByUniqueKey: jest.fn(),
				update: jest.fn(),
				deleteById: jest.fn(),
				getUserByCreds: jest.fn()
			};
		});
		sut = new UserService(mockRepo);
	});
	test('should resolve to User[] (without passwords) when getAllUsers successfully retrieves users from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);
		//Act
		let result = await sut.getAllUsers();
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(5);
		result.forEach(val => expect(val.password).toBeUndefined());
	});

	test('should reject with ResourceNotfound Error when getAllUsers fails to get any users from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		mockRepo.getAll = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllUsers();
		}catch (e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return use when given a valid id number', async()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockImplementation((id:number)=>{
			return new Promise<Users>((resolve) => resolve(mockUsers[id -1]));
		});
		//Act
		let result = await sut.getUserById(1);

		//Assert
		expect(result).toBeTruthy();
		expect(result.first_name).toBe('jeremy');
		expect(result.password).toBeUndefined();
	});

	test('should throw bad request error when given an invalid id number (negative)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(-1);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw bad request error when given an invalid id number (double number)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(3.14);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw bad request error when given an invalid id number (fasly)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(0);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw badRequestError when given an invalid id number (NaN)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(NaN);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw ResourceNotFoundError when given a valid id but not an idea inside the database', async ()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.getUserById(100);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return new user information without password when a new user is given', async()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
		mockRepo.save = jest.fn().mockImplementation((newUser:Users)=>{
			return new Promise<Users>((resolve) => {
				mockUsers.push(newUser);
				resolve(newUser);
			});
		});
		//Act 
		let result = await sut.addNewUser(new Users(6,'spellyspellspell','password','may', 'dog', 'mydog@gmail.com', 'employee'));
		//Assert 
		expect(result).toBeTruthy();
		expect(mockUsers.length).toBe(6);
	});
	test('should return BadRequestError when given a bad Users object', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewUser(new Users(6,'','password','may', 'dog', 'mydog@gmail.com', 'employee'));
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return ResourcePersistenceError when given a Users with an email address that is already being used', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isEmailAvailable = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewUser(new Users(6,'spellyspellspell','password','may', 'dog', 'jeremyelam@gmail.com.com', 'employee'))
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBe(true);
		}
	});

	test('should return ResourcePersistenceError when given a Users with an username that is already being used', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isEmailAvailable = jest.fn().mockReturnValue(true);
		sut.isUsernameAvailable = jest.fn().mockReturnValue(false);

		//Act
		try{
			await sut.addNewUser(new Users(6,'lazyspell','password','may', 'dog', 'testing@gmail.com.com', 'employee'))
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBe(true);
		}
	});

	test('should return true when an user is successfully update given a valid user object', async ()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isEmailAvailable = jest.fn().mockReturnValue(true);
		sut.isUsernameAvailable = jest.fn().mockReturnValue(true)
		sut.getUserById = jest.fn().mockReturnValue(true);
		sut.getUserByUniqueKey = jest.fn().mockReturnValue(true);
		mockRepo.update = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.updateUser( new Users(5,'lazyspell','password','may', 'dog', 'testing@gmail.com.com', 'employee'));
		//Assert
		expect(result).toBe(true);
	});

	test('should return BadRequestError when a bad object is given to update', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.updateUser(new Users(5,'','password','may', 'dog', 'testing@gmail.com.com', 'employee'))
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return correct user when given correct key and value for getByUniqueKey', async () => {

		expect.assertions(2);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		
		sut.getUserById = jest.fn().mockImplementation((id: number)=>{
			return new Promise<Users>((resolve)=>{
				resolve(mockUsers.find(user => user.ers_user_id === id));
			});
		});
		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<Users> ((resolve) => {
				resolve(mockUsers.find(user => user[key] === val));
			});
		});

		let result = await sut.getUserByUniqueKey({ers_user_id: 1});

		expect(result).toBeTruthy();
		expect(result.ers_user_id).toBe(1);

	});

	test('should return true if a user with the given id number was successfully deleted', async ()=>{
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.deleteUserById({'ers_user_id':1});
		//Assert 
		expect(result).toBe(true);
	});

	test('should return BadRequestError when trying to delete an id but given an invalid id', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteUserById({'ers_user_id': -1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteUserById({'': 1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});


});
