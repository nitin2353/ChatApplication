
    const socket = io();
    let room = "";
    var AllChatting = "";


    document.addEventListener('DOMContentLoaded', (e) => {



      var usr_name = document.querySelector('.usr-name');
      usr_name.innerHTML = localStorage.getItem('Name');

      document.querySelector('.profile-img').src = localStorage.getItem('Image');

      var name1 = localStorage.getItem('myname')
      var name2 = localStorage.getItem('Name')
      function createDifferentRoomId(p1, p2) {

        var room = [name1, name2].sort().join('_')

        var status = localStorage.getItem('blockStatus');
        console.log(status);
        if (status == 'false' || !status) {
          // alert('joined')
          return room.trim();
        }
        else {
          localStorage.setItem('roomId', " ");
          return;
        }

      }
      room = createDifferentRoomId(name1, name2);



     if(localStorage.getItem('Mobile').length == 10){
         localStorage.setItem('roomId', room);
     }
     else{
        localStorage.setItem('roomId', localStorage.getItem('Mobile'));
        room = localStorage.getItem('Mobile');
     }

      socket.emit('joinroom', room);

      var chatbox = document.getElementById('chat-body');


      var userNumber = localStorage.getItem('Mobile');
      var mymobile = localStorage.getItem("mymobile");
      var usermobile = localStorage.getItem('Mobile');
      var chatId = mymobile + usermobile;

      // console.log(img)
      fetch('/fetchChats'
        , {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: chatId
          })
        })
        .then(response => response)
        .then(response => response.json())
        .then((chats) => {
          chats.forEach(element => {
            let msg = element.message;

            chatbox.innerHTML = element.message;
            const a = chatbox.querySelectorAll('.chat-message .image');
            a.forEach((img) => {
              img.src = window.localStorage.getItem('Image');
            })
          });
        })

      // e.preventDefault();

    })


    function saveChat(AllChatting) {

      var userNumber = localStorage.getItem('Mobile');
      var mymobile = localStorage.getItem("mymobile");
      var usermobile = localStorage.getItem('Mobile');

      var chatId = mymobile + usermobile;


      fetch('/allChets', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: chatId,
          message: AllChatting
        })
      })
        .then(Response => Response)
        .then((data) => {
          if (data) {
            console.log(data + "successfully stored");
          }
          else {
            console.log("error stored");
          }
        })

    }


    //-------------------------Create connection of Websockets-------------------------


    var inputField = document.querySelector('.inputval');
    var d = new Date();
    document.getElementById('send-btn').addEventListener('click', () => {
      send();
    })

    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        send();
      }
    })

    function send() {

      var chatbox = document.getElementById('chat-body');
      chatbox.scrollTop = chatbox.scrollHeight;

      let val = inputField.value;

      if (inputField.value && inputField.value != " ") {

        socket.emit('chatmessage', { room: room, message: val, id: socket.id });
        inputField.value = "";

        var chatbox = document.getElementById('chat-body');
        var sender = document.createElement('div');
        sender.textContent = val;
        sender.className = "chat-message sent";

        let det = document.createElement('span');
        det.className = "det";
        var min = d.getMinutes();
        if (min < 10) {
          console.log(min)
          min = '0' + min;
        }
        det.textContent = `     ${d.getHours()}:${min}`;
        det.style = " font-size: 8px; display: flex;margin-top: 16px;float: right;margin-left: 10px; color: antiquewhite;";
        sender.appendChild(det);

        chatbox.appendChild(sender);

        AllChatting = chatbox.innerHTML;
        var chatbox = document.getElementById('chat-body');
        AllChatting = chatbox.innerHTML;
        saveChat(AllChatting);

      }

    }


    // -----------------------TYPING-----------------------


    document.addEventListener('input', () => {
      socket.emit('chatmessage', { room: room, message: "", id: socket.id });
    })


    // -----------------------TYPING-----------------------


    socket.on('chatmessage', (message, id) => {

      // const chatbox = document.getElementById('chat-body');
      if (message == "" || message == " ") {
        var chatbox = document.getElementById('chat-body');
        chatbox.scrollTop = chatbox.scrollHeight;
        var existingTyping = document.querySelector('.chat-message.typ');
        if (!existingTyping) {
          var rec = document.createElement('div');
          rec.className = 'chat-message typ';
          rec.innerHTML = 'Typing...';
          chatbox.appendChild(rec).style = "display: block;";


          setTimeout(() => {
            chatbox.removeChild(rec);
          }, 300)


        }

      } else {

        var image = document.createElement('img');
        image.className = 'image';
        var chatbox = document.getElementById('chat-body');
        chatbox.scrollTop = chatbox.scrollHeight;
        var receive = document.createElement('div');
        receive.className = 'chat-message';

        chatbox.appendChild(receive);


        receive.appendChild(image);
        image.src = localStorage.getItem('Image');

        let det = document.createElement('span');
        det.className = "det";
        var min = d.getMinutes();
        if (min < 10) {
          console.log(min)
          min = '0' + min;
        }
        det.textContent = `     ${d.getHours()}:${min}`;
        det.style = " font-size: 8px; display: flex;margin-top: 16px;float: right;margin-left: 10px; color: antiquewhite;";
        receive.appendChild(det);

        var textNode = document.createTextNode(message);
        receive.appendChild(textNode);

        var chatbox = document.getElementById('chat-body');
        AllChatting = chatbox.innerHTML;
        saveChat(AllChatting);


      }

    })

    document.querySelector('.bi-three-dots-vertical').addEventListener('click', () => {
      window.location.href = `/chat/${localStorage.getItem('Name')}/${localStorage.getItem('Mobile')}`
    })


    //-----------------uploading files-----------------
    // var input = "";
    // const attachment = document.querySelector('.bi-paperclip');
    // attachment.addEventListener('click', (e)=>{
    //     input = document.getElementById('uploadfiles').click();
        
    // })

    // document.getElementById('uploadfiles').addEventListener('change', (event) => {
    //   var files = event.target.files;
    //   Array.from(files).forEach((e)=>{

          // const files = 
          // filesend.


        
        
          // const storeFile = document.getElementsByClassName('filesend')[0];
          // storeFile.style = "display: flex"; 
          // document.querySelector('.showing').style="display: flex;"
          // document.querySelector('.filesend').style="display: flex;"
          // const sendfilebtn = document.querySelector('.btn-primary');
          // sendfilebtn.removeAttribute('id');

          // const files = document.createElement('div');
          // files.className = 'files';
          // files.textContent = e.size;
          // files.style = "height: 130px; width: 130px; background-color: red;"

          // storeFile.appendChild(files)

          // var inputField = document.querySelector('.inputval');
      

          // sendfilebtn.addEventListener('click', () => {


          //     const formData = new FormData();
          //     Array.from(files).forEach((file) => {
          //       formData.append('files', file);
          //     });

          //     fetch('/sendFile', {
          //         method: 'POST',
          //         enctype: 'multipart/form-data',
          //         body: formData
          //     })
          //     .then(response => response)
          //     .then(data => {
          //       if(data){
          //           // console.log("Successfully submitted")
          //           console.log('data' + data);


          //       }
          //     })

          //   })


          //     socket.emit('chatmessage', { room: room, message: 'files', id: socket.id });

          //     var chatbox = document.getElementById('chat-body');
          //     var sender = document.createElement('div');
          //     var img = document.createElement('img');
          //     img.src = ''
          //     sender.textContent = "file";
          //     sender.className = "chat-message sent";

          //     let det = document.createElement('span');
          //     det.className = "det";
          //     var min = d.getMinutes();
          //     if (min < 10) {
          //       console.log(min)
          //       min = '0' + min;
          //     }
          //     det.textContent = `     ${d.getHours()}:${min}`;
          //     det.style = " font-size: 8px; display: flex;margin-top: 16px;float: right;margin-left: 10px; color: antiquewhite;";
          //     sender.appendChild(det);

          //     chatbox.appendChild(sender);

          //     AllChatting = chatbox.innerHTML;
          //     var chatbox = document.getElementById('chat-body');
          //     AllChatting = chatbox.innerHTML;
          //     saveChat(AllChatting);

          // console.log("Name", e.name)
          // console.log("type", e.type)
          // console.log("size", e.size)
    //   })

    // })
