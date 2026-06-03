// src/services/spotify.js

// ⚠️ IMPORTANTE ⚠️
// Nunca pongas tu client_secret aquí. Solo se usa en backend / Postman.
// Aquí solo va el client_id y, para pruebas, un access token pegado a mano.

const SPOTIFY_CLIENT_ID = '6fcc9fe2a9ee4abd8fb3c0b982463f70';

// Redirect URI que registraste en Spotify Developers
const SPOTIFY_REDIRECT_URI = 'https://portafolio-xkbi.vercel.app/callback';

// Scopes: ahora también pedimos acceso a tus canciones guardadas (Me gusta)
const SPOTIFY_SCOPES = [
  'user-library-read',            // leer canciones guardadas en Tu biblioteca
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-email',
  'user-read-private',
];

// ⚠️ SOLO PARA PRUEBAS ⚠️
// Aquí vas a pegar temporalmente tu access token de Spotify
// (cuando lo obtengas a partir del "code" usando Postman o un script).
// Mientras esté aquí, cualquiera que vea tu código podría usarlo,
// así que úsalo solo en entorno local o no subas a GitHub con este valor real.
let SPOTIFY_ACCESS_TOKEN = ''; // ← aquí pegaremos el token más tarde

export function setSpotifyAccessToken(token) {
  SPOTIFY_ACCESS_TOKEN = token;
}

export function getSpotifyAuthUrl() {
  const base = 'https://accounts.spotify.com/authorize';

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true',
  });

  return `${base}?${params.toString()}`;
}

// Convierte milisegundos a mm:ss (por ejemplo 201000 → "3:21")
function msToMinutesSeconds(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

// Pide las canciones de "Tu biblioteca" (Me gusta) del usuario actual
// y devuelve un array de objetos listos para la UI.
export async function fetchLikedTracks(limit = 20) {
  if (!SPOTIFY_ACCESS_TOKEN) {
    throw new Error('No hay access token de Spotify. Llama a setSpotifyAccessToken(token) primero.');
  }

  const url = new URL('https://api.spotify.com/v1/me/tracks'); // "Me gusta" del usuario actual[web:63][web:66]
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', '0');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al pedir liked tracks:', errorText);
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data = await response.json();

  // data.items es un array; cada item tiene { added_at, track: {...} }[web:63][web:66]
  const tracks = (data.items || [])
    .map((item) => {
      const track = item.track;
      if (!track) return null;

      const artists = (track.artists || []).map((a) => a.name).join(', ');
      const duration = msToMinutesSeconds(track.duration_ms); //[web:26][web:63]

      return {
        id: track.id,
        title: track.name,
        artist: artists,
        duration,
        previewUrl: track.preview_url || null, // puede venir null para muchas canciones[web:26][web:70]
        spotifyUrl: track.external_urls?.spotify || '',
      };
    })
    .filter(Boolean);

  return tracks;
}