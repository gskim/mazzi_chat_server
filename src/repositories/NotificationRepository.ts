import { EntityRepository, getManager, Repository } from 'typeorm'
import Notification, { NotificationType } from '../entities/Notification'
import NotificationOrderSequence from '../entities/NotificationOrderSequence'
@EntityRepository(Notification)
export default class NotificationRepository extends Repository<Notification> {

	public async add(notification: Notification) {
		const notificationOrderSequence = await NotificationOrderSequence.save(new NotificationOrderSequence())
		notification.orderId = notificationOrderSequence.id * -1
		return await notification.save()
	}
}
