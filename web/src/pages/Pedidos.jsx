import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, Flex, useToast, Container, Text } from '@chakra-ui/react';
import api from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

function Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]); 
  
  // Estado para forma de pagamento
  const [formaPagamento, setFormaPagamento] = useState('Pix');

  const toast = useToast();

  useEffect(() => {
    api.get('/clientes').then(res => {
        const ativos = res.data.filter(c => c.ativo === true);
        setClientes(ativos);
    });
    api.get('/produtos').then(res => {
        const ativos = res.data.filter(p => p.ativo === true);
        setProdutos(ativos);
    });
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

  const removerItem = (indexParaRemover) => {
    const novoCarrinho = carrinho.filter((_, index) => index !== indexParaRemover);
    setCarrinho(novoCarrinho);
  };

  const totalPedido = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const processarDocumento = (dadosPedido, itensCarrinho) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Comprovante de Pedido", 14, 20);
    doc.setFontSize(12);
    doc.text(`ID: ${dadosPedido.id}`, 14, 30);
    doc.text(`Cliente: ${dadosPedido.cliente ? dadosPedido.cliente.nome : 'Cliente'}`, 14, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 50);

    const tableRows = itensCarrinho.map(item => [
      item.nome,
      item.quantidade,
      `R$ ${item.precoUnitario.toFixed(2)}`,
      `R$ ${item.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Produto', 'Qtd', 'Preço', 'Total']],
      body: tableRows,
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 10 : 80;
    doc.setFontSize(14);
    const totalMostra = dadosPedido.total ? Number(dadosPedido.total).toFixed(2) : "0.00";
    
    // Adiciona forma de pagamento no PDF
    doc.text(`Forma de Pagamento: ${dadosPedido.formaPagamento}`, 14, finalY);
    doc.text(`Total Geral: R$ ${totalMostra}`, 14, finalY + 10); 

    doc.save(`pedido_${dadosPedido.id}.pdf`);

    const email = dadosPedido.cliente?.email || "";
    const assunto = encodeURIComponent(`Pedido #${dadosPedido.id}`);
    const corpo = encodeURIComponent(`Olá,\n\nSegue anexo o pedido.\nPagamento: ${dadosPedido.formaPagamento}\nTotal: R$ ${totalMostra}`);

    setTimeout(() => {
        window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
    }, 500);

    toast({ title: 'PDF Baixado', description: 'Anexe ao e-mail que foi aberto.', status: 'success', duration: 4000 });
  };

  const finalizarPedido = async () => {
    if (!clienteSelecionado || carrinho.length === 0) {
      toast({ title: 'Preencha os dados', status: 'warning' });
      return;
    }
    try {
      const response = await api.post('/pedidos', {
        clienteId: Number(clienteSelecionado),
        total: parseFloat(totalPedido),
        itens: carrinho,
        formaPagamento: formaPagamento // <--- Enviando para o backend
      });
      toast({ title: 'Pedido Salvo!', status: 'success' });
      setCarrinho([]); 
      setClienteSelecionado('');
      setFormaPagamento('Pix'); // Reseta para o padrão
      
      try { processarDocumento(response.data, carrinho); } 
      catch (pdfError) { console.error(pdfError); }
    } catch (error) {
      toast({ title: 'Erro ao salvar', status: 'error' });
    }
  };

  return (
    <Container maxW="container.lg" px={{ base: 2, md: 4 }} py={5}>
      <Heading mb={5} size="lg" textAlign={{ base: 'center', md: 'left'}}>Novo Pedido</Heading>
      
      <Flex gap={3} mb={5} direction={{ base: 'column', md: 'row' }}>
        <FormControl w="100%">
          <FormLabel>Cliente</FormLabel>
          <Select placeholder="Selecione..." value={clienteSelecionado} onChange={e => setClienteSelecionado(e.target.value)}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </FormControl>
        
        <FormControl w="100%">
          <FormLabel>Produto</FormLabel>
          <Select placeholder="Selecione..." value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco}</option>)}
          </Select>
        </FormControl>
        
        <Flex gap={3} w="100%">
            <FormControl w="80px">
                <FormLabel>Qtd</FormLabel>
                <Input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} min={1} />
            </FormControl>
            <Button mt={8} colorScheme="blue" onClick={adicionarItem} flex={1}>Add</Button>
        </Flex>
      </Flex>

      <Box border="1px solid #e2e8f0" borderRadius="md" p={{ base: 2, md: 4 }}>
        <Heading size="md" mb={4}>Itens</Heading>
        
        <Box w="100%" overflowX="auto" pb={2}>
            <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                <Th>Prod</Th>
                <Th>Qtd</Th>
                <Th>Total</Th>
                <Th>Ação</Th> 
                </Tr>
            </Thead>
            <Tbody>
                {carrinho.map((item, index) => (
                <Tr key={index}>
                    <Td>{item.nome}</Td>
                    <Td>{item.quantidade}</Td>
                    <Td>R$ {item.subtotal.toFixed(2)}</Td>
                    <Td>
                    <Button size="xs" colorScheme="red" onClick={() => removerItem(index)}>X</Button>
                    </Td>
                </Tr>
                ))}
            </Tbody>
            </Table>
        </Box>

        {/* ÁREA INFERIOR: Pagamento + Total + Botão */}
        <Flex 
            justify="space-between" 
            align="center" 
            mt={5} 
            direction={{ base: 'column', md: 'row' }} 
            gap={4}
            bg="gray.50" // Destaque visual
            p={4}
            borderRadius="md"
        >
          {/* Seletor de Pagamento */}
          <FormControl w={{ base: '100%', md: '200px' }}>
            <FormLabel fontSize="sm" fontWeight="bold">Pagamento</FormLabel>
            <Select 
                bg="white" 
                value={formaPagamento} 
                onChange={(e) => setFormaPagamento(e.target.value)}
            >
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
            </Select>
          </FormControl>

          <Flex direction="column" align={{ base: 'center', md: 'flex-end' }} gap={2}>
             <Heading size="md">Total: R$ {totalPedido.toFixed(2)}</Heading>
             <Button colorScheme="green" size="lg" w={{ base: '100%', md: 'auto' }} onClick={finalizarPedido}>
                Finalizar Pedido
             </Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}

export default Pedidos;