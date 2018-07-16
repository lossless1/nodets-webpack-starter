import * as nconf from 'nconf';
nconf.argv().env().file({
    file: './config/config.json'
})
export { nconf };