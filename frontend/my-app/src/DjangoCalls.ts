export default class DjangoCalls {
    public playSong(room: string, songID: string) {
        fetch('http://localhost:8000/song/code=' + room + '/song=' + songID)
            .then(response => console.log(response))
    }
}