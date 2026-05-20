const errHandler = require('./errHandler');
const wrapRoutes = (routes)=>{
    const wrapper = {};
    for(const key in routes){
        wrapper[key] = errHandler(routes[key]);
    }
    return wrapper;
}
module.exports = wrapRoutes;