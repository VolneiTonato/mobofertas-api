# MOBOFERTAS API

Este projeto é a comunicação com o mobofertas e o mobofertas-admin. Servirá basicamente para o CRUD.

Sistema desenvolvido em javascript es6, nodejs, express, mongodb e redis.

# Serviços adicionais
Busca por NFC-e com a url do qrcode, transformação do html em dados, e após salva os itens no banco de dados.

Autenticação com jwt, e refresh de token com um tempo determinado para o token vencer, controlando isso com redis.



## APIs

O site mobofertas irá utilizar a api de consulta e a de imagens. 

EX:

localhost:5000/api/estabelecimentos/list

Para Imagens será feito uma busca pelo servidor static.

EX: localhost:7000/estabelecimentos/[logo, mapa, produtos, tabloides]


Já para o servidor localhost:8000, será a parte administrativa do mobofertas-admin

Terá login com jwt e todas as requisições deverão ter um token para fazer alguma operação ou até mesmo para navegar entre telas.