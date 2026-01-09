import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, useToast, Container, Flex } from '@chakra-ui/react';
import api from '../api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const toast = useToast();

  // 1. Função para carregar clientes da API
  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar", error);
    }
  };

  // Carrega a lista assim que a tela abre
  useEffect(() => {
    fetchProdutos();
  }, []);

  // 2. Função para salvar novo produto
  const handleSubmit = async (e) => {
    e.preventDefault(); // Não recarregar a página
    try {
      await api.post('/produtos', { nome, preco, descricao });
      
      toast({ title: 'Produto criado!', status: 'success', duration: 2000 });
      setNome(''); setPreco(''); setDescricao(''); // Limpa campos
      fetchProdutos(); // Recarrega a lista
    } catch (error) {
      toast({ title: 'Erro ao criar', status: 'error' });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <Heading mb={5}>Gestão de Produtos</Heading>

      {/* Formulário de Cadastro */}
      <Box as="form" onSubmit={handleSubmit} border="1px solid #ccc" p={5} borderRadius={8} mb={10}>
        <Flex gap={4} mb={4}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Fone" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Preco</FormLabel>
            <Input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 49.99" />
          </FormControl>
        </Flex>
        
        <FormControl mb={4}>
          <FormLabel>Descricao</FormLabel>
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Bluetooth" />
        </FormControl>

        <Button type="submit" colorScheme="blue">Cadastrar Produto</Button>
      </Box>

      {/* Lista de Produtos */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Preco</Th>
            <Th>Descricao</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produtos.map(produto => (
            <Tr key={produto.id}>
              <Td>{produto.nome}</Td>
              <Td>{produto.preco}</Td>
              <Td>{produto.descricao}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}

export default Produtos;