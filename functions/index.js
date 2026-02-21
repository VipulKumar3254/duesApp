const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");


// Initialize Firebase Admin
initializeApp();

// Get Firestore instance
const db = getFirestore();

exports.addDue = onCall(async (request) => {

  console.log("🔥 FUNCTION HIT");
  console.log("Request Data:", request.data);

  // // 🔐 Get authenticated user
  // const uid = request.auth?.uid;

  // if (!uid) {
  //   throw new HttpsError("unauthenticated", "User must be logged in.");
  // }

  const { dueData, photo, uid } = request.data;

  if (!dueData) {
    throw new HttpsError("invalid-argument", "Due data is required.");
  }

  try {

    // Add in user's personal dues
    await db.collection(`duesUsers/${uid}/dues`).add({
      ...dueData,
      photo: photo || null,
      uid: uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Add in global collection
    await db.collection("globalDues").add({
      uid: uid,
      ...dueData,
      createdAt: FieldValue.serverTimestamp(),
    });

    //overdue amount

    return {
      success: true,
      message: "Due added successfully"
    };

  } catch (error) {
    console.error("❌ ERROR:", error);
    throw new HttpsError("internal", "Something went wrong.");
  }

});


//+=======================================

exports.getTotalOutstanding = onCall(async (request) => {




  try {

    const snapshot = await db
      .collection(`globalDues`)
      .get();

    let total = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      total += Number(data.amount || 0);
    });

    //total overdue calculation
    const snapshot1 = await db
      .collection("globalDues")
      .get();

    let totalOverdue = 0;
    const now = new Date();

    snapshot1.forEach(doc => {
      const data = doc.data();
      const amount = Number(data.amount || 0);
      const dueDate = new Date(data.dueDate);


      if (dueDate && dueDate <now) {
        
        // Due date breached → add to overdue total
        totalOverdue += amount;
      }
    });

    // getting total users

    const snapshot2 = await db
      .collection("duesUsers")
      .get();

    const totalDocs = snapshot2.size;
    console.log('totalDocs', snapshot2.size);






    return {
      success: true,
      totalOutstanding: total,
      totalOverDueAmount: totalOverdue,
      totalUsers: totalDocs,


    };

  } catch (error) {
    console.error("Error calculating total:", error);
    throw new HttpsError("internal", error.message);
  }

});


//=======+++++++++++++++++++++++++++++++++++++++++++++++++


exports.getTotalOverdue = onCall(async (request) => {
  try {
    const { uid } = request.data;

    if (!uid) {
      throw new HttpsError("invalid-argument", "uid is required");
    }

    // Fetch all dues for this user
    const snapshot = await db
      .collection("globalDues")
      .where("uid", "==", uid)
      .get();

    let totalOverdue = 0;
    const now = new Date();

    snapshot.forEach(doc => {
      const data = doc.data();
      const amount = Number(data.amount || 0);
      const dueDate = data.dueDate ? data.dueDate.toDate() : null;

      if (dueDate && dueDate < now) {
        // Due date breached → add to overdue total
        totalOverdue += amount;
      }
    });

    return {
      success: true,
      totalOverdue,
    };

  } catch (error) {
    console.error("Error calculating overdue:", error);
    throw new HttpsError("internal", error.message);
  }
});


exports.usersDueDetails = onCall(async (request) => {
  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "uid is required");
  }

  // Fetch dues
  const duesSnapshot = await db
    .collection(`duesUsers/${uid}/dues`)
    .get();

  const duesData = duesSnapshot.docs.map((doc) => ({
    id: doc.id,
    type: "due",
    ...doc.data(),
  }));

  // Fetch credits (assuming different collection)
  const creditSnapshot = await db
    .collection(`duesUsers/${uid}/credits`)
    .get();

  const creditData = creditSnapshot.docs.map((doc) => ({
    id: doc.id,
    type: "credit",
    ...doc.data(),
  }));

  const combinedArray = [...duesData, ...creditData];

  combinedArray.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return combinedArray;
});