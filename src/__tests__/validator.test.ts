import {isValidId,
	isValidStrings,
	isValidObject,
	isEmptyObject,
	isPropertyOf} from '../util/validators';
import {Users} from '../models/users';
import {Reimbursements} from '../models/reimb';


describe('validator', ()=>{
	test('should return tru when isValid is provided a valid id',()=>{
		//Arrange 
		expect.assertions(3);
		//Act 
		let result1 = isValidId(1);
		let result2 = isValidId(2);
		let result3 = isValidId(3);
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return false when isValid is provided falsy id',()=>{
		//Arrange
		expect.assertions(3);
		//Act 
		let result1 = isValidId(NaN);
		let result2 = isValidId(0);
		let result3 = isValidId(Number(null));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return false when isValid is provided a negative number', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isValidId(-3);
		let result2 = isValidId(-188);
		let result3 = isValidId(Number(-1));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return false when isValid is provided a decimal value', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isValidId(3.25);
		let result2 = isValidId(100.234);
		let result3 = isValidId(0.01);
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when a isValidString is provided a valid string', ()=>{
		//Arrange
		expect.assertions(3);
		//Act
		let result1 = isValidStrings('This is a valid string');
		let result2 = isValidStrings('this','is','also','a','valid','string');
		let result3 = isValidStrings(String('more'), String('valid'), String('strings'));
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return false when isValidString is given an invalid string', ()=>{
		//Arrange
		expect.assertions(3);
		//Act 
		let result1 = isValidStrings('');
		let result2 = isValidStrings('this is valid', '', 'the middle is not');
		let result3 = isValidStrings(String(''), String('the first string is not valid'));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when a valid object is passed through isValidObject with no nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(2);
		//Act
		let result1 = isValidObject(new Users(1,'lazyspell','password', 'jeremy', 'elam', 'jeremyelam@gmail.com','admin'));
		let result2 = isValidObject(new Reimbursements(1,300.32,new Date(), new Date(), 'testing', 3, 4, 'pending', 'other'));
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
	});
	test('should return true when isValidObject is provided a valid object with nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(2);
		//Act
		let result1 = isValidObject(new Users(0,'lazyspell','password', 'jeremy', 'elam', 'jeremyelam@gmail.com','admin'),"ers_user_id");
		let result2 = isValidObject(new Reimbursements(1,300.32,new Date(), new Date(), 'testing', 0, 4, 'pending', 'other'),'author_id');
		//Asset
		expect(result1).toBe(true);
		expect(result2).toBe(true);
	});

	test('should return false when an invalid object is passed to isValidObject validator with no nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(2);
		//Act
		let result1 = isValidObject(new Users(1,'lazyspell','password', '', 'elam', 'jeremyelam@gmail.com','admin'));
		let result2 = isValidObject(new Reimbursements(1,300.32,new Date(), new Date(), '', 3, 4, 'pending', 'other'));
		//Asset
		expect(result1).toBe(false);
		expect(result2).toBe(false);
	});

	test('should return false when isValidObject is provided invalid object with some nullable prop(s)', ()=>{
		//Arrange
		expect(2);
		//Act
		let result1 = isValidObject(new Users(0,'lazyspell','password', 'jeremy', '', 'jeremyelam@gmail.com','admin'),"ers_user_id");
		let result2 = isValidObject(new Reimbursements(1,300.32,new Date(), new Date(), '', 0, 4, 'pending', 'other'),'author_id');
		//Asset
		expect(result1).toBe(false);
		expect(result2).toBe(false);
	});

	test('should return true when isPropertyOf is Provided a known property of a given constructable type', ()=>{
		// Arrange
		expect.assertions(2);
		// Act
		let result1 = isPropertyOf('ers_user_id', Users);
		let result2 = isPropertyOf('description', Reimbursements);
		// Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
	});

	test('should return true when isPropertyOf is Provided an unknown property of a given constructable type', ()=>{
		// Arrange
		expect.assertions(2);
		// Act
		let result1 = isPropertyOf('id', Users);
		let result2 = isPropertyOf('id_author', Reimbursements);
		// Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
	});

	test('should return true when isPropertyOf is Provided a non-constructable type', ()=>{
		// Arrange
		expect.assertions(4);

		// Act
		let result1 = isPropertyOf('this doesn\'t look good', {x: 'not a valid'});
		let result2 = isPropertyOf(':shrug:', 2);
		let result3 = isPropertyOf('false', false);
		let result4 = isPropertyOf('won\'t work', Symbol('huehuehue'));

		// Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
		expect(result4).toBe(false);

	});
	
	test('should return true when isEmptyObject is provided an empty object', ()=>{
		//Arrange 
		expect.assertions(1);
		//Act
		let result = isEmptyObject({});
		//Assert
		expect(result).toBe(true);
	});

	test('should return false when isEmptyObject is provided an non-empty object', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isEmptyObject({key:'value'});
		let result2 = isEmptyObject({not:'empty'});
		let result3 = isEmptyObject({has:'stuff'});


		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});
});