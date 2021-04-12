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

export const CreateSale = async (data, ownerId) => {
  const batch = firestore.batch();
  const { id } = data;
  const salesRef = firestore.doc(`sales/${ownerId}/sales/${id}`);
  const productsRef = firestore
    .collection("products")
    .doc(ownerId)
    .collection("products");
  const statsRef = firestore.collection("stats").doc(ownerId);
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
  data.products.forEach(async (item, index) => {
    const snapshot = await productsRef.doc(item.id).get();
    const productData = snapshot.data();
    batch.update(snapshot.ref, {
      quantity: productData.quantity - item.quantity,
    });
    const arrLength = data.products.length - 1;
    if (index === arrLength) {
      try {
        await batch.commit();
      } catch (error) {
        console.log("error creating sales", error.message);
      }
    }
  });
};
