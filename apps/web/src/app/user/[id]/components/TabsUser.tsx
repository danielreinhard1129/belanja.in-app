import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Baby, Cake, Mail } from "lucide-react";

export const TabsUser = ({
  email,
  birthDate,
  gender,
  id,
}: {
  email: string;
  birthDate: Date | undefined;
  gender: string;
  id: number;
}) => {
  return (
    <Card className="space-y-4 p-0 w-full border-none shadow-none py-4">
      <CardHeader>
        <CardTitle>Information Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        <div className="flex w-full items-center justify-between text-gray-500">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <p className="text-sm">Email</p>
          </div>
          <p className="text-xs font-medium">{email}</p>
        </div>
        <div className="flex w-full items-center justify-between text-gray-500">
          <div className="flex items-center gap-2">
            <Cake size={16} />
            <p className="text-sm">Birth date</p>
          </div>
          <p className="text-xs font-medium">
            {birthDate && (
              <span>{format(new Date(birthDate), "dd MMMM yyyy")}</span>
            )}
          </p>
        </div>
        <div className="flex w-full items-center justify-between text-gray-500">
          <div className="flex items-center gap-2">
            <Baby size={16} />
            <p className="text-sm">Gender</p>
          </div>
          <p className="text-xs font-medium">{gender}</p>
        </div>
      </CardContent>
    </Card>
  );
};
