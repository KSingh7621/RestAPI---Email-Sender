const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')

AWS.config.update({ region: process.env.SES_REGION })

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({ apiVersion: '2010-12-01' }),
})

module.exports.sendEmail = async (event) => {
  const { receiver_email, subject, body_text } = JSON.parse(event.body)

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: receiver_email,
    subject: subject,
    text: body_text,
  }

  try {
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send email',
        error: error.message,
      }),
    }
  }
}
