import http from '@/lib/http'
import type { SuccessResApi } from '@/types/util.type'

async function uploadLargeFileInit(
  filename: string,
  bucket: string,
  token: string,
): Promise<{ upload_id: string }> {
  const res = await http.post<SuccessResApi<{ upload_id: string }>>(
    '/files/upload/init',
    { filename, bucket },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  )
  return res.payload.data
}

async function uploadLargeFileChunk(
  filename: string,
  bucket: string,
  uploadId: string,
  partNumber: number,
  formData: FormData,
  token: string,
): Promise<{ etag: string }> {
  const res = await http.post<
    SuccessResApi<{
      etag: string
    }>
  >(
    `/files/upload/chunk?part_number=${partNumber}&bucket=${bucket}&filename=${filename}&upload_id=${uploadId}`,
    formData,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  )
  return res.payload.data
}

async function uploadLargeFileComplete(
  filename: string,
  bucket: string,
  uploadId: string,
  parts: { partNumber: number; etag: string }[],
  token: string,
): Promise<any> {
  const res = await http.post<SuccessResApi<any>>(
    '/files/upload/complete',
    { filename, bucket, upload_id: uploadId, parts },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  )
  return res.payload.data
}
export const fileApi = {
  uploadLargeFileInit,
  uploadLargeFileChunk,
  uploadLargeFileComplete,
}
