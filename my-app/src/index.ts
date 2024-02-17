import { Hono } from 'hono'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { PrismaClient } from '@prisma/client/edge'
import Authentication from './Middleware'

const app = new Hono()
const prisma = new PrismaClient()
const secretkey = "BACKEND_12@jo"

app.post('/user/signin', async(c)=>{
  const body = await c.req.json();
  const email = body['email'];
  const password = body['password']; 
  
  const userexist = await prisma.user.findFirst({
  where:{
     email,
     password
        }
    })

    const payload = {
       email
    }

    const token = await jwt.sign({email},secretkey,{});
    console.log(token);
    
    if(userexist!=null){
         return c.json({
          message:"successful",
          token:token
         });
    }
    else{
       return c.text("email or password not correct")
    }
})  

app.post('/user/signup', async(c) => {
  const body = await c.req.json();
  const username = body['username'];
  const email = body['email'];
  const password = body['password'];
  //const tittle = body['title'];
  //const blog = body['blog']

 const userexist = await prisma.user.findFirst({
    where:{
       email
    }
  }) 
  
  console.log(userexist)

  if(userexist==null){
      const user = await prisma.user.create({
        data:{
          username,
          email,
          password
        }
      })
      
      return c.json({
        message:"sigup sucessfully",
      })
  }
  else{
    return c.text("user exist");
  }
  
})

app.get("/posts",async(c)=>{
    const blogarr = await prisma.blog.findMany({
      select:{tittle:true,blog:true}});

    return c.json({message:"hi",Array:blogarr})
}) 


app.post("/posts",Authentication,async(c)=>{
    const body = await c.req.json();
    const userid = c.get('id');
    //console.log(body[])
    const postblog = await prisma.blog.create({
      data:{
         userid,
         tittle:body['tittle'],
         blog:body['content']
      }
    })
     console.log(postblog); 
     return c.json({message:"blog added sucessfully"});
})

app.get('/posts/:id',async(c)=>{
     const id  = parseInt(c.req.param('id'));
     console.log(id);
     const obj = await prisma.blog.findFirst({
        where:{
           id
        }
     })
     console.log(obj);
     return c.json({message:"okk"})
})

app.put("/posts/:id",Authentication,async(c)=>{
      const body = await c.req.json();
      const tittle = body['tittle']
      const content = body['content']
      const id = parseInt(c.req.param('id'));
      const update = await prisma.blog.update({
        where:{
          id
        },
        data:{
           tittle,
           blog:content
        }
      })
      return c.text("put");
})

app.delete("/posts/:id",Authentication,async(c)=>{
     const id = parseInt(c.req.param('id'));
     const deleteblog = await prisma.blog.delete({
      where:{
        id
      }
     })
     console.log(deleteblog);
     return c.json({message:"delete blog sucessfully"})
})

export default app

