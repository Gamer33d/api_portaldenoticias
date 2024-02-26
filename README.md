### Entidades
- [x] User
- [x] Noticia

### UseCases
- [x] CreateUser
- [] SignIn
- [] userCrud
- [] createNewsCrud








### Rotas da aplicação
#
#### **default_api_url**: https://api-portaldenoticias.herokuapp.com/


* Authentication Routes

- [POST] /auth/create - Registra o usuário, e retorna um JSON, caso obtiver sucesso

- [POST] /auth/login - Autentica o usuário baseado no email e senha , retorna um **JWT**


* CRUD Notícias

- [GET] / - Retorna um JSON contendo todas as notícias 

- [GET] /:id - Retorna uma notícia baseado no ID

// Require JWT validation

- [POST] /cadnoticia - Cadastra uma notícia

- [PATCH] /updatenoticias/:id - Atualiza uma notícia baseado no id

- [DELETE] /deletenoticia/:id - Deleta uma notícia baseado no ID