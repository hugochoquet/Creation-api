// import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom'
// import { userService } from '@/_services';

// const User = () => {
//     const [users, setUsers] = useState([])
//     const flag = useRef(false)

//     // Récupération de la liste des utilisateurs à l'affichage
//     useEffect(() => {
//         if(flag.current === false){
//             userService.getAllUsers()
//                 .then(res => {
//                     // Liste dans le state
//                     setUsers(res.data.data)
//                 })
//                 .catch(err => console.log(err))
//         }

//         return () => flag.current = true
        
//     }, [])

//     // Gestion du bouton de suppression d'un utilisateur
//     const delUser = (userId) => {
//         userService.deleteUser(userId)
//             .then(res => {
//                 // Mise à jour du state pour affichage
//                 setUsers((current) => current.filter(user => user.id !== userId))
//             })
//             .catch(err => console.log(err))
//     }

//     return (        
//         <div className="User">
//             User liste       
//             <table>
//                 <thead>
//                     <tr>
//                         <th></th>
//                         <th>#</th>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Email</th>
//                         <th>Created</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         users.map(user => (
//                             <tr key={user.id}>
//                                 <td><span className='del_ubtn' onClick={() => delUser(user.id)}>X</span></td>
//                                 <td><Link to={`/admin/user/edit/${user.id}`}>{user.id}</Link></td>
//                                 <td>{user.nom}</td>
//                                 <td>{user.prenom}</td>
//                                 <td>{user.email}</td>
//                                 <td>{user.createdAt}</td>
//                             </tr>
//                         ))
//                     }
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default User;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '@/api';

// const User = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Récupération des utilisateurs
//       api.getUsers(token)
//         .then(users => setUsers(users))
//         .catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));
//     }
//   }, []);

//   const deleteUser = (userId) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Suppression de l'utilisateur
//       api.deleteUser(userId, token)
//         .then(() => setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)))
//         .catch(error => console.error('Erreur lors de la suppression de l\'utilisateur :', error));
//     }
//   };

//   return (        
//     <div className="User">
//       User liste       
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th>#</th>
//             <th>Nom</th>
//             <th>Prénom</th>
//             <th>Email</th>
//             <th>Created</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.id}>
//               <td><span className='del_ubtn' onClick={() => deleteUser(user.id)}>X</span></td>
//               <td><Link to={`/admin/user/edit/${user.id}`}>{user.id}</Link></td>
//               <td>{user.nom}</td>
//               <td>{user.prenom}</td>
//               <td>{user.email}</td>
//               <td>{user.createdAt}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default User;

import React from 'react';
import { useQuery, useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import api from '@/api';

const User = () => {
  const { data: users, isLoading, isError, error } = useQuery('users', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé');
    }
    return api.getUsers(token);
  });



  
  const deleteUserMutation = useMutation((userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé');
    }
    return api.deleteUser(userId, token);
  });

  const handleDeleteUser = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div className="User">
      User liste       
      <table>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><span className='del_ubtn' onClick={() => handleDeleteUser(user.id)}>X</span></td>
              <td><Link to={`/admin/user/edit/${user.id}`}>{user.id}</Link></td>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
