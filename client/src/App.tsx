import axios from 'axios';
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Protect from "./components/Protect";
import { MultiStepLoader } from "./components/ui/multi-step-loader";
import { server } from "./constant";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { RootState } from "./redux/store";
import { useMediaQuery } from './hooks/use-media-query';
import MobileHeader from './components/MobileHeader';
const RegisterLogin = lazy(() => import("./pages/RegisterLogin"))
const Menu = lazy(() => import("./pages/Menu"))
const Checkout = lazy(() => import("./pages/Checkout"))
const Orders = lazy(() => import("./pages/Orders"))

function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const dispatch = useDispatch()
  const { user, loading } = useSelector(({ auth }: RootState) => auth)
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
            {isDesktop ? <Header /> : <MobileHeader />}
            <Routes>
              <Route path='/' element={<RegisterLogin />} />
              <Route element={<Protect user={user} />}>
                <Route path='/menu' element={<Menu />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<Orders />} />
              </Route>
            </Routes>
          </Suspense>}
      </Router>
    </div>
  );
}

const Loader = () => <MultiStepLoader loadingStates={[{ text: 'Loading... Please Wait' }]} loading={true} duration={2000} />

export default App
