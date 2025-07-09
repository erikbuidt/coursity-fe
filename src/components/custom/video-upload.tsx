import { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import type { ControllerRenderProps } from 'react-hook-form'
import { CircleX } from 'lucide-react'

export const VideoUpload = (
  field: ControllerRenderProps & { video_preview?: string; error?: string },
) => {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (!field.value) {
      setSelectedFile(undefined)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }, [field.value])

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      if (field) field.onChange(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
    if (field) field.onChange(e.target.files[0])
  }

  const onRemove = () => {
    setSelectedFile(undefined)
    if (field) field.onChange(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }
  return (
    <div>
      <Input
        ref={inputRef}
        type="file"
        onChange={onSelectFile}
        accept="video/mp4"
        error={field.error}
      />
      <div className="w-[100%] rounded-md mt-3 relative group">
        <div className="rounded-md overflow-hidden">
          {selectedFile ? (
            // biome-ignore lint/a11y/useMediaCaption: <explanation>
            <video src={preview} width={300} height={400} className="max-h-40">
              <source src={preview} type="video/mp4"></source>
            </video>
          ) : (
            field.video_preview && (
              // biome-ignore lint/a11y/useMediaCaption: <explanation>
              <video src={field.video_preview} width={300} height={400} className="max-h-40">
                <source src={field.video_preview} type="video/mp4"></source>
              </video>
            )
          )}
        </div>
        {/* <CircleX
          onClick={onRemove}
          className="group-hover:block hidden cursor-pointer absolute right-0 top-0 -translate-1/2 translate-x-1/2 text-red-400"
        /> */}
      </div>
    </div>
  )
}
