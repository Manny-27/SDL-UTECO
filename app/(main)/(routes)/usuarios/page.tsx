"use client";

import { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";

// Definimos el tipo para los usuarios y sus estadísticas
interface User {
  id: string;
  fullName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
}

interface UserStats {
  userId: string;
  documentCount: number;
  isAdmin: boolean;
}

const UsersTable: FC = () => {
  const { isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/clerk/users');
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data: User[] = await response.json();
        console.log("Usuarios obtenidos:", data);  // Log de depuración
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        const response = await api.userStats();  // Llamada a la consulta de Convex
        setUserStats(response);
        console.log("Estadísticas de usuarios obtenidas:", response);  // Log de depuración
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchData = async () => {
      await fetchUsers();
      await fetchUserStats();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (!isLoaded || loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl mb-4">Lista de Usuarios</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Avatar</th>
            <th className="py-2 px-4 border-b">Nombre Completo</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Cantidad de Documentos</th>
            <th className="py-2 px-4 border-b">Es Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const stats = userStats.find((stats) => stats.userId === user.id);
            return (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl} />
                  </Avatar>
                </td>
                <td className="py-2 px-4 border-b">{user.fullName}</td>
                <td className="py-2 px-4 border-b">{user.emailAddresses[0]?.emailAddress}</td>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{stats?.documentCount || 0}</td>
                <td className="py-2 px-4 border-b">{stats?.isAdmin ? "Sí" : "No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;


