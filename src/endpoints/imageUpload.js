const Responses = require('../common/responses')
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']
exports.handler = async event =>{
    try {
        const body = JSON.parse(event.body)

        if(!body || !body.image || !body.mime) return Responses._400({message: 'Incorrect body on request'})

        if(!allowedMimes.includes(body.mime)) return Responses._400({message: 'Incorrect mime type'})

        return event

    } catch (error) {
        return Responses._404({message: JSON.stringify(error,null,2)})
    }
}