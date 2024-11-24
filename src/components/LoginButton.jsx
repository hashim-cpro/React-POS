import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  logout,
  getCurrentUser,
  verifyOTP,
} from "../config/appwrite";
import { setUser, clearUser, syncUserData } from "../store/slices/authSlice";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { setProducts } from "../store/slices/inventorySlice";
import { loadSales } from "../store/slices/salesSlice";
import { setPurchases } from "../store/slices/purchaseSlice";
import { setExpenses } from "../store/slices/expenseSlice";

// eslint-disable-next-line react/prop-types
export default function LoginButton({ isCollapsed }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const syncing = useSelector((state) => state.auth.syncing);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          dispatch(setUser(response.data));
          await dispatch(syncUserData(response.data.$id));
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    if (!user) {
      checkSession();
    }
  }, [dispatch, user]);

  const syncSessionData = async (userId) => {
    try {
      let hasData = false;
      const inventory = sessionStorage.getItem("pos_inventory");
      const sales = sessionStorage.getItem("pos_sales");
      const purchases = sessionStorage.getItem("pos_purchases");
      const expenses = sessionStorage.getItem("pos_expenses");

      if (inventory) {
        const data = JSON.parse(inventory);
        if (data.products?.length > 0) {
          dispatch(setProducts(data.products));
          hasData = true;
        }
      }
      if (sales) {
        const data = JSON.parse(sales);
        if (data.sales?.length > 0) {
          dispatch(loadSales(data.sales));
          hasData = true;
        }
      }
      if (purchases) {
        const data = JSON.parse(purchases);
        if (data.purchases?.length > 0) {
          dispatch(setPurchases(data.purchases));
          hasData = true;
        }
      }
      if (expenses) {
        const data = JSON.parse(expenses);
        if (Object.keys(data).length > 0) {
          dispatch(setExpenses(data));
          hasData = true;
        }
      }

      if (hasData) {
        await dispatch(syncUserData(userId));
      }

      sessionStorage.clear();
    } catch (error) {
      console.error("Error syncing session data:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await login(formData.email, formData.password);
        if (response.success) {
          dispatch(setUser(response.data));
          await dispatch(syncUserData(response.data.$id));
          setIsModalOpen(false);
          setFormData({ email: "", password: "", name: "" });
        } else {
          setError(response.error);
        }
      } else {
        const response = await register(
          formData.email,
          formData.password,
          formData.name
        );
        if (response.success) {
          setRegistrationData(response);
          setShowOTPInput(true);
          setError("");
        } else {
          setError(response.error);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!registrationData?.userId) {
        throw new Error("Registration data is missing");
      }

      const response = await verifyOTP(registrationData.userId, otp);
      if (response.success) {
        const userData = {
          id: registrationData.userId,
          email: formData.email,
          name: formData.name,
          emailVerification: true,
        };
        dispatch(setUser(userData));
        await syncSessionData(registrationData.userId);
        setIsModalOpen(false);
        setOTP("");
        setShowOTPInput(false);
        setRegistrationData(null);
        setFormData({ email: "", password: "", name: "" });
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logout();
      if (response.success) {
        dispatch(clearUser());
        sessionStorage.clear();
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setShowOTPInput(false);
    setOTP("");
    setError("");
    setRegistrationData(null);
    setFormData({ email: "", password: "", name: "" });
  };

  const renderOTPForm = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enter OTP
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter the OTP sent to your email"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Verify OTP"
        )}
      </button>
    </form>
  );

  return (
    <>
      <div className="mt-auto mb-4 px-4">
        {user ? (
          <div
            className={`bg-gray-50 rounded-lg p-3 ${
              isCollapsed ? "items-center" : ""
            }`}
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "mb-3"
              }`}
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {syncing && (
                    <p className="text-xs text-blue-500">Syncing data...</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                isCollapsed ? "p-2" : "px-4 py-2"
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : isCollapsed ? (
                <span className="sr-only">Logout</span>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full flex items-center justify-center bg-customblue text-white rounded-lg hover:bg-blue-600 transition-colors ${
              isCollapsed ? "p-2" : "px-4 py-2"
            }`}
          >
            {isCollapsed ? (
              <span className="sr-only">Login</span>
            ) : (
              "Login / Register"
            )}
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-6">
                {showOTPInput ? "Verify Email" : isLogin ? "Login" : "Register"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {showOTPInput ? (
                renderOTPForm()
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        required={!isLogin}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : isLogin ? (
                      "Login"
                    ) : (
                      "Register"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-500"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                      }}
                    >
                      {isLogin
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
