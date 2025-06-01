'use client'
import { fileApi } from '@/services/fileService'
import { useAuth } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { getToken } = useAuth()
  const { mutateAsync: initUpload } = useMutation({
    mutationFn: async (arg: { filename: string; bucket: string }) => {
      const { filename, bucket } = arg
      const token = await getToken()
      return fileApi.uploadLargeFileInit(filename, bucket, token || '')
    },
  })

  const { mutate: completeUpload } = useMutation({
    mutationFn: async (arg: {
      filename: string
      bucket: string
      uploadId: string
      parts: { partNumber: number; etag: string }[]
    }) => {
      const { filename, bucket, uploadId, parts } = arg
      const token = await getToken()
      return fileApi.uploadLargeFileComplete(filename, bucket, uploadId, parts, token || '')
    },
  })

  const { mutateAsync: chunkUpload } = useMutation({
    mutationFn: async (arg: {
      filename: string
      bucket: string
      uploadId: string
      partNumber: number
      formData: FormData
    }) => {
      const { filename, bucket, uploadId, partNumber, formData } = arg
      const token = await getToken()
      return fileApi.uploadLargeFileChunk(
        filename,
        bucket,
        uploadId,
        partNumber,
        formData,
        token || '',
      )
    },
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const bucket = 'coursity'

    try {
      // 1. Initialize Multipart Upload
      const { upload_id } = await initUpload({ filename: file.name, bucket })
      setUploadId(upload_id)

      const chunkSize = 5 * 1024 * 1024 // 5MB
      const totalParts = Math.ceil(file.size / chunkSize)
      const parts: { partNumber: number; etag: string }[] = []

      const MAX_CONCURRENT_UPLOADS = 5 // Start with higher concurrency
      const failedChunks: number[] = []

      // Upload Function
      const uploadChunk = async (partNumber: number) => {
        const chunk = file.slice((partNumber - 1) * chunkSize, partNumber * chunkSize)
        const formData = new FormData()
        formData.append('chunk', chunk)

        try {
          const { etag } = await chunkUpload({
            filename: file.name,
            bucket,
            partNumber,
            uploadId: upload_id,
            formData,
          })
          parts.push({ partNumber, etag })
        } catch (error) {
          console.error(`Chunk ${partNumber} failed:`, error)
          failedChunks.push(partNumber)
        }
      }

      // Upload Chunks in Parallel with Concurrency Control
      const chunkUploadTasks = Array.from({ length: totalParts }, (_, i) => i + 1).map(
        (partNumber) => uploadChunk(partNumber),
      )

      // Upload in Batches of MAX_CONCURRENT_UPLOADS
      for (let i = 0; i < chunkUploadTasks.length; i += MAX_CONCURRENT_UPLOADS) {
        await Promise.allSettled(chunkUploadTasks.slice(i, i + MAX_CONCURRENT_UPLOADS))
      }

      // Retry Failed Chunks (if any)
      if (failedChunks.length > 0) {
        console.warn(`Retrying ${failedChunks.length} failed chunks...`)
        await Promise.allSettled(failedChunks.map((partNumber) => uploadChunk(partNumber)))
      }

      // Ensure parts are in ascending order
      parts.sort((a, b) => a.partNumber - b.partNumber)

      // 3. Complete Multipart Upload
      await completeUpload({ filename: file.name, bucket, uploadId: upload_id, parts })

      alert('Upload complete')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  )
}

export default UploadVideo
