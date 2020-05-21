import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {Users} from '../models/users';
import { ReimbRepository } from '../repos/reimb-repo';
import { Reimbursements } from '../models/reimb';

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

describe('reimbRepo', ()=>{
	let sut = new ReimbRepository();
	let mockConnect = mockIndex.connectionPool.connect;

	beforeEach(()=>{
		(mockConnect as jest.Mock).mockClear().mockImplementation(() => {
			return {
				query: jest.fn().mockImplementation(() => {
					return {
						rows: [
							{
								reimb_id: 1,
								amount: 800,
								submitted: new Date(),
								resolved: new Date(),
								description: 'testing stuff',
								author_id: 1,
								resolver_id: 3,
								reimb_status:'pending',
								reimb_type: 'other'
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
		let mockUser = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
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
		let mockUser = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
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
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.saveReimb(mockReimb);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.update(1, 300, 'testing', 'other');
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.getAllById(1);
		//Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(1)
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.getReimbByUniqueKey("description",'testing stuff');
		//Assert
		expect(result).toBeTruthy();
		expect(result.reimb_id).toBe(1)
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.getAllByType("other");
		//Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(1)
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.getAllByStatus("pending");
		//Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(1)
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.updateStatus(1,"other", 3);
		//Assert
		expect(result).toBeTruthy();
	});
	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.updateStatus(1,"other", 3);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockReimb = new Reimbursements(1,899.88,new Date(), new Date(), 'testing', 1, 3, 'pending', 'other');
		//Act
		let result = await sut.deleteById(1);
		//Assert
		expect(result).toBeTruthy();
	});
})