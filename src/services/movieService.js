const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/movies`;

export const index = async (page = 1, genre = '') => {
  try {
    const query = new URLSearchParams({ page })

    if (genre) query.append('genre', genre)

    const res = await fetch(`${BASE_URL}?${query}`)
    const data = await res.json()

    if (data.error) throw new Error(data.error);
    
    return data
  } catch (err) {
    console.error('Error fetching movies:', err);
    throw err
  }
}


export const show = async (movieId) => {
  try {
    const res = await fetch(`${BASE_URL}/${movieId}`)
    const data = await res.json()

    if (data.error) throw new Error(data.error);
    
    return data
  } catch (err) {
    console.error('Error fetching movie:', err);
    throw err
  }
}

export const getGenres = async () => {
  try {
    const res = await fetch(`${BASE_URL}/genres/all`)
    const data = await res.json()

    if (data.error) throw new Error(data.error);

    return data
  } catch (err) {
    console.error('Error fetching genres:', err);
    throw err
  }
}