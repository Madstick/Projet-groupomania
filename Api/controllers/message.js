const conn = require('../sqlConfig')
const jwt = require('jsonwebtoken')
const config = require('../config/authconfig')
const fs = require('fs')

try {
    exports.createMessage = (req, res, next) => {
        // TODO req.body.message n'existe pas en l'état.
        // const message = req.body.message;
        // req.body = [
        //     idUSERS: '2',
        //     title: 'title',
        //     content: 'content',
        //     attachment: 'filename ?',
        //     message_parent: 'null',
        //     username: 'histe'
        //]
        // Du coup la clé message n'existe pas.
        // Soit tu transforme ton formData côté view, soit tu gère la concaténation des champs ici.

        let message = {
            idUSERS: parseInt(req.body.idUSERS),
            title: req.body.title,
            content: req.body.content,
            attachment: req.file.filename,
            created_at: new Date(),
            message_parent:
                req.body.message_parent !== 'null'
                    ? parseInt(req.body.message_parent)
                    : null,
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
            // console.log(results)
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
    // console.log(req.params.id)
    conn.query("SELECT messages.*, COUNT(likes.idUSERS) AS 'likes', COUNT(myLikes.idUSERS) AS 'myLikes', DATE_FORMAT(created_at,\"%d/%m/%Y %H:%i:%s\") AS created_at_formated FROM messages LEFT JOIN likes ON messages.idMESSAGES = likes.idMESSAGES LEFT JOIN likes myLikes ON messages.idMESSAGES = myLikes.idMESSAGES AND myLikes.idUSERS= ? WHERE messages.idMESSAGES= ? GROUP BY messages.idMESSAGES ORDER BY created_at DESC", 
        [userId,idMessage], function (
        error,
        results,
        fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        // console.log(results)
        return res.status(201).json({
            message: 'Le message a bien été vu',
            results
        })
    })
}

exports.replyMessage = (req, res, next) => {
    const message = req.body
    conn.query('INSERT INTO messages SET ?', message, function (
        error,
        results,
        fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({message: 'Votre réponse a bien été postée !'})
    })
}

exports.getAllMessages = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    const userId = decodedToken.userId
    conn.query(
        "SELECT messages.*, COUNT(likes.idUSERS) AS 'likes', COUNT(myLikes.idUSERS) AS 'myLikes', DATE_FORMAT(created_at,\"%d/%m/%Y %H:%i:%s\") AS created_at_formated FROM messages LEFT JOIN likes ON messages.idMESSAGES = likes.idMESSAGES LEFT JOIN likes myLikes ON messages.idMESSAGES = myLikes.idMESSAGES AND myLikes.idUSERS= ? GROUP BY messages.idMESSAGES ORDER BY created_at DESC",
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
            const filename = results[0].attachment
            fs.unlinkSync(`images/${filename}`)
            const updatedMessage = req.body
            conn.query(
                'UPDATE messages SET ? WHERE idMESSAGES=?',
                [updatedMessage, req.params.id],
                function (error, results, fields) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                    return res
                        .status(200)
                        .json({message: 'Votre message a bien été modifié !'})
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
            fs.unlinkSync(`images/${filename}`)
            conn.query(
                `DELETE FROM messages WHERE idMESSAGES=${req.params.id}`,
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
    const like = req.body
    conn.query('INSERT INTO likes SET ?', like, function (
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
        `DELETE FROM likes WHERE idMESSAGES=${req.params.id} && idUSERS=${userId}`,
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
