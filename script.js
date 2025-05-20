const search = document.querySelector('.search');
const searchbox = document.querySelector('.search-box');
var select = document.querySelector('.select');
var labelMob = document.querySelectorAll('.mob');


document.addEventListener('DOMContentLoaded', async() => {
    
    localStorage.setItem('temp','');
    localStorage.setItem('groupId', null);

   const mymobile = localStorage.getItem('mymobile');
    fetch('/groupUsers')
    .then(Response => Response.json())
    .then(group => {
            if(group){

               group.forEach(e => {
                let groupmobiles = [];
                let temp = e.Mobiles;
                let temp2 = temp.split(',');

                    for(let i = 0; i < temp2.length; i++ ){
                            if(mymobile == temp2[i]){
                                // alert('you are in group' + temp2[i])
                                // let alreadygroup = localStorage.getItem('groupId')
                                let alreadygroup = e.Id+','+localStorage.getItem('groupId');
                                localStorage.setItem('groupId',alreadygroup);
                            }
                    }
               })

            }
    })

   

    var reporter = "";

    fetch(`/allUsers`)
    .then(response => response.json())
    .then((user) => {   
        
        user.forEach((user) => {

            if(user.Mobile ==  localStorage.getItem('mymobile')){
                                        
                reporter = (user.Report) ? (user.Report).split(',') : [];
                console.log(reporter);
                                
            }

        })
    })

let i = 0;

    fetch(`/allUsers`)
    .then(response => response.json())
    .then((user) => {   
        
        user.forEach((user) => {
            
           

            if(user.Mobile !=  localStorage.getItem('mymobile')){
                // if(localStorage.getItem('mymobile') != user.Mobile){

            
                    let groups = localStorage.getItem('groupId').split(',');
                    groups.forEach(e => {
                            if(e == user.Mobile){
                                    
                                let sel = document.createElement('input');
                                sel.type = 'radio'
                                sel.className = "selectusers"

                                
                                let box = document.createElement('div');
                                box.className = 'user';
                                
                                let dp = document.createElement('img');
                                dp.className = "img";
                                dp.src= user.DP;
                                box.appendChild(dp);
                                
                                box.appendChild(sel);
                                
                                let lName = document.createElement('label')
                                lName.className = 'name';
                                lName.textContent = user.Name+` (Group)`;
                                lName.style = "margin-top: -39px !important;"
                                box.appendChild(lName);
                                
                                let lMobile = document.createElement('label')
                                lMobile.className = 'mob';
                                lMobile.style = 'display:  none;';
                                lMobile.textContent = user.Mobile;
                                box.appendChild(lMobile);

                            
                                select.appendChild(box);
                            }
                    })

                    if(user.Mobile.length == 10 && reporter[0] != user.Mobile){
                        
                                // let num = '7737843199';
                                // reporter.forEach(e => {
                                //     if(e != user.Mobile){  
                                //             // num = e;
                                //     }
                                // })        

                                        let sel = document.createElement('input');
                                        sel.type = 'radio'
                                        sel.className = "selectusers"
                                            
                                        
                                        let box = document.createElement('div');
                                        box.className = 'user';
                                        
                                        let dp = document.createElement('img');
                                        dp.className = "img";
                                        dp.src= user.DP;
                                        box.appendChild(dp);
                                        
                                        box.appendChild(sel);
                                        
                                        let lName = document.createElement('label')
                                        lName.className = 'name';
                                        lName.textContent = user.Name;
                                        box.appendChild(lName);
                                        
                                        let lMobile = document.createElement('label')
                                        lMobile.className = 'mob';
                                        lMobile.textContent = user.Mobile;
                                        box.appendChild(lMobile);
                                        select.appendChild(box);
                          
                    }
                }
                else{
                    localStorage.setItem('myname', user.Name);
                    document.querySelector('.myname').innerHTML = localStorage.getItem('myname');
                }
            // }   
            
        });
    });


   


    
})

search.addEventListener('click', () => {
    searchbox.style.display = "block";
    searchbox.focus();
});

select.addEventListener('scroll', () => {
    hide();
})


function hide(){
    searchbox.style.display = "none";
}



searchbox.addEventListener('input', (e)=> {
    var labelName = document.querySelectorAll('.name');
    var users = document.querySelectorAll('.user');
    if(searchbox.value != ''){
        
        users.forEach((user, index) => {
            users[index].style.display="none";
            labelName.forEach((user, index) => {
                if (labelName[index].innerText.toLowerCase() === searchbox.value.toLowerCase() || labelName[index].innerText[0].toLowerCase() === searchbox.value.toLowerCase()) {
                    users[index].style.display = 'block'; 
                }
            })
        })
    }
    else{
        users.forEach((user, index) => {
            users[index].style.display='block';
        })
    }
})

var userName = "";
var userMob = "";
var img = "";

select.addEventListener('click', async (event) => {

    //yeha kiya hai add 

    localStorage.setItem('block-Status', "false");
   

    async function statucfetch() {
        let response = await fetch('/userprofile');
        let data = await response.json();

        let blocked = data.Block_Id ? data.Block_Id.split(',') : [];
        let current = localStorage.getItem('Mobile');

        for (let e of blocked) {
            if (current === e) {
                localStorage.setItem('block-Status', "true");
                return "true";
            }
        }

        localStorage.setItem('block-Status', "false");
        return "false";
    }






    if((event.target.tagName === 'DIV' && event.target.className === 'user') || event.target.className === 'name' || event.target.className === 'mob' || event.target.tagName === 'IMG'){
        const userDiv = event.target.closest('.user');
        if (userDiv) {
           
            if(localStorage.getItem('temp') != 1){
                img = userDiv.querySelector('.img');
                img = img.src;
                userName = userDiv.querySelector('.name').innerText;
                userMob = userDiv.querySelector('.mob').innerText;
                localStorage.setItem("Name", userName)
                localStorage.setItem("Mobile", userMob)
                localStorage.setItem("Image", img)
                // localStorage.setItem('profile-img',)
                
                var x = window.matchMedia("(max-width: 900px)")
                // location.reload();
                document.querySelector('.chats').style = "display: none;"
                
                if(x.matches){
                  
                    location.href='/chat';  
                    
                }else{
                    //-------------------------ye add kiya hai mene isme------------------------- 
                    
                    var usr_name = document.querySelector('.usr-name');
                    usr_name.innerHTML = localStorage.getItem('Name');
                    
                    document.querySelector('.profile-img').src = localStorage.getItem('Image');
                    
                    var name1 = localStorage.getItem('myname')
                    var name2 = localStorage.getItem('Name')
                    

                    function createDifferentRoomId(p1, p2) {
                        var room = [p1, p2].sort().join('_');     
                        return room.trim(); 
                    }


                   let blockStatus = await statucfetch(); 

                    if (blockStatus === "false") {
                        room = createDifferentRoomId(name1, name2);
                        localStorage.setItem('roomId', room);
                    } else {
                        localStorage.setItem('roomId', "");
                        room = null;
                    }



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
                    fetch('/fetchChats', {
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
                                
                                if(msg.length > 0){
                                    chatbox.innerHTML = element.message;
                                }
                                
                                const a = chatbox.querySelectorAll('.chat-message .image');
                                a.forEach((img) => {
                                    img.src = localStorage.getItem('Image');
                                })
                            });
                        })
                        chatbox.innerHTML = '';

                        //------------------------- yaha tak add kiya hai chattingStript.js me se-------------------------


                        document.querySelector('.chats').style = "display: block;"
                        document.querySelector('.escchat').style = "display: none;"


                }

                
                
           }
    }
    }

})

let loginpopup = document.querySelector('.login-popup');

document.querySelector('.bi-gear').addEventListener('mouseover', (e) =>{
    loginpopup.style ="display: block;" 
})
loginpopup.addEventListener('mouseleave', () =>{
   loginpopup.style ="display: none;"
})

loginpopup.addEventListener('click', (e) => {

    if(e.target.tagName ==='LI' && e.target.className === 'bi bi-person-circle'){
        window.location.href = '/profile';
    }
})

let signout = document.querySelector('.bi-box-arrow-left');
signout.addEventListener('click', () => {
    
    window.location.href = '/signout';

})



// create group


const groupbtn = document.querySelector('.bi-person-fill-add');
const grouppersonselect = document.querySelector('.group-people-select');
// const selectusersbtn = document.querySelectorAll('.selectusers');





groupbtn.addEventListener('click', (e) => {

    let usergroup = document.querySelectorAll('.user');
    let usermob ="";
    for(let i = 0; i< usergroup.length; i++){
        usermob = usergroup[i].querySelector('.mob');
        if(usermob.innerHTML.length != 10){

            usergroup[i].style ="display: none;"
            
            usergroup.style = "display: none !important;"

        }
    }
    // if(usergroup.querySelectorAll('.mob').innerHTML.length != 10){
    // }
    // console.log("donedone"+usergroup.querySelector('.mob').innerHTML)



    var groupuser = [];
    localStorage.setItem('temp','1');
    groupbtn.className = "bi bi-hand-index-thumb-fill"; 
    

    select.addEventListener('click', (event) => {
        if((event.target.tagName === 'DIV' && event.target.className === 'user') || event.target.className === 'name' || event.target.className === 'mob' || event.target.tagName === 'IMG'){

            const userDiv = event.target.closest('.user');
            if (userDiv) {
                    userMob = userDiv.querySelector('.mob').innerText;
                    userDiv.style="background: #E6B86A"
                    groupbtn.className = "bi bi-send-arrow-up"; 
                    groupuser.push(userMob);
                    console.log(groupuser);
                }
        }
    })

    groupbtn.addEventListener('click', () => {
       
        if(groupuser.length>=2){
            localStorage.setItem('groupusers', groupuser+","+localStorage.getItem('mymobile'));
            window.location.href = '/groupDetail';
        }
        else{
            alert("Please Select Members More then 1");
        }
        
    })
    
    
    
    // fetch('/group', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ groupusers: groupuser })
    // })
    // .then(response => response)
    // .then(res => {
    //     if(res){
    //         console.log('User Sended in backend');
    //     }
    // })




})





    const socket = io();
    let room = "";
    var AllChatting = "";


   

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





    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
                 document.querySelector('.chats').style = "display: none;"
                 document.querySelector('.escchat').style = "display: block;"
        }
    })