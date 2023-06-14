const {createClient} = require('redis');


class HandleRefresh {
    constructor(){
        this.client = createClient();
        this.redisKey = 'refreshTokens';
        this.client.connect();
    }

    async saveRefreshToken(token){
        const redisKey = this.redisKey;
        const client = this.client;
        let refreshTokens = []

        if (token === null) {
            return
        }
        if (await client.get(redisKey) == null) {
            refreshTokens.push(token)
            refreshTokens = JSON.stringify(refreshTokens)
            client.set(redisKey, refreshTokens)
            return;
        }
        refreshTokens = await client.get(redisKey);
        refreshTokens = JSON.parse(refreshTokens);
        refreshTokens.push(token);
        await client.set(redisKey, JSON.stringify(refreshTokens));
    }

    async deleteRefreshToken(token) {
        const redisKey = this.redisKey;
        const client = this.client;

        if (token === null) {
            return;
        }
        let refreshTokens = await client.get(redisKey);
        refreshTokens = JSON.parse(refreshTokens);
        refreshTokens = refreshTokens.filter(refreshToken => refreshToken !== token);
        await client.set(redisKey, JSON.stringify(refreshTokens));
    }

    async  checkRefreshToken(token) {
        const redisKey = this.redisKey;
        const client = this.client;
        
        if (token === null) {
            return;
        }
        let refreshTokens = await client.get(redisKey);
        refreshTokens = JSON.parse(refreshTokens);
        if (refreshTokens.includes(token)) return true;
        return false;
    }
}
const refreshHandler = new HandleRefresh()  
module.exports = refreshHandler
