export interface UserSchema{
	ers_user_id: number;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	email: string;
	role_name: string;
}

export interface ReimbursementsSchema{
	reimb_id: number;
	amount: number;
	submitted: Date;
	resolved: Date;
	description: string;
	author_id: number;
	resolver_id: number;
	reimb_status: string;
	reimb_type: string;
}