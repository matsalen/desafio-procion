-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" REAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
