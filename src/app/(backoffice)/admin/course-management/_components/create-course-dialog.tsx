import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useForm, Controller } from 'react-hook-form'
export function CreateCourseDialog({
  open = false,
  onChange,
}: { open: boolean; onChange: (status: boolean) => void }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: null,
    },
  })
  const onSubmit = (data) => console.log(data)
  return (
    <Dialog open={open} onOpenChange={(status) => onChange(status)}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-4">
            <DialogTitle>Create course</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 p-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea {...field} spellCheck />}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => <Input type="file" {...field} />}
              />
            </div>
          </div>
          <DialogFooter className="py-2 px-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCourseDialog
