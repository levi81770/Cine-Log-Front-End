const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export const getCommentsByPost = async (postId) => {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data

  } catch (err) {
    console.error(err)
    throw err
  }
}

export const createComment = async (postId, content) => {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteComment = async (postId, commentId) => {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}
