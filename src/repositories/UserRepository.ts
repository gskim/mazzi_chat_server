import { EntityRepository, getManager, Repository } from 'typeorm'
import User from '../entities/User'
@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	public async add(user: User) {
		return this.save(user)
	}
	public async get(id: number) {
		return await this.findOne(id)
	}
}
