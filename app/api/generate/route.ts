import {timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import catalogue from '@/data/catalogue.json';
import snapshot from '@/data/figma-snapshot.json';
import {specToSvg} from '@/lib/generator';
import {generationStatus,generateIconSpec,generationError} from '@/lib/direct-ai';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function GET(){return Response.json(generationStatus(process.env),{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:Request){
 const state=generationStatus(process.env);
 if(!state.enabled)return Response.json({error:'Configure an OpenAI or Gemini API key and a studio access code to enable AI generation. You can still compose and download a variant.'},{status:503});
 const expected=process.env.ICON_STUDIO_ACCESS_CODE!.trim();const supplied=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';
 const a=Buffer.from(expected),b=Buffer.from(supplied);if(a.length!==b.length||!timingSafeEqual(a,b))return Response.json({error:'Enter a valid studio access code.'},{status:401});
 if(Number(req.headers.get('content-length')||0)>4096)return Response.json({error:'Request is too large.'},{status:413});
 const text=await req.text();if(text.length>4096)return Response.json({error:'Request is too large.'},{status:413});
 let input;try{input=z.object({prompt:z.string().trim().min(6).max(300),provider:z.enum(['openai','gemini']).default(state.defaultProvider)}).strict().parse(JSON.parse(text));}catch{return Response.json({error:'Choose OpenAI or Gemini and describe your icon in 6–300 characters.'},{status:400});}
 if(!state.providers.find(p=>p.id===input.provider)?.available)return Response.json({error:'The selected AI provider is not configured. Choose an available provider or ask your administrator to finish setup.'},{status:503});
 try{
  const words=input.prompt.toLowerCase().match(/[a-z]{3,}/g)||[];
  const references=catalogue.icons.filter(i=>i.updated&&i.recolorable).map(icon=>({icon,score:words.filter(w=>icon.aliases.some(a=>a.name.toLowerCase().includes(w))).length})).sort((a,b)=>b.score-a.score).slice(0,3);
  const examples=references.map(({icon})=>({name:icon.name,svg:snapshot.masters.find(m=>m.id===icon.masterId)?.svg||''}));
  const result=await generateIconSpec({...input,examples},process.env);
  return Response.json({label:result.spec.label,description:result.spec.description,svg:specToSvg(result.spec),provider:result.provider,model:result.model,status:'draft'},{headers:{'Cache-Control':'no-store'}});
 }catch(error){const failure=generationError(error);return Response.json({error:failure.error},{status:failure.status});}
}
