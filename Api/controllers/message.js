const conn = require('../sqlConfig')
const jwt = require('jsonwebtoken')
const config = require('../config/authconfig')
const fs = require('fs')

try {
    exports.createMessage = (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, config.token)
        const userId = decodedToken.userId
        let message = {
            idUSERS: userId,
            title: req.body.title,
            content: req.body.content,
            attachment: req.file 
                ? req.file.filename // ? = if  ( opération ternaire )
                :null, // : = else
            created_at: new Date(),
            message_parent:
                req.body.message_parent !== null && req.body.message_parent !== 'null'
                    ? parseInt(req.body.message_parent)
                    :null,
            username: req.body.username,
        }
        conn.query('INSERT INTO messages SET ?', message, function (
            error,
            results,
            fields
        ) {
            if (error) {
                console.log(error);
                return res.status(400).json(error)
            }
            return res.status(201).json({
                message: 'Votre message a bien été posté !',
                id:results.insertId
            })
        })
    }

} catch (error) {
    console.log(error)
}

exports.getMessage = (req, res, next) => {
    const idMessage = req.params.id
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    conn.query("SELECT messages.*, COUNT(likes.idUSERS) AS 'likes', COUNT(myLikes.idUSERS) AS 'myLikes' FROM messages LEFT JOIN likes ON messages.idMESSAGES = likes.idMESSAGES LEFT JOIN likes myLikes ON messages.idMESSAGES = myLikes.idMESSAGES AND myLikes.idUSERS= ? AND myLikes.idMESSAGES= ? WHERE messages.idMESSAGES= ? GROUP BY messages.idMESSAGES ORDER BY messages.created_at DESC", 
        [userId,idMessage,idMessage], function (  // esprintf avec les ? de la requête pour éviter la concaténation 
        error,
        results,
        fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({
            message: 'Le message a bien été vu',
            results
        })
    })
}

exports.getComment = (req, res, next) => {
    const idMessage = req.params.id
    conn.query("SELECT messages.* FROM messages WHERE messages.message_parent= ? ORDER BY created_at DESC", 
        [idMessage], function (
        error,
        results,
        fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({
            results
        })
    })
}

exports.getAllMessages = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    conn.query(
        "SELECT messages.*, COUNT(likes.idUSERS) AS 'likes', COUNT(myLikes.idUSERS) AS 'myLikes' FROM messages LEFT JOIN likes ON messages.idMESSAGES = likes.idMESSAGES LEFT JOIN likes myLikes ON messages.idMESSAGES = myLikes.idMESSAGES AND myLikes.idUSERS= ? WHERE message_parent IS NULL GROUP BY messages.idMESSAGES ORDER BY created_at DESC",
        [userId],
        function (error, results, fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res.status(200).json({results})
        }
    )
}

exports.modifyMessage = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    const role = decodedToken.role
    conn.query(
        'SELECT * FROM messages WHERE idMESSAGES=?',
        req.params.id,
        function (error, results, fields) {
            if (error) {
                return res.status(400).json(error)
            }
            const messageId = results[0].idUSERS
            if (userId !== messageId && role !== 'admin') {
                return res.status(401).json({message: 'Accès non autorisé'})
            }
            let updatedMessage = req.body
            if (req.file){
                updatedMessage.attachment = req.file 
                ? req.file.filename
                :null
                const attachment = results[0].attachment
                if(attachment) {
                    fs.unlinkSync(`images/${attachment}`)
                }
            }
            console.log(updatedMessage)
            updatedMessage.message_parent =
            req.body.message_parent !== null && req.body.message_parent !== 'null'
                ? parseInt(req.body.message_parent)
                :null  
            conn.query(
                'UPDATE messages SET ? WHERE idMESSAGES=?',
                [updatedMessage, req.params.id],
                function (error, results, fields) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                    return res
                        .status(200)
                        .json({
                            message: 'Votre message a bien été modifié !',
                            id:req.params.id
                        })
                }
            )
        }
    )
}

exports.deleteMessage = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    const role = decodedToken.role
    conn.query(
        'SELECT * FROM messages WHERE idMESSAGES=?',
        req.params.id,
        function (error, results, fields) {
            if (error) {
                return res.status(400).json(error)
            }
            const messageIdUser = results[0].idUSERS
            if (userId !== messageIdUser && role !== 'admin') {
                return res.status(401).json({message: 'Accès non autorisé'})
            }
            const filename = results[0].attachment
            if(filename){
                fs.unlinkSync(`images/${filename}`)
            } 
            conn.query(
                `DELETE FROM messages WHERE idMESSAGES=?`,
                req.params.id,
                function (error, results, fields) {
                    if (error) {
                        return res.status(400).json(error)
                    }         
                    return res
                        .status(200)
                        .json({message: 'Votre message a bien été supprimé !'})
                }
            )
        }
    )
}

exports.addLike = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    conn.query('INSERT INTO likes VALUES (?,?) ', [userId,req.params.id], function (
        error,
        results,
        fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({message: 'Votre like a bien été ajouté !'})
    })
}

exports.removeLike = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    conn.query(
        `DELETE FROM likes WHERE idMESSAGES=${req.params.id} AND idUSERS=${userId}`,
        function (error, results, fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res
                .status(200)
                .json({message: 'Votre like a bien été supprimé !'})
        }
    )
}
