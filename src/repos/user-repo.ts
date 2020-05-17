import {Users} from  '../models/users';
import {InternalServerError}from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

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
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async getAllByRole(role:string): Promise<Users[]>{
		let client: PoolClient;
		
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where full_user_info.role_name = $1`;
			let rs = await client.query(sql, [role]);
			return rs.rows;
		}catch(e){
			throw new InternalServerError();
		} finally{ 
			client && client.release();
		}
	}

	async getById(id: number): Promise<Users>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where ers_user_id = $1;`;
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		} finally{
			client && client.release();
		}
	}
	async save(newUser: Users):Promise<Users>{		
		let client: PoolClient; 
		try{
			client = await connectionPool.connect();
			let user_role_id = (await client.query('select role_id from ers_user_roles where role_name = $1', [newUser.role_name])).rows[0].role_id;
			
			let sql = `insert into ers_users(username, password, first_name, last_name, email, user_role_id) values($1,$2,$3,$4,$5,$6) returning ers_user_id;`;
			let rs = await client.query(sql, [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email,user_role_id]);
			newUser.ers_user_id = rs.rows[0].ers_users_id;
			return newUser;
		}catch(e){
			throw new InternalServerError();
		} finally{
			client && client.release();
		}
	}

	async getUserByUniqueKey(key: string, val: string): Promise<Users>{
		let client: PoolClient
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where full_user_info.${key} = $1`;
			let rs = await client.query(sql, [val]);
			return mapUserResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}

	async update(updatedUser: Users): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let user_role_id = (await client.query('select role_id from ers_user_roles where role_name = $1', [updatedUser.role_name])).rows[0].role_id;
			
			let sql = `update ers_users set username = $2, password = $3,
			first_name = $4, last_name = $5, email = $6, 
			user_role_id = $7 where ers_user_id = $1`;

			await client.query(sql, [updatedUser.ers_user_id, updatedUser.username, updatedUser.password, updatedUser.first_name, updatedUser.last_name, updatedUser.email, user_role_id]);
			return true;
		}catch(e){
			throw new InternalServerError();
		}finally {
			client && client.release();
		}
	}
	async deleteById(id:number): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = 'delete from ers_users where ers_user_id = $1;';
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async getUserByCreds(username: string, password: string): Promise<Users> {
		let client: PoolClient;
		try {
            client = await connectionPool.connect();
            let sql = `select * from full_user_info where username = $1 and password = $2`;
            let rs = await client.query(sql, [username, password]);
            return rs.rows[0];
        } catch (e) {
            throw new InternalServerError('Error during getUserByCreds method in UserRepo');
        }finally{
			client && client.release();
		}
    }	
	

}
