from flask import request
from extensions import socketio
from flask_jwt_extended import decode_token
from flask_socketio import emit, leave_room
from state import sidToUserid, useridToRoomid, rooms
from extensions import db
from models import Room

@socketio.on("connect")
def handle_connect(auth) :
    print("connect 호출됨")
    print("auth=", auth)

    try :
        token = auth.get("token")
        print("token =", token)
        payload = decode_token(token)
        print("payload =", payload)
        userid = int(payload['sub'])
        print("userid =", userid)

    except Exception as e :
        print("에러 발생:", repr(e))
        return False
        # connect에서 return False하면 연결자체가 거부된다고? 좋다
    
    sidToUserid[request.sid] = userid
    print("연결 완료")

@socketio.on("disconnect")
def handle_disconnect() :
    print("disconnect 호출됨")
    userid = sidToUserid.pop(request.sid, None)
    if userid is None :
        emit("disconnect_error", "disconnect: userid is None")
        return
    roomid = useridToRoomid.pop(userid, None) # 없을 수도 있음
    if roomid is not None :
        leave_room(roomid)
        rooms[roomid]["userids"].pop(userid, None)

        if len(rooms[roomid]["userids"]) == 0 :
            del rooms[roomid]
            Room.query.filter_by(roomname=roomid).delete()
            db.session.commit()
            