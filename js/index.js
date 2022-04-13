//------------------------------------//
/*Definicion de constantes & variables*/
//------------------------------------//
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template_card').content
const templateFooter = document.getElementById('template_footer').content
const templateCarrito = document.getElementById('template_carrito').content
const buttonComprar = document.getElementById('btn_comprar');
const cerrar = document.querySelectorAll('.close')[0];
const abrir = document.querySelectorAll('.btn_carrito_menu')[0];
const modal = document.querySelectorAll('.modal_carrito')[0];
const modalC = document.querySelectorAll('.modal_container')[0];
const modalTarjetas = document.querySelectorAll('.contenedor_tarjetas')[0];
const fragment = document.createDocumentFragment();
const tarjeta = document.getElementById('tarjeta');
const trasera =document.getElementById('trasera');
const btnAbrirFormulario = document.getElementById('btn_abrir_formulario');
const formulario = document.getElementById('formulario_tarjeta');
const numeroTarjeta = document.querySelector('#tarjeta .numero');
const nombreTarjeta = document.querySelector('#tarjeta .nombre');
const logoMarca = document.getElementById('logo_marca');
const firma = document.querySelector('#tarjeta .firma p');
const mesExpiracion = document.querySelector('#tarjeta .mes');
const yearExpiracion = document.querySelector('#tarjeta .year');
const ccv = document.querySelector('#tarjeta .ccv');
const btnEnviarTarjeta =document.getElementById('btnEnviarTarjeta');
const contador = document.getElementById('contador')
let carrito = {}

//------------------------------------//
/*Leemos el documento para ejecutar la dase de datos*/
//------------------------------------//
document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    //------------------------------------//
    //A continuacion ejecutamos la localStorage si exite informacion dentro del carrito la extraemos y se agrega 
    //------------------------------------//
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        plasmarCarrito()
    }
} )
//------------------------------------//
/* llamando la base de datos "Utilizando el método fetch" */
//------------------------------------//
const fetchData = async () => {
    try{
        const res = await fetch('/data/productos.json')
        const data = await res.json()
        //console.log(data)
        plasmarCards(data)

    }catch (error){
        console.log(error)
    } 
}
//------------------------------------//
/*A continuación vamos a plasmar o dibujar nuestras cards*/
//------------------------------------//

const plasmarCards = data =>{
    data.forEach(producto => {
        templateCard.querySelector('.tituloCard').textContent =producto.title
        templateCard.querySelector('.precio').textContent =producto.precio
        templateCard.querySelector('.imgCard').setAttribute("src", producto.image)
        templateCard.querySelector('.btnCard').dataset.id=producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    } )
    cards.appendChild(fragment)
}
//------------------------------------//
//------captura de los cards----------//
//------------------------------------//
cards.addEventListener('click', e => {
    addCarrito(e)
} )
//------------------------------------//
//---captura de los botones aumentar--// 
//------------------------------------//
items.addEventListener('click', e  => {
    btnAumentarDisminuir(e)
})
//------------------------------------//
//captura del cards a agregar al carrito
//------------------------------------//
const addCarrito = e => {
    //------------------------------------//
   //seleccionamos e identificamos el boton de cada cards
   //------------------------------------//
    if(e.target.classList.contains('btnCard')){
        //aca con setCarrito recopilamos la toda la informacion del contenedor padre en este caso el div y la empujamos a setCarrito
        setCarrito(e.target.parentElement)
    }
   
   e.stopPropagation();
}
//------------------------------------//
//set carrito va a capturar todos los elementos de la card seleccionada 
//------------------------------------//
const setCarrito = objeto => {
    console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btnCard').dataset.id,
        title: objeto.querySelector('.tituloCard').textContent,
        precio: objeto.querySelector('.precio').textContent,
        cantidad: 1
        
    }
    //------------------------------------//
    //con el siguiente if vamos a establecer que el producto no se vuelva a agregar si no que se sume en cantidad
    //------------------------------------//
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1 
    }
    carrito[producto.id] = { ...producto }
    plasmarCarrito()
    //----------------------------------//
    //alert producto agregado al carrito//
    //----------------------------------//
    Swal.fire({
        icon: 'success',
        title: 'Producto Agregado al Carrito',
        showConfirmButton: false,
        timer: 1500
      })      
} 
//------------------------------------//
//acontinucacion se plasma o dibuja el carrito
//------------------------------------//
const plasmarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.spanPrecio').textContent = producto.precio * producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-dis').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    plasmarFooter() 
    plasmarContador()

    //En la siguiente liena de codigo guardamos dentro del localStoragela informacion de los productos que queden dentro del carrito cada vez que se ejecute la funcion plasmarCarrito()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
//------------------------------------//
//acontinucacion se plasma o dibuja del carrito
//------------------------------------//
const plasmarFooter = () =>{
    footer.innerHTML=''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML=`
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `               
        return
    }

    const ncantidad = Object.values(carrito).reduce((acc, {cantidad})  => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
   
    templateFooter.querySelectorAll('td')[0].textContent = ncantidad
    templateFooter.querySelector('span').textContent = nPrecio
   
    var cantidadContador = ncantidad
    const clone = templateFooter.cloneNode(true) 
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar_carrito')
    btnVaciar.addEventListener('click', () => {
        carrito={}
        plasmarCarrito()
    } )

    

}



const btnAumentarDisminuir = e => {
    //------------------------------------//
    //aca aumentamos la cantidad de los productos dentro del carrito
    //------------------------------------//
    if (e.target.classList.contains('btn_aumentar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        plasmarCarrito()
    }//------------------------------------//
    //aca disminuimos la cantidad de los productos dentro del carrito
    //------------------------------------//
    if (e.target.classList.contains('btn_disminuir')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        plasmarCarrito()
    }
    e.stopPropagation()
}
//------------------------------------//
//Modal de la ventana carrito"abrir o llamar a carrito"
//------------------------------------//

abrir.addEventListener('click', (e) => {
    e.preventDefault()
    modalC.style.opacity = "1";
    modalC.style.visibility = "visible"; 
    modal.classList.toggle('modal_close')

} )

cerrar.addEventListener('click', () => {
    modal.classList.toggle('modal_close');
    modalC.style.opacity = "0";
    modalC.style.visibility = "hidden"; 
    modalC.classList.remove('active')
    modal.classList.remove('active')
    modalTarjetas.classList.remove('active')
    
} )
window.addEventListener('click', (e)  => {
    if(e.target == modalC){
        modal.classList.toggle('modal_close');
        modalC.style.opacity = "0";
        modalC.style.visibility = "hidden";
        
    }
    
})
//------------------------------------------//
//funcion para el contador del icono carrito//
//------------------------------------------//
const plasmarContador = () => {
    contador.innerHTML=''
    if(Object.keys(carrito).length === 0){
        contador.classList.add('active')
    }else{
        contador.classList.remove('active')
        cantidadContador = Object.values(carrito).reduce((acc, {cantidad})  => acc + cantidad,0)
        contador.textContent=cantidadContador
    }
}
//------------------------------------//
//funciones para desplagar modal o contenedor de pago "tarjeta"
//------------------------------------//

buttonComprar.addEventListener('click', () => {
    if(Object.keys(carrito).length === 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes Agregar un producto para poder continuar!',
          })        
        return
    
    }else{
        modalC.classList.toggle('active')
        modal.classList.toggle('active')
        modalTarjetas.classList.toggle('active')
    }
   
})
window.addEventListener('click', (e) => {
    if(e.target == modalC){
        modalC.classList.remove('active')
        modal.classList.remove('active')
        modalTarjetas.classList.remove('active')
    }
})
//----------------------------------//
//funciones interactivas de la tarjeta
//----------------------------------//
//------------------------------------//
//Girar tarjeta cuando el usuario rellene el formulario
//------------------------------------//
const mostrarFrente = () => {
    if(tarjeta.classList.contains('active')){
        tarjeta.classList.remove('active')

    }
}//------------------------------------//
//-----Girar tarjeta-----//
//------------------------------------//
tarjeta.addEventListener('click', () => {
    tarjeta.classList.toggle('active')
})
//------------------------------------//
//Boton abrir y cerrar formulario tarjeta

btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.toggle('active')
    formulario.classList.toggle('active')
})
//----------------------------------//
//funciones interactivas del Formulario Tarjeta//
//----------------------------------//
//Rellenar select del formulario "Mes"
for(let i = 1; i<=12; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectMes.appendChild(opcion);
}
//------------------------------------//
//Rellenar select del formulario "año"
//------------------------------------//
const yearActual = new Date().getFullYear();
for(let i = yearActual; i<= yearActual + 8; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectYear.appendChild(opcion);
}
//------------------------------------//
//Input numero de tarjeta
//------------------------------------//
formulario.inputNumero.addEventListener('keyup', (e) => {
   valorInput = e.target.value;
   formulario.inputNumero.value = valorInput
   //Eliminar espacio en blancos
   .replace(/\s/g, '')
   //Eliminar letras
   .replace(/\D/g, '')
   //Espaciado cada cuatro numeros
   .replace(/([0-9]{4})/g, '$1 ')
   //Elimina el ultimo espaciado
   .trim()

   numeroTarjeta.textContent = valorInput 
   
   if(valorInput == ''){
       numeroTarjeta.textContent = '#### #### #### ####';
       logoMarca.innerHTML = '';
   }
   if(valorInput [0] == 4){
       logoMarca.innerHTML = '';
       const imagen = document.createElement('img');
       imagen.src = '../img/logos/visa.png';
       logoMarca.appendChild(imagen);
   }else if (valorInput [0] == 5){
    logoMarca.innerHTML = '';
    const imagen = document.createElement('img');
    imagen.src = '../img/logos/mastercard.png';
    logoMarca.appendChild(imagen);
   }
   //Girar tarjeta cuando el usuario rellene el formulario
   mostrarFrente()
})
//------------------------------------//
//Input Nombre Tarjeta 
//------------------------------------//
formulario.inputNombre.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '');
    nombreTarjeta.textContent = valorInput
    firma.textContent = valorInput;
    if(valorInput == ''){
        nombreTarjeta.textContent =  'STEFANO CORSO'
    }
    mostrarFrente()
})
//------------------------------------//
//select mes
//------------------------------------//
formulario.selectMes.addEventListener('change', (e) => {
    mesExpiracion.textContent = e.target.value
    mostrarFrente()
})
formulario.selectYear.addEventListener('change', (e) => {
    yearExpiracion.textContent = e.target.value.slice(2)
    mostrarFrente()
})
//------------------------------------//
// input ccv
//------------------------------------//
formulario.inputCCV.addEventListener('keyup', () => {
    if(!tarjeta.classList.contains('active')){
        tarjeta.classList.toggle('active')
    }
    formulario.inputCCV.value = formulario.inputCCV.value
     //Eliminar espacio en blancos
   .replace(/\s/g, '')
   //Eliminar letras
   .replace(/\D/g, '')
   ccv.textContent = formulario.inputCCV.value
})
//------------------------------------//
//finalizar compra
//------------------------------------//
btnEnviarTarjeta.addEventListener('click', () => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'En hora buena !',
        text: "¡Deseas continuar con la compra?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, deseo continuar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Felicidades !',
            'Tu pago está siendo procesado .',
            'success'
          )
          carrito={}
          plasmarCarrito()
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu compra ha sido cancelada  ',
            'error'
          )
        }
      })
      
})

