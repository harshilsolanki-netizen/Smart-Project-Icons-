import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const catalogue=JSON.parse(readFileSync('data/catalogue.json','utf8'));
test('every approved entry is mapped to an exact downloadable SVG',()=>{const icons=catalogue.icons;assert.equal(icons.length,217);assert.equal(new Set(icons.map((i:{id:string})=>i.id)).size,icons.length);assert.equal(icons.reduce((n:number,i:{aliases:unknown[]})=>n+i.aliases.length,0),493);for(const icon of icons){const asset='public'+icon.asset;assert.ok(existsSync(asset),icon.name);const content=readFileSync(asset,'utf8');assert.match(content,/<svg/);assert.equal(createHash('sha256').update(content).digest('hex'),icon.sha256);assert.doesNotMatch(content,/<script|\bonload\s*=|\bonerror\s*=/i);}});
test('all five categories and recent meaning corrections remain findable',()=>{assert.equal(catalogue.meta.categories.length,5);for(const name of ['Email','Crash detection','Immobilise mode','Vehicle boot','Reassign students','Seat belt'])assert.ok(catalogue.icons.some((i:{aliases:{name:string}[]})=>i.aliases.some(a=>a.name===name)),name);assert.equal(catalogue.meta.excludedRedCards,36);});
