import {Users} from  '../models/users';
import {InternalServerError}from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';

export class UserRepository{

	baseQuery = `select * from full_user_info`;

	async getAll(): Promise<Users[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs = await client.query(sql);
			return rs.rows;
		}catch(e){
			console.log(e);
			
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
}
