import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, Flex, Text, useToast, Container } from '@chakra-ui/react';
import api from '../api';

// 1. IMPORTANDO AS LIBS DE PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

function Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]); 
  const toast = useToast();

  useEffect(() => {
    api.get('/clientes').then(res => setClientes(res.data));
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado || quantidade <= 0) return;
    const produtoObj = produtos.find(p => p.id == produtoSelecionado);
    const novoItem = {
      produtoId: produtoObj.id,
      nome: produtoObj.nome,
      precoUnitario: produtoObj.preco,
      quantidade: Number(quantidade),
      subtotal: produtoObj.preco * quantidade
    };
    setCarrinho([...carrinho, novoItem]);
    setProdutoSelecionado(''); 
    setQuantidade(1);
  };

  const totalPedido = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  // 2. FUNÇÃO QUE DESENHA O PDF
  const gerarPDF = (dadosPedido, itensCarrinho) => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Comprovante de Pedido", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`ID do Pedido: ${dadosPedido.id}`, 14, 30);
    // Verificação de segurança: se cliente vier nulo, mostra vazio
    doc.text(`Cliente: ${dadosPedido.cliente ? dadosPedido.cliente.nome : 'Cliente'}`, 14, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 50);

    const tableRows = itensCarrinho.map(item => [
      item.nome,
      item.quantidade,
      `R$ ${item.precoUnitario.toFixed(2)}`,
      `R$ ${item.subtotal.toFixed(2)}`
    ]);

    // MUDANÇA PRINCIPAL AQUI:
    autoTable(doc, {
      startY: 60,
      head: [['Produto', 'Qtd', 'Preço Un.', 'Subtotal']],
      body: tableRows,
    });

    // Pega a posição final de forma segura
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) 
      ? doc.lastAutoTable.finalY + 10 
      : 80;

    doc.setFontSize(14);
    // Verificação de segurança: garante que total é número
    const totalMostra = dadosPedido.total ? Number(dadosPedido.total).toFixed(2) : "0.00";
    doc.text(`Total Geral: R$ ${totalMostra}`, 14, finalY);

    doc.save(`pedido_${dadosPedido.id}.pdf`);
  };

  const finalizarPedido = async () => {
    if (!clienteSelecionado || carrinho.length === 0) {
      toast({ title: 'Selecione cliente e produtos', status: 'warning' });
      return;
    }

    try {
      // 1. SALVA NO BANCO
      const response = await api.post('/pedidos', {
        clienteId: Number(clienteSelecionado),
        total: parseFloat(totalPedido),
        itens: carrinho
      });
      
      // SE PASSOU DAQUI, O PEDIDO ESTÁ SALVO!
      toast({ title: 'Pedido realizado com Sucesso!', status: 'success' });
      
      // Limpa a tela imediatamente
      setCarrinho([]); 
      setClienteSelecionado('');
      
      // 2. TENTA GERAR O PDF (Se der erro aqui, não assusta o usuário)
      try {
         gerarPDF(response.data, carrinho);
      } catch (pdfError) {
         console.error("Erro ao gerar PDF:", pdfError);
         toast({ title: 'Pedido salvo, mas erro ao gerar PDF', status: 'warning' });
      }

    } catch (error) {
      // ESSE catch SÓ PEGA ERRO DE REDE/BANCO AGORA
      console.error(error); // <--- Importante para vermos o erro real no console
      toast({ title: 'Erro ao salvar pedido', status: 'error' });
    }
  };

  return (
    <Container maxW="container.lg" py={5}>
      <Heading mb={5}>Novo Pedido</Heading>
      <Flex gap={4} mb={5} direction={{ base: 'column', md: 'row' }}>
        <FormControl flex={1}>
          <FormLabel>Cliente</FormLabel>
          <Select placeholder="Selecione um cliente" value={clienteSelecionado} onChange={e => setClienteSelecionado(e.target.value)}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </FormControl>
        <FormControl flex={1}>
          <FormLabel>Produto</FormLabel>
          <Select placeholder="Selecione um produto" value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco}</option>)}
          </Select>
        </FormControl>
        <FormControl w="100px">
          <FormLabel>Qtd</FormLabel>
          <Input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} min={1} />
        </FormControl>
        <Button mt={8} colorScheme="blue" onClick={adicionarItem}>Adicionar</Button>
      </Flex>

      <Box border="1px solid #e2e8f0" borderRadius="md" p={4}>
        <Heading size="md" mb={4}>Itens do Pedido</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Produto</Th>
              <Th>Qtd</Th>
              <Th>Preço Un.</Th>
              <Th>Subtotal</Th>
            </Tr>
          </Thead>
          <Tbody>
            {carrinho.map((item, index) => (
              <Tr key={index}>
                <Td>{item.nome}</Td>
                <Td>{item.quantidade}</Td>
                <Td>R$ {item.precoUnitario}</Td>
                <Td>R$ {item.subtotal.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Flex justify="space-between" align="center" mt={5}>
          <Heading size="lg">Total: R$ {totalPedido.toFixed(2)}</Heading>
          <Button colorScheme="green" size="lg" onClick={finalizarPedido}>Finalizar e Gerar PDF</Button>
        </Flex>
      </Box>
    </Container>
  );
}

export default Pedidos;