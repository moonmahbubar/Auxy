export default class DjangoCalls {
    // private evtSource: EventSource

    constructor() {
        // this.evtSource = new EventSource("/path/to/endpoint", { withCredentials: true } );
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
}