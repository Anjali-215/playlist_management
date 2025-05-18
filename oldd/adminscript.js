//turf reg

function turfreg(event){
    event.preventDefault();
    let data = {}

    data.name = document.getElementById("turfname").value;
    data.location = document.getElementById("turflocation").value;
    data.description = document.getElementById("turfdescription").value;
    //data.image = image.getElementById("turfimage").value;
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
      alert("reg");

    });
    
    xhr.open("POST", "http://localhost:4000/turfregister");
    
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
    
}


//turf list

function turflist(event) {
    event.preventDefault();
    let data = null
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
        const res = JSON.parse(this.responseText);
        var table = '<table id="turflist">  <tr><th>No</th><th>Turfname</th><th>Image</th><th>Location</th><th>Description</th></tr>', element = "";
        if (res.data.length > 0) {
          for (let index = 0; index < res.data.length; index++) {
            element += '<tr><td>' + res.data[index].id + '</td><td>' + res.data[index].name + '</td><td>' + res.data[index].image + '</td><td>' + res.data[index].location + '</td><td>' + res.data[index].description + '</td></tr>';
          }
        }
        table += element;
        table += '</table>'
        document.getElementById("turflist").innerHTML = table;
      }
    });
    xhr.open("GET", "http://localhost:4000/turflistview");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }


  //userlist

  function userlist(event) {
    event.preventDefault()
    let data = null
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
        const res = JSON.parse(this.responseText);
        var table = '<table id="userlist">  <tr><th>No</th><th>Username</th><th>Phone number</th><th>E-mail</th></tr>', element = "";
        if (res.data.length > 0) {
          for (let index = 0; index < res.data.length; index++) {
            element += '<tr><td>' + res.data[index].id + '</td><td>' + res.data[index].username + '</td><td>' + res.data[index].phone + '</td><td>' + res.data[index].email + '</td></tr>';
          }
        }
        table += element;
        table += '</table>'
        document.getElementById("userlist").innerHTML = table;
      }
    });
    xhr.open("GET", "http://localhost:4000/view");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }