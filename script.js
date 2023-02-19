class Cartera{
    constructor(id, imagen, nombre, color, precio, stock, cantidad){

        this.id = id
        this.imagen = imagen
        this.nombre = nombre
        this.color = color
        this.precio = precio
        this.stock = stock
        this.cantidad = cantidad
    }
}

let arrayCarteras = []
let arrayCarrito = [] 
const acumulador = document.getElementById('acumulador')
const precioTotal = document.getElementById ('precioTotal')

$(()=>{

    $.getJSON('productos.json', function(data){
        data.forEach(elemento => {arrayCarteras.push(elemento)
        })
        mostrarCarteras()
        agregarCarrito()
        carrito()
        getItem()        
    })

// Función para mostrar carteras    
function mostrarCarteras(){
        arrayCarteras.forEach((carteras, indice) => {
            $('#divProductos').append( `
                <div class="card" style="width: 18rem;">
                    <img src= ${carteras.imagen} class="imagenCarteras" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${carteras.nombre}</h5>
                    <p class="card-text">Color: ${carteras.color}</p>
                    <p>$${carteras.precio}</p>
                    <button id='boton1${indice}' class= "agregarCarrito btn btn-dark">Agregar al carrito</button>
                </div>
            </div>
            `)        
    })   
        //Añado animación a botón de agregar al carrito. 
        $('.agregarCarrito').on('mouseover', function(){
            $(this).animate ({
                width: "250px"    
            },1000).delay(1200)
            $(this).animate ({
                width: "180px"    
            },1000)
            
        })
    }

function agregarCarrito(){
    arrayCarteras.forEach((carteras, indice) => {         
        //Añado evento a botón de agregar al carrito.
        $(`#boton1${indice}`).click(() => {
            let carterasr = arrayCarrito.find(cart => cart.id == carteras.id)
            if(carterasr) {
                carteras.cantidad = carteras.cantidad + 1
                $(`#cantidad${indice}`).html( `<td id="cantidad${indice}">${carteras.cantidad}</td>`)
                actualizarCarrito()
            }else{         
                arrayCarrito.push(carteras)
                actualizarCarrito()               
            }  
            localStorage.setItem('carrito',JSON.stringify(arrayCarrito)) 
        })    
    })
}
// Función para mostrar productos en el carrito
function carrito(){ 
        // Añado evento al botón carrito           
        $('#Carrito').on('click', () => {
            $('#modalBody').html('')
            // Añado evento al botón cerrar del modal
            botonCerrar.addEventListener('click', () =>{
                $('#miModal').modal('hide')
            })       
            botonesCarrito()                                                               
            if($("#modalBody").children().length == 0){                                      
                arrayCarrito.forEach((carterasArray, indice) => {                       
                    $('#modalBody').append ( `
                    <table class="table" id= 'cartera${indice}'>
                    <thead >
                    <tr >
                        <th scope="col"></th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Cantidad</th>  
                    </tr>
                    </thead>
                    <tbody>
                    <tr >
                        <th scope="row"><img src= ${carterasArray.imagen} class="imagenCartera" style= "width: 30 px;" alt="..."></th>
                        <td>${carterasArray.nombre}</td>
                        <td>$ ${carterasArray.precio}</td>
                        <td id="cantidad${indice}">${carterasArray.cantidad}</td>
                        <td><button id ='boton${indice}' class= "btn btn-light">Eliminar</button></td>
                    </tr>
                    </tbody>
                </table>
                </div>
                    `)                     
                    botonesCarrito()                        
                })
                    
        //Añado evento a botón eliminar        
        arrayCarrito.forEach((carteraArray, indice) => {
            $(`#boton${indice}`).on('click', () => {
                if(carteraArray.cantidad == 1) {
                    $(`#cartera${indice}`).remove()                    
                    arrayCarrito = arrayCarrito.filter(producto => producto.id != carteraArray.id)
                    localStorage.setItem('carrito',JSON.stringify(arrayCarrito))
                    
                    actualizarCarrito()
                    botonesCarrito()                         
                }else{
                    carteraArray.cantidad = carteraArray.cantidad - 1
                    $(`#cantidad${indice}`).html( `<td id="cantidad${indice}">${carteraArray.cantidad}</td>`)
                    localStorage.setItem('carrito',JSON.stringify(arrayCarrito))
                                        
                    actualizarCarrito()                                                             
                    }
                })                
            })
        }            
    })         
}  

function getItem(){
    if( localStorage.getItem('carrito') !== null){
        arrayCarrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
}
// Función para intercambiar botones en el modal
function botonesCarrito(){
    if( arrayCarrito.length == 0){
        $("#finalizarCompra").css("display", "none")
        $("#botonCerrar").css("display", "block")    
        $('#modalBody').append ( `<p>Carrito de compras vacío.</p>`)
        $("#precioTo").css("display", "none")
    } else{
        $("#finalizarCompra").css("display", "block")
        $("#botonCerrar").css("display", "none")
        $("#precioTo").css("display", "block")
    }        
}

//Función para modificar contador de carrito y precio total
function actualizarCarrito(){    
    acumulador.innerText = arrayCarrito.reduce((acc, el)=> acc + el.cantidad, 0)
    precioTotal.innerText = arrayCarrito.reduce((acc, el)=> acc +( el.precio * el.cantidad), 0)      
    }

// Evento para botón de finalizar compra
$('#finalizarCompra').on('click', ()=>{
    $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(arrayCarrito), function(respuesta, estado){
        console.log(respuesta, estado);
        if(estado === "success"){       
        $('#modalBody').empty()
        $('#modalBody').append('<p>Compra realizada con exito!.</p>')
        arrayCarrito = []
        localStorage.clear()
        actualizarCarrito()
        $("#finalizarCompra").css("display", "none")
        $("#botonCerrar").css("display", "block")
        $("#precioTo").css("display", "none")                 
        }
        })
    })     
    $('#modalBody').html('')    
    botonesCarrito()    
})
