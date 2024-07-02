// import { useEffect, useState } from "react";
// import clerkClient from "../clerk"; // Ajusta la ruta según la ubicación de tu archivo clerk.js

// const useUserList = () => {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const { data: userList } = await clerkClient.users.getUserList();
//         setUsers(userList); // Extraer los usuarios de la respuesta paginada
//         setIsLoaded(true);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return { users, isLoaded, isLoading };
// };

// export default useUserList;
