import { classToPlain, plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { getManager, LessThan, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Notification, { NotificationType } from '../entities/Notification'
import User from '../entities/User'
import NotificationRepository from '../repositories/NotificationRepository'
@Service()
export default class NotificationService {
	constructor(@InjectRepository(Notification) private readonly notificationRepository: NotificationRepository) {}

	public async addLikeNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.LIKE,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 회원님 게시물을 좋아합니다.`,
		})
		return await notification.save()
	}
}
