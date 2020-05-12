export class Users{
	ers_users_id: number;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	email: string;
	user_role_id: number;

	constructor(user_id: number, un: string, pw: string, fn: string, ln: string, email: string, role: number){
		this.ers_users_id = user_id;
		this.username = un;
		this.password = pw;
		this.first_name = fn;
		this.last_name = ln;
		this.email = email;
		this.user_role_id = role;
	}
}

