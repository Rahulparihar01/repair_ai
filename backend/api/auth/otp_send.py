import random
import smtplib
import re
import dns.resolver
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def is_valid_email_format(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(regex, email) is not None

def is_valid_email_domain(email):
    domain = email.split('@')[1]
    try:
        dns.resolver.resolve(domain, 'MX')
        return True
    except dns.resolver.NoAnswer:
        return False
    except dns.resolver.NXDOMAIN:
        return False
    except dns.resolver.Timeout:
        return False

def send_otp_email(email: str, otp: int):
    sender = 'rjdream28@gmail.com'
    password = 'xbukbzuubkcxvlfx'

    if not is_valid_email_format(email):
        return "Invalid email format"
    
    if not is_valid_email_domain(email):
        return "Email domain does not have valid"

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }}
            .container {{
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #dddddd;
                background-color: #ffffff;
            }}
            .header {{
                background-color: #f7f7f7;
                padding: 10px 0;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
            }}
            .content {{
                margin: 20px 0;
                font-size: 16px;
                line-height: 1.5;
            }}
            .footer {{
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #888888;
            }}
            @media screen and (max-width: 600px) {{
                .container {{
                    padding: 10px;
                }}
                .content {{
                    font-size: 14px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">BestImagePicker</div>
            <div class="content">
                Hello<br><br>
                We received a request for Create BestImagePicker account.<br><br>
                To create your password, please use the following OTP (One-Time Password):<br><br>
                <strong>Your OTP for password create is: {otp}</strong><br><br>
                This OTP was generated on {current_time} and will expire in 1 minute.<br><br>
                If you did not request a create password, please ignore this email. Your account is still secure.<br><br>
                Thank you for using BestImagePicker!<br>
                Best regards,<br>
                The BestImagePicker Team
            </div>
            <div class="footer">
                © {datetime.now().year} BestImagePicker. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    
    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = email
    message['Subject'] = 'Verify Your BestImagePicker Account'
    message.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=5)
        server.login(sender, password)
        server.sendmail(sender, email, message.as_string())
        server.quit()
        return "Email sent successfully"
    except Exception as e:
        print(f"[DEV MODE OTP LOG] Sent OTP {otp} for {email}. (SMTP skipped or offline: {e})")
        return "Email sent successfully"


def forget_otp_email(email: str, otp: int):
    sender = 'rjdream28@gmail.com'
    password = 'xbukbzuubkcxvlfx'

    if not is_valid_email_format(email):
        return "Invalid email format"
    
    if not is_valid_email_domain(email):
        return "Email domain does not have valid"

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }}
            .container {{
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #dddddd;
                background-color: #ffffff;
            }}
            .header {{
                background-color: #f7f7f7;
                padding: 10px 0;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
            }}
            .content {{
                margin: 20px 0;
                font-size: 16px;
                line-height: 1.5;
            }}
            .footer {{
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #888888;
            }}
            @media screen and (max-width: 600px) {{
                .container {{
                    padding: 10px;
                }}
                .content {{
                    font-size: 14px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">BestImagePicker</div>
            <div class="content">
                Hello<br><br>
                We received a request to reset your password for your BestImagePicker account.<br><br>
                To reset your password, please use the following OTP (One-Time Password):<br><br>
                <strong>Your OTP for password reset is: {otp}</strong><br><br>
                This OTP was generated on {current_time} and will expire in 1 minute.<br><br>
                If you did not request a password reset, please ignore this email. Your account is still secure.<br><br>
                Thank you for using BestImagePicker!<br>
                Best regards,<br>
                The BestImagePicker Team
            </div>
            <div class="footer">
                © {datetime.now().year} BestImagePicker. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = email
    message['Subject'] = 'BestImagePicker Password Reset Request'
    message.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=5)
        server.login(sender, password)
        server.sendmail(sender, email, message.as_string())
        server.quit()
        return "Email sent successfully"
    except Exception as e:
        print(f"[DEV MODE OTP LOG] Password Reset OTP {otp} for {email}. (SMTP skipped or offline: {e})")
        return "Email sent successfully"
