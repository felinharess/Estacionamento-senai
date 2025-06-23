import jwt from 'jsonwebtoken';

export const autenticar = (req, res, next) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({mensagem: 'Token nao fornecido'});

    try{
        const decoded = jwt.verify(token, process.env.SEGREDO_JWT);
        req.usuarioId = decoded.id;
        next();
    }catch(erro){
        res.status(401).send({mensagem: 'token inválido'})
    }
}