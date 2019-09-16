import { classToPlain, plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { getManager, LessThan, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Chat from '../entities/Chat'
import User from '../entities/User'
import ChatRepository from '../repositories/ChatRepository'
@Service()
export default class ChatService {
	@InjectRepository() private readonly chatRepository: ChatRepository

	public async createChat(user: User, params) {
		const chat = plainToClass(Chat, {
			name: params.name,
			description: params.description,
			password: params.password,
			type: params.type,
			users: [user],
		})
		return  await Chat.save(chat)
	}

}
