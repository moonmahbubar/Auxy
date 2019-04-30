export default class DjangoCalls {
    // private evtSource: EventSource

    constructor() {

    }

    // public getEventSource() {
    //     return this.evtSource
    // }

    public playSong(room: string, songID: string) {
        fetch('http://moonmahbubar.pythonanywhere.com/song/' + room + '/' + songID)
            .then(response => console.log(response))
    }

    public search(room: string, query: string) {
        fetch('http://moonmahbubar.pythonanywhere.com/' + room + '/' + query)
            .then(response => console.log(response))
    }

    public sendAuthCode(code: string) {
        fetch('http://moonmahbubar.pythonanywhere.com/send_auth_code/' + code)
            .then(response => console.log(response.text()))
    }

    public createRoom(roomName: string, hostDisplayName: string, authCode: string) {
        return fetch('http://moonmahbubar.pythonanywhere.com/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode)
            .then(response => response.json())
            // .then(data => {
            //     console.log(data['created_room_code'])
            // })
    }

    public getRoomUsers(roomCode: string) {
        return fetch('http://moonmahbubar.pythonanywhere.com/get_room_users/' + roomCode)
            .then(response => response.json())
    }
}