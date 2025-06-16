import ReactPlayer from 'react-player'

export default function YouTubePlayer({ videoUrl }: { videoUrl: string }) {
  return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />
}
