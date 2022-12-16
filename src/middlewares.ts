import express, { NextFunction, Request, Response } from "express";

import { Growdevers, RespostaPadrao, } from ".";

// ======== verificação para o GET
export function verificaSeHaGrowdevers(req: Request, res: Response, next: NextFunction) {
  if (Growdevers.length === 0)
    return res.status(404).json({
      sucesso: false,
      mensagem: "Não foi localizado nenhum growdever",
      dados: null,
    } as RespostaPadrao);
    next()
}

// ======== retorna indice
export function retornaIndiceDoGrowdever(req: Request, res: Response, next: NextFunction){
    const { id } = req.params
    const { nome, curso, skill } = req.body
    const indice = Growdevers.findIndex((gd) => gd.id === id)

    if(indice === -1) return res.status(404).json({
        sucesso: false,
        mensagem: "Growdever não localizado",
        dados: null
    } as RespostaPadrao)

    req.body = { nome, curso, indice, skill }
    next()
}