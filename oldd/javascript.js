

  function turfbooking(){
      event.preventDefault()
      let data = {}

      data.tname = document.getElementById("turfname").value;
      data.time = document.getElementById("turftime").value;
      data.price = document.getElementById("turfprice").value;
      data.date = document.getElementById("date").value;
      data = JSON.stringify(data);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
        //alert("Completed");

      });
      
      xhr.open("POST", "http://localhost:4000/turfbooking");
      
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.send(data);
      
  }
  