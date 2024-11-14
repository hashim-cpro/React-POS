import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout, getCurrentUser } from "../config/appwrite";
import { setUser, clearUser, syncUserData } from "../store/slices/authSlice";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// eslint-disable-next-line react/prop-types
export default function LoginButton({ isCollapsed }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
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
          dispatch(syncUserData(response.data.$id));
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    if (!user) {
      checkSession();
    }
  }, [dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      if (isLogin) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(
          formData.email,
          formData.password,
          formData.name
        );
      }

      if (response.success) {
        dispatch(setUser(response.data));
        dispatch(syncUserData(response.data.$id));
        setIsModalOpen(false);
        setFormData({ email: "", password: "", name: "" });
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const response = await logout();
    if (response.success) {
      dispatch(clearUser());
    }
    setIsLoading(false);
  };

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
                onClick={() => setIsModalOpen(false)}
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
                {isLogin ? "Login" : "Register"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

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
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin
                      ? "Don't have an account? Register"
                      : "Already have an account? Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
