import { Field, InputType } from 'type-graphql'
import User from '../entities/User'

@InputType()
export class UserInput implements Partial<User> {
	@Field({ nullable: true })
	public email?: string

	@Field()
	public birthYear: number

	@Field()
	public birthMonth: number

	@Field()
	public birthDay: number
}
