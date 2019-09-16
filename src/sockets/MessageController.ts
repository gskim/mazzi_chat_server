import { ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController, SocketIO, SocketRooms } from 'socket-controllers'

@SocketController()
export class MessageController {
	public user = []

	@OnConnect()
	public connection(@ConnectedSocket() socket: any) {
		console.log('client connected')
		socket.emit('init', 3)
	}

	@OnDisconnect()
	public disconnect(@ConnectedSocket() socket: any) {
		console.log('client disconnected')
	}

	@OnMessage('init')
	public save(@ConnectedSocket() socket: any, @MessageBody() message: any, @SocketRooms() rooms: any, @SocketIO() io: any) {

	}
}
