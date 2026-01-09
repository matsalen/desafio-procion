import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Pedidos from './pages/Pedidos';

function App() {
  return (
    <BrowserRouter>
      {/* Menu Superior */}
      <Box bg="teal.500" p={4}>
        <Flex gap={4}>
          <Heading size="md" color="white" mr={10}>Loja System</Heading>
          <Link to="/"><Button colorScheme="teal" variant="solid">Clientes</Button></Link>
          <Link to="/produtos"><Button colorScheme="teal" variant="solid">Produtos</Button></Link>
          {/* Deixe o botão de Pedidos pronto para o dia 3 */}
          <Link to="/pedidos"><Button colorScheme="teal" variant="solid">Novo Pedido</Button></Link>
        </Flex>
      </Box>

      {/* Área de Conteúdo */}
      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;