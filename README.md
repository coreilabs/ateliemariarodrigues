# Ateliê Maria Rodrigues

Site estático em português com portfólio de 37 fotografias, filtros, ampliação com swipe e teclado, formulário de orçamento pelo WhatsApp e PWA.

## Executar localmente

Na pasta do projeto, execute `python -m http.server 8080` e abra `http://localhost:8080`. Também pode ser servido pelo Laragon. O service worker exige localhost ou HTTPS; abrir index.html diretamente não ativa o PWA.

## Publicar

Envie index.html, styles.css, app.js, sw.js, manifest.webmanifest, robots.txt, sitemap.xml, os PNG da raiz e as pastas assets e fotos para a raiz pública do domínio https://ateliêmariarodrigues.com.br. Configure DNS e HTTPS na hospedagem. Não publique a pasta output, que contém somente verificações locais. Nenhum backend ou banco de dados é necessário.

Confirme que a hospedagem serve manifest.webmanifest como application/manifest+json, sw.js como JavaScript e não mantém cache prolongado de sw.js (recomendado Cache-Control: no-cache). Ao atualizar o site, incremente CACHE em sw.js. Uma nova versão entra em uso depois que as abas da versão anterior forem fechadas.

O domínio contém ê; utilize a representação IDN/punycode equivalente caso o painel da hospedagem exija. Os endereços canônico, Open Graph, sitemap e referências de fotos já usam o domínio de produção informado.

## Conteúdo

O catálogo está no início de app.js. Cada entrada associa o identificador da foto, título descritivo e categoria. As fotos originais foram preservadas em fotos; as versões WebP usadas pelo site estão em assets/fotos, com redução total de 38,3% no tamanho dos arquivos. As imagens da galeria carregam sob demanda. As fontes têm alternativas locais se o Google Fonts estiver indisponível.

Contato: 556292300002. O formulário apenas prepara uma mensagem; o visitante confirma o envio no WhatsApp. Não há armazenamento de dados do formulário, analytics, cookies de rastreamento ou envio automático. Data desejada não significa prazo confirmado.

O modo offline guarda a estrutura principal e fotos já visitadas. Fotos ainda não abertas e WhatsApp precisam de conexão. A instalação depende do suporte do navegador; no iOS, use Safari → Compartilhar → Adicionar à Tela de Início.
