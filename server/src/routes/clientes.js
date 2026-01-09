import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// 1. Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// 2. Buscar um cliente pelo ID (para edição futura)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) }
    });
    
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

// 3. Criar um novo cliente
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    
    // Validação básica
    if (!nome || !email) {
      return res.status(400).json({ error: "Nome e Email são obrigatórios" });
    }

    const novoCliente = await prisma.cliente.create({
      data: { nome, email, telefone }
    });
    
    res.status(201).json(novoCliente);
  } catch (error) {
    // Código P2002 do Prisma significa "Violação de campo único" (ex: email repetido)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// 4. Deletar cliente (Opcional, mas impressiona)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar cliente" });
  }
});

export default router;