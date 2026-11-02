import {test} from 'node:test';
import assert from 'node:assert/strict';
import {APICallError} from 'ai';
import {generateIconSpec,generationStatus,generationError} from '../lib/direct-ai.ts';
import {specToSvg} from '../lib/generator.ts';
const password='test-studio-password';
const spec={label:'Vehicle alert',description:'A car with a warning marker',shapes:[{type:'path',d:'M3 10h13l-2-5H5l-2 5v7h9'},{type:'circle',cx:18,cy:18,r:3}]};
const openaiResponse=(value:unknown)=>({id:'resp_test',created_at:1,model:'gpt-6-sol',status:'completed',output:[{type:'message',role:'assistant',id:'msg_test',content:[{type:'output_text',text:JSON.stringify(value),annotations:[]}]}],usage:{input_tokens:50,output_tokens:100,total_tokens:150},incomplete_details:null});
const googleResponse=(value:unknown)=>({candidates:[{content:{role:'model',parts:[{text:JSON.stringify(value)}]},finishReason:'STOP',index:0}],usageMetadata:{promptTokenCount:50,candidatesTokenCount:100,totalTokenCount:150},modelVersion:'gemini-3.8-flash'});
const input={prompt:'A vehicle with an alert',examples:[{name:'Vehicle notification',svg:'<svg viewBox="0 0 24 24"><path d="M2 10h20"/></svg>'}]};
test('readiness requires a direct key and strong studio password without exposing secrets',()=>{
 assert.equal(generationStatus({AI_GATEWAY_API_KEY:'legacy-key',ICON_GENERATOR_MODEL:'legacy/model',ICON_STUDIO_ACCESS_CODE:password}).enabled,false);
 assert.equal(generationStatus({OPENAI_API_KEY:'test-secret',ICON_STUDIO_ACCESS_CODE:'short'}).enabled,false);
 const state=generationStatus({GEMINI_API_KEY:'test-secret',ICON_STUDIO_ACCESS_CODE:password,ICON_AI_PROVIDER:'openai'});assert.equal(state.enabled,true);assert.equal(state.defaultProvider,'gemini');assert.equal(state.providers[0].available,false);assert.doesNotMatch(JSON.stringify(state),/test-secret|test-studio-password/);
 assert.equal(generationStatus({GOOGLE_GENERATIVE_AI_API_KEY:'test-key',ICON_STUDIO_ACCESS_CODE:password}).providers[1].available,true);
});
test('OpenAI goes directly to Responses with a strict schema, theme references and no retry',async()=>{
 const calls:{url:string;headers:Headers;body:any}[]=[];
 const fetcher:typeof fetch=async(url,init)=>{calls.push({url:String(url),headers:new Headers(init?.headers),body:JSON.parse(String(init?.body))});return Response.json(openaiResponse(spec));};
 const result=await generateIconSpec({...input,provider:'openai'},{OPENAI_API_KEY:'test-openai-key',ICON_STUDIO_ACCESS_CODE:password},fetcher);
 assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.openai.com/v1/responses');assert.equal(calls[0].headers.get('authorization'),'Bearer test-openai-key');assert.equal(calls[0].body.model,'gpt-6-sol');assert.equal(calls[0].body.store,false);assert.equal(calls[0].body.text.format.type,'json_schema');assert.equal(calls[0].body.max_output_tokens,4096);assert.match(JSON.stringify(calls[0].body),/Vehicle notification/);assert.equal(result.provider,'openai');assert.match(specToSvg(result.spec),/stroke-width="1.8"/);
});
test('Gemini calls Google directly with its key and structured output',async()=>{
 const calls:{url:string;headers:Headers;body:any}[]=[];
 const fetcher:typeof fetch=async(url,init)=>{calls.push({url:String(url),headers:new Headers(init?.headers),body:JSON.parse(String(init?.body))});return Response.json(googleResponse(spec));};
 const result=await generateIconSpec({...input,provider:'gemini'},{GEMINI_API_KEY:'test-google-key',ICON_STUDIO_ACCESS_CODE:password},fetcher);
 assert.equal(calls.length,1);assert.equal(new URL(calls[0].url).hostname,'generativelanguage.googleapis.com');assert.match(calls[0].url,/gemini-3\.8-flash:generateContent/);assert.equal(calls[0].headers.get('x-goog-api-key'),'test-google-key');assert.match(JSON.stringify(calls[0].body),/application\/json/);assert.match(JSON.stringify(calls[0].body),/Vehicle notification/);assert.equal(result.provider,'gemini');assert.match(specToSvg(result.spec),/<svg/);
});
test('unconfigured provider never sends a network request',async()=>{let calls=0;const fetcher:typeof fetch=async()=>{calls++;throw Error('Unexpected request');};await assert.rejects(generateIconSpec({...input,provider:'gemini'},{OPENAI_API_KEY:'test-key',ICON_STUDIO_ACCESS_CODE:password},fetcher),/not configured/);assert.equal(calls,0);});
test('invalid generated geometry is rejected before rendering',async()=>{const bad={...spec,shapes:[{type:'path',d:'M1 1" onload="alert(1)'}]};const fetcher:typeof fetch=async()=>Response.json(openaiResponse(bad));await assert.rejects(generateIconSpec({...input,provider:'openai'},{OPENAI_API_KEY:'test-key',ICON_STUDIO_ACCESS_CODE:password},fetcher));});
test('provider errors stay actionable and do not disclose upstream secrets',async()=>{
 let requests=0;const fetcher:typeof fetch=async()=>{requests++;return Response.json({error:{message:'test-secret-do-not-expose',type:'insufficient_quota',code:'insufficient_quota'}},{status:429});};
 try{await generateIconSpec({...input,provider:'openai'},{OPENAI_API_KEY:'test-key',ICON_STUDIO_ACCESS_CODE:password},fetcher);assert.fail('Expected quota error');}catch(e){const result=generationError(e);assert.equal(result.status,429);assert.match(result.error,/quota/);assert.doesNotMatch(result.error,/test-secret/);}assert.equal(requests,1);
 const result=generationError(new APICallError({message:'secret',url:'https://api.openai.com',requestBodyValues:{},statusCode:401}));assert.match(result.error,/API key/);assert.doesNotMatch(result.error,/secret/);
});
