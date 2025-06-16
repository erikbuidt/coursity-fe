'use client'
import { Card, CardContent } from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
function CarouselAutoPlay({ items }: { items: { name: string }[] }) {
  return (
    <Carousel
      className="w-full mt-8"
      opts={{
        align: 'start',
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {items.map((category, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/6">
            <div className="p-3">
              <Card className="group bg-gray-100 border-0 shadow-none hover:bg-indigo-950">
                <div className=" rounded-full w-20 h-20 bg-white mx-auto flex items-center justify-center mb-4">
                  asd
                </div>
                <CardContent className="">
                  <h3 className="font-bold text-center h-10 group group-hover:text-white">
                    {category.name}
                  </h3>
                  <div className="mx-auto mt-1 text-center text-xs text-gray-500 group-hover:text-white">
                    1 Course
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default CarouselAutoPlay
