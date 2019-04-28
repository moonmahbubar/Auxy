export default class DjangoCalls {
    // public evtSource = new EventSource("/path/to/endpoint", { withCredentials: true } );

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
        return fetch('https://moonmahbubar.pythonanywhere.com/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode, {mode: 'no-cors'})
            .then(response => response.json())
            // .then(data => {
            //     console.log(data['created_room_code'])
            // })
    }
}