import Collapse from "@/components/custom/collapse";
import Rating from "@/components/custom/rating";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { durationToClockFormat } from "@/lib/utils";
import { Check, Globe, MonitorPlay } from "lucide-react";
import { cookies } from "next/headers";
import { Fragment } from "react";
import SummaryCourse from "./components/summary-course";
import { notFound } from "next/navigation";
import { courseApi } from "@/services/courseService";

// Added responsive styles for tablet and mobile
async function CourseDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug.toString();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("__session");
  const course = await courseApi.getCourse(slug, sessionToken?.value);
  if (!course) {
    notFound();
  }
  return (
    <>
      <div className="bg-stone-100">
        <div className="container px-4 md:max-w-5xl lg:max-w-6xl py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black">
        <div className="container px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-white">
            <div className="relative col-span-12 md:col-span-8">
              <h1 className="text-2xl md:text-4xl font-bold">{course.title}</h1>
              <div className="mt-4 text-sm md:text-base">
                {course.description}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 text-xs md:text-sm">
                <Rating rating={4.5} />
                <span>(344 Reviewing)</span>
                <span>1623 students</span>
              </div>
              <div className="mt-5 text-sm md:text-base">Created by: Erik</div>
              <div className="flex gap-2 mt-4 text-sm md:text-base">
                <Globe />
                Vietnamese
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 md:hidden block">
          <div className="mt-4">
            <SummaryCourse course={course} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 mt-8">
          <div className="border-2 border-gray-200">
            <h3 className="font-bold text-xl md:text-2xl pl-4 pt-4">
              What you'll learn
            </h3>
            <ul className="flex flex-wrap p-4 font-semibold text-gray-600 text-xs md:text-sm">
              {course.will_learns?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center mt-2 w-full md:w-[50%]"
                >
                  <Check className="mr-2 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <h3 className="font-bold text-xl md:text-2xl pt-4">Requirements</h3>
          <ul className="flex flex-col font-semibold text-gray-600 text-xs md:text-sm">
            {course.requirements?.map((item, index) => (
              <li key={index} className="flex items-center mt-2">
                <Check className="mr-2 text-primary" /> {item}
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-xl md:text-2xl my-4">Course content</h3>
          {course.chapters.map((chapter) => (
            <Fragment key={chapter.id}>
              <Collapse title={chapter.title}>
                <ul className="flex flex-col">
                  {chapter.lessons?.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex gap-4 items-center px-4 py-2 hover:bg-accent text-xs md:text-sm"
                    >
                      <MonitorPlay className="text-primary" size={20} />
                      <span>{lesson.title}</span>
                      <div className="ml-auto text-gray-400">
                        {durationToClockFormat(lesson.duration)}
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </Fragment>
          ))}
        </div>
        <div className="col-span-12 md:col-span-4 hidden md:block">
          <div className="sticky top-20 md:top-60">
            <SummaryCourse course={course} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetail;
