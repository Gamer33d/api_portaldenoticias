### Entidades
- [x] User
- [x] News
- [x] Roles

### UseCases
- [x] userCrud
- [x] SignIn
- [x] newsCrud

### Add Database
- [] RolesRepository
- [] UsersRepository
- [] NewsRepository







### Rotas da aplicação
#
#### **default_api_url**: https://api-portaldenoticias.herokuapp.com/


* Authentication Routes

- [POST] /auth/login - Autentica o usuário baseado no email e senha , retorna um 
**JWT**

* CRUD Users



* CRUD Notícias

- [GET] / - Retorna um JSON contendo todas as notícias 

- [GET] /:id - Retorna uma notícia baseado no ID

// Require JWT validation

- [POST] /cadnoticia - Cadastra uma notícia

- [PATCH] /updatenoticias/:id - Atualiza uma notícia baseado no id

- [DELETE] /deletenoticia/:id - Deleta uma notícia baseado no ID