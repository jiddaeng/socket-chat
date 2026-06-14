import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:5000";

interface ChatMessage {
    message_id: number;
    message: string;
    userid: number;
    username: string;
}

export default function App() {
    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");

    const [roomname, setRoomname] = useState("");
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    function addLog(msg: string) {
        setLogs(prev => [...prev, msg]);
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

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
                `로그인 성공 (${data.username})`
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
            addLog(
                `소켓 연결 성공 (${socket.id})`
            );
        });

        socket.on("disconnect", () => {
            addLog("소켓 연결 종료");
        });

        socket.on(
            "message_success",
            (data: ChatMessage) => {
                setMessages(prev => [
                    ...prev,
                    data,
                ]);
            }
        );

        socket.onAny((event, data) => {
            addLog(
                `[${event}] ${JSON.stringify(
                    data
                )}`
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
        if (!message.trim()) return;

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
                height: "100vh",
                display: "flex",
                background: "#f5f6f8",
                fontFamily:
                    "Pretendard, sans-serif",
            }}
        >
            {/* 사이드바 */}
            <div
                style={{
                    width: 280,
                    borderRight:
                        "1px solid #ddd",
                    background: "white",
                    padding: 20,
                    overflowY: "auto",
                }}
            >
                <h2>Socket Chat</h2>

                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: 8,
                    }}
                >
                    <input
                        value={username}
                        onChange={e =>
                            setUsername(
                                e.target.value
                            )
                        }
                        placeholder="username"
                    />

                    <button
                        onClick={login}
                    >
                        로그인
                    </button>

                    <button
                        onClick={
                            connectSocket
                        }
                    >
                        소켓 연결
                    </button>
                </div>

                <hr />

                <input
                    value={roomname}
                    onChange={e =>
                        setRoomname(
                            e.target.value
                        )
                    }
                    placeholder="roomname"
                />

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 8,
                    }}
                >
                    <button
                        onClick={
                            createRoom
                        }
                    >
                        생성
                    </button>

                    <button
                        onClick={joinRoom}
                    >
                        참가
                    </button>
                </div>

                <hr />

                <h3>로그</h3>

                <div
                    style={{
                        fontSize: 12,
                        whiteSpace:
                            "pre-wrap",
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: 4,
                    }}
                >
                    {logs.map(
                        (log, idx) => (
                            <div
                                key={idx}
                            >
                                {log}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* 채팅창 */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection:
                        "column",
                }}
            >
                {/* 헤더 */}
                <div
                    style={{
                        height: 70,
                        background:
                            "white",
                        borderBottom:
                            "1px solid #ddd",
                        display: "flex",
                        alignItems:
                            "center",
                        padding:
                            "0 20px",
                        fontSize: 20,
                        fontWeight: 600,
                    }}
                >
                    {roomname ||
                        "채팅방"}
                </div>

                {/* 메시지 영역 */}
                <div
                    style={{
                        flex: 1,
                        overflowY:
                            "auto",
                        padding: 20,
                    }}
                >
                    {messages.map(
                        msg => {
                            const mine =
                                msg.username ===
                                username;

                            return (
                                <div
                                    key={
                                        msg.message_id
                                    }
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            mine
                                                ? "flex-end"
                                                : "flex-start",
                                        marginBottom: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth:
                                                "65%",
                                        }}
                                    >
                                        {!mine && (
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#666",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {
                                                    msg.username
                                                }
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                background:
                                                    mine
                                                        ? "#FFE812"
                                                        : "white",
                                                borderRadius: 18,
                                                padding:
                                                    "10px 14px",
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.12)",
                                                wordBreak:
                                                    "break-word",
                                            }}
                                        >
                                            {
                                                msg.message
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}

                    <div
                        ref={
                            bottomRef
                        }
                    />
                </div>

                {/* 입력창 */}
                <div
                    style={{
                        background:
                            "white",
                        borderTop:
                            "1px solid #ddd",
                        padding: 16,
                        display: "flex",
                        gap: 12,
                    }}
                >
                    <input
                        value={message}
                        onChange={e =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={e => {
                            if (
                                e.key ===
                                "Enter"
                            ) {
                                sendMessage();
                            }
                        }}
                        placeholder="메시지 입력..."
                        style={{
                            flex: 1,
                            padding:
                                "12px",
                            border:
                                "1px solid #ccc",
                            borderRadius: 8,
                        }}
                    />

                    <button
                        onClick={
                            sendMessage
                        }
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}