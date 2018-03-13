const clientID = '15a4ae64c6ce494792dc5f7e68ea48f7';
const redirectURI = 'http://tb-jammming.surge.sh/';
const spotifyURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

let accessToken = '';
let expiresIn = '';

const Spotify = {

  getAccessToken(){
    if(accessToken){
      return accessToken;
    }
      const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = spotifyURL;
    }
  },


    search(term){
      accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => response.json())
      .then(jsonResponse => {
      if (!jsonResponse.tracks) return [];
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      })
    });
  },


  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs) return;
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    const createPlaylistHeaders = {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: name}) };
    const addTracksHeaders = {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({'uris': trackURIs,}) };
    let userID, playlistID;
    // Get user id from Spotify
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userID = jsonResponse.id;
      // Create playlist
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, createPlaylistHeaders)
        .then(response => response.json())
        .then(jsonResponse => {
          playlistID = jsonResponse.id;
          // Add tracks to playlist
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, addTracksHeaders)
        });
    });
  },



};





export default Spotify;
