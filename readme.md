## Portal de Notícias - API Documentation

#### Esse é uma api, para gerenciar um portal de notícias.
#
## Technologies:

// Back-end

- NodeJS
- Express

// Database
- MongoDB

// Libs
 - JWT
 - BCrypt
 - BodyParser
 - Cors
 - DotEnv
 - Mongoose

#

### Rotas da aplicação
#
#### **default_api_url**: https://api-portaldenoticias.herokuapp.com/


* Authentication Routes

- [POST] /auth/signup - Registra o usuário, e retorna um JSON, caso obtiver sucesso

- [POST] /auth/login - Autentica o usuário baseado no email e senha , retorna um **JWT**


* CRUD Notícias

- [GET] / - Retorna um JSON contendo todas as notícias 

- [GET] /:id - Retorna uma notícia baseado no ID

// Require JWT validation

- [POST] /cadnoticia - Cadastra uma notícia

- [PATCH] /updatenoticias/:id - Atualiza uma notícia baseado no id

- [DELETE] /deletenoticia/:id - Deleta uma notícia baseado no ID




