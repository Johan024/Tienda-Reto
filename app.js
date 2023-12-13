// Importar módulos necesarios
const fs = require('fs');  // Módulo del sistema de archivos para leer y escribir archivos
const readline = require('readline');  // Módulo para leer la entrada desde la línea de comandos
const colors = require('colors');  // Módulo para agregar color a la salida en la consola

// Crear una interfaz para leer desde y escribir en la consola
const rl = readline.createInterface({
  input: process.stdin,  // Permite leer desde la consola
  output: process.stdout  // Permite escribir desde la consola
});


// Definir una clase para representar un Producto
class Producto {
  // Constructor para inicializar un Producto con id, nombre, precio y stock
  constructor(id, nombre, precio, stock) {
    this._id = id;  // Asignar el id proporcionado al atributo _id de la instancia
    this._nombre = nombre;  // Asignar el nombre proporcionado al atributo _nombre de la instancia
    this._precio = precio;  // Asignar el precio proporcionado al atributo _precio de la instancia
    this._stock = stock;  // Asignar el stock proporcionado al atributo _stock de la instancia
  }

  // Obtener el ID del producto
  get id() {
  return this._id; // Devuelve el valor actual del atributo
  }

  // Obtener el nombre del producto
  get nombre() {
    return this._nombre;
  }

  // Obtener el precio del producto
  get precio() {
    return this._precio;
  }

  // Establecer un nuevo precio para el producto
  set precio(nuevoPrecio) {
  this._precio = nuevoPrecio; // Asigna el nuevo precio al atributo _precio
  }

  // Obtener la cantidad en stock del producto
  get stock() {
    return this._stock;
  }

  // Establecer una nueva cantidad en stock para el producto
  set stock(nuevoStock) {
    this._stock = nuevoStock;
  }
}

// Definir una clase para representar una Tienda
class Tienda {
  // Constructor para inicializar una Tienda con listas de productos, productos comprados y copias de respaldo
  constructor() {
    this._productos = []; // Inicializar la lista de productos como un array vacío
    this._productosComprados = []; // Inicializar la lista de productos comprados como un array vacío
    this._copiasDeRespaldo = []; // Inicializar la lista de copias de respaldo como un array vacío

    // Cargar copias de respaldo existentes al inicio del programa
    this.cargarCopiasDeRespaldo();
  }

  // Obtener la lista de productos
  get productos() {
    return this._productos;
  }

  // Obtener la lista de productos comprados
  get productosComprados() {
    return this._productosComprados;
  }

  // Obtener la lista de copias de respaldo
  get copiasDeRespaldo() {
    return this._copiasDeRespaldo;
  }
// Mostrar los productos disponibles en la tienda
mostrarProductosDisponibles() {
  console.log('\nProductos disponibles:'); // Imprimir un encabezado indicando que se mostrarán los productos disponibles
  // Iterar sobre la lista de productos y mostrar la información de cada producto
  this.productos.forEach((producto) => {
    // Imprimir detalles como el ID, nombre, precio y cantidad en stock de cada producto
    console.log(`ID: ${producto.id}  || Nombre: ${producto.nombre}  || Precio: $${producto.precio}  || Cantidad: ${producto.stock}`);
  });
}

// Mostrar las opciones de copias de respaldo
mostrarOpcionesCopiasDeRespaldo() {
  // Verificar si hay al menos una copia de respaldo
  if (this._copiasDeRespaldo.length > 0) {
    console.log('\nCopias de respaldo disponibles:'); // Imprimir un encabezado si hay copias de respaldo

    // Iterar sobre las copias de respaldo y mostrarlas con números de índice
    this._copiasDeRespaldo.forEach((copia, index) => {
      console.log(`${index + 1}. ${copia}`); // Mostrar el nombre de cada copia de respaldo junto con un índice
    });
  } else {
    console.log('No hay copias de respaldo disponibles.'); // Imprimir un mensaje si no hay copias de respaldo
  }
}

// Mostrar las copias de respaldo
mostrarCopiasDeRespaldo() {
  console.log('\nCopias de respaldo disponibles:'); // Imprimir un encabezado indicando que se mostrarán las copias de respaldo
  // Iterar sobre las copias de respaldo y mostrar sus nombres
  this._copiasDeRespaldo.forEach((nombreCopia) => {
    console.log(`- ${nombreCopia}`); // Mostrar el nombre de cada copia de respaldo precedido por un guion
  });
}


// Cargar datos desde un archivo JSON
cargarDatos() {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Leer el contenido del archivo 'productos.json' en formato UTF-8
    fs.readFile('productos.json', 'utf8', (err, data) => {
      // Manejar errores durante la lectura del archivo
      if (err) {
        // En caso de error, rechazar la promesa con un mensaje indicando el problema
        reject('Error al cargar los datos.');
      } else {
        // Convertir los datos leídos a objetos Producto y asignarlos a la lista de productos
        this._productos = JSON.parse(data).map((producto) => new Producto(producto._id, producto._nombre, producto._precio, producto._stock));
        // Imprimir un mensaje en la consola indicando que los datos se han cargado correctamente
        console.log('\nDatos cargados:');
        // Iterar sobre la lista de productos cargados e imprimir detalles de cada producto
        this._productos.forEach((producto) => {
          console.log(`ID: ${producto.id}  || Nombre: ${producto.nombre}  || Precio: $${producto.precio}  || Cantidad: ${producto.stock}`);
        });
        // Mostrar copias de respaldo después de cargar los datos
        this.mostrarCopiasDeRespaldo();
        // Resolver la promesa con un mensaje indicando que los datos se han cargado con éxito
        resolve('\nDatos cargados exitosamente.');
      }
    });
  });
}

  // Crear una copia de respaldo de los productos
copiaDeRespaldo(nombreCopia) {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Generar un nombre de archivo para la copia de respaldo o utilizar uno proporcionado por el usuario
    const nombreArchivo = nombreCopia || `respaldo_productos_${Date.now()}.json`;
    // Escribir los productos en un archivo JSON como copia de respaldo
    fs.writeFile(nombreArchivo, JSON.stringify(this._productos, null, 2), 'utf8', (err) => {
      // Manejar errores durante la escritura del archivo
      if (err) {
        // En caso de error, rechazar la promesa con un mensaje indicando el problema
        reject('Error al crear la copia de respaldo.');
      } else {
        // Agregar el nombre de la copia de respaldo a la lista de copias
        this._copiasDeRespaldo.push(nombreArchivo);
        // Resolver la promesa con un mensaje indicando que la copia de respaldo se creó con éxito
        resolve(`Copia de respaldo '${nombreArchivo}' creada con éxito.`);
      }
    });
  });
}

// Realizar reparación de datos desde una copia de respaldo
reparacionDeDatos() {
  return new Promise((resolve, reject) => {
    // Preguntar al usuario si desea reparar los datos
    rl.question('¿Estás seguro de que deseas reparar los datos? Esto sobrescribirá los datos actuales. (S/N): ', (respuesta) => {
      // Verificar la respuesta del usuario
      if (respuesta.toUpperCase() === 'S') {
        // Mostrar las opciones disponibles de copias de respaldo
        this.mostrarOpcionesCopiasDeRespaldo();
        rl.question('Ingresa el número de la copia de respaldo que deseas utilizar: ', (numeroCopia) => {
          // Obtener la copia de respaldo seleccionada por el usuario
          const indiceCopia = parseInt(numeroCopia) - 1;
          const copiaSeleccionada = this._copiasDeRespaldo[indiceCopia];
          if (copiaSeleccionada) {
            // Leer datos desde la copia de respaldo y sobrescribir en productos.json
            fs.readFile(copiaSeleccionada, 'utf8', (err, data) => {
              if (err) {
                reject('Error al leer la copia de respaldo.');
              } else {
                // Parsear los datos de la copia de respaldo y actualizar la lista de productos
                this._productos = JSON.parse(data);
                // Escribir los datos reparados en el archivo productos.json
                fs.writeFile('productos.json', JSON.stringify(this._productos, null, 2), 'utf8', (err) => {
                  if (err) {
                    reject('Error al restaurar los datos desde la copia de respaldo.');
                  } else {
                    resolve('Datos restaurados con éxito desde la copia de respaldo.');
                  }
                });
              }
            });
          } else {
            reject('Número de copia de respaldo no válido.');
          }
        });
      } else {
        // Si el usuario elige no reparar los datos
        resolve('Operación cancelada. Los datos no han sido modificados.');
      }
    });
  });
}


// Mostrar las copias de respaldo disponibles en la consola
mostrarCopiasDeRespaldo() {
  // Verificar si hay copias de respaldo en la lista
  if (this._copiasDeRespaldo.length > 0) {
    // Imprimir un mensaje indicando que hay copias de respaldo disponibles
    console.log('\nCopias de respaldo disponibles:');
    // Iterar sobre la lista de copias de respaldo e imprimir cada una con un índice numérico
    this._copiasDeRespaldo.forEach((copia, index) => {
      console.log(`${index + 1}. ${copia}`);
    });
  } else {
    // Imprimir un mensaje indicando que no hay copias de respaldo disponibles si la lista está vacía
    console.log('No hay copias de respaldo disponibles.');
  }
}


// Grabar un nuevo producto en la lista de productos y en el archivo JSON
grabarNuevoProducto(producto) {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Agregar el nuevo producto a la lista de productos
    this._productos.push(producto);
    // Escribir la lista actualizada de productos en el archivo JSON
    fs.writeFile('productos.json', JSON.stringify(this._productos, null, 2), 'utf8', (err) => {
      // Manejar errores durante la escritura del archivo
      if (err) {
        // En caso de error, rechazar la promesa con un mensaje indicando el problema
        reject('Error al grabar el nuevo producto.');
      } else {
        // Resolver la promesa con un mensaje indicando que el nuevo producto se grabó con éxito
        resolve('\nNuevo producto grabado con éxito.'.green);
      }
    });
  });
}


 // Borrar un producto por ID de la lista de productos y del archivo JSON
borrarProducto(id) {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Encontrar el índice del producto con el ID proporcionado
    const index = this._productos.findIndex((producto) => producto.id === id);
    // Verificar si se encontró el producto
    if (index !== -1) {
      // Eliminar el producto de la lista de productos
      this._productos.splice(index, 1);
      // Escribir la lista actualizada de productos en el archivo JSON
      fs.writeFile('productos.json', JSON.stringify(this._productos, null, 2), 'utf8', (err) => {
        // Manejar errores durante la escritura del archivo
        if (err) {
          // En caso de error, rechazar la promesa con un mensaje indicando el problema
          reject('Error al borrar el producto.');
        } else {
          // Resolver la promesa con un mensaje indicando que el producto se borró con éxito
          resolve('Producto borrado con éxito.');
        }
      });
    } else {
      // Rechazar la promesa si el producto no se encuentra
      reject('Producto no encontrado.');
    }
  });
}


 // Comprar una cantidad específica de un producto
comprarProducto(id, cantidad) {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Encontrar el producto con el ID proporcionado
    const producto = this._productos.find((p) => p.id === id);
    // Verificar si se encontró el producto
    if (producto) {
      // Verificar si hay suficiente stock para la cantidad deseada
      if (producto.stock >= cantidad) {
        // Calcular el precio total y actualizar el stock del producto
        const precioTotal = producto.precio * cantidad;
        producto.stock -= cantidad;
        // Crear un nuevo objeto Producto para representar la compra
        const productoComprado = new Producto(producto.id, producto.nombre, producto.precio, cantidad);
        this._productosComprados.push(productoComprado);
        // Escribir la lista actualizada de productos en el archivo JSON
        fs.writeFile('productos.json', JSON.stringify(this._productos, null, 2), 'utf8', (err) => {
          // Manejar errores durante la escritura del archivo
          if (err) {
            // En caso de error, rechazar la promesa con un mensaje indicando el problema
            reject('Error al comprar el producto.');
          } else {
            // Resolver la promesa con un mensaje indicando que la compra se realizó con éxito
            resolve('Compra realizada con éxito.');
          }
        });
      } else {
        // Rechazar la promesa si la cantidad deseada es mayor que el stock disponible
        reject('Cantidad insuficiente.');
      }
    } else {
      // Rechazar la promesa si el producto no se encuentra
      reject('Producto no encontrado.');
    }
  });
}


// Imprimir una factura para los productos comprados
imprimirFactura(documento, nombreUsuario) {
  // Devolver una nueva promesa para manejar operaciones asíncronas
  return new Promise((resolve, reject) => {
    // Verificar si hay productos comprados antes de imprimir la factura
    if (this._productosComprados.length === 0) {
      // Rechazar la promesa con un mensaje indicando que no hay productos comprados
      reject('No hay productos comprados. Debe comprar productos antes de imprimir la factura.');
      return;
    }
    // Imprimir la factura con detalles de productos comprados y el precio total
    console.log(`\nFactura para ${nombreUsuario} (Documento: ${documento}):`.blue);
    let totalCompra = 0;
    // Iterar sobre los productos comprados y mostrar detalles en la consola
    this._productosComprados.forEach((productoComprado) => {
      const precioTotalProducto = productoComprado.precio * productoComprado.stock;
      console.log(`ID: ${productoComprado.id}, Nombre: ${productoComprado.nombre}, Cantidad: ${productoComprado.stock}, Precio: $${productoComprado.precio}, Total: $${precioTotalProducto}`);
      // Calcular el precio total de cada producto y acumularlo al total de la compra
      totalCompra += precioTotalProducto;
    });
    // Mostrar el precio total de la compra en la consola
    console.log(`Precio Total de la Compra: $${totalCompra}`.red);
    // Limpiar la lista de productos comprados después de imprimir la factura
    this._productosComprados = [];
    // Resolver la promesa con un mensaje indicando que la factura se imprimió con éxito
    resolve('\nFactura impresa.');
  });
}


 // Guardar las copias de respaldo en un archivo JSON
guardarCopiasDeRespaldo() {
  // Escribir la lista de copias de respaldo en el archivo 'copiasDeRespaldo.json'
  fs.writeFileSync('copiasDeRespaldo.json', JSON.stringify(this._copiasDeRespaldo, null, 2), 'utf8');
}
// Cargar las copias de respaldo desde un archivo JSON
cargarCopiasDeRespaldo() {
  try {
    // Intentar leer el archivo 'copiasDeRespaldo.json'
    const data = fs.readFileSync('copiasDeRespaldo.json', 'utf8');
    // Parsear los datos como JSON y asignar a la lista de copias de respaldo
    this._copiasDeRespaldo = JSON.parse(data);
  } catch (error) {
    // Si ocurre un error al cargar, asumir que no hay copias de respaldo guardadas y establecer la lista como vacía.
    this._copiasDeRespaldo = [];
    }
  }
}

// Crear una instancia de la clase Tienda
const tienda = new Tienda();

// Función principal que presenta el menú y maneja las opciones del usuario
function menu() {
  console.log(`\n==================================`.cyan)
  console.log(`===        Tienda Virtual      ===`.cyan)
  console.log(`==================================`.cyan)
  console.log('\nOpciones:\n'.grey);
  console.log('1. Cargar datos JSON'.green);
  console.log('2. Copia de respaldo'.green);
  console.log('3. Reparación de datos'.green);
  console.log('4. Grabar nuevos productos'.green);
  console.log('5. Borrar producto'.green);
  console.log('6. Comprar productos'.green);
  console.log('7. Imprimir factura'.green);
  console.log('0. Cerrar APP\n'.green);

 // Preguntar al usuario que elija una opción del menú
rl.question('Elije una opción: '.grey, (opcion) => {
  switch (opcion) {
    case '1':
      // Opción para cargar datos desde un archivo JSON
      tienda
        .cargarDatos()
        .then((mensaje) => console.log(mensaje)) // Mostrar mensaje de éxito al cargar datos
        .catch((error) => console.error(error)) // Mostrar mensaje de error en caso de fallo
        .finally(menu); // Volver al menú principal independientemente de éxito o fallo
      break;

      case '2':
        // Solicitar al usuario el nombre de la copia de respaldo (o presionar Enter para el nombre predeterminado)
        rl.question('Nombre de la copia de respaldo (o presiona Enter para nombre predeterminado) *recuerda poner .json al final del nombre que vayas a colocar*: ', (nombreCopia) => {
          // Realizar la copia de respaldo con el nombre proporcionado por el usuario
          tienda
            .copiaDeRespaldo(nombreCopia)
            .then((mensaje) => {
              console.log(mensaje); // Mostrar mensaje de éxito al crear la copia de respaldo
              // Guardar las copias de respaldo después de agregar una nueva
              tienda.guardarCopiasDeRespaldo();
            })
            .catch((error) => console.error(error)) // Mostrar mensaje de error en caso de fallo
            .finally(menu); // Volver al menú principal independientemente de éxito o fallo
        });
        break;
      
        
        case '3':
          // Iniciar el proceso de reparación de datos
          tienda
            .reparacionDeDatos()
            .then((mensaje) => console.log(mensaje))
            .catch((error) => console.error(error))
            .finally(menu);
          break;
        
        case '4':
          // Solicitar al usuario información para crear un nuevo producto
          rl.question('\nNombre del nuevo producto: ', (nombre) => {
            rl.question('Precio del nuevo producto: ', (precio) => {
              rl.question('Cantidad del nuevo producto: ', (stock) => {
                // Crear un nuevo objeto Producto con la información proporcionada
                const nuevoProducto = new Producto(tienda.productos.length + 1, nombre, parseFloat(precio), parseInt(stock));
                // Grabar el nuevo producto en el archivo y mostrar el mensaje resultante
                tienda
                  .grabarNuevoProducto(nuevoProducto)
                  .then((mensaje) => console.log(mensaje))
                  .catch((error) => console.error(error))
                  .finally(menu);
              });
            });
          });
          break;
        
        case '5':
          // Mostrar los productos disponibles antes de borrar uno
          tienda.mostrarProductosDisponibles();
          // Solicitar al usuario el ID del producto a borrar
          rl.question('\nID del producto a borrar: ', (id) => {
            // Borrar el producto con el ID proporcionado y mostrar el mensaje resultante
            tienda
              .borrarProducto(parseInt(id))
              .then((mensaje) => console.log(mensaje))
              .catch((error) => console.error(error))
              .finally(menu);
          });
          break;
        
        case '6':
          // Mostrar los productos disponibles antes de realizar una compra
          tienda.mostrarProductosDisponibles();
          // Solicitar al usuario el ID y la cantidad del producto a comprar
          rl.question('\nID del producto a comprar: ', (id) => {
            rl.question('Cantidad a comprar: ', (cantidad) => {
              // Realizar la compra del producto con el ID y cantidad proporcionados
              tienda
                .comprarProducto(parseInt(id), parseInt(cantidad))
                .then((mensaje) => console.log(mensaje))
                .catch((error) => console.error(error))
                .finally(menu);
            });
          });
          break;
        
        case '7':
          // Verificar si hay productos comprados antes de imprimir la factura
          if (tienda.productosComprados.length === 0) {
            console.log('No hay productos comprados. Debe comprar productos (opcion 6) antes de imprimir la factura.\n'.red);
            menu(); // Vuelve al menú principal
            return;
          }
          // Solicitar al usuario el documento y el nombre para imprimir la factura
          rl.question('Documento del usuario: ', (documento) => {
            rl.question('Nombre del usuario: ', (nombreUsuario) => {
              // Imprimir la factura con la información proporcionada
              tienda
                .imprimirFactura(documento, nombreUsuario)
                .then((mensaje) => console.log(mensaje))
                .catch((error) => console.error(error))
                .finally(menu);
            });
          });
          break;
        
        case '0':
          // Cerrar la aplicación y mostrar un mensaje de cierre
          console.log('\nApp cerrada con exito'.yellow);
          rl.close();
          break;
        
        default:
          // Manejar el caso en que el usuario elija una opción no válida
          console.log('Opción no válida. Por favor, elige una opción válida.'.red);
          menu();
    }
  });
}

// Iniciar el ciclo principal de la aplicación al llamar a la función 'menu()'
menu();
