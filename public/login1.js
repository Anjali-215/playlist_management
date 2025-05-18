
function regcheck(){
    event.preventDefault()
    let data = {}

    data.fullname = document.getElementById("fullName").value;
    data.email = document.getElementById("email").value;

    data.password = document.getElementById("password").value;
    data.confirmPassword=document.getElementById("confirmPassword").value;
    data.dob=document.getElementById("dob").value;
    //data.checkbox = document.getElementById("checked").value;
    //if (data.username === "" || data.email === "" || data.phone === "" || data.password === "" ||data.checkbox === "") {
//alert("Please fill in all the fields.");
//return; // Stop further execution if any field is empty
if (data.fullname == "") {
            alert("Name must be filled out");
            return false;
        }

        // Check if email is empty and is a valid email format
        if (data.email == "") {
            alert("Email must be filled out");
            return false;
        } else {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(data.email)) {
                alert("Invalid email address");
                return false;
            }
        }

        // Check if password is empty and meets minimum length
        if (data.password == "") {
            alert("Password must be filled out");
            return false;
        } else if (data.password.length < 6) {
            alert("Password must be at least 8 characters long");
            return false;
        }
        
        if (data.password != data.confirmPassword)
        {
            alert("Password does not match");
            return false;
        } 
        if (data.dob == "") {
            alert("should be above 18 years");
            return false;}  

    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        if(response.status == 200){
            window.location="index.html";
        }else{
            alert(response.data);
            location.reload();
        }
        
      }
    });
    
    xhr.open("POST", "http://localhost:4000/signup");
    
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
    
    }
