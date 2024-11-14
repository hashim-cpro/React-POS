import { databases } from "../../config/appwrite";
import { Query } from "appwrite";
const COLLECTION_IDS = {
  inventory: import.meta.env.VITE_INVENTORY,
  sales: import.meta.env.VITE_SALES,
  purchases: import.meta.env.VITE_PURCHASES,
  expenses: import.meta.env.VITE_EXPENSES,
};
export const localStorageMiddleware = (store) => (next) => async (action) => {
  const result = next(action);
  const state = store.getState();
  const { user } = state.auth;

  // Always save to localStorage
  localStorage.setItem("pos_inventory", JSON.stringify(state.inventory));
  localStorage.setItem("pos_sales", JSON.stringify(state.sales));
  localStorage.setItem("pos_purchases", JSON.stringify(state.purchases));
  localStorage.setItem("pos_expenses", JSON.stringify(state.expenses));

  // If user is authenticated, sync with Appwrite
  if (user) {
    try {
      const syncData = async (collectionId, data) => {
        const existingDocs = await databases.listDocuments(
          "pos_database",
          collectionId,
          [Query.equal("userId", user.id)]
        );

        if (existingDocs.documents.length > 0) {
          await databases.updateDocument(
            "pos_database",
            collectionId,
            existingDocs.documents[0].$id,
            { data: JSON.stringify(data) }
          );
        } else {
          await databases.createDocument(
            "pos_database",
            collectionId,
            "unique()",
            {
              userId: user.id,
              data: JSON.stringify(data),
            }
          );
        }
      };

      // Sync each data type
      await Promise.all([
        syncData(COLLECTION_IDS.inventory, state.inventory),
        syncData(COLLECTION_IDS.sales, state.sales),
        syncData(COLLECTION_IDS.purchases, state.purchases),
        syncData(COLLECTION_IDS.expenses, state.expenses),
      ]);
    } catch (error) {
      console.error("Error syncing with Appwrite:", error);
    }
  }

  return result;
};

//CHATGPT SUGGEXTED CODE

// import { databases } from "../../config/appwrite";
// import { Query, Permission, Role } from "appwrite";

// const COLLECTION_IDS = {
//   inventory: import.meta.env.VITE_INVENTORY,
//   sales: import.meta.env.VITE_SALES,
//   purchases: import.meta.env.VITE_PURCHASES,
//   expenses: import.meta.env.VITE_EXPENSES,
// };

// export const localStorageMiddleware = (store) => (next) => (action) => {
//   const result = next(action); // Ensure action proceeds immediately
//   const state = store.getState();
//   const { user } = state.auth;

//   // Always save to localStorage
//   try {
//     localStorage.setItem("pos_inventory", JSON.stringify(state.inventory));
//     localStorage.setItem("pos_sales", JSON.stringify(state.sales));
//     localStorage.setItem("pos_purchases", JSON.stringify(state.purchases));
//     localStorage.setItem("pos_expenses", JSON.stringify(state.expenses));
//   } catch (error) {
//     console.error("Error saving to localStorage:", error);
//   }

//   // If user is authenticated, sync with Appwrite
//   if (user) {
//     (async () => {
//       try {
//         const syncData = async (collectionId, data) => {
//           const existingDocs = await databases.listDocuments(
//             "pos_database",
//             collectionId,
//             [Query.equal("userId", user.id)]
//           );

//           if (existingDocs.documents.length > 0) {
//             await databases.updateDocument(
//               "pos_database",
//               collectionId,
//               existingDocs.documents[0].$id,
//               { data: JSON.stringify(data) }
//             );
//           } else {
//             await databases.createDocument(
//               "pos_database",
//               collectionId,
//               "unique()",
//               {
//                 userId: user.id,
//                 data: JSON.stringify(data),
//               },
//               [
//                 Permission.read(Role.user(user.id)),
//                 Permission.update(Role.user(user.id)),
//               ]
//             );
//           }
//         };

//         await Promise.allSettled([
//           syncData(COLLECTION_IDS.inventory, state.inventory),
//           syncData(COLLECTION_IDS.sales, state.sales),
//           syncData(COLLECTION_IDS.purchases, state.purchases),
//           syncData(COLLECTION_IDS.expenses, state.expenses),
//         ]);
//       } catch (error) {
//         console.error("Error syncing with Appwrite:", error);
//       }
//     })();
//   }

//   return result;
// };
