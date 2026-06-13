const { io } = require("socket.io-client");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4MTM2Mjk2NCwianRpIjoiMjhiNWRhMzQtYjNkZS00MjczLTk4Y2YtMGM0YTU2MGQzOGRjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEwIiwibmJmIjoxNzgxMzYyOTY0LCJjc3JmIjoiZmJkMGIxNDYtM2I1Mi00MDMzLTkyMTctMzdkM2I0OTk2MzZmIiwiZXhwIjoxNzgxMzYzODY0fQ.J80ZJcBC8rN5hpAiwi-WoTOFQqqtFCImzvgaiZeiwDU";

const socket = io("http://localhost:5000", {
    auth: {
        token: TOKEN
    }
});

socket.on("connect", () => {
    console.log("연결 성공");
    console.log("sid:", socket.id);

    // 방 생성 테스트
    socket.emit("create_room", {
        roomname: "testroom"
    });

    // 또는 방 참가 테스트
    // socket.emit("join_room", {
    //     roomid: "testroom"
    // });
});

socket.on("connect_error", (err) => {
    console.log("connect_error");
    console.log(err);
});

socket.on("disconnect", () => {
    console.log("연결 종료");
});

socket.onAny((event, data) => {
    console.log(`[${event}]`, data);
});