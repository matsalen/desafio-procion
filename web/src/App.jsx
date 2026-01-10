import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Button, Heading } from '@chakra-ui/react';

// Seus imports de páginas
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos'; 
import Pedidos from './pages/Pedidos'; 

function App() {
  return (
    <BrowserRouter>
      <Box bg="teal.500" px={4} py={3}>
        <Flex 
          maxW="container.lg" 
          mx="auto" 
          align="center" 
          // REMOVI O 'justify="space-between"' DAQUI
          wrap="wrap" 
          gap={3}
        >
          {/* Título: Mantive igual */}
          <Heading size="md" color="white" w={{ base: '100%', md: 'auto' }} textAlign={{ base: 'center', md: 'left' }}>
            Loja System
          </Heading>

          {/* MUDANÇA AQUI: mx="auto" faz a mágica no Desktop */}
          <Flex 
            gap={2} 
            w={{ base: '100%', md: 'auto' }} 
            justify="center" 
            mx={{ base: 0, md: 'auto' }} // No celular margem 0, no PC margem automática (centro)
          >
            <Link to="/"><Button size="sm" colorScheme="teal" variant="solid">Clientes</Button></Link>
            <Link to="/produtos"><Button size="sm" colorScheme="teal" variant="solid">Produtos</Button></Link>
            <Link to="/pedidos"><Button size="sm" colorScheme="teal" variant="solid">Pedido</Button></Link>
          </Flex>

          {/* DICA DE DESIGN: 
             Se você quisesse o centro PERFEITO da tela, teríamos que colocar um Box vazio 
             aqui na direita com a mesma largura do Logo para "equilibrar a balança". 
             Mas só com mx="auto" já fica 99% perfeito e bem mais simples.
          */}
        </Flex>
      </Box>

      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;