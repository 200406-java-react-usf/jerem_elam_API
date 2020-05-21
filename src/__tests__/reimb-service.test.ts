import { Reimbursements } from '../models/reimb';
import { ReimbService } from '../services/reimb-service';
import validator from '../util/validators';
import {  
	BadRequestError,  
	ResourceNotFoundError, 
	ResourcePersistenceError,
} from '../errors/errors';

jest.mock('../repos/user-repo', ()=>{
	return new class ReimbRepository{
		getAllReimb = jest.fn();
		getReimbById = jest.fn();
		getAllReimbById = jest.fn();
		getReimbByUniqueKey = jest.fn();
		deleteReimbById = jest.fn();
		addNewReimb = jest.fn();
		updateStatus = jest.fn();
		update = jest.fn();
		getAllReimbByType = jest.fn();
		getAllReimbByStatus = jest.fn();
	}
});

describe('reimbService', ()=>{
	let sut: ReimbService;
	let mockRepo;

	let mockReimb = [
		new Reimbursements(1,300,new Date(), null, 'description', 1, null, "pending", 'food'),
		new Reimbursements(2,899.99,new Date(), new Date(), 'description 2', 2, 3, "denied", 'other'),
		new Reimbursements(1,300,new Date(), new Date(), 'description 3', 2, 3, "approved", 'food'),
		new Reimbursements(1,69.99,new Date(), null, 'description 4', 1, null, "pending", 'food'),
		new Reimbursements(1,300,new Date(), new Date(), 'description 5', 1, 3, "pending", 'travel')
	]

	beforeEach(()=>{
		mockRepo = jest.fn(()=>{
			return {
				getAllReimb: jest.fn(),
				getReimbById: jest.fn(),
				getAllReimbById: jest.fn(),
				getReimbByUniqueKey: jest.fn(),
				deleteReimbById: jest.fn(),
				addNewReimb: jest.fn(),
				updateStatus: jest.fn(),
				update: jest.fn(),
				getAllReimbByType: jest.fn(),
				getAllReimbByStatus: jest.fn()
			};
		});
		sut = new ReimbService(mockRepo);
	});
	test('should resolve to User[] (without passwords) when getAllUsers successfully retrieves users from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockReimb);
		//Act
		let result = await sut.getAllReimb();
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(5);
	});

	test('should reject with ResourceNotfound Error when getAllReimb fails to get any reimb from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		mockRepo.getAll = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllReimb();
		}catch (e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});
	test('should return use when given a valid id number', async()=>{
		//Arrange
		expect.assertions(2);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockImplementation((id:number)=>{
			return new Promise<Reimbursements>((resolve) => resolve(mockReimb[id -1]));
		});
		//Act
		let result = await sut.getReimbById(1);

		//Assert
		expect(result).toBeTruthy();
		expect(result.reimb_status).toBe('pending');
	});
	test('should throw bad request error when given an invalid id number (negative)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getReimbById(-1);
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
			await sut.getReimbById(3.14);
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
			await sut.getReimbById(0);
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
			await sut.getReimbById(NaN);
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
			await sut.getReimbById(100);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});
	test('should resolve to Reimb[] when getAllReimb successfully retrieves reimb from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAllById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimbursements[]>((resolve) => resolve(mockReimb.filter(reimbs => reimbs.author_id === id)));
        });
		//Act
		let result = await sut.getAllReimbById(2);
		
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(2);
		
	});

	test('should throw bad request error when given an invalid id number (fasly)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getAllById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getAllReimbById(0);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should reject with ResourceNotfound Error when getAllReimb fails to get any reimb from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		mockRepo.getAllById = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllReimbById(7);
		}catch (e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return correct user when given correct key and value for getByUniqueKey', async () => {

		expect.assertions(2);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		
		sut.getReimbById = jest.fn().mockImplementation((id: number)=>{
			return new Promise<Reimbursements>((resolve)=>{
				resolve(mockReimb.find(reimb => reimb.reimb_id === 1));
			});
		});
		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<Reimbursements> ((resolve) => {
				resolve(mockReimb.find(user => user[key] === val));
			});
		});

		let result = await sut.getReimbByUniqueKey({reimb_id: 1});

		expect(result).toBeTruthy();
		expect(result.reimb_id).toBe(1);

	});

	test('should reject with ResourceNotfound Error when getAllReimb fails to get any reimb from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(false);

		//Act
		try{
			await sut.getReimbByUniqueKey({description:''});
		}catch (e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should reject with ResourceNotfound Error when getAllReimb fails to get any reimb from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(false);

		//Act
		try{
			await sut.getReimbByUniqueKey({bad:''});
		}catch (e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteReimbById({'': 1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});

	test('should return true if a user with the given id number was successfully deleted', async ()=>{
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.deleteReimbById({'reimb_id':1});
		//Assert 
		expect(result).toBe(true);
	});

	test('should return new user information without password when a new user is given', async()=>{
		expect.hasAssertions();
		mockRepo.saveReimb = jest.fn().mockImplementation((newReimb:Reimbursements)=>{
			return new Promise<Reimbursements>((resolve) => {
				mockReimb.push(newReimb);
				resolve(newReimb);
			});
		});
		//Act 
		let result = await sut.addNewReimb(new Reimbursements(8,324,new Date(),null, 'testing', 3, null,"pending", "other"));
		//Assert 
		expect(result).toBeTruthy();
		expect(mockReimb.length).toBe(6);
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.updateReimb(new Reimbursements(8,324,new Date(),null, 'testing', 3, null,"pending", "other"));
		}catch(e){
			expect(e instanceof BadRequestError).toBe(false);
		}
		
	});
	

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.updateReimb(new Reimbursements(8,324,new Date(),null, '', 3, null,"pending", "other"));
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
			await sut.updateStatus(new Reimbursements(8,324,new Date(),null, 'testing', 3, null,"pending", "other"));
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});

	test('should resolve to Reimb[] when getAllReimb successfully retrieves reimb from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAllByType = jest.fn().mockImplementation((type: string) => {
            return new Promise<Reimbursements[]>((resolve) => resolve(mockReimb.filter(reimbs => reimbs.reimb_type === type)));
        });
		//Act
		let result = await sut.getAllReimbByType("food");
		
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(3);
		
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidStrings = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getAllReimbByType("");
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});
	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		mockRepo.getAllByType = jest.fn().mockReturnValue([])
		//Act
		try{
			await sut.getAllReimbByType("something else");
		}catch(e){
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should resolve to Reimb[] when getAllReimb successfully retrieves reimb from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAllByStatus = jest.fn().mockImplementation((status: string) => {
            return new Promise<Reimbursements[]>((resolve) => resolve(mockReimb.filter(reimbs => reimbs.reimb_status === status)));
        });
		//Act
		let result = await sut.getAllReimbByStatus("pending");
		
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(4);
		
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidStrings = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getAllReimbByStatus("");
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		mockRepo.getAllByStatus = jest.fn().mockReturnValue([])
		//Act
		try{
			await sut.getAllReimbByStatus("something else");
		}catch(e){
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});
});
