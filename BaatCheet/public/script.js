
Object.defineProperties(HTMLElement.prototype,{
    "show":{
        value:function(value="block") {
            this.style.display=value;
        }
    },
    "hide":{
        value:function() {
            this.style.display="none";
        }
    }
});

const firebaseConfig = {
  
  apiKey: "AIzaSyB_up2wwwfcrLi7lx0Ks2ho0EA8Gt3z9yY",
  authDomain: "bhartiyabaatcheet.firebaseapp.com",
  databaseURL: "https://bhartiyabaatcheet-default-rtdb.firebaseio.com",
  projectId: "bhartiyabaatcheet",
  storageBucket: "bhartiyabaatcheet.appspot.com",
  messagingSenderId: "741474502364",
  appId: "1:741474502364:web:cd826ee125891197ee9619",
  measurementId: "G-92MWDRS9SY"
};
firebase.initializeApp(firebaseConfig);

const database=firebase.database();
const messagesRef=database.ref("messages");
const usersRef=database.ref("users");

let name;

addEventListener("DOMContentLoaded",init);

function init() {

    document.getElementsByClassName("main")[0].hide();
    document.getElementsByClassName("name-alert")[0].hide();
    closeUserList();

    addEventListener("click",e=> {
        if(!document.getElementsByClassName("user-list")[0].classList.contains("user-list_hidden")&&!document.getElementsByClassName("user-list")[0].contains(e.target)) {
            closeUserList();
        } else if(document.getElementById("userBtn").contains(e.target)) {
            openUserList();
        }
    });

    document.getElementById("sendBtn").addEventListener("click",sendMessage);
    document.getElementById("joinBtn").addEventListener("click",joinChat);
    addEventListener("keydown",e=> { 
      if(name&&e.which==13) {
        sendMessage();
      }
    });


    usersRef.on("value",updateUserList);
    messagesRef.on("value",updateMessages);

    function closeUserList() {
        document.getElementsByClassName("user-list")[0].classList.add("user-list_hidden");
    }
    function openUserList() {
        document.getElementsByClassName("user-list")[0].classList.remove("user-list_hidden");
    }

     function sendMessage() {
        const content=document.getElementById("messageInput").value;
        if(content=="") return;
        messagesRef.push({
          content:content,
          name:name,
          timestamp:firebase.database.ServerValue.TIMESTAMP
        }).then(()=> {
          document.getElementById("messageInput").value="";
        });
    }
    function joinChat() {
      name=document.getElementById("nameInput").value;
      
      if(name.length<3||name.length>10) {
        document.getElementsByClassName("name-alert")[0].innerText="Name must have 3 - 10 characters!";
         document.getElementsByClassName("name-alert")[0].show();
      } else if(name.match(/[^a-zA-Z]/)) {
         document.getElementsByClassName("name-alert")[0].innerText="Name may contain only letters!";
         document.getElementsByClassName("name-alert")[0].show();
      } else {
        const key=usersRef.push(name).key;
        usersRef.child(key).onDisconnect().remove();
        document.getElementsByClassName("login")[0].hide(); 
        document.getElementsByClassName("main")[0].show();
      }
    }

    function updateUserList(snap) {
      const users=snap.val();
      if(!users) return;
      const userList=Object.values(users).map(name=>`<li>${name}</ul>`);
      document.getElementById("userList").innerHTML=userList.join("");
    }

    function updateMessages(snap) {
      const data=snap.val();
      if(!data) return;
      const messages=Object.keys(data).map(key=>`<div class="message ${data[key].name==name?"message_mine":"message_casual"}">
          <b>${data[key].name}</b>
          <small>${new Date(data[key].timestamp).toLocaleTimeString("en-US")}</small>
          <p>${data[key].content.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
      </div>`);
     
      document.getElementsByClassName("message-container")[0].innerHTML=messages.reverse().join("");
    }
        

}