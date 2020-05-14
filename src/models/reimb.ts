export class Reimbursements{
	reimb_id: number;
	amount: number;
	submitted: Date;
	resolved: Date;
	description: string;
	author_id: number;
	resolver_id: number;
	reimb_status_id: number;
	reimb_type_id: number;

	constructor(reimb_id: number, amount: number, submitted: Date, resolved: Date, description: string, author: number, resolver: number, status_id: number, type_id: number){
		this.reimb_id = reimb_id;
		this.amount = amount;
		this.submitted = submitted;
		this.resolved = resolved;
		this.description = description;
		this.author_id = author;
		this.resolver_id = resolver;
		this.reimb_status_id = status_id;
		this.reimb_type_id = type_id;
	}
}