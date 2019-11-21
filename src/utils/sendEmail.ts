import Axios from 'axios'

const sendEmail = async (subject: string, html: string, email: string) => {
	return await Axios.post(`${process.env.TOAST_EMAIL_URL}/email/v1.5/appKeys/${process.env.TOAST_EMAIL_APP_KEY}/sender/mail`, {
		senderAddress: process.env.SENDER_EMAIL,
		senderName: process.env.SENDER_EMAIL_NAME,
		title: subject,
		body: html,
		receiverList: [{
			receiveMailAddr: email,
			receiveType: 'MRT0',
		}],
	}, { headers: {
		'Content-Type': 'application/json',
		'charset': 'UTF-8',
	}})
}

export const sendVerificationEmail = async (email: string, key: string) => {
	const emailSubject = `가입을 환영합니다!`
	const emailBody = `속닥임 가입을 환영합니다.\n인증하기를 눌러 인증을 완료해주시기 바랍니다. <a href="http://${process.env.HOST}/users/verification/${key}">인증하기</a>`
	const result =  await sendEmail(emailSubject, emailBody, email)
	return result.data.header.isSuccessful
}
