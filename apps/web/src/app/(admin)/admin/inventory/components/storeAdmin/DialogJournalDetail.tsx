// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import useGetStockJournalById from "@/hooks/api/stock-journal/useGetStockJournalById";
// import useArriveStockMutation from "@/hooks/api/store-product/useArriveStockMutation";
// import useConfirmStockMutation from "@/hooks/api/store-product/useConfirmStockMutation";
// import useRejectStockMutation from "@/hooks/api/store-product/useRejectStockMutation";
// import { format } from "date-fns";
// import { Eye, Loader2 } from "lucide-react";
// import React from "react";
// import { toast } from "sonner";
// interface DialogJournalDetailProps {
//   journalId: number;
//   storeId: number;
//   refetch: () => void;
//   refetchStockJournals: () => void;
// }
// const DialogJournalDetail: React.FC<DialogJournalDetailProps> = ({
//   journalId,
//   storeId,
//   refetch,
//   refetchStockJournals,
// }) => {
//   const { journal } = useGetStockJournalById(journalId);
//   const { confirmMutation, isLoading: isConfirm } = useConfirmStockMutation();
//   const { rejectMutation, isLoading: isReject } = useRejectStockMutation();
//   const { arriveMutation, isLoading: isArrive } = useArriveStockMutation();

//   const handleConfirm = async (id: number) => {
//     refetch();
//     try {
//       await confirmMutation(id);
//       refetchStockJournals();
//       refetch();
//     } catch (error) {
//       if (typeof error === "string") {
//         toast.error(error);
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("An unknown error occurred");
//       }
//     }
//   };

//   const handleReject = async (id: number) => {
//     await rejectMutation(id);
//     refetchStockJournals();
//     refetch();
//   };

//   const handleArrive = async (id: number) => {
//     await arriveMutation(id);
//     refetchStockJournals();
//     refetch();
//   };

//   if (!journal) {
//     return <div>Data Not Found</div>;
//   }
//   return (
//     <Dialog>
//       <DialogTrigger>
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div className="flex cursor-pointer items-center gap-2">
//                 <Eye size={20} />
//               </div>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>View Detail</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Stock Journal Detail</DialogTitle>
//           <DialogDescription>Details of the stock journal.</DialogDescription>
//         </DialogHeader>
//         <div className="grid w-full grid-cols-11">
//           <div className="col-span-5 font-semibold">From Store</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal.store?.name}</div>
//           <div className="col-span-5 font-semibold">Store ID</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal.store?.id}</div>
//           <div className="col-span-5 font-semibold">To Store</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">
//             {journal.JournalDetail[0]?.toStore?.name ?? "Not Found"}
//           </div>
//           <div className="col-span-5 font-semibold">Store ID</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">
//             {journal.JournalDetail[0]?.toStore?.id ?? "Not Found"}
//           </div>
//           <div className="col-span-5 font-semibold">Product Name</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal.product?.name}</div>
//           <div className="col-span-5 font-semibold">Product ID</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal.product?.id}</div>
//           <div className="col-span-5 font-semibold">Quantity</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal?.quantity}</div>
//           <div className="col-span-5 font-semibold">Type</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal?.type}</div>
//           <div className="col-span-5 font-semibold">Status</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">{journal?.status}</div>
//           <div className="col-span-5 font-semibold">Date</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">
//             {format(new Date(journal?.createdAt), "yyyy-MM-dd")}
//           </div>
//           <div className="col-span-5 font-semibold">Time</div>
//           <div className="col-span-1 text-center">:</div>
//           <div className="col-span-5">
//             {format(new Date(journal?.createdAt), "HH:mm:ss")}
//           </div>
//         </div>
//         <div className="mt-4 flex justify-center gap-2">
//           {storeId === journal.JournalDetail[0]?.toStoreId &&
//           journal.status === "WAITING_ADMIN_CONFIRMATION" ? (
//             <>
//               <Button
//                 disabled={isReject}
//                 onClick={() => handleReject(journal.id)}
//                 className="bg-red-500 px-4 py-2 hover:bg-red-600"
//               >
//                 {isReject ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}
//                 Reject
//               </Button>
//               <Button
//                 disabled={isConfirm}
//                 onClick={() => handleConfirm(journal.id)}
//                 className="bg-green-500 px-4 py-2 hover:bg-green-600"
//               >
//                 {isConfirm ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}
//                 Confirm
//               </Button>
//             </>
//           ) : storeId === journal.fromStoreId &&
//             journal.status === "ON_PROGRESS" ? (
//             <Button
//               disabled={isArrive}
//               onClick={() => handleArrive(journal.id)}
//               className="bg-blue-500 px-4 py-2 hover:bg-blue-600"
//             >
//               {isArrive ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : null}
//               Arrive
//             </Button>
//           ) : null}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DialogJournalDetail;
