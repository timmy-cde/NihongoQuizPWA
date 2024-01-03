import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebaseconfig.js";
import { open } from "fs/promises";

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
const batch = writeBatch(db);
const vocabRef = collection(db, "vocabulary");

let lineNum = 1;
const file = await open("../../L4B VOCABS_2.csv");
for await (const line of file.readLines()) {
  if (lineNum > 1) {
    let lineArr = line.split(",");

    const docRef = doc(vocabRef);
    batch.set(docRef, {
      class_type: lineArr[0],
      category: lineArr[1],
      english_term: lineArr[2],
      general_or_formal_form: lineArr[3],
      dictionary_form: lineArr[4],
      kanji: lineArr[5],
      modified_at: serverTimestamp(),
    });
  }
  lineNum++;
}

await batch.commit();
//------------FOR BATCH WRITE END------------//
