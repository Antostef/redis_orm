var Redis = require('ioredis')
var redis = Redis()

/* Users : liste */
module.exports = {
  
  get: async (user_id) => 
  {
    return await redis.hgetall('user:' + user_id)
  },

  count: async () => 
  {
    return (await redis.smembers('users')).length
  },

  getAll: async (limit, offset) => 
  {
    let users = []
    let members = await redis.smembers('users')

    for (let i = 0; i < members.length; i++) {
      users.push(await redis.hgetall('user:' + members[i]))
    }

    return users
  },

  insert: async (params) => 
  {
    let id = 1
    let members = await redis.smembers('users')
    
    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        if (members[i] > id) {
          id = members[i]
        }
      }
      id = parseInt(id) + 1
    }
    
    await redis.sadd('users', id)

    return await redis.hset('user:' + id, 'rowid', id, 'pseudo', params.pseudo, 'firstname', params.firstname, 'lastname', params.lastname, 'email', params.email, 'password', params.password)
  },

  update: async (user_id, params) => 
  {
    return await redis.hmset('user:' + user_id, 'pseudo', params.pseudo, 'firstname', params.firstname, 'lastname', params.lastname, 'email', params.email, 'password', params.password)
  },

  remove: async (user_id) => 
  {
    await redis.srem('users', user_id)

    return await redis.del('user:' + user_id)
  }
}