import { ConnectedSocket, MessageBody, NspParams, OnConnect, OnDisconnect, OnMessage, SocketController, SocketIO, SocketRooms } from 'socket-controllers'

@SocketController()
export class MessageController {
	public user = []

	@OnConnect()
	public connection(@ConnectedSocket() socket: any) {
		console.log('client connected')
	}

	@OnDisconnect()
	public disconnect(@ConnectedSocket() socket: any) {
		console.log('client disconnected')
	}

	@OnMessage('sendMessage')
	public save(
		@ConnectedSocket() socket: any,
		@MessageBody() message: any,
		@SocketRooms() rooms: any,
		@SocketIO() io: any,
	) {
		io.emit('receiveMessage', '전체')
		socket.emit('receiveMessage', '소켓')
		rooms.emit('receiveMessage', 'room')
	}
}
