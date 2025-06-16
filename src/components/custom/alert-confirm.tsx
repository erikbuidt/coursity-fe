import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import LoadingButton from '@/components/ui/loading-button'

export function AlertConfirm({
  open = false,
  isPending = false,
  onContinue,
  onCancel,
}: { open?: boolean; onContinue: () => void; onCancel: () => void; isPending: boolean }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <LoadingButton
            className="cursor-pointer"
            isLoading={isPending}
            fallback="Deleting"
            onClick={onContinue}
          >
            Continue
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
