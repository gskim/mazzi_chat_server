import * as Entity from 'baiji-entity'
import { plainToClass } from 'class-transformer'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import Chat, { ChatType } from '../entities/Chat'
import User from '../entities/User'

@JsonController('/chats')
export class ChatController {

	@Get('/me')
	public async getMyChatList(
		@CurrentUser() currentUser: User,
	) {
		return await User.findOne(currentUser.id, {
			relations: ['chats'],
		})
	}

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
			users: [currentUser],
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
			if (chat.type === ChatType.PRIVATE) {
				if (!chat.comparePassword(password)) {
					return {
						error: 'password fail',
						data: {},
					}
				}
			}
			chat.users.push(currentUser)
			await chat.save()
			return {
				error: null,
				data: chat,
			}
		}
		throw new NotFoundError('Chat not found')
	}

	@Get('/')
	public async getAllChatList() {
		return await Chat.find({
			relations: ['users'],
			take: 20,
		})
	}
}
