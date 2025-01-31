import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import { server } from "./constant";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { MultiStepLoader } from "./components/ui/multi-step-loader";
import { userExists, userNotExists } from "./redux/reducers/auth";
import Protect from "./components/Protect";
const RegisterLogin = lazy(() => import("./pages/RegisterLogin"))
const Menu = lazy(() => import("./pages/Menu"))

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(({ auth }) => auth)
  useEffect(() => {
    axios.get(server + `/user`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()))
  }, [dispatch])
  return (
    <div className="h-full flex flex-col justify-center items-center px-4 gap-8 overflow-x-hidden">
      <Router>
        {loading ? <Loader /> :
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/' element={<RegisterLogin />} />
              <Route element={<Protect user={user} />}>
                <Route path='/menu' element={<Menu />} />

              </Route>
            </Routes>
          </Suspense>}
      </Router>
    </div>
  );
}

const Loader = () => <MultiStepLoader loadingStates={[{ text: 'Loading... Please Wait' }]} loading={true} duration={2000} />

export default App
