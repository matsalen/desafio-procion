import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// Listar Produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Criar Produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ error: "Nome e Preço são obrigatórios" });
    }

    const novoProduto = await prisma.produto.create({
      data: { 
        nome, 
        descricao,
        // O frontend pode mandar string "10.50", garantimos que vire número
        preco: parseFloat(preco) 
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

export default router;