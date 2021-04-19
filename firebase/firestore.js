import { firestore } from "./config";

export const CreateCategory = async (data) => {
  const { category, id, ownerId } = data;
  console.log(data);
  const categoryRef = firestore.doc(
    `categories/${ownerId}/categories/${category.toLowerCase()}`
  );
  const categoryData = {
    id,
    label: category,
  };
  try {
    await categoryRef.set(categoryData);
  } catch (error) {
    console.log("error creating category", error.message);
  }
};
export const CreateProduct = async (data, ownerId) => {
  const { id } = data;
  const categoryRef = firestore.doc(`products/${ownerId}/products/${id}`);
  try {
    await categoryRef.set(data);
  } catch (error) {
    console.log("error creating category", error.message);
  }
};
export const CreateEmployee = async (data) => {
  const { name, storeName, address, ownerId, branchCode, id } = data;
  const employeeRef = firestore.doc(`employees/${ownerId}/cashiers/${id}`);
  const employeeData = {
    id,
    storeName,
    storeId: ownerId,
    branchCode,
    name,
    address,
  };
  try {
    await employeeRef.set(employeeData);
  } catch (error) {
    console.log("error creating shop", error.message);
  }
};

export const CreateSale = async (data, ownerId, cleanUp) => {
  const batch = firestore.batch();
  const { id, cashier_id } = data;
  const salesRef = firestore.doc(`sales/${ownerId}/sales/${id}`);
  const productsRef = firestore
    .collection("products")
    .doc(ownerId)
    .collection("products");
  const shoppingListRef = firestore
    .collection("shoping_list")
    .doc(ownerId)
    .collection("shoping_list");
  const statsRef = firestore.collection("stats").doc(ownerId);
  const cashierStatsRef = firestore.collection("cashier_stats").doc(cashier_id);
  batch.set(salesRef, data);
  statsRef.get().then((statsSnapshot) => {
    if (statsSnapshot.exists) {
      batch.update(statsRef, {
        revenue: statsSnapshot.data().revenue + data.price,
        sold: statsSnapshot.data().sold + data.quantity,
        invoice: statsSnapshot.data().invoice + 1,
      });
    } else {
      batch.set(statsRef, {
        revenue: data.price,
        sold: data.quantity,
        invoice: 1,
      });
    }
  });
  cashierStatsRef.get().then((cashierSnapshot) => {
    if (cashierSnapshot.exists) {
      batch.update(cashierStatsRef, {
        revenue: cashierSnapshot.data().revenue + data.price,
        sold: cashierSnapshot.data().sold + data.quantity,
        invoice: cashierSnapshot.data().invoice + 1,
      });
    } else {
      batch.set(cashierStatsRef, {
        revenue: data.price,
        sold: data.quantity,
        invoice: 1,
      });
    }
  });
  // Final Step Update all product and shopping list
  data.products.forEach(async (item, index) => {
    if (item.need_restock) {
      shoppingListRef
        .doc(item.id)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            batch.update(snapshot.ref, {
              in_hand: item.other_info.in_hand,
              status: item.other_info.status,
            });
          } else {
            batch.set(snapshot.ref, item.other_info);
          }
        });
    }
    const snapshot = await productsRef.doc(item.id).get();
    const productData = snapshot.data();
    batch.update(snapshot.ref, {
      quantity: productData.quantity - item.quantity,
    });
    const arrLength = data.products.length - 1;
    if (index === arrLength) {
      try {
        await batch.commit();
        cleanUp();
      } catch (error) {
        console.log("error creating sales", error.message);
        cleanUp();
      }
    }
  });
};
