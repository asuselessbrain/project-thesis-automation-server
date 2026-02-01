import { config } from "../config";

import nodemailer from "nodemailer";

    const transporter = nodemailer.createTransport({
        host: config.email_host,
        port: Number(config.email_port),
        secure: false,
        auth: {
            user: config.email,
            pass: config.email_password,
        },
    });

const sendEmail = async (options: { to: string; subject: string; html: string }) => {
    

    await transporter.sendMail({
        from: `"Department of CSIT" <${config.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}

export default sendEmail;