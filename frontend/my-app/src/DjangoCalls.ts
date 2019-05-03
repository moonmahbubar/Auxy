// Class to hold functions with django endpoint calls

export default class DjangoCalls {
    // private evtSource: EventSource

    constructor() { }

    // API call to play a song in a room from its ID
    public playSong(room: string, songID: string) {
        fetch('http://localhost:8000/song/' + room + '/' + songID)
            .then(response => console.log(response))
    }

    // API call to search spotify songs
    public search(room: string, query: string) {
        fetch('http://localhost:8000/' + room + '/' + query)
            .then(response => console.log(response))
    }

    // Send the auth code to backend to initialize spotipy
    public sendAuthCode(code: string) {
        fetch('http://localhost:8000/send_auth_code/' + code)
            .then(response => console.log(response.text()))
    }

    // Create a room and host in database
    public createRoom(roomName: string, hostDisplayName: string, authCode: string) {
        return fetch('http://localhost:8000/create_host/' + roomName + '/' + hostDisplayName + '/' + authCode)
            .then(response => response.json())
    }

    // Get an update about the state of the app from the database
    public getRoomInfo(roomCode: string) {
        return fetch('http://localhost:8000/get_room_info/' + roomCode)
            .then(response => response.json())
    }

    // Delete the user in the database when they leave the room
    public userLeaveRoom(roomCode: string, displayName: string) {
        let data = 'code=' + roomCode + '&display_name=' + displayName;
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        // Combine data and headers into a blob to use sendBeacon before the page closes
        let blob = new Blob([data], headers)
        navigator.sendBeacon('http://localhost:8000/delete_user/', blob)
    }

    // Deactivate the room when the host leaves
    public hostLeaveRoom(roomCode: string) {
        let data = 'code=' + roomCode
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        // Combine data and headers into a blob to use sendBeacon before the page closes
        let blob = new Blob([data], headers)
        navigator.sendBeacon('http://localhost:8000/deactivate_room/', blob)
    }
}