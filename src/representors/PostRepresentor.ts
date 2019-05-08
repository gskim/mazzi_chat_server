import * as Entity from 'baiji-entity'
Entity.types = {
	string: { default: null },
	number: { default: null },
	boolean: { default: false },
	date: { format: 'iso', default: null },
	object: { default: {} },
}

export default class PostRepresentor {

	public static postDefault = {
		id: Number,
		text: String,
		createdAt: Date,
		status: String,
		image: {
			name: String,
		},
		user: {
			nickname: String,
			profilePhoto: String,
		},
		likeCnt: {
			type: 'number',
			get: (obj) => {
				return obj.likes.filter((like) => like.status).length
			},
		},
		unlikeCnt: {
			type: 'number',
			get: (obj) => {
				return obj.unlikes.filter((unlike) => unlike.status).length
			},
		},
		replyCnt: {
			type: 'number',
			get: (obj) => {
				let replyCount = 0
				if (obj.children) {
					for (const child of obj.children) {
						if (child.children) {
							replyCount = replyCount + child.children.length
						}
					}
					replyCount = obj.children.length + replyCount
				}
				return replyCount
			},
		},
	}

	public static postList = new Entity(PostRepresentor.postDefault)

	public static postDetail = new Entity(PostRepresentor.postDefault)
		.add('children', {
			using: new Entity(PostRepresentor.postDefault)
				.add('children', { using: new Entity(PostRepresentor.postDefault) }),
		})

}
