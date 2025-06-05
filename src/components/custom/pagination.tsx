import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  pageSize: number
  queryConfig: { page: number }
}
const RANGE = 2
function Pagination({ pageSize, queryConfig }: Props) {
  const currentPage: number = Number(queryConfig.page || 1)
  const renderPagination = () => {
    let afterDot = false
    let beforeDot = false
    const renderBeforeDot = (index: number) => {
      if (!beforeDot) {
        beforeDot = true
        return (
          <li
            key={index}
            className="hover:bg-accent flex items-center justify-center w-[35px] h-[35px] rounded-sm"
          >
            <a
              rel="nofollow"
              href="https://demo73.leotheme.com/prestashop/leo_funisox_demo/en/2-home?plist_key=plist2370768740"
              className="disabled js-search-link"
            >
              ...
            </a>
          </li>
        )
      }
      return null
    }
    const renderAfterDot = (index: number) => {
      if (!afterDot) {
        afterDot = true
        return (
          <li
            key={index}
            className="hover:bg-accent flex items-center justify-center w-[35px] h-[35px] rounded-sm"
          >
            <a
              rel="nofollow"
              href="https://demo73.leotheme.com/prestashop/leo_funisox_demo/en/2-home?plist_key=plist2370768740"
              className="disabled js-search-link"
            >
              ...
            </a>
          </li>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        //TH1: after dot
        if (
          currentPage <= RANGE * 2 + 1 &&
          pageNumber > currentPage + RANGE &&
          pageNumber < pageSize - RANGE + 1
        )
          return renderAfterDot(index)
        //TH@: before dot and after dot
        // biome-ignore lint/style/noUselessElse: <explanation>
        else if (currentPage > RANGE * 2 + 1 && currentPage < pageSize - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) return renderBeforeDot(index)
          // biome-ignore lint/style/noUselessElse: <explanation>
          else if (pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1)
            return renderAfterDot(index)
        }
        //TH3: before dot
        else if (
          currentPage >= pageSize - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < currentPage - RANGE
        )
          return renderBeforeDot(index)
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <li key={index}>
            <Link
              rel="nofollow"
              href={`?page=${pageNumber}`}
              className={`${currentPage === pageNumber && 'current'} relative hover:bg-accent flex items-center justify-center w-[35px] h-[35px] rounded-sm`}
            >
              <span className="">{pageNumber}</span>
            </Link>
          </li>
        )
      })
  }
  return (
    <>
      <div className="flex justify-center items-center">
        <ul className="flex gap-2 font-semibold text-sm">
          {currentPage > 1 && (
            <li className="hover:bg-accent px-2 py-1 rounded-sm flex items-center">
              <Link
                rel="prev"
                href={`?page=${currentPage - 1}`}
                className="previous js-search-link"
              >
                <span className="flex gap-1 items-center">
                  <ChevronLeft size={15} />
                  Previous
                </span>
              </Link>
            </li>
          )}

          {renderPagination()}
          {currentPage < pageSize && (
            <li className="hover:bg-accent px-2 py-1 rounded-sm flex items-center">
              <Link rel="next" href={`?page=${currentPage + 1}`} className="next js-search-link">
                <span className="flex items-center gap-1">
                  Next <ChevronRight size={15} />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export default Pagination
