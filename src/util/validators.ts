/**
 * Checks to see if the Number passed in is a valid ID Number
 * @param id 
 */
export const isValidId = (id: number): boolean =>{
	return !!(id && typeof id === 'number' && Number.isInteger(id) && id > 0);
};

/**
 * Checks to see if the string passed in is an actual string
 * @param strs 
 */
export const isValidStrings = (...strs: string[]): boolean => {
	return (strs.filter(str => !str || typeof str !== 'string').length == 0);
};

/**
 * checks to see if the object passed in is a real object not a fasly object
 * @param obj 
 * @param nullableProps 
 */
export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
	return obj && Object.keys(obj).every(key => {
		if (nullableProps.includes(key)) return true;
		return obj[key];
	});
};

/**
 * checks to see if the key value passed in is a property of the constructor you're checking
 * @param prop 
 * @param type 
 */
export const isPropertyOf = (prop: string, type: any) =>{
	if(!prop || !type){
		return false;
	}
	let typeCreator = <T>(Type: (new()=>T)): T =>{
		return new Type();
	};
	let tempInstance; 
	try{
		tempInstance = typeCreator(type);
	}catch{
		return false;
	}
	return Object.keys(tempInstance).includes(prop);
};

/**
 * checks to see if an object passed in is empty
 * @param obj 
 */
export function isEmptyObject<T>(obj: T){
	return obj && Object.keys(obj).length === 0;
}



export default{
	isValidId,
	isValidStrings,
	isValidObject,
	isEmptyObject,
	isPropertyOf
};