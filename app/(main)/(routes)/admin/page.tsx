"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useState, SetStateAction, ChangeEvent } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserTable = () => {
  const userInfo = useQuery(api.documents.getUserInfo);
  const { user } = useUser();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<{ [key: string]: string }>({});
  const [hiddenUserIds, setHiddenUserIds] = useState<Set<string>>(new Set());

  const userIds = useQuery(api.documents.getAllUserIds);
  const fullNameList = useQuery(api.documents.getAllName);
  const isAdmin = useQuery(api.documents.getAdmin);

  if (!userIds || !fullNameList || !userInfo) {
    return <div>Cargando...</div>;
  }

  const handleRoleChange = (userId: string, event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    const fullName = fullNameList.find((item: { userId: string }) => item.userId === userId)?.fullName || "nuevo empleado";

    setUserRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));

    toast(`${fullName} ahora es ${newRole}`);
  };

  const handleDeleteAccount = (userId: string) => {
    const fullName = fullNameList.find((item: { userId: string }) => item.userId === userId)?.fullName || "nuevo empleado";
    
    // Ocultar el userId
    setHiddenUserIds((prevHiddenUserIds) => {
      const newHiddenUserIds = new Set(prevHiddenUserIds);
      newHiddenUserIds.add(userId);
      return newHiddenUserIds;
    });

    // Mostrar notificación
    toast(`${fullName} ha sido eliminado`);
    setIsAlertOpen(false);
  };

  const handleProhibitedDelete = () => {
    toast.error("Este usuario no se puede eliminar");
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption className="text-lg font-semibold">Información del Usuario</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 bg-gray-50">Avatar</TableHead>
              <TableHead className="px-6 py-3 bg-gray-50">Nombre Completo</TableHead>
              <TableHead className="px-6 py-3 bg-gray-50">Última Conexión</TableHead>
              <TableHead className="px-6 py-3 bg-gray-50">Rol</TableHead>
              <TableHead className="px-6 py-3 bg-gray-50">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user && (
              <TableRow className="bg-white">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                  </Avatar>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {user.fullName}
                    <div className="text-sm text-gray-500">{user.emailAddresses[0].emailAddress}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Nunca"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={userRoles[user.id] || (userInfo?.isAdmin ? "Administrador" : "Usuario")}
                    onChange={(event) => handleRoleChange(user.id, event)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="Administrador">Administrador</option>
                  </select>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="default"
                    size="sm"
                    disabled
                    className="cursor-not-allowed"
                    onClick={handleProhibitedDelete}
                  >
                    Eliminar Cuenta
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="max-w-7xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        <Table className="divide-gray-200">
          <TableCaption className="text-lg font-semibold">Lista de Usuarios</TableCaption>
          <TableHeader className="divide-gray-200">
            <TableRow className="font-semibold">
              <TableHead className="font-bold">UserId</TableHead>
              <TableHead className="font-bold">Usuario</TableHead>
              <TableHead className="font-bold">Rol</TableHead>
              <TableHead className="font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userIds.filter(userId => !hiddenUserIds.has(userId)).map((userId: string, index: number) => {
              const userFullName = fullNameList.find((item: { userId: string }) => item.userId === userId)?.fullName || "nuevo empleado";
              return (
                <TableRow key={index} className="bg-white">
                  <TableCell>{userId}</TableCell>
                  <TableCell>{userFullName}</TableCell>
                  <TableCell>
                    <select
                      value={userRoles[userId] || "Usuario"}
                      onChange={(event) => handleRoleChange(userId, event)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Secretario administrativo">Secretario administrativo</option>
                      <option value="Digitador">Digitador</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                          Eliminar Cuenta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta cuenta?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="outline">
                              Cancelar
                            </Button>
                          </AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={() => handleDeleteAccount(userId)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Eliminar
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          Total de usuarios: {userIds.length - hiddenUserIds.size}
        </div>
      </div>
    </>
  );
};

export default UserTable;


