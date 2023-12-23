import pyautogui
import cv2
import numpy as np
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request
from flask_cors import CORS
import threading
from flask import Response
import io
from flask import send_file

app = Flask(__name__)
CORS(app)

recording_started  = False
out = None
out_lock = threading.Lock()

def start_video_recording(output_file):
    global out
    global recording_started
    screen_width, screen_height = pyautogui.size()
    with out_lock:
        recording_started = True
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_file, fourcc, 10.0, (screen_width, screen_height))
    try:
        while recording_started:
            img = pyautogui.screenshot()
            frame = np.array(img)
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            out.write(frame)
            time.sleep(0.1)
    except Exception as e:
        print(f"Error during recording: {e}")
    stop_video_recording()


def stop_video_recording():
    global out
    global recording_started
    with out_lock:
        recording_started = False
        if out is not None:
            out.release()

def send_email(sender_email, sender_password, recipient_emails, message='<p>About the meeting</p>', title='About the meeting'):
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = ", ".join(recipient_emails)
    msg["Subject"] = title
    msg.attach(MIMEText(message, "html"))
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_emails, msg.as_string())

@app.route('/start-video', methods=['GET'])
def start_video():
    global recording_started
    if not recording_started:
        output_file = f'public/videoRecords/output.mp4'
        threading.Thread(target=start_video_recording, args=(output_file,)).start()
        return 'Video recording started'
    else:
        return 'Video recording is already in progress'

@app.route('/stop-video', methods=['GET'])
def stop_video():
    global recording_started
    if recording_started:
        threading.Thread(target=stop_video_recording).start()
        return 'Video recording stopped and saved'
    else:
        return 'No video recording in progress'

@app.route('/screen-shot', methods=['GET'])
def screen_shot():
    img = pyautogui.screenshot()
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    return Response(img_io.getvalue(), mimetype='image/png', headers={
        'Content-Disposition': 'attachment;filename=screenshot.png'
    })

@app.route('/send-mail', methods=['POST'])
def send_mail():
    data = request.get_json()
    message = data.get('message', '<p>About the meeting</p>')
    title = data.get('title', 'About the meeting') 
    sender_email = "syedkhalander66@gmail.com"
    sender_password = "dwtx buxw gdzj vzfc"
    recipient_emails = ["syedkhalander66@gmail.com", "kinglocker00@gmail.com"]
    send_email(sender_email, sender_password, recipient_emails, message, title)
    return 'Email sent successfully'

@app.route('/download-video', methods=['GET'])
def download_video():
    try:
        key = request.args.get('key', 'ScreenRecord')
        video_path = 'public/videoRecords/output.mp4' 
        with open(video_path, 'rb') as video_file:
            video_data = video_file.read()
        
        video_stream = io.BytesIO(video_data)
        video_stream.seek(0)
        
        return send_file(video_stream, mimetype='video/mp4', as_attachment=True,
                        download_name='output.mp4')
    except Exception as e:
        print(f"Error: {e}")
        return str(e), 500
    
if __name__ == '__main__':
    app.run(debug=True)
