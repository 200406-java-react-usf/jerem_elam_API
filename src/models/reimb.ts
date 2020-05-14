export class Reimbursements{
	reimb_id: number;
	amount: number;
	submitted: Date;
	resolved: Date;
	description: string;
	author_id: number;
	resolver_id: number;
	reimb_status: string;
	reimb_type: string;

	constructor(reimb_id: number, amount: number, submitted: Date, resolved: Date, description: string, author: number, resolver: number, status_id: string, type_id: string){
		this.reimb_id = reimb_id;
		this.amount = amount;
		this.submitted = submitted;
		this.resolved = resolved;
		this.description = description;
		this.author_id = author;
		this.resolver_id = resolver;
		this.reimb_status = status_id;
		this.reimb_type = type_id;
	}
}