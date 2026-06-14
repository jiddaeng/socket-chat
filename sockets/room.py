from flask import request
from extensions import socketio
from flask_socketio import emit, join_room
from extensions import db
from models import User, Room
from state import rooms, sidToUserid, useridToRoomid

@socketio.on("create_room")
def handle_create_room(data) :
    print("create_room 호출됨")
    roomname = data.get("roomname")
    if roomname is None :
        emit("create_room_error", "create_room: roomname is None")
        return
    if roomname in rooms :
        emit("create_room_error", "room already exists")
        return
    
    
    # 아 그러네 중복 검사를 안 했네
    # 뭐 만들땐 이 2개 검사는 무조건 하기
    userid = sidToUserid.get(request.sid)
    if userid is None :
        emit("create_room_error", "create_room: userid is None")
        return
    if userid in useridToRoomid:
        emit("create_room_error", "already in room")
        return
    user = db.session.get(User, userid)
    # 아 진짜 모두 이상적으로 해주면 좋겟다
    if user is None:
        emit("create_room_error", "user not found")
        return
    username = user.username
    
    roomid = roomname
    rooms[roomid] = {
        "userids": {
            userid: username
        }
    }
    
    useridToRoomid[userid] = roomid
    join_room(roomid)

    emit("create_room_success", {"roomname":roomname}) # 어차피 프론트에 roomname있으니까 그냥 대충 메세지만 보내기
    # 이렇게 해줘야 모든 프론트가 보지 그럼 프론트 편하게 데이터형식 바꿔야지
    # 아 그냥 get_list 같은걸로 하면 되는구나
    # 근데 그럼 이거 필요없잖아. 아니 애초에 socket에서 return 못 보내잖아. 나 뭐하냐
    # ㄴ ㅇㅈ 바보 맞는 듯ㅋ
    # 안윤호 바보
    

@socketio.on("join_room")
def handle_join_room(data) :
    print("join_room 호출됨")
    userid = sidToUserid.get(request.sid)
    if userid is None :
        emit("join_room_error", "join_room: userid is None")
        return
    if userid in useridToRoomid :
        emit("join_room_error", "join_room: userid already exists")
        return
    
    roomid = data.get("roomid")
    if roomid is None :
        emit("join_room_error", "join_room: roomid is None")
        return
    room = rooms.get(roomid)
    if room is None:
        emit("join_room_error", "join_room: room not found")
        return
    user = db.session.get(User, userid)
    if user is None :
        emit("join_room_error", "join_room: user is None")
        return
    useridToRoomid[userid] = roomid
    username = user.username
    room["userids"][userid] = username
    join_room(roomid)
    db.session.add(Room, roomname=roomid)
    db.session.commit()
    emit("join_room_success", {"roomname":roomid})