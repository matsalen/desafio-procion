import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, useToast, Container, Flex } from '@chakra-ui/react';
import api from '../api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const toast = useToast();

  // 1. Função para carregar clientes da API
  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar", error);
    }
  };

  // Carrega a lista assim que a tela abre
  useEffect(() => {
    fetchClientes();
  }, []);

  // 2. Função para salvar novo cliente
  const handleSubmit = async (e) => {
    e.preventDefault(); // Não recarregar a página
    try {
      await api.post('/clientes', { nome, email, telefone });
      
      toast({ title: 'Cliente criado!', status: 'success', duration: 2000 });
      setNome(''); setEmail(''); setTelefone(''); // Limpa campos
      fetchClientes(); // Recarrega a lista
    } catch (error) {
      toast({ title: 'Erro ao criar', status: 'error' });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <Heading mb={5}>Gestão de Clientes</Heading>

      {/* Formulário de Cadastro */}
      <Box as="form" onSubmit={handleSubmit} border="1px solid #ccc" p={5} borderRadius={8} mb={10}>
        <Flex gap={4} mb={4}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ex: joao@email.com" />
          </FormControl>
        </Flex>
        
        <FormControl mb={4}>
          <FormLabel>Telefone</FormLabel>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
        </FormControl>

        <Button type="submit" colorScheme="blue">Cadastrar Cliente</Button>
      </Box>

      {/* Lista de Clientes */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Telefone</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clientes.map(cliente => (
            <Tr key={cliente.id}>
              <Td>{cliente.nome}</Td>
              <Td>{cliente.email}</Td>
              <Td>{cliente.telefone}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}

export default Clientes;