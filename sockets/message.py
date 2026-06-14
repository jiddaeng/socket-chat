from flask import request
from extensions import socketio, db
from state import sidToUserid, useridToRoomid
from flask_socketio import emit
from models import Message, User

print("message.py import됨")

@socketio.on("send_message")
def handle_send_message(data) :
    print("send_message 호출됨")
    userid = sidToUserid.get(request.sid)
    if userid is None :
        emit("message_error", "message: userid is None")
        return
    user = db.session.get(User, userid)
    if user is None:
        emit("message_error", "message: user not found")
        return    
    roomid = useridToRoomid.get(userid)
    if roomid is None :
        emit("message_error", "message: roomid is None")
        return
    
    content = data.get("content")
    if content is None :
        emit("message_error", "message: content is None")
        return
    if not isinstance(content, str):
        emit("message_error", "content must be string")
        return
    if not content.strip() :
        emit("message_error", "content is empty")
        return

    message = Message(room_id=roomid, user_id=userid, content=content)
    db.session.add(message)
    db.session.commit()


    emit("message_success", 
        {
            "message_id": message.id, 
            "message":content, 
            "userid":userid, 
            "username":user.username
        }, 
        room=roomid
    )