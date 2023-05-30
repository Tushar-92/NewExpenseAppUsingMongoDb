

async function signUp(event) {
    try {
        event.preventDefault();
    
        let userName = document.getElementById('name').value;
        let userEmail = document.getElementById('email').value;
        let userPassword = document.getElementById('password').value;
    
        const obj = {
            username: userName,
            email: userEmail,
            password: userPassword
        }

        const response = await axios.post("http://localhost:3000/user/signup" , obj);
        
        if(response.status === 201){
            window.location.href = "./login.html" // sending to login page on successful login
        } else {
            throw new Error('Failed to Signup');
        }
        
        
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;"> ${err} </div> `;
               
    }

}


async function login(event) {
    try {
        event.preventDefault();

        let userEmail = document.getElementById('email').value;
        let userPassword = document.getElementById('password').value;
    
        const obj = {
            email: userEmail,
            password: userPassword
        }

        const response = await axios.post("http://localhost:3000/user/login" , obj);
        // console.log(response);
        // console.log(response.data);
        // console.log(response.data.message);
        alert(response.data.message);
        localStorage.setItem('token' , response.data.token);
        window.location.href = "./ExpenseTracker.html";
      
    } catch (err) {
        // console.log(err);
        // console.log(err.message);
        document.body.innerHTML += `<div style="color:red;"> ${err.message} </div>`;
    }

}


async function addFunction () {

    try {

        let firstValue = document.getElementById('1').value;
        let secondValue = document.getElementById('2').value;
        let thirdValue = document.getElementById('3').value;
        
        const obj =  {
            Amount : firstValue ,
            Description : secondValue ,
            Category : thirdValue 
        };

        const token = localStorage.getItem('token');

        const response = await axios.post("http://localhost:3000/expense/addexpense" , obj , { headers: {"Authorization" : token}} );
        
        //Below two outputs are just for self analysis
        console.log(response);
        console.log(response.data);

        //Now displaying the data entered by user on the web page with delete functionality
        displayInputFromUser(response.data);
        
    } catch (error) {
        console.log(error);
        let ul = document.getElementById('addList');
        let newList = document.createElement('li');
        newList.innerText = 'Error in Submitting Data';
        ul.appendChild(newList);
        
    }
}
           
            
function displayInputFromUser (expense) {

    //Creating new list so that it can used in future for displaying information on the page.
    let ul = document.getElementById('addList');
    let newList = document.createElement('li');
    ul.appendChild(newList);



    //Now adding list of the inputs so that it can be visisble to user on page.
    let expenseDataFromUser = `${expense.Amount} - ${expense.Description} - ${expense.Category} `;
    newList.innerText = expenseDataFromUser;
    
   
   
    //Making Delete Expense Button
    let deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.innerText = 'Delete Expense';
    newList.appendChild(deleteBtn);
    deleteBtn.addEventListener('click' , deleteFunction);

    
    //deleteFunction
    function deleteFunction () {

        const token = localStorage.getItem('token');
        axios
        .delete(`http://localhost:3000/expense/deleteexpense/${expense._id}` , { headers: {"Authorization" : token}})
        .then(() => {
            ul.removeChild(newList);
        })
        .catch((error) => console.log(error));
       
    }

} 


document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);

    let options =
    {
     "key": 'rzp_test_DSJBMPiaTdBku3', 
     "order_id": response.data.id,

     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res);
        alert('You are a Premium User Now');

        document.getElementById('rzp-button1').style.visibility = "hidden";
        document.getElementById('message').innerHTML = "You are a Premium User";
        
        localStorage.setItem('token' , res.data.token);

        
     },
  };

    const rzp1 = new Razorpay(options);
    rzp1.open(); //After clicking on button, this will open the Frontend window of Razorpay to collect payment
    e.preventDefault();

    //As via handler function we handled the payment successs. Now lets also handle the failed payment.
    rzp1.on('payment.failed', function (response){
        console.log(response)
        alert('Something went wrong')
    });
}


async function showLeaderBoard() {

    const token = localStorage.getItem('token');

    const userLeaderBoardArray = await axios.get('http://localhost:3000/expense/showLeaderBoard', { headers: {"Authorization" : token} });
    console.log(userLeaderBoardArray);

    let leaderboardElement = document.getElementById('leaderBoardList');
    leaderboardElement.innerHTML += '<h1>Leader Board</h1>';
    userLeaderBoardArray.data.forEach((userDetails) => {
    leaderboardElement.innerHTML += `<li>Name - ${userDetails.Name} , Total Expense - ${userDetails.Total_Expense || 0} </li>`;
    })
}


async function download() {

    const token = localStorage.getItem('token');
    let response = await axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    
    try {
        if(response.status === 200){
            //the bcakend is essentially sending a download link to which if we open in browser, the file would download
            let a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv'; //i.e it will download with the name of this 
            a.click();
        } else {
            throw new Error(response.data.message);
        }
        
    } catch (err) {
        showError(err);        
    }
}


async function showPreviouslyDownloadedUrls() {
    
    const token = localStorage.getItem('token');

    const userDownloadedUrlArray = await axios.get('http://localhost:3000/user/showPreviouslyDownloadedUrls', { headers: {"Authorization" : token} });
    // console.log(userDownloadedUrlArray);
    // console.log(userDownloadedUrlArray.data);

    let urlListElements = document.getElementById('previouslyDownloadedUrlList');
    urlListElements.innerHTML += '<h1>Your Previously Downladed Files<h1>';
    userDownloadedUrlArray.data.forEach((urlDetails) => {
        urlListElements.innerHTML += `<li> Downloaded At - ${urlDetails.createdAt} , URL For Download - ${urlDetails.URL} </li>`;
    })

    
}


function forgotPassword() {
    window.location.href = "./ForgotPassword.html";
}


async function resetPassword(event) {

    event.preventDefault();

    let email = document.getElementById('email').value;

    const obj = {
        email: email
    }

    const response = await axios.post("http://localhost:3000/password/forgotpassword" , obj);
    
}



    

    




    

    
        
        
        



    