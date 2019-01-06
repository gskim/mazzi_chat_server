import * as Entity from 'baiji-entity'
import { plainToClass } from 'class-transformer'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import Chat from '../entities/Chat'
import User from '../entities/User'

@JsonController('/chats')
export class ChatController {
	@Post('/')
	public async createChat(
		@CurrentUser() currentUser: User,
	) {
		const chat = plainToClass(Chat, {
			users: currentUser,
		})
		return await Chat.save(chat)
	}

	@Post('/:id')
	public async joinChat(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
	) {
		const user = await User.findOne(currentUser.id, {
			relations: ['chats'],
		})
		if (user) {
			user.chats.push(plainToClass(Chat, {
				id: id,
			}))
			return await user.save()
		}
		throw new NotFoundError('User not found')
	}

	@Get('/')
	public async chats() {
		return await Chat.find({
			relations: ['users'],
		})
	}

	@Get('/users')
	public async users() {
		return await User.findOne(9, {
			relations: ['chats'],
		})
	}
}
