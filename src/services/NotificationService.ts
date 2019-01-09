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
		return await this.notificationRepository.add(notification)
	}

	public async addUnlikeNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.UNLIKE,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 회원님 게시물을 싫어합니다.`,
		})
		return await this.notificationRepository.add(notification)
	}

	public async addReplyNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.REPLY,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 회원님 게시물에 댓글을 작성하였습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}

	public async addInviteNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.INVITE,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 회원님께 대화 요청을 보냈습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}

	public async addAcceptNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.ACCEPT,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 회원님의 대화 요청을 수락했습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}

	public async addLeaveNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.LEAVE,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 대화방을 떠났습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}

	public async addExpireNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.EXPIRE,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `대화방 종료시간이 얼마 남지 않았습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}
	public async addExtendNotification(receiveUser: User, sendUser: User, targetId: number) {
		const notification = plainToClass(Notification, {
			targetId: targetId,
			type: NotificationType.EXTEND,
			sendUser: sendUser,
			receiveUser: receiveUser,
			text: `${sendUser.nickname}님이 대화방 기간을 연장하였습니다.`,
		})
		return await this.notificationRepository.add(notification)
	}
}
