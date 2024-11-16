import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const login = async (email, password) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const session = await account.createEmailSession(email, password);
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
      const session = await login(email, password);
      account
        .createVerification("http://localhost:5173/react-based-POS-system")
        .then(() => {
          console.log("Verification email sent!");
        })
        .catch((error) => {
          console.error("Error sending verification email: \n", error);
        });

      return {
        success: true,
        data: session.data,
        emailVerification: user.emailVerification,
      };
    }
    return { success: false, error: "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
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
