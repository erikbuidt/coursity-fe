import IconInput from '@/components/custom/icon-input'
import { ImageUpload } from '@/components/custom/image-upload'
import TodoInput, { Task } from '@/components/custom/todo-input'
import { z, ZodType } from 'zod' // Add new import
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
import LoadingButton from '@/components/ui/loading-button'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { courseApi } from '@/services/courseService'
import { useAuth } from '@clerk/nextjs'
import { Select } from '@radix-ui/react-select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DollarSign } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
type FormData = {
  title: string
  description: string
  thumbnail: File | null
  price: number
  category?: string
  will_learns: Task[]
  requirements: Task[]
}
const createCourseSchema: ZodType<FormData> = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .nonempty(),
  category: z.string().optional(),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .nonempty(),
  price: z.any({
    required_error: 'Price is required',
  }),
  thumbnail: z
    .any({
      required_error: 'Thumbnail is required',
    })
    .refine((file) => file instanceof File, {
      message: 'Thumbnail must be a file',
    }) as z.ZodType<File>,
  will_learns: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isNew: z.boolean(),
      }),
    )
    .min(1, { message: 'At least one is required' }),
  requirements: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isNew: z.boolean(),
      }),
    )
    .min(1, { message: 'At least one is required' }),
})

export function CreateCourseDialog({
  open = false,
  onChange,
}: { open: boolean; onChange: (status: boolean) => void }) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: null,
      price: 0,
      category: '',
      will_learns: [],
      requirements: [],
    },
    resolver: zodResolver(createCourseSchema),
  })
  console.log({ errors })
  const { mutateAsync: createCourse, isPending } = useMutation({
    mutationFn: async (args: { formaData: FormData }) => {
      const token = await getToken()
      return courseApi.createCourse(
        {
          category: args.formaData.category,
          description: args.formaData.description,
          price: args.formaData.price,
          title: args.formaData.title,
          requirements: args.formaData.requirements.map((i) => i.text),
          will_learns: args.formaData.will_learns.map((i) => i.text),
          thumbnail: args.formaData.thumbnail,
        },
        token || '',
      )
    },
    onSuccess: () => {
      onChange(false)
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course has been created successfully', {})
    },
  })
  const onSubmit = (data: FormData) => {
    createCourse({ formaData: data })
  }
  return (
    <Dialog open={open} onOpenChange={(status) => onChange(status)}>
      <DialogContent className="sm:max-w-[425px] ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-4">
            <DialogTitle>Create course</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 p-4  max-h-[70vh] overflow-auto">
            <div className="grid gap-3">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} error={errors.title?.message} />}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} spellCheck error={errors.description?.message} />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-3">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Video Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Youtube</SelectItem>
                    <SelectItem value="dark">System</SelectItem>
                    <SelectItem value="system">Vimeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="price">
                  Price<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <IconInput type="number" icon={<DollarSign size={15} />} {...field} />
                  )}
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price">
                What will learns<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="will_learns"
                control={control}
                render={({ field }) => <TodoInput {...field} error={errors.will_learns?.message} />}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price">
                Requirements<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <TodoInput {...field} error={errors.requirements?.message} />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="thumbnail">
                Thumbnail<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <ImageUpload image_preview={''} {...field} error={errors.thumbnail?.message} />
                )}
              />
            </div>
          </div>
          <DialogFooter className="py-2 px-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {/* <Button type="submit">Create</Button> */}
            <LoadingButton isLoading={isPending} fallback="Creating..." type="submit">
              Create
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCourseDialog
