import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import { setUser } from "./store/slices/authSlice";
import { getCurrentUser } from "./config/appwrite";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Expenses from "./pages/Expenses";
import Verification from "./pages/Verification";

export default function App() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          store.dispatch(setUser(response.data));
          console.log(
            "Email verification : ",
            response.data?.emailVerification
          );
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/expenses" element={<Expenses />} />
          </Route>
          <Route path="/verify" element={<Verification />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
