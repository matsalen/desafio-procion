import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, useToast, Container, Flex } from '@chakra-ui/react';
import api from '../api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idEdicao, setIdEdicao] = useState(null); 
  const toast = useToast();

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleEditar = (produto) => {
    setIdEdicao(produto.id);
    setNome(produto.nome);
    setPreco(produto.preco);
    setDescricao(produto.descricao || ''); 
  };

  const handleExcluir = async (id) => {
    try {
        await api.delete(`/produtos/${id}`);
        toast({ title: 'Status alterado', status: 'info' });
        fetchProdutos();
    } catch (error) {
        toast({ title: 'Erro ao alterar status', status: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/produtos/${idEdicao}`, { nome, preco, descricao });
        toast({ title: 'Produto atualizado!', status: 'success' });
        setIdEdicao(null); 
      } else {
        await api.post('/produtos', { nome, preco, descricao });
        toast({ title: 'Produto criado!', status: 'success' });
      }
      setNome(''); setPreco(''); setDescricao('');
      fetchProdutos();
    } catch (error) {
      toast({ title: 'Erro na operação', status: 'error' });
    }
  };

  const cancelarEdicao = () => {
    setIdEdicao(null);
    setNome(''); setPreco(''); setDescricao('');
  }

  return (
    // Padding lateral ajustado
    <Container maxW="container.md" py={5} px={{ base: 2, md: 4 }}>
      <Heading mb={5} size="lg" textAlign={{ base: 'center', md: 'left'}}>Gestão de Produtos</Heading>

      <Heading size="md" mb={3} color={idEdicao ? "orange.600" : "gray.600"}>
        {idEdicao ? `Editando Produto #${idEdicao}` : "Novo Produto"}
      </Heading>

      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        bg={idEdicao ? "orange.50" : "white"}
        border="1px solid" 
        borderColor={idEdicao ? "orange.400" : "gray.200"}
        borderWidth={idEdicao ? "2px" : "1px"}
        boxShadow={idEdicao ? "lg" : "sm"}
        transform={idEdicao ? "scale(1.01)" : "scale(1)"}
        transition="all 0.2s"
        p={5} 
        borderRadius={8} 
        mb={10}
      >
        {/* Inputs responsivos */}
        <Flex gap={4} mb={4} direction={{ base: 'column', md: 'row' }}>
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

        <Flex gap={2}>
            <Button type="submit" colorScheme={idEdicao ? "yellow" : "blue"} w={{ base: '100%', md: 'auto' }}>
                {idEdicao ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
            
            {idEdicao && (
                <Button onClick={cancelarEdicao} w={{ base: '100%', md: 'auto' }}>Cancelar</Button>
            )}
        </Flex>
      </Box>

      {/* Tabela Scrollável */}
      <Box w="100%" overflowX="auto" border="1px solid #eee" borderRadius="md">
          <Table variant="simple" minW="500px">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Preco</Th>
                <Th>Descricao</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {produtos.map(produto => (
                <Tr key={produto.id} opacity={produto.ativo ? 1 : 0.5}>
                  <Td>{produto.nome}</Td>
                  <Td>{produto.preco}</Td>
                  <Td>{produto.descricao}</Td>
                  <Td>
                    <Flex gap={2}>
                        <Button size="sm" colorScheme="yellow" onClick={() => handleEditar(produto)}>
                            Editar
                        </Button>
                        <Button size="sm" colorScheme={produto.ativo ? "red" : "green"} onClick={() => handleExcluir(produto.id)}>
                            {produto.ativo ? "Inativar" : "Reativar"}
                        </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
      </Box>
    </Container>
  );
}

export default Produtos;