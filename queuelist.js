class SongList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            songs : [
            	{name: 'Hello', artist: 'Adelle'},
                {name: 'Ipsum', artist: 'Lorum'}
            ]
        }
    }

    render() {
        return (
            <ul>
                {this.state.songs.map(song => (
                    <li key={song.name}>
                        {song.name}
                    </li>
                ))}
            </ul>
        );
    }
};

ReactDOM.render(<SongList />, document.getElementById('root'));
