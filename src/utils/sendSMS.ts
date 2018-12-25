import * as Twilio from 'twilio'

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const sendSMS = (to: string, body: string) => {
	return twilioClient.messages.create({
		body: body,
		to: to,
		from: process.env.TWILIO_PHONE,
	})
}

export const sendVerificationSMS = (to: string, key: string) =>
	sendSMS(to, `인증번호는 [${key}] 입니다.`)
