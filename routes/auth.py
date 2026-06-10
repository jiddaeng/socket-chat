from flask import Blueprint, request, jsonify
from models import User
from extensions import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/login', methods=["POST"]) # req: {"username":"~~"}
def login() :
    data = request.get_json()   
    username = data.get("username")

    if not username :
        return jsonify({"message": "아이디를 입력하세요."}), 400
    
    existing = User.query.filter_by(username=username).first()
    if existing:
        return jsonify({"message": "이미 존재하는 아이디입니다."}), 409
    
    user = User(username=username)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "회원가입(로그인) 성공", "username":username}), 201