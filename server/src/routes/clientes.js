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

// 2. Buscar um cliente pelo ID
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

// ATUALIZAR (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nome, email, telefone }
    });
    
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// ALTERNAR STATUS (Inativar/Ativar)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Descobre como ele está agora
    const clienteAtual = await prisma.cliente.findUnique({
      where: { id: Number(id) }
    });

    // 2. Inverte o status (se true vira false, se false vira true)
    const novoStatus = !clienteAtual.ativo;

    await prisma.cliente.update({
      where: { id: Number(id) },
      data: { ativo: novoStatus }
    });

    res.json({ message: novoStatus ? "Cliente reativado" : "Cliente inativado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao alterar status do cliente" });
  }
});

export default router;