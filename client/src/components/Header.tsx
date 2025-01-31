import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "./ui/form"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { server } from "@/constant";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Item name must be atleast 4 characters' }),
  category: z.string().optional(),
  price: z.coerce.number().gte(1, 'Price must be atleast Rs. 1'),
  availability: z.enum(['yes', 'no'], { required_error: "Please select either yes/no for availability", }),
})

const Header = () => {
  const { toast, } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({ resolver: zodResolver(FormSchema) })
  async function onSubmit({ availability, name, price, category }: z.infer<typeof FormSchema>) {
    toast({
      title: "Adding New Item",
      description: "Please wait..."
    })
    let availability_
    if (availability === 'no') availability_ = false
    else availability_ = true
    try {
      const { data } = await axios.post(
        server + `/menu`,
        {
          name: name.trim(),
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
    }
  }
  return (
    <header className=" h-[10vh] border-white w-screen border-b-0.25 sticky flex justify-between items-center px-8">
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              <span className="pr-4">
                Add new Item
              </span>
              <IoMdAddCircle />
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#001A27]">
          <DialogHeader>
            <DialogTitle>
              Add a new Item
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
              <Button type="submit" className="w-full text-center border-white border-2">
                Add Item
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          <span className="pr-4">
            Cart (0)
          </span>
          <FaShoppingCart />
        </span>
      </button>
    </header>
  )
}

export default Header