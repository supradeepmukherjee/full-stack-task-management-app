import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { server } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaAngleDown, FaHistory, FaShoppingCart } from "react-icons/fa";
import { IoMdAddCircle, IoMdMenu } from "react-icons/io";
import { MdLogout, MdMenuBook } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { columns } from "./Header";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Item name must be atleast 4 characters' }),
  category: z.string().optional(),
  price: z.coerce.number().gte(1, 'Price must be atleast Rs. 1'),
  availability: z.enum(['yes', 'no'], { required_error: "Please select either yes/no for availability", }),
})

const MobileHeader = () => {
  const [open, setOpen] = useState(false)
  const { toast, } = useToast()
  const { items } = useSelector(({ cart }: RootState) => cart);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const navigate = useNavigate()
  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
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
    <header className=" h-[10vh] border-white w-screen border-b-0.25 sticky px-8 flex items-center">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="bg-[#001A27]">
            <IoMdMenu />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#001A27]">
          <div className='flex flex-col gap-8 my-8 w-screen items-center'>
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
            <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={() => navigate('/menu')}>
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <span className="pr-4">
                  Go to Menu
                </span>
                <MdMenuBook />
              </span>
            </button>
            <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={() => navigate('/menu')}>
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <span className="pr-4">
                  Order History
                </span>
                <FaHistory />
              </span>
            </button>
            <Dialog >
              <DialogTrigger asChild>
                <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    <span className="pr-4">
                      Cart ({items.length})
                    </span>
                    <FaShoppingCart />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className=" bg-[#001A27]">
                <DialogHeader>
                  <DialogTitle>
                    Your Cart
                  </DialogTitle>
                </DialogHeader>
                <div className="max-w-screen-sm overflow-auto">
                  <div className="flex items-center gap-4 justify-between py-4">
                    <Input
                      placeholder="Filter Category..."
                      value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn("category")?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto text-black">
                          Columns <FaAngleDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            )
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id} className="text-white">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              There are no items in your Cart
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                      <DialogClose asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate('/checkout')}
                          disabled={items.length === 0}
                        >
                          Checkout
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={() => {
              toast({
                title: "Logging Out.",
                description: "Please Wait...",
              })
              axios.get(server + `/logout`, { withCredentials: true })
                .then(({ data }) => {
                  toast({ title: data.msg })
                  window.location.reload()
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((err: any) => {
                  console.log(err)
                  toast({
                    variant: "destructive",
                    title: err?.response?.data?.msg || "Uh oh! Couldn't Log Out",
                    description: "Please Try Again",
                  })
                })
            }}>
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <span className="pr-4">
                  Logout
                </span>
                <MdLogout />
              </span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  )
}

export default MobileHeader