//Create an account on Firebase, and use the credentials they give you in place of the following
//var config = {
//    apiKey: "AIzaSyCIMKe3R118RJlUx95LIbmf8nu2FkN0Ye4",
 //   authDomain: "fir-60362.firebaseapp.com",
//    databaseURL: "https://fir-60362.firebaseio.com",
 //   projectId: "fir-60362",
 //   storageBucket: "fir-60362.appspot.com",
 //   messagingSenderId: "176854766456"
//  };
//  firebase.initializeApp(confi


  
     
let config = {
  apiKey: "AIzaSyB_up2wwwfcrLi7lx0Ks2ho0EA8Gt3z9yY",
  authDomain: "bhartiyabaatcheet.firebaseapp.com",
  databaseURL: "https://bhartiyabaatcheet-default-rtdb.firebaseio.com",
  projectId: "bhartiyabaatcheet",
  storageBucket: "bhartiyabaatcheet.appspot.com",
  messagingSenderId: "741474502364",
  appId: "1:741474502364:web:cd826ee125891197ee9619",
  measurementId: "G-92MWDRS9SY"
};
  
 
 firebase.initializeApp(config);


var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
//var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'abcdefgh','username': 'sameersudhir.jain@gmail.com'}]};
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'Python123$','username': 'lihsurk@gmail.com'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice"));
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
    var msg = database.push({ sender: senderId, message: data });
    msg.remove();
}

function readMessage(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    if (sender != yourId) {
        if (msg.ice != undefined)
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        else if (msg.sdp.type == "offer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                .then(() => pc.createAnswer())
                .then(answer => pc.setLocalDescription(answer))
                .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
        else if (msg.sdp.type == "answer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    }
};

database.on('child_added', readMessage);

function showMyFace() {
    navigator.mediaDevices.getUserMedia({audio:true, video:true})
        .then(stream => yourVideo.srcObject = stream)
        .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer) )
        .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}