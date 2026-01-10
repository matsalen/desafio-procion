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
        preco: parseFloat(preco) 
      }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// ATUALIZAR
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;
    
    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: { 
        nome, 
        descricao,
        preco: parseFloat(preco) 
      }
    });
    
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produtoAtual = await prisma.produto.findUnique({ where: { id: Number(id) } });
    
    const novoStatus = !produtoAtual.ativo;

    await prisma.produto.update({
      where: { id: Number(id) },
      data: { ativo: novoStatus }
    });
    
    res.json({ message: novoStatus ? "Produto reativado" : "Produto inativado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao alterar status" });
  }
});

export default router;