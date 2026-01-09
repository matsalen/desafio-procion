import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, Flex, Text, useToast, Container } from '@chakra-ui/react';
import api from '../api';

function Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]); // Lista temporária de itens
  const toast = useToast();

  // Carrega clientes e produtos ao abrir a tela
  useEffect(() => {
    api.get('/clientes').then(res => setClientes(res.data));
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  // Adicionar item ao carrinho visual
  const adicionarItem = () => {
    if (!produtoSelecionado || quantidade <= 0) return;

    // Acha o objeto produto completo baseado no ID selecionado
    const produtoObj = produtos.find(p => p.id == produtoSelecionado);

    const novoItem = {
      produtoId: produtoObj.id,
      nome: produtoObj.nome,
      precoUnitario: produtoObj.preco,
      quantidade: Number(quantidade),
      subtotal: produtoObj.preco * quantidade
    };

    setCarrinho([...carrinho, novoItem]);
    setProdutoSelecionado(''); // Limpa seleção
    setQuantidade(1);
  };

  // Calcular total do pedido
  const totalPedido = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  // Salvar no Banco de Dados
  const finalizarPedido = async () => {
    if (!clienteSelecionado || carrinho.length === 0) {
      toast({ title: 'Selecione cliente e produtos', status: 'warning' });
      return;
    }

    try {
      await api.post('/pedidos', {
        clienteId: clienteSelecionado,
        total: totalPedido,
        itens: carrinho
      });
      
      toast({ title: 'Pedido realizado!', status: 'success' });
      setCarrinho([]); // Limpa carrinho
      setClienteSelecionado('');
    } catch (error) {
      toast({ title: 'Erro ao salvar pedido', status: 'error' });
    }
  };

  return (
    <Container maxW="container.lg" py={5}>
      <Heading mb={5}>Novo Pedido</Heading>

      <Flex gap={4} mb={5} direction={{ base: 'column', md: 'row' }}>
        {/* Seleção de Cliente */}
        <FormControl flex={1}>
          <FormLabel>Cliente</FormLabel>
          <Select placeholder="Selecione um cliente" value={clienteSelecionado} onChange={e => setClienteSelecionado(e.target.value)}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </FormControl>

        {/* Seleção de Produto */}
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

      {/* Tabela do Carrinho */}
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
          <Button colorScheme="green" size="lg" onClick={finalizarPedido}>Finalizar Pedido</Button>
        </Flex>
      </Box>
    </Container>
  );
}

export default Pedidos;