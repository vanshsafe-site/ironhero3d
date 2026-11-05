import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
async function source(path){return import('data:text/javascript,'+encodeURIComponent(fs.readFileSync(new URL(path,import.meta.url),'utf8')));}
const {segmentBox,segmentSphere,waveSize}=await source('../src/systems/combat.js');
const {moveSolid}=await source('../src/systems/collision.js');
test('fast shot hits a small target between frames',()=>{assert.equal(segmentSphere({x:0,y:0,z:0},{x:20,y:0,z:0},{x:10,y:0,z:0},2),.4);});
test('wall blocks a target behind it',()=>{const a={x:0,y:1,z:0},b={x:20,y:1,z:0};assert.ok(segmentBox(a,b,{x0:3,x1:4,y0:0,y1:5,z0:-2,z1:2})<segmentSphere(a,b,{x:10,y:1,z:0},2));});
test('parallel miss, starting inside, and zero-length shots',()=>{const box={x0:3,x1:4,y0:0,y1:5,z0:-2,z1:2};assert.equal(segmentBox({x:0,y:0,z:0},{x:0,y:10,z:0},box),null);assert.equal(segmentSphere({x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},1),0);assert.equal(segmentSphere({x:2,y:0,z:0},{x:2,y:0,z:0},{x:0,y:0,z:0},1),null);});
test('wave totals double',()=>assert.deepEqual([1,2,3,4].map(waveSize),[20,40,80,160]));
test('boost cannot tunnel through walls',()=>{const p={x:0,y:0,z:0},v={x:100,y:0,z:0};moveSolid(p,v,.05,[{x0:2,x1:3,y0:0,y1:10,z0:-5,z1:5}]);assert.ok(p.x<=1.35);assert.equal(v.x,0);});
test('landing on roofs and passing above them',()=>{const wall={x0:2,x1:3,y0:0,y1:10,z0:-5,z1:5},p={x:2.5,y:12,z:0};assert.equal(moveSolid(p,{x:0,y:-100,z:0},.05,[wall]),true);assert.equal(p.y,10);const high={x:0,y:12,z:0};moveSolid(high,{x:100,y:0,z:0},.05,[wall]);assert.ok(high.x>4.9);});
test('walking steps onto low curbs',()=>{const p={x:0,y:0,z:0};moveSolid(p,{x:13,y:0,z:0},.1,[{x0:1,x1:10,y0:0,y1:.4,z0:-4,z1:4}]);assert.equal(p.y,.4);assert.ok(p.x>1);});
const {createSpatialIndex}=await source('../src/systems/spatial.js');
test('spatial index deduplicates large buildings and finds negative coordinates',()=>{const box={x0:-40,x1:40,z0:-40,z1:40},far={x0:200,x1:210,z0:200,z1:210};assert.deepEqual(createSpatialIndex([box,far])({x:-1,z:-1}),[box]);});
