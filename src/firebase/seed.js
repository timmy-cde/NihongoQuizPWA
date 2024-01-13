import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { open } from "fs/promises";

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//------------FOR SINGLE WRITE START------------//
// const vocabRef = collection(db, "vocabulary");
// const docRef = await addDoc(vocabRef, {
//   class_type: "L4B",
//   category: "verb",
//   english_term: "to marry",
//   general_or_formal_form: "",
//   dictionary_form: "",
//   kanji: "",
//   modified_at: serverTimestamp(),
// });
// console.log(docRef.id);
//------------FOR SINGLE WRITE END------------//

//------------FOR BATCH WRITE START------------//
let batchCommitCount = 0;
let lineNum = 1;

let batch = writeBatch(db);
const vocabRef = collection(db, "vocabulary");
const file = await open("../../L4B VOCABS_2.csv");
for await (const line of file.readLines()) {
  if (lineNum == 499) {
    try {
      await batch.commit();
      batchCommitCount++;
      console.log(`Batch count ${batchCommitCount}`);

      lineNum = 0;
      writeData(line, vocabRef, batch);
    } catch (error) {
      console.log(error);
    }
  } else {
    writeData(line, vocabRef, batch);
    lineNum++;
  }
}

if (lineNum < 499) {
  await batch
    .commit()
    .then(() => console.log(`Batch count ${batchCommitCount}`))
    .catch((err) => console.log(err));
}

function writeData(line, vocabRef, batch) {
  let lineArr = line.split("|");
  const docRef = doc(vocabRef);
  batch.set(docRef, {
    class_type: lineArr[0],
    category: lineArr[1],
    english_term: lineArr[2],
    general_or_formal_form: lineArr[3],
    dictionary_form: lineArr[4],
    kanji: lineArr[5],
    kanji_type: lineArr[6],
    jpn_reading: lineArr[7],
    chn_reading: lineArr[8],
    modified_at: serverTimestamp(),
  });
}

//------------FOR BATCH WRITE END------------//
