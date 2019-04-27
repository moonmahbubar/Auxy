export default class DjangoCalls {
    public playSong(room: string, songID: string) {
        fetch('http://localhost:8000/song/' + room + '/' + songID)
            .then(response => console.log(response))
    }

    public search(room: string, query: string) {
        fetch('http://localhost:8000/song/' + room + '/' + query)
            .then(response => console.log(response))
    }

    public sendAuthCode(code: string) {
        fetch('http://localhost:8000/send_auth_code/' + code)
            .then(response => console.log(response.text()))
    }

    public createRoom(roomName: string, hostDisplayName: string, authCode: string) {
        fetch('http://localhost:8000/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode)
            .then(response => console.log(response))
    }
}
