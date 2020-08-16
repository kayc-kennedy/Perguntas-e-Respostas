//Requisições
const express = require("express");
const { render } = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
//Executando o arquivo peguntas.js, cria a tabela de perguntas
const pergunta = require("./database/pergunta")
const resposta = require("./database/resposta");

//Estabelecendo conexão - Promise 
connection
    .authenticate()
    .then(()=>{ //Se a conexão tiver sucesso
        console.log("Conexão homologada com o bando de dados");
    })
    .catch((error)=>{//Se ocorrer um erro
        console.log(error);
    })


app.listen(3000, () =>{
    console.log("Server is Running");
});

//Faz a decodificação dos dados, para que seja possível utiliza-los em JavaScript
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //Possibilita utilizar dados enviador por Json


//indico o motor de visão EJS para o express
app.set('view engine', 'ejs');


// Indico para o express que usarei arquivos estáticos, como css, html, js, png
app.use(express.static('public'));


//Rotas
app.get("/", (req, res)=>{
    //Busca as perguntas no banco
    pergunta.findAll({ raw: true, order:[['id', 'desc'] //Ordenando os valores || desc = decrecente, asc = crecente  
        ]}).then(perguntas =>{
            res.render("index",{
            pergunta: perguntas 
        });


    });

});

app.get("/perguntar", (req, res)=>{
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
  
    pergunta.create({//inserindo dados na tabela
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect('/');
    });

})

app.get('/pergunta/:id', (req, res) =>{
    let id = req.params.id;

    pergunta.findOne({ //Buscando um Id na tabela "perguntas"
        where: {id: id}
    }).then(pergunta =>{// Se achar o ID, esse bloco será executado
        if(pergunta != undefined){
            
            resposta.findAll({ // Buscando as respostas de cada pergunta e ordenando
                where: {perguntaId: pergunta.id}, 
                order: [
                    ['id', 'desc']
                ]

            }).then(respostas => {
                    res.render('pergunta',{//Pego as perguntas de cada resposta e apresento as duas juntas na pagina principal
                        pergunta:pergunta,
                        respostas: respostas
                    });
                });
        }else{
            res.redirect("/")
        }
    })
});

app.post('/responder', (req, res) =>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    resposta.create({// Inserindo dados na tabela respostas
        corpo: corpo,
        perguntaId:perguntaId
    }).then( () =>{
        res.redirect('/pergunta/' + perguntaId);
    }); 
});