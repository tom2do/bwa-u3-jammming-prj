import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

const newPlaylist = 'New Playlist';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [],
      searchTerm: '',
      playlistName: newPlaylist,
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    let isInPlaylist = this.state.playlistTracks.find(is => is.id === track.id);
    if (!isInPlaylist) {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }
  }
  removeTrack(track){
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  }

  updatePlaylistName(name){
    this.setState({
      playlistName: name
    });
  }

  savePlaylist(){
    let trackUris = [];
    let playlistName = this.state.PlaylistName;

    this.state.playlistTracks.forEach(
      track => {
        trackUris.push('spotify:track:' + track.id);
      }
    );
    Spotify.savePlaylist(playlistName, trackUris);
    this.setState({
      searchResults: [],
      searchTerm: '',
      playlistTracks: [],
      playlistName: newPlaylist,
    });
    this.updatePlaylistName('New Playlist');
  }







  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({
        searchResults: tracks
      });
    })
  }

  componentDidMount() {
  Spotify.getAccessToken();
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}/>
            <Playlist
              onRemove={this.removeTrack}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onSave={this.savePlaylist}
              onNameChange={this.updatePlaylistName}
                />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
