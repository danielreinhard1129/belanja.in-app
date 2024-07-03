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
import { Dispatch, FC, SetStateAction } from "react";

interface SendOrderDialogProps {
  handleSend: () => void;
  openSendDialog: boolean;
  setOpenSendDialog: Dispatch<SetStateAction<boolean>>;
}

const SendOrderDialog: FC<SendOrderDialogProps> = ({
  handleSend,
  openSendDialog,
  setOpenSendDialog,
}) => {
  return (
    <AlertDialog open={openSendDialog} onOpenChange={setOpenSendDialog}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Order?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>MAKE SURE ALL ORDER ITEMS ARE INCLUDED.</p>
            <p className="text-red-400">MAKE SURE PAYMENT HAS ALREADY BEEN DONE.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2"
            onClick={() => {
              handleSend();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SendOrderDialog;
