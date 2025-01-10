import { resetPassword } from "../config/appwrite";
import { useState } from "react";
function PasswordRecovery() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(
        userId,
        secret,
        formData.password,
        formData.confirmPassword
      ).then(() => {
        console.log("Password reset successful");
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password");
    }
  };

  return (
    <div>
      <h1>Password Recovery</h1>
      <form>
        <label>Enter new password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="something strong"
          className="block"
        />
        <label>Confirm new password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="something you won't forget"
          className="block"
        />

        <button type="submit" onClick={handleSubmit}>
          Reset Password
        </button>
      </form>
      Make sure that you remeber it, because you will need it to login
    </div>
  );
}
export default PasswordRecovery;
