import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// LISTAR PEDIDOS (Trazendo junto os dados do cliente e dos itens)
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true, // Traz o nome do cliente
        itens: {
          include: { produto: true } // Traz o nome dos produtos
        }
      },
      orderBy: { id: 'desc' } // Mais recentes primeiro
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// CRIAR PEDIDO
router.post('/', async (req, res) => {
  try {
    const { clienteId, itens, total, formaPagamento } = req.body; 

    if (!clienteId || !itens || itens.length === 0) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // Salva tudo (pedido + itens), ou não salva nada.
    const novoPedido = await prisma.pedido.create({
      data: {
        clienteId: Number(clienteId),
        total: parseFloat(total),
        formaPagamento: formaPagamento, 
        data: new Date(),
        itens: {
          create: itens.map(item => ({
            produtoId: Number(item.produtoId),
            quantidade: Number(item.quantidade),
            precoUnitario: parseFloat(item.precoUnitario)
          }))
        }
      },
      include: {
        cliente: true,
        itens: { include: { produto: true } }
      }
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

export default router;