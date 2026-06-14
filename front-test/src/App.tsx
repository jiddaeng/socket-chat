import { useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:5000";

export default function App() {
    const socketRef = useRef<Socket | null>(null);

    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");

    const [roomname, setRoomname] = useState("");

    const [message, setMessage] = useState("");

    const [logs, setLogs] = useState<string[]>([]);

    function addLog(msg: string) {
        setLogs(prev => [...prev, msg]);
    }

    async function login() {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                addLog(JSON.stringify(data));
                return;
            }

            setToken(data.accessToken);

            addLog(
                `로그인 성공: ${data.username}`
            );
        } catch (err) {
            addLog(String(err));
        }
    }

    function connectSocket() {
        if (!token) {
            addLog("토큰 없음");
            return;
        }

        const socket = io(API_URL, {
            auth: {
                token,
            },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            addLog(`소켓 연결 성공: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            addLog("소켓 연결 종료");
        });

        socket.on("connect_error", err => {
            addLog(`connect_error: ${err.message}`);
        });

        socket.onAny((event, data) => {
            addLog(
                `[${event}] ${JSON.stringify(data)}`
            );
        });
    }

    function createRoom() {
        socketRef.current?.emit(
            "create_room",
            {
                roomname,
            }
        );
    }

    function joinRoom() {
        socketRef.current?.emit(
            "join_chat_room",
            {
                roomid: roomname,
            }
        );
    }

    function sendMessage() {
        socketRef.current?.emit(
            "send_message",
            {
                content: message,
            }
        );

        setMessage("");
    }

    return (
        <div
            style={{
                padding: 20,
                maxWidth: 800,
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Socket Chat Test</h1>

            <hr />

            <h2>1. 로그인</h2>

            <input
                value={username}
                onChange={e =>
                    setUsername(e.target.value)
                }
                placeholder="username"
            />

            <button onClick={login}>
                로그인
            </button>

            <div>
                token:
                <br />
                <textarea
                    value={token}
                    readOnly
                    rows={5}
                    style={{ width: "100%" }}
                />
            </div>

            <hr />

            <h2>2. 소켓 연결</h2>

            <button onClick={connectSocket}>
                Connect
            </button>

            <hr />

            <h2>3. 방 생성 / 참가</h2>

            <input
                value={roomname}
                onChange={e =>
                    setRoomname(e.target.value)
                }
                placeholder="roomname"
            />

            <button onClick={createRoom}>
                Create Room
            </button>

            <button onClick={joinRoom}>
                Join Room
            </button>

            <hr />

            <h2>4. 메시지 전송</h2>

            <input
                value={message}
                onChange={e =>
                    setMessage(e.target.value)
                }
                placeholder="message"
            />

            <button onClick={sendMessage}>
                Send
            </button>

            <hr />

            <h2>로그</h2>

            <div
                style={{
                    border: "1px solid gray",
                    padding: 10,
                    height: 400,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                }}
            >
                {logs.map((log, idx) => (
                    <div key={idx}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}