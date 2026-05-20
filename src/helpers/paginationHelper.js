const pagination =(page,limit)=> {
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 15;
    const offset = (page - 1)*limit;
    return{
        page:currentPage,
        limit:perPage,
        offset:offset
    }
}
module.exports = {pagination};

/*const page = req.query.page || 1;//getting page value from query or else default value 1
const limit = req.query.limit || 15;//getting limit value from query or else default value is 15

if(page<1 || limit<1){//if page or limit values are less than 1 throw error
    return res.status(406).json({message:"page and limit should'nt be less than 1"})
}
const offset = (page - 1)*limit;*///offset formula (no.of records needs to be excluded)