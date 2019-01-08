import { EntityRepository, getManager, Repository } from 'typeorm'
import Notification, { NotificationType } from '../entities/Notification'
@EntityRepository(Notification)
export default class NotificationRepository extends Repository<Notification> {

}
