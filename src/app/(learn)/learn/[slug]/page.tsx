'use client'
import CircleProgress from '@/components/custom/circle-progress-bar'
import Collapse from '@/components/custom/collapse'
import Player from '@/components/custom/player'
import { ChevronLeft, MonitorPlay, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Learn.tsx

function Learn() {
  const router = useRouter()
  return (
    <>
      <section className="">
        <div className="flex items-center text-sm bg-indigo-950 px-4 py-2">
          <ChevronLeft
            className="text-white cursor-pointer"
            onClick={() => router.push('/courses')}
          />
          <h1 className="text-lg font-bold text-white ml-2">React JS</h1>
          <div className="ml-auto text-white mr-2"> 8/24</div>
          <CircleProgress
            progress={20}
            size={25}
            textSizeClass="text-[8px]"
            strokeWidth={2}
            textColorClass="text-white"
          />
        </div>

        <div className="">
          <div className="w-[77%] h-full fixed left-0 top-0 mt-11 overflow-auto">
            <Player
              className="w-full"
              option={{
                url: 'https://artplayer.org/assets/sample/video.mp4',
                fullscreen: true,
                container: '.artplayer-app',
              }}
              style={{
                height: '80%',
              }}
              getInstance={(art) => console.log(art)}
            />
            <div className="lg:max-w-[798px] xl:max-w-[1310] items-center mx-auto">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi inventore facere
                porro vitae nam eum, tenetur necessitatibus fugiat laboriosam accusamus maiores,
                dolor ipsum iste culpa autem repudiandae, veritatis amet velit!
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi inventore facere
                porro vitae nam eum, tenetur necessitatibus fugiat laboriosam accusamus maiores,
                dolor ipsum iste culpa autem repudiandae, veritatis amet velit!
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi inventore facere
                porro vitae nam eum, tenetur necessitatibus fugiat laboriosam accusamus maiores,
                dolor ipsum iste culpa autem repudiandae, veritatis amet velit!
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi inventore facere
                porro vitae nam eum, tenetur necessitatibus fugiat laboriosam accusamus maiores,
                dolor ipsum iste culpa autem repudiandae, veritatis amet velit!
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi inventore facere
                porro vitae nam eum, tenetur necessitatibus fugiat laboriosam accusamus maiores,
                dolor ipsum iste culpa autem repudiandae, veritatis amet velit!
              </div>
            </div>
          </div>
          <div
            className="fixed right-0 top-0 mt-12 overflow-auto w-[23%]"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            <div className="h-full w-full">
              <div className="font-semibold py-2 px-1 text-sm">Content</div>
              <Collapse title="How do I contact support?" className="text-xs">
                <ul className="flex flex-col">
                  <li className="flex gap-2 relative hover:bg-accent p-2">
                    <MonitorPlay className="text-primary shrink-0" size={15} />
                    <div className="">
                      <Link href={'?lesson_id=1'}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        String Manipulation and Code Intelligence23423424
                      </Link>
                      <div className="text-xs text-gray-400">20:00</div>
                    </div>
                    <CircleCheck size={15} className="ml-auto self-center shrink-0" />
                  </li>
                  <li className="flex gap-2 relative hover:bg-accent p-2">
                    <MonitorPlay className="text-primary shrink-0" size={15} />
                    <div className="">
                      <Link href={'?lesson_id=2'}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        String Manipulation and Code Intelligence
                      </Link>
                      <div className="text-xs text-gray-400">20:00</div>
                    </div>
                    <CircleCheck size={15} className="ml-auto self-center shrink-0" />
                  </li>
                </ul>
              </Collapse>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Learn
