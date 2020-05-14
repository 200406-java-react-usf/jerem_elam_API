import {Reimbursements} from '../models/reimb';
import {InternalServerError}from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class ReimbRepository{
	baseQuery = `select * from full_reimbursements_info`;

	async getAll(): Promise<Reimbursements[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs = await client.query(sql)
			return rs.rows;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}

	async getById(id: number): Promise<Reimbursements>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where reimb_id = $1`
			let rs = await client.query(sql, [id])
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}

	async getReimbByUniqueKey(key: string, val: string): Promise<Reimbursements>{
		let client: PoolClient
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where full_reimbursements_info.${key} = $1`;
			let rs = await client.query(sql, [val]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}

	async getAllByType(type: string): Promise<Reimbursements[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where reimb_type = $1 `;
			let rs = await client.query(sql, [type]);
			return rs.rows
		}catch(e){
			throw new InternalServerError();
		}
	}

	async getAllByStatus(status: string): Promise<Reimbursements[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where reimb_type = $1 `;
			let rs = await client.query(sql, [status]);
			return rs.rows
		}catch(e){
			throw new InternalServerError();
		}
	}

	async updateReimb(reimb_id: number, updateStatus: string, resolver_id: number):  Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let status_id = (await client.query('select reimb_status_id from ers_reimbursement_statuses where reimb_status = $1'[updateStatus])).rows[0].reimb_status_id;
			let currentTime = (await client.query('SELECT CURRENT_TIMESTAMP'));
			let sql = 'update ers_reimbursements set resolved = $2, resolver_id = $3, reimb_status_id = $4 where reimb_id = $1';
			await client.query(sql,[reimb_id, currentTime, resolver_id, status_id]);
			return true;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}

}
