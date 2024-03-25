// app.js

//1.objeto
let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
}


//Categoria

const categoriasNum = {
    1: 'comida',
    2: 'bebidas',
    3: 'Postres'
}
   
    
    



const btnGuardarCliente = document.querySelector('#guardarCliente');
btnGuardarCliente.addEventListener('click', guardarCliente);



function guardarCliente(){
    const mesaID = document.querySelector('#mesa').value;
    const horaID = document.querySelector('#hora').value;

    //Reviasar si hay campos vacios
    const camposVacios = [ mesaID, horaID ].some( campo => campo === '');

    if(camposVacios){

        const existeAlerta = document.querySelector('.invalid-feedback');
        if(!existeAlerta){

        const alerta = document.createElement('DIV');
        alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
        alerta.textContent = 'Todos los campos son obligatorios';
        document.querySelector('.modal-body form').appendChild(alerta);
        
        //Eliminar mensaje
        setTimeout(()=> {
            alerta.remove()
        },2000)

        }
        return
    }


    //ASignar datos del formulario a cliente
    cliente = {...cliente, mesa, hora};

    //Ocultar MOdal
    const modalFormulario = document.querySelector('#formulario');
    const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBoostrap.hide();


    //Mostrar las sectiones y el main (clase d-none)!

    mostrarSecciones();


    //Obtener los platos de la API
    obtenerPlatosAPI();


    mostrarPlatos();


};

function mostrarSecciones(){
    const seccionesOculatas = document.querySelector('.d-none');
    seccionesOculatas.forEach(clase => clase.classlist.remove('d-none')
)}



//API
function obtenerPlatosAPI(){
    const url = 'http://localhost:4000/platos';

    fetch(url)
    .then(data => data.json())
    .then(respuesta => {
        mostrarPlatos(respuesta);
    })
    .catch(error => {
        console.error('No se pudieron cargar los datos:', error);
    });
}


function mostrarPlatos(platosArray){
    const contenido = document.querySelector('#platos');

    platosArray.array.forEach(platoID => {
        const row = document.createElement('DIV');
        row.classList.add('row');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platoID.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-m-3', 'fw-bold');
        precio.textContent = `$${platoID.precio}`;


        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3', 'fw-bold');
        categoria.textContent = categoriasNum[platoID.categoria];


        //Input Cajita
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el plato
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlato({...platoID, cantidad});
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        contenido.appendChild(row)

        
    });

}

function agregarPlato(producto){
    //Extraer el pedido actual
    let { pedido } = cliente;
    
    //Revisar que la cantidad sea mayor a 0
    if(producto.cantidad > 0){
       //Comprueba si el elemento ya existe en el array
       if(pedido.some(articulo => articulo.id === producto.id)) {
        //El articulo ya existe, Actualizada
        const pedidoActualizado = pedido.map( articulo => {
            if( articulo.id === producto.id ) {
                articulo.cantidad = producto.cantidad;
            }
            return articulo;
        });
        cliente.pedido = [...pedidoActualizado];
       } else {
        //El articulo no existe, lo agregamos
        cliente.pedido = [...pedido, producto];
    }
    }else {
        //Eliminar elemento ya AGREGADOS
        const resultado = pedido.filter(articulo => articulo.id !== producto.id)
        cliente.pedido =[...resultado];
    }

    //Limpiar HTML
    limpiarHTML();

    if(cliente.pedido.length) {
        //Mostrar el Resumen con los datos
    actualizarResumen();
    } else {
        mensajepedidoVacio();
    }
   
    
}


function actualizarResumen(){

    const contenido = document.querySelector('#resumen .contenido')

    
    //INFO Mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Hora: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.hora;
    mesaSpan.classList.add('fw-normal');


    //INFO HORA
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');


    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platos agregados'
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedido

    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');


    const {pedido} = cliente;

    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, subtotal } = articulo;
    
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');
    
        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;
    
        // Cantidad del artículo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';
    
        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
    
        // Precio del artículo
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';
    
        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularsubtotal(precio, cantidad);

        //Boton para Elimiar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminiar';

        btnEliminar.onclick = function(){
            eliminarProducto(id);
        }

        // Subtototal del artículo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';
    
        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = precio;
    
        // Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);
    
        // Agregar elementos al <li>
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);
        // Agregar <li> a la lista principal
        grupo.appendChild(lista);
    });


    //agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);

    contenido.appendChild(resumen);


    //MOstrar formulario de propionas
    formularioPropinas();
}


function limpiarHTML(){

    const contenido = document.querySelector('#resumen .contenido')
    while(contenido.firstchild){
        contenido.removeChild(contenido.firstchild)
    }
}

function calcularsubtotal(precio, cantidad){
    return `$${precio * cantidad}`
}


function eliminarProducto(id){

    const { pedido } = cliente;
    //Eliminar elemento ya AGREGADOS
    const resultado = pedido.filter(articulo => articulo.id !== producto.id)
    cliente.pedido =[...resultado];
    
    //Limpiar HTML
    limpiarHTML();
   
    if(cliente.pedido.length) {
        //Mostrar el Resumen con los datos
        actualizarResumen();
    } else {
        mensajepedidoVacio();//Mostar el mensaje INICIAL
    }

    //El producto se elimino por lo tanto regresamos la cantidad de 0 en formularip
    const productoElimiado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoElimiado);
    inputEliminado.value = 0;
}


function mensajepedidoVacio(){
    const contenido = document.querySelector('#resumen');
    const texto = document.createElement('P');
    texto.classList.add('text-center')
    texto.textContent = 'Añade elementos';

    contenido.appendChild(texto);
}

function formularioPropinas(){

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario' ,'card', 'shadow', 'py-5', 'px-3');
    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';


    //Radio button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina',
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularpropina;


    const radio10Label = document.createElement('LBAEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');
    
    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina',
    radio25.value = "10";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularpropina;


    const radio25Label = document.createElement('LBAEL');
    radio25Label.textContent = '10%';
    radio25Label.classList.add('form-check-label');
    
    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //Radio button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina',
    radio50.value = "10";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularpropina;


    const radio50Label = document.createElement('LBAEL');
    radio50Label.textContent = '10%';
    radio50Label.classList.add('form-check-label');
    
    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //AGREGAR al DIV Principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    formulario.appendChild(divFormulario);

    //Agrgar al formulariio
    formulario.appendChild(heading);

    divFormulario.appendChild(heading);

    contenido.appendChild(formulario);

}



function calcularpropina(){
    const { pedido } = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal  += articulo.cantidad * articulo.precio
    })


    const propinaSeleciona = document.querySelector('[name="propina"]:checked').value

    //Calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleciona)) / 100)

    //Calcular el total a pagar

    const total = subtotal + propina;


    mostrarTOtalHTml(subtotal, total, propina);


}


function mostrarTOtalHTml( subtotal, total, propina){

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar');


    //Subtotal

    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal COnsumo: ';


    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina

    const PropinaParrafo = document.createElement('P');
    PropinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    PropinaParrafo.textContent = 'Propina COnsumo: ';


    const PropinaSpan = document.createElement('SPAN');
    PropinaSpan.classList.add('fw-normal');
    PropinaSpan.textContent = `$${propina}`;

    subtotalParrafo.appendChild(PropinaSpan);

    //total

    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Propina COnsumo: ';


    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    subtotalParrafo.appendChild(PropinaSpan)


    //ELIMINAR TOTAL PAGAR
    const totalpagarDiv = document.querySelector('.total-pagar');
    if(totalpagarDiv){
        totalpagarDiv.remove();
    }
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(PropinaParrafo);
    divTotales.appendChild(totalParrafo);



    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales)
}
