import { Client, Account, Storage, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const login = async (email, password) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return {
      success: true,
      data: {
        ...user,
        email: user.email,
        name: user.name,
        id: user.$id,
        emailVerification: user.emailVerification,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

export const register = async (email, password, name) => {
  try {
    const user = await account.create("unique()", email, password, name);
    if (user) {
      // Automatically log in after registration
      account.createEmailToken(ID.unique(), email, true).then(
        function (response) {
          console.log("Success sending otp"); // Success
          return response;
        },
        function (error) {
          console.log("Failure sending otp", error); // Failure
        }
      );
      // const session = await account.createSession(user.$id, secret); secret is the otp
      return {
        success: true,
        // data: session.data,
        emailVerification: user.emailVerification,
        userId: user.$id, // Return userId for OTP verification
      };
    }
    return { success: false, error: "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

export const verifyOTP = async (userId, secret) => {
  console.log("userId", userId, "\nOTP: ", secret);
  try {
    const session = await account.createSession(userId, secret);
    return { success: true, data: session.data };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, error: error.message };
  }
};
export const verifyNewUser = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const promise = account.updateVerification(userId, secret);

  promise.then(
    function (response) {
      console.log("Verification was successful! \n", response); // Success
    },
    function (error) {
      console.log("there was some error verifying the user \n", error); // Failure
    }
  );
};
export const logout = async () => {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return {
      success: true,
      data: {
        ...user,
        email: user.email,
        name: user.name,
        id: user.$id,
        emailVerification: user.emailVerification,
      },
    };
  } catch (error) {
    if (error.code === 401) {
      // User is not authenticated
      return { success: false, error: "Not authenticated" };
    }
    console.error("Get current user error:", error);
    return { success: false, error: error.message };
  }
};

export const createDocument = async (collectionId, data, userId) => {
  if (!collectionId || !userId) return null;

  try {
    return await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      collectionId,
      "unique()",
      {
        userId,
        data: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error(`Error creating document in ${collectionId}:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionId, documentId, data) => {
  if (!collectionId || !documentId) return null;

  try {
    return await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      collectionId,
      documentId,
      {
        data: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error(`Error updating document in ${collectionId}:`, error);
    throw error;
  }
};

export const getDocuments = async (collectionId, userId) => {
  if (!collectionId || !userId) return [];

  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      collectionId,
      // eslint-disable-next-line no-undef
      [Query.equal("userId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error(`Error fetching documents from ${collectionId}:`, error);
    throw error;
  }
};
// export const register = async (email, password, name) => {
//   try {
//     const user = await account.create("unique()", email, password, name);
//     if (user) {
//       // Send OTP to user's email
//       await account.createEmailVerification(email);

//       return {
//         success: true,
//         emailVerification: user.emailVerification,
//         userId: user.$id, // Return userId for OTP verification
//       };
//     }
//     return { success: false, error: "Registration failed" };
//   } catch (error) {
//     console.error("Registration error:", error);
//     return { success: false, error: error.message };
//   }
// };
