from flask import Blueprint, request, jsonify
from models import Room
from extensions import db

room_bp = Blueprint("room", __name__)

@room_bp.route('/madeRoom', methods=['POST']) # req: {"roomname": "~~"}
def madeRoom() :
    data = request.get_json()
    roomname = data.get("roomname")
    
    if not roomname :
        return jsonify({"message": "방이름을 입력하세요."}), 400
    
    existing = Room.query.filter_by(roomname=roomname).first()
    if existing:
        return jsonify({"message": "이미 존재하는 이름입니다."}), 409
    
    room = Room(roomname=roomname)
    db.session.add(room)
    db.session.commit()