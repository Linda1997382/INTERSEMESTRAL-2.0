document.addEventListener('DOMContentLoaded', async function () {
    const WshlstItemsContainer = document.getElementById('Wshlst-items');
    const totalPriceElement = document.getElementById('total-price');
    const usuarioID = 1; // Reemplaza con el ID real del usuario

    try {
        // Obtener los items de la wishlist desde el servidor
        const response = await fetch(`http://localhost:3000/api/Wshlst/${usuarioID}`);
        const WshlstItems = await response.json();

        if (response.ok) {
            if (WshlstItems.length === 0) {
                WshlstItemsContainer.innerHTML = '<li class="list-group-item">Tu wishlist está vacía</li>';
                totalPriceElement.textContent = '$0';
                return;
            }

            let totalPrice = 0;
            WshlstItemsContainer.innerHTML = '';

            for (const item of WshlstItems) {
                const bookResponse = await fetch(`http://localhost:3000/api/books/${item.LibroID}`);
                const book = await bookResponse.json();

                if (bookResponse.ok) {
                    totalPrice += book.Precio * item.Cantidad;
                    WshlstItemsContainer.innerHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>${book.Titulo}</h5>
                                <p>${book.Descripcion}</p>
                                <small class="text-muted">Precio: $${book.Precio}</small>
                                <small class="text-muted">Cantidad: ${item.Cantidad}</small>
                            </div>
                            <button class="btn btn-sm btn-danger" onclick="removeFromWshlst(${usuarioID}, ${book.ID})">Eliminar</button>
                        </li>
                    `;
                }
            }

            // Actualizar el precio total
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        } else {
            WshlstItemsContainer.innerHTML = '<li class="list-group-item">Error al obtener los detalles de la wishlist</li>';
        }
    } catch (error) {
        WshlstItemsContainer.innerHTML = '<li class="list-group-item">Error al obtener los detalles de la wishlist</li>';
    }
});

async function removeFromWshlst(usuarioID, libroID) {
    try {
        const response = await fetch(`http://localhost:3000/api/Wshlst/${usuarioID}/${libroID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Libro eliminado de la wishlist');
            location.reload();
        } else {
            alert('Error al eliminar el libro de la wishlist');
        }
    } catch (error) {
        alert('Error al eliminar el libro de la wishlist');
    }
}