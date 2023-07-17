const submitbtn = document.getElementById('msgsubmit');
const submitinput = document.getElementById('msgid');



async function msgsubmit(url) {
    const response = await fetch(url)
    const msgJSON = await response.json();

    return msgJSON;
} 

submitbtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const apicall = await msgsubmit('http://127.0.0.1:8000/display/')
    console.log(apicall)
})



const response = fetch('http://127.0.0.1:8000/display/', {
method: 'POST',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
    
},
body: `{
   "id": 20,
   "content": "this is new content",
   "Created at": 2023-07-11T11:21:28Z, 
  }`,
}).then((res)=> res.json())
.then((data)=>{
    console.log(JSON.stringify(data));
});


  