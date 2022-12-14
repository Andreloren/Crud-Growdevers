import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { v4 } from 'uuid'
import { getFips } from 'crypto'

const server = express()

server.use(cors())

server.use(express.json())

interface IGrowdever {
    id: string,
    nome: string,
    curso: string,
    skills?: string[]
}

interface RespostaPadrao {
    sucesso: boolean,
    mensagem: string,
    dados: any
}

class Growdever implements IGrowdever {
    id: string
    constructor(public nome: string, public curso: string, public skills?: string[]) {
        this.id = v4();
        this.nome = nome;
        this.curso = curso;
        this.skills = skills || [];
    }
}

let Growdevers: Growdever[] = []

// ============== LISTAR GROWDEVERS
server.get('/growdevers', (req: Request, res: Response) => {
    if(Growdevers.length === 0) return res.status(404).json({
        sucesso: false,
        mensagem: "Não foi localizado nenhum growdever",
        dados: null
    } as RespostaPadrao)

    res.status(200).json({
        sucesso: true,
        mensagem: "Growdevers localizados",
        dados: Growdevers
    })
})


// ============== NOVO GROWDEVER
server.post('/growdevers', (req: Request, res: Response) => {
    const { nome, curso, skills } = req.body

    if(!nome) return res.status(400).json({
        sucesso: false,
        mensagem: "Falta nome",
        dados: null
    } as RespostaPadrao)

    if(!curso) return res.status(400).json({
        sucesso: false,
        mensagem: "Falta curso",
        dados: null
    } as RespostaPadrao)

    const novoGrowdever = new Growdever(nome, curso, skills)

    Growdevers.push(novoGrowdever)

    console.log(Growdevers)

    res.status(201).json({
        sucesso: true,
        mensagem: "Growdever Criado",
        dados: novoGrowdever
    })
})


// ============== ALTERAR GROWDEVER
server.put('/growdevers/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { nome, curso } = req.body

    const indice = Growdevers.findIndex((gd) => gd.id === id)

    if(indice === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Growdever não localizado",
        dados: null
    } as RespostaPadrao)

    if(nome) Growdevers[indice].nome = nome.toString();
    if(curso) Growdevers[indice].curso = curso.toString();

    if(!curso && !nome) return res.status(404).json({
        sucesso: false,
        mensagem: "Não foram informadas alterações",
        dados: null
    } as RespostaPadrao)

    return res.status(200).json({
        sucesso: true,
        mensagem: "Growdever alterado",
        dados: Growdevers[indice]
    } as RespostaPadrao)

})


// ============== CRIAR SKILL
server.post('/growdevers/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { skill } = req.body

    const indice = Growdevers.findIndex((gd) => gd.id === id)

    if(indice === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Growdever não localizado",
        dados: null
    } as RespostaPadrao)

    if(!skill) return res.status(404).json({
        sucesso: false,
        mensagem: "Skill não informada",
        dados: null
    } as RespostaPadrao)

    Growdevers[indice].skills?.push(skill.toString())

    res.status(201).json({
        sucesso: true,
        mensagem: "Skill Criada",
        dados: Growdevers[indice]
    })
})

// ============== DELETAR SKILL
server.delete('/growdevers/:id/:skill', (req: Request, res: Response) => {
    const { id, skill } = req.params

    const indice = Growdevers.findIndex((gd) => gd.id === id)

    if(indice === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Growdever não localizado",
        dados: null
    } as RespostaPadrao)

    if(!skill) return res.status(404).json({
        sucesso: false,
        mensagem: "Não foi informada Skill a ser apagada",
        dados: null
    } as RespostaPadrao)

    const posicaoSkill = Growdevers[indice].skills!.findIndex(sk => sk.toLowerCase() === skill.toLowerCase())

    if(posicaoSkill === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Skill informada não foi localizada",
        dados: null
    } as RespostaPadrao)

    Growdevers[indice].skills!.splice(posicaoSkill, 1)

    res.status(200).json({
        sucesso: true,
        mensagem: "Skill Removida",
        dados: Growdevers[indice]
    } as RespostaPadrao)
})


server.delete('/growdevers/:id', (req: Request, res: Response) => {
    const { id } = req.params

    const indice = Growdevers.findIndex((gd) => gd.id === id)

    if(indice === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Growdever não localizado",
        dados: null
    } as RespostaPadrao)

    const gdExcluido = Growdevers[indice]

    Growdevers.splice(indice, 1)

    res.status(200).json({
        sucesso: true,
        mensagem: "Growdever Excluído",
        dados: gdExcluido
    } as RespostaPadrao)

})


server.listen(3000, () => console.log('Rodando'))