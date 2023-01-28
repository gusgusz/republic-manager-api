# tasks_manager_api

tasks_maneger_api no momento funciona como uma todo_list: futuramente devera ser possivel fazer o mesmo mas com o compartilhamento de uma mesma sala por diferentes usuários
---

# começando:

1- npm install 

2- configure o documento .env colocando as variaveis

PORT=4000
DATABASE_URL=postgres://iapvcqgg:bcdKqtytzeotUBLvvCtumJmT4ug3EwtZ@salt.db.elephantsql.com/iapvcqgg

3-caso não queira fazer o cadastro em sign-up
e ja quiser pegar os exemplos que coloquei:
gus@gmail.com //email

123456//senha

4- no prompt coloque "npx nodemon src/index.ts"

5- Quanto as rotas:

#


post : localhost:4000/sign-up
---


Rota para cadastrar

{
  "name": "Gustavo",
  "email": "gus@gmail.com",
  "password": "123456"
}

#

post : localhost:4000/sign-in
---


Rota para Login, onde você vai precisar o token para todas as outras rotas


{
  "email": "gus@gmail.com",
  "password": "123456"
}

#

Todas as rotas com excessao de sign-in e sign up deve ser autorizadas com um Bearer token
---

# 


post : localhost:4000/room
---

Rota para criar uma sala

{
  "nameRoom" : "O que estudar",
  "isPrivate": false
}

#

get : localhost:4000/room
---

Rota para retornar todas as salas disponiveis

#

delete : localhost:4000/room/:roomId
---

Rota para deletar a sala



#
post : localhost:4000/room/:roomId
---

Rota para criar uma tarefa

{
  "nameTask": "Fazer comida", 
  "email" : "gus@gmail.com",
  "dueDate": "2023/02/25"
}

#

get : localhost:4000/room/:roomId
---

Rota para pegar todas as tarefas contidas na sala

#

put : localhost:4000/room/:roomId/:taskid
---

Rota para editar alguma tarefa

{
  "nameTask": "Fazer comida", 
  "email" : "gus@gmail.com",
  "dueDate": "2023/02/25"
  "isDone": true
}

#

put : localhost:4000/room/1/1/done
---

Rota para alterar apenas o "isDone"

#


delete : localhost:4000/room/:roomId/:taskid
---

rota para apagar a task

#



