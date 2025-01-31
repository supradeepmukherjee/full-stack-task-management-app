import { server } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { increment } from "@/redux/reducers/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidCartAdd } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "./form";
import { Input } from "./input";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Item name must be atleast 4 characters' }).optional(),
  category: z.string().optional(),
  price: z.coerce.number().gte(1, 'Price must be atleast Rs. 1').optional(),
  availability: z.enum(['yes', 'no'], { required_error: "Please select either yes/no for availability", }).optional(),
})

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  price,
  availability,
  id
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  availability: string;
  price: number;
  id: string
}) => {
  const [loading, setLoading] = useState(false)
  const { toast, } = useToast()
  const dispatch = useDispatch()
  const form = useForm<z.infer<typeof FormSchema>>({ resolver: zodResolver(FormSchema) })
  async function onSubmit({ availability, name, price, category }: z.infer<typeof FormSchema>) {
    if (!(availability || name || price || category)) return toast({
      variant: "destructive",
      title: "There is nothing to be updated for the item",
    })
    setLoading(true)
    toast({
      title: "Updating Item",
      description: "Please wait..."
    })
    let availability_
    if (availability === 'no') availability_ = false
    else availability_ = true
    try {
      const { data } = await axios.put(
        server + `/menu/` + id,
        {
          name: name?.trim(),
          availability: availability_,
          category,
          price
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      toast({
        title: data.msg,
        description: "Reloading Page in 5 seconds"
      })
      setTimeout(() => {
        window.location.reload()
      }, 5000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      toast({
        variant: "destructive",
        title: err?.response?.data?.msg || "Uh oh! Something went wrong.",
        description: "Please Try Again",
      })
      setLoading(false)
    }
  }
  const handleDel = async () => {
    setLoading(true)
    toast({
      title: "Deleting Item",
      description: "Please wait..."
    })
    try {
      const { data } = await axios.delete(
        server + `/menu/` + id,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      toast({
        title: data.msg,
        description: "Reloading Page in 5 seconds"
      })
      setTimeout(() => {
        window.location.reload()
      }, 5000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      toast({
        variant: "destructive",
        title: err?.response?.data?.msg || "Uh oh! Something went wrong.",
        description: "Please Try Again",
      })
      setLoading(false)
    }
  }
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col ",
        className
      )}
    >
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex flex-col justify-evenly">
        <div className="font-sans font-bold flex justify-between items-center text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          <span>
            {title}
          </span>
          <span
            className={'rounded-full p-1 ' + (availability ? 'hover:bg-gray-100' : '')}
            onClick={() => {
              if (availability)
                dispatch(increment({
                  id,
                  availability,
                  name: title,
                  category: description,
                  price
                }))
            }}>
            <BiSolidCartAdd className={'h-6 w-6 ' + (availability ? 'cursor-pointer' : '')} />
          </span>
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
        <div className="font-sans flex justify-between items-center font-semibold text-neutral-600 text-md mt-4 dark:text-neutral-300">
          Rs.{price} ({availability})
          <div className="w-[25%] flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <span className='hover:bg-gray-100 rounded-full p-1'>
                  <MdDelete className='h-4 w-4 cursor-pointer' />
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#001A27]">
                <DialogHeader>
                  <DialogTitle>
                    Are you Sure you want to Delete the Item?
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-between mt-4">
                  <Button type="button" variant="destructive" onClick={handleDel}>
                    Delete
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <span className='hover:bg-gray-100 rounded-full p-1'>
                  <FaEdit className='h-4 w-4 cursor-pointer' />
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#001A27]">
                <DialogHeader>
                  <DialogTitle>
                    Update the selected Item
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (Rs.)</FormLabel>
                          <FormControl>
                            <Input  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Availability</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full text-center border-white border-2" disabled={loading}>
                      Update Item
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
