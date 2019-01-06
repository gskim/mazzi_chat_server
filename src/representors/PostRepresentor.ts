import * as Entity from 'baiji-entity'

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
				return obj.likes.length
			},
		},
		unlikeCnt: {
			type: 'number',
			get: (obj) => {
				return obj.unlikes.length
			},
		},
		replyCnt: {
			type: 'number',
			get: (obj) => {
				return obj.children.length
			},
		},
	}

	public static postList = new Entity(PostRepresentor.postDefault)

	public static postDetail = new Entity(PostRepresentor.postDefault)
	.add('children', { using: new Entity(PostRepresentor.postDefault)
		.add('children', { using: new Entity(PostRepresentor.postDefault) }) })

}
