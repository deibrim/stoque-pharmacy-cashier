import { firestore } from "./config";
import { SendNotification } from "../utils/helper";

export const UpdateNotification = (
  ownerId,
  notificationData,
  pushNotificationData
) => {
  const notificationRef = firestore
    .collection("notifications")
    .doc(ownerId)
    .collection("notifications")
    .doc();
  try {
    notificationRef.set({
      ...notificationData,
      created_at: Date.now(),
      viewed: false,
    });
    SendNotification(pushNotificationData);
  } catch (error) {
    console.log(error);
  }
};
export const CreateSale = async (data, ownerId, cleanUp, navigation) => {
  let sent = false;
  const batch = firestore.batch();
  const { id, cashier_id } = data;
  const salesRef = firestore.doc(`sales/${ownerId}/sales/${id}`);
  const userRef = firestore.doc(`users/${ownerId}`);
  const productsRef = firestore
    .collection("products")
    .doc(ownerId)
    .collection("products");
  const allProductsRef = firestore.collection("all_products");
  const shoppingListRef = firestore
    .collection("shopping_list")
    .doc(ownerId)
    .collection("shopping_list");
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
      // const userSnapshot = await userRef.get();
      shoppingListRef
        .doc(item.id)
        .get()
        .then(async (snapshot) => {
          const message = `${item.other_info.product_name} ${
            item.other_info.in_hand > 0
              ? `is running low, ${item.other_info.in_hand} left`
              : "has sold out"
          }`;
          if (snapshot.exists) {
            batch.update(snapshot.ref, {
              in_hand: item.other_info.in_hand,
              status: item.other_info.status,
            });
            const userSnap = await userRef.get();
            if (userSnap.exists && !sent) {
              console.log("got userRef");
              sent = true;
              UpdateNotification(
                ownerId,
                { title: "Product Alert!!!", message },
                {
                  token: userSnap.data().notificationToken,
                  channelId: "productAlert",
                  title: "Product Alert!!!",
                  body: message,
                }
              );
            }
          } else {
            batch.set(snapshot.ref, item.other_info);
            const userSnap = await userRef.get();
            if (userSnap.exists && !sent) {
              sent = true;
              UpdateNotification(
                ownerId,
                { title: "Product Alert!!!", message },
                {
                  token: userSnap.data().notificationToken,
                  channelId: "productAlert",
                  title: "Product Alert!!!",
                  body: message,
                }
              );
            }
          }
        });
    }
    const snapshot = await productsRef.doc(item.id).get();
    const allProductSnapshot = await allProductsRef.doc(item.id).get();
    const productData = snapshot.data();
    const allProductData = allProductSnapshot.data();
    batch.update(snapshot.ref, {
      quantity: productData.quantity - item.quantity,
    });
    batch.update(allProductSnapshot.ref, {
      quantity: allProductData.quantity - item.quantity,
    });
    const arrLength = data.products.length - 1;
    if (index === arrLength) {
      try {
        await batch.commit();
        navigation.navigate("InvoiceView", { data });
        cleanUp();
      } catch (error) {
        console.log("error creating sales", error.message);
        cleanUp();
      }
    }
  });
};
