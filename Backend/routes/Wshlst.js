import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Obtener los items de la Wishlist de un usuario
router.get('/:usuarioID', async (req, res) => {
  const { usuarioID } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM wishlist WHERE UsuarioID = ?', [usuarioID]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener items de la Wishlist:', error);
    res.status(500).json({ message: 'Error al obtener items de la Wishlist' });
  }
});

// Agregar un libro a la Wishlist
router.post('/', async (req, res) => {
  const { usuarioID, libroID, Cantidad } = req.body;
  try {
    // Verificar si el libro ya está en la Wishlist
    const [existingRows] = await pool.query('SELECT * FROM wishlist WHERE UsuarioID = ? AND LibroID = ?', [usuarioID, libroID]);
    if (existingRows.length > 0) {
      // Actualizar la cantidad si el libro ya está en la Wishlist
      await pool.query('UPDATE wishlist SET Cantidad = Cantidad + ?, FechaAgregado = CURRENT_DATE WHERE UsuarioID = ? AND LibroID = ?', [Cantidad, usuarioID, libroID]);
    } else {
      // Agregar el libro a la wishlist si no está presente
      await pool.query('INSERT INTO wishlist (UsuarioID, LibroID, Cantidad, FechaAgregado) VALUES (?, ?, ?, CURRENT_DATE)', [usuarioID, libroID, Cantidad]);
    }
    res.status(201).json({ message: 'Libro agregado a la Wishlist' });
  } catch (error) {
    console.error('Error al agregar libro a la Wishlist:', error);
    res.status(500).json({ message: 'Error al agregar libro a la wishlist' });
  }
});

export default router;
