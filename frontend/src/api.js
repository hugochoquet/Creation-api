const baseUrl = 'http://localhost:4000';

const api = {
  getUsers: async (token) => {
    const response = await fetch(`${baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
    const data = await response.json();
    return data.data;
  },

  deleteUser: async (userId, token) => {
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
  }
};

export default api;
