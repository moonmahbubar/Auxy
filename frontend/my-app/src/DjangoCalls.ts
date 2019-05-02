export default class DjangoCalls {
    // private evtSource: EventSource

    constructor() {

    }

    // public getEventSource() {
    //     return this.evtSource
    // }

    public playSong(room: string, songID: string) {
        fetch('http://localhost:8000/song/' + room + '/' + songID)
            .then(response => console.log(response))
    }

    public search(room: string, query: string) {
        fetch('http://localhost:8000/' + room + '/' + query)
            .then(response => console.log(response))
    }

    public sendAuthCode(code: string) {
        fetch('http://localhost:8000/send_auth_code/' + code)
            .then(response => console.log(response.text()))
    }

    public createRoom(roomName: string, hostDisplayName: string, authCode: string) {
        return fetch('http://localhost:8000/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode)
            .then(response => response.json())
            // .then(data => {
            //     console.log(data['created_room_code'])
            // })
    }

    public getRoomUsers(roomCode: string) {
        return fetch('http://localhost:8000/get_room_info/' + roomCode)
            .then(response => response.json())
    }

    public userLeaveRoom(roomCode: string, displayName: string) {
        return fetch('http://localhost:8000/delete_user/' + roomCode + '/' + displayName)
            .then(response => response.json())
    }

    public hostLeaveRoom(roomCode: string) {
        return fetch('http://localhost:8000/deactivate_room/' + roomCode)
            .then(response => response.json())
    }
}