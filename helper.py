from flask_socketio import emit

class ErrorMsg :
    def __init__(self, errorType) :
        self.errorType = errorType

    def __call__(self, msg) :
        emit(self.errorType, {"message":msg})