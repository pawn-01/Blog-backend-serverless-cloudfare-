import jwt from '@tsndr/cloudflare-worker-jwt'
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
const secretkey = "BACKEND_12@jo"

async function Authentication(c:any,next:any){
    const authorize = c.req.header("Authorization");     
      
    if(authorize && authorize.startsWith('Bearer')){
      const token = authorize.split(" ")[1];
      console.log(token)
      const decode_token =  await jwt.verify(token,secretkey);
      if(decode_token){
        const {header, payload } = jwt.decode(token);
        const email = payload.email;
        const user = await prisma.user.findFirst({
          where:{
              email
          },
          select:{
            id:true
          }
        })
        c.set('id',user?.id);
        //console.log(c.get('id'));
        await next();
      }
      else return c.text("Authentication error");
    } 
    else{
      return c.text("Authentication error");
    }
}

export default Authentication;