

const endpoint = "https://fakestoreapi.com/products"

fetch(endpoint, {
    method : "POST",
    headers : {
        "Content-Type" : "application/json",    
    },
    body : JSON.stringify({
        email: "makanbang@gmail.com",
        nama: "Abiel"
    }),
})
    .then(result => result.json())
    .then(data => console.log(data))

