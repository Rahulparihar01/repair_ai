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
    
def send_email(email: str):
    sender = 'rjdream28@gmail.com'
    password = 'xbukbzuubkcxvlfx'

    if not is_valid_email_format(email):
        return "Invalid email format"
    
    if not is_valid_email_domain(email):
        return "Email domain does not have valid"
    
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
                Hello,<br><br>
                We have received your request for processing your video.<br><br>
                Your video is currently being processed. Please allow a few minutes for the process to complete. We will notify you via email once the processing is finished and your images are ready.<br><br>
                Thank you for your patience and for using BestImagePicker!<br>
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
    message['Subject'] = 'Update on Your Video Processing Request'
    message.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender, password)
        server.sendmail(sender, email, message.as_string())
        server.quit()
        return "Email sent successfully"
    except smtplib.SMTPException as e:
        return f"Failed to send email: {e}"


def send_processing_complete_email(email: str):
    sender = 'rjdream28@gmail.com'
    password = 'xbukbzuubkcxvlfx'

    if not is_valid_email_format(email):
        return "Invalid email format"
    
    if not is_valid_email_domain(email):
        return "Email domain does not have valid"
    
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
                Hello,<br><br>
                Your video processing is complete, and the images have been successfully generated.<br><br>
                Please check your images in the "Saved Images" folder in the BestImagePicker app.<br><br>
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
    message['Subject'] = 'Your Video Processing is Complete'
    message.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender, password)
        server.sendmail(sender, email, message.as_string())
        server.quit()
        return "Email sent successfully"
    except smtplib.SMTPException as e:
        return f"Failed to send email: {e}"

def send_processing_error_email(email: str):
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
                Hello,<br><br>
                We encountered an issue while processing your video.<br><br>
                Unfortunately, the video could not be processed successfully or it took longer than expected. We apologize for the inconvenience.<br><br>
                Please try uploading your video again or contact our support team for further assistance.<br><br>
                Thank you for your understanding and for using BestImagePicker!<br>
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
    message['Subject'] = 'Issue with Your Video Processing'
    message.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender, password)
        server.sendmail(sender, email, message.as_string())
        server.quit()
        return "Email sent successfully"
    except smtplib.SMTPException as e:
        return f"Failed to send email: {e}"
