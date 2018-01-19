import * as nconf from 'nconf';

nconf.argv().env().file({
    file: './config.json'
})
export { nconf };