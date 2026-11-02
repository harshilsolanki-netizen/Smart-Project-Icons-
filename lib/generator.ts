import {z} from 'zod';
const point=z.number().finite().min(0).max(24);
const pathData=z.string().min(1).max(1600).regex(/^[MmLlHhVvCcSsQqTtAaZzEe0-9\s.,+\-]+$/);
export const iconSpec=z.object({label:z.string().min(2).max(64),description:z.string().min(2).max(220),shapes:z.array(z.discriminatedUnion('type',[
 z.object({type:z.literal('path'),d:pathData}).strict(),
 z.object({type:z.literal('circle'),cx:point,cy:point,r:z.number().positive().max(11)}).strict(),
 z.object({type:z.literal('rect'),x:point,y:point,width:z.number().positive().max(22),height:z.number().positive().max(22),rx:z.number().min(0).max(5)}).strict(),
 z.object({type:z.literal('line'),x1:point,y1:point,x2:point,y2:point}).strict(),
 z.object({type:z.literal('polyline'),points:z.string().min(3).max(300).regex(/^[0-9\s.,+\-]+$/)}).strict(),
])).min(1).max(24)}).strict();
export function specToSvg(input:unknown){const value=iconSpec.parse(input);const body=value.shapes.map(shape=>{const {type,...attrs}=shape;return '<'+type+' '+Object.entries(attrs).map(([key,v])=>key+'="'+v+'"').join(' ')+'/>';}).join('');return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18272f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg>';}
export const badges:Record<string,string>={
 alert:'<path d="m3 1 3 5H0l3-5Z"/><path d="M3 3v1m0 1h.01"/>',
 bell:'<path d="M0 5h6L5 3.5v-1a2 2 0 0 0-4 0v1L0 5Zm2 1.5h2"/>',
 lock:'<rect x="0" y="3" width="6" height="4" rx=".7"/><path d="M1.5 3V1.8a1.5 1.5 0 0 1 3 0V3"/>',
 check:'<path d="m0 3 2 2 4-4"/>',
 location:'<path d="M3 7S0 4.5 0 2.8a3 3 0 1 1 6 0C6 4.5 3 7 3 7Z"/><circle cx="3" cy="2.5" r=".7"/>',
 download:'<path d="M3 0v5m-2-2 2 2 2-2M0 5v2h6V5"/>',
};
export function composeSvg(source:string,badge:string,color='#18272f'){
 if(!/^#[0-9a-fA-F]{6}$/.test(color))throw Error('Invalid color');
 if(!badges[badge])throw Error('Choose a supported badge');
 // Input is restricted to this repository’s exported, trusted SVG assets.
 const body=source.replace(/<\?xml[^>]*>/g,'').replace(/^\s*<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/#[0-9a-fA-F]{3,8}\b/g,color);
 return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g transform="scale(.82)">'+body+'</g><circle cx="19" cy="19" r="5.5" fill="white"/><g transform="translate(16 15)" fill="none" stroke="'+color+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+badges[badge]+'</g></svg>';
}
