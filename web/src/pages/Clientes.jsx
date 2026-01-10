import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, Heading, useToast, Container, Flex, IconButton } from '@chakra-ui/react';
import api from '../api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idEdicao, setIdEdicao] = useState(null); 
  const toast = useToast();

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEditar = (cliente) => {
    setIdEdicao(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone || ''); 
  };

  const handleExcluir = async (id) => {
    try {
        await api.delete(`/clientes/${id}`);
        toast({ title: 'Status alterado com sucesso', status: 'info' });
        fetchClientes();
    } catch (error) {
        toast({ title: 'Erro ao alterar status', status: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (idEdicao) {
        await api.put(`/clientes/${idEdicao}`, { nome, email, telefone });
        toast({ title: 'Cliente atualizado!', status: 'success' });
        setIdEdicao(null); 
      } else {
        await api.post('/clientes', { nome, email, telefone });
        toast({ title: 'Cliente criado!', status: 'success' });
      }
      setNome(''); setEmail(''); setTelefone('');
      fetchClientes();
    } catch (error) {
      toast({ title: 'Erro na operação', status: 'error' });
    }
  };

  const cancelarEdicao = () => {
    setIdEdicao(null);
    setNome(''); setEmail(''); setTelefone('');
  }

  return (
    // Container ajustado para mobile (padding menor)
    <Container maxW="container.md" py={5} px={{ base: 2, md: 4 }}>
      <Heading mb={5} size="lg" textAlign={{ base: 'center', md: 'left'}}>Gestão de Clientes</Heading>

      <Heading size="md" mb={3} color={idEdicao ? "orange.600" : "gray.600"}>
        {idEdicao ? `Editando Cliente #${idEdicao}` : "Novo Cadastro"}
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
        {/* Inputs empilhados no celular (column), lado a lado no PC (row) */}
        <Flex gap={4} mb={4} direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </Flex>
        
        <FormControl mb={4}>
          <FormLabel>Telefone</FormLabel>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </FormControl>

        <Flex gap={2}>
            <Button type="submit" colorScheme={idEdicao ? "yellow" : "blue"} w={{ base: '100%', md: 'auto' }}>
                {idEdicao ? "Salvar Alterações" : "Cadastrar Cliente"}
            </Button>
            
            {idEdicao && (
                <Button onClick={cancelarEdicao} w={{ base: '100%', md: 'auto' }}>Cancelar</Button>
            )}
        </Flex>
      </Box>

      {/* Tabela com Scroll Horizontal garantido */}
      <Box w="100%" overflowX="auto" border="1px solid #eee" borderRadius="md">
          <Table variant="simple" minW="600px"> {/* minW força a tabela a não espremer o texto */}
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientes.map(cliente => (
                <Tr key={cliente.id} opacity={cliente.ativo ? 1 : 0.5}>
                  <Td>{cliente.nome}</Td>
                  <Td>{cliente.email}</Td>
                  <Td>{cliente.telefone}</Td>
                  <Td>{cliente.ativo ? "Ativo" : "Inativo"}</Td>
                  <Td>
                    <Flex gap={2}>
                        <Button size="sm" colorScheme="yellow" onClick={() => handleEditar(cliente)}>
                            Editar
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme={cliente.ativo ? "red" : "green"} 
                          onClick={() => handleExcluir(cliente.id)}
                        >
                            {cliente.ativo ? "Inativar" : "Reativar"}
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

export default Clientes;