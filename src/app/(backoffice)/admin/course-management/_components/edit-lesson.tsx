import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function EditLesson() {
  return (
    <>
      <h4 className="font-bold">Edit Lesson</h4>
      <div className="space-y-2">
        <Label htmlFor="title">Lesson Title</Label>
        <Input id="title" name="title" defaultValue="Pedro Duarte" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">Video Provider</Label>
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
      <div className="space-y-2">
        <Label htmlFor="file">Video</Label>
        <Input id="file" name="file" type="file" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input id="link" name="link" type="text" />
      </div>
      <Button className="w-fit bg-primary ml-auto" variant="outline">
        Save
      </Button>
    </>
  )
}

export default EditLesson
