import nodemailer from 'nodemailer';


class SendOTPMail {

    static sendMail = async (userName, userEmail, otp) => {
        /**
         *  Username:	support@superpunters.com
            Password:	Use the email account’s password.
            Incoming Server:	server71.web-hosting.com
            IMAP Port: 993 POP3 Port: 995
            Outgoing Server:	server71.web-hosting.com
            SMTP Port: 465
            IMAP, POP3, and SMTP require authentication.
        * 
        */
        //  console.log(`EMAIL::: , ${process.env.EMAIL_HOST} \n ${process.env.EMAIL_PORT} \n ${process.env.EMAIL_USERNAME}`);

        //  Creating a Transport
        const emailTransporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            // tls: {
            //     rejectUnauthorized: false
            // },
        });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: process.env.EMAIL_SUBJECT,
            html: emailBody(userName, otp),
        }

        //  Send the Mail now with the "emailTransporter" created.
        return await emailTransporter.sendMail(emailData);
    }
}


const emailBody = (userName, otp) => {
    return `
        <html lang="en">
            <head>
                <title>Email Verification</title> 
                <style>
                    body {
                        width: 100%;
                    }
                    .container {
                        margin: 0 auto;
                        width: 700px;
                        background-color: #ffffff;
                        color: dimgrey;
                        border: 1px solid #cbcbcb;
                        padding: 20px;
                    }
                    h2 {
                        text-align: center;
                    }
                    .otp_text {
                        color: black;
                        font-size: 20px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .text_decoration {
                        text-decoration: none;
                    }
                </style>   
            </head>
            
            <body>
                <div class="container">
                    <img src="../assets/images/app_logo1.png" height="50" alt="Super Punter Logo" />
                    <h2>Verify OTP.</h2>
                    <p>
                        Thanks ${userName} for signing up on Talk Deal! <br />
                        Use the following OTP to complete your SignUp process. Kindly know that this OTP is valid for 15 minutes.
                    </p>
                    
                    <br />
                    
                    <h1 class="otp_text">${otp}</h1>
                    
                    <p>
                        For more enquiry and assistance, kindly 
                        <a href="mailto:info@talkdeal.com" class="text_decoration">contact us<a/>.
                    </p>
                <div>
            </body>    
        </html>   
    `
}

export default SendOTPMail;