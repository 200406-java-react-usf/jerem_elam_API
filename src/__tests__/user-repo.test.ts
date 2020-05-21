import {UserRepository} from '../repos/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {Users} from '../models/users';

jest.mock('..',()=>{
	return {
		connectionPool: {
			connect: jest.fn()
		}
	};
});

jest.mock('../util/result-set-mapper', ()=>{
	return {
		mapUserResultSet: jest.fn()
	};
});

describe('userRepo', ()=>{
	let sut = new UserRepository();
	let mockConnect = mockIndex.connectionPool.connect;

	beforeEach(()=>{
		(mockConnect as jest.Mock).mockClear().mockImplementation(() => {
			return {
				query: jest.fn().mockImplementation(() => {
					return {
						rows: [
							{
								ers_user_id: 1,
								username: 'lazyspell',
								password: 'password',
								first_name: 'jeremy',
								last_name: 'elam',
								email: 'jeremyelam@gmail.com',
								role_name: 'admin'
							}	
						]
					};
				}), 
				release: jest.fn()
			};
		});
		(mockMapper.mapUserResultSet as jest.Mock).mockClear();
	});

	test('should resolve to an array of User when getAll retrieves records from data source', async ()=>{
		//Arrange 
		expect.hasAssertions();
		let mockUser = new Users(1, 'lazyspell', 'password', 'jeremy', 'elam', 'jeremyelam@gmail.com', 'admin');
		(mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
		//Act 
		let result = await sut.getAll();
		//Assert
		expect(result).toBeTruthy();
		expect(result instanceof Array).toBe(true);
		expect(result.length).toBe(1);
		expect(mockConnect).toBeCalledTimes(1);
	});
	test('should resolve to an empty array when getAll retrieves no records from data source', async () =>{
		// Arrange
		expect.hasAssertions();
		(mockConnect as jest.Mock).mockImplementation(() => {
			return {
				query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
				release: jest.fn()
			};
		});
		// Act
		let result = await sut.getAll();
		// Assert
		expect(result).toBeTruthy();
		expect(result instanceof Array).toBe(true);
		expect(result.length).toBe(0);
		expect(mockConnect).toBeCalledTimes(1);
	});
	test('should resolve to a User object when getById retrieves a record from data source', async () => {
		// Arrange
		expect.hasAssertions();
		let mockUser = new Users(1, 'un', 'pw', 'firstName', 'lastName', 'email@gmail.com', 'employee');
		(mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
		// Act
		let result = await sut.getById(1);
		console.log(result)
		// Assert
		expect(result).toBeTruthy();
		expect(result instanceof Users).toBe(false);
	});
	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Users(1, 'un', 'pw', 'firstName', 'lastName', 'email@gmail.com', 'employee');
		//Act
		let result = await sut.save(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return true when update is successfully executed by the database', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Users(1, 'un', 'pw', 'firstName', 'lastName', 'email@gmail.com', 'employee');
		//Act
		let result = await sut.update(mockUser);
		//Assert
		expect(result).toBeTruthy();
		expect(result).toBe(true);
	});
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Users(1, 'un', 'pw', 'firstName', 'lastName', 'email@gmail.com', 'employee');
		//Act
		let result = await sut.deleteById(1);
		//Assert
		console.log(result);
		
		expect(result).toBeTruthy();

	});
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		//Act
		let result = await sut.getUserByUniqueKey('username', 'lazyspell');
		//Assert
		expect(result).toBeTruthy();
		expect(result.ers_user_id).toBe(1);
	});

	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		//Act
		let result = await sut.getUserByCreds('lazyspell', 'password');
		//Assert
		expect(result).toBeTruthy();
	});
})