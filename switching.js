import FirebaseAction from "./firebase/action.js";

const firebaseAction = new FirebaseAction("msgPossibility");

console.log("test")


async function initializeStatus() {
    const documents = await firebaseAction.findAll();
    if (documents.length > 0) {
      const doc = documents[0];
      $("#statusSwitch").prop("checked", doc.status);
    }
  }
  
  $("#admin_btn").click(async function (event) {
    event.preventDefault();
  
    const documents = await firebaseAction.findAll();
    if (documents.length > 0) {
      const doc = documents[0];
      const currentStatus = doc.status;
      const newStatus = !currentStatus;
  
      await firebaseAction.updateById(doc.id, { status: newStatus });
      $("#statusSwitch").prop("checked", newStatus);
  
      alert("Status updated successfully.");
    } else {
      alert("No document found.");
    }
  });
  
  // Initialize the switch status on page load
  $(document).ready(function () {
    initializeStatus();
  });