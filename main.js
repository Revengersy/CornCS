import FirebaseAction from "./firebase/action.js";

// Initialize FirebaseAction for comment and msgPossibility
const commentAction = new FirebaseAction("comment");
const msgPossibilityAction = new FirebaseAction("msgPossibility");

console.log("test");

// Temporarily set ID → To be changed later
let current_id = null;

export function setCurrentId(id) {
  current_id = id;
  console.log("Changed Current ID in main.js set to:", current_id);
};

export function getCurrentId() {
  return current_id;
};


// Check msgPossibility status and set button state
async function checkMsgPossibility() {
  const documents = await msgPossibilityAction.findAll();
  if (documents.length > 0) {
    const doc = documents[0];
    const isMsgEnabled = doc.status; // Assuming the field is named 'status'
    
    $("#sending_btn").prop("disabled", !isMsgEnabled);

    if (!isMsgEnabled) {
      alert("메시지 보내기 기능이 비활성화되었습니다.");
    }
  } else {
    console.error("No msgPossibility document found.");
  }
};

// Send message
$("#sending_btn").click(async function (event) {
  event.preventDefault();

  let sender_id = current_id;
  let msg = $('#sending_msg').val();
  let receiver_id = $('#receiver_id').val();
  let utcTimestamp = new Date().toISOString();

  console.log("보내는 사람의 current_id: ", current_id);

  if (!receiver_id) {
    alert("수신자 ID를 입력해 주세요.");
    return;
  }

  const doc = {
    'sender_id': sender_id,
    'msg': msg,
    'receiver_id': receiver_id,
    'date': utcTimestamp  // UTC 시간 추가
  };

  await commentAction.save(doc);
  alert("전송되었습니다.");
});

// Load comments function

function scrollToBottom() {
    const receivedMsgDiv = document.getElementById("received_msg");
    receivedMsgDiv.scrollTop = receivedMsgDiv.scrollHeight;
}



export async function renderComments() {
  if (!current_id) {
    console.error("current_id is not set!");
    return;
  }

  let str = "";

  const data = await commentAction.findBy("receiver_id", current_id);
  console.log("current_id:", current_id, "updated data: ", data);

  data.sort((docA, docB) => {
    return new Date(docB['date']) - new Date(docA['date']); // Return positive if docB is newer than docA
  });

  let counter = 0;

  data.forEach((row) => {
    let msg = row['msg'];
    let sender_id = row['sender_id'];
    // str += `전송자 아이디: <span>${sender_id}</span> <br> 메시지: <span>${msg}</span><br><br>`;
    msg = padMessage(msg);
    str += `        
    <span>발신인: ${sender_id}</span>
    <div class="pager-screen">        
            <div class="segment common-display" id="${counter}seg1">${msg[0]}</div>
            <div class="segment common-display" id="${counter}seg2">${msg[1]}</div>
            <div class="segment common-display" id="${counter}seg3">${msg[2]}</div>
            <div class="segment common-display" id="${counter}seg4">${msg[3]}</div>
            <div class="segment common-display" id="${counter}seg5">${msg[4]}</div>
            <div class="segment common-display" id="${counter}seg6">${msg[5]}</div>
        </div>
    `

    console.log("counter: ", counter);

    counter += 1;

    

  });

  $("#received_msg").html(str);
  scrollToBottom();  // 메시지가 추가되면 자동으로 스크롤



};

// Initial check on page load
$(document).ready(function () {
  checkMsgPossibility(); // Check and set message button enabled/disabled
});

function padMessage(msg) {
  // Check if the length of the message is less than 6
  if (msg.length < 6) {
      // Calculate the number of spaces needed
      let spacesNeeded = 6 - msg.length;
      // Add spaces to the end of the message
      msg += ' '.repeat(spacesNeeded);
  }
  // Return the padded message
  return msg;
};
