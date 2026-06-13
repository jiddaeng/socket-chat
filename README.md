목적: 채팅방에 접속하기
connect랑 disconnect는 파일당 하나? 프로젝트당 하나?
그러면 create_room이랑 join_room 만들어야 되고 rooms 딕셔너리도 만들어야 되고
rooms에는 그냥 userid만 해놓자
roomid는 그냥 roomname으로 할까? 좋다. 그래야 나도 편하지
그럼 join_room은 roomname을 파라미터로 줘야지 되는걸로
create_room할 때 프론트에 보내면 되잖아. join_room으로 요청보낼 때 roomname 알아서 보내게 해야지
채팅 보낼 거니까 userToRoom도 해가지고 방 구분하자 근데 그럼 한 방밖에 안 되긴 하는데 뭐 어때 일단 구현부터
근데 rooms가 왜 필요하지? 어차피 userid만 넣어둘 거잖아. 그냥 userToroom만 있으면 되지 않나
아 방이름이랑 유저이름이 있어야 되는구나
방 만들면 자동으로 방가입까지
roomname을 프론트한테도 보내줘야지
그럼 프론트한테 {"roomname":"roomid"} 이런 딕셔너리를 전송할까? 아님 roomname만 보내고 백에서 roomnameToroomid 같은 걸 만들어서 관리할까
근데 roomid랑 roomname이랑 따로 한게 같은 이름도 가능하도록 한 거였잖아.
아니지 같은 이름이 있으면 안 되지. 그럼 그냥 roomid를 이름으로 하면 되잖아. 아니 뭐야
그래도 rooms에 추가할 정보가 있을수도 있으니까 userids로 따로 빼놓자. 만든날같은것도 저장할 수 있잖아. 
근데 그런건 db가 좋을 거 같긴한데 모르겠다