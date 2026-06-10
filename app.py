import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, socketio


def create_app():

    app = Flask(__name__)
    load_dotenv()
    # 환경세팅 - o
    db_url = os.getenv("DATABASE_PUBLIC_URL")
    print("DB URL repr =", repr(db_url))
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # extension연결 - o
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    # route연결 - x
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # db초기화 - o
    with app.app_context():
        db.create_all()
        print("db 초기화")

    # health check - o
    @app.route("/")
    def home():
        return {"status": "alive"}

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print("PORT =", port)
    socketio.run(app, host="0.0.0.0", port=port)
    print("여기 찍히면 안 됨")
