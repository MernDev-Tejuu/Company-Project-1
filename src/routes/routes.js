
const app = require('../index')
//Controller below 👇🏻
const author_Logic = require('../controller/author_Logic')
const blog_Logic = require('../controller/blog_Logic')

//Middleware/auth 
const auth = require('../middleware/auth')

//------------------------------------------------------------------------

//Routes Endpoint: localhost:4000/authors ⤵️

app.post('/author',author_Logic.create_Author)

app.get('/getAuthor',auth.authentication ,author_Logic.getAuthor)

//Routes Endpoint: localhost:4000/blog ⤵️

app.post('/blog',auth.authentication1,blog_Logic.create_Blog)

app.get('/getblogs',blog_Logic.get_All_Blogs)

app.put('/blogs/:blogId',auth.authentication2,blog_Logic.update_Blog)

app.delete('/blogs/:blogId',auth.authentication2,blog_Logic.delete_Blog_Params)

app.delete('/blogs',auth.authentication2,blog_Logic.delete_Blogs_Query)
