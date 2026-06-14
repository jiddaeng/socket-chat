from extensions import db
from datetime import datetime

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    # password = db.Column(db.String(20), unique=True, nullable=False)


class Room(db.Model):
    room_id = db.Column(db.Integer, primary_key=True)
    roomname = db.Column(db.String(20), unique=True, nullable=False) # 근데 이거 좀 비효율적인데 roomid가 roomname이잖아 괜히 헷갈릴 거 같은데
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# class RoomMember(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     room_id = db.Column(db.Integer)
#     user_id = db.Column(db.Integer)

#     joined_at = db.Column(db.DateTime, default=datetime.utcnow)
#     is_admin = db.Column(db.Boolean)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey("room.room_id"), nullable=False)
    user_id = db.Column(db.Integer, db.foreignKey("user.user_id"), nullable=False)

    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
