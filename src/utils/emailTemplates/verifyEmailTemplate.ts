export const verifyEmailTemplate = (verifyUrl: string) => {
    return (
        `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Responsive styles for mobile */
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                .button { width: 100% !important; display: block !important; text-align: center !important; }
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px;">
            <tr>
                <td align="center">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        
                        <tr>
                            <td style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold;">
                                Department of Computer Science & Information Technology
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px; text-align: left; color: #333333;">
                                <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #2c3e50;">Hello,</h2>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                                    Thank you for registering with the University Thesis & Project Management System. 
                                    To activate your account and access your dashboard, please verify your email address.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${verifyUrl}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                Verify Now
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                                    This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 10px 0;">Button not working? Copy and paste the link below into your browser:</p>
                                <p style="margin: 0; word-break: break-all;">
                                    <a href="${verifyUrl}" style="color: #3b82f6;">${verifyUrl}</a>
                                </p>
                                <br>
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} University Project System. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    </body>
    </html>
    `
    )
};