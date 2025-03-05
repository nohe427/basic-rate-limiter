import { error } from 'console';
import Valkey from 'iovalkey';

const valkey = new Valkey(6379);

const incrementKey = async (key: string) => {
    console.log('incrementing', key);
    // use incrby to increment by number other than 1
    valkey.incr(key, (err, reply) => {
        if (err) {
            throw new Error(err.message);
        }
        console.log(reply);
    });
    valkey.get(key, (err, reply) => {
        console.log(reply);
    });
}

const rateLimit = async (key: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {    
        await valkey.get(key, (err, reply) => {
            if (err) {
                throw new Error(err.message);
                reject(err);
            }
            if (reply == null) {
                incrementKey(key);
                resolve(true);
                return;
            }
            if (parseInt(reply!) >= 5) {
                resolve(false);
                return;
            }
            incrementKey(key);
            resolve(true);
        });
    });

}

const main = async () => {
    const userId = "abcd";
    const minute = new Date().getMinutes();
    const key = `${userId}:${minute}`;
    valkey.get(key, (err, reply) => {
        console.log(err);
        console.log(reply);
        if (reply == null) {
            console.log('new key');
            valkey.expire(key, 60, (err, reply) => {
                console.log('expired');
            });
            return;
        }
  });
  setTimeout(async () => {
    const r = await rateLimit(key);
    console.log(r);
  }, 1000);
  setTimeout(async () => {
    const r = await rateLimit(key);
    console.log(r);
    }, 2000);
    setTimeout(async () => {
        const r = await rateLimit(key);
    console.log(r);
    }, 3000);
    setTimeout(async () => {
        const r = await rateLimit(key);
    console.log(r);
    }, 4000);
    setTimeout(async () => {
        const r = await rateLimit(key);
    console.log(r);
    }, 5000);
    setTimeout(async () => {
        const r = await rateLimit(key);
    console.log(r);
    }, 6000);
    setTimeout(async () => {
        const r = await rateLimit(key);
    console.log(r);
    }, 7000);
}

main();