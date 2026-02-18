import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import AuthLoader from "@/Components/AuthLoader.jsx";

export default function App({ Component, pageProps }) {
  return <>

  <Provider store={store}>
    <AuthLoader>
    <Component {...pageProps} />
    </AuthLoader>
  </Provider>
  
  
  </>
}
