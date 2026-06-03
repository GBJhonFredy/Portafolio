// src/services/spotify.js

// Configuración básica de Spotify
const SPOTIFY_CLIENT_ID = '6fcc9fe2a9ee4abd8fb3c0b982463f70';
const SPOTIFY_REDIRECT_URI = 'https://portafolio-xkbi.vercel.app/callback';

const SPOTIFY_SCOPES = [
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-email',
  'user-read-private',
];

// ⚠️ SOLO PARA PRUEBA LOCAL (NO SUBAS ESTO A GITHUB)
let SPOTIFY_ACCESS_TOKEN = 'BQATpJ8DflYvp5R28gdLmKohqGSKFXjhyQIJ1khCp2WDud9z6siLdfooaqBcsxYCSj_QjCu0PclG-EYCRtJUanBnaz7UVP8rx_0f2D_MGYN1BV1A1oFBYIhn-NhiJyTh5NDzhy_S7LHoWQKl0Q5mKgzpv-c8GGYQwH0AeaNHW1XADZrKpsSxV1NypyX-nbwLSreK93k1LzBEvszOF-9iuqlvq3XxgIPcWD9bmaYgaOBoCuwIQTsUOPM3SHSSNQF5ZyK_DOccMNEodxo-OR4KQa3Q191upSTqFmPk';

// (No necesitamos getSpotifyAuthUrl ahora mismo, pero lo dejamos por si lo usas luego)
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

// Función auxiliar: ms → mm:ss
function msToMinutesSeconds(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

// Traer tus canciones guardadas ("Me gusta") desde Spotify
export async function fetchLikedTracks(limit = 20) {
  if (!SPOTIFY_ACCESS_TOKEN) {
    throw new Error('No hay access token de Spotify.');
  }

  const url = new URL('https://api.spotify.com/v1/me/tracks'); // Tus guardadas[web:63][web:66]
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', '0');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error Spotify /me/tracks:', errorText);
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data = await response.json();

  // Convertimos la respuesta de Spotify en un array simple para la UI
  const tracks = (data.items || [])
    .map((item) => {
      const track = item.track;
      if (!track) return null;

      const artists = (track.artists || []).map((a) => a.name).join(', ');
      const duration = msToMinutesSeconds(track.duration_ms); // mm:ss[web:63]

      // URL pública de Spotify para la canción
      const spotifyUrl =
        (track.external_urls && track.external_urls.spotify) || null; 

      return {
        id: track.id,
        title: track.name,
        artist: artists,
        duration,
        spotifyUrl, // <- aquí la guardamos
      };
    })
    .filter(Boolean);

  return tracks;
}