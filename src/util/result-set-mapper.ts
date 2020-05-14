import {UserSchema} from './schemas';
import {ReimbursementsSchema} from './schemas';
import {Users} from '../models/users';
import {Reimbursements} from '../models/reimb';

export function mapUserResultSet(resultSet: UserSchema){
	if(!resultSet){
		return {} as Users;
	}
	return new Users(
		resultSet.ers_user_id,
		resultSet.username,
		resultSet.password,
		resultSet.first_name,
		resultSet.last_name,
		resultSet.email,
		resultSet.role_name
	)
}

export function mapReimbursementsSet(resultSet: ReimbursementsSchema){
	if(!resultSet){
		return {} as Reimbursements;
	}
	return new Reimbursements(
		resultSet.reimb_id,
		resultSet.amount,
		resultSet.submitted,
		resultSet.resolved,
		resultSet.description,
		resultSet.author_id,
		resultSet.resolver_id,
		resultSet.reimb_status,
		resultSet.reimb_type
	)
}