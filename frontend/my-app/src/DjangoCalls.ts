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
        let data = 'code=' + roomCode + '&display_name=' + displayName;
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([data], headers)
        navigator.sendBeacon('http://localhost:8000/delete_user/', blob)
    }

    public hostLeaveRoom(roomCode: string) {
        let data = 'code=' + roomCode
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([data], headers)
        navigator.sendBeacon('http://localhost:8000/deactivate_room/', blob)
    }
}