import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { server } from '@/constant';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Menu = () => {
  const { toast, } = useToast()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<{
    _id: string,
    name: string,
    price: number,
    category: string,
    availability: boolean
  }[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }
  useEffect(() => {
    setLoading(true)
    axios.get(server + `/menu`, { withCredentials: true })
      .then(({ data }) => setItems(data.items))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        console.log(err)
        toast({
          variant: "destructive",
          title: err?.response?.data?.msg || "Uh oh! Something went wrong while fetching Menu Items.",
          description: "Please Try Again",
        })
      })
      .finally(() => setLoading(false))
  }, [toast])
  return (
    loading ? (
      <div className="flex justify-center w-screen" >
        <h1 className='text-2xl font-bold'>
          Loading...
        </h1>
      </div >
    )
      :
      (
        items.length < 1 ?
          <div className="flex justify-center w-screen" >
            <h1 className='text-2xl font-bold'>
              No Items to Show
            </h1>
          </div >
          :
          <>
            <div className="min-h-[70vh]">
              <BentoGrid className="max-w-4xl mx-auto">
                {paginatedItems?.map(i => (
                  <BentoGridItem
                    key={i._id}
                    title={i.name}
                    description={i.category}
                    price={i.price}
                    availability={i.availability ? 'Available' : 'Unavailable'}
                    id={i._id}
                  />))}
              </BentoGrid>
            </div>
            {!loading && items.length > 0 &&
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > currentPage + 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>}
          </>
      )
  )
}

export default Menu