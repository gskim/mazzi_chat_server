import * as Entity from 'baiji-entity'

export default class UserRepresentor {

	public static userDefault: UserDefault = {
		nickname: String,
		birthYear: Number,
		birthMonth: Number,
		birthDay: Number,
		createdAt: Date,
		profilePhoto: String,
		isAdult: {
			type: 'boolean',
			get: (obj) => {
				return new Date().getFullYear() - obj.birthYear >= 20
			},
		},
	}
}

export interface UserDefault {
	nickname: StringConstructor,
	birthYear: NumberConstructor,
	birthMonth: NumberConstructor,
	birthDay: NumberConstructor,
	createdAt: DateConstructor,
	isAdult: object,
	profilePhoto: StringConstructor,
}
