import * as Mailgun from 'mailgun-js'

const mailGunClient = new Mailgun({
	apiKey: process.env.MAILGUN_API_KEY || '',
	domain: 'sandbox07e7242170ff46c59993d6afa44c9525.mailgun.org',
})

const sendEmail = async (subject: string, html: string) => {
	console.log(process.env.MAILGUN_API_KEY)
	const emailData = {
		from: 'iphone1987@naver.com',
		to: 'kiseon1987@gmail.com',
		subject: subject,
		html: html,
	}
	return await mailGunClient.messages().send(emailData)
}

export const sendVerificationEmail = async (fullName: string, key: string) => {
	const emailSubject = `Hello! ${fullName}, please verify your email`
	const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`
	return await sendEmail(emailSubject, emailBody)
}
