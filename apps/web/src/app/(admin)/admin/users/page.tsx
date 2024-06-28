"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetUsers from "@/hooks/api/user/useGetUsers";
import SearchInput from "../products/components/Search";
import SortOrderSelect from "../products/components/SortOrderSelect";
import Pagination from "@/components/Pagination";
import DialogCreateUser from "./components/DialogCreateUsers";
import DialogDeleteUser from "./components/DialogDeleteUser";
import useDeleteUser from "@/hooks/api/user/useDeleteUser";
import AuthGuardSuperAdmin from "@/hoc/AuthGuardSuperAdmin";
import DialogEditUser from "./components/DialogEditUser";

const Users = () => {
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState<boolean>(false);
  const { deleteUser, isLoading: isDeleting } = useDeleteUser();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const {
    data: users,
    isLoading,
    meta,
    refetch,
  } = useGetUsers({
    page,
    take: 5,
    sortBy: "name",
    sortOrder,
    search,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    refetch();
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  return (
    <main className="container mx-auto">
      <div className="container my-20 max-w-6xl border-2 pb-10 shadow-xl">
        <div className="my-4 flex justify-between">
          <div className="flex justify-between gap-4">
            <SearchInput search={search} setSearch={setSearch} />
          </div>
          <DialogCreateUser
            refetch={refetch}
            open={isOpenDialogCreate}
            onOpenChange={setIsOpenDialogCreate}
          />
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{(page - 1) * take + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <DialogEditUser
                          userId={user.id}
                          refetch={refetch}
                          open={isOpenDialogEdit}
                          onOpenChange={setIsOpenDialogEdit}
                        />
                        <DialogDeleteUser
                          userId={user.id}
                          isDeleting={isDeleting}
                          handleDelete={handleDelete}
                          open={isOpenDialogDelete}
                          onOpenChange={setIsOpenDialogDelete}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Data not found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mx-auto w-fit">
          <Pagination
            total={total}
            take={take}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </main>
  );
};

export default AuthGuardSuperAdmin(Users);
