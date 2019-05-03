export default class DjangoCalls {
    // private evtSource: EventSource

    constructor() {

    }

    // public getEventSource() {
    //     return this.evtSource
    // }

    public playSong(room: string, songID: string) {
        fetch('https://moonmahbubar.pythonanywhere.com/song/' + room + '/' + songID)
            .then(response => console.log(response))
    }

    public search(room: string, query: string) {
        fetch('https://moonmahbubar.pythonanywhere.com/' + room + '/' + query)
            .then(response => console.log(response))
    }

    public sendAuthCode(code: string) {
        fetch('https://moonmahbubar.pythonanywhere.com/send_auth_code/' + code)
            .then(response => console.log(response.text()))
    }

    public createRoom(roomName: string, hostDisplayName: string, authCode: string) {
        return fetch('https://moonmahbubar.pythonanywhere.com/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode)
            .then(response => response.json())
            // .then(data => {
            //     console.log(data['created_room_code'])
            // })
    }

    public getRoomUsers(roomCode: string) {
        return fetch('https://moonmahbubar.pythonanywhere.com/get_room_info/' + roomCode)
            .then(response => response.json())
    }

    public userLeaveRoom(roomCode: string, displayName: string) {
        let data = 'code=' + roomCode + '&display_name=' + displayName;
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([data], headers)
        navigator.sendBeacon('https://moonmahbubar.pythonanywhere.com/delete_user/', blob)
    }

    public hostLeaveRoom(roomCode: string) {
        let data = 'code=' + roomCode
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([data], headers)
        navigator.sendBeacon('https://moonmahbubar.pythonanywhere.com/deactivate_room/', blob)
    }
}