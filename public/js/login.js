function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(String(password));
}

function logincheck(){
    event.preventDefault()
    let data = {}
    data.email = document.getElementById("email").value;
    data.password = document.getElementById("psw").value;
    
    if (!validateEmail(data.email)) {
        return alert("Invalid email");
    }
    
  
    
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if(res.status == 200){
                //return alert("You loggined");
                localStorage.user = JSON.stringify(res.user)
                window.location="index.html";
            }
            else {
                return alert("Invalid id");
            }
        }
    });
    
    xhr.open("POST", "http://localhost:4000/login");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
}