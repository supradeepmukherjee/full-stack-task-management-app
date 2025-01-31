import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { server } from '@/constant';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Menu = () => {
  const { toast, } = useToast()
  const [items, setItems] = useState<{
    _id: string,
    name: string,
    price: number,
    category: string,
    availability: boolean
  }[]>([])
  useEffect(() => {
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
  }, [toast])
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items?.map(i => (
        <BentoGridItem
          key={i._id}
          title={i.name}
          description={i.category}
          price={i.price}
          availability={i.availability ? 'Available' : 'Unavailable'}
        />
      ))}
    </BentoGrid>
  )
}

export default Menu