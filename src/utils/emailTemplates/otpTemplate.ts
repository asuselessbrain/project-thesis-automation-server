export const otpTemplate = (otp: string) => {
    return (`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
            }
        </style>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px;">
            <tr>
                <td align="center">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        
                        <tr>
                            <td style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px;">
                                Secure Login
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px; color: #333333;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">Hello,</p>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                                    You requested a One-Time Password (OTP) to access your account. Please use the code below to complete your request.
                                </p>

                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <div style="background-color: #eef2f6; padding: 20px; border-radius: 8px; border: 1px dashed #b0c4de; display: inline-block;">
                                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2c3e50; font-family: monospace;">
                                                    ${otp}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #d9534f; font-weight: bold; text-align: center;">
                                    This code expires in 5 minutes.
                                </p>
                                <p style="margin: 0 0 0 0; font-size: 14px; color: #777; text-align: center;">
                                    If you did not request this code, please ignore this email.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                                <p style="margin: 0;">University Project Management System</p>
                                <p style="margin: 5px 0 0 0;">Do not reply to this email.</p>
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
}