// socket.io를 참조한다
const SocketIO = require("socket.io");

module.exports = (server) => {
	// 소켓 인아웃 연결 객체를 생성한다.
	const io = SocketIO(server, { path: "/socket.io" });

	// 브라우저와 서버 웹 소켓 연결이 완료되면 실행된다.
	io.on("connection", (socket) => {
		// 소켓 연결이 끊어졌을 때 실행되는 서버 이벤트
		socket.on("disconnect", () => {});

		// 사용자로부터 메시지 수신하기
		socket.on("sendMsg", function (userid, msg) {
			// 브라우저에서 받은 메시지를 다시 모든 연결 사용자에게 발송한다.
			// socket.emit(): 현재 연결된 사용자(메시지를 발송한 사람)에게 메시지를 발송하게 한다.
			socket.emit("broadcasting", userid, msg);

			// socket.broadcast.emit(): 햔제 사용자를 제외한 모든 연결된 사용자에게 메시지를 발송하게 한다.
			socket.broadcast.emit("broadcasting", userid, msg);
		});

		//채팅방 입장하기
		socket.on("joinGroup", async (roomid, userid) => {
			//채팅방 그룹 조인하기
			socket.join(roomid);

			//현재 접속 사용자에게 채팅방 입장완료 메시지를 보낸다.
			socket.emit("entryOk", "채팅방에 입장했습니다.");
		});

		// 채팅방 전용 수발신 메시지 처리
		socket.on("sendRoomMsg", function (roomid, userid, msg) {
			// 브라우저에서 받은 메시지를 다시 모든 연결 사용자에게 발송한다.
			// socket.emit(): 현재 연결된 사용자(메시지를 발송한 사람)에게 메시지를 발송하게 한다.
			socket.emit("roomMsg", userid, msg);

			// 현재 연결 사용자(메시지 발송자)를 제외한 해당 채팅방 모든 사용자에게 발송한다.
			socket.to(roomid).emit("roomMsg", userid, msg);
		});

		// 서버에서 소켓 에러가 났을 때 실행되는 서버 이벤트
		socket.on("error", () => {});
	});
};
