from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import os
import smtplib, ssl
import base64

sent_from = 'hrushikeshspython@gmail.com'
gmail_password = os.environ.get('GMAIL_APP_PASSWORD')
sent_to = 'hrushikeshrv@gmail.com'

def lambda_handler(event, context):
    is_minimal = False
    try:
        request = json.loads(event['body'])
    except:
        request = event['body']
        is_minimal = True
    if is_minimal:
        # Ignore requests from Assetnote (automated vulnerability scanning)
        if 'assetnote' in event.get('headers', {}).get('User-Agent', '').lower():
            return {
                'statusCode': 200
            }
        print(f'Received minimal request from event: {event}')
        if isinstance(request, bytes):
            request = request.decode('utf-8', errors='ignore')
        if event.get('isBase64Encoded'):
            request = base64.b64decode(request).decode('utf-8', errors='ignore')
        if len(request.strip()) == 0:
            return {
                'statusCode': 200,
                'body': 'Request body is empty'
            }

        message = MIMEText(request, 'plain', 'utf-8')
        message['Subject'] = "Anonymous Message Shared"
        message['From'] = sent_from
        message['To'] = sent_to
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
                server.login(sent_from, gmail_password)
                server.sendmail(sent_from, sent_to, message.as_string())
            return {
                'statusCode': 200,
                'body': "Email sent successfully"
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': str(e)
            }


    if 'name' in request and 'email' in request and 'message' in request:
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
            </p>
            
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
