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
      <AlertDialogContent className="rounded-none border border-white/10 bg-[#111111] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-eb-garamond text-2xl text-[#f4f0e6]">
            Delete room?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/55">
            This will permanently delete {roomSlug ?? "this room"} and all of
            its drawings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-white/10 bg-[#0a0a0a]">
          <AlertDialogCancel className="rounded-none border-white/15 bg-transparent text-white/65 hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-none bg-red-400 text-black hover:bg-red-300"
          >
            Delete room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
