const axios=require('axios');
const API_URL="http://20.207.122.201/evaluation-service/notifications";
const ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaW5jaGFuYWNoYW5kcnU1QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2NTM0MiwiaWF0IjoxNzc4MDY0NDQyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjZmMDhlNDgtMTEzMy00MjBjLTg4MmEtMDhjMDE3NTE2Mjc4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaCBjIHNpbmNoYW5hIiwic3ViIjoiOWFiZTlmNWEtNzZlOS00Zjk3LTkyYzgtOWE3ODQwOGViNGIxIn0sImVtYWlsIjoic2luY2hhbmFjaGFuZHJ1NUBnbWFpbC5jb20iLCJuYW1lIjoiaCBjIHNpbmNoYW5hIiwicm9sbE5vIjoibXkuYWMucDJtY2EyNTIxNyIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjlhYmU5ZjVhLTc2ZTktNGY5Ny05MmM4LTlhNzg0MDhlYjRiMSIsImNsaWVudFNlY3JldCI6IkJNcVB2c1NaQkFVQmpGbkYifQ.q687Kc1kqJaDRgIhWgmlvwi4PEnxwihwMySayRhsDRo";
function getPriority(notification){
    const type=notification.Type?.trim().toLowerCase();
    if(notification.Type==="placement")
        return 3;
    if(notification.Type==="result") 
        return 2;
    return 1;
}
async function processNotifications(){
    try{
        const response=await axios.get(API_URL,{
            headers: {
                Authorization:`Bearer ${ACCESS_TOKEN}`
            }
        });
        let data=response.data;
        console.log("Raw API response:\n",JSON.stringify(data,null,2));
        if(Array.isArray(data)){
        }else if(Array.isArray(data.notifications)){
            data=data.notifications;
        }else if(Array.isArray(data.data)){
            data=data.data;
        }else{
            console.error("Unexpected API response format");
            return;
        }
        console.log("Total Notifications:",data.length);
        const unread=data.filter(n=>n.read===false||n.read===undefined);
        console.log("Unread Notifications:",unread.length);
        const priorityOrder={
            placement:3,
            result:2,   
            Event:1
        };
        const scored = unread.map(n => {
    console.log("Type value:", n.Type);

    const type = (n.Type || "").toLowerCase();

    let priority = 1;
    if (type === "placement") priority = 3;
    else if (type === "result") priority = 2;

    return {
        ...n,
        priority
    };
});
        scored.sort((a,b)=>{
            if(b.priority!==a.priority){
                return b.priority-a.priority;
            }
        return new Date(b.Timestamp)-new Date(a.Timestamp);
    });
    const top10=scored.slice(0,10);
    console.log("\n TOP 10 IMPORTANT NOTIFICATIONS:\n");
    top10.forEach((n,i)=> {
        console.log(`${i+1}.
            [${n.Type}]
            ${n.Message}
            |Priority:${n.priority}`);
        });
    }catch(error){
        console.error("Error fetching notifications:",error.message);
    }
}
processNotifications();
    