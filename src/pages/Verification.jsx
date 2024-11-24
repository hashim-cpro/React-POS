import { verifyNewUser } from "../config/appwrite";

function Verification() {
  verifyNewUser();
  return <div>This is the verification page!</div>;
}
export default Verification;
