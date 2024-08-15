from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import os
import smtplib, ssl

def lambda_handler(event, context):
    request = json.loads(event['body'])
    if 'name' in request and 'email' in request and 'message' in request:
        sent_from = 'hrushikeshspython@gmail.com'
        gmail_password = os.environ.get('GMAIL_APP_PASSWORD')
        sent_to = 'hrushikeshrv@gmail.com'

        user_email = request['email']
        user_name = request['name'] or user_email
        message_body = request['message']
        subject = request['subject'] if 'subject' in request else f'Message from {user_name}'

        message = MIMEMultipart('alternative')
        message['Subject'] = subject or f'Contact From {user_name}'
        message['From'] = sent_from
        message['To'] = sent_to


        body = f"""
            <html><head></head><body>
            <p>
            <strong>From</strong> - {user_email}<br>
            <strong>Name</strong> - {user_name}<br>
            <strong>Subject</strong> - {subject}<br>
            </p><br>

            {message_body}
            </body></html>
        """.strip()
        message.attach(MIMEText(body, 'html'))

        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
                server.login(sent_from, gmail_password)
                server.sendmail(sent_from, sent_to, message.as_string())
            return {
                'statusCode': 200,
                'body': json.dumps(message.as_string())
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': str(e)
            }
    return {
        'statusCode': 400,
        'body': '"name", "email", and "message" required in POST body.'
    }