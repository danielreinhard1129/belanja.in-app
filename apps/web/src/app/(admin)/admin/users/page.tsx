"use client";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AuthGuardSuperAdmin from "@/hoc/AuthGuardSuperAdmin";
import useDeleteUser from "@/hooks/api/user/useDeleteUser";
import useGetUsers from "@/hooks/api/user/useGetUsers";
import { debounce } from "lodash";
import { FilePenLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DialogCreateStoreAdmin from "./components/DialogCreateStoreAdmin";
import DialogDeleteUser from "./components/DialogDeleteUser";
import DialogEditStoreAdmin from "./components/DialogEditStoreAdmin";
import DialogEditUser from "./components/DialogEditUser";
const Users = () => {
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const { deleteUser, isLoading: isDeleting } = useDeleteUser();
  const [page, setPage] = useState<number>(1);
  const [role, setRole] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const {
    data: users,
    isLoading,
    meta,
    refetch,
  } = useGetUsers({
    page,
    role,
    take: 5,
    sortBy: "name",
    sortOrder,
    search,
  });
  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);
  useEffect(() => {
    setPage(1);
  }, [role]);
  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  const handleDelete = async (id: number) => {
    await deleteUser(id);
    refetch();
  };
  const handleEdit = (userId: number, type: string) => {
    setSelectedUserId(userId);
    setDialogType(type);
  };
  const total = meta?.total || 0;
  const take = meta?.take || 10;
  return (
    <main className="container py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-2xl font-bold">Users</h2>
        <div className="container border-2 bg-white pb-6 shadow-xl">
          <div className="my-4 flex justify-between">
            <div className="flex justify-between gap-4">
              <Select
                onValueChange={(value) => setRole(value)}
                defaultValue={role}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  <SelectItem value="STOREADMIN">STOREADMIN</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Search"
                name="search"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
            <DialogCreateStoreAdmin
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * take + index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.role === "STOREADMIN" ? (
                            <button
                              onClick={() => handleEdit(user.id, "STOREADMIN")}
                            >
                              <FilePenLine />
                            </button>
                          ) : user.role === "USER" ? (
                            <button onClick={() => handleEdit(user.id, "USER")}>
                              <FilePenLine />
                            </button>
                          ) : null}
                          <button onClick={() => handleEdit(user.id, "DELETE")}>
                            <Trash2 />
                          </button>
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
        {selectedUserId !== null && dialogType === "USER" && (
          <DialogEditUser
            refetch={refetch}
            userId={selectedUserId}
            open={selectedUserId !== null && dialogType === "USER"}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedUserId(null);
                setDialogType(null);
              }
            }}
          />
        )}
        {selectedUserId !== null && dialogType === "STOREADMIN" && (
          <DialogEditStoreAdmin
            userId={selectedUserId}
            refetch={refetch}
            open={selectedUserId !== null && dialogType === "STOREADMIN"}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedUserId(null);
                setDialogType(null);
              }
            }}
          />
        )}
        {selectedUserId !== null && dialogType === "DELETE" && (
          <DialogDeleteUser
            userId={selectedUserId}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            open={selectedUserId !== null && dialogType === "DELETE"}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedUserId(null);
                setDialogType(null);
              }
            }}
          />
        )}
      </div>
    </main>
  );
};
export default AuthGuardSuperAdmin(Users);
