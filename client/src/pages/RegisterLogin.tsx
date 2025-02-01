import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { server } from "@/constant"
import { useToast } from "@/hooks/use-toast"
import { userExists } from "@/redux/reducers/auth"
import { RootState } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(4, { message: 'Username must be atleast 4 characters' }),
  password: z.string().min(8, { message: 'Password must be atleast 8 characters' })
})

const RegisterLogin = () => {
  const { user } = useSelector(({ auth }: RootState) => auth)
  const dispatch = useDispatch()
  const [login, setLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ''
    },
  })
  async function onSubmit({ username, password }: z.infer<typeof formSchema>) {
    setLoading(true)
    toast({
      title: login ? 'Logging in' : "Registering",
      description: "Please wait..."
    })
    try {
      const { data } = await axios.post(
        server + (login ? `/login` : `/register`),
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      toast({ title: data.msg })
      if (login) {
        dispatch(userExists(data.user))
        navigate('/menu')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      toast({
        variant: "destructive",
        title: err?.response?.data?.msg || "Uh oh! Something went wrong.",
        description: "Please Try Again",
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (user) navigate('/menu')
  }, [navigate, user])
  return (
    <div className="p-16 border-2 rounded-xl mt-16">
      <div className="flex justify-center">
        <h1 className="text-xl relative bottom-8 ">
          {login ? 'Login to your Account' : 'Register Yourself'}
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input  {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full text-center border-white border-2" disabled={loading}>
            {login ? 'Login' : 'Register'}
          </Button>
        </form>
      </Form>
      <div className="flex justify-center">
        <Button type="submit" className="mt-10 px-4 border-white border-2" onClick={() => setLogin(l => !l)} disabled={loading}>
          {login ? 'Not registered yet? Click here' : 'Already Registered?'}
        </Button>
      </div>
    </div>
  )
}

export default RegisterLogin