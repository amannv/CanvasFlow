import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

type RoomDeleteDialogProps = {
  roomSlug?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function RoomDeleteDialog({
  roomSlug,
  open,
  onOpenChange,
  onConfirm,
}: RoomDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-4 border-black bg-[#ffffff] p-6 text-black shadow-[8px_8px_0px_0px_#000000] sm:max-w-md">
        <AlertDialogHeader className="relative space-y-4">
          <AlertDialogTitle className="flex items-center gap-3 font-sans text-2xl font-black uppercase tracking-tight text-black">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-black bg-[#0099FF] text-white">
              <Trash2 size={20} strokeWidth={3} />
            </div>
            Delete Room
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-sm font-bold leading-relaxed text-black/70">
            Are you sure you want to delete{" "}
            <span className="text-black underline">
              {roomSlug ?? "this room"}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex flex-col gap-4 sm:flex-row sm:space-x-0">
          <AlertDialogCancel className="h-12 flex-1 rounded-xl border-4 border-black bg-white px-8 font-mono font-bold uppercase tracking-widest text-black transition-all hover:bg-black/5 hover:text-black">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-12 flex-1 rounded-xl border-4 border-black bg-red-500 px-8 font-mono font-bold uppercase tracking-widest text-white transition-all hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
