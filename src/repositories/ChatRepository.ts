import { EntityRepository, getManager, Repository } from 'typeorm'
import Chat from '../entities/Chat'
@EntityRepository(Chat)
export default class ChatRepository extends Repository<Chat> {

}
