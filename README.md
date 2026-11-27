# Float32 para binário

Conversor de números decimais para a representação binária de 32 bits no
formato IEEE 754. Abra `index.html` no navegador, digite um número e pressione
**Transformar** ou **Enter**. O conversor funciona localmente e sem dependências.

O resultado contém, da esquerda para a direita, 1 bit de sinal, 8 de expoente e
23 de fração. Por exemplo, `1.5` gera `00111111110000000000000000000000`.
O navegador interpreta a entrada como um número JavaScript antes da conversão
para float32. A conversão preserva o sinal de zero, arredonda para o float32 mais
próximo com desempate para o par e representa estouro como infinito.

## Testes

Com Node.js 18 ou superior, execute `node --test` na raiz do projeto.
