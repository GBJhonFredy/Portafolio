// src/services/spotify.js

// ⚠️ IMPORTANTE:
// No pongas aquí tu client_secret. Solo usamos el client_id en el navegador.

const SPOTIFY_CLIENT_ID = '6fcc9fe2a9ee4abd8fb3c0b982463f70';

// Esta URL debe coincidir EXACTAMENTE con la Redirect URI que pusiste en Spotify Developers
// Ahora mismo usaremos la de Vercel que me diste:
const SPOTIFY_REDIRECT_URI = 'https://portafolio-xkbi.vercel.app/callback';

// Scopes = permisos que le pides al usuario.
// De momento: leer playlists y ver cosas básicas del usuario.
const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-email',
  'user-read-private',
];

// Construye la URL de login en Spotify (Authorization Code Flow)
export function getSpotifyAuthUrl() {
  const base = 'https://accounts.spotify.com/authorize';

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true', // fuerza a mostrar pantalla de permisos
  });

  return `${base}?${params.toString()}`;
}