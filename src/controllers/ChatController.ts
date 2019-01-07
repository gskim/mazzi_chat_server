import * as Entity from 'baiji-entity'
import { plainToClass } from 'class-transformer'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import Chat, { ChatType } from '../entities/Chat'
import User from '../entities/User'

@JsonController('/chats')
export class ChatController {
	@Post('/')
	public async createOpenChat(
		@CurrentUser() currentUser: User,
		@BodyParam('name') name: string,
		@BodyParam('description') description: string,
		@BodyParam('type') type: ChatType,
		@BodyParam('password') password: string,
	) {
		const chat = plainToClass(Chat, {
			name: name,
			description: description,
			password: password,
			type: type,
			users: currentUser,
		})
		const createdChat = await Chat.save(chat)
		return {
			error: null,
			data: createdChat,
		}
	}

	@Post('/:id')
	public async joinChat(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
		@BodyParam('password') password: string,
	) {
		const chat = await Chat.findOne(id, {
			relations: ['users'],
		})
		if (chat) {
			if (chat.maxPersons === chat.users.length) {
				return {
					error: 'room is full',
					data: {},
				}
			}
			if (chat.comparePassword(password)) {
				chat.users.push(currentUser)
				await chat.save()
				return {
					error: null,
					data: chat,
				}
				// const user = await User.findOne(currentUser.id, {
				// 	relations: ['chats'],
				// })
				// if (user) {
				// 	user.chats.push(plainToClass(Chat, {
				// 		id: id,
				// 	}))
				// 	await user.save()
				// 	return {
				// 		error: null,
				// 		data: chat,
				// 	}
				// }
				// throw new NotFoundError('User not found')
			}
		}
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
