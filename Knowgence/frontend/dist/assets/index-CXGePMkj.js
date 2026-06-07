function sT(r,e){for(var t=0;t<e.length;t++){const i=e[t];if(typeof i!="string"&&!Array.isArray(i)){for(const o in i)if(o!=="default"&&!(o in r)){const l=Object.getOwnPropertyDescriptor(i,o);l&&Object.defineProperty(r,o,l.get?l:{enumerable:!0,get:()=>i[o]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function oT(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Id={exports:{}},$a={},Sd={exports:{}},Ce={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kg;function aT(){if(kg)return Ce;kg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),w=Symbol.iterator;function T(M){return M===null||typeof M!="object"?null:(M=w&&M[w]||M["@@iterator"],typeof M=="function"?M:null)}var x={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},L=Object.assign,z={};function O(M,W,Te){this.props=M,this.context=W,this.refs=z,this.updater=Te||x}O.prototype.isReactComponent={},O.prototype.setState=function(M,W){if(typeof M!="object"&&typeof M!="function"&&M!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,M,W,"setState")},O.prototype.forceUpdate=function(M){this.updater.enqueueForceUpdate(this,M,"forceUpdate")};function re(){}re.prototype=O.prototype;function te(M,W,Te){this.props=M,this.context=W,this.refs=z,this.updater=Te||x}var Y=te.prototype=new re;Y.constructor=te,L(Y,O.prototype),Y.isPureReactComponent=!0;var ie=Array.isArray,ye=Object.prototype.hasOwnProperty,Re={current:null},N={key:!0,ref:!0,__self:!0,__source:!0};function S(M,W,Te){var Ie,xe={},De=null,Be=null;if(W!=null)for(Ie in W.ref!==void 0&&(Be=W.ref),W.key!==void 0&&(De=""+W.key),W)ye.call(W,Ie)&&!N.hasOwnProperty(Ie)&&(xe[Ie]=W[Ie]);var be=arguments.length-2;if(be===1)xe.children=Te;else if(1<be){for(var We=Array(be),qt=0;qt<be;qt++)We[qt]=arguments[qt+2];xe.children=We}if(M&&M.defaultProps)for(Ie in be=M.defaultProps,be)xe[Ie]===void 0&&(xe[Ie]=be[Ie]);return{$$typeof:r,type:M,key:De,ref:Be,props:xe,_owner:Re.current}}function C(M,W){return{$$typeof:r,type:M.type,key:W,ref:M.ref,props:M.props,_owner:M._owner}}function D(M){return typeof M=="object"&&M!==null&&M.$$typeof===r}function k(M){var W={"=":"=0",":":"=2"};return"$"+M.replace(/[=:]/g,function(Te){return W[Te]})}var b=/\/+/g;function R(M,W){return typeof M=="object"&&M!==null&&M.key!=null?k(""+M.key):W.toString(36)}function Me(M,W,Te,Ie,xe){var De=typeof M;(De==="undefined"||De==="boolean")&&(M=null);var Be=!1;if(M===null)Be=!0;else switch(De){case"string":case"number":Be=!0;break;case"object":switch(M.$$typeof){case r:case e:Be=!0}}if(Be)return Be=M,xe=xe(Be),M=Ie===""?"."+R(Be,0):Ie,ie(xe)?(Te="",M!=null&&(Te=M.replace(b,"$&/")+"/"),Me(xe,W,Te,"",function(qt){return qt})):xe!=null&&(D(xe)&&(xe=C(xe,Te+(!xe.key||Be&&Be.key===xe.key?"":(""+xe.key).replace(b,"$&/")+"/")+M)),W.push(xe)),1;if(Be=0,Ie=Ie===""?".":Ie+":",ie(M))for(var be=0;be<M.length;be++){De=M[be];var We=Ie+R(De,be);Be+=Me(De,W,Te,We,xe)}else if(We=T(M),typeof We=="function")for(M=We.call(M),be=0;!(De=M.next()).done;)De=De.value,We=Ie+R(De,be++),Be+=Me(De,W,Te,We,xe);else if(De==="object")throw W=String(M),Error("Objects are not valid as a React child (found: "+(W==="[object Object]"?"object with keys {"+Object.keys(M).join(", ")+"}":W)+"). If you meant to render a collection of children, use an array instead.");return Be}function He(M,W,Te){if(M==null)return M;var Ie=[],xe=0;return Me(M,Ie,"","",function(De){return W.call(Te,De,xe++)}),Ie}function vt(M){if(M._status===-1){var W=M._result;W=W(),W.then(function(Te){(M._status===0||M._status===-1)&&(M._status=1,M._result=Te)},function(Te){(M._status===0||M._status===-1)&&(M._status=2,M._result=Te)}),M._status===-1&&(M._status=0,M._result=W)}if(M._status===1)return M._result.default;throw M._result}var ze={current:null},ee={transition:null},fe={ReactCurrentDispatcher:ze,ReactCurrentBatchConfig:ee,ReactCurrentOwner:Re};function se(){throw Error("act(...) is not supported in production builds of React.")}return Ce.Children={map:He,forEach:function(M,W,Te){He(M,function(){W.apply(this,arguments)},Te)},count:function(M){var W=0;return He(M,function(){W++}),W},toArray:function(M){return He(M,function(W){return W})||[]},only:function(M){if(!D(M))throw Error("React.Children.only expected to receive a single React element child.");return M}},Ce.Component=O,Ce.Fragment=t,Ce.Profiler=o,Ce.PureComponent=te,Ce.StrictMode=i,Ce.Suspense=f,Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fe,Ce.act=se,Ce.cloneElement=function(M,W,Te){if(M==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+M+".");var Ie=L({},M.props),xe=M.key,De=M.ref,Be=M._owner;if(W!=null){if(W.ref!==void 0&&(De=W.ref,Be=Re.current),W.key!==void 0&&(xe=""+W.key),M.type&&M.type.defaultProps)var be=M.type.defaultProps;for(We in W)ye.call(W,We)&&!N.hasOwnProperty(We)&&(Ie[We]=W[We]===void 0&&be!==void 0?be[We]:W[We])}var We=arguments.length-2;if(We===1)Ie.children=Te;else if(1<We){be=Array(We);for(var qt=0;qt<We;qt++)be[qt]=arguments[qt+2];Ie.children=be}return{$$typeof:r,type:M.type,key:xe,ref:De,props:Ie,_owner:Be}},Ce.createContext=function(M){return M={$$typeof:h,_currentValue:M,_currentValue2:M,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},M.Provider={$$typeof:l,_context:M},M.Consumer=M},Ce.createElement=S,Ce.createFactory=function(M){var W=S.bind(null,M);return W.type=M,W},Ce.createRef=function(){return{current:null}},Ce.forwardRef=function(M){return{$$typeof:p,render:M}},Ce.isValidElement=D,Ce.lazy=function(M){return{$$typeof:_,_payload:{_status:-1,_result:M},_init:vt}},Ce.memo=function(M,W){return{$$typeof:m,type:M,compare:W===void 0?null:W}},Ce.startTransition=function(M){var W=ee.transition;ee.transition={};try{M()}finally{ee.transition=W}},Ce.unstable_act=se,Ce.useCallback=function(M,W){return ze.current.useCallback(M,W)},Ce.useContext=function(M){return ze.current.useContext(M)},Ce.useDebugValue=function(){},Ce.useDeferredValue=function(M){return ze.current.useDeferredValue(M)},Ce.useEffect=function(M,W){return ze.current.useEffect(M,W)},Ce.useId=function(){return ze.current.useId()},Ce.useImperativeHandle=function(M,W,Te){return ze.current.useImperativeHandle(M,W,Te)},Ce.useInsertionEffect=function(M,W){return ze.current.useInsertionEffect(M,W)},Ce.useLayoutEffect=function(M,W){return ze.current.useLayoutEffect(M,W)},Ce.useMemo=function(M,W){return ze.current.useMemo(M,W)},Ce.useReducer=function(M,W,Te){return ze.current.useReducer(M,W,Te)},Ce.useRef=function(M){return ze.current.useRef(M)},Ce.useState=function(M){return ze.current.useState(M)},Ce.useSyncExternalStore=function(M,W,Te){return ze.current.useSyncExternalStore(M,W,Te)},Ce.useTransition=function(){return ze.current.useTransition()},Ce.version="18.3.1",Ce}var Ng;function wf(){return Ng||(Ng=1,Sd.exports=aT()),Sd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xg;function lT(){if(xg)return $a;xg=1;var r=wf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(p,f,m){var _,w={},T=null,x=null;m!==void 0&&(T=""+m),f.key!==void 0&&(T=""+f.key),f.ref!==void 0&&(x=f.ref);for(_ in f)i.call(f,_)&&!l.hasOwnProperty(_)&&(w[_]=f[_]);if(p&&p.defaultProps)for(_ in f=p.defaultProps,f)w[_]===void 0&&(w[_]=f[_]);return{$$typeof:e,type:p,key:T,ref:x,props:w,_owner:o.current}}return $a.Fragment=t,$a.jsx=h,$a.jsxs=h,$a}var Dg;function uT(){return Dg||(Dg=1,Id.exports=lT()),Id.exports}var G=uT(),ae=wf();const gt=oT(ae),cT=sT({__proto__:null,default:gt},[ae]);var hT=Object.defineProperty,nc=Object.getOwnPropertySymbols,D_=Object.prototype.hasOwnProperty,V_=Object.prototype.propertyIsEnumerable,Vg=(r,e,t)=>e in r?hT(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,$d=(r,e)=>{for(var t in e||(e={}))D_.call(e,t)&&Vg(r,t,e[t]);if(nc)for(var t of nc(e))V_.call(e,t)&&Vg(r,t,e[t]);return r},qd=(r,e)=>{var t={};for(var i in r)D_.call(r,i)&&e.indexOf(i)<0&&(t[i]=r[i]);if(r!=null&&nc)for(var i of nc(r))e.indexOf(i)<0&&V_.call(r,i)&&(t[i]=r[i]);return t};/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */var Ts;(r=>{const e=class Pe{constructor(f,m,_,w){if(this.version=f,this.errorCorrectionLevel=m,this.modules=[],this.isFunction=[],f<Pe.MIN_VERSION||f>Pe.MAX_VERSION)throw new RangeError("Version value out of range");if(w<-1||w>7)throw new RangeError("Mask value out of range");this.size=f*4+17;let T=[];for(let L=0;L<this.size;L++)T.push(!1);for(let L=0;L<this.size;L++)this.modules.push(T.slice()),this.isFunction.push(T.slice());this.drawFunctionPatterns();const x=this.addEccAndInterleave(_);if(this.drawCodewords(x),w==-1){let L=1e9;for(let z=0;z<8;z++){this.applyMask(z),this.drawFormatBits(z);const O=this.getPenaltyScore();O<L&&(w=z,L=O),this.applyMask(z)}}o(0<=w&&w<=7),this.mask=w,this.applyMask(w),this.drawFormatBits(w),this.isFunction=[]}static encodeText(f,m){const _=r.QrSegment.makeSegments(f);return Pe.encodeSegments(_,m)}static encodeBinary(f,m){const _=r.QrSegment.makeBytes(f);return Pe.encodeSegments([_],m)}static encodeSegments(f,m,_=1,w=40,T=-1,x=!0){if(!(Pe.MIN_VERSION<=_&&_<=w&&w<=Pe.MAX_VERSION)||T<-1||T>7)throw new RangeError("Invalid value");let L,z;for(L=_;;L++){const Y=Pe.getNumDataCodewords(L,m)*8,ie=h.getTotalBits(f,L);if(ie<=Y){z=ie;break}if(L>=w)throw new RangeError("Data too long")}for(const Y of[Pe.Ecc.MEDIUM,Pe.Ecc.QUARTILE,Pe.Ecc.HIGH])x&&z<=Pe.getNumDataCodewords(L,Y)*8&&(m=Y);let O=[];for(const Y of f){t(Y.mode.modeBits,4,O),t(Y.numChars,Y.mode.numCharCountBits(L),O);for(const ie of Y.getData())O.push(ie)}o(O.length==z);const re=Pe.getNumDataCodewords(L,m)*8;o(O.length<=re),t(0,Math.min(4,re-O.length),O),t(0,(8-O.length%8)%8,O),o(O.length%8==0);for(let Y=236;O.length<re;Y^=253)t(Y,8,O);let te=[];for(;te.length*8<O.length;)te.push(0);return O.forEach((Y,ie)=>te[ie>>>3]|=Y<<7-(ie&7)),new Pe(L,m,te,T)}getModule(f,m){return 0<=f&&f<this.size&&0<=m&&m<this.size&&this.modules[m][f]}getModules(){return this.modules}drawFunctionPatterns(){for(let _=0;_<this.size;_++)this.setFunctionModule(6,_,_%2==0),this.setFunctionModule(_,6,_%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);const f=this.getAlignmentPatternPositions(),m=f.length;for(let _=0;_<m;_++)for(let w=0;w<m;w++)_==0&&w==0||_==0&&w==m-1||_==m-1&&w==0||this.drawAlignmentPattern(f[_],f[w]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(f){const m=this.errorCorrectionLevel.formatBits<<3|f;let _=m;for(let T=0;T<10;T++)_=_<<1^(_>>>9)*1335;const w=(m<<10|_)^21522;o(w>>>15==0);for(let T=0;T<=5;T++)this.setFunctionModule(8,T,i(w,T));this.setFunctionModule(8,7,i(w,6)),this.setFunctionModule(8,8,i(w,7)),this.setFunctionModule(7,8,i(w,8));for(let T=9;T<15;T++)this.setFunctionModule(14-T,8,i(w,T));for(let T=0;T<8;T++)this.setFunctionModule(this.size-1-T,8,i(w,T));for(let T=8;T<15;T++)this.setFunctionModule(8,this.size-15+T,i(w,T));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let f=this.version;for(let _=0;_<12;_++)f=f<<1^(f>>>11)*7973;const m=this.version<<12|f;o(m>>>18==0);for(let _=0;_<18;_++){const w=i(m,_),T=this.size-11+_%3,x=Math.floor(_/3);this.setFunctionModule(T,x,w),this.setFunctionModule(x,T,w)}}drawFinderPattern(f,m){for(let _=-4;_<=4;_++)for(let w=-4;w<=4;w++){const T=Math.max(Math.abs(w),Math.abs(_)),x=f+w,L=m+_;0<=x&&x<this.size&&0<=L&&L<this.size&&this.setFunctionModule(x,L,T!=2&&T!=4)}}drawAlignmentPattern(f,m){for(let _=-2;_<=2;_++)for(let w=-2;w<=2;w++)this.setFunctionModule(f+w,m+_,Math.max(Math.abs(w),Math.abs(_))!=1)}setFunctionModule(f,m,_){this.modules[m][f]=_,this.isFunction[m][f]=!0}addEccAndInterleave(f){const m=this.version,_=this.errorCorrectionLevel;if(f.length!=Pe.getNumDataCodewords(m,_))throw new RangeError("Invalid argument");const w=Pe.NUM_ERROR_CORRECTION_BLOCKS[_.ordinal][m],T=Pe.ECC_CODEWORDS_PER_BLOCK[_.ordinal][m],x=Math.floor(Pe.getNumRawDataModules(m)/8),L=w-x%w,z=Math.floor(x/w);let O=[];const re=Pe.reedSolomonComputeDivisor(T);for(let Y=0,ie=0;Y<w;Y++){let ye=f.slice(ie,ie+z-T+(Y<L?0:1));ie+=ye.length;const Re=Pe.reedSolomonComputeRemainder(ye,re);Y<L&&ye.push(0),O.push(ye.concat(Re))}let te=[];for(let Y=0;Y<O[0].length;Y++)O.forEach((ie,ye)=>{(Y!=z-T||ye>=L)&&te.push(ie[Y])});return o(te.length==x),te}drawCodewords(f){if(f.length!=Math.floor(Pe.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");let m=0;for(let _=this.size-1;_>=1;_-=2){_==6&&(_=5);for(let w=0;w<this.size;w++)for(let T=0;T<2;T++){const x=_-T,z=(_+1&2)==0?this.size-1-w:w;!this.isFunction[z][x]&&m<f.length*8&&(this.modules[z][x]=i(f[m>>>3],7-(m&7)),m++)}}o(m==f.length*8)}applyMask(f){if(f<0||f>7)throw new RangeError("Mask value out of range");for(let m=0;m<this.size;m++)for(let _=0;_<this.size;_++){let w;switch(f){case 0:w=(_+m)%2==0;break;case 1:w=m%2==0;break;case 2:w=_%3==0;break;case 3:w=(_+m)%3==0;break;case 4:w=(Math.floor(_/3)+Math.floor(m/2))%2==0;break;case 5:w=_*m%2+_*m%3==0;break;case 6:w=(_*m%2+_*m%3)%2==0;break;case 7:w=((_+m)%2+_*m%3)%2==0;break;default:throw new Error("Unreachable")}!this.isFunction[m][_]&&w&&(this.modules[m][_]=!this.modules[m][_])}}getPenaltyScore(){let f=0;for(let T=0;T<this.size;T++){let x=!1,L=0,z=[0,0,0,0,0,0,0];for(let O=0;O<this.size;O++)this.modules[T][O]==x?(L++,L==5?f+=Pe.PENALTY_N1:L>5&&f++):(this.finderPenaltyAddHistory(L,z),x||(f+=this.finderPenaltyCountPatterns(z)*Pe.PENALTY_N3),x=this.modules[T][O],L=1);f+=this.finderPenaltyTerminateAndCount(x,L,z)*Pe.PENALTY_N3}for(let T=0;T<this.size;T++){let x=!1,L=0,z=[0,0,0,0,0,0,0];for(let O=0;O<this.size;O++)this.modules[O][T]==x?(L++,L==5?f+=Pe.PENALTY_N1:L>5&&f++):(this.finderPenaltyAddHistory(L,z),x||(f+=this.finderPenaltyCountPatterns(z)*Pe.PENALTY_N3),x=this.modules[O][T],L=1);f+=this.finderPenaltyTerminateAndCount(x,L,z)*Pe.PENALTY_N3}for(let T=0;T<this.size-1;T++)for(let x=0;x<this.size-1;x++){const L=this.modules[T][x];L==this.modules[T][x+1]&&L==this.modules[T+1][x]&&L==this.modules[T+1][x+1]&&(f+=Pe.PENALTY_N2)}let m=0;for(const T of this.modules)m=T.reduce((x,L)=>x+(L?1:0),m);const _=this.size*this.size,w=Math.ceil(Math.abs(m*20-_*10)/_)-1;return o(0<=w&&w<=9),f+=w*Pe.PENALTY_N4,o(0<=f&&f<=2568888),f}getAlignmentPatternPositions(){if(this.version==1)return[];{const f=Math.floor(this.version/7)+2,m=this.version==32?26:Math.ceil((this.version*4+4)/(f*2-2))*2;let _=[6];for(let w=this.size-7;_.length<f;w-=m)_.splice(1,0,w);return _}}static getNumRawDataModules(f){if(f<Pe.MIN_VERSION||f>Pe.MAX_VERSION)throw new RangeError("Version number out of range");let m=(16*f+128)*f+64;if(f>=2){const _=Math.floor(f/7)+2;m-=(25*_-10)*_-55,f>=7&&(m-=36)}return o(208<=m&&m<=29648),m}static getNumDataCodewords(f,m){return Math.floor(Pe.getNumRawDataModules(f)/8)-Pe.ECC_CODEWORDS_PER_BLOCK[m.ordinal][f]*Pe.NUM_ERROR_CORRECTION_BLOCKS[m.ordinal][f]}static reedSolomonComputeDivisor(f){if(f<1||f>255)throw new RangeError("Degree out of range");let m=[];for(let w=0;w<f-1;w++)m.push(0);m.push(1);let _=1;for(let w=0;w<f;w++){for(let T=0;T<m.length;T++)m[T]=Pe.reedSolomonMultiply(m[T],_),T+1<m.length&&(m[T]^=m[T+1]);_=Pe.reedSolomonMultiply(_,2)}return m}static reedSolomonComputeRemainder(f,m){let _=m.map(w=>0);for(const w of f){const T=w^_.shift();_.push(0),m.forEach((x,L)=>_[L]^=Pe.reedSolomonMultiply(x,T))}return _}static reedSolomonMultiply(f,m){if(f>>>8||m>>>8)throw new RangeError("Byte out of range");let _=0;for(let w=7;w>=0;w--)_=_<<1^(_>>>7)*285,_^=(m>>>w&1)*f;return o(_>>>8==0),_}finderPenaltyCountPatterns(f){const m=f[1];o(m<=this.size*3);const _=m>0&&f[2]==m&&f[3]==m*3&&f[4]==m&&f[5]==m;return(_&&f[0]>=m*4&&f[6]>=m?1:0)+(_&&f[6]>=m*4&&f[0]>=m?1:0)}finderPenaltyTerminateAndCount(f,m,_){return f&&(this.finderPenaltyAddHistory(m,_),m=0),m+=this.size,this.finderPenaltyAddHistory(m,_),this.finderPenaltyCountPatterns(_)}finderPenaltyAddHistory(f,m){m[0]==0&&(f+=this.size),m.pop(),m.unshift(f)}};e.MIN_VERSION=1,e.MAX_VERSION=40,e.PENALTY_N1=3,e.PENALTY_N2=3,e.PENALTY_N3=40,e.PENALTY_N4=10,e.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],e.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],r.QrCode=e;function t(p,f,m){if(f<0||f>31||p>>>f)throw new RangeError("Value out of range");for(let _=f-1;_>=0;_--)m.push(p>>>_&1)}function i(p,f){return(p>>>f&1)!=0}function o(p){if(!p)throw new Error("Assertion error")}const l=class ot{constructor(f,m,_){if(this.mode=f,this.numChars=m,this.bitData=_,m<0)throw new RangeError("Invalid argument");this.bitData=_.slice()}static makeBytes(f){let m=[];for(const _ of f)t(_,8,m);return new ot(ot.Mode.BYTE,f.length,m)}static makeNumeric(f){if(!ot.isNumeric(f))throw new RangeError("String contains non-numeric characters");let m=[];for(let _=0;_<f.length;){const w=Math.min(f.length-_,3);t(parseInt(f.substring(_,_+w),10),w*3+1,m),_+=w}return new ot(ot.Mode.NUMERIC,f.length,m)}static makeAlphanumeric(f){if(!ot.isAlphanumeric(f))throw new RangeError("String contains unencodable characters in alphanumeric mode");let m=[],_;for(_=0;_+2<=f.length;_+=2){let w=ot.ALPHANUMERIC_CHARSET.indexOf(f.charAt(_))*45;w+=ot.ALPHANUMERIC_CHARSET.indexOf(f.charAt(_+1)),t(w,11,m)}return _<f.length&&t(ot.ALPHANUMERIC_CHARSET.indexOf(f.charAt(_)),6,m),new ot(ot.Mode.ALPHANUMERIC,f.length,m)}static makeSegments(f){return f==""?[]:ot.isNumeric(f)?[ot.makeNumeric(f)]:ot.isAlphanumeric(f)?[ot.makeAlphanumeric(f)]:[ot.makeBytes(ot.toUtf8ByteArray(f))]}static makeEci(f){let m=[];if(f<0)throw new RangeError("ECI assignment value out of range");if(f<128)t(f,8,m);else if(f<16384)t(2,2,m),t(f,14,m);else if(f<1e6)t(6,3,m),t(f,21,m);else throw new RangeError("ECI assignment value out of range");return new ot(ot.Mode.ECI,0,m)}static isNumeric(f){return ot.NUMERIC_REGEX.test(f)}static isAlphanumeric(f){return ot.ALPHANUMERIC_REGEX.test(f)}getData(){return this.bitData.slice()}static getTotalBits(f,m){let _=0;for(const w of f){const T=w.mode.numCharCountBits(m);if(w.numChars>=1<<T)return 1/0;_+=4+T+w.bitData.length}return _}static toUtf8ByteArray(f){f=encodeURI(f);let m=[];for(let _=0;_<f.length;_++)f.charAt(_)!="%"?m.push(f.charCodeAt(_)):(m.push(parseInt(f.substring(_+1,_+3),16)),_+=2);return m}};l.NUMERIC_REGEX=/^[0-9]*$/,l.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,l.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";let h=l;r.QrSegment=l})(Ts||(Ts={}));(r=>{(e=>{const t=class{constructor(o,l){this.ordinal=o,this.formatBits=l}};t.LOW=new t(0,1),t.MEDIUM=new t(1,0),t.QUARTILE=new t(2,3),t.HIGH=new t(3,2),e.Ecc=t})(r.QrCode||(r.QrCode={}))})(Ts||(Ts={}));(r=>{(e=>{const t=class{constructor(o,l){this.modeBits=o,this.numBitsCharCount=l}numCharCountBits(o){return this.numBitsCharCount[Math.floor((o+7)/17)]}};t.NUMERIC=new t(1,[10,12,14]),t.ALPHANUMERIC=new t(2,[9,11,13]),t.BYTE=new t(4,[8,16,16]),t.KANJI=new t(8,[8,10,12]),t.ECI=new t(7,[0,0,0]),e.Mode=t})(r.QrSegment||(r.QrSegment={}))})(Ts||(Ts={}));var Ro=Ts;/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */var dT={L:Ro.QrCode.Ecc.LOW,M:Ro.QrCode.Ecc.MEDIUM,Q:Ro.QrCode.Ecc.QUARTILE,H:Ro.QrCode.Ecc.HIGH},O_=128,M_="L",L_="#FFFFFF",b_="#000000",F_=!1,U_=1,fT=4,pT=0,mT=.1;function j_(r,e=0){const t=[];return r.forEach(function(i,o){let l=null;i.forEach(function(h,p){if(!h&&l!==null){t.push(`M${l+e} ${o+e}h${p-l}v1H${l+e}z`),l=null;return}if(p===i.length-1){if(!h)return;l===null?t.push(`M${p+e},${o+e} h1v1H${p+e}z`):t.push(`M${l+e},${o+e} h${p+1-l}v1H${l+e}z`);return}h&&l===null&&(l=p)})}),t.join("")}function z_(r,e){return r.slice().map((t,i)=>i<e.y||i>=e.y+e.h?t:t.map((o,l)=>l<e.x||l>=e.x+e.w?o:!1))}function gT(r,e,t,i){if(i==null)return null;const o=r.length+t*2,l=Math.floor(e*mT),h=o/e,p=(i.width||l)*h,f=(i.height||l)*h,m=i.x==null?r.length/2-p/2:i.x*h,_=i.y==null?r.length/2-f/2:i.y*h,w=i.opacity==null?1:i.opacity;let T=null;if(i.excavate){let L=Math.floor(m),z=Math.floor(_),O=Math.ceil(p+m-L),re=Math.ceil(f+_-z);T={x:L,y:z,w:O,h:re}}const x=i.crossOrigin;return{x:m,y:_,h:f,w:p,excavation:T,opacity:w,crossOrigin:x}}function yT(r,e){return e!=null?Math.max(Math.floor(e),0):r?fT:pT}function B_({value:r,level:e,minVersion:t,includeMargin:i,marginSize:o,imageSettings:l,size:h,boostLevel:p}){let f=gt.useMemo(()=>{const L=(Array.isArray(r)?r:[r]).reduce((z,O)=>(z.push(...Ro.QrSegment.makeSegments(O)),z),[]);return Ro.QrCode.encodeSegments(L,dT[e],t,void 0,void 0,p)},[r,e,t,p]);const{cells:m,margin:_,numCells:w,calculatedImageSettings:T}=gt.useMemo(()=>{let x=f.getModules();const L=yT(i,o),z=x.length+L*2,O=gT(x,h,L,l);return{cells:x,margin:L,numCells:z,calculatedImageSettings:O}},[f,h,l,i,o]);return{qrcode:f,margin:_,cells:m,numCells:w,calculatedImageSettings:T}}var _T=(function(){try{new Path2D().addPath(new Path2D)}catch{return!1}return!0})(),vT=gt.forwardRef(function(e,t){const i=e,{value:o,size:l=O_,level:h=M_,bgColor:p=L_,fgColor:f=b_,includeMargin:m=F_,minVersion:_=U_,boostLevel:w,marginSize:T,imageSettings:x}=i,z=qd(i,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","marginSize","imageSettings"]),{style:O}=z,re=qd(z,["style"]),te=x==null?void 0:x.src,Y=gt.useRef(null),ie=gt.useRef(null),ye=gt.useCallback(Me=>{Y.current=Me,typeof t=="function"?t(Me):t&&(t.current=Me)},[t]),[Re,N]=gt.useState(!1),{margin:S,cells:C,numCells:D,calculatedImageSettings:k}=B_({value:o,level:h,minVersion:_,boostLevel:w,includeMargin:m,marginSize:T,imageSettings:x,size:l});gt.useEffect(()=>{if(Y.current!=null){const Me=Y.current,He=Me.getContext("2d");if(!He)return;let vt=C;const ze=ie.current,ee=k!=null&&ze!==null&&ze.complete&&ze.naturalHeight!==0&&ze.naturalWidth!==0;ee&&k.excavation!=null&&(vt=z_(C,k.excavation));const fe=window.devicePixelRatio||1;Me.height=Me.width=l*fe;const se=l/D*fe;He.scale(se,se),He.fillStyle=p,He.fillRect(0,0,D,D),He.fillStyle=f,_T?He.fill(new Path2D(j_(vt,S))):C.forEach(function(M,W){M.forEach(function(Te,Ie){Te&&He.fillRect(Ie+S,W+S,1,1)})}),k&&(He.globalAlpha=k.opacity),ee&&He.drawImage(ze,k.x+S,k.y+S,k.w,k.h)}}),gt.useEffect(()=>{N(!1)},[te]);const b=$d({height:l,width:l},O);let R=null;return te!=null&&(R=gt.createElement("img",{src:te,key:te,style:{display:"none"},onLoad:()=>{N(!0)},ref:ie,crossOrigin:k==null?void 0:k.crossOrigin})),gt.createElement(gt.Fragment,null,gt.createElement("canvas",$d({style:b,height:l,width:l,ref:ye,role:"img"},re)),R)});vT.displayName="QRCodeCanvas";var $_=gt.forwardRef(function(e,t){const i=e,{value:o,size:l=O_,level:h=M_,bgColor:p=L_,fgColor:f=b_,includeMargin:m=F_,minVersion:_=U_,boostLevel:w,title:T,marginSize:x,imageSettings:L}=i,z=qd(i,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","title","marginSize","imageSettings"]),{margin:O,cells:re,numCells:te,calculatedImageSettings:Y}=B_({value:o,level:h,minVersion:_,boostLevel:w,includeMargin:m,marginSize:x,imageSettings:L,size:l});let ie=re,ye=null;L!=null&&Y!=null&&(Y.excavation!=null&&(ie=z_(re,Y.excavation)),ye=gt.createElement("image",{href:L.src,height:Y.h,width:Y.w,x:Y.x+O,y:Y.y+O,preserveAspectRatio:"none",opacity:Y.opacity,crossOrigin:Y.crossOrigin}));const Re=j_(ie,O);return gt.createElement("svg",$d({height:l,width:l,viewBox:`0 0 ${te} ${te}`,ref:t,role:"img"},z),!!T&&gt.createElement("title",null,T),gt.createElement("path",{fill:p,d:`M0,0 h${te}v${te}H0z`,shapeRendering:"crispEdges"}),gt.createElement("path",{fill:f,d:Re,shapeRendering:"crispEdges"}),ye)});$_.displayName="QRCodeSVG";const wT=()=>{};var Og={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q_=function(r){const e=[];let t=0;for(let i=0;i<r.length;i++){let o=r.charCodeAt(i);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&i+1<r.length&&(r.charCodeAt(i+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++i)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},ET=function(r){const e=[];let t=0,i=0;for(;t<r.length;){const o=r[t++];if(o<128)e[i++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[i++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],p=r[t++],f=((o&7)<<18|(l&63)<<12|(h&63)<<6|p&63)-65536;e[i++]=String.fromCharCode(55296+(f>>10)),e[i++]=String.fromCharCode(56320+(f&1023))}else{const l=r[t++],h=r[t++];e[i++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},H_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,p=h?r[o+1]:0,f=o+2<r.length,m=f?r[o+2]:0,_=l>>2,w=(l&3)<<4|p>>4;let T=(p&15)<<2|m>>6,x=m&63;f||(x=64,h||(T=64)),i.push(t[_],t[w],t[T],t[x])}return i.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(q_(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):ET(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],p=o<r.length?t[r.charAt(o)]:0;++o;const m=o<r.length?t[r.charAt(o)]:64;++o;const w=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||p==null||m==null||w==null)throw new TT;const T=l<<2|p>>4;if(i.push(T),m!==64){const x=p<<4&240|m>>2;if(i.push(x),w!==64){const L=m<<6&192|w;i.push(L)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class TT extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const IT=function(r){const e=q_(r);return H_.encodeByteArray(e,!0)},rc=function(r){return IT(r).replace(/\./g,"")},W_=function(r){try{return H_.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ST(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT=()=>ST().__FIREBASE_DEFAULTS__,RT=()=>{if(typeof process>"u"||typeof Og>"u")return;const r=Og.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},CT=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&W_(r[1]);return e&&JSON.parse(e)},kc=()=>{try{return wT()||AT()||RT()||CT()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},G_=r=>{var e,t;return(t=(e=kc())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},PT=r=>{const e=G_(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},K_=()=>{var r;return(r=kc())==null?void 0:r.config},Q_=r=>{var e;return(e=kc())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kT{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NT(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${i}`,aud:i,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}},...r};return[rc(JSON.stringify(t)),rc(JSON.stringify(h)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test($t())}function DT(){var e;const r=(e=kc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function VT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Y_(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function OT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function MT(){const r=$t();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function LT(){return!DT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function X_(){try{return typeof indexedDB=="object"}catch{return!1}}function J_(){return new Promise((r,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(i);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(i),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)==null?void 0:l.message)||"")}}catch(t){e(t)}})}function bT(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FT="FirebaseError";class Un extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=FT,Object.setPrototypeOf(this,Un.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ps.prototype.create)}}class Ps{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?UT(l,i):"Error",p=`${this.serviceName}: ${h} (${o}).`;return new Un(o,p,i)}}function UT(r,e){return r.replace(jT,(t,i)=>{const o=e[i];return o!=null?String(o):`<${i}?>`})}const jT=/\{\$([^}]+)}/g;function zT(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Ni(r,e){if(r===e)return!0;const t=Object.keys(r),i=Object.keys(e);for(const o of t){if(!i.includes(o))return!1;const l=r[o],h=e[o];if(Mg(l)&&Mg(h)){if(!Ni(l,h))return!1}else if(l!==h)return!1}for(const o of i)if(!t.includes(o))return!1;return!0}function Mg(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hl(r){const e=[];for(const[t,i]of Object.entries(r))Array.isArray(i)?i.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function BT(r,e){const t=new $T(r,e);return t.subscribe.bind(t)}class $T{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let o;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");qT(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:i},o.next===void 0&&(o.next=Ad),o.error===void 0&&(o.error=Ad),o.complete===void 0&&(o.complete=Ad);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function qT(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Ad(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HT=1e3,WT=2,GT=14400*1e3,KT=.5;function Lg(r,e=HT,t=WT){const i=e*Math.pow(t,r),o=Math.round(KT*i*(Math.random()-.5)*2);return Math.min(GT,i+o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Z_(r){return(await fetch(r,{credentials:"include"})).ok}class bn{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ms="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QT{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new kT;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&i.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(i)return null;throw o}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(XT(e))try{this.getOrInitializeService({instanceIdentifier:ms})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});i.resolve(l)}catch{}}}}clearInstance(e=ms){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ms){return this.instances.has(e)}getOptions(e=ms){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[l,h]of this.instancesDeferred.entries()){const p=this.normalizeInstanceIdentifier(l);i===p&&h.resolve(o)}return o}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(i)??new Set;o.add(e),this.onInitCallbacks.set(i,o);const l=this.instances.get(i);return l&&e(l,i),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const o of i)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:YT(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=ms){return this.component?this.component.multipleInstances?e:ms:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function YT(r){return r===ms?void 0:r}function XT(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JT{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new QT(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ve;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Ve||(Ve={}));const ZT={debug:Ve.DEBUG,verbose:Ve.VERBOSE,info:Ve.INFO,warn:Ve.WARN,error:Ve.ERROR,silent:Ve.SILENT},eI=Ve.INFO,tI={[Ve.DEBUG]:"log",[Ve.VERBOSE]:"log",[Ve.INFO]:"info",[Ve.WARN]:"warn",[Ve.ERROR]:"error"},nI=(r,e,...t)=>{if(e<r.logLevel)return;const i=new Date().toISOString(),o=tI[e];if(o)console[o](`[${i}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Nc{constructor(e){this.name=e,this._logLevel=eI,this._logHandler=nI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ve))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ZT[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ve.DEBUG,...e),this._logHandler(this,Ve.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ve.VERBOSE,...e),this._logHandler(this,Ve.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ve.INFO,...e),this._logHandler(this,Ve.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ve.WARN,...e),this._logHandler(this,Ve.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ve.ERROR,...e),this._logHandler(this,Ve.ERROR,...e)}}const rI=(r,e)=>e.some(t=>r instanceof t);let bg,Fg;function iI(){return bg||(bg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function sI(){return Fg||(Fg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ev=new WeakMap,Hd=new WeakMap,tv=new WeakMap,Rd=new WeakMap,Ef=new WeakMap;function oI(r){const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(Si(r.result)),o()},h=()=>{i(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&ev.set(t,r)}).catch(()=>{}),Ef.set(e,r),e}function aI(r){if(Hd.has(r))return;const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{i(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});Hd.set(r,e)}let Wd={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Hd.get(r);if(e==="objectStoreNames")return r.objectStoreNames||tv.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Si(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function lI(r){Wd=r(Wd)}function uI(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=r.call(Cd(this),e,...t);return tv.set(i,e.sort?e.sort():[e]),Si(i)}:sI().includes(r)?function(...e){return r.apply(Cd(this),e),Si(ev.get(this))}:function(...e){return Si(r.apply(Cd(this),e))}}function cI(r){return typeof r=="function"?uI(r):(r instanceof IDBTransaction&&aI(r),rI(r,iI())?new Proxy(r,Wd):r)}function Si(r){if(r instanceof IDBRequest)return oI(r);if(Rd.has(r))return Rd.get(r);const e=cI(r);return e!==r&&(Rd.set(r,e),Ef.set(e,r)),e}const Cd=r=>Ef.get(r);function nv(r,e,{blocked:t,upgrade:i,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),p=Si(h);return i&&h.addEventListener("upgradeneeded",f=>{i(Si(h.result),f.oldVersion,f.newVersion,Si(h.transaction),f)}),t&&h.addEventListener("blocked",f=>t(f.oldVersion,f.newVersion,f)),p.then(f=>{l&&f.addEventListener("close",()=>l()),o&&f.addEventListener("versionchange",m=>o(m.oldVersion,m.newVersion,m))}).catch(()=>{}),p}const hI=["get","getKey","getAll","getAllKeys","count"],dI=["put","add","delete","clear"],Pd=new Map;function Ug(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Pd.get(e))return Pd.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,o=dI.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(o||hI.includes(t)))return;const l=async function(h,...p){const f=this.transaction(h,o?"readwrite":"readonly");let m=f.store;return i&&(m=m.index(p.shift())),(await Promise.all([m[t](...p),o&&f.done]))[0]};return Pd.set(e,l),l}lI(r=>({...r,get:(e,t,i)=>Ug(e,t)||r.get(e,t,i),has:(e,t)=>!!Ug(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(pI(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function pI(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Gd="@firebase/app",jg="0.14.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fr=new Nc("@firebase/app"),mI="@firebase/app-compat",gI="@firebase/analytics-compat",yI="@firebase/analytics",_I="@firebase/app-check-compat",vI="@firebase/app-check",wI="@firebase/auth",EI="@firebase/auth-compat",TI="@firebase/database",II="@firebase/data-connect",SI="@firebase/database-compat",AI="@firebase/functions",RI="@firebase/functions-compat",CI="@firebase/installations",PI="@firebase/installations-compat",kI="@firebase/messaging",NI="@firebase/messaging-compat",xI="@firebase/performance",DI="@firebase/performance-compat",VI="@firebase/remote-config",OI="@firebase/remote-config-compat",MI="@firebase/storage",LI="@firebase/storage-compat",bI="@firebase/firestore",FI="@firebase/ai",UI="@firebase/firestore-compat",jI="firebase",zI="12.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kd="[DEFAULT]",BI={[Gd]:"fire-core",[mI]:"fire-core-compat",[yI]:"fire-analytics",[gI]:"fire-analytics-compat",[vI]:"fire-app-check",[_I]:"fire-app-check-compat",[wI]:"fire-auth",[EI]:"fire-auth-compat",[TI]:"fire-rtdb",[II]:"fire-data-connect",[SI]:"fire-rtdb-compat",[AI]:"fire-fn",[RI]:"fire-fn-compat",[CI]:"fire-iid",[PI]:"fire-iid-compat",[kI]:"fire-fcm",[NI]:"fire-fcm-compat",[xI]:"fire-perf",[DI]:"fire-perf-compat",[VI]:"fire-rc",[OI]:"fire-rc-compat",[MI]:"fire-gcs",[LI]:"fire-gcs-compat",[bI]:"fire-fst",[UI]:"fire-fst-compat",[FI]:"fire-vertex","fire-js":"fire-js",[jI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ic=new Map,$I=new Map,Qd=new Map;function zg(r,e){try{r.container.addComponent(e)}catch(t){Fr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function fr(r){const e=r.name;if(Qd.has(e))return Fr.debug(`There were multiple attempts to register component ${e}.`),!1;Qd.set(e,r);for(const t of ic.values())zg(t,r);for(const t of $I.values())zg(t,r);return!0}function ks(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function sr(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qI={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ai=new Ps("app","Firebase",qI);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HI{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new bn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ai.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o=zI;function rv(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const i={name:Kd,automaticDataCollectionEnabled:!0,...e},o=i.name;if(typeof o!="string"||!o)throw Ai.create("bad-app-name",{appName:String(o)});if(t||(t=K_()),!t)throw Ai.create("no-options");const l=ic.get(o);if(l){if(Ni(t,l.options)&&Ni(i,l.config))return l;throw Ai.create("duplicate-app",{appName:o})}const h=new JT(o);for(const f of Qd.values())h.addComponent(f);const p=new HI(t,i,h);return ic.set(o,p),p}function Tf(r=Kd){const e=ic.get(r);if(!e&&r===Kd&&K_())return rv();if(!e)throw Ai.create("no-app",{appName:r});return e}function Sn(r,e,t){let i=BI[r]??r;t&&(i+=`-${t}`);const o=i.match(/\s|\//),l=e.match(/\s|\//);if(o||l){const h=[`Unable to register library "${i}" with version "${e}":`];o&&h.push(`library name "${i}" contains illegal characters (whitespace or "/")`),o&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Fr.warn(h.join(" "));return}fr(new bn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WI="firebase-heartbeat-database",GI=1,tl="firebase-heartbeat-store";let kd=null;function iv(){return kd||(kd=nv(WI,GI,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(tl)}catch(t){console.warn(t)}}}}).catch(r=>{throw Ai.create("idb-open",{originalErrorMessage:r.message})})),kd}async function KI(r){try{const t=(await iv()).transaction(tl),i=await t.objectStore(tl).get(sv(r));return await t.done,i}catch(e){if(e instanceof Un)Fr.warn(e.message);else{const t=Ai.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Fr.warn(t.message)}}}async function Bg(r,e){try{const i=(await iv()).transaction(tl,"readwrite");await i.objectStore(tl).put(e,sv(r)),await i.done}catch(t){if(t instanceof Un)Fr.warn(t.message);else{const i=Ai.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Fr.warn(i.message)}}}function sv(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI=1024,YI=30;class XI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ZI(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=$g();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>YI){const h=eS(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){Fr.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=$g(),{heartbeatsToSend:i,unsentEntries:o}=JI(this._heartbeatsCache.heartbeats),l=rc(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return Fr.warn(t),""}}}function $g(){return new Date().toISOString().substring(0,10)}function JI(r,e=QI){const t=[];let i=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),qg(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),qg(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class ZI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return X_()?J_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await KI(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return Bg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return Bg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function qg(r){return rc(JSON.stringify({version:2,heartbeats:r})).length}function eS(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let i=1;i<r.length;i++)r[i].date<t&&(t=r[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tS(r){fr(new bn("platform-logger",e=>new fI(e),"PRIVATE")),fr(new bn("heartbeat",e=>new XI(e),"PRIVATE")),Sn(Gd,jg,r),Sn(Gd,jg,"esm2020"),Sn("fire-js","")}tS("");var Hg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ri,ov;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(N,S){function C(){}C.prototype=S.prototype,N.F=S.prototype,N.prototype=new C,N.prototype.constructor=N,N.D=function(D,k,b){for(var R=Array(arguments.length-2),Me=2;Me<arguments.length;Me++)R[Me-2]=arguments[Me];return S.prototype[k].apply(D,R)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(i,t),i.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(N,S,C){C||(C=0);const D=Array(16);if(typeof S=="string")for(var k=0;k<16;++k)D[k]=S.charCodeAt(C++)|S.charCodeAt(C++)<<8|S.charCodeAt(C++)<<16|S.charCodeAt(C++)<<24;else for(k=0;k<16;++k)D[k]=S[C++]|S[C++]<<8|S[C++]<<16|S[C++]<<24;S=N.g[0],C=N.g[1],k=N.g[2];let b=N.g[3],R;R=S+(b^C&(k^b))+D[0]+3614090360&4294967295,S=C+(R<<7&4294967295|R>>>25),R=b+(k^S&(C^k))+D[1]+3905402710&4294967295,b=S+(R<<12&4294967295|R>>>20),R=k+(C^b&(S^C))+D[2]+606105819&4294967295,k=b+(R<<17&4294967295|R>>>15),R=C+(S^k&(b^S))+D[3]+3250441966&4294967295,C=k+(R<<22&4294967295|R>>>10),R=S+(b^C&(k^b))+D[4]+4118548399&4294967295,S=C+(R<<7&4294967295|R>>>25),R=b+(k^S&(C^k))+D[5]+1200080426&4294967295,b=S+(R<<12&4294967295|R>>>20),R=k+(C^b&(S^C))+D[6]+2821735955&4294967295,k=b+(R<<17&4294967295|R>>>15),R=C+(S^k&(b^S))+D[7]+4249261313&4294967295,C=k+(R<<22&4294967295|R>>>10),R=S+(b^C&(k^b))+D[8]+1770035416&4294967295,S=C+(R<<7&4294967295|R>>>25),R=b+(k^S&(C^k))+D[9]+2336552879&4294967295,b=S+(R<<12&4294967295|R>>>20),R=k+(C^b&(S^C))+D[10]+4294925233&4294967295,k=b+(R<<17&4294967295|R>>>15),R=C+(S^k&(b^S))+D[11]+2304563134&4294967295,C=k+(R<<22&4294967295|R>>>10),R=S+(b^C&(k^b))+D[12]+1804603682&4294967295,S=C+(R<<7&4294967295|R>>>25),R=b+(k^S&(C^k))+D[13]+4254626195&4294967295,b=S+(R<<12&4294967295|R>>>20),R=k+(C^b&(S^C))+D[14]+2792965006&4294967295,k=b+(R<<17&4294967295|R>>>15),R=C+(S^k&(b^S))+D[15]+1236535329&4294967295,C=k+(R<<22&4294967295|R>>>10),R=S+(k^b&(C^k))+D[1]+4129170786&4294967295,S=C+(R<<5&4294967295|R>>>27),R=b+(C^k&(S^C))+D[6]+3225465664&4294967295,b=S+(R<<9&4294967295|R>>>23),R=k+(S^C&(b^S))+D[11]+643717713&4294967295,k=b+(R<<14&4294967295|R>>>18),R=C+(b^S&(k^b))+D[0]+3921069994&4294967295,C=k+(R<<20&4294967295|R>>>12),R=S+(k^b&(C^k))+D[5]+3593408605&4294967295,S=C+(R<<5&4294967295|R>>>27),R=b+(C^k&(S^C))+D[10]+38016083&4294967295,b=S+(R<<9&4294967295|R>>>23),R=k+(S^C&(b^S))+D[15]+3634488961&4294967295,k=b+(R<<14&4294967295|R>>>18),R=C+(b^S&(k^b))+D[4]+3889429448&4294967295,C=k+(R<<20&4294967295|R>>>12),R=S+(k^b&(C^k))+D[9]+568446438&4294967295,S=C+(R<<5&4294967295|R>>>27),R=b+(C^k&(S^C))+D[14]+3275163606&4294967295,b=S+(R<<9&4294967295|R>>>23),R=k+(S^C&(b^S))+D[3]+4107603335&4294967295,k=b+(R<<14&4294967295|R>>>18),R=C+(b^S&(k^b))+D[8]+1163531501&4294967295,C=k+(R<<20&4294967295|R>>>12),R=S+(k^b&(C^k))+D[13]+2850285829&4294967295,S=C+(R<<5&4294967295|R>>>27),R=b+(C^k&(S^C))+D[2]+4243563512&4294967295,b=S+(R<<9&4294967295|R>>>23),R=k+(S^C&(b^S))+D[7]+1735328473&4294967295,k=b+(R<<14&4294967295|R>>>18),R=C+(b^S&(k^b))+D[12]+2368359562&4294967295,C=k+(R<<20&4294967295|R>>>12),R=S+(C^k^b)+D[5]+4294588738&4294967295,S=C+(R<<4&4294967295|R>>>28),R=b+(S^C^k)+D[8]+2272392833&4294967295,b=S+(R<<11&4294967295|R>>>21),R=k+(b^S^C)+D[11]+1839030562&4294967295,k=b+(R<<16&4294967295|R>>>16),R=C+(k^b^S)+D[14]+4259657740&4294967295,C=k+(R<<23&4294967295|R>>>9),R=S+(C^k^b)+D[1]+2763975236&4294967295,S=C+(R<<4&4294967295|R>>>28),R=b+(S^C^k)+D[4]+1272893353&4294967295,b=S+(R<<11&4294967295|R>>>21),R=k+(b^S^C)+D[7]+4139469664&4294967295,k=b+(R<<16&4294967295|R>>>16),R=C+(k^b^S)+D[10]+3200236656&4294967295,C=k+(R<<23&4294967295|R>>>9),R=S+(C^k^b)+D[13]+681279174&4294967295,S=C+(R<<4&4294967295|R>>>28),R=b+(S^C^k)+D[0]+3936430074&4294967295,b=S+(R<<11&4294967295|R>>>21),R=k+(b^S^C)+D[3]+3572445317&4294967295,k=b+(R<<16&4294967295|R>>>16),R=C+(k^b^S)+D[6]+76029189&4294967295,C=k+(R<<23&4294967295|R>>>9),R=S+(C^k^b)+D[9]+3654602809&4294967295,S=C+(R<<4&4294967295|R>>>28),R=b+(S^C^k)+D[12]+3873151461&4294967295,b=S+(R<<11&4294967295|R>>>21),R=k+(b^S^C)+D[15]+530742520&4294967295,k=b+(R<<16&4294967295|R>>>16),R=C+(k^b^S)+D[2]+3299628645&4294967295,C=k+(R<<23&4294967295|R>>>9),R=S+(k^(C|~b))+D[0]+4096336452&4294967295,S=C+(R<<6&4294967295|R>>>26),R=b+(C^(S|~k))+D[7]+1126891415&4294967295,b=S+(R<<10&4294967295|R>>>22),R=k+(S^(b|~C))+D[14]+2878612391&4294967295,k=b+(R<<15&4294967295|R>>>17),R=C+(b^(k|~S))+D[5]+4237533241&4294967295,C=k+(R<<21&4294967295|R>>>11),R=S+(k^(C|~b))+D[12]+1700485571&4294967295,S=C+(R<<6&4294967295|R>>>26),R=b+(C^(S|~k))+D[3]+2399980690&4294967295,b=S+(R<<10&4294967295|R>>>22),R=k+(S^(b|~C))+D[10]+4293915773&4294967295,k=b+(R<<15&4294967295|R>>>17),R=C+(b^(k|~S))+D[1]+2240044497&4294967295,C=k+(R<<21&4294967295|R>>>11),R=S+(k^(C|~b))+D[8]+1873313359&4294967295,S=C+(R<<6&4294967295|R>>>26),R=b+(C^(S|~k))+D[15]+4264355552&4294967295,b=S+(R<<10&4294967295|R>>>22),R=k+(S^(b|~C))+D[6]+2734768916&4294967295,k=b+(R<<15&4294967295|R>>>17),R=C+(b^(k|~S))+D[13]+1309151649&4294967295,C=k+(R<<21&4294967295|R>>>11),R=S+(k^(C|~b))+D[4]+4149444226&4294967295,S=C+(R<<6&4294967295|R>>>26),R=b+(C^(S|~k))+D[11]+3174756917&4294967295,b=S+(R<<10&4294967295|R>>>22),R=k+(S^(b|~C))+D[2]+718787259&4294967295,k=b+(R<<15&4294967295|R>>>17),R=C+(b^(k|~S))+D[9]+3951481745&4294967295,N.g[0]=N.g[0]+S&4294967295,N.g[1]=N.g[1]+(k+(R<<21&4294967295|R>>>11))&4294967295,N.g[2]=N.g[2]+k&4294967295,N.g[3]=N.g[3]+b&4294967295}i.prototype.v=function(N,S){S===void 0&&(S=N.length);const C=S-this.blockSize,D=this.C;let k=this.h,b=0;for(;b<S;){if(k==0)for(;b<=C;)o(this,N,b),b+=this.blockSize;if(typeof N=="string"){for(;b<S;)if(D[k++]=N.charCodeAt(b++),k==this.blockSize){o(this,D),k=0;break}}else for(;b<S;)if(D[k++]=N[b++],k==this.blockSize){o(this,D),k=0;break}}this.h=k,this.o+=S},i.prototype.A=function(){var N=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);N[0]=128;for(var S=1;S<N.length-8;++S)N[S]=0;S=this.o*8;for(var C=N.length-8;C<N.length;++C)N[C]=S&255,S/=256;for(this.v(N),N=Array(16),S=0,C=0;C<4;++C)for(let D=0;D<32;D+=8)N[S++]=this.g[C]>>>D&255;return N};function l(N,S){var C=p;return Object.prototype.hasOwnProperty.call(C,N)?C[N]:C[N]=S(N)}function h(N,S){this.h=S;const C=[];let D=!0;for(let k=N.length-1;k>=0;k--){const b=N[k]|0;D&&b==S||(C[k]=b,D=!1)}this.g=C}var p={};function f(N){return-128<=N&&N<128?l(N,function(S){return new h([S|0],S<0?-1:0)}):new h([N|0],N<0?-1:0)}function m(N){if(isNaN(N)||!isFinite(N))return w;if(N<0)return O(m(-N));const S=[];let C=1;for(let D=0;N>=C;D++)S[D]=N/C|0,C*=4294967296;return new h(S,0)}function _(N,S){if(N.length==0)throw Error("number format error: empty string");if(S=S||10,S<2||36<S)throw Error("radix out of range: "+S);if(N.charAt(0)=="-")return O(_(N.substring(1),S));if(N.indexOf("-")>=0)throw Error('number format error: interior "-" character');const C=m(Math.pow(S,8));let D=w;for(let b=0;b<N.length;b+=8){var k=Math.min(8,N.length-b);const R=parseInt(N.substring(b,b+k),S);k<8?(k=m(Math.pow(S,k)),D=D.j(k).add(m(R))):(D=D.j(C),D=D.add(m(R)))}return D}var w=f(0),T=f(1),x=f(16777216);r=h.prototype,r.m=function(){if(z(this))return-O(this).m();let N=0,S=1;for(let C=0;C<this.g.length;C++){const D=this.i(C);N+=(D>=0?D:4294967296+D)*S,S*=4294967296}return N},r.toString=function(N){if(N=N||10,N<2||36<N)throw Error("radix out of range: "+N);if(L(this))return"0";if(z(this))return"-"+O(this).toString(N);const S=m(Math.pow(N,6));var C=this;let D="";for(;;){const k=ie(C,S).g;C=re(C,k.j(S));let b=((C.g.length>0?C.g[0]:C.h)>>>0).toString(N);if(C=k,L(C))return b+D;for(;b.length<6;)b="0"+b;D=b+D}},r.i=function(N){return N<0?0:N<this.g.length?this.g[N]:this.h};function L(N){if(N.h!=0)return!1;for(let S=0;S<N.g.length;S++)if(N.g[S]!=0)return!1;return!0}function z(N){return N.h==-1}r.l=function(N){return N=re(this,N),z(N)?-1:L(N)?0:1};function O(N){const S=N.g.length,C=[];for(let D=0;D<S;D++)C[D]=~N.g[D];return new h(C,~N.h).add(T)}r.abs=function(){return z(this)?O(this):this},r.add=function(N){const S=Math.max(this.g.length,N.g.length),C=[];let D=0;for(let k=0;k<=S;k++){let b=D+(this.i(k)&65535)+(N.i(k)&65535),R=(b>>>16)+(this.i(k)>>>16)+(N.i(k)>>>16);D=R>>>16,b&=65535,R&=65535,C[k]=R<<16|b}return new h(C,C[C.length-1]&-2147483648?-1:0)};function re(N,S){return N.add(O(S))}r.j=function(N){if(L(this)||L(N))return w;if(z(this))return z(N)?O(this).j(O(N)):O(O(this).j(N));if(z(N))return O(this.j(O(N)));if(this.l(x)<0&&N.l(x)<0)return m(this.m()*N.m());const S=this.g.length+N.g.length,C=[];for(var D=0;D<2*S;D++)C[D]=0;for(D=0;D<this.g.length;D++)for(let k=0;k<N.g.length;k++){const b=this.i(D)>>>16,R=this.i(D)&65535,Me=N.i(k)>>>16,He=N.i(k)&65535;C[2*D+2*k]+=R*He,te(C,2*D+2*k),C[2*D+2*k+1]+=b*He,te(C,2*D+2*k+1),C[2*D+2*k+1]+=R*Me,te(C,2*D+2*k+1),C[2*D+2*k+2]+=b*Me,te(C,2*D+2*k+2)}for(N=0;N<S;N++)C[N]=C[2*N+1]<<16|C[2*N];for(N=S;N<2*S;N++)C[N]=0;return new h(C,0)};function te(N,S){for(;(N[S]&65535)!=N[S];)N[S+1]+=N[S]>>>16,N[S]&=65535,S++}function Y(N,S){this.g=N,this.h=S}function ie(N,S){if(L(S))throw Error("division by zero");if(L(N))return new Y(w,w);if(z(N))return S=ie(O(N),S),new Y(O(S.g),O(S.h));if(z(S))return S=ie(N,O(S)),new Y(O(S.g),S.h);if(N.g.length>30){if(z(N)||z(S))throw Error("slowDivide_ only works with positive integers.");for(var C=T,D=S;D.l(N)<=0;)C=ye(C),D=ye(D);var k=Re(C,1),b=Re(D,1);for(D=Re(D,2),C=Re(C,2);!L(D);){var R=b.add(D);R.l(N)<=0&&(k=k.add(C),b=R),D=Re(D,1),C=Re(C,1)}return S=re(N,k.j(S)),new Y(k,S)}for(k=w;N.l(S)>=0;){for(C=Math.max(1,Math.floor(N.m()/S.m())),D=Math.ceil(Math.log(C)/Math.LN2),D=D<=48?1:Math.pow(2,D-48),b=m(C),R=b.j(S);z(R)||R.l(N)>0;)C-=D,b=m(C),R=b.j(S);L(b)&&(b=T),k=k.add(b),N=re(N,R)}return new Y(k,N)}r.B=function(N){return ie(this,N).h},r.and=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let D=0;D<S;D++)C[D]=this.i(D)&N.i(D);return new h(C,this.h&N.h)},r.or=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let D=0;D<S;D++)C[D]=this.i(D)|N.i(D);return new h(C,this.h|N.h)},r.xor=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let D=0;D<S;D++)C[D]=this.i(D)^N.i(D);return new h(C,this.h^N.h)};function ye(N){const S=N.g.length+1,C=[];for(let D=0;D<S;D++)C[D]=N.i(D)<<1|N.i(D-1)>>>31;return new h(C,N.h)}function Re(N,S){const C=S>>5;S%=32;const D=N.g.length-C,k=[];for(let b=0;b<D;b++)k[b]=S>0?N.i(b+C)>>>S|N.i(b+C+1)<<32-S:N.i(b+C);return new h(k,N.h)}i.prototype.digest=i.prototype.A,i.prototype.reset=i.prototype.u,i.prototype.update=i.prototype.v,ov=i,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=m,h.fromString=_,Ri=h}).apply(typeof Hg<"u"?Hg:typeof self<"u"?self:typeof window<"u"?window:{});var Uu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var av,Wa,lv,Wu,Yd,uv,cv,hv;(function(){var r,e=Object.defineProperty;function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof Uu=="object"&&Uu];for(var y=0;y<u.length;++y){var v=u[y];if(v&&v.Math==Math)return v}throw Error("Cannot find global object")}var i=t(this);function o(u,y){if(y)e:{var v=i;u=u.split(".");for(var I=0;I<u.length-1;I++){var U=u[I];if(!(U in v))break e;v=v[U]}u=u[u.length-1],I=v[u],y=y(I),y!=I&&y!=null&&e(v,u,{configurable:!0,writable:!0,value:y})}}o("Symbol.dispose",function(u){return u||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(u){return u||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(u){return u||function(y){var v=[],I;for(I in y)Object.prototype.hasOwnProperty.call(y,I)&&v.push([I,y[I]]);return v}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function p(u){var y=typeof u;return y=="object"&&u!=null||y=="function"}function f(u,y,v){return u.call.apply(u.bind,arguments)}function m(u,y,v){return m=f,m.apply(null,arguments)}function _(u,y){var v=Array.prototype.slice.call(arguments,1);return function(){var I=v.slice();return I.push.apply(I,arguments),u.apply(this,I)}}function w(u,y){function v(){}v.prototype=y.prototype,u.Z=y.prototype,u.prototype=new v,u.prototype.constructor=u,u.Ob=function(I,U,$){for(var Z=Array(arguments.length-2),Se=2;Se<arguments.length;Se++)Z[Se-2]=arguments[Se];return y.prototype[U].apply(I,Z)}}var T=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?u=>u&&AsyncContext.Snapshot.wrap(u):u=>u;function x(u){const y=u.length;if(y>0){const v=Array(y);for(let I=0;I<y;I++)v[I]=u[I];return v}return[]}function L(u,y){for(let I=1;I<arguments.length;I++){const U=arguments[I];var v=typeof U;if(v=v!="object"?v:U?Array.isArray(U)?"array":v:"null",v=="array"||v=="object"&&typeof U.length=="number"){v=u.length||0;const $=U.length||0;u.length=v+$;for(let Z=0;Z<$;Z++)u[v+Z]=U[Z]}else u.push(U)}}class z{constructor(y,v){this.i=y,this.j=v,this.h=0,this.g=null}get(){let y;return this.h>0?(this.h--,y=this.g,this.g=y.next,y.next=null):y=this.i(),y}}function O(u){h.setTimeout(()=>{throw u},0)}function re(){var u=N;let y=null;return u.g&&(y=u.g,u.g=u.g.next,u.g||(u.h=null),y.next=null),y}class te{constructor(){this.h=this.g=null}add(y,v){const I=Y.get();I.set(y,v),this.h?this.h.next=I:this.g=I,this.h=I}}var Y=new z(()=>new ie,u=>u.reset());class ie{constructor(){this.next=this.g=this.h=null}set(y,v){this.h=y,this.g=v,this.next=null}reset(){this.next=this.g=this.h=null}}let ye,Re=!1,N=new te,S=()=>{const u=Promise.resolve(void 0);ye=()=>{u.then(C)}};function C(){for(var u;u=re();){try{u.h.call(u.g)}catch(v){O(v)}var y=Y;y.j(u),y.h<100&&(y.h++,u.next=y.g,y.g=u)}Re=!1}function D(){this.u=this.u,this.C=this.C}D.prototype.u=!1,D.prototype.dispose=function(){this.u||(this.u=!0,this.N())},D.prototype[Symbol.dispose]=function(){this.dispose()},D.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function k(u,y){this.type=u,this.g=this.target=y,this.defaultPrevented=!1}k.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var u=!1,y=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const v=()=>{};h.addEventListener("test",v,y),h.removeEventListener("test",v,y)}catch{}return u})();function R(u){return/^[\s\xa0]*$/.test(u)}function Me(u,y){k.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u&&this.init(u,y)}w(Me,k),Me.prototype.init=function(u,y){const v=this.type=u.type,I=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;this.target=u.target||u.srcElement,this.g=y,y=u.relatedTarget,y||(v=="mouseover"?y=u.fromElement:v=="mouseout"&&(y=u.toElement)),this.relatedTarget=y,I?(this.clientX=I.clientX!==void 0?I.clientX:I.pageX,this.clientY=I.clientY!==void 0?I.clientY:I.pageY,this.screenX=I.screenX||0,this.screenY=I.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=u.pointerType,this.state=u.state,this.i=u,u.defaultPrevented&&Me.Z.h.call(this)},Me.prototype.h=function(){Me.Z.h.call(this);const u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var He="closure_listenable_"+(Math.random()*1e6|0),vt=0;function ze(u,y,v,I,U){this.listener=u,this.proxy=null,this.src=y,this.type=v,this.capture=!!I,this.ha=U,this.key=++vt,this.da=this.fa=!1}function ee(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function fe(u,y,v){for(const I in u)y.call(v,u[I],I,u)}function se(u,y){for(const v in u)y.call(void 0,u[v],v,u)}function M(u){const y={};for(const v in u)y[v]=u[v];return y}const W="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Te(u,y){let v,I;for(let U=1;U<arguments.length;U++){I=arguments[U];for(v in I)u[v]=I[v];for(let $=0;$<W.length;$++)v=W[$],Object.prototype.hasOwnProperty.call(I,v)&&(u[v]=I[v])}}function Ie(u){this.src=u,this.g={},this.h=0}Ie.prototype.add=function(u,y,v,I,U){const $=u.toString();u=this.g[$],u||(u=this.g[$]=[],this.h++);const Z=De(u,y,I,U);return Z>-1?(y=u[Z],v||(y.fa=!1)):(y=new ze(y,this.src,$,!!I,U),y.fa=v,u.push(y)),y};function xe(u,y){const v=y.type;if(v in u.g){var I=u.g[v],U=Array.prototype.indexOf.call(I,y,void 0),$;($=U>=0)&&Array.prototype.splice.call(I,U,1),$&&(ee(y),u.g[v].length==0&&(delete u.g[v],u.h--))}}function De(u,y,v,I){for(let U=0;U<u.length;++U){const $=u[U];if(!$.da&&$.listener==y&&$.capture==!!v&&$.ha==I)return U}return-1}var Be="closure_lm_"+(Math.random()*1e6|0),be={};function We(u,y,v,I,U){if(Array.isArray(y)){for(let $=0;$<y.length;$++)We(u,y[$],v,I,U);return null}return v=Yo(v),u&&u[He]?u.J(y,v,p(I)?!!I.capture:!1,U):qt(u,y,v,!1,I,U)}function qt(u,y,v,I,U,$){if(!y)throw Error("Invalid event type");const Z=p(U)?!!U.capture:!!U;let Se=Ms(u);if(Se||(u[Be]=Se=new Ie(u)),v=Se.add(y,v,I,Z,$),v.proxy)return v;if(I=Vs(),v.proxy=I,I.src=u,I.listener=v,u.addEventListener)b||(U=Z),U===void 0&&(U=!1),u.addEventListener(y.toString(),I,U);else if(u.attachEvent)u.attachEvent(Os(y.toString()),I);else if(u.addListener&&u.removeListener)u.addListener(I);else throw Error("addEventListener and attachEvent are unavailable.");return v}function Vs(){function u(v){return y.call(u.src,u.listener,v)}const y=Sl;return u}function Qo(u,y,v,I,U){if(Array.isArray(y))for(var $=0;$<y.length;$++)Qo(u,y[$],v,I,U);else I=p(I)?!!I.capture:!!I,v=Yo(v),u&&u[He]?(u=u.i,$=String(y).toString(),$ in u.g&&(y=u.g[$],v=De(y,v,I,U),v>-1&&(ee(y[v]),Array.prototype.splice.call(y,v,1),y.length==0&&(delete u.g[$],u.h--)))):u&&(u=Ms(u))&&(y=u.g[y.toString()],u=-1,y&&(u=De(y,v,I,U)),(v=u>-1?y[u]:null)&&$r(v))}function $r(u){if(typeof u!="number"&&u&&!u.da){var y=u.src;if(y&&y[He])xe(y.i,u);else{var v=u.type,I=u.proxy;y.removeEventListener?y.removeEventListener(v,I,u.capture):y.detachEvent?y.detachEvent(Os(v),I):y.addListener&&y.removeListener&&y.removeListener(I),(v=Ms(y))?(xe(v,u),v.h==0&&(v.src=null,y[Be]=null)):ee(u)}}}function Os(u){return u in be?be[u]:be[u]="on"+u}function Sl(u,y){if(u.da)u=!0;else{y=new Me(y,this);const v=u.listener,I=u.ha||u.src;u.fa&&$r(u),u=v.call(I,y)}return u}function Ms(u){return u=u[Be],u instanceof Ie?u:null}var ji="__closure_events_fn_"+(Math.random()*1e9>>>0);function Yo(u){return typeof u=="function"?u:(u[ji]||(u[ji]=function(y){return u.handleEvent(y)}),u[ji])}function dt(){D.call(this),this.i=new Ie(this),this.M=this,this.G=null}w(dt,D),dt.prototype[He]=!0,dt.prototype.removeEventListener=function(u,y,v,I){Qo(this,u,y,v,I)};function at(u,y){var v,I=u.G;if(I)for(v=[];I;I=I.G)v.push(I);if(u=u.M,I=y.type||y,typeof y=="string")y=new k(y,u);else if(y instanceof k)y.target=y.target||u;else{var U=y;y=new k(I,u),Te(y,U)}U=!0;let $,Z;if(v)for(Z=v.length-1;Z>=0;Z--)$=y.g=v[Z],U=An($,I,!0,y)&&U;if($=y.g=u,U=An($,I,!0,y)&&U,U=An($,I,!1,y)&&U,v)for(Z=0;Z<v.length;Z++)$=y.g=v[Z],U=An($,I,!1,y)&&U}dt.prototype.N=function(){if(dt.Z.N.call(this),this.i){var u=this.i;for(const y in u.g){const v=u.g[y];for(let I=0;I<v.length;I++)ee(v[I]);delete u.g[y],u.h--}}this.G=null},dt.prototype.J=function(u,y,v,I){return this.i.add(String(u),y,!1,v,I)},dt.prototype.K=function(u,y,v,I){return this.i.add(String(u),y,!0,v,I)};function An(u,y,v,I){if(y=u.i.g[String(y)],!y)return!0;y=y.concat();let U=!0;for(let $=0;$<y.length;++$){const Z=y[$];if(Z&&!Z.da&&Z.capture==v){const Se=Z.listener,lt=Z.ha||Z.src;Z.fa&&xe(u.i,Z),U=Se.call(lt,I)!==!1&&U}}return U&&!I.defaultPrevented}function Xo(u,y){if(typeof u!="function")if(u&&typeof u.handleEvent=="function")u=m(u.handleEvent,u);else throw Error("Invalid listener argument");return Number(y)>2147483647?-1:h.setTimeout(u,y||0)}function Jo(u){u.g=Xo(()=>{u.g=null,u.i&&(u.i=!1,Jo(u))},u.l);const y=u.h;u.h=null,u.m.apply(null,y)}class Al extends D{constructor(y,v){super(),this.m=y,this.l=v,this.h=null,this.i=!1,this.g=null}j(y){this.h=arguments,this.g?this.i=!0:Jo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function qr(u){D.call(this),this.h=u,this.g={}}w(qr,D);var Zo=[];function Ls(u){fe(u.g,function(y,v){this.g.hasOwnProperty(v)&&$r(y)},u),u.g={}}qr.prototype.N=function(){qr.Z.N.call(this),Ls(this)},qr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Hr=h.JSON.stringify,Rl=h.JSON.parse,zi=class{stringify(u){return h.JSON.stringify(u,void 0)}parse(u){return h.JSON.parse(u,void 0)}};function Wr(){}function Cl(){}var Gr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function bs(){k.call(this,"d")}w(bs,k);function ea(){k.call(this,"c")}w(ea,k);var Rn={},Fs=null;function Kr(){return Fs=Fs||new dt}Rn.Ia="serverreachability";function Us(u){k.call(this,Rn.Ia,u)}w(Us,k);function gr(u){const y=Kr();at(y,new Us(y))}Rn.STAT_EVENT="statevent";function yr(u,y){k.call(this,Rn.STAT_EVENT,u),this.stat=y}w(yr,k);function it(u){const y=Kr();at(y,new yr(y,u))}Rn.Ja="timingevent";function ta(u,y){k.call(this,Rn.Ja,u),this.size=y}w(ta,k);function Qr(u,y){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){u()},y)}function Yr(){this.g=!0}Yr.prototype.ua=function(){this.g=!1};function Pl(u,y,v,I,U,$){u.info(function(){if(u.g)if($){var Z="",Se=$.split("&");for(let qe=0;qe<Se.length;qe++){var lt=Se[qe].split("=");if(lt.length>1){const ft=lt[0];lt=lt[1];const un=ft.split("_");Z=un.length>=2&&un[1]=="type"?Z+(ft+"="+lt+"&"):Z+(ft+"=redacted&")}}}else Z=null;else Z=$;return"XMLHTTP REQ ("+I+") [attempt "+U+"]: "+y+`
`+v+`
`+Z})}function kl(u,y,v,I,U,$,Z){u.info(function(){return"XMLHTTP RESP ("+I+") [ attempt "+U+"]: "+y+`
`+v+`
`+$+" "+Z})}function jn(u,y,v,I){u.info(function(){return"XMLHTTP TEXT ("+y+"): "+Bi(u,v)+(I?" "+I:"")})}function Nl(u,y){u.info(function(){return"TIMEOUT: "+y})}Yr.prototype.info=function(){};function Bi(u,y){if(!u.g)return y;if(!y)return null;try{const $=JSON.parse(y);if($){for(u=0;u<$.length;u++)if(Array.isArray($[u])){var v=$[u];if(!(v.length<2)){var I=v[1];if(Array.isArray(I)&&!(I.length<1)){var U=I[0];if(U!="noop"&&U!="stop"&&U!="close")for(let Z=1;Z<I.length;Z++)I[Z]=""}}}}return Hr($)}catch{return y}}var Xr={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Jr={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},xl;function _r(){}w(_r,Wr),_r.prototype.g=function(){return new XMLHttpRequest},xl=new _r;function zn(u){return encodeURIComponent(String(u))}function js(u){var y=1;u=u.split(":");const v=[];for(;y>0&&u.length;)v.push(u.shift()),y--;return u.length&&v.push(u.join(":")),v}function mn(u,y,v,I){this.j=u,this.i=y,this.l=v,this.S=I||1,this.V=new qr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Dl}function Dl(){this.i=null,this.g="",this.h=!1}var Vl={},na={};function Cn(u,y,v){u.M=1,u.A=wr(gn(y)),u.u=v,u.R=!0,ra(u,null)}function ra(u,y){u.F=Date.now(),$i(u),u.B=gn(u.A);var v=u.B,I=u.S;Array.isArray(I)||(I=[String(I)]),fa(v.i,"t",I),u.C=0,v=u.j.L,u.h=new Dl,u.g=$l(u.j,v?y:null,!u.u),u.P>0&&(u.O=new Al(m(u.Y,u,u.g),u.P)),y=u.V,v=u.g,I=u.ba;var U="readystatechange";Array.isArray(U)||(U&&(Zo[0]=U.toString()),U=Zo);for(let $=0;$<U.length;$++){const Z=We(v,U[$],I||y.handleEvent,!1,y.h||y);if(!Z)break;y.g[Z.key]=Z}y=u.J?M(u.J):{},u.u?(u.v||(u.v="POST"),y["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.B,u.v,u.u,y)):(u.v="GET",u.g.ea(u.B,u.v,null,y)),gr(),Pl(u.i,u.v,u.B,u.l,u.S,u.u)}mn.prototype.ba=function(u){u=u.target;const y=this.O;y&&Kn(u)==3?y.j():this.Y(u)},mn.prototype.Y=function(u){try{if(u==this.g)e:{const Se=Kn(this.g),lt=this.g.ya(),qe=this.g.ca();if(!(Se<3)&&(Se!=3||this.g&&(this.h.h||this.g.la()||zl(this.g)))){this.K||Se!=4||lt==7||(lt==8||qe<=0?gr(3):gr(2)),zs(this);var y=this.g.ca();this.X=y;var v=Ol(this);if(this.o=y==200,kl(this.i,this.v,this.B,this.l,this.S,Se,y),this.o){if(this.U&&!this.L){t:{if(this.g){var I,U=this.g;if((I=U.g?U.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!R(I)){var $=I;break t}}$=null}if(u=$)jn(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Xe(this,u);else{this.o=!1,this.m=3,it(12),vr(this),qi(this);break e}}if(this.R){u=!0;let ft;for(;!this.K&&this.C<v.length;)if(ft=Ll(this,v),ft==na){Se==4&&(this.m=4,it(14),u=!1),jn(this.i,this.l,null,"[Incomplete Response]");break}else if(ft==Vl){this.m=4,it(15),jn(this.i,this.l,v,"[Invalid Chunk]"),u=!1;break}else jn(this.i,this.l,ft,null),Xe(this,ft);if(Ml(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Se!=4||v.length!=0||this.h.h||(this.m=1,it(16),u=!1),this.o=this.o&&u,!u)jn(this.i,this.l,v,"[Invalid Chunked Response]"),vr(this),qi(this);else if(v.length>0&&!this.W){this.W=!0;var Z=this.j;Z.g==this&&Z.aa&&!Z.P&&(Z.j.info("Great, no buffering proxy detected. Bytes received: "+v.length),Zi(Z),Z.P=!0,it(11))}}else jn(this.i,this.l,v,null),Xe(this,v);Se==4&&vr(this),this.o&&!this.K&&(Se==4?Xs(this.j,this):(this.o=!1,$i(this)))}else ma(this.g),y==400&&v.indexOf("Unknown SID")>0?(this.m=3,it(12)):(this.m=0,it(13)),vr(this),qi(this)}}}catch{}finally{}};function Ol(u){if(!Ml(u))return u.g.la();const y=zl(u.g);if(y==="")return"";let v="";const I=y.length,U=Kn(u.g)==4;if(!u.h.i){if(typeof TextDecoder>"u")return vr(u),qi(u),"";u.h.i=new h.TextDecoder}for(let $=0;$<I;$++)u.h.h=!0,v+=u.h.i.decode(y[$],{stream:!(U&&$==I-1)});return y.length=0,u.h.g+=v,u.C=0,u.h.g}function Ml(u){return u.g?u.v=="GET"&&u.M!=2&&u.j.Aa:!1}function Ll(u,y){var v=u.C,I=y.indexOf(`
`,v);return I==-1?na:(v=Number(y.substring(v,I)),isNaN(v)?Vl:(I+=1,I+v>y.length?na:(y=y.slice(I,I+v),u.C=I+v,y)))}mn.prototype.cancel=function(){this.K=!0,vr(this)};function $i(u){u.T=Date.now()+u.H,ia(u,u.H)}function ia(u,y){if(u.D!=null)throw Error("WatchDog timer not null");u.D=Qr(m(u.aa,u),y)}function zs(u){u.D&&(h.clearTimeout(u.D),u.D=null)}mn.prototype.aa=function(){this.D=null;const u=Date.now();u-this.T>=0?(Nl(this.i,this.B),this.M!=2&&(gr(),it(17)),vr(this),this.m=2,qi(this)):ia(this,this.T-u)};function qi(u){u.j.I==0||u.K||Xs(u.j,u)}function vr(u){zs(u);var y=u.O;y&&typeof y.dispose=="function"&&y.dispose(),u.O=null,Ls(u.V),u.g&&(y=u.g,u.g=null,y.abort(),y.dispose())}function Xe(u,y){try{var v=u.j;if(v.I!=0&&(v.g==u||oa(v.h,u))){if(!u.L&&oa(v.h,u)&&v.I==3){try{var I=v.Ba.g.parse(y)}catch{I=null}if(Array.isArray(I)&&I.length==3){var U=I;if(U[0]==0){e:if(!v.v){if(v.g)if(v.g.F+3e3<u.F)Ys(v),an(v);else break e;Xn(v),it(18)}}else v.xa=U[1],0<v.xa-v.K&&U[2]<37500&&v.F&&v.A==0&&!v.C&&(v.C=Qr(m(v.Va,v),6e3));Hi(v.h)<=1&&v.ta&&(v.ta=void 0)}else ln(v,11)}else if((u.L||v.g==u)&&Ys(v),!R(y))for(U=v.Ba.g.parse(y),y=0;y<U.length;y++){let qe=U[y];const ft=qe[0];if(!(ft<=v.K))if(v.K=ft,qe=qe[1],v.I==2)if(qe[0]=="c"){v.M=qe[1],v.ba=qe[2];const un=qe[3];un!=null&&(v.ka=un,v.j.info("VER="+v.ka));const Ar=qe[4];Ar!=null&&(v.za=Ar,v.j.info("SVER="+v.za));const Jn=qe[5];Jn!=null&&typeof Jn=="number"&&Jn>0&&(I=1.5*Jn,v.O=I,v.j.info("backChannelRequestTimeoutMs_="+I)),I=v;const Zn=u.g;if(Zn){const eo=Zn.g?Zn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(eo){var $=I.h;$.g||eo.indexOf("spdy")==-1&&eo.indexOf("quic")==-1&&eo.indexOf("h2")==-1||($.j=$.l,$.g=new Set,$.h&&($s($,$.h),$.h=null))}if(I.G){const _a=Zn.g?Zn.g.getResponseHeader("X-HTTP-Session-Id"):null;_a&&(I.wa=_a,je(I.J,I.G,_a))}}v.I=3,v.l&&v.l.ra(),v.aa&&(v.T=Date.now()-u.F,v.j.info("Handshake RTT: "+v.T+"ms")),I=v;var Z=u;if(I.na=ya(I,I.L?I.ba:null,I.W),Z.L){Wi(I.h,Z);var Se=Z,lt=I.O;lt&&(Se.H=lt),Se.D&&(zs(Se),$i(Se)),I.g=Z}else Mt(I);v.i.length>0&&Sr(v)}else qe[0]!="stop"&&qe[0]!="close"||ln(v,7);else v.I==3&&(qe[0]=="stop"||qe[0]=="close"?qe[0]=="stop"?ln(v,7):Ks(v):qe[0]!="noop"&&v.l&&v.l.qa(qe),v.A=0)}}gr(4)}catch{}}var eh=class{constructor(u,y){this.g=u,this.map=y}};function Bs(u){this.l=u||10,h.PerformanceNavigationTiming?(u=h.performance.getEntriesByType("navigation"),u=u.length>0&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function sa(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function Hi(u){return u.h?1:u.g?u.g.size:0}function oa(u,y){return u.h?u.h==y:u.g?u.g.has(y):!1}function $s(u,y){u.g?u.g.add(y):u.h=y}function Wi(u,y){u.h&&u.h==y?u.h=null:u.g&&u.g.has(y)&&u.g.delete(y)}Bs.prototype.cancel=function(){if(this.i=rn(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function rn(u){if(u.h!=null)return u.i.concat(u.h.G);if(u.g!=null&&u.g.size!==0){let y=u.i;for(const v of u.g.values())y=y.concat(v.G);return y}return x(u.i)}var bl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function sn(u,y){if(u){u=u.split("&");for(let v=0;v<u.length;v++){const I=u[v].indexOf("=");let U,$=null;I>=0?(U=u[v].substring(0,I),$=u[v].substring(I+1)):U=u[v],y(U,$?decodeURIComponent($.replace(/\+/g," ")):"")}}}function Bn(u){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let y;u instanceof Bn?(this.l=u.l,Gi(this,u.j),this.o=u.o,this.g=u.g,$n(this,u.u),this.h=u.h,Zr(this,pa(u.i)),this.m=u.m):u&&(y=String(u).match(bl))?(this.l=!1,Gi(this,y[1]||"",!0),this.o=Ki(y[2]||""),this.g=Ki(y[3]||"",!0),$n(this,y[4]),this.h=Ki(y[5]||"",!0),Zr(this,y[6]||"",!0),this.m=Ki(y[7]||"")):(this.l=!1,this.i=new Oe(null,this.l))}Bn.prototype.toString=function(){const u=[];var y=this.j;y&&u.push(Qi(y,la,!0),":");var v=this.g;return(v||y=="file")&&(u.push("//"),(y=this.o)&&u.push(Qi(y,la,!0),"@"),u.push(zn(v).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),v=this.u,v!=null&&u.push(":",String(v))),(v=this.h)&&(this.g&&v.charAt(0)!="/"&&u.push("/"),u.push(Qi(v,v.charAt(0)=="/"?Yi:ua,!0))),(v=this.i.toString())&&u.push("?",v),(v=this.m)&&u.push("#",Qi(v,ca)),u.join("")},Bn.prototype.resolve=function(u){const y=gn(this);let v=!!u.j;v?Gi(y,u.j):v=!!u.o,v?y.o=u.o:v=!!u.g,v?y.g=u.g:v=u.u!=null;var I=u.h;if(v)$n(y,u.u);else if(v=!!u.h){if(I.charAt(0)!="/")if(this.g&&!this.h)I="/"+I;else{var U=y.h.lastIndexOf("/");U!=-1&&(I=y.h.slice(0,U+1)+I)}if(U=I,U==".."||U==".")I="";else if(U.indexOf("./")!=-1||U.indexOf("/.")!=-1){I=U.lastIndexOf("/",0)==0,U=U.split("/");const $=[];for(let Z=0;Z<U.length;){const Se=U[Z++];Se=="."?I&&Z==U.length&&$.push(""):Se==".."?(($.length>1||$.length==1&&$[0]!="")&&$.pop(),I&&Z==U.length&&$.push("")):($.push(Se),I=!0)}I=$.join("/")}else I=U}return v?y.h=I:v=u.i.toString()!=="",v?Zr(y,pa(u.i)):v=!!u.m,v&&(y.m=u.m),y};function gn(u){return new Bn(u)}function Gi(u,y,v){u.j=v?Ki(y,!0):y,u.j&&(u.j=u.j.replace(/:$/,""))}function $n(u,y){if(y){if(y=Number(y),isNaN(y)||y<0)throw Error("Bad port number "+y);u.u=y}else u.u=null}function Zr(u,y,v){y instanceof Oe?(u.i=y,Hs(u.i,u.l)):(v||(y=Qi(y,th)),u.i=new Oe(y,u.l))}function je(u,y,v){u.i.set(y,v)}function wr(u){return je(u,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),u}function Ki(u,y){return u?y?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Qi(u,y,v){return typeof u=="string"?(u=encodeURI(u).replace(y,aa),v&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function aa(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var la=/[#\/\?@]/g,ua=/[#\?:]/g,Yi=/[#\?]/g,th=/[#\?@]/g,ca=/#/g;function Oe(u,y){this.h=this.g=null,this.i=u||null,this.j=!!y}function qn(u){u.g||(u.g=new Map,u.h=0,u.i&&sn(u.i,function(y,v){u.add(decodeURIComponent(y.replace(/\+/g," ")),v)}))}r=Oe.prototype,r.add=function(u,y){qn(this),this.i=null,u=Hn(this,u);let v=this.g.get(u);return v||this.g.set(u,v=[]),v.push(y),this.h+=1,this};function ha(u,y){qn(u),y=Hn(u,y),u.g.has(y)&&(u.i=null,u.h-=u.g.get(y).length,u.g.delete(y))}function qs(u,y){return qn(u),y=Hn(u,y),u.g.has(y)}r.forEach=function(u,y){qn(this),this.g.forEach(function(v,I){v.forEach(function(U){u.call(y,U,I,this)},this)},this)};function da(u,y){qn(u);let v=[];if(typeof y=="string")qs(u,y)&&(v=v.concat(u.g.get(Hn(u,y))));else for(u=Array.from(u.g.values()),y=0;y<u.length;y++)v=v.concat(u[y]);return v}r.set=function(u,y){return qn(this),this.i=null,u=Hn(this,u),qs(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[y]),this.h+=1,this},r.get=function(u,y){return u?(u=da(this,u),u.length>0?String(u[0]):y):y};function fa(u,y,v){ha(u,y),v.length>0&&(u.i=null,u.g.set(Hn(u,y),x(v)),u.h+=v.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],y=Array.from(this.g.keys());for(let I=0;I<y.length;I++){var v=y[I];const U=zn(v);v=da(this,v);for(let $=0;$<v.length;$++){let Z=U;v[$]!==""&&(Z+="="+zn(v[$])),u.push(Z)}}return this.i=u.join("&")};function pa(u){const y=new Oe;return y.i=u.i,u.g&&(y.g=new Map(u.g),y.h=u.h),y}function Hn(u,y){return y=String(y),u.j&&(y=y.toLowerCase()),y}function Hs(u,y){y&&!u.j&&(qn(u),u.i=null,u.g.forEach(function(v,I){const U=I.toLowerCase();I!=U&&(ha(this,I),fa(this,U,v))},u)),u.j=y}function Wn(u,y){const v=new Yr;if(h.Image){const I=new Image;I.onload=_(Pt,v,"TestLoadImage: loaded",!0,y,I),I.onerror=_(Pt,v,"TestLoadImage: error",!1,y,I),I.onabort=_(Pt,v,"TestLoadImage: abort",!1,y,I),I.ontimeout=_(Pt,v,"TestLoadImage: timeout",!1,y,I),h.setTimeout(function(){I.ontimeout&&I.ontimeout()},1e4),I.src=u}else y(!1)}function Gn(u,y){const v=new Yr,I=new AbortController,U=setTimeout(()=>{I.abort(),Pt(v,"TestPingServer: timeout",!1,y)},1e4);fetch(u,{signal:I.signal}).then($=>{clearTimeout(U),$.ok?Pt(v,"TestPingServer: ok",!0,y):Pt(v,"TestPingServer: server error",!1,y)}).catch(()=>{clearTimeout(U),Pt(v,"TestPingServer: error",!1,y)})}function Pt(u,y,v,I,U){try{U&&(U.onload=null,U.onerror=null,U.onabort=null,U.ontimeout=null),I(v)}catch{}}function Xi(){this.g=new zi}function Er(u){this.i=u.Sb||null,this.h=u.ab||!1}w(Er,Wr),Er.prototype.g=function(){return new on(this.i,this.h)};function on(u,y){dt.call(this),this.H=u,this.o=y,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}w(on,dt),r=on.prototype,r.open=function(u,y){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=u,this.D=y,this.readyState=1,Pn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const y={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};u&&(y.body=u),(this.H||h).fetch(new Request(this.D,y)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,ei(this)),this.readyState=0},r.Pa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,Pn(this)),this.g&&(this.readyState=3,Pn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Fl(this)}else u.text().then(this.Oa.bind(this),this.ga.bind(this))};function Fl(u){u.j.read().then(u.Ma.bind(u)).catch(u.ga.bind(u))}r.Ma=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var y=u.value?u.value:new Uint8Array(0);(y=this.B.decode(y,{stream:!u.done}))&&(this.response=this.responseText+=y)}u.done?ei(this):Pn(this),this.readyState==3&&Fl(this)}},r.Oa=function(u){this.g&&(this.response=this.responseText=u,ei(this))},r.Na=function(u){this.g&&(this.response=u,ei(this))},r.ga=function(){this.g&&ei(this)};function ei(u){u.readyState=4,u.l=null,u.j=null,u.B=null,Pn(u)}r.setRequestHeader=function(u,y){this.A.append(u,y)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],y=this.h.entries();for(var v=y.next();!v.done;)v=v.value,u.push(v[0]+": "+v[1]),v=y.next();return u.join(`\r
`)};function Pn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(on.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Ul(u){let y="";return fe(u,function(v,I){y+=I,y+=":",y+=v,y+=`\r
`}),y}function Ws(u,y,v){e:{for(I in v){var I=!1;break e}I=!0}I||(v=Ul(v),typeof u=="string"?v!=null&&zn(v):je(u,y,v))}function Ge(u){dt.call(this),this.headers=new Map,this.L=u||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}w(Ge,dt);var jl=/^https?$/i,nh=["POST","PUT"];r=Ge.prototype,r.Fa=function(u){this.H=u},r.ea=function(u,y,v,I){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);y=y?y.toUpperCase():"GET",this.D=u,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():xl.g(),this.g.onreadystatechange=T(m(this.Ca,this));try{this.B=!0,this.g.open(y,String(u),!0),this.B=!1}catch($){ti(this,$);return}if(u=v||"",v=new Map(this.headers),I)if(Object.getPrototypeOf(I)===Object.prototype)for(var U in I)v.set(U,I[U]);else if(typeof I.keys=="function"&&typeof I.get=="function")for(const $ of I.keys())v.set($,I.get($));else throw Error("Unknown input type for opt_headers: "+String(I));I=Array.from(v.keys()).find($=>$.toLowerCase()=="content-type"),U=h.FormData&&u instanceof h.FormData,!(Array.prototype.indexOf.call(nh,y,void 0)>=0)||I||U||v.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[$,Z]of v)this.g.setRequestHeader($,Z);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(u),this.v=!1}catch($){ti(this,$)}};function ti(u,y){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=y,u.o=5,ni(u),Ir(u)}function ni(u){u.A||(u.A=!0,at(u,"complete"),at(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=u||7,at(this,"complete"),at(this,"abort"),Ir(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ir(this,!0)),Ge.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Tr(this):this.Xa())},r.Xa=function(){Tr(this)};function Tr(u){if(u.h&&typeof l<"u"){if(u.v&&Kn(u)==4)setTimeout(u.Ca.bind(u),0);else if(at(u,"readystatechange"),Kn(u)==4){u.h=!1;try{const $=u.ca();e:switch($){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var y=!0;break e;default:y=!1}var v;if(!(v=y)){var I;if(I=$===0){let Z=String(u.D).match(bl)[1]||null;!Z&&h.self&&h.self.location&&(Z=h.self.location.protocol.slice(0,-1)),I=!jl.test(Z?Z.toLowerCase():"")}v=I}if(v)at(u,"complete"),at(u,"success");else{u.o=6;try{var U=Kn(u)>2?u.g.statusText:""}catch{U=""}u.l=U+" ["+u.ca()+"]",ni(u)}}finally{Ir(u)}}}}function Ir(u,y){if(u.g){u.m&&(clearTimeout(u.m),u.m=null);const v=u.g;u.g=null,y||at(u,"ready");try{v.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Kn(u){return u.g?u.g.readyState:0}r.ca=function(){try{return Kn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(u){if(this.g){var y=this.g.responseText;return u&&y.indexOf(u)==0&&(y=y.substring(u.length)),Rl(y)}};function zl(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.F){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function ma(u){const y={};u=(u.g&&Kn(u)>=2&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let I=0;I<u.length;I++){if(R(u[I]))continue;var v=js(u[I]);const U=v[0];if(v=v[1],typeof v!="string")continue;v=v.trim();const $=y[U]||[];y[U]=$,$.push(v)}se(y,function(I){return I.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Qn(u,y,v){return v&&v.internalChannelParams&&v.internalChannelParams[u]||y}function Gs(u){this.za=0,this.i=[],this.j=new Yr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Qn("failFast",!1,u),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Qn("baseRetryDelayMs",5e3,u),this.Za=Qn("retryDelaySeedMs",1e4,u),this.Ta=Qn("forwardChannelMaxRetries",2,u),this.va=Qn("forwardChannelRequestTimeoutMs",2e4,u),this.ma=u&&u.xmlHttpFactory||void 0,this.Ua=u&&u.Rb||void 0,this.Aa=u&&u.useFetchStreams||!1,this.O=void 0,this.L=u&&u.supportsCrossDomainXhr||!1,this.M="",this.h=new Bs(u&&u.concurrentRequestLimit),this.Ba=new Xi,this.S=u&&u.fastHandshake||!1,this.R=u&&u.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=u&&u.Pb||!1,u&&u.ua&&this.j.ua(),u&&u.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&u&&u.detectBufferingProxy||!1,this.ia=void 0,u&&u.longPollingTimeout&&u.longPollingTimeout>0&&(this.ia=u.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Gs.prototype,r.ka=8,r.I=1,r.connect=function(u,y,v,I){it(0),this.W=u,this.H=y||{},v&&I!==void 0&&(this.H.OSID=v,this.H.OAID=I),this.F=this.X,this.J=ya(this,null,this.W),Sr(this)};function Ks(u){if(Qs(u),u.I==3){var y=u.V++,v=gn(u.J);if(je(v,"SID",u.M),je(v,"RID",y),je(v,"TYPE","terminate"),Yn(u,v),y=new mn(u,u.j,y),y.M=2,y.A=wr(gn(v)),v=!1,h.navigator&&h.navigator.sendBeacon)try{v=h.navigator.sendBeacon(y.A.toString(),"")}catch{}!v&&h.Image&&(new Image().src=y.A,v=!0),v||(y.g=$l(y.j,null),y.g.ea(y.A)),y.F=Date.now(),$i(y)}es(u)}function an(u){u.g&&(Zi(u),u.g.cancel(),u.g=null)}function Qs(u){an(u),u.v&&(h.clearTimeout(u.v),u.v=null),Ys(u),u.h.cancel(),u.m&&(typeof u.m=="number"&&h.clearTimeout(u.m),u.m=null)}function Sr(u){if(!sa(u.h)&&!u.m){u.m=!0;var y=u.Ea;ye||S(),Re||(ye(),Re=!0),N.add(y,u),u.D=0}}function Bl(u,y){return Hi(u.h)>=u.h.j-(u.m?1:0)?!1:u.m?(u.i=y.G.concat(u.i),!0):u.I==1||u.I==2||u.D>=(u.Sa?0:u.Ta)?!1:(u.m=Qr(m(u.Ea,u,y),Js(u,u.D)),u.D++,!0)}r.Ea=function(u){if(this.m)if(this.m=null,this.I==1){if(!u){this.V=Math.floor(Math.random()*1e5),u=this.V++;const U=new mn(this,this.j,u);let $=this.o;if(this.U&&($?($=M($),Te($,this.U)):$=this.U),this.u!==null||this.R||(U.J=$,$=null),this.S)e:{for(var y=0,v=0;v<this.i.length;v++){t:{var I=this.i[v];if("__data__"in I.map&&(I=I.map.__data__,typeof I=="string")){I=I.length;break t}I=void 0}if(I===void 0)break;if(y+=I,y>4096){y=v;break e}if(y===4096||v===this.i.length-1){y=v+1;break e}}y=1e3}else y=1e3;y=ga(this,U,y),v=gn(this.J),je(v,"RID",u),je(v,"CVER",22),this.G&&je(v,"X-HTTP-Session-Id",this.G),Yn(this,v),$&&(this.R?y="headers="+zn(Ul($))+"&"+y:this.u&&Ws(v,this.u,$)),$s(this.h,U),this.Ra&&je(v,"TYPE","init"),this.S?(je(v,"$req",y),je(v,"SID","null"),U.U=!0,Cn(U,v,null)):Cn(U,v,y),this.I=2}}else this.I==3&&(u?Ji(this,u):this.i.length==0||sa(this.h)||Ji(this))};function Ji(u,y){var v;y?v=y.l:v=u.V++;const I=gn(u.J);je(I,"SID",u.M),je(I,"RID",v),je(I,"AID",u.K),Yn(u,I),u.u&&u.o&&Ws(I,u.u,u.o),v=new mn(u,u.j,v,u.D+1),u.u===null&&(v.J=u.o),y&&(u.i=y.G.concat(u.i)),y=ga(u,v,1e3),v.H=Math.round(u.va*.5)+Math.round(u.va*.5*Math.random()),$s(u.h,v),Cn(v,I,y)}function Yn(u,y){u.H&&fe(u.H,function(v,I){je(y,I,v)}),u.l&&fe({},function(v,I){je(y,I,v)})}function ga(u,y,v){v=Math.min(u.i.length,v);const I=u.l?m(u.l.Ka,u.l,u):null;e:{var U=u.i;let Se=-1;for(;;){const lt=["count="+v];Se==-1?v>0?(Se=U[0].g,lt.push("ofs="+Se)):Se=0:lt.push("ofs="+Se);let qe=!0;for(let ft=0;ft<v;ft++){var $=U[ft].g;const un=U[ft].map;if($-=Se,$<0)Se=Math.max(0,U[ft].g-100),qe=!1;else try{$="req"+$+"_"||"";try{var Z=un instanceof Map?un:Object.entries(un);for(const[Ar,Jn]of Z){let Zn=Jn;p(Jn)&&(Zn=Hr(Jn)),lt.push($+Ar+"="+encodeURIComponent(Zn))}}catch(Ar){throw lt.push($+"type="+encodeURIComponent("_badmap")),Ar}}catch{I&&I(un)}}if(qe){Z=lt.join("&");break e}}Z=void 0}return u=u.i.splice(0,v),y.G=u,Z}function Mt(u){if(!u.g&&!u.v){u.Y=1;var y=u.Da;ye||S(),Re||(ye(),Re=!0),N.add(y,u),u.A=0}}function Xn(u){return u.g||u.v||u.A>=3?!1:(u.Y++,u.v=Qr(m(u.Da,u),Js(u,u.A)),u.A++,!0)}r.Da=function(){if(this.v=null,ri(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var u=4*this.T;this.j.info("BP detection timer enabled: "+u),this.B=Qr(m(this.Wa,this),u)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,it(10),an(this),ri(this))};function Zi(u){u.B!=null&&(h.clearTimeout(u.B),u.B=null)}function ri(u){u.g=new mn(u,u.j,"rpc",u.Y),u.u===null&&(u.g.J=u.o),u.g.P=0;var y=gn(u.na);je(y,"RID","rpc"),je(y,"SID",u.M),je(y,"AID",u.K),je(y,"CI",u.F?"0":"1"),!u.F&&u.ia&&je(y,"TO",u.ia),je(y,"TYPE","xmlhttp"),Yn(u,y),u.u&&u.o&&Ws(y,u.u,u.o),u.O&&(u.g.H=u.O);var v=u.g;u=u.ba,v.M=1,v.A=wr(gn(y)),v.u=null,v.R=!0,ra(v,u)}r.Va=function(){this.C!=null&&(this.C=null,an(this),Xn(this),it(19))};function Ys(u){u.C!=null&&(h.clearTimeout(u.C),u.C=null)}function Xs(u,y){var v=null;if(u.g==y){Ys(u),Zi(u),u.g=null;var I=2}else if(oa(u.h,y))v=y.G,Wi(u.h,y),I=1;else return;if(u.I!=0){if(y.o)if(I==1){v=y.u?y.u.length:0,y=Date.now()-y.F;var U=u.D;I=Kr(),at(I,new ta(I,v)),Sr(u)}else Mt(u);else if(U=y.m,U==3||U==0&&y.X>0||!(I==1&&Bl(u,y)||I==2&&Xn(u)))switch(v&&v.length>0&&(y=u.h,y.i=y.i.concat(v)),U){case 1:ln(u,5);break;case 4:ln(u,10);break;case 3:ln(u,6);break;default:ln(u,2)}}}function Js(u,y){let v=u.Qa+Math.floor(Math.random()*u.Za);return u.isActive()||(v*=2),v*y}function ln(u,y){if(u.j.info("Error code "+y),y==2){var v=m(u.bb,u),I=u.Ua;const U=!I;I=new Bn(I||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Gi(I,"https"),wr(I),U?Wn(I.toString(),v):Gn(I.toString(),v)}else it(2);u.I=0,u.l&&u.l.pa(y),es(u),Qs(u)}r.bb=function(u){u?(this.j.info("Successfully pinged google.com"),it(2)):(this.j.info("Failed to ping google.com"),it(1))};function es(u){if(u.I=0,u.ja=[],u.l){const y=rn(u.h);(y.length!=0||u.i.length!=0)&&(L(u.ja,y),L(u.ja,u.i),u.h.i.length=0,x(u.i),u.i.length=0),u.l.oa()}}function ya(u,y,v){var I=v instanceof Bn?gn(v):new Bn(v);if(I.g!="")y&&(I.g=y+"."+I.g),$n(I,I.u);else{var U=h.location;I=U.protocol,y=y?y+"."+U.hostname:U.hostname,U=+U.port;const $=new Bn(null);I&&Gi($,I),y&&($.g=y),U&&$n($,U),v&&($.h=v),I=$}return v=u.G,y=u.wa,v&&y&&je(I,v,y),je(I,"VER",u.ka),Yn(u,I),I}function $l(u,y,v){if(y&&!u.L)throw Error("Can't create secondary domain capable XhrIo object.");return y=u.Aa&&!u.ma?new Ge(new Er({ab:v})):new Ge(u.ma),y.Fa(u.L),y}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function ql(){}r=ql.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Zs(){}Zs.prototype.g=function(u,y){return new kt(u,y)};function kt(u,y){dt.call(this),this.g=new Gs(y),this.l=u,this.h=y&&y.messageUrlParams||null,u=y&&y.messageHeaders||null,y&&y.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=y&&y.initMessageHeaders||null,y&&y.messageContentType&&(u?u["X-WebChannel-Content-Type"]=y.messageContentType:u={"X-WebChannel-Content-Type":y.messageContentType}),y&&y.sa&&(u?u["X-WebChannel-Client-Profile"]=y.sa:u={"X-WebChannel-Client-Profile":y.sa}),this.g.U=u,(u=y&&y.Qb)&&!R(u)&&(this.g.u=u),this.A=y&&y.supportsCrossDomainXhr||!1,this.v=y&&y.sendRawJson||!1,(y=y&&y.httpSessionIdParam)&&!R(y)&&(this.g.G=y,u=this.h,u!==null&&y in u&&(u=this.h,y in u&&delete u[y])),this.j=new ii(this)}w(kt,dt),kt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},kt.prototype.close=function(){Ks(this.g)},kt.prototype.o=function(u){var y=this.g;if(typeof u=="string"){var v={};v.__data__=u,u=v}else this.v&&(v={},v.__data__=Hr(u),u=v);y.i.push(new eh(y.Ya++,u)),y.I==3&&Sr(y)},kt.prototype.N=function(){this.g.l=null,delete this.j,Ks(this.g),delete this.g,kt.Z.N.call(this)};function Hl(u){bs.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var y=u.__sm__;if(y){e:{for(const v in y){u=v;break e}u=void 0}(this.i=u)&&(u=this.i,y=y!==null&&u in y?y[u]:void 0),this.data=y}else this.data=u}w(Hl,bs);function Wl(){ea.call(this),this.status=1}w(Wl,ea);function ii(u){this.g=u}w(ii,ql),ii.prototype.ra=function(){at(this.g,"a")},ii.prototype.qa=function(u){at(this.g,new Hl(u))},ii.prototype.pa=function(u){at(this.g,new Wl)},ii.prototype.oa=function(){at(this.g,"b")},Zs.prototype.createWebChannel=Zs.prototype.g,kt.prototype.send=kt.prototype.o,kt.prototype.open=kt.prototype.m,kt.prototype.close=kt.prototype.close,hv=function(){return new Zs},cv=function(){return Kr()},uv=Rn,Yd={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Xr.NO_ERROR=0,Xr.TIMEOUT=8,Xr.HTTP_ERROR=6,Wu=Xr,Jr.COMPLETE="complete",lv=Jr,Cl.EventType=Gr,Gr.OPEN="a",Gr.CLOSE="b",Gr.ERROR="c",Gr.MESSAGE="d",dt.prototype.listen=dt.prototype.J,Wa=Cl,Ge.prototype.listenOnce=Ge.prototype.K,Ge.prototype.getLastError=Ge.prototype.Ha,Ge.prototype.getLastErrorCode=Ge.prototype.ya,Ge.prototype.getStatus=Ge.prototype.ca,Ge.prototype.getResponseJson=Ge.prototype.La,Ge.prototype.getResponseText=Ge.prototype.la,Ge.prototype.send=Ge.prototype.ea,Ge.prototype.setWithCredentials=Ge.prototype.Fa,av=Ge}).apply(typeof Uu<"u"?Uu:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}zt.UNAUTHENTICATED=new zt(null),zt.GOOGLE_CREDENTIALS=new zt("google-credentials-uid"),zt.FIRST_PARTY=new zt("first-party-uid"),zt.MOCK_USER=new zt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qo="12.14.0";function nS(r){qo=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is=new Nc("@firebase/firestore");function To(){return Is.logLevel}function ne(r,...e){if(Is.logLevel<=Ve.DEBUG){const t=e.map(If);Is.debug(`Firestore (${qo}): ${r}`,...t)}}function Ur(r,...e){if(Is.logLevel<=Ve.ERROR){const t=e.map(If);Is.error(`Firestore (${qo}): ${r}`,...t)}}function Ss(r,...e){if(Is.logLevel<=Ve.WARN){const t=e.map(If);Is.warn(`Firestore (${qo}): ${r}`,...t)}}function If(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(r,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,dv(r,i,t)}function dv(r,e,t){let i=`FIRESTORE (${qo}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Ur(i),new Error(i)}function $e(r,e,t,i){let o="Unexpected state";typeof t=="string"?o=t:i=t,r||dv(e,o,i)}function Ae(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class le extends Un{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fv{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class rS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(zt.UNAUTHENTICATED)))}shutdown(){}}class iS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class sS{constructor(e){this.t=e,this.currentUser=zt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){$e(this.o===void 0,42304);let i=this.i;const o=f=>this.i!==i?(i=this.i,t(f)):Promise.resolve();let l=new Ci;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new Ci,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const f=l;e.enqueueRetryable((async()=>{await f.promise,await o(this.currentUser)}))},p=f=>{ne("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=f,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((f=>p(f))),setTimeout((()=>{if(!this.auth){const f=this.t.getImmediate({optional:!0});f?p(f):(ne("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new Ci)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(ne("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?($e(typeof i.accessToken=="string",31837,{l:i}),new fv(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return $e(e===null||typeof e=="string",2055,{h:e}),new zt(e)}}class oS{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=zt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class aS{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new oS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(zt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Wg{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class lS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,sr(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){$e(this.o===void 0,3512);const i=l=>{l.error!=null&&ne("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,ne("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>i(l)))};const o=l=>{ne("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):ne("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Wg(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?($e(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Wg(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uS(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<r;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const o=uS(40);for(let l=0;l<o.length;++l)i.length<20&&o[l]<t&&(i+=e.charAt(o[l]%62))}return i}}function ke(r,e){return r<e?-1:r>e?1:0}function Xd(r,e){const t=Math.min(r.length,e.length);for(let i=0;i<t;i++){const o=r.charAt(i),l=e.charAt(i);if(o!==l)return Nd(o)===Nd(l)?ke(o,l):Nd(o)?1:-1}return ke(r.length,e.length)}const cS=55296,hS=57343;function Nd(r){const e=r.charCodeAt(0);return e>=cS&&e<=hS}function Mo(r,e,t){return r.length===e.length&&r.every(((i,o)=>t(i,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg="__name__";class ir{constructor(e,t,i){t===void 0?t=0:t>e.length&&_e(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&_e(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return ir.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ir?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let o=0;o<i;o++){const l=ir.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return ke(e.length,t.length)}static compareSegments(e,t){const i=ir.isNumericId(e),o=ir.isNumericId(t);return i&&!o?-1:!i&&o?1:i&&o?ir.extractNumericId(e).compare(ir.extractNumericId(t)):Xd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ri.fromString(e.substring(4,e.length-2))}}class Ye extends ir{construct(e,t,i){return new Ye(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new le(q.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((o=>o.length>0)))}return new Ye(t)}static emptyPath(){return new Ye([])}}const dS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Vt extends ir{construct(e,t,i){return new Vt(e,t,i)}static isValidIdentifier(e){return dS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Vt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Gg}static keyField(){return new Vt([Gg])}static fromServerFormat(e){const t=[];let i="",o=0;const l=()=>{if(i.length===0)throw new le(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let h=!1;for(;o<e.length;){const p=e[o];if(p==="\\"){if(o+1===e.length)throw new le(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const f=e[o+1];if(f!=="\\"&&f!=="."&&f!=="`")throw new le(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=f,o+=2}else p==="`"?(h=!h,o++):p!=="."||h?(i+=p,o++):(l(),o++)}if(l(),h)throw new le(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Vt(t)}static emptyPath(){return new Vt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.path=e}static fromPath(e){return new pe(Ye.fromString(e))}static fromName(e){return new pe(Ye.fromString(e).popFirst(5))}static empty(){return new pe(Ye.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ye.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ye.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new pe(new Ye(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(r,e,t){if(!t)throw new le(q.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function fS(r,e,t,i){if(e===!0&&i===!0)throw new le(q.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Kg(r){if(!pe.isDocumentKey(r))throw new le(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Qg(r){if(pe.isDocumentKey(r))throw new le(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function mv(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function xc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":_e(12329,{type:typeof r})}function or(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new le(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=xc(r);throw new le(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _t(r,e){const t={typeString:r};return e&&(t.value=e),t}function fl(r,e){if(!mv(r))throw new le(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const o=e[i].typeString,l="value"in e[i]?{value:e[i].value}:void 0;if(!(i in r)){t=`JSON missing required field: '${i}'`;break}const h=r[i];if(o&&typeof h!==o){t=`JSON field '${i}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${i}' field to equal '${l.value}'`;break}}if(t)throw new le(q.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yg=-62135596800,Xg=1e6;class Ke{static now(){return Ke.fromMillis(Date.now())}static fromDate(e){return Ke.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Xg);return new Ke(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new le(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new le(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Yg)throw new le(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new le(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Xg}_compareTo(e){return this.seconds===e.seconds?ke(this.nanoseconds,e.nanoseconds):ke(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ke._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(fl(e,Ke._jsonSchema))return new Ke(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Yg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ke._jsonSchemaVersion="firestore/timestamp/1.0",Ke._jsonSchema={type:_t("string",Ke._jsonSchemaVersion),seconds:_t("number"),nanoseconds:_t("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{static fromTimestamp(e){return new Ee(e)}static min(){return new Ee(new Ke(0,0))}static max(){return new Ee(new Ke(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nl=-1;function pS(r,e){const t=r.toTimestamp().seconds,i=r.toTimestamp().nanoseconds+1,o=Ee.fromTimestamp(i===1e9?new Ke(t+1,0):new Ke(t,i));return new xi(o,pe.empty(),e)}function mS(r){return new xi(r.readTime,r.key,nl)}class xi{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new xi(Ee.min(),pe.empty(),nl)}static max(){return new xi(Ee.max(),pe.empty(),nl)}}function gS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=pe.comparator(r.documentKey,e.documentKey),t!==0?t:ke(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class _S{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ho(r){if(r.code!==q.FAILED_PRECONDITION||r.message!==yS)throw r;ne("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&_e(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new H(((i,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(i,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(i,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof H?t:H.resolve(t)}catch(t){return H.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):H.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):H.reject(t)}static resolve(e){return new H(((t,i)=>{t(e)}))}static reject(e){return new H(((t,i)=>{i(e)}))}static waitFor(e){return new H(((t,i)=>{let o=0,l=0,h=!1;e.forEach((p=>{++o,p.next((()=>{++l,h&&l===o&&t()}),(f=>i(f)))})),h=!0,l===o&&t()}))}static or(e){let t=H.resolve(!1);for(const i of e)t=t.next((o=>o?H.resolve(o):i()));return t}static forEach(e,t){const i=[];return e.forEach(((o,l)=>{i.push(t.call(this,o,l))})),this.waitFor(i)}static mapArray(e,t){return new H(((i,o)=>{const l=e.length,h=new Array(l);let p=0;for(let f=0;f<l;f++){const m=f;t(e[m]).next((_=>{h[m]=_,++p,p===l&&i(h)}),(_=>o(_)))}}))}static doWhile(e,t){return new H(((i,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):i()};l()}))}}function vS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Wo(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this.ae(i),this.ue=i=>t.writeSequenceNumber(i))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Dc.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Af=-1;function Vc(r){return r==null}function sc(r){return r===0&&1/r==-1/0}function wS(r){return typeof r=="number"&&Number.isInteger(r)&&!sc(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gv="";function ES(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Jg(e)),e=TS(r.get(t),e);return Jg(e)}function TS(r,e){let t=e;const i=r.length;for(let o=0;o<i;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case gv:t+="";break;default:t+=l}}return t}function Jg(r){return r+gv+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zg(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Fi(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function yv(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t){this.comparator=e,this.root=t||Dt.EMPTY}insert(e,t){return new tt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Dt.BLACK,null,null))}remove(e){return new tt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Dt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const o=this.comparator(e,i.key);if(o===0)return t+i.left.size;o<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ju(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ju(this.root,e,this.comparator,!1)}getReverseIterator(){return new ju(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ju(this.root,e,this.comparator,!0)}}class ju{constructor(e,t,i,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?i(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Dt{constructor(e,t,i,o,l){this.key=e,this.value=t,this.color=i??Dt.RED,this.left=o??Dt.EMPTY,this.right=l??Dt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,o,l){return new Dt(e??this.key,t??this.value,i??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let o=this;const l=i(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,i),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,i)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Dt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Dt.EMPTY;i=o.right.min(),o=o.copy(i.key,i.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Dt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Dt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw _e(43730,{key:this.key,value:this.value});if(this.right.isRed())throw _e(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw _e(27949);return e+(this.isRed()?0:1)}}Dt.EMPTY=null,Dt.RED=!0,Dt.BLACK=!1;Dt.EMPTY=new class{constructor(){this.size=0}get key(){throw _e(57766)}get value(){throw _e(16141)}get color(){throw _e(16727)}get left(){throw _e(29726)}get right(){throw _e(36894)}copy(e,t,i,o,l){return this}insert(e,t,i){return new Dt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.comparator=e,this.data=new tt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const o=i.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ey(this.data.getIterator())}getIteratorFrom(e){return new ey(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof Tt)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new Tt(this.comparator);return t.data=e,t}}class ey{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(e){this.fields=e,e.sort(Vt.comparator)}static empty(){return new fn([])}unionWith(e){let t=new Tt(Vt.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new fn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Mo(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _v extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new _v("Invalid base64 string: "+l):l}})(e);return new Ot(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Ot(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ke(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ot.EMPTY_BYTE_STRING=new Ot("");const IS=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Di(r){if($e(!!r,39018),typeof r=="string"){let e=0;const t=IS.exec(r);if($e(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const i=new Date(r);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:ct(r.seconds),nanos:ct(r.nanos)}}function ct(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Vi(r){return typeof r=="string"?Ot.fromBase64String(r):Ot.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv="server_timestamp",wv="__type__",Ev="__previous_value__",Tv="__local_write_time__";function Rf(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[wv])==null?void 0:i.stringValue)===vv}function Oc(r){const e=r.mapValue.fields[Ev];return Rf(e)?Oc(e):e}function rl(r){const e=Di(r.mapValue.fields[Tv].timestampValue);return new Ke(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SS{constructor(e,t,i,o,l,h,p,f,m,_,w){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=p,this.longPollingOptions=f,this.useFetchStreams=m,this.isUsingEmulator=_,this.apiKey=w}}const oc="(default)";class il{constructor(e,t){this.projectId=e,this.database=t||oc}static empty(){return new il("","")}get isDefaultDatabase(){return this.database===oc}isEqual(e){return e instanceof il&&e.projectId===this.projectId&&e.database===this.database}}function AS(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new le(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new il(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iv="__type__",RS="__max__",zu={mapValue:{}},Sv="__vector__",ac="value";function Oi(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Rf(r)?4:PS(r)?9007199254740991:CS(r)?10:11:_e(28295,{value:r})}function pr(r,e){if(r===e)return!0;const t=Oi(r);if(t!==Oi(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return rl(r).isEqual(rl(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=Di(o.timestampValue),p=Di(l.timestampValue);return h.seconds===p.seconds&&h.nanos===p.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Vi(o.bytesValue).isEqual(Vi(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ct(o.geoPointValue.latitude)===ct(l.geoPointValue.latitude)&&ct(o.geoPointValue.longitude)===ct(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ct(o.integerValue)===ct(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ct(o.doubleValue),p=ct(l.doubleValue);return h===p?sc(h)===sc(p):isNaN(h)&&isNaN(p)}return!1})(r,e);case 9:return Mo(r.arrayValue.values||[],e.arrayValue.values||[],pr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},p=l.mapValue.fields||{};if(Zg(h)!==Zg(p))return!1;for(const f in h)if(h.hasOwnProperty(f)&&(p[f]===void 0||!pr(h[f],p[f])))return!1;return!0})(r,e);default:return _e(52216,{left:r})}}function sl(r,e){return(r.values||[]).find((t=>pr(t,e)))!==void 0}function Lo(r,e){if(r===e)return 0;const t=Oi(r),i=Oi(e);if(t!==i)return ke(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return ke(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const p=ct(l.integerValue||l.doubleValue),f=ct(h.integerValue||h.doubleValue);return p<f?-1:p>f?1:p===f?0:isNaN(p)?isNaN(f)?0:-1:1})(r,e);case 3:return ty(r.timestampValue,e.timestampValue);case 4:return ty(rl(r),rl(e));case 5:return Xd(r.stringValue,e.stringValue);case 6:return(function(l,h){const p=Vi(l),f=Vi(h);return p.compareTo(f)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const p=l.split("/"),f=h.split("/");for(let m=0;m<p.length&&m<f.length;m++){const _=ke(p[m],f[m]);if(_!==0)return _}return ke(p.length,f.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const p=ke(ct(l.latitude),ct(h.latitude));return p!==0?p:ke(ct(l.longitude),ct(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ny(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var T,x,L,z;const p=l.fields||{},f=h.fields||{},m=(T=p[ac])==null?void 0:T.arrayValue,_=(x=f[ac])==null?void 0:x.arrayValue,w=ke(((L=m==null?void 0:m.values)==null?void 0:L.length)||0,((z=_==null?void 0:_.values)==null?void 0:z.length)||0);return w!==0?w:ny(m,_)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===zu.mapValue&&h===zu.mapValue)return 0;if(l===zu.mapValue)return 1;if(h===zu.mapValue)return-1;const p=l.fields||{},f=Object.keys(p),m=h.fields||{},_=Object.keys(m);f.sort(),_.sort();for(let w=0;w<f.length&&w<_.length;++w){const T=Xd(f[w],_[w]);if(T!==0)return T;const x=Lo(p[f[w]],m[_[w]]);if(x!==0)return x}return ke(f.length,_.length)})(r.mapValue,e.mapValue);default:throw _e(23264,{he:t})}}function ty(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ke(r,e);const t=Di(r),i=Di(e),o=ke(t.seconds,i.seconds);return o!==0?o:ke(t.nanos,i.nanos)}function ny(r,e){const t=r.values||[],i=e.values||[];for(let o=0;o<t.length&&o<i.length;++o){const l=Lo(t[o],i[o]);if(l)return l}return ke(t.length,i.length)}function bo(r){return Jd(r)}function Jd(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const i=Di(t);return`time(${i.seconds},${i.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Vi(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return pe.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let i="[",o=!0;for(const l of t.values||[])o?o=!1:i+=",",i+=Jd(l);return i+"]"})(r.arrayValue):"mapValue"in r?(function(t){const i=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of i)l?l=!1:o+=",",o+=`${h}:${Jd(t.fields[h])}`;return o+"}"})(r.mapValue):_e(61005,{value:r})}function Gu(r){switch(Oi(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Oc(r);return e?16+Gu(e):16;case 5:return 2*r.stringValue.length;case 6:return Vi(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((o,l)=>o+Gu(l)),0)})(r.arrayValue);case 10:case 11:return(function(i){let o=0;return Fi(i.fields,((l,h)=>{o+=l.length+Gu(h)})),o})(r.mapValue);default:throw _e(13486,{value:r})}}function ry(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function ol(r){return!!r&&"integerValue"in r}function Av(r){return ol(r)||(function(t){return!!t&&"doubleValue"in t})(r)}function Cf(r){return!!r&&"arrayValue"in r}function iy(r){return!!r&&"nullValue"in r}function sy(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ku(r){return!!r&&"mapValue"in r}function CS(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Iv])==null?void 0:i.stringValue)===Sv}function Ya(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Fi(r.mapValue.fields,((t,i)=>e.mapValue.fields[t]=Ya(i))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ya(r.arrayValue.values[t]);return e}return{...r}}function PS(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===RS}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e){this.value=e}static empty(){return new tn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!Ku(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ya(t)}setAll(e){let t=Vt.emptyPath(),i={},o=[];e.forEach(((h,p)=>{if(!t.isImmediateParentOf(p)){const f=this.getFieldsMap(t);this.applyChanges(f,i,o),i={},o=[],t=p.popLast()}h?i[p.lastSegment()]=Ya(h):o.push(p.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,i,o)}delete(e){const t=this.field(e.popLast());Ku(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return pr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let o=t.mapValue.fields[e.get(i)];Ku(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,i){Fi(t,((o,l)=>e[o]=l));for(const o of i)delete e[o]}clone(){return new tn(Ya(this.value))}}function Rv(r){const e=[];return Fi(r.fields,((t,i)=>{const o=new Vt([t]);if(Ku(i)){const l=Rv(i.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new fn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,t,i,o,l,h,p){this.key=e,this.documentType=t,this.version=i,this.readTime=o,this.createTime=l,this.data=h,this.documentState=p}static newInvalidDocument(e){return new Bt(e,0,Ee.min(),Ee.min(),Ee.min(),tn.empty(),0)}static newFoundDocument(e,t,i,o){return new Bt(e,1,t,Ee.min(),i,o,0)}static newNoDocument(e,t){return new Bt(e,2,t,Ee.min(),Ee.min(),tn.empty(),0)}static newUnknownDocument(e,t){return new Bt(e,3,t,Ee.min(),Ee.min(),tn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Ee.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=tn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=tn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ee.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Bt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Bt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(e,t){this.position=e,this.inclusive=t}}function oy(r,e,t){let i=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?i=pe.comparator(pe.fromName(h.referenceValue),t.key):i=Lo(h,t.data.field(l.field)),l.dir==="desc"&&(i*=-1),i!==0)break}return i}function ay(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!pr(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t="asc"){this.field=e,this.dir=t}}function kS(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{}class yt extends Cv{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new xS(e,t,i):t==="array-contains"?new OS(e,i):t==="in"?new MS(e,i):t==="not-in"?new LS(e,i):t==="array-contains-any"?new bS(e,i):new yt(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new DS(e,i):new VS(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Lo(t,this.value)):t!==null&&Oi(this.value)===Oi(t)&&this.matchesComparison(Lo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return _e(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Fn extends Cv{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Fn(e,t)}matches(e){return Pv(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Pv(r){return r.op==="and"}function kv(r){return NS(r)&&Pv(r)}function NS(r){for(const e of r.filters)if(e instanceof Fn)return!1;return!0}function Zd(r){if(r instanceof yt)return r.field.canonicalString()+r.op.toString()+bo(r.value);if(kv(r))return r.filters.map((e=>Zd(e))).join(",");{const e=r.filters.map((t=>Zd(t))).join(",");return`${r.op}(${e})`}}function Nv(r,e){return r instanceof yt?(function(i,o){return o instanceof yt&&i.op===o.op&&i.field.isEqual(o.field)&&pr(i.value,o.value)})(r,e):r instanceof Fn?(function(i,o){return o instanceof Fn&&i.op===o.op&&i.filters.length===o.filters.length?i.filters.reduce(((l,h,p)=>l&&Nv(h,o.filters[p])),!0):!1})(r,e):void _e(19439)}function xv(r){return r instanceof yt?(function(t){return`${t.field.canonicalString()} ${t.op} ${bo(t.value)}`})(r):r instanceof Fn?(function(t){return t.op.toString()+" {"+t.getFilters().map(xv).join(" ,")+"}"})(r):"Filter"}class xS extends yt{constructor(e,t,i){super(e,t,i),this.key=pe.fromName(i.referenceValue)}matches(e){const t=pe.comparator(e.key,this.key);return this.matchesComparison(t)}}class DS extends yt{constructor(e,t){super(e,"in",t),this.keys=Dv("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class VS extends yt{constructor(e,t){super(e,"not-in",t),this.keys=Dv("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Dv(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((i=>pe.fromName(i.referenceValue)))}class OS extends yt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Cf(t)&&sl(t.arrayValue,this.value)}}class MS extends yt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&sl(this.value.arrayValue,t)}}class LS extends yt{constructor(e,t){super(e,"not-in",t)}matches(e){if(sl(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!sl(this.value.arrayValue,t)}}class bS extends yt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Cf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>sl(this.value.arrayValue,i)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FS{constructor(e,t=null,i=[],o=[],l=null,h=null,p=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=o,this.limit=l,this.startAt=h,this.endAt=p,this.Te=null}}function ly(r,e=null,t=[],i=[],o=null,l=null,h=null){return new FS(r,e,t,i,o,l,h)}function Pf(r){const e=Ae(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>Zd(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(l){return l.field.canonicalString()+l.dir})(i))).join(","),Vc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>bo(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>bo(i))).join(",")),e.Te=t}return e.Te}function kf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!kS(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Nv(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!ay(r.startAt,e.startAt)&&ay(r.endAt,e.endAt)}function ef(r){return pe.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e,t=null,i=[],o=[],l=null,h="F",p=null,f=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=o,this.limit=l,this.limitType=h,this.startAt=p,this.endAt=f,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function US(r,e,t,i,o,l,h,p){return new pl(r,e,t,i,o,l,h,p)}function Nf(r){return new pl(r)}function uy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function jS(r){return pe.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Vv(r){return r.collectionGroup!==null}function Xa(r){const e=Ae(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const l of e.explicitOrderBy)e.Ie.push(l),t.add(l.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let p=new Tt(Vt.comparator);return h.filters.forEach((f=>{f.getFlattenedFilters().forEach((m=>{m.isInequality()&&(p=p.add(m.field))}))})),p})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Ie.push(new uc(l,i))})),t.has(Vt.keyField().canonicalString())||e.Ie.push(new uc(Vt.keyField(),i))}return e.Ie}function ar(r){const e=Ae(r);return e.Ee||(e.Ee=zS(e,Xa(r))),e.Ee}function zS(r,e){if(r.limitType==="F")return ly(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new uc(o.field,l)}));const t=r.endAt?new lc(r.endAt.position,r.endAt.inclusive):null,i=r.startAt?new lc(r.startAt.position,r.startAt.inclusive):null;return ly(r.path,r.collectionGroup,e,r.filters,r.limit,t,i)}}function tf(r,e){const t=r.filters.concat([e]);return new pl(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function nf(r,e,t){return new pl(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Mc(r,e){return kf(ar(r),ar(e))&&r.limitType===e.limitType}function Ov(r){return`${Pf(ar(r))}|lt:${r.limitType}`}function Io(r){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((o=>xv(o))).join(", ")}]`),Vc(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((o=>bo(o))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((o=>bo(o))).join(",")),`Target(${i})`})(ar(r))}; limitType=${r.limitType})`}function Lc(r,e){return e.isFoundDocument()&&(function(i,o){const l=o.key.path;return i.collectionGroup!==null?o.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(l):pe.isDocumentKey(i.path)?i.path.isEqual(l):i.path.isImmediateParentOf(l)})(r,e)&&(function(i,o){for(const l of Xa(i))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(i,o){for(const l of i.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(i,o){return!(i.startAt&&!(function(h,p,f){const m=oy(h,p,f);return h.inclusive?m<=0:m<0})(i.startAt,Xa(i),o)||i.endAt&&!(function(h,p,f){const m=oy(h,p,f);return h.inclusive?m>=0:m>0})(i.endAt,Xa(i),o))})(r,e)}function BS(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Mv(r){return(e,t)=>{let i=!1;for(const o of Xa(r)){const l=$S(o,e,t);if(l!==0)return l;i=i||o.field.isKeyField()}return 0}}function $S(r,e,t){const i=r.field.isKeyField()?pe.comparator(e.key,t.key):(function(l,h,p){const f=h.data.field(l),m=p.data.field(l);return f!==null&&m!==null?Lo(f,m):_e(42886)})(r.field,e,t);switch(r.dir){case"asc":return i;case"desc":return-1*i;default:return _e(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[o,l]of i)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),o=this.inner[i];if(o===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return i.length===1?delete this.inner[t]:i.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Fi(this.inner,((t,i)=>{for(const[o,l]of i)e(o,l)}))}isEmpty(){return yv(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qS=new tt(pe.comparator);function jr(){return qS}const Lv=new tt(pe.comparator);function Ga(...r){let e=Lv;for(const t of r)e=e.insert(t.key,t);return e}function bv(r){let e=Lv;return r.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function gs(){return Ja()}function Fv(){return Ja()}function Ja(){return new Ns((r=>r.toString()),((r,e)=>r.isEqual(e)))}const HS=new tt(pe.comparator),WS=new Tt(pe.comparator);function Ne(...r){let e=WS;for(const t of r)e=e.add(t);return e}const GS=new Tt(ke);function KS(){return GS}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bc(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:sc(e)?"-0":e}}function xf(r){return{integerValue:""+r}}function Uv(r,e){return wS(e)?xf(e):bc(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(){this._=void 0}}function QS(r,e,t){return r instanceof cc?(function(o,l){const h={fields:{[wv]:{stringValue:vv},[Tv]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&Rf(l)&&(l=Oc(l)),l&&(h.fields[Ev]=l),{mapValue:h}})(t,e):r instanceof al?zv(r,e):r instanceof ll?Bv(r,e):r instanceof Fo?(function(o,l){const h=jv(o,l),p=fc(h)+fc(o.Ae);return ol(h)&&ol(o.Ae)?xf(p):bc(o.serializer,p)})(r,e):r instanceof hc?(function(o,l){return cy(o,l,Math.min)})(r,e):r instanceof dc?(function(o,l){return cy(o,l,Math.max)})(r,e):void 0}function YS(r,e,t){return r instanceof al?zv(r,e):r instanceof ll?Bv(r,e):t}function jv(r,e){return r instanceof Fo?Av(e)?e:{integerValue:0}:null}class cc extends Fc{}class al extends Fc{constructor(e){super(),this.elements=e}}function zv(r,e){const t=$v(e);for(const i of r.elements)t.some((o=>pr(o,i)))||t.push(i);return{arrayValue:{values:t}}}class ll extends Fc{constructor(e){super(),this.elements=e}}function Bv(r,e){let t=$v(e);for(const i of r.elements)t=t.filter((o=>!pr(o,i)));return{arrayValue:{values:t}}}class Df extends Fc{constructor(e,t){super(),this.serializer=e,this.Ae=t}}class Fo extends Df{}class hc extends Df{}class dc extends Df{}function cy(r,e,t){if(!Av(e))return r.Ae;const i=t(fc(e),fc(r.Ae));return ol(e)&&ol(r.Ae)?xf(i):bc(r.serializer,i)}function fc(r){return ct(r.integerValue||r.doubleValue)}function $v(r){return Cf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XS{constructor(e,t){this.field=e,this.transform=t}}function JS(r,e){return r.field.isEqual(e.field)&&(function(i,o){return i instanceof al&&o instanceof al||i instanceof ll&&o instanceof ll?Mo(i.elements,o.elements,pr):i instanceof Fo&&o instanceof Fo||i instanceof hc&&o instanceof hc||i instanceof dc&&o instanceof dc?pr(i.Ae,o.Ae):i instanceof cc&&o instanceof cc})(r.transform,e.transform)}class ZS{constructor(e,t){this.version=e,this.transformResults=t}}class lr{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new lr}static exists(e){return new lr(void 0,e)}static updateTime(e){return new lr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Qu(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Uc{}function qv(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Wv(r.key,lr.none()):new ml(r.key,r.data,lr.none());{const t=r.data,i=tn.empty();let o=new Tt(Vt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?i.delete(l):i.set(l,h),o=o.add(l)}return new Ui(r.key,i,new fn(o.toArray()),lr.none())}}function eA(r,e,t){r instanceof ml?(function(o,l,h){const p=o.value.clone(),f=dy(o.fieldTransforms,l,h.transformResults);p.setAll(f),l.convertToFoundDocument(h.version,p).setHasCommittedMutations()})(r,e,t):r instanceof Ui?(function(o,l,h){if(!Qu(o.precondition,l))return void l.convertToUnknownDocument(h.version);const p=dy(o.fieldTransforms,l,h.transformResults),f=l.data;f.setAll(Hv(o)),f.setAll(p),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function Za(r,e,t,i){return r instanceof ml?(function(l,h,p,f){if(!Qu(l.precondition,h))return p;const m=l.value.clone(),_=fy(l.fieldTransforms,f,h);return m.setAll(_),h.convertToFoundDocument(h.version,m).setHasLocalMutations(),null})(r,e,t,i):r instanceof Ui?(function(l,h,p,f){if(!Qu(l.precondition,h))return p;const m=fy(l.fieldTransforms,f,h),_=h.data;return _.setAll(Hv(l)),_.setAll(m),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),p===null?null:p.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((w=>w.field)))})(r,e,t,i):(function(l,h,p){return Qu(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):p})(r,e,t)}function tA(r,e){let t=null;for(const i of r.fieldTransforms){const o=e.data.field(i.field),l=jv(i.transform,o||null);l!=null&&(t===null&&(t=tn.empty()),t.set(i.field,l))}return t||null}function hy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(i,o){return i===void 0&&o===void 0||!(!i||!o)&&Mo(i,o,((l,h)=>JS(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class ml extends Uc{constructor(e,t,i,o=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Ui extends Uc{constructor(e,t,i,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function Hv(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=r.data.field(t);e.set(t,i)}})),e}function dy(r,e,t){const i=new Map;$e(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,p=e.data.field(l.field);i.set(l.field,YS(h,p,t[o]))}return i}function fy(r,e,t){const i=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);i.set(o.field,QS(l,h,e))}return i}class Wv extends Uc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class nA extends Uc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e,t,i,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=o}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&eA(l,e,i[o])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=Za(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=Za(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=Fv();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let p=this.applyToLocalView(h,l.mutatedFields);p=t.has(o.key)?null:p;const f=qv(h,p);f!==null&&i.set(o.key,f),h.isValidDocument()||h.convertToNoDocument(Ee.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Ne())}isEqual(e){return this.batchId===e.batchId&&Mo(this.mutations,e.mutations,((t,i)=>hy(t,i)))&&Mo(this.baseMutations,e.baseMutations,((t,i)=>hy(t,i)))}}class Vf{constructor(e,t,i,o){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=o}static from(e,t,i){$e(e.mutations.length===i.length,58842,{me:e.mutations.length,fe:i.length});let o=(function(){return HS})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,i[h].version);return new Vf(e,t,i,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var mt,Le;function oA(r){switch(r){case q.OK:return _e(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return _e(15467,{code:r})}}function Gv(r){if(r===void 0)return Ur("GRPC error has no .code"),q.UNKNOWN;switch(r){case mt.OK:return q.OK;case mt.CANCELLED:return q.CANCELLED;case mt.UNKNOWN:return q.UNKNOWN;case mt.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case mt.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case mt.INTERNAL:return q.INTERNAL;case mt.UNAVAILABLE:return q.UNAVAILABLE;case mt.UNAUTHENTICATED:return q.UNAUTHENTICATED;case mt.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case mt.NOT_FOUND:return q.NOT_FOUND;case mt.ALREADY_EXISTS:return q.ALREADY_EXISTS;case mt.PERMISSION_DENIED:return q.PERMISSION_DENIED;case mt.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case mt.ABORTED:return q.ABORTED;case mt.OUT_OF_RANGE:return q.OUT_OF_RANGE;case mt.UNIMPLEMENTED:return q.UNIMPLEMENTED;case mt.DATA_LOSS:return q.DATA_LOSS;default:return _e(39323,{code:r})}}(Le=mt||(mt={}))[Le.OK=0]="OK",Le[Le.CANCELLED=1]="CANCELLED",Le[Le.UNKNOWN=2]="UNKNOWN",Le[Le.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Le[Le.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Le[Le.NOT_FOUND=5]="NOT_FOUND",Le[Le.ALREADY_EXISTS=6]="ALREADY_EXISTS",Le[Le.PERMISSION_DENIED=7]="PERMISSION_DENIED",Le[Le.UNAUTHENTICATED=16]="UNAUTHENTICATED",Le[Le.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Le[Le.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Le[Le.ABORTED=10]="ABORTED",Le[Le.OUT_OF_RANGE=11]="OUT_OF_RANGE",Le[Le.UNIMPLEMENTED=12]="UNIMPLEMENTED",Le[Le.INTERNAL=13]="INTERNAL",Le[Le.UNAVAILABLE=14]="UNAVAILABLE",Le[Le.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aA(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lA=new Ri([4294967295,4294967295],0);function py(r){const e=aA().encode(r),t=new ov;return t.update(e),new Uint8Array(t.digest())}function my(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new Ri([t,i],0),new Ri([o,l],0)]}class Of{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new Ka(`Invalid padding: ${t}`);if(i<0)throw new Ka(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new Ka(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new Ka(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Ri.fromNumber(this.ge)}ye(e,t,i){let o=e.add(t.multiply(Ri.fromNumber(i)));return o.compare(lA)===1&&(o=new Ri([o.getBits(0),o.getBits(1)],0)),o.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=py(e),[i,o]=my(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);if(!this.we(h))return!1}return!0}static create(e,t,i){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new Of(l,o,t);return i.forEach((p=>h.insert(p))),h}insert(e){if(this.ge===0)return;const t=py(e),[i,o]=my(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);this.Se(h)}}Se(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class Ka extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(e,t,i,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const o=new Map;return o.set(e,yl.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new gl(Ee.min(),o,new tt(ke),jr(),Ne())}}class yl{constructor(e,t,i,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new yl(i,t,Ne(),Ne(),Ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{constructor(e,t,i,o){this.be=e,this.removedTargetIds=t,this.key=i,this.De=o}}class Kv{constructor(e,t){this.targetId=e,this.Ce=t}}class Qv{constructor(e,t,i=Ot.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=o}}class gy{constructor(e){this.targetId=e,this.ve=0,this.Fe=yy(),this.Me=Ot.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=Ne(),t=Ne(),i=Ne();return this.Fe.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:i=i.add(o);break;default:_e(38017,{changeType:l})}})),new yl(this.Me,this.xe,e,t,i)}qe(){this.Oe=!1,this.Fe=yy()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,$e(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const qa="WatchChangeAggregator";class uA{constructor(e){this.Ge=e,this.ze=new Map,this.je=jr(),this.Je=Bu(),this.He=Bu(),this.Ze=new tt(ke)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const i=this.ze.get(t);if(i)switch(e.state){case 0:this.nt(t)&&i.Le(e.resumeToken);break;case 1:i.We(),i.Ne||i.qe(),i.Le(e.resumeToken);break;case 2:i.We(),i.Ne||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Qe(),i.Le(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Le(e.resumeToken));break;default:_e(56790,{state:e.state})}else ne(qa,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((i,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,i=e.Ce.count,o=this.st(t);if(o){const l=o.target;if(ef(l))if(i===0){const h=new pe(l.path);this.et(t,h,Bt.newNoDocument(h,Ee.min()))}else $e(i===1,20013,{expectedCount:i});else{const h=this.ot(t);if(h!==i){const p=this._t(e),f=p?this.ut(p,e,h):1;if(f!==0){this.rt(t);const m=f===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,m)}}}}}_t(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:o=0},hashCount:l=0}=t;let h,p;try{h=Vi(i).toUint8Array()}catch(f){if(f instanceof _v)return Ss("Decoding the base64 bloom filter in existence filter failed ("+f.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw f}try{p=new Of(h,o,l)}catch(f){return Ss(f instanceof Ka?"BloomFilter error: ":"Applying bloom filter failed: ",f),null}return p.ge===0?null:p}ut(e,t,i){return t.Ce.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.Ge.getRemoteKeysForTarget(t);let o=0;return i.forEach((l=>{const h=this.Ge.lt(),p=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(p)||(this.et(t,l,null),o++)})),o}Pt(e){const t=new Map;this.ze.forEach(((l,h)=>{const p=this.st(h);if(p){if(l.current&&ef(p.target)){const f=new pe(p.target.path);this.Tt(f).has(h)||this.It(h,f)||this.et(h,f,Bt.newNoDocument(f,e))}l.Be&&(t.set(h,l.ke()),l.qe())}}));let i=Ne();this.He.forEach(((l,h)=>{let p=!0;h.forEachWhile((f=>{const m=this.st(f);return!m||m.purpose==="TargetPurposeLimboResolution"||(p=!1,!1)})),p&&(i=i.add(l))})),this.je.forEach(((l,h)=>h.setReadTime(e)));const o=new gl(e,t,this.Ze,this.je,i);return this.je=jr(),this.Je=Bu(),this.He=Bu(),this.Ze=new tt(ke),o}Ye(e,t){const i=this.ze.get(e);if(!i||!this.nt(e))return void ne(qa,`addDocumentToTarget received document for unknown inactive target (${e})`);const o=this.It(e,t.key)?2:0;i.Ke(t.key,o),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Tt(t.key).add(e)),this.He=this.He.insert(t.key,this.Et(t.key).add(e))}et(e,t,i){const o=this.ze.get(e);o&&this.nt(e)?(this.It(e,t)?o.Ke(t,1):o.Ue(t),this.He=this.He.insert(t,this.Et(t).delete(e)),this.He=this.He.insert(t,this.Et(t).add(e)),i&&(this.je=this.je.insert(t,i))):ne(qa,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ze.delete(e)}ot(e){const t=this.ze.get(e);if(!t)return 0;const i=t.ke();return this.Ge.getRemoteKeysForTarget(e).size+i.addedDocuments.size-i.removedDocuments.size}$e(e){let t=this.ze.get(e);t||(ne(qa,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new gy(e),this.ze.set(e,t)),t.$e()}Et(e){let t=this.He.get(e);return t||(t=new Tt(ke),this.He=this.He.insert(e,t)),t}Tt(e){let t=this.Je.get(e);return t||(t=new Tt(ke),this.Je=this.Je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ne(qa,"Detected inactive target",e),t}st(e){const t=this.ze.get(e);return t===void 0||t.Ne?null:this.Ge.Rt(e)}rt(e){this.ze.set(e,new gy(e)),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Bu(){return new tt(pe.comparator)}function yy(){return new tt(pe.comparator)}const cA={asc:"ASCENDING",desc:"DESCENDING"},hA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},dA={and:"AND",or:"OR"};class fA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function rf(r,e){return r.useProto3Json||Vc(e)?e:{value:e}}function pc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Yv(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function pA(r,e){return pc(r,e.toTimestamp())}function ur(r){return $e(!!r,49232),Ee.fromTimestamp((function(t){const i=Di(t);return new Ke(i.seconds,i.nanos)})(r))}function Mf(r,e){return sf(r,e).canonicalString()}function sf(r,e){const t=(function(o){return new Ye(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Xv(r){const e=Ye.fromString(r);return $e(nw(e),10190,{key:e.toString()}),e}function of(r,e){return Mf(r.databaseId,e.path)}function xd(r,e){const t=Xv(e);if(t.get(1)!==r.databaseId.projectId)throw new le(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new le(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new pe(Zv(t))}function Jv(r,e){return Mf(r.databaseId,e)}function mA(r){const e=Xv(r);return e.length===4?Ye.emptyPath():Zv(e)}function af(r){return new Ye(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Zv(r){return $e(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function _y(r,e,t){return{name:of(r,e),fields:t.value.mapValue.fields}}function gA(r,e){let t;if("targetChange"in e){e.targetChange;const i=(function(m){return m==="NO_CHANGE"?0:m==="ADD"?1:m==="REMOVE"?2:m==="CURRENT"?3:m==="RESET"?4:_e(39313,{state:m})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(m,_){return m.useProto3Json?($e(_===void 0||typeof _=="string",58123),Ot.fromBase64String(_||"")):($e(_===void 0||_ instanceof Buffer||_ instanceof Uint8Array,16193),Ot.fromUint8Array(_||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,p=h&&(function(m){const _=m.code===void 0?q.UNKNOWN:Gv(m.code);return new le(_,m.message||"")})(h);t=new Qv(i,o,l,p||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const o=xd(r,i.document.name),l=ur(i.document.updateTime),h=i.document.createTime?ur(i.document.createTime):Ee.min(),p=new tn({mapValue:{fields:i.document.fields}}),f=Bt.newFoundDocument(o,l,h,p),m=i.targetIds||[],_=i.removedTargetIds||[];t=new Yu(m,_,f.key,f)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const o=xd(r,i.document),l=i.readTime?ur(i.readTime):Ee.min(),h=Bt.newNoDocument(o,l),p=i.removedTargetIds||[];t=new Yu([],p,h.key,h)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const o=xd(r,i.document),l=i.removedTargetIds||[];t=new Yu([],l,o,null)}else{if(!("filter"in e))return _e(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:o=0,unchangedNames:l}=i,h=new sA(o,l),p=i.targetId;t=new Kv(p,h)}}return t}function yA(r,e){let t;if(e instanceof ml)t={update:_y(r,e.key,e.value)};else if(e instanceof Wv)t={delete:of(r,e.key)};else if(e instanceof Ui)t={update:_y(r,e.key,e.data),updateMask:RA(e.fieldMask)};else{if(!(e instanceof nA))return _e(16599,{Vt:e.type});t={verify:of(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(l,h){const p=h.transform;if(p instanceof cc)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(p instanceof al)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:p.elements}};if(p instanceof ll)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:p.elements}};if(p instanceof Fo)return{fieldPath:h.field.canonicalString(),increment:p.Ae};if(p instanceof hc)return{fieldPath:h.field.canonicalString(),minimum:p.Ae};if(p instanceof dc)return{fieldPath:h.field.canonicalString(),maximum:p.Ae};throw _e(20930,{transform:h.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:pA(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:_e(27497)})(r,e.precondition)),t}function _A(r,e){return r&&r.length>0?($e(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?ur(o.updateTime):ur(l);return h.isEqual(Ee.min())&&(h=ur(l)),new ZS(h,o.transformResults||[])})(t,e)))):[]}function vA(r,e){return{documents:[Jv(r,e.path)]}}function wA(r,e){const t={structuredQuery:{}},i=e.path;let o;e.collectionGroup!==null?(o=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=Jv(r,o);const l=(function(m){if(m.length!==0)return tw(Fn.create(m,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(m){if(m.length!==0)return m.map((_=>(function(T){return{field:So(T.field),direction:IA(T.dir)}})(_)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const p=rf(r,e.limit);return p!==null&&(t.structuredQuery.limit=p),e.startAt&&(t.structuredQuery.startAt=(function(m){return{before:m.inclusive,values:m.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(m){return{before:!m.inclusive,values:m.position}})(e.endAt)),{dt:t,parent:o}}function EA(r){let e=mA(r.parent);const t=r.structuredQuery,i=t.from?t.from.length:0;let o=null;if(i>0){$e(i===1,65062);const _=t.from[0];_.allDescendants?o=_.collectionId:e=e.child(_.collectionId)}let l=[];t.where&&(l=(function(w){const T=ew(w);return T instanceof Fn&&kv(T)?T.getFilters():[T]})(t.where));let h=[];t.orderBy&&(h=(function(w){return w.map((T=>(function(L){return new uc(Ao(L.field),(function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(L.direction))})(T)))})(t.orderBy));let p=null;t.limit&&(p=(function(w){let T;return T=typeof w=="object"?w.value:w,Vc(T)?null:T})(t.limit));let f=null;t.startAt&&(f=(function(w){const T=!!w.before,x=w.values||[];return new lc(x,T)})(t.startAt));let m=null;return t.endAt&&(m=(function(w){const T=!w.before,x=w.values||[];return new lc(x,T)})(t.endAt)),US(e,o,h,l,p,"F",f,m)}function TA(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return _e(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function ew(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=Ao(t.unaryFilter.field);return yt.create(i,"==",{doubleValue:NaN});case"IS_NULL":const o=Ao(t.unaryFilter.field);return yt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=Ao(t.unaryFilter.field);return yt.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=Ao(t.unaryFilter.field);return yt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return _e(61313);default:return _e(60726)}})(r):r.fieldFilter!==void 0?(function(t){return yt.create(Ao(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return _e(58110);default:return _e(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return Fn.create(t.compositeFilter.filters.map((i=>ew(i))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return _e(1026)}})(t.compositeFilter.op))})(r):_e(30097,{filter:r})}function IA(r){return cA[r]}function SA(r){return hA[r]}function AA(r){return dA[r]}function So(r){return{fieldPath:r.canonicalString()}}function Ao(r){return Vt.fromServerFormat(r.fieldPath)}function tw(r){return r instanceof yt?(function(t){if(t.op==="=="){if(sy(t.value))return{unaryFilter:{field:So(t.field),op:"IS_NAN"}};if(iy(t.value))return{unaryFilter:{field:So(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(sy(t.value))return{unaryFilter:{field:So(t.field),op:"IS_NOT_NAN"}};if(iy(t.value))return{unaryFilter:{field:So(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:So(t.field),op:SA(t.op),value:t.value}}})(r):r instanceof Fn?(function(t){const i=t.getFilters().map((o=>tw(o)));return i.length===1?i[0]:{compositeFilter:{op:AA(t.op),filters:i}}})(r):_e(54877,{filter:r})}function RA(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function nw(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function rw(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(e,t,i,o,l=Ee.min(),h=Ee.min(),p=Ot.EMPTY_BYTE_STRING,f=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=p,this.expectedCount=f}withSequenceNumber(e){return new Mr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Mr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Mr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Mr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CA{constructor(e){this.gt=e}}function PA(r){const e=EA({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?nf(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kA{constructor(){this.Sn=new NA}addToCollectionParentIndex(e,t){return this.Sn.add(t),H.resolve()}getCollectionParents(e,t){return H.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return H.resolve()}deleteFieldIndex(e,t){return H.resolve()}deleteAllFieldIndexes(e){return H.resolve()}createTargetIndexes(e,t){return H.resolve()}getDocumentsMatchingTarget(e,t){return H.resolve(null)}getIndexType(e,t){return H.resolve(0)}getFieldIndexes(e,t){return H.resolve([])}getNextCollectionGroupToUpdate(e){return H.resolve(null)}getMinOffset(e,t){return H.resolve(xi.min())}getMinOffsetFromCollectionGroup(e,t){return H.resolve(xi.min())}updateCollectionGroup(e,t,i){return H.resolve()}updateIndexEntries(e,t){return H.resolve()}}class NA{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t]||new Tt(Ye.comparator),l=!o.has(i);return this.index[t]=o.add(i),l}has(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t];return o&&o.has(i)}getEntries(e){return(this.index[e]||new Tt(Ye.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},iw=41943040;class en{static withCacheSize(e){return new en(e,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */en.DEFAULT_COLLECTION_PERCENTILE=10,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,en.DEFAULT=new en(iw,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),en.DISABLED=new en(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(e){this.ir=e}next(){return this.ir+=2,this.ir}static sr(){return new Mi(0)}static _r(){return new Mi(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wy="LruGarbageCollector",xA=1048576;function Ey([r,e],[t,i]){const o=ke(r,t);return o===0?ke(e,i):o}class DA{constructor(e){this.hr=e,this.buffer=new Tt(Ey),this.Pr=0}Tr(){return++this.Pr}Ir(e){const t=[e,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();Ey(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class VA{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(e){ne(wy,`Garbage collection scheduled in ${e}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Wo(t)?ne(wy,"Ignoring IndexedDB error during garbage collection: ",t):await Ho(t)}await this.Rr(3e5)}))}}class OA{constructor(e,t){this.Ar=e,this.params=t}calculateTargetCount(e,t){return this.Ar.Vr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return H.resolve(Dc.ce);const i=new DA(t);return this.Ar.forEachTarget(e,(o=>i.Ir(o.sequenceNumber))).next((()=>this.Ar.dr(e,(o=>i.Ir(o))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Ar.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Ar.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ne("LruGarbageCollector","Garbage collection skipped; disabled"),H.resolve(vy)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(ne("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),vy):this.mr(e,t)))}getCacheSize(e){return this.Ar.getCacheSize(e)}mr(e,t){let i,o,l,h,p,f,m;const _=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((w=>(w>this.params.maximumSequenceNumbersToCollect?(ne("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${w}`),o=this.params.maximumSequenceNumbersToCollect):o=w,h=Date.now(),this.nthSequenceNumber(e,o)))).next((w=>(i=w,p=Date.now(),this.removeTargets(e,i,t)))).next((w=>(l=w,f=Date.now(),this.removeOrphanedDocuments(e,i)))).next((w=>(m=Date.now(),To()<=Ve.DEBUG&&ne("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-_}ms
	Determined least recently used ${o} in `+(p-h)+`ms
	Removed ${l} targets in `+(f-p)+`ms
	Removed ${w} documents in `+(m-f)+`ms
Total Duration: ${m-_}ms`),H.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:w}))))}}function MA(r,e){return new OA(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LA{constructor(){this.changes=new Ns((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Bt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?H.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(e,t,i,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=o}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(i=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(i!==null&&Za(i.mutation,o,fn.empty(),Ke.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,Ne()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=Ne()){const o=gs();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,i).next((l=>{let h=Ga();return l.forEach(((p,f)=>{h=h.insert(p,f.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const i=gs();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,Ne())))}populateOverlays(e,t,i){const o=[];return i.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,p)=>{t.set(h,p)}))}))}computeViews(e,t,i,o){let l=jr();const h=Ja(),p=(function(){return Ja()})();return t.forEach(((f,m)=>{const _=i.get(m.key);o.has(m.key)&&(_===void 0||_.mutation instanceof Ui)?l=l.insert(m.key,m):_!==void 0?(h.set(m.key,_.mutation.getFieldMask()),Za(_.mutation,m,_.mutation.getFieldMask(),Ke.now())):h.set(m.key,fn.empty())})),this.recalculateAndSaveOverlays(e,l).next((f=>(f.forEach(((m,_)=>h.set(m,_))),t.forEach(((m,_)=>p.set(m,new bA(_,h.get(m)??null)))),p)))}recalculateAndSaveOverlays(e,t){const i=Ja();let o=new tt(((h,p)=>h-p)),l=Ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const p of h)p.keys().forEach((f=>{const m=t.get(f);if(m===null)return;let _=i.get(f)||fn.empty();_=p.applyToLocalView(m,_),i.set(f,_);const w=(o.get(p.batchId)||Ne()).add(f);o=o.insert(p.batchId,w)}))})).next((()=>{const h=[],p=o.getReverseIterator();for(;p.hasNext();){const f=p.getNext(),m=f.key,_=f.value,w=Fv();_.forEach((T=>{if(!l.has(T)){const x=qv(t.get(T),i.get(T));x!==null&&w.set(T,x),l=l.add(T)}})),h.push(this.documentOverlayCache.saveOverlays(e,m,w))}return H.waitFor(h)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,o){return jS(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Vv(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,o):this.getDocumentsMatchingCollectionQuery(e,t,i,o)}getNextDocuments(e,t,i,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,o-l.size):H.resolve(gs());let p=nl,f=l;return h.next((m=>H.forEach(m,((_,w)=>(p<w.largestBatchId&&(p=w.largestBatchId),l.get(_)?H.resolve():this.remoteDocumentCache.getEntry(e,_).next((T=>{f=f.insert(_,T)}))))).next((()=>this.populateOverlays(e,m,l))).next((()=>this.computeViews(e,f,m,Ne()))).next((_=>({batchId:p,changes:bv(_)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new pe(t)).next((i=>{let o=Ga();return i.isFoundDocument()&&(o=o.insert(i.key,i)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,o){const l=t.collectionGroup;let h=Ga();return this.indexManager.getCollectionParents(e,l).next((p=>H.forEach(p,(f=>{const m=(function(w,T){return new pl(T,null,w.explicitOrderBy.slice(),w.filters.slice(),w.limit,w.limitType,w.startAt,w.endAt)})(t,f.child(l));return this.getDocumentsMatchingCollectionQuery(e,m,i,o).next((_=>{_.forEach(((w,T)=>{h=h.insert(w,T)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,i,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,l,o)))).next((h=>{l.forEach(((f,m)=>{const _=m.getKey();h.get(_)===null&&(h=h.insert(_,Bt.newInvalidDocument(_)))}));let p=Ga();return h.forEach(((f,m)=>{const _=l.get(f);_!==void 0&&Za(_.mutation,m,fn.empty(),Ke.now()),Lc(t,m)&&(p=p.insert(f,m))})),p}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UA{constructor(e){this.serializer=e,this.Or=new Map,this.Nr=new Map}getBundleMetadata(e,t){return H.resolve(this.Or.get(t))}saveBundleMetadata(e,t){return this.Or.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:ur(o.createTime)}})(t)),H.resolve()}getNamedQuery(e,t){return H.resolve(this.Nr.get(t))}saveNamedQuery(e,t){return this.Nr.set(t.name,(function(o){return{name:o.name,query:PA(o.bundledQuery),readTime:ur(o.readTime)}})(t)),H.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jA{constructor(){this.overlays=new tt(pe.comparator),this.Br=new Map}getOverlay(e,t){return H.resolve(this.overlays.get(t))}getOverlays(e,t){const i=gs();return H.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&i.set(o,l)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((o,l)=>{this.wt(e,t,l)})),H.resolve()}removeOverlaysForBatchId(e,t,i){const o=this.Br.get(i);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.Br.delete(i)),H.resolve()}getOverlaysForCollection(e,t,i){const o=gs(),l=t.length+1,h=new pe(t.child("")),p=this.overlays.getIteratorFrom(h);for(;p.hasNext();){const f=p.getNext().value,m=f.getKey();if(!t.isPrefixOf(m.path))break;m.path.length===l&&f.largestBatchId>i&&o.set(f.getKey(),f)}return H.resolve(o)}getOverlaysForCollectionGroup(e,t,i,o){let l=new tt(((m,_)=>m-_));const h=this.overlays.getIterator();for(;h.hasNext();){const m=h.getNext().value;if(m.getKey().getCollectionGroup()===t&&m.largestBatchId>i){let _=l.get(m.largestBatchId);_===null&&(_=gs(),l=l.insert(m.largestBatchId,_)),_.set(m.getKey(),m)}}const p=gs(),f=l.getIterator();for(;f.hasNext()&&(f.getNext().value.forEach(((m,_)=>p.set(m,_))),!(p.size()>=o)););return H.resolve(p)}wt(e,t,i){const o=this.overlays.get(i.key);if(o!==null){const h=this.Br.get(o.largestBatchId).delete(i.key);this.Br.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(i.key,new iA(t,i));let l=this.Br.get(t);l===void 0&&(l=Ne(),this.Br.set(t,l)),this.Br.set(t,l.add(i.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zA{constructor(){this.sessionToken=Ot.EMPTY_BYTE_STRING}getSessionToken(e){return H.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,H.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(){this.Lr=new Tt(Ct.kr),this.qr=new Tt(Ct.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(e,t){const i=new Ct(e,t);this.Lr=this.Lr.add(i),this.qr=this.qr.add(i)}Ur(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.$r(new Ct(e,t))}Wr(e,t){e.forEach((i=>this.removeReference(i,t)))}Qr(e){const t=new pe(new Ye([])),i=new Ct(t,e),o=new Ct(t,e+1),l=[];return this.qr.forEachInRange([i,o],(h=>{this.$r(h),l.push(h.key)})),l}Gr(){this.Lr.forEach((e=>this.$r(e)))}$r(e){this.Lr=this.Lr.delete(e),this.qr=this.qr.delete(e)}zr(e){const t=new pe(new Ye([])),i=new Ct(t,e),o=new Ct(t,e+1);let l=Ne();return this.qr.forEachInRange([i,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new Ct(e,0),i=this.Lr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class Ct{constructor(e,t){this.key=e,this.jr=t}static kr(e,t){return pe.comparator(e.key,t.key)||ke(e.jr,t.jr)}static Kr(e,t){return ke(e.jr,t.jr)||pe.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Xn=1,this.Jr=new Tt(Ct.kr)}checkEmpty(e){return H.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,o){const l=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new rA(l,t,i,o);this.mutationQueue.push(h);for(const p of o)this.Jr=this.Jr.add(new Ct(p.key,l)),this.indexManager.addToCollectionParentIndex(e,p.key.path.popLast());return H.resolve(h)}lookupMutationBatch(e,t){return H.resolve(this.Hr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,o=this.Zr(i),l=o<0?0:o;return H.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return H.resolve(this.mutationQueue.length===0?Af:this.Xn-1)}getAllMutationBatches(e){return H.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new Ct(t,0),o=new Ct(t,Number.POSITIVE_INFINITY),l=[];return this.Jr.forEachInRange([i,o],(h=>{const p=this.Hr(h.jr);l.push(p)})),H.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new Tt(ke);return t.forEach((o=>{const l=new Ct(o,0),h=new Ct(o,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([l,h],(p=>{i=i.add(p.jr)}))})),H.resolve(this.Xr(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,o=i.length+1;let l=i;pe.isDocumentKey(l)||(l=l.child(""));const h=new Ct(new pe(l),0);let p=new Tt(ke);return this.Jr.forEachWhile((f=>{const m=f.key.path;return!!i.isPrefixOf(m)&&(m.length===o&&(p=p.add(f.jr)),!0)}),h),H.resolve(this.Xr(p))}Xr(e){const t=[];return e.forEach((i=>{const o=this.Hr(i);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){$e(this.Yr(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Jr;return H.forEach(t.mutations,(o=>{const l=new Ct(o.key,t.batchId);return i=i.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Jr=i}))}tr(e){}containsKey(e,t){const i=new Ct(t,0),o=this.Jr.firstAfterOrEqual(i);return H.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,H.resolve()}Yr(e,t){return this.Zr(e)}Zr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Hr(e){const t=this.Zr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{constructor(e){this.ei=e,this.docs=(function(){return new tt(pe.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,o=this.docs.get(i),l=o?o.size:0,h=this.ei(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return H.resolve(i?i.document.mutableCopy():Bt.newInvalidDocument(t))}getEntries(e,t){let i=jr();return t.forEach((o=>{const l=this.docs.get(o);i=i.insert(o,l?l.document.mutableCopy():Bt.newInvalidDocument(o))})),H.resolve(i)}getDocumentsMatchingQuery(e,t,i,o){let l=jr();const h=t.path,p=new pe(h.child("__id-9223372036854775808__")),f=this.docs.getIteratorFrom(p);for(;f.hasNext();){const{key:m,value:{document:_}}=f.getNext();if(!h.isPrefixOf(m.path))break;m.path.length>h.length+1||gS(mS(_),i)<=0||(o.has(_.key)||Lc(t,_))&&(l=l.insert(_.key,_.mutableCopy()))}return H.resolve(l)}getAllFromCollectionGroup(e,t,i,o){_e(9500)}ti(e,t){return H.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new qA(this)}getSize(e){return H.resolve(this.size)}}class qA extends LA{constructor(e){super(),this.Fr=e}applyChanges(e){const t=[];return this.changes.forEach(((i,o)=>{o.isValidDocument()?t.push(this.Fr.addEntry(e,o)):this.Fr.removeEntry(i)})),H.waitFor(t)}getFromCache(e,t){return this.Fr.getEntry(e,t)}getAllFromCache(e,t){return this.Fr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HA{constructor(e){this.persistence=e,this.ni=new Ns((t=>Pf(t)),kf),this.lastRemoteSnapshotVersion=Ee.min(),this.highestTargetId=0,this.ri=0,this.ii=new Lf,this.targetCount=0,this.si=Mi.sr()}forEachTarget(e,t){return this.ni.forEach(((i,o)=>t(o))),H.resolve()}getLastRemoteSnapshotVersion(e){return H.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return H.resolve(this.ri)}allocateTargetId(e){return this.highestTargetId=this.si.next(),H.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.ri&&(this.ri=t),H.resolve()}cr(e){this.ni.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.si=new Mi(t),this.highestTargetId=t),e.sequenceNumber>this.ri&&(this.ri=e.sequenceNumber)}addTargetData(e,t){return this.cr(t),this.targetCount+=1,H.resolve()}updateTargetData(e,t){return this.cr(t),H.resolve()}removeTargetData(e,t){return this.ni.delete(t.target),this.ii.Qr(t.targetId),this.targetCount-=1,H.resolve()}removeTargets(e,t,i){let o=0;const l=[];return this.ni.forEach(((h,p)=>{p.sequenceNumber<=t&&i.get(p.targetId)===null&&(this.ni.delete(h),l.push(this.removeMatchingKeysForTargetId(e,p.targetId)),o++)})),H.waitFor(l).next((()=>o))}getTargetCount(e){return H.resolve(this.targetCount)}getTargetData(e,t){const i=this.ni.get(t)||null;return H.resolve(i)}addMatchingKeys(e,t,i){return this.ii.Ur(t,i),H.resolve()}removeMatchingKeys(e,t,i){this.ii.Wr(t,i);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),H.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.ii.Qr(t),H.resolve()}getMatchingKeysForTargetId(e,t){const i=this.ii.zr(t);return H.resolve(i)}containsKey(e,t){return H.resolve(this.ii.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sw{constructor(e,t){this.oi={},this.overlays={},this._i=new Dc(0),this.ai=!1,this.ai=!0,this.ui=new zA,this.referenceDelegate=e(this),this.ci=new HA(this),this.indexManager=new kA,this.remoteDocumentCache=(function(o){return new $A(o)})((i=>this.referenceDelegate.li(i))),this.serializer=new CA(t),this.hi=new UA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new jA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.oi[e.toKey()];return i||(i=new BA(t,this.referenceDelegate),this.oi[e.toKey()]=i),i}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(e,t,i){ne("MemoryPersistence","Starting transaction:",e);const o=new WA(this._i.next());return this.referenceDelegate.Pi(),i(o).next((l=>this.referenceDelegate.Ti(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ii(e,t){return H.or(Object.values(this.oi).map((i=>()=>i.containsKey(e,t))))}}class WA extends _S{constructor(e){super(),this.currentSequenceNumber=e}}class bf{constructor(e){this.persistence=e,this.Ei=new Lf,this.Ri=null}static Ai(e){return new bf(e)}get Vi(){if(this.Ri)return this.Ri;throw _e(60996)}addReference(e,t,i){return this.Ei.addReference(i,t),this.Vi.delete(i.toString()),H.resolve()}removeReference(e,t,i){return this.Ei.removeReference(i,t),this.Vi.add(i.toString()),H.resolve()}markPotentiallyOrphaned(e,t){return this.Vi.add(t.toString()),H.resolve()}removeTarget(e,t){this.Ei.Qr(t.targetId).forEach((o=>this.Vi.add(o.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.Vi.add(l.toString())))})).next((()=>i.removeTargetData(e,t)))}Pi(){this.Ri=new Set}Ti(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return H.forEach(this.Vi,(i=>{const o=pe.fromPath(i);return this.di(e,o).next((l=>{l||t.removeEntry(o,Ee.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.di(e,t).next((i=>{i?this.Vi.delete(t.toString()):this.Vi.add(t.toString())}))}li(e){return 0}di(e,t){return H.or([()=>H.resolve(this.Ei.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class mc{constructor(e,t){this.persistence=e,this.mi=new Ns((i=>ES(i.path)),((i,o)=>i.isEqual(o))),this.garbageCollector=MA(this,t)}static Ai(e,t){return new mc(e,t)}Pi(){}Ti(e){return H.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Vr(e){const t=this.gr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((o=>i+o))))}gr(e){let t=0;return this.dr(e,(i=>{t++})).next((()=>t))}dr(e,t){return H.forEach(this.mi,((i,o)=>this.yr(e,i,o).next((l=>l?H.resolve():t(o)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ti(e,(h=>this.yr(e,h,t).next((p=>{p||(i++,l.removeEntry(h,Ee.min()))})))).next((()=>l.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.mi.set(t,e.currentSequenceNumber),H.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),H.resolve()}removeReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),H.resolve()}updateLimboDocument(e,t){return this.mi.set(t,e.currentSequenceNumber),H.resolve()}li(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Gu(e.data.value)),t}yr(e,t,i){return H.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.mi.get(t);return H.resolve(o!==void 0&&o>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff{constructor(e,t,i,o){this.targetId=e,this.fromCache=t,this.Ps=i,this.Ts=o}static Is(e,t){let i=Ne(),o=Ne();for(const l of t.docChanges)switch(l.type){case 0:i=i.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new Ff(e,t.fromCache,i,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KA{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return LT()?8:vS($t())>0?6:4})()}initialize(e,t){this.ds=e,this.indexManager=t,this.Es=!0}getDocumentsMatchingQuery(e,t,i,o){const l={result:null};return this.fs(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.gs(e,t,o,i).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new GA;return this.ps(e,t,h).next((p=>{if(l.result=p,this.Rs)return this.ys(e,t,h,p.size)}))})).next((()=>l.result))}ys(e,t,i,o){return i.documentReadCount<this.As?(To()<=Ve.DEBUG&&ne("QueryEngine","SDK will not create cache indexes for query:",Io(t),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),H.resolve()):(To()<=Ve.DEBUG&&ne("QueryEngine","Query:",Io(t),"scans",i.documentReadCount,"local documents and returns",o,"documents as results."),i.documentReadCount>this.Vs*o?(To()<=Ve.DEBUG&&ne("QueryEngine","The SDK decides to create cache indexes for query:",Io(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ar(t))):H.resolve())}fs(e,t){if(uy(t))return H.resolve(null);let i=ar(t);return this.indexManager.getIndexType(e,i).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=nf(t,null,"F"),i=ar(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((l=>{const h=Ne(...l);return this.ds.getDocuments(e,h).next((p=>this.indexManager.getMinOffset(e,i).next((f=>{const m=this.ws(t,p);return this.Ss(t,m,h,f.readTime)?this.fs(e,nf(t,null,"F")):this.bs(e,m,t,f)}))))})))))}gs(e,t,i,o){return uy(t)||o.isEqual(Ee.min())?H.resolve(null):this.ds.getDocuments(e,i).next((l=>{const h=this.ws(t,l);return this.Ss(t,h,i,o)?H.resolve(null):(To()<=Ve.DEBUG&&ne("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),Io(t)),this.bs(e,h,t,pS(o,nl)).next((p=>p)))}))}ws(e,t){let i=new Tt(Mv(e));return t.forEach(((o,l)=>{Lc(e,l)&&(i=i.add(l))})),i}Ss(e,t,i,o){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ps(e,t,i){return To()<=Ve.DEBUG&&ne("QueryEngine","Using full collection scan to execute query:",Io(t)),this.ds.getDocumentsMatchingQuery(e,t,xi.min(),i)}bs(e,t,i,o){return this.ds.getDocumentsMatchingQuery(e,i,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf="LocalStore",QA=3e8;class YA{constructor(e,t,i,o){this.persistence=e,this.Ds=t,this.serializer=o,this.Cs=new tt(ke),this.vs=new Ns((l=>Pf(l)),kf),this.Fs=new Map,this.Ms=e.getRemoteDocumentCache(),this.ci=e.getTargetCache(),this.hi=e.getBundleCache(),this.xs(i)}xs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new FA(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Cs)))}}function XA(r,e,t,i){return new YA(r,e,t,i)}async function ow(r,e){const t=Ae(r);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let o;return t.mutationQueue.getAllMutationBatches(i).next((l=>(o=l,t.xs(e),t.mutationQueue.getAllMutationBatches(i)))).next((l=>{const h=[],p=[];let f=Ne();for(const m of o){h.push(m.batchId);for(const _ of m.mutations)f=f.add(_.key)}for(const m of l){p.push(m.batchId);for(const _ of m.mutations)f=f.add(_.key)}return t.localDocuments.getDocuments(i,f).next((m=>({Os:m,removedBatchIds:h,addedBatchIds:p})))}))}))}function JA(r,e){const t=Ae(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const o=e.batch.keys(),l=t.Ms.newChangeBuffer({trackRemovals:!0});return(function(p,f,m,_){const w=m.batch,T=w.keys();let x=H.resolve();return T.forEach((L=>{x=x.next((()=>_.getEntry(f,L))).next((z=>{const O=m.docVersions.get(L);$e(O!==null,48541),z.version.compareTo(O)<0&&(w.applyToRemoteDocument(z,m),z.isValidDocument()&&(z.setReadTime(m.commitVersion),_.addEntry(z)))}))})),x.next((()=>p.mutationQueue.removeMutationBatch(f,w)))})(t,i,e,l).next((()=>l.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(p){let f=Ne();for(let m=0;m<p.mutationResults.length;++m)p.mutationResults[m].transformResults.length>0&&(f=f.add(p.batch.mutations[m].key));return f})(e)))).next((()=>t.localDocuments.getDocuments(i,o)))}))}function aw(r){const e=Ae(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ci.getLastRemoteSnapshotVersion(t)))}function ZA(r,e){const t=Ae(r),i=e.snapshotVersion;let o=t.Cs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Ms.newChangeBuffer({trackRemovals:!0});o=t.Cs;const p=[];e.targetChanges.forEach(((_,w)=>{const T=o.get(w);if(!T)return;p.push(t.ci.removeMatchingKeys(l,_.removedDocuments,w).next((()=>t.ci.addMatchingKeys(l,_.addedDocuments,w))));let x=T.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(w)!==null?x=x.withResumeToken(Ot.EMPTY_BYTE_STRING,Ee.min()).withLastLimboFreeSnapshotVersion(Ee.min()):_.resumeToken.approximateByteSize()>0&&(x=x.withResumeToken(_.resumeToken,i)),o=o.insert(w,x),(function(z,O,re){return z.resumeToken.approximateByteSize()===0||O.snapshotVersion.toMicroseconds()-z.snapshotVersion.toMicroseconds()>=QA?!0:re.addedDocuments.size+re.modifiedDocuments.size+re.removedDocuments.size>0})(T,x,_)&&p.push(t.ci.updateTargetData(l,x))}));let f=jr(),m=Ne();if(e.documentUpdates.forEach((_=>{e.resolvedLimboDocuments.has(_)&&p.push(t.persistence.referenceDelegate.updateLimboDocument(l,_))})),p.push(eR(l,h,e.documentUpdates).next((_=>{f=_.Ns,m=_.Bs}))),!i.isEqual(Ee.min())){const _=t.ci.getLastRemoteSnapshotVersion(l).next((w=>t.ci.setTargetsMetadata(l,l.currentSequenceNumber,i)));p.push(_)}return H.waitFor(p).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,f,m))).next((()=>f))})).then((l=>(t.Cs=o,l)))}function eR(r,e,t){let i=Ne(),o=Ne();return t.forEach((l=>i=i.add(l))),e.getEntries(r,i).next((l=>{let h=jr();return t.forEach(((p,f)=>{const m=l.get(p);f.isFoundDocument()!==m.isFoundDocument()&&(o=o.add(p)),f.isNoDocument()&&f.version.isEqual(Ee.min())?(e.removeEntry(p,f.readTime),h=h.insert(p,f)):!m.isValidDocument()||f.version.compareTo(m.version)>0||f.version.compareTo(m.version)===0&&m.hasPendingWrites?(e.addEntry(f),h=h.insert(p,f)):ne(Uf,"Ignoring outdated watch update for ",p,". Current version:",m.version," Watch version:",f.version)})),{Ns:h,Bs:o}}))}function tR(r,e){const t=Ae(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Af),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function nR(r,e){const t=Ae(r);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let o;return t.ci.getTargetData(i,e).next((l=>l?(o=l,H.resolve(o)):t.ci.allocateTargetId(i).next((h=>(o=new Mr(e,h,"TargetPurposeListen",i.currentSequenceNumber),t.ci.addTargetData(i,o).next((()=>o)))))))})).then((i=>{const o=t.Cs.get(i.targetId);return(o===null||i.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Cs=t.Cs.insert(i.targetId,i),t.vs.set(e,i.targetId)),i}))}async function lf(r,e,t){const i=Ae(r),o=i.Cs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",l,(h=>i.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Wo(h))throw h;ne(Uf,`Failed to update sequence numbers for target ${e}: ${h}`)}i.Cs=i.Cs.remove(e),i.vs.delete(o.target)}function Ty(r,e,t){const i=Ae(r);let o=Ee.min(),l=Ne();return i.persistence.runTransaction("Execute query","readwrite",(h=>(function(f,m,_){const w=Ae(f),T=w.vs.get(_);return T!==void 0?H.resolve(w.Cs.get(T)):w.ci.getTargetData(m,_)})(i,h,ar(e)).next((p=>{if(p)return o=p.lastLimboFreeSnapshotVersion,i.ci.getMatchingKeysForTargetId(h,p.targetId).next((f=>{l=f}))})).next((()=>i.Ds.getDocumentsMatchingQuery(h,e,t?o:Ee.min(),t?l:Ne()))).next((p=>(rR(i,BS(e),p),{documents:p,Ls:l})))))}function rR(r,e,t){let i=r.Fs.get(e)||Ee.min();t.forEach(((o,l)=>{l.readTime.compareTo(i)>0&&(i=l.readTime)})),r.Fs.set(e,i)}class Iy{constructor(){this.activeTargetIds=KS()}Ws(e){this.activeTargetIds=this.activeTargetIds.add(e)}Qs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}$s(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class iR{constructor(){this.Co=new Iy,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Co.Ws(e),this.vo[e]||"not-current"}updateQueryState(e,t,i){this.vo[e]=t}removeLocalQueryTarget(e){this.Co.Qs(e)}isLocalQueryTarget(e){return this.Co.activeTargetIds.has(e)}clearQueryState(e){delete this.vo[e]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(e){return this.Co.activeTargetIds.has(e)}start(){return this.Co=new Iy,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sR{Fo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy="ConnectivityMonitor";class Ay{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(e){this.Bo.push(e)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){ne(Sy,"Network connectivity changed: AVAILABLE");for(const e of this.Bo)e(0)}No(){ne(Sy,"Network connectivity changed: UNAVAILABLE");for(const e of this.Bo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $u=null;function uf(){return $u===null?$u=(function(){return 268435456+Math.round(2147483648*Math.random())})():$u++,"0x"+$u.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dd="RestConnection",oR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class aR{get ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Ko=`projects/${i}/databases/${o}`,this.Uo=this.databaseId.database===oc?`project_id=${i}`:`project_id=${i}&database_id=${o}`}$o(e,t,i,o,l){const h=uf(),p=this.Wo(e,t.toUriEncodedString());ne(Dd,`Sending RPC '${e}' ${h}:`,p,i);const f={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(f,o,l);const{host:m}=new URL(p),_=dl(m);return this.Go(e,p,f,i,_).then((w=>(ne(Dd,`Received RPC '${e}' ${h}: `,w),w)),(w=>{throw Ss(Dd,`RPC '${e}' ${h} failed with error: `,w,"url: ",p,"request:",i),w}))}zo(e,t,i,o,l,h){return this.$o(e,t,i,o,l)}Qo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+qo})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),i&&i.headers.forEach(((o,l)=>e[l]=o))}Wo(e,t){const i=oR[e];let o=`${this.qo}/v1/${t}:${i}`;return this.databaseInfo.apiKey&&(o=`${o}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),o}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lR{constructor(e){this.jo=e.jo,this.Jo=e.Jo}Ho(e){this.Zo=e}Xo(e){this.Yo=e}e_(e){this.t_=e}onMessage(e){this.n_=e}close(){this.Jo()}send(e){this.jo(e)}r_(){this.Zo()}i_(){this.Yo()}s_(e){this.t_(e)}o_(e){this.n_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt="WebChannelConnection",Ha=(r,e,t)=>{r.listen(e,(i=>{try{t(i)}catch(o){setTimeout((()=>{throw o}),0)}}))};class Po extends aR{constructor(e){super(e),this.__=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static a_(){if(!Po.u_){const e=cv();Ha(e,uv.STAT_EVENT,(t=>{t.stat===Yd.PROXY?ne(jt,"STAT_EVENT: detected buffering proxy"):t.stat===Yd.NOPROXY&&ne(jt,"STAT_EVENT: detected no buffering proxy")})),Po.u_=!0}}Go(e,t,i,o,l){const h=uf();return new Promise(((p,f)=>{const m=new av;m.setWithCredentials(!0),m.listenOnce(lv.COMPLETE,(()=>{try{switch(m.getLastErrorCode()){case Wu.NO_ERROR:const w=m.getResponseJson();ne(jt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(w)),p(w);break;case Wu.TIMEOUT:ne(jt,`RPC '${e}' ${h} timed out`),f(new le(q.DEADLINE_EXCEEDED,"Request time out"));break;case Wu.HTTP_ERROR:const T=m.getStatus();if(ne(jt,`RPC '${e}' ${h} failed with status:`,T,"response text:",m.getResponseText()),T>0){let x=m.getResponseJson();Array.isArray(x)&&(x=x[0]);const L=x==null?void 0:x.error;if(L&&L.status&&L.message){const z=(function(re){const te=re.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(te)>=0?te:q.UNKNOWN})(L.status);f(new le(z,L.message))}else f(new le(q.UNKNOWN,"Server responded with status "+m.getStatus()))}else f(new le(q.UNAVAILABLE,"Connection failed."));break;default:_e(9055,{c_:e,streamId:h,l_:m.getLastErrorCode(),h_:m.getLastError()})}}finally{ne(jt,`RPC '${e}' ${h} completed.`)}}));const _=JSON.stringify(o);ne(jt,`RPC '${e}' ${h} sending request:`,o),m.send(t,"POST",_,i,15)}))}P_(e,t,i){const o=uf(),l=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=this.createWebChannelTransport(),p={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(p.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(p.useFetchStreams=!0),this.Qo(p.initMessageHeaders,t,i),p.encodeInitMessageHeaders=!0;const m=l.join("");ne(jt,`Creating RPC '${e}' stream ${o}: ${m}`,p);const _=h.createWebChannel(m,p);this.T_(_);let w=!1,T=!1;const x=new lR({jo:L=>{T?ne(jt,`Not sending because RPC '${e}' stream ${o} is closed:`,L):(w||(ne(jt,`Opening RPC '${e}' stream ${o} transport.`),_.open(),w=!0),ne(jt,`RPC '${e}' stream ${o} sending:`,L),_.send(L))},Jo:()=>_.close()});return Ha(_,Wa.EventType.OPEN,(()=>{T||(ne(jt,`RPC '${e}' stream ${o} transport opened.`),x.r_())})),Ha(_,Wa.EventType.CLOSE,(()=>{T||(T=!0,ne(jt,`RPC '${e}' stream ${o} transport closed`),x.s_(),this.I_(_))})),Ha(_,Wa.EventType.ERROR,(L=>{T||(T=!0,Ss(jt,`RPC '${e}' stream ${o} transport errored. Name:`,L.name,"Message:",L.message),x.s_(new le(q.UNAVAILABLE,"The operation could not be completed")))})),Ha(_,Wa.EventType.MESSAGE,(L=>{var z;if(!T){const O=L.data[0];$e(!!O,16349);const re=O,te=(re==null?void 0:re.error)||((z=re[0])==null?void 0:z.error);if(te){ne(jt,`RPC '${e}' stream ${o} received error:`,te);const Y=te.status;let ie=(function(N){const S=mt[N];if(S!==void 0)return Gv(S)})(Y),ye=te.message;Y==="NOT_FOUND"&&ye.includes("database")&&ye.includes("does not exist")&&ye.includes(this.databaseId.database)&&Ss(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ie===void 0&&(ie=q.INTERNAL,ye="Unknown error status: "+Y+" with message "+te.message),T=!0,x.s_(new le(ie,ye)),_.close()}else ne(jt,`RPC '${e}' stream ${o} received:`,O),x.o_(O)}})),Po.a_(),setTimeout((()=>{x.i_()}),0),x}terminate(){this.__.forEach((e=>e.close())),this.__=[]}T_(e){this.__.push(e)}I_(e){this.__=this.__.filter((t=>t===e))}Qo(e,t,i){super.Qo(e,t,i),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return hv()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uR(r){return new Po(r)}function Vd(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(r){return new fA(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Po.u_=!1;class lw{constructor(e,t,i=1e3,o=1.5,l=6e4){this.Di=e,this.timerId=t,this.E_=i,this.R_=o,this.A_=l,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(e){this.cancel();const t=Math.floor(this.V_+this.p_()),i=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-i);o>0&&ne("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ry="PersistentStream";class uw{constructor(e,t,i,o,l,h,p,f){this.Di=e,this.w_=i,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=p,this.listener=f,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new lw(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(e,t){this.q_(),this.K_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(Ur(t.toString()),Ur("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.e_(t)}U_(){}auth(){this.state=1;const e=this.W_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,o])=>{this.b_===t&&this.Q_(i,o)}),(i=>{e((()=>{const o=new le(q.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(o)}))}))}Q_(e,t){const i=this.W_(this.b_);this.stream=this.z_(e,t),this.stream.Ho((()=>{i((()=>this.listener.Ho()))})),this.stream.Xo((()=>{i((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((o=>{i((()=>this.G_(o)))})),this.stream.onMessage((o=>{i((()=>++this.v_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return ne(Ry,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Di.enqueueAndForget((()=>this.b_===e?t():(ne(Ry,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class cR extends uw{constructor(e,t,i,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=gA(this.serializer,e),i=(function(l){if(!("targetChange"in l))return Ee.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?Ee.min():h.readTime?ur(h.readTime):Ee.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=af(this.serializer),t.addTarget=(function(l,h){let p;const f=h.target;if(p=ef(f)?{documents:vA(l,f)}:{query:wA(l,f).dt},p.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){p.resumeToken=Yv(l,h.resumeToken);const m=rf(l,h.expectedCount);m!==null&&(p.expectedCount=m)}else if(h.snapshotVersion.compareTo(Ee.min())>0){p.readTime=pc(l,h.snapshotVersion.toTimestamp());const m=rf(l,h.expectedCount);m!==null&&(p.expectedCount=m)}return p})(this.serializer,e);const i=TA(this.serializer,e);i&&(t.labels=i),this.k_(t)}Z_(e){const t={};t.database=af(this.serializer),t.removeTarget=e,this.k_(t)}}class hR extends uw{constructor(e,t,i,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return $e(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,$e(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){$e(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=_A(e.writeResults,e.commitTime),i=ur(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=af(this.serializer),this.k_(e)}Y_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>yA(this.serializer,i)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dR{}class fR extends dR{constructor(e,t,i,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new le(q.FAILED_PRECONDITION,"The client has already been terminated.")}$o(e,t,i,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.$o(e,sf(t,i),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new le(q.UNKNOWN,l.toString())}))}zo(e,t,i,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,p])=>this.connection.zo(e,sf(t,i),o,h,p,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new le(q.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function pR(r,e,t,i){return new fR(r,e,t,i)}class mR{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Ur(t),this._a=!1):ne("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr="RemoteStore";class gR{constructor(e,t,i,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new Mi(1e3),this.Aa=new Mi(1001),this.Va=new Set,this.da=[],this.ma=l,this.ma.Fo((h=>{i.enqueueAndForget((async()=>{xs(this)&&(ne(mr,"Restarting streams for network reachability change."),await(async function(f){const m=Ae(f);m.Va.add(4),await _l(m),m.fa.set("Unknown"),m.Va.delete(4),await zc(m)})(this))}))})),this.fa=new mR(i,o)}}async function zc(r){if(xs(r))for(const e of r.da)await e(!0)}async function _l(r){for(const e of r.da)await e(!1)}function cf(r,e){return r.Ia.get(e)||void 0}function cw(r,e){const t=Ae(r),i=cf(t,e.targetId);if(i!==void 0&&t.Ta.has(i))return;const o=(function(p,f){const m=cf(p,f);m!==void 0&&p.Ea.delete(m);const _=(function(T,x){return x%2!=0?T.Aa.next():T.Ra.next()})(p,f);return p.Ia.set(f,_),p.Ea.set(_,f),_})(t,e.targetId);ne(mr,"remoteStoreListen mapping SDK target ID to remote",e.targetId,o);const l=new Mr(e.target,o,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ta.set(o,l),$f(t)?Bf(t):Go(t).x_()&&zf(t,l)}function jf(r,e){const t=Ae(r),i=Go(t),o=cf(t,e);ne(mr,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,o),t.Ta.delete(o),t.Ia.delete(e),t.Ea.delete(o),i.x_()&&hw(t,o),t.Ta.size===0&&(i.x_()?i.B_():xs(t)&&t.fa.set("Unknown"))}function zf(r,e){if(r.ga.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Ee.min())>0){const t=r.Ea.get(e.targetId);if(t===void 0)return void ne(mr,"SDK target ID not found for remote ID: "+e.targetId);const i=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(i)}Go(r).H_(e)}function hw(r,e){r.ga.$e(e),Go(r).Z_(e)}function Bf(r){r.ga=new uA({getRemoteKeysForTarget:e=>{const t=r.Ea.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):Ne()},Rt:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Go(r).start(),r.fa.aa()}function $f(r){return xs(r)&&!Go(r).M_()&&r.Ta.size>0}function xs(r){return Ae(r).Va.size===0}function dw(r){r.ga=void 0}async function yR(r){r.fa.set("Online")}async function _R(r){r.Ta.forEach(((e,t)=>{zf(r,e)}))}async function vR(r,e){dw(r),$f(r)?(r.fa.la(e),Bf(r)):r.fa.set("Unknown")}async function wR(r,e,t){if(r.fa.set("Online"),e instanceof Qv&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const p of l.targetIds){if(o.Ta.has(p)){const f=o.Ea.get(p);f!==void 0&&(await o.remoteSyncer.rejectListen(f,h),o.Ia.delete(f),o.Ea.delete(p)),o.Ta.delete(p)}o.ga.removeTarget(p)}})(r,e)}catch(i){ne(mr,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await gc(r,i)}else if(e instanceof Yu?r.ga.Xe(e):e instanceof Kv?r.ga.it(e):r.ga.tt(e),!t.isEqual(Ee.min()))try{const i=await aw(r.localStore);t.compareTo(i)>=0&&await(function(l,h){const p=l.ga.Pt(h);p.targetChanges.forEach(((m,_)=>{if(m.resumeToken.approximateByteSize()>0){const w=l.Ta.get(_);w&&l.Ta.set(_,w.withResumeToken(m.resumeToken,h))}})),p.targetMismatches.forEach(((m,_)=>{const w=l.Ta.get(m);if(!w)return;l.Ta.set(m,w.withResumeToken(Ot.EMPTY_BYTE_STRING,w.snapshotVersion)),hw(l,m);const T=new Mr(w.target,m,_,w.sequenceNumber);zf(l,T)}));const f=(function(_,w){const T=new Map;w.targetChanges.forEach(((L,z)=>{const O=_.Ea.get(z);O!==void 0&&T.set(O,L)}));let x=new tt(ke);return w.targetMismatches.forEach(((L,z)=>{const O=_.Ea.get(L);O!==void 0&&(x=x.insert(O,z))})),new gl(w.snapshotVersion,T,x,w.documentUpdates,w.resolvedLimboDocuments)})(l,p);return l.remoteSyncer.applyRemoteEvent(f)})(r,t)}catch(i){ne(mr,"Failed to raise snapshot:",i),await gc(r,i)}}async function gc(r,e,t){if(!Wo(e))throw e;r.Va.add(1),await _l(r),r.fa.set("Offline"),t||(t=()=>aw(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{ne(mr,"Retrying IndexedDB access"),await t(),r.Va.delete(1),await zc(r)}))}function fw(r,e){return e().catch((t=>gc(r,t,e)))}async function Bc(r){const e=Ae(r),t=Li(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Af;for(;ER(e);)try{const o=await tR(e.localStore,i);if(o===null){e.Pa.length===0&&t.B_();break}i=o.batchId,TR(e,o)}catch(o){await gc(e,o)}pw(e)&&mw(e)}function ER(r){return xs(r)&&r.Pa.length<10}function TR(r,e){r.Pa.push(e);const t=Li(r);t.x_()&&t.X_&&t.Y_(e.mutations)}function pw(r){return xs(r)&&!Li(r).M_()&&r.Pa.length>0}function mw(r){Li(r).start()}async function IR(r){Li(r).na()}async function SR(r){const e=Li(r);for(const t of r.Pa)e.Y_(t.mutations)}async function AR(r,e,t){const i=r.Pa.shift(),o=Vf.from(i,e,t);await fw(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Bc(r)}async function RR(r,e){e&&Li(r).X_&&await(async function(i,o){if((function(h){return oA(h)&&h!==q.ABORTED})(o.code)){const l=i.Pa.shift();Li(i).N_(),await fw(i,(()=>i.remoteSyncer.rejectFailedWrite(l.batchId,o))),await Bc(i)}})(r,e),pw(r)&&mw(r)}async function Cy(r,e){const t=Ae(r);t.asyncQueue.verifyOperationInProgress(),ne(mr,"RemoteStore received new credentials");const i=xs(t);t.Va.add(3),await _l(t),i&&t.fa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Va.delete(3),await zc(t)}async function CR(r,e){const t=Ae(r);e?(t.Va.delete(2),await zc(t)):e||(t.Va.add(2),await _l(t),t.fa.set("Unknown"))}function Go(r){return r.pa||(r.pa=(function(t,i,o){const l=Ae(t);return l.ia(),new cR(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:yR.bind(null,r),Xo:_R.bind(null,r),e_:vR.bind(null,r),J_:wR.bind(null,r)}),r.da.push((async e=>{e?(r.pa.N_(),$f(r)?Bf(r):r.fa.set("Unknown")):(await r.pa.stop(),dw(r))}))),r.pa}function Li(r){return r.ya||(r.ya=(function(t,i,o){const l=Ae(t);return l.ia(),new hR(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:()=>Promise.resolve(),Xo:IR.bind(null,r),e_:RR.bind(null,r),ea:SR.bind(null,r),ta:AR.bind(null,r)}),r.da.push((async e=>{e?(r.ya.N_(),await Bc(r)):(await r.ya.stop(),r.Pa.length>0&&(ne(mr,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ya}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(e,t,i,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=o,this.removalCallback=l,this.deferred=new Ci,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,o,l){const h=Date.now()+i,p=new qf(e,t,h,o,l);return p.start(i),p}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new le(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Hf(r,e){if(Ur("AsyncQueue",`${e}: ${r}`),Wo(r))return new le(q.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{static emptySet(e){return new ko(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||pe.comparator(t.key,i.key):(t,i)=>pe.comparator(t.key,i.key),this.keyedMap=Ga(),this.sortedSet=new tt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ko)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new ko;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(){this.wa=new tt(pe.comparator)}track(e){const t=e.doc.key,i=this.wa.get(t);i?e.type!==0&&i.type===3?this.wa=this.wa.insert(t,e):e.type===3&&i.type!==1?this.wa=this.wa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.wa=this.wa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.wa=this.wa.remove(t):e.type===1&&i.type===2?this.wa=this.wa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):_e(63341,{At:e,Sa:i}):this.wa=this.wa.insert(t,e)}ba(){const e=[];return this.wa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Uo{constructor(e,t,i,o,l,h,p,f,m){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=p,this.excludesMetadataChanges=f,this.hasCachedResults=m}static fromInitialDocuments(e,t,i,o,l){const h=[];return t.forEach((p=>{h.push({type:0,doc:p})})),new Uo(e,t,ko.emptySet(t),h,i,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Mc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==i[o].type||!t[o].doc.isEqual(i[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PR{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((e=>e.Fa()))}}class kR{constructor(){this.queries=ky(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(t,i){const o=Ae(t),l=o.queries;o.queries=ky(),l.forEach(((h,p)=>{for(const f of p.Ca)f.onError(i)}))})(this,new le(q.ABORTED,"Firestore shutting down"))}}function ky(){return new Ns((r=>Ov(r)),Mc)}async function gw(r,e){const t=Ae(r);let i=3;const o=e.query;let l=t.queries.get(o);l?!l.va()&&e.Fa()&&(i=2):(l=new PR,i=e.Fa()?0:1);try{switch(i){case 0:l.Da=await t.onListen(o,!0);break;case 1:l.Da=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const p=Hf(h,`Initialization of query '${Io(e.query)}' failed`);return void e.onError(p)}t.queries.set(o,l),l.Ca.push(e),e.xa(t.onlineState),l.Da&&e.Oa(l.Da)&&Wf(t)}async function yw(r,e){const t=Ae(r),i=e.query;let o=3;const l=t.queries.get(i);if(l){const h=l.Ca.indexOf(e);h>=0&&(l.Ca.splice(h,1),l.Ca.length===0?o=e.Fa()?0:1:!l.va()&&e.Fa()&&(o=2))}switch(o){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function NR(r,e){const t=Ae(r);let i=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const p of h.Ca)p.Oa(o)&&(i=!0);h.Da=o}}i&&Wf(t)}function xR(r,e,t){const i=Ae(r),o=i.queries.get(e);if(o)for(const l of o.Ca)l.onError(t);i.queries.delete(e)}function Wf(r){r.Ma.forEach((e=>{e.next()}))}var hf,Ny;(Ny=hf||(hf={})).Na="default",Ny.Cache="cache";class _w{constructor(e,t,i){this.query=e,this.Ba=t,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=i||{}}Oa(e){if(!this.options.includeMetadataChanges){const i=[];for(const o of e.docChanges)o.type!==3&&i.push(o);e=new Uo(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.La?this.qa(e)&&(this.Ba.next(e),t=!0):this.Ka(e,this.onlineState)&&(this.Ua(e),t=!0),this.ka=e,t}onError(e){this.Ba.error(e)}xa(e){this.onlineState=e;let t=!1;return this.ka&&!this.La&&this.Ka(this.ka,e)&&(this.Ua(this.ka),t=!0),t}Ka(e,t){if(!e.fromCache||!this.Fa())return!0;const i=t!=="Offline";return(!this.options.$a||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.ka&&this.ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Ua(e){e=Uo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.La=!0,this.Ba.next(e)}Fa(){return this.options.source!==hf.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vw{constructor(e){this.key=e}}class ww{constructor(e){this.key=e}}class DR{constructor(e,t){this.query=e,this.eu=t,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=Ne(),this.mutatedKeys=Ne(),this.ru=Mv(e),this.iu=new ko(this.ru)}get su(){return this.eu}ou(e,t){const i=t?t._u:new Py,o=t?t.iu:this.iu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,p=!1;const f=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,m=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((_,w)=>{const T=o.get(_),x=Lc(this.query,w)?w:null,L=!!T&&this.mutatedKeys.has(T.key),z=!!x&&(x.hasLocalMutations||this.mutatedKeys.has(x.key)&&x.hasCommittedMutations);let O=!1;T&&x?T.data.isEqual(x.data)?L!==z&&(i.track({type:3,doc:x}),O=!0):this.au(T,x)||(i.track({type:2,doc:x}),O=!0,(f&&this.ru(x,f)>0||m&&this.ru(x,m)<0)&&(p=!0)):!T&&x?(i.track({type:0,doc:x}),O=!0):T&&!x&&(i.track({type:1,doc:T}),O=!0,(f||m)&&(p=!0)),O&&(x?(h=h.add(x),l=z?l.add(_):l.delete(_)):(h=h.delete(_),l=l.delete(_)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const _=this.query.limitType==="F"?h.last():h.first();h=h.delete(_.key),l=l.delete(_.key),i.track({type:1,doc:_})}return{iu:h,_u:i,Ss:p,mutatedKeys:l}}au(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,o){const l=this.iu;this.iu=e.iu,this.mutatedKeys=e.mutatedKeys;const h=e._u.ba();h.sort(((_,w)=>(function(x,L){const z=O=>{switch(O){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return _e(20277,{At:O})}};return z(x)-z(L)})(_.type,w.type)||this.ru(_.doc,w.doc))),this.uu(i),o=o??!1;const p=t&&!o?this.cu():[],f=this.nu.size===0&&this.current&&!o?1:0,m=f!==this.tu;return this.tu=f,h.length!==0||m?{snapshot:new Uo(this.query,e.iu,l,h,e.mutatedKeys,f===0,m,!1,!!i&&i.resumeToken.approximateByteSize()>0),lu:p}:{lu:p}}xa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new Py,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(e){return!this.eu.has(e)&&!!this.iu.has(e)&&!this.iu.get(e).hasLocalMutations}uu(e){e&&(e.addedDocuments.forEach((t=>this.eu=this.eu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.eu=this.eu.delete(t))),this.current=e.current)}cu(){if(!this.current)return[];const e=this.nu;this.nu=Ne(),this.iu.forEach((i=>{this.hu(i.key)&&(this.nu=this.nu.add(i.key))}));const t=[];return e.forEach((i=>{this.nu.has(i)||t.push(new ww(i))})),this.nu.forEach((i=>{e.has(i)||t.push(new vw(i))})),t}Pu(e){this.eu=e.Ls,this.nu=Ne();const t=this.ou(e.documents);return this.applyChanges(t,!0)}Tu(){return Uo.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const Gf="SyncEngine";class VR{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class OR{constructor(e){this.key=e,this.Iu=!1}}class MR{constructor(e,t,i,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.Eu={},this.Ru=new Ns((p=>Ov(p)),Mc),this.Au=new Map,this.Vu=new Set,this.du=new tt(pe.comparator),this.mu=new Map,this.fu=new Lf,this.gu={},this.pu=new Map,this.yu=Mi._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function LR(r,e,t=!0){const i=Rw(r);let o;const l=i.Ru.get(e);return l?(i.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.Tu()):o=await Ew(i,e,t,!0),o}async function bR(r,e){const t=Rw(r);await Ew(t,e,!0,!1)}async function Ew(r,e,t,i){const o=await nR(r.localStore,ar(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let p;return i&&(p=await FR(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&cw(r.remoteStore,o),p}async function FR(r,e,t,i,o){r.Su=(w,T,x)=>(async function(z,O,re,te){let Y=O.view.ou(re);Y.Ss&&(Y=await Ty(z.localStore,O.query,!1).then((({documents:N})=>O.view.ou(N,Y))));const ie=te&&te.targetChanges.get(O.targetId),ye=te&&te.targetMismatches.get(O.targetId)!=null,Re=O.view.applyChanges(Y,z.isPrimaryClient,ie,ye);return Dy(z,O.targetId,Re.lu),Re.snapshot})(r,w,T,x);const l=await Ty(r.localStore,e,!0),h=new DR(e,l.Ls),p=h.ou(l.documents),f=yl.createSynthesizedTargetChangeForCurrentChange(t,i&&r.onlineState!=="Offline",o),m=h.applyChanges(p,r.isPrimaryClient,f);Dy(r,t,m.lu);const _=new VR(e,t,h);return r.Ru.set(e,_),r.Au.has(t)?r.Au.get(t).push(e):r.Au.set(t,[e]),m.snapshot}async function UR(r,e,t){const i=Ae(r),o=i.Ru.get(e),l=i.Au.get(o.targetId);if(l.length>1)return i.Au.set(o.targetId,l.filter((h=>!Mc(h,e)))),void i.Ru.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(o.targetId),i.sharedClientState.isActiveQueryTarget(o.targetId)||await lf(i.localStore,o.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(o.targetId),t&&jf(i.remoteStore,o.targetId),df(i,o.targetId)})).catch(Ho)):(df(i,o.targetId),await lf(i.localStore,o.targetId,!0))}async function jR(r,e){const t=Ae(r),i=t.Ru.get(e),o=t.Au.get(i.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),jf(t.remoteStore,i.targetId))}async function zR(r,e,t){const i=KR(r);try{const o=await(function(h,p){const f=Ae(h),m=Ke.now(),_=p.reduce(((x,L)=>x.add(L.key)),Ne());let w,T;return f.persistence.runTransaction("Locally write mutations","readwrite",(x=>{let L=jr(),z=Ne();return f.Ms.getEntries(x,_).next((O=>{L=O,L.forEach(((re,te)=>{te.isValidDocument()||(z=z.add(re))}))})).next((()=>f.localDocuments.getOverlayedDocuments(x,L))).next((O=>{w=O;const re=[];for(const te of p){const Y=tA(te,w.get(te.key).overlayedDocument);Y!=null&&re.push(new Ui(te.key,Y,Rv(Y.value.mapValue),lr.exists(!0)))}return f.mutationQueue.addMutationBatch(x,m,re,p)})).next((O=>{T=O;const re=O.applyToLocalDocumentSet(w,z);return f.documentOverlayCache.saveOverlays(x,O.batchId,re)}))})).then((()=>({batchId:T.batchId,changes:bv(w)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(o.batchId),(function(h,p,f){let m=h.gu[h.currentUser.toKey()];m||(m=new tt(ke)),m=m.insert(p,f),h.gu[h.currentUser.toKey()]=m})(i,o.batchId,t),await vl(i,o.changes),await Bc(i.remoteStore)}catch(o){const l=Hf(o,"Failed to persist write");t.reject(l)}}async function Tw(r,e){const t=Ae(r);try{const i=await ZA(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.mu.get(l);h&&($e(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.Iu=!0:o.modifiedDocuments.size>0?$e(h.Iu,14607):o.removedDocuments.size>0&&($e(h.Iu,42227),h.Iu=!1))})),await vl(t,i,e)}catch(i){await Ho(i)}}function xy(r,e,t){const i=Ae(r);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const o=[];i.Ru.forEach(((l,h)=>{const p=h.view.xa(e);p.snapshot&&o.push(p.snapshot)})),(function(h,p){const f=Ae(h);f.onlineState=p;let m=!1;f.queries.forEach(((_,w)=>{for(const T of w.Ca)T.xa(p)&&(m=!0)})),m&&Wf(f)})(i.eventManager,e),o.length&&i.Eu.J_(o),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function BR(r,e,t){const i=Ae(r);i.sharedClientState.updateQueryState(e,"rejected",t);const o=i.mu.get(e),l=o&&o.key;if(l){let h=new tt(pe.comparator);h=h.insert(l,Bt.newNoDocument(l,Ee.min()));const p=Ne().add(l),f=new gl(Ee.min(),new Map,new tt(ke),h,p);await Tw(i,f),i.du=i.du.remove(l),i.mu.delete(e),Kf(i)}else await lf(i.localStore,e,!1).then((()=>df(i,e,t))).catch(Ho)}async function $R(r,e){const t=Ae(r),i=e.batch.batchId;try{const o=await JA(t.localStore,e);Sw(t,i,null),Iw(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await vl(t,o)}catch(o){await Ho(o)}}async function qR(r,e,t){const i=Ae(r);try{const o=await(function(h,p){const f=Ae(h);return f.persistence.runTransaction("Reject batch","readwrite-primary",(m=>{let _;return f.mutationQueue.lookupMutationBatch(m,p).next((w=>($e(w!==null,37113),_=w.keys(),f.mutationQueue.removeMutationBatch(m,w)))).next((()=>f.mutationQueue.performConsistencyCheck(m))).next((()=>f.documentOverlayCache.removeOverlaysForBatchId(m,_,p))).next((()=>f.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(m,_))).next((()=>f.localDocuments.getDocuments(m,_)))}))})(i.localStore,e);Sw(i,e,t),Iw(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await vl(i,o)}catch(o){await Ho(o)}}function Iw(r,e){(r.pu.get(e)||[]).forEach((t=>{t.resolve()})),r.pu.delete(e)}function Sw(r,e,t){const i=Ae(r);let o=i.gu[i.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),i.gu[i.currentUser.toKey()]=o}}function df(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const i of r.Au.get(e))r.Ru.delete(i),t&&r.Eu.bu(i,t);r.Au.delete(e),r.isPrimaryClient&&r.fu.Qr(e).forEach((i=>{r.fu.containsKey(i)||Aw(r,i)}))}function Aw(r,e){r.Vu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(jf(r.remoteStore,t),r.du=r.du.remove(e),r.mu.delete(t),Kf(r))}function Dy(r,e,t){for(const i of t)i instanceof vw?(r.fu.addReference(i.key,e),HR(r,i)):i instanceof ww?(ne(Gf,"Document no longer in limbo: "+i.key),r.fu.removeReference(i.key,e),r.fu.containsKey(i.key)||Aw(r,i.key)):_e(19791,{Du:i})}function HR(r,e){const t=e.key,i=t.path.canonicalString();r.du.get(t)||r.Vu.has(i)||(ne(Gf,"New document in limbo: "+t),r.Vu.add(i),Kf(r))}function Kf(r){for(;r.Vu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Vu.values().next().value;r.Vu.delete(e);const t=new pe(Ye.fromString(e)),i=r.yu.next();r.mu.set(i,new OR(t)),r.du=r.du.insert(t,i),cw(r.remoteStore,new Mr(ar(Nf(t.path)),i,"TargetPurposeLimboResolution",Dc.ce))}}async function vl(r,e,t){const i=Ae(r),o=[],l=[],h=[];i.Ru.isEmpty()||(i.Ru.forEach(((p,f)=>{h.push(i.Su(f,e,t).then((m=>{var _;if((m||t)&&i.isPrimaryClient){const w=m?!m.fromCache:(_=t==null?void 0:t.targetChanges.get(f.targetId))==null?void 0:_.current;i.sharedClientState.updateQueryState(f.targetId,w?"current":"not-current")}if(m){o.push(m);const w=Ff.Is(f.targetId,m);l.push(w)}})))})),await Promise.all(h),i.Eu.J_(o),await(async function(f,m){const _=Ae(f);try{await _.persistence.runTransaction("notifyLocalViewChanges","readwrite",(w=>H.forEach(m,(T=>H.forEach(T.Ps,(x=>_.persistence.referenceDelegate.addReference(w,T.targetId,x))).next((()=>H.forEach(T.Ts,(x=>_.persistence.referenceDelegate.removeReference(w,T.targetId,x)))))))))}catch(w){if(!Wo(w))throw w;ne(Uf,"Failed to update sequence numbers: "+w)}for(const w of m){const T=w.targetId;if(!w.fromCache){const x=_.Cs.get(T),L=x.snapshotVersion,z=x.withLastLimboFreeSnapshotVersion(L);_.Cs=_.Cs.insert(T,z)}}})(i.localStore,l))}async function WR(r,e){const t=Ae(r);if(!t.currentUser.isEqual(e)){ne(Gf,"User change. New user:",e.toKey());const i=await ow(t.localStore,e);t.currentUser=e,(function(l,h){l.pu.forEach((p=>{p.forEach((f=>{f.reject(new le(q.CANCELLED,h))}))})),l.pu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await vl(t,i.Os)}}function GR(r,e){const t=Ae(r),i=t.mu.get(e);if(i&&i.Iu)return Ne().add(i.key);{let o=Ne();const l=t.Au.get(e);if(!l)return o;for(const h of l){const p=t.Ru.get(h);o=o.unionWith(p.view.su)}return o}}function Rw(r){const e=Ae(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Tw.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=GR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=BR.bind(null,e),e.Eu.J_=NR.bind(null,e.eventManager),e.Eu.bu=xR.bind(null,e.eventManager),e}function KR(r){const e=Ae(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=$R.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=qR.bind(null,e),e}class yc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=jc(e.databaseInfo.databaseId),this.sharedClientState=this.Fu(e),this.persistence=this.Mu(e),await this.persistence.start(),this.localStore=this.xu(e),this.gcScheduler=this.Ou(e,this.localStore),this.indexBackfillerScheduler=this.Nu(e,this.localStore)}Ou(e,t){return null}Nu(e,t){return null}xu(e){return XA(this.persistence,new KA,e.initialUser,this.serializer)}Mu(e){return new sw(bf.Ai,this.serializer)}Fu(e){return new iR}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}yc.provider={build:()=>new yc};class QR extends yc{constructor(e){super(),this.cacheSizeBytes=e}Ou(e,t){$e(this.persistence.referenceDelegate instanceof mc,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new VA(i,e.asyncQueue,t)}Mu(e){const t=this.cacheSizeBytes!==void 0?en.withCacheSize(this.cacheSizeBytes):en.DEFAULT;return new sw((i=>mc.Ai(i,t)),this.serializer)}}class ff{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>xy(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=WR.bind(null,this.syncEngine),await CR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new kR})()}createDatastore(e){const t=jc(e.databaseInfo.databaseId),i=uR(e.databaseInfo);return pR(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,o,l,h,p){return new gR(i,o,l,h,p)})(this.localStore,this.datastore,e.asyncQueue,(t=>xy(this.syncEngine,t,0)),(function(){return Ay.v()?new Ay:new sR})())}createSyncEngine(e,t){return(function(o,l,h,p,f,m,_){const w=new MR(o,l,h,p,f,m);return _&&(w.wu=!0),w})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Ae(o);ne(mr,"RemoteStore shutting down."),l.Va.add(5),await _l(l),l.ma.shutdown(),l.fa.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}ff.provider={build:()=>new ff};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cw{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Lu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Lu(this.observer.error,e):Ur("Uncaught Error in snapshot listener:",e.toString()))}ku(){this.muted=!0}Lu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bi="FirestoreClient";class YR{constructor(e,t,i,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this._databaseInfo=o,this.user=zt.UNAUTHENTICATED,this.clientId=Sf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(i,(async h=>{ne(bi,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(i,(h=>(ne(bi,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ci;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=Hf(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function Od(r,e){r.asyncQueue.verifyOperationInProgress(),ne(bi,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let i=t.initialUser;r.setCredentialChangeListener((async o=>{i.isEqual(o)||(await ow(e.localStore,o),i=o)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function Vy(r,e){r.asyncQueue.verifyOperationInProgress();const t=await XR(r);ne(bi,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((i=>Cy(e.remoteStore,i))),r.setAppCheckTokenChangeListener(((i,o)=>Cy(e.remoteStore,o))),r._onlineComponents=e}async function XR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ne(bi,"Using user provided OfflineComponentProvider");try{await Od(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===q.FAILED_PRECONDITION||o.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;Ss("Error using user provided cache. Falling back to memory cache: "+t),await Od(r,new yc)}}else ne(bi,"Using default OfflineComponentProvider"),await Od(r,new QR(void 0));return r._offlineComponents}async function Pw(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ne(bi,"Using user provided OnlineComponentProvider"),await Vy(r,r._uninitializedComponentsProvider._online)):(ne(bi,"Using default OnlineComponentProvider"),await Vy(r,new ff))),r._onlineComponents}function JR(r){return Pw(r).then((e=>e.syncEngine))}async function pf(r){const e=await Pw(r),t=e.eventManager;return t.onListen=LR.bind(null,e.syncEngine),t.onUnlisten=UR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=bR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=jR.bind(null,e.syncEngine),t}function ZR(r,e,t,i){const o=new Cw(i),l=new _w(e,o,t);return r.asyncQueue.enqueueAndForget((async()=>gw(await pf(r),l))),()=>{o.ku(),r.asyncQueue.enqueueAndForget((async()=>yw(await pf(r),l)))}}function eC(r,e,t={}){const i=new Ci;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,p,f,m){const _=new Cw({next:T=>{_.ku(),h.enqueueAndForget((()=>yw(l,w))),T.fromCache&&f.source==="server"?m.reject(new le(q.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):m.resolve(T)},error:T=>m.reject(T)}),w=new _w(p,_,{includeMetadataChanges:!0,$a:!0});return gw(l,w)})(await pf(r),r.asyncQueue,e,t,i))),i.promise}function tC(r,e){const t=new Ci;return r.asyncQueue.enqueueAndForget((async()=>zR(await JR(r),e,t))),t.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kw(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nC="ComponentProvider",Oy=new Map;function rC(r,e,t,i,o){return new SS(r,e,t,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,kw(o.experimentalLongPollingOptions),o.useFetchStreams,o.isUsingEmulator,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw="firestore.googleapis.com",My=!0;class Ly{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new le(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Nw,this.ssl=My}else this.host=e.host,this.ssl=e.ssl??My;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=iw;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<xA)throw new le(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}fS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=kw(e.experimentalLongPollingOptions??{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new le(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new le(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new le(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,o){return i.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class $c{constructor(e,t,i,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ly({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new le(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new le(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ly(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new rS;switch(i.type){case"firstParty":return new aS(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new le(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=Oy.get(t);i&&(ne(nC,"Removing Datastore"),Oy.delete(t),i.terminate())})(this),Promise.resolve()}}function iC(r,e,t,i={}){var m;r=or(r,$c);const o=dl(e),l=r._getSettings(),h={...l,emulatorOptions:r._getEmulatorOptions()},p=`${e}:${t}`;o&&Z_(`https://${p}`),l.host!==Nw&&l.host!==p&&Ss("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const f={...l,host:p,ssl:o,emulatorOptions:i};if(!Ni(f,h)&&(r._setSettings(f),i.mockUserToken)){let _,w;if(typeof i.mockUserToken=="string")_=i.mockUserToken,w=zt.MOCK_USER;else{_=NT(i.mockUserToken,(m=r._app)==null?void 0:m.options.projectId);const T=i.mockUserToken.sub||i.mockUserToken.user_id;if(!T)throw new le(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");w=new zt(T)}r._authCredentials=new iS(new fv(_,w))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Ds(this.firestore,e,this._query)}}class ht{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Pi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ht(this.firestore,e,this._key)}toJSON(){return{type:ht._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(fl(t,ht._jsonSchema))return new ht(e,i||null,new pe(Ye.fromString(t.referencePath)))}}ht._jsonSchemaVersion="firestore/documentReference/1.0",ht._jsonSchema={type:_t("string",ht._jsonSchemaVersion),referencePath:_t("string")};class Pi extends Ds{constructor(e,t,i){super(e,t,Nf(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ht(this.firestore,null,new pe(e))}withConverter(e){return new Pi(this.firestore,e,this._path)}}function sC(r,e,...t){if(r=It(r),pv("collection","path",e),r instanceof $c){const i=Ye.fromString(e,...t);return Qg(i),new Pi(r,null,i)}{if(!(r instanceof ht||r instanceof Pi))throw new le(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Ye.fromString(e,...t));return Qg(i),new Pi(r.firestore,null,i)}}function _s(r,e,...t){if(r=It(r),arguments.length===1&&(e=Sf.newId()),pv("doc","path",e),r instanceof $c){const i=Ye.fromString(e,...t);return Kg(i),new ht(r,null,new pe(i))}{if(!(r instanceof ht||r instanceof Pi))throw new le(q.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Ye.fromString(e,...t));return Kg(i),new ht(r.firestore,r instanceof Pi?r.converter:null,new pe(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const by="AsyncQueue";class Fy{constructor(e=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new lw(this,"async_queue_retry"),this.cc=()=>{const i=Vd();i&&ne(by,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this.lc=e;const t=Vd();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hc(),this.Pc(e)}enterRestrictedMode(e){if(!this.rc){this.rc=!0,this.ac=e||!1;const t=Vd();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.cc)}}enqueue(e){if(this.hc(),this.rc)return new Promise((()=>{}));const t=new Ci;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.nc.push(e),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(e){if(!Wo(e))throw e;ne(by,"Operation failed with retryable error: "+e)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(e){const t=this.lc.then((()=>(this._c=!0,e().catch((i=>{throw this.oc=i,this._c=!1,Ur("INTERNAL UNHANDLED ERROR: ",Uy(i)),i})).then((i=>(this._c=!1,i))))));return this.lc=t,t}enqueueAfterDelay(e,t,i){this.hc(),this.uc.indexOf(e)>-1&&(t=0);const o=qf.createAndSchedule(this,e,t,i,(l=>this.Ic(l)));return this.sc.push(o),o}hc(){this.oc&&_e(47125,{Ec:Uy(this.oc)})}verifyOperationInProgress(){}async Rc(){let e;do e=this.lc,await e;while(e!==this.lc)}Ac(e){for(const t of this.sc)if(t.timerId===e)return!0;return!1}Vc(e){return this.Rc().then((()=>{this.sc.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.sc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Rc()}))}dc(e){this.uc.push(e)}Ic(e){const t=this.sc.indexOf(e);this.sc.splice(t,1)}}function Uy(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class jo extends $c{constructor(e,t,i,o){super(e,t,i,o),this.type="firestore",this._queue=new Fy,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Fy(e),this._firestoreClient=void 0,await e}}}function oC(r,e){const t=typeof r=="object"?r:Tf(),i=typeof r=="string"?r:oc,o=ks(t,"firestore").getImmediate({identifier:i});if(!o._initialized){const l=PT("firestore");l&&iC(o,...l)}return o}function Qf(r){if(r._terminated)throw new le(q.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||aC(r),r._firestoreClient}function aC(r){var i,o,l,h;const e=r._freezeSettings(),t=rC(r._databaseId,((i=r._app)==null?void 0:i.options.appId)||"",r._persistenceKey,(o=r._app)==null?void 0:o.options.apiKey,e);r._componentsProvider||(l=e.localCache)!=null&&l._offlineComponentProvider&&((h=e.localCache)!=null&&h._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new YR(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(f){const m=f==null?void 0:f._online.build();return{_offline:f==null?void 0:f._offline.build(m),_online:m}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e){this._byteString=e}static fromBase64String(e){try{return new In(Ot.fromBase64String(e))}catch(t){throw new le(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new In(Ot.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:In._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(fl(e,In._jsonSchema))return In.fromBase64String(e.bytes)}}In._jsonSchemaVersion="firestore/bytes/1.0",In._jsonSchema={type:_t("string",In._jsonSchemaVersion),bytes:_t("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new le(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Vt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new le(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new le(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ke(this._lat,e._lat)||ke(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:cr._jsonSchemaVersion}}static fromJSON(e){if(fl(e,cr._jsonSchema))return new cr(e.latitude,e.longitude)}}cr._jsonSchemaVersion="firestore/geoPoint/1.0",cr._jsonSchema={type:_t("string",cr._jsonSchemaVersion),latitude:_t("number"),longitude:_t("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,o){if(i.length!==o.length)return!1;for(let l=0;l<i.length;++l)if(i[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Ln._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(fl(e,Ln._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Ln(e.vectorValues);throw new le(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ln._jsonSchemaVersion="firestore/vectorValue/1.0",Ln._jsonSchema={type:_t("string",Ln._jsonSchemaVersion),vectorValues:_t("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lC=/^__.*__$/;class uC{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new Ui(e,this.data,this.fieldMask,t,this.fieldTransforms):new ml(e,this.data,t,this.fieldTransforms)}}class xw{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return new Ui(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Dw(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw _e(40011,{dataSource:r})}}class Xf{constructor(e,t,i,o,l,h){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=o,l===void 0&&this.mc(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Xf({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.yc(e),i}wc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.mc(),i}Sc(e){return this.i({path:void 0,arrayElement:!0})}bc(e){return _c(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}mc(){if(this.path)for(let e=0;e<this.path.length;e++)this.yc(this.path.get(e))}yc(e){if(e.length===0)throw this.bc("Document fields must not be empty");if(Dw(this.dataSource)&&lC.test(e))throw this.bc('Document fields cannot begin and end with "__"')}}class cC{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||jc(e)}V(e,t,i,o=!1){return new Xf({dataSource:e,methodName:t,targetDoc:i,path:Vt.emptyPath(),arrayElement:!1,hasConverter:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Jf(r){const e=r._freezeSettings(),t=jc(r._databaseId);return new cC(r._databaseId,!!e.ignoreUndefinedProperties,t)}function hC(r,e,t,i,o,l={}){const h=r.V(l.merge||l.mergeFields?2:0,e,t,o);ep("Data must be an object, but it was:",h,i);const p=Vw(i,h);let f,m;if(l.merge)f=new fn(h.fieldMask),m=h.fieldTransforms;else if(l.mergeFields){const _=[];for(const w of l.mergeFields){const T=zo(e,w,t);if(!h.contains(T))throw new le(q.INVALID_ARGUMENT,`Field '${T}' is specified in your field mask but missing from your input data.`);Lw(_,T)||_.push(T)}f=new fn(_),m=h.fieldTransforms.filter((w=>f.covers(w.field)))}else f=null,m=h.fieldTransforms;return new uC(new tn(p),f,m)}class Hc extends qc{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.bc(`${this._methodName}() can only appear at the top level of your update data`):e.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Hc}}class Zf extends qc{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=new Fo(e.serializer,Uv(e.serializer,this.vc));return new XS(e.path,t)}isEqual(e){return e instanceof Zf&&(this.vc===e.vc||Number.isNaN(this.vc)&&Number.isNaN(e.vc))}}function dC(r,e,t,i){const o=r.V(1,e,t);ep("Data must be an object, but it was:",o,i);const l=[],h=tn.empty();Fi(i,((f,m)=>{const _=Mw(e,f,t);m=It(m);const w=o.wc(_);if(m instanceof Hc)l.push(_);else{const T=wl(m,w);T!=null&&(l.push(_),h.set(_,T))}}));const p=new fn(l);return new xw(h,p,o.fieldTransforms)}function fC(r,e,t,i,o,l){const h=r.V(1,e,t),p=[zo(e,i,t)],f=[o];if(l.length%2!=0)throw new le(q.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let T=0;T<l.length;T+=2)p.push(zo(e,l[T])),f.push(l[T+1]);const m=[],_=tn.empty();for(let T=p.length-1;T>=0;--T)if(!Lw(m,p[T])){const x=p[T];let L=f[T];L=It(L);const z=h.wc(x);if(L instanceof Hc)m.push(x);else{const O=wl(L,z);O!=null&&(m.push(x),_.set(x,O))}}const w=new fn(m);return new xw(_,w,h.fieldTransforms)}function pC(r,e,t,i=!1){return wl(t,r.V(i?4:3,e))}function wl(r,e){if(Ow(r=It(r)))return ep("Unsupported field value:",e,r),Vw(r,e);if(r instanceof qc)return(function(i,o){if(!Dw(o.dataSource))throw o.bc(`${i._methodName}() can only be used with update() and set()`);if(!o.path)throw o.bc(`${i._methodName}() is not currently supported inside arrays`);const l=i._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.bc("Nested arrays are not supported");return(function(i,o){const l=[];let h=0;for(const p of i){let f=wl(p,o.Sc(h));f==null&&(f={nullValue:"NULL_VALUE"}),l.push(f),h++}return{arrayValue:{values:l}}})(r,e)}return(function(i,o){if((i=It(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return Uv(o.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const l=Ke.fromDate(i);return{timestampValue:pc(o.serializer,l)}}if(i instanceof Ke){const l=new Ke(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:pc(o.serializer,l)}}if(i instanceof cr)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof In)return{bytesValue:Yv(o.serializer,i._byteString)};if(i instanceof ht){const l=o.databaseId,h=i.firestore._databaseId;if(!h.isEqual(l))throw o.bc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:Mf(i.firestore._databaseId||o.databaseId,i._key.path)}}if(i instanceof Ln)return(function(h,p){const f=h instanceof Ln?h.toArray():h;return{mapValue:{fields:{[Iv]:{stringValue:Sv},[ac]:{arrayValue:{values:f.map((_=>{if(typeof _!="number")throw p.bc("VectorValues must only contain numeric values.");return bc(p.serializer,_)}))}}}}}})(i,o);if(rw(i))return i._toProto(o.serializer);throw o.bc(`Unsupported field value: ${xc(i)}`)})(r,e)}function Vw(r,e){const t={};return yv(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Fi(r,((i,o)=>{const l=wl(o,e.gc(i));l!=null&&(t[i]=l)})),{mapValue:{fields:t}}}function Ow(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ke||r instanceof cr||r instanceof In||r instanceof ht||r instanceof qc||r instanceof Ln||rw(r))}function ep(r,e,t){if(!Ow(t)||!mv(t)){const i=xc(t);throw i==="an object"?e.bc(r+" a custom object"):e.bc(r+" "+i)}}function zo(r,e,t){if((e=It(e))instanceof Yf)return e._internalPath;if(typeof e=="string")return Mw(r,e);throw _c("Field path arguments must be of type string or ",r,!1,void 0,t)}const mC=new RegExp("[~\\*/\\[\\]]");function Mw(r,e,t){if(e.search(mC)>=0)throw _c(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Yf(...e.split("."))._internalPath}catch{throw _c(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function _c(r,e,t,i,o){const l=i&&!i.isEmpty(),h=o!==void 0;let p=`Function ${e}() called with invalid data`;t&&(p+=" (via `toFirestore()`)"),p+=". ";let f="";return(l||h)&&(f+=" (found",l&&(f+=` in field ${i}`),h&&(f+=` in document ${o}`),f+=")"),new le(q.INVALID_ARGUMENT,p+r+f)}function Lw(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gC{convertValue(e,t="none"){switch(Oi(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ct(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Vi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw _e(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return Fi(e,((o,l)=>{i[o]=this.convertValue(l,t)})),i}convertVectorValue(e){var i,o,l;const t=(l=(o=(i=e.fields)==null?void 0:i[ac].arrayValue)==null?void 0:o.values)==null?void 0:l.map((h=>ct(h.doubleValue)));return new Ln(t)}convertGeoPoint(e){return new cr(ct(e.latitude),ct(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=Oc(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(rl(e));default:return null}}convertTimestamp(e){const t=Di(e);return new Ke(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=Ye.fromString(e);$e(nw(i),9688,{name:e});const o=new il(i.get(1),i.get(3)),l=new pe(i.popFirst(5));return o.isEqual(t)||Ur(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp extends gC{constructor(e){super(),this.firestore=e}convertBytes(e){return new In(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ht(this.firestore,null,t)}}function yC(r){return new Zf("increment",r)}const jy="@firebase/firestore",zy="4.15.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function By(r){return(function(t,i){if(typeof t!="object"||t===null)return!1;const o=t;for(const l of i)if(l in o&&typeof o[l]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bw{constructor(e,t,i,o,l){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new ht(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new _C(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(zo("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class _C extends bw{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fw(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new le(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class np{}class vC extends np{}function wC(r,e,...t){let i=[];e instanceof np&&i.push(e),i=i.concat(t),(function(l){const h=l.filter((f=>f instanceof rp)).length,p=l.filter((f=>f instanceof Wc)).length;if(h>1||h>0&&p>0)throw new le(q.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const o of i)r=o._apply(r);return r}class Wc extends vC{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new Wc(e,t,i)}_apply(e){const t=this._parse(e);return Uw(e._query,t),new Ds(e.firestore,e.converter,tf(e._query,t))}_parse(e){const t=Jf(e.firestore);return(function(l,h,p,f,m,_,w){let T;if(m.isKeyField()){if(_==="array-contains"||_==="array-contains-any")throw new le(q.INVALID_ARGUMENT,`Invalid Query. You can't perform '${_}' queries on documentId().`);if(_==="in"||_==="not-in"){Hy(w,_);const L=[];for(const z of w)L.push(qy(f,l,z));T={arrayValue:{values:L}}}else T=qy(f,l,w)}else _!=="in"&&_!=="not-in"&&_!=="array-contains-any"||Hy(w,_),T=pC(p,h,w,_==="in"||_==="not-in");return yt.create(m,_,T)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function $y(r,e,t){const i=e,o=zo("where",r);return Wc._create(o,i,t)}class rp extends np{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new rp(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:Fn.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const p=l.getFlattenedFilters();for(const f of p)Uw(h,f),h=tf(h,f)})(e._query,t),new Ds(e.firestore,e.converter,tf(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function qy(r,e,t){if(typeof(t=It(t))=="string"){if(t==="")throw new le(q.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Vv(e)&&t.indexOf("/")!==-1)throw new le(q.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(Ye.fromString(t));if(!pe.isDocumentKey(i))throw new le(q.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return ry(r,new pe(i))}if(t instanceof ht)return ry(r,t._key);throw new le(q.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xc(t)}.`)}function Hy(r,e){if(!Array.isArray(r)||r.length===0)throw new le(q.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Uw(r,e){const t=(function(o,l){for(const h of o)for(const p of h.getFlattenedFilters())if(l.indexOf(p.op)>=0)return p.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new le(q.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new le(q.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function EC(r,e,t){let i;return i=r?r.toFirestore(e):e,i}class Qa{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class vs extends bw{constructor(e,t,i,o,l,h){super(e,t,i,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Xu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(zo("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new le(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=vs._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}vs._jsonSchemaVersion="firestore/documentSnapshot/1.0",vs._jsonSchema={type:_t("string",vs._jsonSchemaVersion),bundleSource:_t("string","DocumentSnapshot"),bundleName:_t("string"),bundle:_t("string")};class Xu extends vs{data(e={}){return super.data(e)}}class ws{constructor(e,t,i,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Qa(o.hasPendingWrites,o.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new Xu(this._firestore,this._userDataWriter,i.key,i,new Qa(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new le(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((p=>{const f=new Xu(o._firestore,o._userDataWriter,p.doc.key,p.doc,new Qa(o._snapshot.mutatedKeys.has(p.doc.key),o._snapshot.fromCache),o.query.converter);return p.doc,{type:"added",doc:f,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((p=>l||p.type!==3)).map((p=>{const f=new Xu(o._firestore,o._userDataWriter,p.doc.key,p.doc,new Qa(o._snapshot.mutatedKeys.has(p.doc.key),o._snapshot.fromCache),o.query.converter);let m=-1,_=-1;return p.type!==0&&(m=h.indexOf(p.doc.key),h=h.delete(p.doc.key)),p.type!==1&&(h=h.add(p.doc),_=h.indexOf(p.doc.key)),{type:TC(p.type),doc:f,oldIndex:m,newIndex:_}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new le(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ws._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Sf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),i.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function TC(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return _e(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ws._jsonSchemaVersion="firestore/querySnapshot/1.0",ws._jsonSchema={type:_t("string",ws._jsonSchemaVersion),bundleSource:_t("string","QuerySnapshot"),bundleName:_t("string"),bundle:_t("string")};function IC(r){r=or(r,Ds);const e=or(r.firestore,jo),t=Qf(e),i=new tp(e);return Fw(r._query),eC(t,r._query).then((o=>new ws(e,i,r,o)))}function jw(r,e,t){r=or(r,ht);const i=or(r.firestore,jo),o=EC(r.converter,e),l=Jf(i);return Bw(i,[hC(l,"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,lr.none())])}function ul(r,e,t,...i){r=or(r,ht);const o=or(r.firestore,jo),l=Jf(o);let h;return h=typeof(e=It(e))=="string"||e instanceof Yf?fC(l,"updateDoc",r._key,e,t,i):dC(l,"updateDoc",r._key,e),Bw(o,[h.toMutation(r._key,lr.exists(!0))])}function zw(r,...e){var m,_,w;r=It(r);let t={includeMetadataChanges:!1,source:"default"},i=0;typeof e[i]!="object"||By(e[i])||(t=e[i++]);const o={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(By(e[i])){const T=e[i];e[i]=(m=T.next)==null?void 0:m.bind(T),e[i+1]=(_=T.error)==null?void 0:_.bind(T),e[i+2]=(w=T.complete)==null?void 0:w.bind(T)}let l,h,p;if(r instanceof ht)h=or(r.firestore,jo),p=Nf(r._key.path),l={next:T=>{e[i]&&e[i](SC(h,r,T))},error:e[i+1],complete:e[i+2]};else{const T=or(r,Ds);h=or(T.firestore,jo),p=T._query;const x=new tp(h);l={next:L=>{e[i]&&e[i](new ws(h,x,T,L))},error:e[i+1],complete:e[i+2]},Fw(r._query)}const f=Qf(h);return ZR(f,p,o,l)}function Bw(r,e){const t=Qf(r);return tC(t,e)}function SC(r,e,t){const i=t.docs.get(e._key),o=new tp(r);return new vs(r,o,e._key,i,new Qa(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){nS($o),fr(new bn("firestore",((i,{instanceIdentifier:o,options:l})=>{const h=i.getProvider("app").getImmediate(),p=new jo(new sS(i.getProvider("auth-internal")),new lS(h,i.getProvider("app-check-internal")),AS(h,o),h);return l={useFetchStreams:t,...l},p._setSettings(l),p}),"PUBLIC").setMultipleInstances(!0)),Sn(jy,zy,e),Sn(jy,zy,"esm2020")})();var AC="firebase",RC="12.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Sn(AC,RC,"app");const $w="@firebase/installations",ip="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qw=1e4,Hw=`w:${ip}`,Ww="FIS_v2",CC="https://firebaseinstallations.googleapis.com/v1",PC=3600*1e3,kC="installations",NC="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xC={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},As=new Ps(kC,NC,xC);function Gw(r){return r instanceof Un&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kw({projectId:r}){return`${CC}/projects/${r}/installations`}function Qw(r){return{token:r.token,requestStatus:2,expiresIn:VC(r.expiresIn),creationTime:Date.now()}}async function Yw(r,e){const i=(await e.json()).error;return As.create("request-failed",{requestName:r,serverCode:i.code,serverMessage:i.message,serverStatus:i.status})}function Xw({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function DC(r,{refreshToken:e}){const t=Xw(r);return t.append("Authorization",OC(e)),t}async function Jw(r){const e=await r();return e.status>=500&&e.status<600?r():e}function VC(r){return Number(r.replace("s","000"))}function OC(r){return`${Ww} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function MC({appConfig:r,heartbeatServiceProvider:e},{fid:t}){const i=Kw(r),o=Xw(r),l=e.getImmediate({optional:!0});if(l){const m=await l.getHeartbeatsHeader();m&&o.append("x-firebase-client",m)}const h={fid:t,authVersion:Ww,appId:r.appId,sdkVersion:Hw},p={method:"POST",headers:o,body:JSON.stringify(h)},f=await Jw(()=>fetch(i,p));if(f.ok){const m=await f.json();return{fid:m.fid||t,registrationStatus:2,refreshToken:m.refreshToken,authToken:Qw(m.authToken)}}else throw await Yw("Create Installation",f)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zw(r){return new Promise(e=>{setTimeout(e,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LC(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bC=/^[cdef][\w-]{21}$/,mf="";function FC(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const t=UC(r);return bC.test(t)?t:mf}catch{return mf}}function UC(r){return LC(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eE=new Map;function tE(r,e){const t=Gc(r);nE(t,e),jC(t,e)}function nE(r,e){const t=eE.get(r);if(t)for(const i of t)i(e)}function jC(r,e){const t=zC();t&&t.postMessage({key:r,fid:e}),BC()}let ys=null;function zC(){return!ys&&"BroadcastChannel"in self&&(ys=new BroadcastChannel("[Firebase] FID Change"),ys.onmessage=r=>{nE(r.data.key,r.data.fid)}),ys}function BC(){eE.size===0&&ys&&(ys.close(),ys=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $C="firebase-installations-database",qC=1,Rs="firebase-installations-store";let Md=null;function sp(){return Md||(Md=nv($C,qC,{upgrade:(r,e)=>{switch(e){case 0:r.createObjectStore(Rs)}}})),Md}async function vc(r,e){const t=Gc(r),o=(await sp()).transaction(Rs,"readwrite"),l=o.objectStore(Rs),h=await l.get(t);return await l.put(e,t),await o.done,(!h||h.fid!==e.fid)&&tE(r,e.fid),e}async function rE(r){const e=Gc(r),i=(await sp()).transaction(Rs,"readwrite");await i.objectStore(Rs).delete(e),await i.done}async function Kc(r,e){const t=Gc(r),o=(await sp()).transaction(Rs,"readwrite"),l=o.objectStore(Rs),h=await l.get(t),p=e(h);return p===void 0?await l.delete(t):await l.put(p,t),await o.done,p&&(!h||h.fid!==p.fid)&&tE(r,p.fid),p}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function op(r){let e;const t=await Kc(r.appConfig,i=>{const o=HC(i),l=WC(r,o);return e=l.registrationPromise,l.installationEntry});return t.fid===mf?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function HC(r){const e=r||{fid:FC(),registrationStatus:0};return iE(e)}function WC(r,e){if(e.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(As.create("app-offline"));return{installationEntry:e,registrationPromise:o}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},i=GC(r,t);return{installationEntry:t,registrationPromise:i}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:KC(r)}:{installationEntry:e}}async function GC(r,e){try{const t=await MC(r,e);return vc(r.appConfig,t)}catch(t){throw Gw(t)&&t.customData.serverCode===409?await rE(r.appConfig):await vc(r.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function KC(r){let e=await Wy(r.appConfig);for(;e.registrationStatus===1;)await Zw(100),e=await Wy(r.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:i}=await op(r);return i||t}return e}function Wy(r){return Kc(r,e=>{if(!e)throw As.create("installation-not-found");return iE(e)})}function iE(r){return QC(r)?{fid:r.fid,registrationStatus:0}:r}function QC(r){return r.registrationStatus===1&&r.registrationTime+qw<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YC({appConfig:r,heartbeatServiceProvider:e},t){const i=XC(r,t),o=DC(r,t),l=e.getImmediate({optional:!0});if(l){const m=await l.getHeartbeatsHeader();m&&o.append("x-firebase-client",m)}const h={installation:{sdkVersion:Hw,appId:r.appId}},p={method:"POST",headers:o,body:JSON.stringify(h)},f=await Jw(()=>fetch(i,p));if(f.ok){const m=await f.json();return Qw(m)}else throw await Yw("Generate Auth Token",f)}function XC(r,{fid:e}){return`${Kw(r)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ap(r,e=!1){let t;const i=await Kc(r.appConfig,l=>{if(!sE(l))throw As.create("not-registered");const h=l.authToken;if(!e&&e1(h))return l;if(h.requestStatus===1)return t=JC(r,e),l;{if(!navigator.onLine)throw As.create("app-offline");const p=n1(l);return t=ZC(r,p),p}});return t?await t:i.authToken}async function JC(r,e){let t=await Gy(r.appConfig);for(;t.authToken.requestStatus===1;)await Zw(100),t=await Gy(r.appConfig);const i=t.authToken;return i.requestStatus===0?ap(r,e):i}function Gy(r){return Kc(r,e=>{if(!sE(e))throw As.create("not-registered");const t=e.authToken;return r1(t)?{...e,authToken:{requestStatus:0}}:e})}async function ZC(r,e){try{const t=await YC(r,e),i={...e,authToken:t};return await vc(r.appConfig,i),t}catch(t){if(Gw(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await rE(r.appConfig);else{const i={...e,authToken:{requestStatus:0}};await vc(r.appConfig,i)}throw t}}function sE(r){return r!==void 0&&r.registrationStatus===2}function e1(r){return r.requestStatus===2&&!t1(r)}function t1(r){const e=Date.now();return e<r.creationTime||r.creationTime+r.expiresIn<e+PC}function n1(r){const e={requestStatus:1,requestTime:Date.now()};return{...r,authToken:e}}function r1(r){return r.requestStatus===1&&r.requestTime+qw<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i1(r){const e=r,{installationEntry:t,registrationPromise:i}=await op(e);return i?i.catch(console.error):ap(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function s1(r,e=!1){const t=r;return await o1(t),(await ap(t,e)).token}async function o1(r){const{registrationPromise:e}=await op(r);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a1(r){if(!r||!r.options)throw Ld("App Configuration");if(!r.name)throw Ld("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!r.options[t])throw Ld(t);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function Ld(r){return As.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oE="installations",l1="installations-internal",u1=r=>{const e=r.getProvider("app").getImmediate(),t=a1(e),i=ks(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:i,_delete:()=>Promise.resolve()}},c1=r=>{const e=r.getProvider("app").getImmediate(),t=ks(e,oE).getImmediate();return{getId:()=>i1(t),getToken:o=>s1(t,o)}};function h1(){fr(new bn(oE,u1,"PUBLIC")),fr(new bn(l1,c1,"PRIVATE"))}h1();Sn($w,ip);Sn($w,ip,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wc="analytics",d1="firebase_id",f1="origin",p1=60*1e3,m1="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",lp="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new Nc("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g1={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},pn=new Ps("analytics","Analytics",g1);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y1(r){if(!r.startsWith(lp)){const e=pn.create("invalid-gtag-resource",{gtagURL:r});return Gt.warn(e.message),""}return r}function aE(r){return Promise.all(r.map(e=>e.catch(t=>t)))}function _1(r,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(r,e)),t}function v1(r,e){const t=_1("firebase-js-sdk-policy",{createScriptURL:y1}),i=document.createElement("script"),o=`${lp}?l=${r}&id=${e}`;i.src=t?t==null?void 0:t.createScriptURL(o):o,i.async=!0,document.head.appendChild(i)}function w1(r){let e=[];return Array.isArray(window[r])?e=window[r]:window[r]=e,e}async function E1(r,e,t,i,o,l){const h=i[o];try{if(h)await e[h];else{const f=(await aE(t)).find(m=>m.measurementId===o);f&&await e[f.appId]}}catch(p){Gt.error(p)}r("config",o,l)}async function T1(r,e,t,i,o){try{let l=[];if(o&&o.send_to){let h=o.send_to;Array.isArray(h)||(h=[h]);const p=await aE(t);for(const f of h){const m=p.find(w=>w.measurementId===f),_=m&&e[m.appId];if(_)l.push(_);else{l=[];break}}}l.length===0&&(l=Object.values(e)),await Promise.all(l),r("event",i,o||{})}catch(l){Gt.error(l)}}function I1(r,e,t,i){async function o(l,...h){try{if(l==="event"){const[p,f]=h;await T1(r,e,t,p,f)}else if(l==="config"){const[p,f]=h;await E1(r,e,t,i,p,f)}else if(l==="consent"){const[p,f]=h;r("consent",p,f)}else if(l==="get"){const[p,f,m]=h;r("get",p,f,m)}else if(l==="set"){const[p]=h;r("set",p)}else r(l,...h)}catch(p){Gt.error(p)}}return o}function S1(r,e,t,i,o){let l=function(...h){window[i].push(arguments)};return window[o]&&typeof window[o]=="function"&&(l=window[o]),window[o]=I1(l,r,e,t),{gtagCore:l,wrappedGtag:window[o]}}function A1(r){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(lp)&&t.src.includes(r))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R1=30,C1=1e3;class P1{constructor(e={},t=C1){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const lE=new P1;function k1(r){return new Headers({Accept:"application/json","x-goog-api-key":r})}async function N1(r){var h;const{appId:e,apiKey:t}=r,i={method:"GET",headers:k1(t)},o=m1.replace("{app-id}",e),l=await fetch(o,i);if(l.status!==200&&l.status!==304){let p="";try{const f=await l.json();(h=f.error)!=null&&h.message&&(p=f.error.message)}catch{}throw pn.create("config-fetch-failed",{httpStatus:l.status,responseMessage:p})}return l.json()}async function x1(r,e=lE,t){const{appId:i,apiKey:o,measurementId:l}=r.options;if(!i)throw pn.create("no-app-id");if(!o){if(l)return{measurementId:l,appId:i};throw pn.create("no-api-key")}const h=e.getThrottleMetadata(i)||{backoffCount:0,throttleEndTimeMillis:Date.now()},p=new O1;return setTimeout(async()=>{p.abort()},p1),uE({appId:i,apiKey:o,measurementId:l},h,p,e)}async function uE(r,{throttleEndTimeMillis:e,backoffCount:t},i,o=lE){var p;const{appId:l,measurementId:h}=r;try{await D1(i,e)}catch(f){if(h)return Gt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${f==null?void 0:f.message}]`),{appId:l,measurementId:h};throw f}try{const f=await N1(r);return o.deleteThrottleMetadata(l),f}catch(f){const m=f;if(!V1(m)){if(o.deleteThrottleMetadata(l),h)return Gt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${m==null?void 0:m.message}]`),{appId:l,measurementId:h};throw f}const _=Number((p=m==null?void 0:m.customData)==null?void 0:p.httpStatus)===503?Lg(t,o.intervalMillis,R1):Lg(t,o.intervalMillis),w={throttleEndTimeMillis:Date.now()+_,backoffCount:t+1};return o.setThrottleMetadata(l,w),Gt.debug(`Calling attemptFetch again in ${_} millis`),uE(r,w,i,o)}}function D1(r,e){return new Promise((t,i)=>{const o=Math.max(e-Date.now(),0),l=setTimeout(t,o);r.addEventListener(()=>{clearTimeout(l),i(pn.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function V1(r){if(!(r instanceof Un)||!r.customData)return!1;const e=Number(r.customData.httpStatus);return e===429||e===500||e===503||e===504}class O1{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function M1(r,e,t,i,o){if(o&&o.global){r("event",t,i);return}else{const l=await e,h={...i,send_to:l};r("event",t,h)}}async function L1(r,e,t,i){if(i&&i.global){const o={};for(const l of Object.keys(t))o[`user_properties.${l}`]=t[l];return r("set",o),Promise.resolve()}else{const o=await e;r("config",o,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b1(){if(X_())try{await J_()}catch(r){return Gt.warn(pn.create("indexeddb-unavailable",{errorInfo:r==null?void 0:r.toString()}).message),!1}else return Gt.warn(pn.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function F1(r,e,t,i,o,l,h){const p=x1(r);p.then(T=>{t[T.measurementId]=T.appId,r.options.measurementId&&T.measurementId!==r.options.measurementId&&Gt.warn(`The measurement ID in the local Firebase config (${r.options.measurementId}) does not match the measurement ID fetched from the server (${T.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(T=>Gt.error(T)),e.push(p);const f=b1().then(T=>{if(T)return i.getId()}),[m,_]=await Promise.all([p,f]);A1(l)||v1(l,m.measurementId),o("js",new Date);const w=(h==null?void 0:h.config)??{};return w[f1]="firebase",w.update=!0,_!=null&&(w[d1]=_),o("config",m.measurementId,w),m.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U1{constructor(e){this.app=e}_delete(){return delete No[this.app.options.appId],Promise.resolve()}}let No={},Ky=[];const Qy={};let bd="dataLayer",j1="gtag",Yy,up,Xy=!1;function z1(){const r=[];if(Y_()&&r.push("This is a browser extension environment."),bT()||r.push("Cookies are not available."),r.length>0){const e=r.map((i,o)=>`(${o+1}) ${i}`).join(" "),t=pn.create("invalid-analytics-context",{errorInfo:e});Gt.warn(t.message)}}function B1(r,e,t){z1();const i=r.options.appId;if(!i)throw pn.create("no-app-id");if(!r.options.apiKey)if(r.options.measurementId)Gt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${r.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw pn.create("no-api-key");if(No[i]!=null)throw pn.create("already-exists",{id:i});if(!Xy){w1(bd);const{wrappedGtag:l,gtagCore:h}=S1(No,Ky,Qy,bd,j1);up=l,Yy=h,Xy=!0}return No[i]=F1(r,Ky,Qy,e,Yy,bd,t),new U1(r)}function $1(r=Tf()){r=It(r);const e=ks(r,wc);return e.isInitialized()?e.getImmediate():q1(r)}function q1(r,e={}){const t=ks(r,wc);if(t.isInitialized()){const o=t.getImmediate();if(Ni(e,t.getOptions()))return o;throw pn.create("already-initialized")}return t.initialize({options:e})}function H1(r,e,t){r=It(r),L1(up,No[r.app.options.appId],e,t).catch(i=>Gt.error(i))}function W1(r,e,t,i){r=It(r),M1(up,No[r.app.options.appId],e,t,i).catch(o=>Gt.error(o))}const Jy="@firebase/analytics",Zy="0.10.22";function G1(){fr(new bn(wc,(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),o=e.getProvider("installations-internal").getImmediate();return B1(i,o,t)},"PUBLIC")),fr(new bn("analytics-internal",r,"PRIVATE")),Sn(Jy,Zy),Sn(Jy,Zy,"esm2020");function r(e){try{const t=e.getProvider(wc).getImmediate();return{logEvent:(i,o,l)=>W1(t,i,o,l),setUserProperties:(i,o)=>H1(t,i,o)}}catch(t){throw pn.create("interop-component-reg-failed",{reason:t})}}}G1();function cE(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const K1=cE,hE=new Ps("auth","Firebase",cE());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ec=new Nc("@firebase/auth");function Q1(r,...e){Ec.logLevel<=Ve.WARN&&Ec.warn(`Auth (${$o}): ${r}`,...e)}function Ju(r,...e){Ec.logLevel<=Ve.ERROR&&Ec.error(`Auth (${$o}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zr(r,...e){throw cp(r,...e)}function hr(r,...e){return cp(r,...e)}function dE(r,e,t){const i={...K1(),[e]:t};return new Ps("auth","Firebase",i).create(e,{appName:r.name})}function Es(r){return dE(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function cp(r,...e){if(typeof r!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=r.name),r._errorFactory.create(t,...i)}return hE.create(r,...e)}function we(r,e,...t){if(!r)throw cp(e,...t)}function Lr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ju(e),new Error(e)}function Br(r,e){r||Lr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gf(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function Y1(){return e_()==="http:"||e_()==="https:"}function e_(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X1(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Y1()||Y_()||"connection"in navigator)?navigator.onLine:!0}function J1(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(e,t){this.shortDelay=e,this.longDelay=t,Br(t>e,"Short delay should be less than long delay!"),this.isMobile=xT()||OT()}get(){return X1()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hp(r,e){Br(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fE{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Lr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Lr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Lr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z1={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eP=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],tP=new El(3e4,6e4);function dp(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Ko(r,e,t,i,o={}){return pE(r,o,async()=>{let l={},h={};i&&(e==="GET"?h=i:l={body:JSON.stringify(i)});const p=hl({key:r.config.apiKey,...h}).slice(1),f=await r._getAdditionalHeaders();f["Content-Type"]="application/json",r.languageCode&&(f["X-Firebase-Locale"]=r.languageCode);const m={method:e,headers:f,...l};return VT()||(m.referrerPolicy="no-referrer"),r.emulatorConfig&&dl(r.emulatorConfig.host)&&(m.credentials="include"),fE.fetch()(await mE(r,r.config.apiHost,t,p),m)})}async function pE(r,e,t){r._canInitEmulator=!1;const i={...Z1,...e};try{const o=new rP(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw qu(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const p=l.ok?h.errorMessage:h.error.message,[f,m]=p.split(" : ");if(f==="FEDERATED_USER_ID_ALREADY_LINKED")throw qu(r,"credential-already-in-use",h);if(f==="EMAIL_EXISTS")throw qu(r,"email-already-in-use",h);if(f==="USER_DISABLED")throw qu(r,"user-disabled",h);const _=i[f]||f.toLowerCase().replace(/[_\s]+/g,"-");if(m)throw dE(r,_,m);zr(r,_)}}catch(o){if(o instanceof Un)throw o;zr(r,"network-request-failed",{message:String(o)})}}async function nP(r,e,t,i,o={}){const l=await Ko(r,e,t,i,o);return"mfaPendingCredential"in l&&zr(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function mE(r,e,t,i){const o=`${e}${t}?${i}`,l=r,h=l.config.emulator?hp(r.config,o):`${r.config.apiScheme}://${o}`;return eP.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}class rP{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(hr(this.auth,"network-request-failed")),tP.get())})}}function qu(r,e,t){const i={appName:r.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const o=hr(r,e,i);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iP(r,e){return Ko(r,"POST","/v1/accounts:delete",e)}async function Tc(r,e){return Ko(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function el(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function sP(r,e=!1){const t=It(r),i=await t.getIdToken(e),o=fp(i);we(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:i,authTime:el(Fd(o.auth_time)),issuedAtTime:el(Fd(o.iat)),expirationTime:el(Fd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function Fd(r){return Number(r)*1e3}function fp(r){const[e,t,i]=r.split(".");if(e===void 0||t===void 0||i===void 0)return Ju("JWT malformed, contained fewer than 3 sections"),null;try{const o=W_(t);return o?JSON.parse(o):(Ju("Failed to decode base64 JWT payload"),null)}catch(o){return Ju("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function t_(r){const e=fp(r);return we(e,"internal-error"),we(typeof e.exp<"u","internal-error"),we(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cl(r,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof Un&&oP(i)&&r.auth.currentUser===r&&await r.auth.signOut(),i}}function oP({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aP{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const i=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yf{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=el(this.lastLoginAt),this.creationTime=el(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ic(r){var w;const e=r.auth,t=await r.getIdToken(),i=await cl(r,Tc(e,{idToken:t}));we(i==null?void 0:i.users.length,e,"internal-error");const o=i.users[0];r._notifyReloadListener(o);const l=(w=o.providerUserInfo)!=null&&w.length?gE(o.providerUserInfo):[],h=uP(r.providerData,l),p=r.isAnonymous,f=!(r.email&&o.passwordHash)&&!(h!=null&&h.length),m=p?f:!1,_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new yf(o.createdAt,o.lastLoginAt),isAnonymous:m};Object.assign(r,_)}async function lP(r){const e=It(r);await Ic(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function uP(r,e){return[...r.filter(i=>!e.some(o=>o.providerId===i.providerId)),...e]}function gE(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cP(r,e){const t=await pE(r,{},async()=>{const i=hl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await mE(r,o,"/v1/token",`key=${l}`),p=await r._getAdditionalHeaders();p["Content-Type"]="application/x-www-form-urlencoded";const f={method:"POST",headers:p,body:i};return r.emulatorConfig&&dl(r.emulatorConfig.host)&&(f.credentials="include"),fE.fetch()(h,f)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function hP(r,e){return Ko(r,"POST","/v2/accounts:revokeToken",dp(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){we(e.idToken,"internal-error"),we(typeof e.idToken<"u","internal-error"),we(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):t_(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){we(e.length!==0,"internal-error");const t=t_(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(we(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:o,expiresIn:l}=await cP(e,t);this.updateTokensAndExpiration(i,o,Number(l))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:o,expirationTime:l}=t,h=new xo;return i&&(we(typeof i=="string","internal-error",{appName:e}),h.refreshToken=i),o&&(we(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(we(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new xo,this.toJSON())}_performRefresh(){return Lr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(r,e){we(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Mn{constructor({uid:e,auth:t,stsTokenManager:i,...o}){this.providerId="firebase",this.proactiveRefresh=new aP(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new yf(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await cl(this,this.stsTokenManager.getToken(this.auth,e));return we(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return sP(this,e)}reload(){return lP(this)}_assign(e){this!==e&&(we(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Mn({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){we(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await Ic(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(sr(this.auth.app))return Promise.reject(Es(this.auth));const e=await this.getIdToken();return await cl(this,iP(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const i=t.displayName??void 0,o=t.email??void 0,l=t.phoneNumber??void 0,h=t.photoURL??void 0,p=t.tenantId??void 0,f=t._redirectEventId??void 0,m=t.createdAt??void 0,_=t.lastLoginAt??void 0,{uid:w,emailVerified:T,isAnonymous:x,providerData:L,stsTokenManager:z}=t;we(w&&z,e,"internal-error");const O=xo.fromJSON(this.name,z);we(typeof w=="string",e,"internal-error"),vi(i,e.name),vi(o,e.name),we(typeof T=="boolean",e,"internal-error"),we(typeof x=="boolean",e,"internal-error"),vi(l,e.name),vi(h,e.name),vi(p,e.name),vi(f,e.name),vi(m,e.name),vi(_,e.name);const re=new Mn({uid:w,auth:e,email:o,emailVerified:T,displayName:i,isAnonymous:x,photoURL:h,phoneNumber:l,tenantId:p,stsTokenManager:O,createdAt:m,lastLoginAt:_});return L&&Array.isArray(L)&&(re.providerData=L.map(te=>({...te}))),f&&(re._redirectEventId=f),re}static async _fromIdTokenResponse(e,t,i=!1){const o=new xo;o.updateFromServerResponse(t);const l=new Mn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:i});return await Ic(l),l}static async _fromGetAccountInfoResponse(e,t,i){const o=t.users[0];we(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?gE(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),p=new xo;p.updateFromIdToken(i);const f=new Mn({uid:o.localId,auth:e,stsTokenManager:p,isAnonymous:h}),m={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new yf(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(f,m),f}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n_=new Map;function br(r){Br(r instanceof Function,"Expected a class definition");let e=n_.get(r);return e?(Br(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,n_.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yE{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}yE.type="NONE";const r_=yE;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zu(r,e,t){return`firebase:${r}:${e}:${t}`}class Do{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:o,name:l}=this.auth;this.fullUserKey=Zu(this.userKey,o.apiKey,l),this.fullPersistenceKey=Zu("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Tc(this.auth,{idToken:e}).catch(()=>{});return t?Mn._fromGetAccountInfoResponse(this.auth,t,e):null}return Mn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new Do(br(r_),e,i);const o=(await Promise.all(t.map(async m=>{if(await m._isAvailable())return m}))).filter(m=>m);let l=o[0]||br(r_);const h=Zu(i,e.config.apiKey,e.name);let p=null;for(const m of t)try{const _=await m._get(h);if(_){let w;if(typeof _=="string"){const T=await Tc(e,{idToken:_}).catch(()=>{});if(!T)break;w=await Mn._fromGetAccountInfoResponse(e,T,_)}else w=Mn._fromJSON(e,_);m!==l&&(p=w),l=m;break}}catch{}const f=o.filter(m=>m._shouldAllowMigration);return!l._shouldAllowMigration||!f.length?new Do(l,e,i):(l=f[0],p&&await l._set(h,p.toJSON()),await Promise.all(t.map(async m=>{if(m!==l)try{await m._remove(h)}catch{}})),new Do(l,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(EE(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(_E(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(IE(e))return"Blackberry";if(SE(e))return"Webos";if(vE(e))return"Safari";if((e.includes("chrome/")||wE(e))&&!e.includes("edge/"))return"Chrome";if(TE(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=r.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function _E(r=$t()){return/firefox\//i.test(r)}function vE(r=$t()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function wE(r=$t()){return/crios\//i.test(r)}function EE(r=$t()){return/iemobile/i.test(r)}function TE(r=$t()){return/android/i.test(r)}function IE(r=$t()){return/blackberry/i.test(r)}function SE(r=$t()){return/webos/i.test(r)}function pp(r=$t()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function dP(r=$t()){var e;return pp(r)&&!!((e=window.navigator)!=null&&e.standalone)}function fP(){return MT()&&document.documentMode===10}function AE(r=$t()){return pp(r)||TE(r)||SE(r)||IE(r)||/windows phone/i.test(r)||EE(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RE(r,e=[]){let t;switch(r){case"Browser":t=i_($t());break;case"Worker":t=`${i_($t())}-${r}`;break;default:t=r}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${$o}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pP{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=l=>new Promise((h,p)=>{try{const f=e(l);h(f)}catch(f){p(f)}});i.onAbort=t,this.queue.push(i);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mP(r,e={}){return Ko(r,"GET","/v2/passwordPolicy",dp(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gP=6;class yP{constructor(e){var i;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??gP,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let o=0;o<e.length;o++)i=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _P{constructor(e,t,i,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new s_(this),this.idTokenSubscription=new s_(this),this.beforeStateQueue=new pP(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=hE,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=br(t)),this._initializationPromise=this.queue(async()=>{var i,o,l;if(!this._deleted&&(this.persistenceManager=await Do.create(this,e),(i=this._resolvePersistenceManagerAvailable)==null||i.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)==null?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Tc(this,{idToken:e}),i=await Mn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var l;if(sr(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(p=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(p,p))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let i=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(l=this.redirectUser)==null?void 0:l._redirectEventId,p=i==null?void 0:i._redirectEventId,f=await this.tryRedirectSignIn(e);(!h||h===p)&&(f!=null&&f.user)&&(i=f.user,o=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(i)}catch(h){i=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return we(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ic(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=J1()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(sr(this.app))return Promise.reject(Es(this));const t=e?It(e):null;return t&&we(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&we(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return sr(this.app)?Promise.reject(Es(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return sr(this.app)?Promise.reject(Es(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(br(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await mP(this),t=new yP(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ps("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await hP(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&br(e)||this._popupRedirectResolver;we(t,this,"argument-error"),this.redirectPersistenceManager=await Do.create(this,[br(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)==null?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const p=this._isInitialized?Promise.resolve():this._initializationPromise;if(we(p,this,"internal-error"),p.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const f=e.addObserver(t,i,o);return()=>{h=!0,f()}}else{const f=e.addObserver(t);return()=>{h=!0,f()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return we(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=RE(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){var t;if(sr(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&Q1(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function mp(r){return It(r)}class s_{constructor(e){this.auth=e,this.observer=null,this.addObserver=BT(t=>this.observer=t)}get next(){return we(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gp={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function vP(r){gp=r}function wP(r){return gp.loadJS(r)}function EP(){return gp.gapiScript}function TP(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IP(r,e){const t=ks(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(Ni(l,e??{}))return o;zr(o,"already-initialized")}return t.initialize({options:e})}function SP(r,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(br);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function AP(r,e,t){const i=mp(r);we(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const o=!1,l=CE(e),{host:h,port:p}=RP(e),f=p===null?"":`:${p}`,m={url:`${l}//${h}${f}/`},_=Object.freeze({host:h,port:p,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!i._canInitEmulator){we(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),we(Ni(m,i.config.emulator)&&Ni(_,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=m,i.emulatorConfig=_,i.settings.appVerificationDisabledForTesting=!0,dl(h)?Z_(`${l}//${h}${f}`):CP()}function CE(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function RP(r){const e=CE(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(i);if(o){const l=o[1];return{host:l,port:o_(i.substr(l.length+1))}}else{const[l,h]=i.split(":");return{host:l,port:o_(h)}}}function o_(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function CP(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Lr("not implemented")}_getIdTokenResponse(e){return Lr("not implemented")}_linkToIdToken(e,t){return Lr("not implemented")}_getReauthenticationResolver(e){return Lr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vo(r,e){return nP(r,"POST","/v1/accounts:signInWithIdp",dp(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PP="http://localhost";class Cs extends PE{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Cs(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):zr("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:o,...l}=t;if(!i||!o)return null;const h=new Cs(i,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return Vo(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,Vo(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Vo(e,t)}buildRequest(){const e={requestUri:PP,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=hl(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kE{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl extends kE{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi extends Tl{constructor(){super("facebook.com")}static credential(e){return Cs._fromParams({providerId:wi.PROVIDER_ID,signInMethod:wi.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return wi.credentialFromTaggedObject(e)}static credentialFromError(e){return wi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return wi.credential(e.oauthAccessToken)}catch{return null}}}wi.FACEBOOK_SIGN_IN_METHOD="facebook.com";wi.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or extends Tl{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Cs._fromParams({providerId:Or.PROVIDER_ID,signInMethod:Or.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Or.credentialFromTaggedObject(e)}static credentialFromError(e){return Or.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return Or.credential(t,i)}catch{return null}}}Or.GOOGLE_SIGN_IN_METHOD="google.com";Or.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei extends Tl{constructor(){super("github.com")}static credential(e){return Cs._fromParams({providerId:Ei.PROVIDER_ID,signInMethod:Ei.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ei.credentialFromTaggedObject(e)}static credentialFromError(e){return Ei.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ei.credential(e.oauthAccessToken)}catch{return null}}}Ei.GITHUB_SIGN_IN_METHOD="github.com";Ei.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti extends Tl{constructor(){super("twitter.com")}static credential(e,t){return Cs._fromParams({providerId:Ti.PROVIDER_ID,signInMethod:Ti.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ti.credentialFromTaggedObject(e)}static credentialFromError(e){return Ti.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Ti.credential(t,i)}catch{return null}}}Ti.TWITTER_SIGN_IN_METHOD="twitter.com";Ti.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,o=!1){const l=await Mn._fromIdTokenResponse(e,i,o),h=a_(i);return new Bo({user:l,providerId:h,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const o=a_(i);return new Bo({user:e,providerId:o,_tokenResponse:i,operationType:t})}}function a_(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc extends Un{constructor(e,t,i,o){super(t.code,t.message),this.operationType=i,this.user=o,Object.setPrototypeOf(this,Sc.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,o){return new Sc(e,t,i,o)}}function NE(r,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?Sc._fromErrorAndOperation(r,l,e,i):l})}async function kP(r,e,t=!1){const i=await cl(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Bo._forOperation(r,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NP(r,e,t=!1){const{auth:i}=r;if(sr(i.app))return Promise.reject(Es(i));const o="reauthenticate";try{const l=await cl(r,NE(i,o,e,r),t);we(l.idToken,i,"internal-error");const h=fp(l.idToken);we(h,i,"internal-error");const{sub:p}=h;return we(r.uid===p,i,"user-mismatch"),Bo._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&zr(i,"user-mismatch"),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xP(r,e,t=!1){if(sr(r.app))return Promise.reject(Es(r));const i="signIn",o=await NE(r,i,e),l=await Bo._fromIdTokenResponse(r,i,o);return t||await r._updateCurrentUser(l.user),l}function DP(r,e,t,i){return It(r).onIdTokenChanged(e,t,i)}function VP(r,e,t){return It(r).beforeAuthStateChanged(e,t)}const Ac="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xE{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ac,"1"),this.storage.removeItem(Ac),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OP=1e3,MP=10;class DE extends xE{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=AE(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),o=this.localCache[t];i!==o&&e(t,o,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,p,f)=>{this.notifyListeners(h,f)});return}const i=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(i);!t&&this.localCache[i]===h||this.notifyListeners(i,h)},l=this.storage.getItem(i);fP()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,MP):o()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},OP)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}DE.type="LOCAL";const LP=DE;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VE extends xE{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}VE.type="SESSION";const OE=VE;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bP(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const i=new Qc(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:o});const p=Array.from(h).map(async m=>m(t.origin,l)),f=await bP(p);t.ports[0].postMessage({status:"done",eventId:i,eventType:o,response:f})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Qc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yp(r="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FP{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((p,f)=>{const m=yp("",20);o.port1.start();const _=setTimeout(()=>{f(new Error("unsupported_event"))},i);h={messageChannel:o,onMessage(w){const T=w;if(T.data.eventId===m)switch(T.data.status){case"ack":clearTimeout(_),l=setTimeout(()=>{f(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),p(T.data.response);break;default:clearTimeout(_),clearTimeout(l),f(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:m,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(){return window}function UP(r){dr().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ME(){return typeof dr().WorkerGlobalScope<"u"&&typeof dr().importScripts=="function"}async function jP(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function zP(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function BP(){return ME()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LE="firebaseLocalStorageDb",$P=1,Rc="firebaseLocalStorage",bE="fbase_key";class Il{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Yc(r,e){return r.transaction([Rc],e?"readwrite":"readonly").objectStore(Rc)}function qP(){const r=indexedDB.deleteDatabase(LE);return new Il(r).toPromise()}function FE(){const r=indexedDB.open(LE,$P);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const i=r.result;try{i.createObjectStore(Rc,{keyPath:bE})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const i=r.result;i.objectStoreNames.contains(Rc)?e(i):(i.close(),await qP(),e(await FE()))})})}async function l_(r,e,t){const i=Yc(r,!0).put({[bE]:e,value:t});return new Il(i).toPromise()}async function HP(r,e){const t=Yc(r,!1).get(e),i=await new Il(t).toPromise();return i===void 0?null:i.value}function u_(r,e){const t=Yc(r,!0).delete(e);return new Il(t).toPromise()}const WP=800,GP=3;class UE{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=FE(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>GP)throw i;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return ME()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Qc._getInstance(BP()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,i;if(this.activeServiceWorker=await jP(),!this.activeServiceWorker)return;this.sender=new FP(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(i=e[0])!=null&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||zP()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await l_(e,Ac,"1"),await u_(e,Ac)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>l_(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>HP(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>u_(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=Yc(o,!1).getAll();return new Il(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)i.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!i.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),WP)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}UE.type="LOCAL";const KP=UE;new El(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QP(r,e){return e?br(e):(we(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p extends PE{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Vo(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Vo(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Vo(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function YP(r){return xP(r.auth,new _p(r),r.bypassAuthState)}function XP(r){const{auth:e,user:t}=r;return we(t,e,"internal-error"),NP(t,new _p(r),r.bypassAuthState)}async function JP(r){const{auth:e,user:t}=r;return we(t,e,"internal-error"),kP(t,new _p(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jE{constructor(e,t,i,o,l=!1){this.auth=e,this.resolver=i,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:o,tenantId:l,error:h,type:p}=e;if(h){this.reject(h);return}const f={auth:this.auth,requestUri:t,sessionId:i,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(p)(f))}catch(m){this.reject(m)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return YP;case"linkViaPopup":case"linkViaRedirect":return JP;case"reauthViaPopup":case"reauthViaRedirect":return XP;default:zr(this.auth,"internal-error")}}resolve(e){Br(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Br(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZP=new El(2e3,1e4);class Co extends jE{constructor(e,t,i,o,l){super(e,t,o,l),this.provider=i,this.authWindow=null,this.pollId=null,Co.currentPopupAction&&Co.currentPopupAction.cancel(),Co.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return we(e,this.auth,"internal-error"),e}async onExecution(){Br(this.filter.length===1,"Popup operations only handle one event");const e=yp();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(hr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(hr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Co.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if((i=(t=this.authWindow)==null?void 0:t.window)!=null&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(hr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ZP.get())};e()}}Co.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ek="pendingRedirect",ec=new Map;class tk extends jE{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=ec.get(this.auth._key());if(!e){try{const i=await nk(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}ec.set(this.auth._key(),e)}return this.bypassAuthState||ec.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function nk(r,e){const t=sk(e),i=ik(r);if(!await i._isAvailable())return!1;const o=await i._get(t)==="true";return await i._remove(t),o}function rk(r,e){ec.set(r._key(),e)}function ik(r){return br(r._redirectPersistence)}function sk(r){return Zu(ek,r.config.apiKey,r.name)}async function ok(r,e,t=!1){if(sr(r.app))return Promise.reject(Es(r));const i=mp(r),o=QP(i,e),h=await new tk(i,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await i._persistUserIfCurrent(h.user),await i._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ak=600*1e3;class lk{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!uk(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!zE(e)){const o=((i=e.error.code)==null?void 0:i.split("auth/")[1])||"internal-error";t.onError(hr(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ak&&this.cachedEventUids.clear(),this.cachedEventUids.has(c_(e))}saveEventToCache(e){this.cachedEventUids.add(c_(e)),this.lastProcessedEventTime=Date.now()}}function c_(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function zE({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function uk(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return zE(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ck(r,e={}){return Ko(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hk=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,dk=/^https?/;async function fk(r){if(r.config.emulator)return;const{authorizedDomains:e}=await ck(r);for(const t of e)try{if(pk(t))return}catch{}zr(r,"unauthorized-domain")}function pk(r){const e=gf(),{protocol:t,hostname:i}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&i===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===i}if(!dk.test(t))return!1;if(hk.test(r))return i===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mk=new El(3e4,6e4);function h_(){const r=dr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function gk(r){return new Promise((e,t)=>{var o,l,h;function i(){h_(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{h_(),t(hr(r,"network-request-failed"))},timeout:mk.get()})}if((l=(o=dr().gapi)==null?void 0:o.iframes)!=null&&l.Iframe)e(gapi.iframes.getContext());else if((h=dr().gapi)!=null&&h.load)i();else{const p=TP("iframefcb");return dr()[p]=()=>{gapi.load?i():t(hr(r,"network-request-failed"))},wP(`${EP()}?onload=${p}`).catch(f=>t(f))}}).catch(e=>{throw tc=null,e})}let tc=null;function yk(r){return tc=tc||gk(r),tc}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _k=new El(5e3,15e3),vk="__/auth/iframe",wk="emulator/auth/iframe",Ek={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Tk=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ik(r){const e=r.config;we(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?hp(e,wk):`https://${r.config.authDomain}/${vk}`,i={apiKey:e.apiKey,appName:r.name,v:$o},o=Tk.get(r.config.apiHost);o&&(i.eid=o);const l=r._getFrameworks();return l.length&&(i.fw=l.join(",")),`${t}?${hl(i).slice(1)}`}async function Sk(r){const e=await yk(r),t=dr().gapi;return we(t,r,"internal-error"),e.open({where:document.body,url:Ik(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ek,dontclear:!0},i=>new Promise(async(o,l)=>{await i.restyle({setHideOnLeave:!1});const h=hr(r,"network-request-failed"),p=dr().setTimeout(()=>{l(h)},_k.get());function f(){dr().clearTimeout(p),o(i)}i.ping(f).then(f,()=>{l(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ak={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Rk=500,Ck=600,Pk="_blank",kk="http://localhost";class d_{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Nk(r,e,t,i=Rk,o=Ck){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-i)/2,0).toString();let p="";const f={...Ak,width:i.toString(),height:o.toString(),top:l,left:h},m=$t().toLowerCase();t&&(p=wE(m)?Pk:t),_E(m)&&(e=e||kk,f.scrollbars="yes");const _=Object.entries(f).reduce((T,[x,L])=>`${T}${x}=${L},`,"");if(dP(m)&&p!=="_self")return xk(e||"",p),new d_(null);const w=window.open(e||"",p,_);we(w,r,"popup-blocked");try{w.focus()}catch{}return new d_(w)}function xk(r,e){const t=document.createElement("a");t.href=r,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dk="__/auth/handler",Vk="emulator/auth/handler",Ok=encodeURIComponent("fac");async function f_(r,e,t,i,o,l){we(r.config.authDomain,r,"auth-domain-config-required"),we(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:i,v:$o,eventId:o};if(e instanceof kE){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",zT(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[_,w]of Object.entries({}))h[_]=w}if(e instanceof Tl){const _=e.getScopes().filter(w=>w!=="");_.length>0&&(h.scopes=_.join(","))}r.tenantId&&(h.tid=r.tenantId);const p=h;for(const _ of Object.keys(p))p[_]===void 0&&delete p[_];const f=await r._getAppCheckToken(),m=f?`#${Ok}=${encodeURIComponent(f)}`:"";return`${Mk(r)}?${hl(p).slice(1)}${m}`}function Mk({config:r}){return r.emulator?hp(r,Vk):`https://${r.authDomain}/${Dk}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ud="webStorageSupport";class Lk{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=OE,this._completeRedirectFn=ok,this._overrideRedirectResult=rk}async _openPopup(e,t,i,o){var h;Br((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const l=await f_(e,t,i,gf(),o);return Nk(e,l,yp())}async _openRedirect(e,t,i,o){await this._originValidation(e);const l=await f_(e,t,i,gf(),o);return UP(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Br(l,"If manager is not set, promise should be"),l)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await Sk(e),i=new lk(e);return t.register("authEvent",o=>(we(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:i.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ud,{type:Ud},o=>{var h;const l=(h=o==null?void 0:o[0])==null?void 0:h[Ud];l!==void 0&&t(!!l),zr(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=fk(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return AE()||vE()||pp()}}const bk=Lk;var p_="@firebase/auth",m_="1.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fk{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){we(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uk(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function jk(r){fr(new bn("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:p}=i.options;we(h&&!h.includes(":"),"invalid-api-key",{appName:i.name});const f={apiKey:h,authDomain:p,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:RE(r)},m=new _P(i,o,l,f);return SP(m,t),m},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),fr(new bn("auth-internal",e=>{const t=mp(e.getProvider("auth").getImmediate());return(i=>new Fk(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Sn(p_,m_,Uk(r)),Sn(p_,m_,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zk=300,Bk=Q_("authIdTokenMaxAge")||zk;let g_=null;const $k=r=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>Bk)return;const o=t==null?void 0:t.token;g_!==o&&(g_=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function qk(r=Tf()){const e=ks(r,"auth");if(e.isInitialized())return e.getImmediate();const t=IP(r,{popupRedirectResolver:bk,persistence:[KP,LP,OE]}),i=Q_("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(i,location.origin);if(location.origin===l.origin){const h=$k(l.toString());VP(t,h,()=>h(t.currentUser)),DP(t,p=>h(p))}}const o=G_("auth");return o&&AP(t,`http://${o}`),t}function Hk(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}vP({loadJS(r){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",r),i.onload=e,i.onerror=o=>{const l=hr("internal-error");l.customData=o,t(l)},i.type="text/javascript",i.charset="UTF-8",Hk().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});jk("Browser");const Wk={apiKey:"AIzaSyCcnU7YOabw4qnaEPQ0-cFbqcyjLfDd96M",authDomain:"knowgence-b7a2c.firebaseapp.com",projectId:"knowgence-b7a2c",storageBucket:"knowgence-b7a2c.firebasestorage.app",messagingSenderId:"186080739418",appId:"1:186080739418:web:cc1498d4ca0d254dec5863",measurementId:"G-P888ZKR96N"},vp=rv(Wk);$1(vp);const ki=oC(vp);qk(vp);new Or;const fs=5;function Gk(){return Math.random().toString(36).slice(2,10).toUpperCase()}function y_(r,e){return`SIGNIN:KNOWGENCE:${r}:${e}`}function Kk(){const[r]=ae.useState(Gk),[e,t]=ae.useState(!1),[i,o]=ae.useState(10),[l,h]=ae.useState(0),[p,f]=ae.useState(0),[m,_]=ae.useState(0),[w,T]=ae.useState(null);ae.useEffect(()=>{if(!e)return;const ie=_s(ki,"signinSessions",r);return zw(ie,Re=>{if(!Re.exists())return;const S=Re.data().totalSignIns,C=Math.floor(S/fs),D=Math.floor((S-1)/fs);f(S),h(C),S>0&&C!==D&&ul(ie,{generation:C})})},[e,r]),ae.useEffect(()=>{if(!w)return;const ie=setInterval(()=>{const ye=Math.max(0,Math.round((w.getTime()-Date.now())/1e3));_(ye),ye===0&&(t(!1),clearInterval(ie))},1e3);return()=>clearInterval(ie)},[w]);async function x(){const ie=new Date(Date.now()+i*60*1e3);T(ie),t(!0),h(0),f(0),await jw(_s(ki,"signinSessions",r),{type:"qr",token:y_(r,0),generation:0,totalSignIns:0,sessionEndTime:Ke.fromDate(ie),active:!0})}async function L(){t(!1),await ul(_s(ki,"signinSessions",r),{active:!1})}const z=Math.floor(m/60),O=m%60,re=y_(r,l);if(!e)return G.jsxs("div",{className:"flex flex-col items-center gap-6 p-10",children:[G.jsx("h2",{className:"text-2xl font-bold text-white",children:"QR 掃描簽到"}),G.jsxs("div",{className:"flex items-center gap-3",children:[G.jsx("label",{className:"text-slate-300",children:"開放時間（分鐘）"}),G.jsx("input",{type:"number",min:1,max:120,value:i,onChange:ie=>o(Number(ie.target.value)),className:"w-20 rounded-lg bg-slate-800 px-3 py-2 text-center text-white"})]}),G.jsx("button",{onClick:x,className:"rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-400",children:"開始簽到"})]});const te=p%fs/fs*100,Y=fs-p%fs;return G.jsxs("div",{className:"flex flex-col items-center gap-6 p-10",children:[G.jsx("h2",{className:"text-2xl font-bold text-white",children:"QR 掃描簽到進行中"}),G.jsxs("div",{className:"relative rounded-2xl bg-white p-6 shadow-xl",children:[G.jsx($_,{value:re,size:260}),G.jsxs("span",{className:"absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-700 px-3 py-0.5 text-xs text-slate-300",children:["第 ",l+1," 版"]})]}),G.jsxs("p",{className:"font-mono text-xs text-slate-500",children:["Session: ",r]}),G.jsxs("p",{className:"font-mono text-3xl font-bold text-emerald-400",children:[String(z).padStart(2,"0"),":",String(O).padStart(2,"0")]}),G.jsx("p",{className:"text-slate-400",children:"距離簽到結束"}),G.jsxs("p",{className:"text-slate-300",children:["已簽到 ",G.jsx("span",{className:"font-bold text-white",children:p})," 人"]}),G.jsxs("div",{className:"flex w-64 flex-col gap-1",children:[G.jsx("div",{className:"h-2 overflow-hidden rounded-full bg-slate-700",children:G.jsx("div",{className:"h-full rounded-full bg-emerald-500 transition-all duration-500",style:{width:`${te}%`}})}),G.jsxs("p",{className:"text-center text-xs text-slate-500",children:["再 ",Y," 人掃碼後更新 QR Code（每 ",fs," 人輪換）"]})]}),G.jsx("button",{onClick:L,className:"rounded-xl border border-red-500 px-6 py-2 text-red-400 hover:bg-red-500/10",children:"結束簽到"})]})}const ps=5;function Qk(){return Math.random().toString(36).slice(2,10).toUpperCase()}function __(){const r=[1,2,3,4,5,6,7,8,9];for(let e=r.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[r[e],r[t]]=[r[t],r[e]]}return r.slice(0,4).join("")}function Yk(){const[r]=ae.useState(Qk),[e,t]=ae.useState(!1),[i,o]=ae.useState(10),[l,h]=ae.useState(0),[p,f]=ae.useState(""),[m,_]=ae.useState(0),[w,T]=ae.useState(null);ae.useEffect(()=>{if(!e)return;const Y=_s(ki,"signinSessions",r);return zw(Y,ye=>{if(!ye.exists())return;const Re=ye.data(),N=Re.totalSignIns,S=Math.floor(N/ps),C=Math.floor((N-1)/ps);if(h(N),f(Re.currentPassword),N>0&&S!==C){const D=__();ul(Y,{passwordGeneration:S,currentPassword:D})}})},[e,r]),ae.useEffect(()=>{if(!w)return;const Y=setInterval(()=>{const ie=Math.max(0,Math.round((w.getTime()-Date.now())/1e3));_(ie),ie===0&&(t(!1),clearInterval(Y))},1e3);return()=>clearInterval(Y)},[w]);async function x(){const Y=new Date(Date.now()+i*60*1e3),ie=__();T(Y),t(!0),h(0),f(ie),await jw(_s(ki,"signinSessions",r),{type:"numeric",totalSignIns:0,passwordGeneration:0,currentPassword:ie,sessionEndTime:Ke.fromDate(Y),active:!0})}async function L(){t(!1),await ul(_s(ki,"signinSessions",r),{active:!1})}const z=Math.floor(m/60),O=m%60,re=l%ps/ps*100,te=ps-l%ps;return e?G.jsxs("div",{className:"flex flex-col items-center gap-6 p-10",children:[G.jsx("h2",{className:"text-2xl font-bold text-white",children:"數字密碼簽到進行中"}),G.jsxs("div",{className:"flex flex-col items-center gap-2 rounded-2xl bg-slate-800 px-12 py-8 shadow-xl",children:[G.jsx("p",{className:"text-sm text-slate-400",children:"簽到密碼"}),G.jsx("p",{className:"font-mono text-7xl font-bold tracking-[0.3em] text-yellow-400",children:p}),G.jsx("p",{className:"text-xs text-slate-500",children:"數字 1–9，不含 0"})]}),G.jsxs("p",{className:"font-mono text-3xl font-bold text-emerald-400",children:[String(z).padStart(2,"0"),":",String(O).padStart(2,"0")]}),G.jsx("p",{className:"text-slate-400",children:"距離簽到結束"}),G.jsxs("p",{className:"text-slate-300",children:["已簽到 ",G.jsx("span",{className:"font-bold text-white",children:l})," 人"]}),G.jsxs("div",{className:"flex w-64 flex-col gap-1",children:[G.jsx("div",{className:"h-2 overflow-hidden rounded-full bg-slate-700",children:G.jsx("div",{className:"h-full rounded-full bg-yellow-400 transition-all duration-500",style:{width:`${re}%`}})}),G.jsxs("p",{className:"text-center text-xs text-slate-500",children:["再 ",te," 人簽到後更新密碼（每 ",ps," 人輪換）"]})]}),G.jsx("button",{onClick:L,className:"rounded-xl border border-red-500 px-6 py-2 text-red-400 hover:bg-red-500/10",children:"結束簽到"})]}):G.jsxs("div",{className:"flex flex-col items-center gap-6 p-10",children:[G.jsx("h2",{className:"text-2xl font-bold text-white",children:"數字密碼簽到"}),G.jsxs("div",{className:"flex items-center gap-3",children:[G.jsx("label",{className:"text-slate-300",children:"開放時間（分鐘）"}),G.jsx("input",{type:"number",min:1,max:120,value:i,onChange:Y=>o(Number(Y.target.value)),className:"w-20 rounded-lg bg-slate-800 px-3 py-2 text-center text-white"})]}),G.jsx("button",{onClick:x,className:"rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-400",children:"開始簽到"})]})}var Hu={},jd={exports:{}},Zt={},zd={exports:{}},Bd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var v_;function Xk(){return v_||(v_=1,(function(r){function e(ee,fe){var se=ee.length;ee.push(fe);e:for(;0<se;){var M=se-1>>>1,W=ee[M];if(0<o(W,fe))ee[M]=fe,ee[se]=W,se=M;else break e}}function t(ee){return ee.length===0?null:ee[0]}function i(ee){if(ee.length===0)return null;var fe=ee[0],se=ee.pop();if(se!==fe){ee[0]=se;e:for(var M=0,W=ee.length,Te=W>>>1;M<Te;){var Ie=2*(M+1)-1,xe=ee[Ie],De=Ie+1,Be=ee[De];if(0>o(xe,se))De<W&&0>o(Be,xe)?(ee[M]=Be,ee[De]=se,M=De):(ee[M]=xe,ee[Ie]=se,M=Ie);else if(De<W&&0>o(Be,se))ee[M]=Be,ee[De]=se,M=De;else break e}}return fe}function o(ee,fe){var se=ee.sortIndex-fe.sortIndex;return se!==0?se:ee.id-fe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,p=h.now();r.unstable_now=function(){return h.now()-p}}var f=[],m=[],_=1,w=null,T=3,x=!1,L=!1,z=!1,O=typeof setTimeout=="function"?setTimeout:null,re=typeof clearTimeout=="function"?clearTimeout:null,te=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Y(ee){for(var fe=t(m);fe!==null;){if(fe.callback===null)i(m);else if(fe.startTime<=ee)i(m),fe.sortIndex=fe.expirationTime,e(f,fe);else break;fe=t(m)}}function ie(ee){if(z=!1,Y(ee),!L)if(t(f)!==null)L=!0,vt(ye);else{var fe=t(m);fe!==null&&ze(ie,fe.startTime-ee)}}function ye(ee,fe){L=!1,z&&(z=!1,re(S),S=-1),x=!0;var se=T;try{for(Y(fe),w=t(f);w!==null&&(!(w.expirationTime>fe)||ee&&!k());){var M=w.callback;if(typeof M=="function"){w.callback=null,T=w.priorityLevel;var W=M(w.expirationTime<=fe);fe=r.unstable_now(),typeof W=="function"?w.callback=W:w===t(f)&&i(f),Y(fe)}else i(f);w=t(f)}if(w!==null)var Te=!0;else{var Ie=t(m);Ie!==null&&ze(ie,Ie.startTime-fe),Te=!1}return Te}finally{w=null,T=se,x=!1}}var Re=!1,N=null,S=-1,C=5,D=-1;function k(){return!(r.unstable_now()-D<C)}function b(){if(N!==null){var ee=r.unstable_now();D=ee;var fe=!0;try{fe=N(!0,ee)}finally{fe?R():(Re=!1,N=null)}}else Re=!1}var R;if(typeof te=="function")R=function(){te(b)};else if(typeof MessageChannel<"u"){var Me=new MessageChannel,He=Me.port2;Me.port1.onmessage=b,R=function(){He.postMessage(null)}}else R=function(){O(b,0)};function vt(ee){N=ee,Re||(Re=!0,R())}function ze(ee,fe){S=O(function(){ee(r.unstable_now())},fe)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(ee){ee.callback=null},r.unstable_continueExecution=function(){L||x||(L=!0,vt(ye))},r.unstable_forceFrameRate=function(ee){0>ee||125<ee?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<ee?Math.floor(1e3/ee):5},r.unstable_getCurrentPriorityLevel=function(){return T},r.unstable_getFirstCallbackNode=function(){return t(f)},r.unstable_next=function(ee){switch(T){case 1:case 2:case 3:var fe=3;break;default:fe=T}var se=T;T=fe;try{return ee()}finally{T=se}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(ee,fe){switch(ee){case 1:case 2:case 3:case 4:case 5:break;default:ee=3}var se=T;T=ee;try{return fe()}finally{T=se}},r.unstable_scheduleCallback=function(ee,fe,se){var M=r.unstable_now();switch(typeof se=="object"&&se!==null?(se=se.delay,se=typeof se=="number"&&0<se?M+se:M):se=M,ee){case 1:var W=-1;break;case 2:W=250;break;case 5:W=1073741823;break;case 4:W=1e4;break;default:W=5e3}return W=se+W,ee={id:_++,callback:fe,priorityLevel:ee,startTime:se,expirationTime:W,sortIndex:-1},se>M?(ee.sortIndex=se,e(m,ee),t(f)===null&&ee===t(m)&&(z?(re(S),S=-1):z=!0,ze(ie,se-M))):(ee.sortIndex=W,e(f,ee),L||x||(L=!0,vt(ye))),ee},r.unstable_shouldYield=k,r.unstable_wrapCallback=function(ee){var fe=T;return function(){var se=T;T=fe;try{return ee.apply(this,arguments)}finally{T=se}}}})(Bd)),Bd}var w_;function Jk(){return w_||(w_=1,zd.exports=Xk()),zd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var E_;function Zk(){if(E_)return Zt;E_=1;var r=wf(),e=Jk();function t(n){for(var s="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)s+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+s+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function l(n,s){h(n,s),h(n+"Capture",s)}function h(n,s){for(o[n]=s,n=0;n<s.length;n++)i.add(s[n])}var p=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},w={};function T(n){return f.call(w,n)?!0:f.call(_,n)?!1:m.test(n)?w[n]=!0:(_[n]=!0,!1)}function x(n,s,a,c){if(a!==null&&a.type===0)return!1;switch(typeof s){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function L(n,s,a,c){if(s===null||typeof s>"u"||x(n,s,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!s;case 4:return s===!1;case 5:return isNaN(s);case 6:return isNaN(s)||1>s}return!1}function z(n,s,a,c,d,g,E){this.acceptsBooleans=s===2||s===3||s===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=s,this.sanitizeURL=g,this.removeEmptyString=E}var O={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){O[n]=new z(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var s=n[0];O[s]=new z(s,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){O[n]=new z(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){O[n]=new z(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){O[n]=new z(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){O[n]=new z(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){O[n]=new z(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){O[n]=new z(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){O[n]=new z(n,5,!1,n.toLowerCase(),null,!1,!1)});var re=/[\-:]([a-z])/g;function te(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var s=n.replace(re,te);O[s]=new z(s,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var s=n.replace(re,te);O[s]=new z(s,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var s=n.replace(re,te);O[s]=new z(s,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){O[n]=new z(n,1,!1,n.toLowerCase(),null,!1,!1)}),O.xlinkHref=new z("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){O[n]=new z(n,1,!1,n.toLowerCase(),null,!0,!0)});function Y(n,s,a,c){var d=O.hasOwnProperty(s)?O[s]:null;(d!==null?d.type!==0:c||!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(L(s,a,d,c)&&(a=null),c||d===null?T(s)&&(a===null?n.removeAttribute(s):n.setAttribute(s,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(s=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(s):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,s,a):n.setAttribute(s,a))))}var ie=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ye=Symbol.for("react.element"),Re=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),D=Symbol.for("react.provider"),k=Symbol.for("react.context"),b=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),Me=Symbol.for("react.suspense_list"),He=Symbol.for("react.memo"),vt=Symbol.for("react.lazy"),ze=Symbol.for("react.offscreen"),ee=Symbol.iterator;function fe(n){return n===null||typeof n!="object"?null:(n=ee&&n[ee]||n["@@iterator"],typeof n=="function"?n:null)}var se=Object.assign,M;function W(n){if(M===void 0)try{throw Error()}catch(a){var s=a.stack.trim().match(/\n( *(at )?)/);M=s&&s[1]||""}return`
`+M+n}var Te=!1;function Ie(n,s){if(!n||Te)return"";Te=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(s)if(s=function(){throw Error()},Object.defineProperty(s.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(s,[])}catch(B){var c=B}Reflect.construct(n,[],s)}else{try{s.call()}catch(B){c=B}n.call(s.prototype)}else{try{throw Error()}catch(B){c=B}n()}}catch(B){if(B&&c&&typeof B.stack=="string"){for(var d=B.stack.split(`
`),g=c.stack.split(`
`),E=d.length-1,A=g.length-1;1<=E&&0<=A&&d[E]!==g[A];)A--;for(;1<=E&&0<=A;E--,A--)if(d[E]!==g[A]){if(E!==1||A!==1)do if(E--,A--,0>A||d[E]!==g[A]){var P=`
`+d[E].replace(" at new "," at ");return n.displayName&&P.includes("<anonymous>")&&(P=P.replace("<anonymous>",n.displayName)),P}while(1<=E&&0<=A);break}}}finally{Te=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?W(n):""}function xe(n){switch(n.tag){case 5:return W(n.type);case 16:return W("Lazy");case 13:return W("Suspense");case 19:return W("SuspenseList");case 0:case 2:case 15:return n=Ie(n.type,!1),n;case 11:return n=Ie(n.type.render,!1),n;case 1:return n=Ie(n.type,!0),n;default:return""}}function De(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case N:return"Fragment";case Re:return"Portal";case C:return"Profiler";case S:return"StrictMode";case R:return"Suspense";case Me:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case k:return(n.displayName||"Context")+".Consumer";case D:return(n._context.displayName||"Context")+".Provider";case b:var s=n.render;return n=n.displayName,n||(n=s.displayName||s.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case He:return s=n.displayName||null,s!==null?s:De(n.type)||"Memo";case vt:s=n._payload,n=n._init;try{return De(n(s))}catch{}}return null}function Be(n){var s=n.type;switch(n.tag){case 24:return"Cache";case 9:return(s.displayName||"Context")+".Consumer";case 10:return(s._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=s.render,n=n.displayName||n.name||"",s.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return s;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return De(s);case 8:return s===S?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof s=="function")return s.displayName||s.name||null;if(typeof s=="string")return s}return null}function be(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function We(n){var s=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(s==="checkbox"||s==="radio")}function qt(n){var s=We(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,s),c=""+n[s];if(!n.hasOwnProperty(s)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,g=a.set;return Object.defineProperty(n,s,{configurable:!0,get:function(){return d.call(this)},set:function(E){c=""+E,g.call(this,E)}}),Object.defineProperty(n,s,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(E){c=""+E},stopTracking:function(){n._valueTracker=null,delete n[s]}}}}function Vs(n){n._valueTracker||(n._valueTracker=qt(n))}function Qo(n){if(!n)return!1;var s=n._valueTracker;if(!s)return!0;var a=s.getValue(),c="";return n&&(c=We(n)?n.checked?"true":"false":n.value),n=c,n!==a?(s.setValue(n),!0):!1}function $r(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Os(n,s){var a=s.checked;return se({},s,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function Sl(n,s){var a=s.defaultValue==null?"":s.defaultValue,c=s.checked!=null?s.checked:s.defaultChecked;a=be(s.value!=null?s.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:s.type==="checkbox"||s.type==="radio"?s.checked!=null:s.value!=null}}function Ms(n,s){s=s.checked,s!=null&&Y(n,"checked",s,!1)}function ji(n,s){Ms(n,s);var a=be(s.value),c=s.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}s.hasOwnProperty("value")?dt(n,s.type,a):s.hasOwnProperty("defaultValue")&&dt(n,s.type,be(s.defaultValue)),s.checked==null&&s.defaultChecked!=null&&(n.defaultChecked=!!s.defaultChecked)}function Yo(n,s,a){if(s.hasOwnProperty("value")||s.hasOwnProperty("defaultValue")){var c=s.type;if(!(c!=="submit"&&c!=="reset"||s.value!==void 0&&s.value!==null))return;s=""+n._wrapperState.initialValue,a||s===n.value||(n.value=s),n.defaultValue=s}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function dt(n,s,a){(s!=="number"||$r(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var at=Array.isArray;function An(n,s,a,c){if(n=n.options,s){s={};for(var d=0;d<a.length;d++)s["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=s.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+be(a),s=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}s!==null||n[d].disabled||(s=n[d])}s!==null&&(s.selected=!0)}}function Xo(n,s){if(s.dangerouslySetInnerHTML!=null)throw Error(t(91));return se({},s,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Jo(n,s){var a=s.value;if(a==null){if(a=s.children,s=s.defaultValue,a!=null){if(s!=null)throw Error(t(92));if(at(a)){if(1<a.length)throw Error(t(93));a=a[0]}s=a}s==null&&(s=""),a=s}n._wrapperState={initialValue:be(a)}}function Al(n,s){var a=be(s.value),c=be(s.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),s.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function qr(n){var s=n.textContent;s===n._wrapperState.initialValue&&s!==""&&s!==null&&(n.value=s)}function Zo(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ls(n,s){return n==null||n==="http://www.w3.org/1999/xhtml"?Zo(s):n==="http://www.w3.org/2000/svg"&&s==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Hr,Rl=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(s,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(s,a,c,d)})}:n})(function(n,s){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=s;else{for(Hr=Hr||document.createElement("div"),Hr.innerHTML="<svg>"+s.valueOf().toString()+"</svg>",s=Hr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;s.firstChild;)n.appendChild(s.firstChild)}});function zi(n,s){if(s){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=s;return}}n.textContent=s}var Wr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Cl=["Webkit","ms","Moz","O"];Object.keys(Wr).forEach(function(n){Cl.forEach(function(s){s=s+n.charAt(0).toUpperCase()+n.substring(1),Wr[s]=Wr[n]})});function Gr(n,s,a){return s==null||typeof s=="boolean"||s===""?"":a||typeof s!="number"||s===0||Wr.hasOwnProperty(n)&&Wr[n]?(""+s).trim():s+"px"}function bs(n,s){n=n.style;for(var a in s)if(s.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=Gr(a,s[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var ea=se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Rn(n,s){if(s){if(ea[n]&&(s.children!=null||s.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(s.dangerouslySetInnerHTML!=null){if(s.children!=null)throw Error(t(60));if(typeof s.dangerouslySetInnerHTML!="object"||!("__html"in s.dangerouslySetInnerHTML))throw Error(t(61))}if(s.style!=null&&typeof s.style!="object")throw Error(t(62))}}function Fs(n,s){if(n.indexOf("-")===-1)return typeof s.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Kr=null;function Us(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var gr=null,yr=null,it=null;function ta(n){if(n=Pa(n)){if(typeof gr!="function")throw Error(t(280));var s=n.stateNode;s&&(s=eu(s),gr(n.stateNode,n.type,s))}}function Qr(n){yr?it?it.push(n):it=[n]:yr=n}function Yr(){if(yr){var n=yr,s=it;if(it=yr=null,ta(n),s)for(n=0;n<s.length;n++)ta(s[n])}}function Pl(n,s){return n(s)}function kl(){}var jn=!1;function Nl(n,s,a){if(jn)return n(s,a);jn=!0;try{return Pl(n,s,a)}finally{jn=!1,(yr!==null||it!==null)&&(kl(),Yr())}}function Bi(n,s){var a=n.stateNode;if(a===null)return null;var c=eu(a);if(c===null)return null;a=c[s];e:switch(s){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,s,typeof a));return a}var Xr=!1;if(p)try{var Jr={};Object.defineProperty(Jr,"passive",{get:function(){Xr=!0}}),window.addEventListener("test",Jr,Jr),window.removeEventListener("test",Jr,Jr)}catch{Xr=!1}function xl(n,s,a,c,d,g,E,A,P){var B=Array.prototype.slice.call(arguments,3);try{s.apply(a,B)}catch(Q){this.onError(Q)}}var _r=!1,zn=null,js=!1,mn=null,Dl={onError:function(n){_r=!0,zn=n}};function Vl(n,s,a,c,d,g,E,A,P){_r=!1,zn=null,xl.apply(Dl,arguments)}function na(n,s,a,c,d,g,E,A,P){if(Vl.apply(this,arguments),_r){if(_r){var B=zn;_r=!1,zn=null}else throw Error(t(198));js||(js=!0,mn=B)}}function Cn(n){var s=n,a=n;if(n.alternate)for(;s.return;)s=s.return;else{n=s;do s=n,(s.flags&4098)!==0&&(a=s.return),n=s.return;while(n)}return s.tag===3?a:null}function ra(n){if(n.tag===13){var s=n.memoizedState;if(s===null&&(n=n.alternate,n!==null&&(s=n.memoizedState)),s!==null)return s.dehydrated}return null}function Ol(n){if(Cn(n)!==n)throw Error(t(188))}function Ml(n){var s=n.alternate;if(!s){if(s=Cn(n),s===null)throw Error(t(188));return s!==n?null:n}for(var a=n,c=s;;){var d=a.return;if(d===null)break;var g=d.alternate;if(g===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===g.child){for(g=d.child;g;){if(g===a)return Ol(d),n;if(g===c)return Ol(d),s;g=g.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=g;else{for(var E=!1,A=d.child;A;){if(A===a){E=!0,a=d,c=g;break}if(A===c){E=!0,c=d,a=g;break}A=A.sibling}if(!E){for(A=g.child;A;){if(A===a){E=!0,a=g,c=d;break}if(A===c){E=!0,c=g,a=d;break}A=A.sibling}if(!E)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:s}function Ll(n){return n=Ml(n),n!==null?$i(n):null}function $i(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var s=$i(n);if(s!==null)return s;n=n.sibling}return null}var ia=e.unstable_scheduleCallback,zs=e.unstable_cancelCallback,qi=e.unstable_shouldYield,vr=e.unstable_requestPaint,Xe=e.unstable_now,eh=e.unstable_getCurrentPriorityLevel,Bs=e.unstable_ImmediatePriority,sa=e.unstable_UserBlockingPriority,Hi=e.unstable_NormalPriority,oa=e.unstable_LowPriority,$s=e.unstable_IdlePriority,Wi=null,rn=null;function bl(n){if(rn&&typeof rn.onCommitFiberRoot=="function")try{rn.onCommitFiberRoot(Wi,n,void 0,(n.current.flags&128)===128)}catch{}}var sn=Math.clz32?Math.clz32:Gi,Bn=Math.log,gn=Math.LN2;function Gi(n){return n>>>=0,n===0?32:31-(Bn(n)/gn|0)|0}var $n=64,Zr=4194304;function je(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function wr(n,s){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,g=n.pingedLanes,E=a&268435455;if(E!==0){var A=E&~d;A!==0?c=je(A):(g&=E,g!==0&&(c=je(g)))}else E=a&~d,E!==0?c=je(E):g!==0&&(c=je(g));if(c===0)return 0;if(s!==0&&s!==c&&(s&d)===0&&(d=c&-c,g=s&-s,d>=g||d===16&&(g&4194240)!==0))return s;if((c&4)!==0&&(c|=a&16),s=n.entangledLanes,s!==0)for(n=n.entanglements,s&=c;0<s;)a=31-sn(s),d=1<<a,c|=n[a],s&=~d;return c}function Ki(n,s){switch(n){case 1:case 2:case 4:return s+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return s+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Qi(n,s){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,g=n.pendingLanes;0<g;){var E=31-sn(g),A=1<<E,P=d[E];P===-1?((A&a)===0||(A&c)!==0)&&(d[E]=Ki(A,s)):P<=s&&(n.expiredLanes|=A),g&=~A}}function aa(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function la(){var n=$n;return $n<<=1,($n&4194240)===0&&($n=64),n}function ua(n){for(var s=[],a=0;31>a;a++)s.push(n);return s}function Yi(n,s,a){n.pendingLanes|=s,s!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,s=31-sn(s),n[s]=a}function th(n,s){var a=n.pendingLanes&~s;n.pendingLanes=s,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=s,n.mutableReadLanes&=s,n.entangledLanes&=s,s=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-sn(a),g=1<<d;s[d]=0,c[d]=-1,n[d]=-1,a&=~g}}function ca(n,s){var a=n.entangledLanes|=s;for(n=n.entanglements;a;){var c=31-sn(a),d=1<<c;d&s|n[c]&s&&(n[c]|=s),a&=~d}}var Oe=0;function qn(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ha,qs,da,fa,pa,Hn=!1,Hs=[],Wn=null,Gn=null,Pt=null,Xi=new Map,Er=new Map,on=[],Fl="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ei(n,s){switch(n){case"focusin":case"focusout":Wn=null;break;case"dragenter":case"dragleave":Gn=null;break;case"mouseover":case"mouseout":Pt=null;break;case"pointerover":case"pointerout":Xi.delete(s.pointerId);break;case"gotpointercapture":case"lostpointercapture":Er.delete(s.pointerId)}}function Pn(n,s,a,c,d,g){return n===null||n.nativeEvent!==g?(n={blockedOn:s,domEventName:a,eventSystemFlags:c,nativeEvent:g,targetContainers:[d]},s!==null&&(s=Pa(s),s!==null&&qs(s)),n):(n.eventSystemFlags|=c,s=n.targetContainers,d!==null&&s.indexOf(d)===-1&&s.push(d),n)}function Ul(n,s,a,c,d){switch(s){case"focusin":return Wn=Pn(Wn,n,s,a,c,d),!0;case"dragenter":return Gn=Pn(Gn,n,s,a,c,d),!0;case"mouseover":return Pt=Pn(Pt,n,s,a,c,d),!0;case"pointerover":var g=d.pointerId;return Xi.set(g,Pn(Xi.get(g)||null,n,s,a,c,d)),!0;case"gotpointercapture":return g=d.pointerId,Er.set(g,Pn(Er.get(g)||null,n,s,a,c,d)),!0}return!1}function Ws(n){var s=ts(n.target);if(s!==null){var a=Cn(s);if(a!==null){if(s=a.tag,s===13){if(s=ra(a),s!==null){n.blockedOn=s,pa(n.priority,function(){da(a)});return}}else if(s===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ge(n){if(n.blockedOn!==null)return!1;for(var s=n.targetContainers;0<s.length;){var a=Gs(n.domEventName,n.eventSystemFlags,s[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Kr=c,a.target.dispatchEvent(c),Kr=null}else return s=Pa(a),s!==null&&qs(s),n.blockedOn=a,!1;s.shift()}return!0}function jl(n,s,a){Ge(n)&&a.delete(s)}function nh(){Hn=!1,Wn!==null&&Ge(Wn)&&(Wn=null),Gn!==null&&Ge(Gn)&&(Gn=null),Pt!==null&&Ge(Pt)&&(Pt=null),Xi.forEach(jl),Er.forEach(jl)}function ti(n,s){n.blockedOn===s&&(n.blockedOn=null,Hn||(Hn=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,nh)))}function ni(n){function s(d){return ti(d,n)}if(0<Hs.length){ti(Hs[0],n);for(var a=1;a<Hs.length;a++){var c=Hs[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Wn!==null&&ti(Wn,n),Gn!==null&&ti(Gn,n),Pt!==null&&ti(Pt,n),Xi.forEach(s),Er.forEach(s),a=0;a<on.length;a++)c=on[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<on.length&&(a=on[0],a.blockedOn===null);)Ws(a),a.blockedOn===null&&on.shift()}var Tr=ie.ReactCurrentBatchConfig,Ir=!0;function Kn(n,s,a,c){var d=Oe,g=Tr.transition;Tr.transition=null;try{Oe=1,ma(n,s,a,c)}finally{Oe=d,Tr.transition=g}}function zl(n,s,a,c){var d=Oe,g=Tr.transition;Tr.transition=null;try{Oe=4,ma(n,s,a,c)}finally{Oe=d,Tr.transition=g}}function ma(n,s,a,c){if(Ir){var d=Gs(n,s,a,c);if(d===null)fh(n,s,c,Qn,a),ei(n,c);else if(Ul(d,n,s,a,c))c.stopPropagation();else if(ei(n,c),s&4&&-1<Fl.indexOf(n)){for(;d!==null;){var g=Pa(d);if(g!==null&&ha(g),g=Gs(n,s,a,c),g===null&&fh(n,s,c,Qn,a),g===d)break;d=g}d!==null&&c.stopPropagation()}else fh(n,s,c,null,a)}}var Qn=null;function Gs(n,s,a,c){if(Qn=null,n=Us(c),n=ts(n),n!==null)if(s=Cn(n),s===null)n=null;else if(a=s.tag,a===13){if(n=ra(s),n!==null)return n;n=null}else if(a===3){if(s.stateNode.current.memoizedState.isDehydrated)return s.tag===3?s.stateNode.containerInfo:null;n=null}else s!==n&&(n=null);return Qn=n,null}function Ks(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(eh()){case Bs:return 1;case sa:return 4;case Hi:case oa:return 16;case $s:return 536870912;default:return 16}default:return 16}}var an=null,Qs=null,Sr=null;function Bl(){if(Sr)return Sr;var n,s=Qs,a=s.length,c,d="value"in an?an.value:an.textContent,g=d.length;for(n=0;n<a&&s[n]===d[n];n++);var E=a-n;for(c=1;c<=E&&s[a-c]===d[g-c];c++);return Sr=d.slice(n,1<c?1-c:void 0)}function Ji(n){var s=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&s===13&&(n=13)):n=s,n===10&&(n=13),32<=n||n===13?n:0}function Yn(){return!0}function ga(){return!1}function Mt(n){function s(a,c,d,g,E){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=g,this.target=E,this.currentTarget=null;for(var A in n)n.hasOwnProperty(A)&&(a=n[A],this[A]=a?a(g):g[A]);return this.isDefaultPrevented=(g.defaultPrevented!=null?g.defaultPrevented:g.returnValue===!1)?Yn:ga,this.isPropagationStopped=ga,this}return se(s.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Yn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Yn)},persist:function(){},isPersistent:Yn}),s}var Xn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zi=Mt(Xn),ri=se({},Xn,{view:0,detail:0}),Ys=Mt(ri),Xs,Js,ln,es=se({},ri,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Se,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==ln&&(ln&&n.type==="mousemove"?(Xs=n.screenX-ln.screenX,Js=n.screenY-ln.screenY):Js=Xs=0,ln=n),Xs)},movementY:function(n){return"movementY"in n?n.movementY:Js}}),ya=Mt(es),$l=se({},es,{dataTransfer:0}),ql=Mt($l),Zs=se({},ri,{relatedTarget:0}),kt=Mt(Zs),Hl=se({},Xn,{animationName:0,elapsedTime:0,pseudoElement:0}),Wl=Mt(Hl),ii=se({},Xn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),u=Mt(ii),y=se({},Xn,{data:0}),v=Mt(y),I={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},U={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},$={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Z(n){var s=this.nativeEvent;return s.getModifierState?s.getModifierState(n):(n=$[n])?!!s[n]:!1}function Se(){return Z}var lt=se({},ri,{key:function(n){if(n.key){var s=I[n.key]||n.key;if(s!=="Unidentified")return s}return n.type==="keypress"?(n=Ji(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?U[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Se,charCode:function(n){return n.type==="keypress"?Ji(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ji(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),qe=Mt(lt),ft=se({},es,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),un=Mt(ft),Ar=se({},ri,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Se}),Jn=Mt(Ar),Zn=se({},Xn,{propertyName:0,elapsedTime:0,pseudoElement:0}),eo=Mt(Zn),_a=se({},es,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),ZE=Mt(_a),e0=[9,13,27,32],rh=p&&"CompositionEvent"in window,va=null;p&&"documentMode"in document&&(va=document.documentMode);var t0=p&&"TextEvent"in window&&!va,Ep=p&&(!rh||va&&8<va&&11>=va),Tp=" ",Ip=!1;function Sp(n,s){switch(n){case"keyup":return e0.indexOf(s.keyCode)!==-1;case"keydown":return s.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ap(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var to=!1;function n0(n,s){switch(n){case"compositionend":return Ap(s);case"keypress":return s.which!==32?null:(Ip=!0,Tp);case"textInput":return n=s.data,n===Tp&&Ip?null:n;default:return null}}function r0(n,s){if(to)return n==="compositionend"||!rh&&Sp(n,s)?(n=Bl(),Sr=Qs=an=null,to=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(s.ctrlKey||s.altKey||s.metaKey)||s.ctrlKey&&s.altKey){if(s.char&&1<s.char.length)return s.char;if(s.which)return String.fromCharCode(s.which)}return null;case"compositionend":return Ep&&s.locale!=="ko"?null:s.data;default:return null}}var i0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Rp(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s==="input"?!!i0[n.type]:s==="textarea"}function Cp(n,s,a,c){Qr(c),s=Xl(s,"onChange"),0<s.length&&(a=new Zi("onChange","change",null,a,c),n.push({event:a,listeners:s}))}var wa=null,Ea=null;function s0(n){Hp(n,0)}function Gl(n){var s=oo(n);if(Qo(s))return n}function o0(n,s){if(n==="change")return s}var Pp=!1;if(p){var ih;if(p){var sh="oninput"in document;if(!sh){var kp=document.createElement("div");kp.setAttribute("oninput","return;"),sh=typeof kp.oninput=="function"}ih=sh}else ih=!1;Pp=ih&&(!document.documentMode||9<document.documentMode)}function Np(){wa&&(wa.detachEvent("onpropertychange",xp),Ea=wa=null)}function xp(n){if(n.propertyName==="value"&&Gl(Ea)){var s=[];Cp(s,Ea,n,Us(n)),Nl(s0,s)}}function a0(n,s,a){n==="focusin"?(Np(),wa=s,Ea=a,wa.attachEvent("onpropertychange",xp)):n==="focusout"&&Np()}function l0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Gl(Ea)}function u0(n,s){if(n==="click")return Gl(s)}function c0(n,s){if(n==="input"||n==="change")return Gl(s)}function h0(n,s){return n===s&&(n!==0||1/n===1/s)||n!==n&&s!==s}var kn=typeof Object.is=="function"?Object.is:h0;function Ta(n,s){if(kn(n,s))return!0;if(typeof n!="object"||n===null||typeof s!="object"||s===null)return!1;var a=Object.keys(n),c=Object.keys(s);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!f.call(s,d)||!kn(n[d],s[d]))return!1}return!0}function Dp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Vp(n,s){var a=Dp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=s&&c>=s)return{node:a,offset:s-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Dp(a)}}function Op(n,s){return n&&s?n===s?!0:n&&n.nodeType===3?!1:s&&s.nodeType===3?Op(n,s.parentNode):"contains"in n?n.contains(s):n.compareDocumentPosition?!!(n.compareDocumentPosition(s)&16):!1:!1}function Mp(){for(var n=window,s=$r();s instanceof n.HTMLIFrameElement;){try{var a=typeof s.contentWindow.location.href=="string"}catch{a=!1}if(a)n=s.contentWindow;else break;s=$r(n.document)}return s}function oh(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s&&(s==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||s==="textarea"||n.contentEditable==="true")}function d0(n){var s=Mp(),a=n.focusedElem,c=n.selectionRange;if(s!==a&&a&&a.ownerDocument&&Op(a.ownerDocument.documentElement,a)){if(c!==null&&oh(a)){if(s=c.start,n=c.end,n===void 0&&(n=s),"selectionStart"in a)a.selectionStart=s,a.selectionEnd=Math.min(n,a.value.length);else if(n=(s=a.ownerDocument||document)&&s.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,g=Math.min(c.start,d);c=c.end===void 0?g:Math.min(c.end,d),!n.extend&&g>c&&(d=c,c=g,g=d),d=Vp(a,g);var E=Vp(a,c);d&&E&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==E.node||n.focusOffset!==E.offset)&&(s=s.createRange(),s.setStart(d.node,d.offset),n.removeAllRanges(),g>c?(n.addRange(s),n.extend(E.node,E.offset)):(s.setEnd(E.node,E.offset),n.addRange(s)))}}for(s=[],n=a;n=n.parentNode;)n.nodeType===1&&s.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<s.length;a++)n=s[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var f0=p&&"documentMode"in document&&11>=document.documentMode,no=null,ah=null,Ia=null,lh=!1;function Lp(n,s,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;lh||no==null||no!==$r(c)||(c=no,"selectionStart"in c&&oh(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ia&&Ta(Ia,c)||(Ia=c,c=Xl(ah,"onSelect"),0<c.length&&(s=new Zi("onSelect","select",null,s,a),n.push({event:s,listeners:c}),s.target=no)))}function Kl(n,s){var a={};return a[n.toLowerCase()]=s.toLowerCase(),a["Webkit"+n]="webkit"+s,a["Moz"+n]="moz"+s,a}var ro={animationend:Kl("Animation","AnimationEnd"),animationiteration:Kl("Animation","AnimationIteration"),animationstart:Kl("Animation","AnimationStart"),transitionend:Kl("Transition","TransitionEnd")},uh={},bp={};p&&(bp=document.createElement("div").style,"AnimationEvent"in window||(delete ro.animationend.animation,delete ro.animationiteration.animation,delete ro.animationstart.animation),"TransitionEvent"in window||delete ro.transitionend.transition);function Ql(n){if(uh[n])return uh[n];if(!ro[n])return n;var s=ro[n],a;for(a in s)if(s.hasOwnProperty(a)&&a in bp)return uh[n]=s[a];return n}var Fp=Ql("animationend"),Up=Ql("animationiteration"),jp=Ql("animationstart"),zp=Ql("transitionend"),Bp=new Map,$p="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function si(n,s){Bp.set(n,s),l(s,[n])}for(var ch=0;ch<$p.length;ch++){var hh=$p[ch],p0=hh.toLowerCase(),m0=hh[0].toUpperCase()+hh.slice(1);si(p0,"on"+m0)}si(Fp,"onAnimationEnd"),si(Up,"onAnimationIteration"),si(jp,"onAnimationStart"),si("dblclick","onDoubleClick"),si("focusin","onFocus"),si("focusout","onBlur"),si(zp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Sa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),g0=new Set("cancel close invalid load scroll toggle".split(" ").concat(Sa));function qp(n,s,a){var c=n.type||"unknown-event";n.currentTarget=a,na(c,s,void 0,n),n.currentTarget=null}function Hp(n,s){s=(s&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var g=void 0;if(s)for(var E=c.length-1;0<=E;E--){var A=c[E],P=A.instance,B=A.currentTarget;if(A=A.listener,P!==g&&d.isPropagationStopped())break e;qp(d,A,B),g=P}else for(E=0;E<c.length;E++){if(A=c[E],P=A.instance,B=A.currentTarget,A=A.listener,P!==g&&d.isPropagationStopped())break e;qp(d,A,B),g=P}}}if(js)throw n=mn,js=!1,mn=null,n}function Je(n,s){var a=s[vh];a===void 0&&(a=s[vh]=new Set);var c=n+"__bubble";a.has(c)||(Wp(s,n,2,!1),a.add(c))}function dh(n,s,a){var c=0;s&&(c|=4),Wp(a,n,c,s)}var Yl="_reactListening"+Math.random().toString(36).slice(2);function Aa(n){if(!n[Yl]){n[Yl]=!0,i.forEach(function(a){a!=="selectionchange"&&(g0.has(a)||dh(a,!1,n),dh(a,!0,n))});var s=n.nodeType===9?n:n.ownerDocument;s===null||s[Yl]||(s[Yl]=!0,dh("selectionchange",!1,s))}}function Wp(n,s,a,c){switch(Ks(s)){case 1:var d=Kn;break;case 4:d=zl;break;default:d=ma}a=d.bind(null,s,a,n),d=void 0,!Xr||s!=="touchstart"&&s!=="touchmove"&&s!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(s,a,{capture:!0,passive:d}):n.addEventListener(s,a,!0):d!==void 0?n.addEventListener(s,a,{passive:d}):n.addEventListener(s,a,!1)}function fh(n,s,a,c,d){var g=c;if((s&1)===0&&(s&2)===0&&c!==null)e:for(;;){if(c===null)return;var E=c.tag;if(E===3||E===4){var A=c.stateNode.containerInfo;if(A===d||A.nodeType===8&&A.parentNode===d)break;if(E===4)for(E=c.return;E!==null;){var P=E.tag;if((P===3||P===4)&&(P=E.stateNode.containerInfo,P===d||P.nodeType===8&&P.parentNode===d))return;E=E.return}for(;A!==null;){if(E=ts(A),E===null)return;if(P=E.tag,P===5||P===6){c=g=E;continue e}A=A.parentNode}}c=c.return}Nl(function(){var B=g,Q=Us(a),X=[];e:{var K=Bp.get(n);if(K!==void 0){var oe=Zi,ce=n;switch(n){case"keypress":if(Ji(a)===0)break e;case"keydown":case"keyup":oe=qe;break;case"focusin":ce="focus",oe=kt;break;case"focusout":ce="blur",oe=kt;break;case"beforeblur":case"afterblur":oe=kt;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":oe=ya;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":oe=ql;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":oe=Jn;break;case Fp:case Up:case jp:oe=Wl;break;case zp:oe=eo;break;case"scroll":oe=Ys;break;case"wheel":oe=ZE;break;case"copy":case"cut":case"paste":oe=u;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":oe=un}var he=(s&4)!==0,ut=!he&&n==="scroll",F=he?K!==null?K+"Capture":null:K;he=[];for(var V=B,j;V!==null;){j=V;var J=j.stateNode;if(j.tag===5&&J!==null&&(j=J,F!==null&&(J=Bi(V,F),J!=null&&he.push(Ra(V,J,j)))),ut)break;V=V.return}0<he.length&&(K=new oe(K,ce,null,a,Q),X.push({event:K,listeners:he}))}}if((s&7)===0){e:{if(K=n==="mouseover"||n==="pointerover",oe=n==="mouseout"||n==="pointerout",K&&a!==Kr&&(ce=a.relatedTarget||a.fromElement)&&(ts(ce)||ce[Rr]))break e;if((oe||K)&&(K=Q.window===Q?Q:(K=Q.ownerDocument)?K.defaultView||K.parentWindow:window,oe?(ce=a.relatedTarget||a.toElement,oe=B,ce=ce?ts(ce):null,ce!==null&&(ut=Cn(ce),ce!==ut||ce.tag!==5&&ce.tag!==6)&&(ce=null)):(oe=null,ce=B),oe!==ce)){if(he=ya,J="onMouseLeave",F="onMouseEnter",V="mouse",(n==="pointerout"||n==="pointerover")&&(he=un,J="onPointerLeave",F="onPointerEnter",V="pointer"),ut=oe==null?K:oo(oe),j=ce==null?K:oo(ce),K=new he(J,V+"leave",oe,a,Q),K.target=ut,K.relatedTarget=j,J=null,ts(Q)===B&&(he=new he(F,V+"enter",ce,a,Q),he.target=j,he.relatedTarget=ut,J=he),ut=J,oe&&ce)t:{for(he=oe,F=ce,V=0,j=he;j;j=io(j))V++;for(j=0,J=F;J;J=io(J))j++;for(;0<V-j;)he=io(he),V--;for(;0<j-V;)F=io(F),j--;for(;V--;){if(he===F||F!==null&&he===F.alternate)break t;he=io(he),F=io(F)}he=null}else he=null;oe!==null&&Gp(X,K,oe,he,!1),ce!==null&&ut!==null&&Gp(X,ut,ce,he,!0)}}e:{if(K=B?oo(B):window,oe=K.nodeName&&K.nodeName.toLowerCase(),oe==="select"||oe==="input"&&K.type==="file")var de=o0;else if(Rp(K))if(Pp)de=c0;else{de=l0;var me=a0}else(oe=K.nodeName)&&oe.toLowerCase()==="input"&&(K.type==="checkbox"||K.type==="radio")&&(de=u0);if(de&&(de=de(n,B))){Cp(X,de,a,Q);break e}me&&me(n,K,B),n==="focusout"&&(me=K._wrapperState)&&me.controlled&&K.type==="number"&&dt(K,"number",K.value)}switch(me=B?oo(B):window,n){case"focusin":(Rp(me)||me.contentEditable==="true")&&(no=me,ah=B,Ia=null);break;case"focusout":Ia=ah=no=null;break;case"mousedown":lh=!0;break;case"contextmenu":case"mouseup":case"dragend":lh=!1,Lp(X,a,Q);break;case"selectionchange":if(f0)break;case"keydown":case"keyup":Lp(X,a,Q)}var ge;if(rh)e:{switch(n){case"compositionstart":var ve="onCompositionStart";break e;case"compositionend":ve="onCompositionEnd";break e;case"compositionupdate":ve="onCompositionUpdate";break e}ve=void 0}else to?Sp(n,a)&&(ve="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(ve="onCompositionStart");ve&&(Ep&&a.locale!=="ko"&&(to||ve!=="onCompositionStart"?ve==="onCompositionEnd"&&to&&(ge=Bl()):(an=Q,Qs="value"in an?an.value:an.textContent,to=!0)),me=Xl(B,ve),0<me.length&&(ve=new v(ve,n,null,a,Q),X.push({event:ve,listeners:me}),ge?ve.data=ge:(ge=Ap(a),ge!==null&&(ve.data=ge)))),(ge=t0?n0(n,a):r0(n,a))&&(B=Xl(B,"onBeforeInput"),0<B.length&&(Q=new v("onBeforeInput","beforeinput",null,a,Q),X.push({event:Q,listeners:B}),Q.data=ge))}Hp(X,s)})}function Ra(n,s,a){return{instance:n,listener:s,currentTarget:a}}function Xl(n,s){for(var a=s+"Capture",c=[];n!==null;){var d=n,g=d.stateNode;d.tag===5&&g!==null&&(d=g,g=Bi(n,a),g!=null&&c.unshift(Ra(n,g,d)),g=Bi(n,s),g!=null&&c.push(Ra(n,g,d))),n=n.return}return c}function io(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Gp(n,s,a,c,d){for(var g=s._reactName,E=[];a!==null&&a!==c;){var A=a,P=A.alternate,B=A.stateNode;if(P!==null&&P===c)break;A.tag===5&&B!==null&&(A=B,d?(P=Bi(a,g),P!=null&&E.unshift(Ra(a,P,A))):d||(P=Bi(a,g),P!=null&&E.push(Ra(a,P,A)))),a=a.return}E.length!==0&&n.push({event:s,listeners:E})}var y0=/\r\n?/g,_0=/\u0000|\uFFFD/g;function Kp(n){return(typeof n=="string"?n:""+n).replace(y0,`
`).replace(_0,"")}function Jl(n,s,a){if(s=Kp(s),Kp(n)!==s&&a)throw Error(t(425))}function Zl(){}var ph=null,mh=null;function gh(n,s){return n==="textarea"||n==="noscript"||typeof s.children=="string"||typeof s.children=="number"||typeof s.dangerouslySetInnerHTML=="object"&&s.dangerouslySetInnerHTML!==null&&s.dangerouslySetInnerHTML.__html!=null}var yh=typeof setTimeout=="function"?setTimeout:void 0,v0=typeof clearTimeout=="function"?clearTimeout:void 0,Qp=typeof Promise=="function"?Promise:void 0,w0=typeof queueMicrotask=="function"?queueMicrotask:typeof Qp<"u"?function(n){return Qp.resolve(null).then(n).catch(E0)}:yh;function E0(n){setTimeout(function(){throw n})}function _h(n,s){var a=s,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),ni(s);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);ni(s)}function oi(n){for(;n!=null;n=n.nextSibling){var s=n.nodeType;if(s===1||s===3)break;if(s===8){if(s=n.data,s==="$"||s==="$!"||s==="$?")break;if(s==="/$")return null}}return n}function Yp(n){n=n.previousSibling;for(var s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(s===0)return n;s--}else a==="/$"&&s++}n=n.previousSibling}return null}var so=Math.random().toString(36).slice(2),er="__reactFiber$"+so,Ca="__reactProps$"+so,Rr="__reactContainer$"+so,vh="__reactEvents$"+so,T0="__reactListeners$"+so,I0="__reactHandles$"+so;function ts(n){var s=n[er];if(s)return s;for(var a=n.parentNode;a;){if(s=a[Rr]||a[er]){if(a=s.alternate,s.child!==null||a!==null&&a.child!==null)for(n=Yp(n);n!==null;){if(a=n[er])return a;n=Yp(n)}return s}n=a,a=n.parentNode}return null}function Pa(n){return n=n[er]||n[Rr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function oo(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function eu(n){return n[Ca]||null}var wh=[],ao=-1;function ai(n){return{current:n}}function Ze(n){0>ao||(n.current=wh[ao],wh[ao]=null,ao--)}function Qe(n,s){ao++,wh[ao]=n.current,n.current=s}var li={},Lt=ai(li),Kt=ai(!1),ns=li;function lo(n,s){var a=n.type.contextTypes;if(!a)return li;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===s)return c.__reactInternalMemoizedMaskedChildContext;var d={},g;for(g in a)d[g]=s[g];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=s,n.__reactInternalMemoizedMaskedChildContext=d),d}function Qt(n){return n=n.childContextTypes,n!=null}function tu(){Ze(Kt),Ze(Lt)}function Xp(n,s,a){if(Lt.current!==li)throw Error(t(168));Qe(Lt,s),Qe(Kt,a)}function Jp(n,s,a){var c=n.stateNode;if(s=s.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in s))throw Error(t(108,Be(n)||"Unknown",d));return se({},a,c)}function nu(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||li,ns=Lt.current,Qe(Lt,n),Qe(Kt,Kt.current),!0}function Zp(n,s,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Jp(n,s,ns),c.__reactInternalMemoizedMergedChildContext=n,Ze(Kt),Ze(Lt),Qe(Lt,n)):Ze(Kt),Qe(Kt,a)}var Cr=null,ru=!1,Eh=!1;function em(n){Cr===null?Cr=[n]:Cr.push(n)}function S0(n){ru=!0,em(n)}function ui(){if(!Eh&&Cr!==null){Eh=!0;var n=0,s=Oe;try{var a=Cr;for(Oe=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Cr=null,ru=!1}catch(d){throw Cr!==null&&(Cr=Cr.slice(n+1)),ia(Bs,ui),d}finally{Oe=s,Eh=!1}}return null}var uo=[],co=0,iu=null,su=0,yn=[],_n=0,rs=null,Pr=1,kr="";function is(n,s){uo[co++]=su,uo[co++]=iu,iu=n,su=s}function tm(n,s,a){yn[_n++]=Pr,yn[_n++]=kr,yn[_n++]=rs,rs=n;var c=Pr;n=kr;var d=32-sn(c)-1;c&=~(1<<d),a+=1;var g=32-sn(s)+d;if(30<g){var E=d-d%5;g=(c&(1<<E)-1).toString(32),c>>=E,d-=E,Pr=1<<32-sn(s)+d|a<<d|c,kr=g+n}else Pr=1<<g|a<<d|c,kr=n}function Th(n){n.return!==null&&(is(n,1),tm(n,1,0))}function Ih(n){for(;n===iu;)iu=uo[--co],uo[co]=null,su=uo[--co],uo[co]=null;for(;n===rs;)rs=yn[--_n],yn[_n]=null,kr=yn[--_n],yn[_n]=null,Pr=yn[--_n],yn[_n]=null}var cn=null,hn=null,et=!1,Nn=null;function nm(n,s){var a=Tn(5,null,null,0);a.elementType="DELETED",a.stateNode=s,a.return=n,s=n.deletions,s===null?(n.deletions=[a],n.flags|=16):s.push(a)}function rm(n,s){switch(n.tag){case 5:var a=n.type;return s=s.nodeType!==1||a.toLowerCase()!==s.nodeName.toLowerCase()?null:s,s!==null?(n.stateNode=s,cn=n,hn=oi(s.firstChild),!0):!1;case 6:return s=n.pendingProps===""||s.nodeType!==3?null:s,s!==null?(n.stateNode=s,cn=n,hn=null,!0):!1;case 13:return s=s.nodeType!==8?null:s,s!==null?(a=rs!==null?{id:Pr,overflow:kr}:null,n.memoizedState={dehydrated:s,treeContext:a,retryLane:1073741824},a=Tn(18,null,null,0),a.stateNode=s,a.return=n,n.child=a,cn=n,hn=null,!0):!1;default:return!1}}function Sh(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ah(n){if(et){var s=hn;if(s){var a=s;if(!rm(n,s)){if(Sh(n))throw Error(t(418));s=oi(a.nextSibling);var c=cn;s&&rm(n,s)?nm(c,a):(n.flags=n.flags&-4097|2,et=!1,cn=n)}}else{if(Sh(n))throw Error(t(418));n.flags=n.flags&-4097|2,et=!1,cn=n}}}function im(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;cn=n}function ou(n){if(n!==cn)return!1;if(!et)return im(n),et=!0,!1;var s;if((s=n.tag!==3)&&!(s=n.tag!==5)&&(s=n.type,s=s!=="head"&&s!=="body"&&!gh(n.type,n.memoizedProps)),s&&(s=hn)){if(Sh(n))throw sm(),Error(t(418));for(;s;)nm(n,s),s=oi(s.nextSibling)}if(im(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(s===0){hn=oi(n.nextSibling);break e}s--}else a!=="$"&&a!=="$!"&&a!=="$?"||s++}n=n.nextSibling}hn=null}}else hn=cn?oi(n.stateNode.nextSibling):null;return!0}function sm(){for(var n=hn;n;)n=oi(n.nextSibling)}function ho(){hn=cn=null,et=!1}function Rh(n){Nn===null?Nn=[n]:Nn.push(n)}var A0=ie.ReactCurrentBatchConfig;function ka(n,s,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,g=""+n;return s!==null&&s.ref!==null&&typeof s.ref=="function"&&s.ref._stringRef===g?s.ref:(s=function(E){var A=d.refs;E===null?delete A[g]:A[g]=E},s._stringRef=g,s)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function au(n,s){throw n=Object.prototype.toString.call(s),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":n))}function om(n){var s=n._init;return s(n._payload)}function am(n){function s(F,V){if(n){var j=F.deletions;j===null?(F.deletions=[V],F.flags|=16):j.push(V)}}function a(F,V){if(!n)return null;for(;V!==null;)s(F,V),V=V.sibling;return null}function c(F,V){for(F=new Map;V!==null;)V.key!==null?F.set(V.key,V):F.set(V.index,V),V=V.sibling;return F}function d(F,V){return F=yi(F,V),F.index=0,F.sibling=null,F}function g(F,V,j){return F.index=j,n?(j=F.alternate,j!==null?(j=j.index,j<V?(F.flags|=2,V):j):(F.flags|=2,V)):(F.flags|=1048576,V)}function E(F){return n&&F.alternate===null&&(F.flags|=2),F}function A(F,V,j,J){return V===null||V.tag!==6?(V=yd(j,F.mode,J),V.return=F,V):(V=d(V,j),V.return=F,V)}function P(F,V,j,J){var de=j.type;return de===N?Q(F,V,j.props.children,J,j.key):V!==null&&(V.elementType===de||typeof de=="object"&&de!==null&&de.$$typeof===vt&&om(de)===V.type)?(J=d(V,j.props),J.ref=ka(F,V,j),J.return=F,J):(J=xu(j.type,j.key,j.props,null,F.mode,J),J.ref=ka(F,V,j),J.return=F,J)}function B(F,V,j,J){return V===null||V.tag!==4||V.stateNode.containerInfo!==j.containerInfo||V.stateNode.implementation!==j.implementation?(V=_d(j,F.mode,J),V.return=F,V):(V=d(V,j.children||[]),V.return=F,V)}function Q(F,V,j,J,de){return V===null||V.tag!==7?(V=ds(j,F.mode,J,de),V.return=F,V):(V=d(V,j),V.return=F,V)}function X(F,V,j){if(typeof V=="string"&&V!==""||typeof V=="number")return V=yd(""+V,F.mode,j),V.return=F,V;if(typeof V=="object"&&V!==null){switch(V.$$typeof){case ye:return j=xu(V.type,V.key,V.props,null,F.mode,j),j.ref=ka(F,null,V),j.return=F,j;case Re:return V=_d(V,F.mode,j),V.return=F,V;case vt:var J=V._init;return X(F,J(V._payload),j)}if(at(V)||fe(V))return V=ds(V,F.mode,j,null),V.return=F,V;au(F,V)}return null}function K(F,V,j,J){var de=V!==null?V.key:null;if(typeof j=="string"&&j!==""||typeof j=="number")return de!==null?null:A(F,V,""+j,J);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case ye:return j.key===de?P(F,V,j,J):null;case Re:return j.key===de?B(F,V,j,J):null;case vt:return de=j._init,K(F,V,de(j._payload),J)}if(at(j)||fe(j))return de!==null?null:Q(F,V,j,J,null);au(F,j)}return null}function oe(F,V,j,J,de){if(typeof J=="string"&&J!==""||typeof J=="number")return F=F.get(j)||null,A(V,F,""+J,de);if(typeof J=="object"&&J!==null){switch(J.$$typeof){case ye:return F=F.get(J.key===null?j:J.key)||null,P(V,F,J,de);case Re:return F=F.get(J.key===null?j:J.key)||null,B(V,F,J,de);case vt:var me=J._init;return oe(F,V,j,me(J._payload),de)}if(at(J)||fe(J))return F=F.get(j)||null,Q(V,F,J,de,null);au(V,J)}return null}function ce(F,V,j,J){for(var de=null,me=null,ge=V,ve=V=0,Rt=null;ge!==null&&ve<j.length;ve++){ge.index>ve?(Rt=ge,ge=null):Rt=ge.sibling;var Ue=K(F,ge,j[ve],J);if(Ue===null){ge===null&&(ge=Rt);break}n&&ge&&Ue.alternate===null&&s(F,ge),V=g(Ue,V,ve),me===null?de=Ue:me.sibling=Ue,me=Ue,ge=Rt}if(ve===j.length)return a(F,ge),et&&is(F,ve),de;if(ge===null){for(;ve<j.length;ve++)ge=X(F,j[ve],J),ge!==null&&(V=g(ge,V,ve),me===null?de=ge:me.sibling=ge,me=ge);return et&&is(F,ve),de}for(ge=c(F,ge);ve<j.length;ve++)Rt=oe(ge,F,ve,j[ve],J),Rt!==null&&(n&&Rt.alternate!==null&&ge.delete(Rt.key===null?ve:Rt.key),V=g(Rt,V,ve),me===null?de=Rt:me.sibling=Rt,me=Rt);return n&&ge.forEach(function(_i){return s(F,_i)}),et&&is(F,ve),de}function he(F,V,j,J){var de=fe(j);if(typeof de!="function")throw Error(t(150));if(j=de.call(j),j==null)throw Error(t(151));for(var me=de=null,ge=V,ve=V=0,Rt=null,Ue=j.next();ge!==null&&!Ue.done;ve++,Ue=j.next()){ge.index>ve?(Rt=ge,ge=null):Rt=ge.sibling;var _i=K(F,ge,Ue.value,J);if(_i===null){ge===null&&(ge=Rt);break}n&&ge&&_i.alternate===null&&s(F,ge),V=g(_i,V,ve),me===null?de=_i:me.sibling=_i,me=_i,ge=Rt}if(Ue.done)return a(F,ge),et&&is(F,ve),de;if(ge===null){for(;!Ue.done;ve++,Ue=j.next())Ue=X(F,Ue.value,J),Ue!==null&&(V=g(Ue,V,ve),me===null?de=Ue:me.sibling=Ue,me=Ue);return et&&is(F,ve),de}for(ge=c(F,ge);!Ue.done;ve++,Ue=j.next())Ue=oe(ge,F,ve,Ue.value,J),Ue!==null&&(n&&Ue.alternate!==null&&ge.delete(Ue.key===null?ve:Ue.key),V=g(Ue,V,ve),me===null?de=Ue:me.sibling=Ue,me=Ue);return n&&ge.forEach(function(iT){return s(F,iT)}),et&&is(F,ve),de}function ut(F,V,j,J){if(typeof j=="object"&&j!==null&&j.type===N&&j.key===null&&(j=j.props.children),typeof j=="object"&&j!==null){switch(j.$$typeof){case ye:e:{for(var de=j.key,me=V;me!==null;){if(me.key===de){if(de=j.type,de===N){if(me.tag===7){a(F,me.sibling),V=d(me,j.props.children),V.return=F,F=V;break e}}else if(me.elementType===de||typeof de=="object"&&de!==null&&de.$$typeof===vt&&om(de)===me.type){a(F,me.sibling),V=d(me,j.props),V.ref=ka(F,me,j),V.return=F,F=V;break e}a(F,me);break}else s(F,me);me=me.sibling}j.type===N?(V=ds(j.props.children,F.mode,J,j.key),V.return=F,F=V):(J=xu(j.type,j.key,j.props,null,F.mode,J),J.ref=ka(F,V,j),J.return=F,F=J)}return E(F);case Re:e:{for(me=j.key;V!==null;){if(V.key===me)if(V.tag===4&&V.stateNode.containerInfo===j.containerInfo&&V.stateNode.implementation===j.implementation){a(F,V.sibling),V=d(V,j.children||[]),V.return=F,F=V;break e}else{a(F,V);break}else s(F,V);V=V.sibling}V=_d(j,F.mode,J),V.return=F,F=V}return E(F);case vt:return me=j._init,ut(F,V,me(j._payload),J)}if(at(j))return ce(F,V,j,J);if(fe(j))return he(F,V,j,J);au(F,j)}return typeof j=="string"&&j!==""||typeof j=="number"?(j=""+j,V!==null&&V.tag===6?(a(F,V.sibling),V=d(V,j),V.return=F,F=V):(a(F,V),V=yd(j,F.mode,J),V.return=F,F=V),E(F)):a(F,V)}return ut}var fo=am(!0),lm=am(!1),lu=ai(null),uu=null,po=null,Ch=null;function Ph(){Ch=po=uu=null}function kh(n){var s=lu.current;Ze(lu),n._currentValue=s}function Nh(n,s,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&s)!==s?(n.childLanes|=s,c!==null&&(c.childLanes|=s)):c!==null&&(c.childLanes&s)!==s&&(c.childLanes|=s),n===a)break;n=n.return}}function mo(n,s){uu=n,Ch=po=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&s)!==0&&(Yt=!0),n.firstContext=null)}function vn(n){var s=n._currentValue;if(Ch!==n)if(n={context:n,memoizedValue:s,next:null},po===null){if(uu===null)throw Error(t(308));po=n,uu.dependencies={lanes:0,firstContext:n}}else po=po.next=n;return s}var ss=null;function xh(n){ss===null?ss=[n]:ss.push(n)}function um(n,s,a,c){var d=s.interleaved;return d===null?(a.next=a,xh(s)):(a.next=d.next,d.next=a),s.interleaved=a,Nr(n,c)}function Nr(n,s){n.lanes|=s;var a=n.alternate;for(a!==null&&(a.lanes|=s),a=n,n=n.return;n!==null;)n.childLanes|=s,a=n.alternate,a!==null&&(a.childLanes|=s),a=n,n=n.return;return a.tag===3?a.stateNode:null}var ci=!1;function Dh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function cm(n,s){n=n.updateQueue,s.updateQueue===n&&(s.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function xr(n,s){return{eventTime:n,lane:s,tag:0,payload:null,callback:null,next:null}}function hi(n,s,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Fe&2)!==0){var d=c.pending;return d===null?s.next=s:(s.next=d.next,d.next=s),c.pending=s,Nr(n,a)}return d=c.interleaved,d===null?(s.next=s,xh(c)):(s.next=d.next,d.next=s),c.interleaved=s,Nr(n,a)}function cu(n,s,a){if(s=s.updateQueue,s!==null&&(s=s.shared,(a&4194240)!==0)){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,ca(n,a)}}function hm(n,s){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,g=null;if(a=a.firstBaseUpdate,a!==null){do{var E={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};g===null?d=g=E:g=g.next=E,a=a.next}while(a!==null);g===null?d=g=s:g=g.next=s}else d=g=s;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:g,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=s:n.next=s,a.lastBaseUpdate=s}function hu(n,s,a,c){var d=n.updateQueue;ci=!1;var g=d.firstBaseUpdate,E=d.lastBaseUpdate,A=d.shared.pending;if(A!==null){d.shared.pending=null;var P=A,B=P.next;P.next=null,E===null?g=B:E.next=B,E=P;var Q=n.alternate;Q!==null&&(Q=Q.updateQueue,A=Q.lastBaseUpdate,A!==E&&(A===null?Q.firstBaseUpdate=B:A.next=B,Q.lastBaseUpdate=P))}if(g!==null){var X=d.baseState;E=0,Q=B=P=null,A=g;do{var K=A.lane,oe=A.eventTime;if((c&K)===K){Q!==null&&(Q=Q.next={eventTime:oe,lane:0,tag:A.tag,payload:A.payload,callback:A.callback,next:null});e:{var ce=n,he=A;switch(K=s,oe=a,he.tag){case 1:if(ce=he.payload,typeof ce=="function"){X=ce.call(oe,X,K);break e}X=ce;break e;case 3:ce.flags=ce.flags&-65537|128;case 0:if(ce=he.payload,K=typeof ce=="function"?ce.call(oe,X,K):ce,K==null)break e;X=se({},X,K);break e;case 2:ci=!0}}A.callback!==null&&A.lane!==0&&(n.flags|=64,K=d.effects,K===null?d.effects=[A]:K.push(A))}else oe={eventTime:oe,lane:K,tag:A.tag,payload:A.payload,callback:A.callback,next:null},Q===null?(B=Q=oe,P=X):Q=Q.next=oe,E|=K;if(A=A.next,A===null){if(A=d.shared.pending,A===null)break;K=A,A=K.next,K.next=null,d.lastBaseUpdate=K,d.shared.pending=null}}while(!0);if(Q===null&&(P=X),d.baseState=P,d.firstBaseUpdate=B,d.lastBaseUpdate=Q,s=d.shared.interleaved,s!==null){d=s;do E|=d.lane,d=d.next;while(d!==s)}else g===null&&(d.shared.lanes=0);ls|=E,n.lanes=E,n.memoizedState=X}}function dm(n,s,a){if(n=s.effects,s.effects=null,n!==null)for(s=0;s<n.length;s++){var c=n[s],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var Na={},tr=ai(Na),xa=ai(Na),Da=ai(Na);function os(n){if(n===Na)throw Error(t(174));return n}function Vh(n,s){switch(Qe(Da,s),Qe(xa,n),Qe(tr,Na),n=s.nodeType,n){case 9:case 11:s=(s=s.documentElement)?s.namespaceURI:Ls(null,"");break;default:n=n===8?s.parentNode:s,s=n.namespaceURI||null,n=n.tagName,s=Ls(s,n)}Ze(tr),Qe(tr,s)}function go(){Ze(tr),Ze(xa),Ze(Da)}function fm(n){os(Da.current);var s=os(tr.current),a=Ls(s,n.type);s!==a&&(Qe(xa,n),Qe(tr,a))}function Oh(n){xa.current===n&&(Ze(tr),Ze(xa))}var nt=ai(0);function du(n){for(var s=n;s!==null;){if(s.tag===13){var a=s.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return s}else if(s.tag===19&&s.memoizedProps.revealOrder!==void 0){if((s.flags&128)!==0)return s}else if(s.child!==null){s.child.return=s,s=s.child;continue}if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return null;s=s.return}s.sibling.return=s.return,s=s.sibling}return null}var Mh=[];function Lh(){for(var n=0;n<Mh.length;n++)Mh[n]._workInProgressVersionPrimary=null;Mh.length=0}var fu=ie.ReactCurrentDispatcher,bh=ie.ReactCurrentBatchConfig,as=0,rt=null,wt=null,St=null,pu=!1,Va=!1,Oa=0,R0=0;function bt(){throw Error(t(321))}function Fh(n,s){if(s===null)return!1;for(var a=0;a<s.length&&a<n.length;a++)if(!kn(n[a],s[a]))return!1;return!0}function Uh(n,s,a,c,d,g){if(as=g,rt=s,s.memoizedState=null,s.updateQueue=null,s.lanes=0,fu.current=n===null||n.memoizedState===null?N0:x0,n=a(c,d),Va){g=0;do{if(Va=!1,Oa=0,25<=g)throw Error(t(301));g+=1,St=wt=null,s.updateQueue=null,fu.current=D0,n=a(c,d)}while(Va)}if(fu.current=yu,s=wt!==null&&wt.next!==null,as=0,St=wt=rt=null,pu=!1,s)throw Error(t(300));return n}function jh(){var n=Oa!==0;return Oa=0,n}function nr(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return St===null?rt.memoizedState=St=n:St=St.next=n,St}function wn(){if(wt===null){var n=rt.alternate;n=n!==null?n.memoizedState:null}else n=wt.next;var s=St===null?rt.memoizedState:St.next;if(s!==null)St=s,wt=n;else{if(n===null)throw Error(t(310));wt=n,n={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},St===null?rt.memoizedState=St=n:St=St.next=n}return St}function Ma(n,s){return typeof s=="function"?s(n):s}function zh(n){var s=wn(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=wt,d=c.baseQueue,g=a.pending;if(g!==null){if(d!==null){var E=d.next;d.next=g.next,g.next=E}c.baseQueue=d=g,a.pending=null}if(d!==null){g=d.next,c=c.baseState;var A=E=null,P=null,B=g;do{var Q=B.lane;if((as&Q)===Q)P!==null&&(P=P.next={lane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),c=B.hasEagerState?B.eagerState:n(c,B.action);else{var X={lane:Q,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null};P===null?(A=P=X,E=c):P=P.next=X,rt.lanes|=Q,ls|=Q}B=B.next}while(B!==null&&B!==g);P===null?E=c:P.next=A,kn(c,s.memoizedState)||(Yt=!0),s.memoizedState=c,s.baseState=E,s.baseQueue=P,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do g=d.lane,rt.lanes|=g,ls|=g,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[s.memoizedState,a.dispatch]}function Bh(n){var s=wn(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,g=s.memoizedState;if(d!==null){a.pending=null;var E=d=d.next;do g=n(g,E.action),E=E.next;while(E!==d);kn(g,s.memoizedState)||(Yt=!0),s.memoizedState=g,s.baseQueue===null&&(s.baseState=g),a.lastRenderedState=g}return[g,c]}function pm(){}function mm(n,s){var a=rt,c=wn(),d=s(),g=!kn(c.memoizedState,d);if(g&&(c.memoizedState=d,Yt=!0),c=c.queue,$h(_m.bind(null,a,c,n),[n]),c.getSnapshot!==s||g||St!==null&&St.memoizedState.tag&1){if(a.flags|=2048,La(9,ym.bind(null,a,c,d,s),void 0,null),At===null)throw Error(t(349));(as&30)!==0||gm(a,s,d)}return d}function gm(n,s,a){n.flags|=16384,n={getSnapshot:s,value:a},s=rt.updateQueue,s===null?(s={lastEffect:null,stores:null},rt.updateQueue=s,s.stores=[n]):(a=s.stores,a===null?s.stores=[n]:a.push(n))}function ym(n,s,a,c){s.value=a,s.getSnapshot=c,vm(s)&&wm(n)}function _m(n,s,a){return a(function(){vm(s)&&wm(n)})}function vm(n){var s=n.getSnapshot;n=n.value;try{var a=s();return!kn(n,a)}catch{return!0}}function wm(n){var s=Nr(n,1);s!==null&&On(s,n,1,-1)}function Em(n){var s=nr();return typeof n=="function"&&(n=n()),s.memoizedState=s.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:n},s.queue=n,n=n.dispatch=k0.bind(null,rt,n),[s.memoizedState,n]}function La(n,s,a,c){return n={tag:n,create:s,destroy:a,deps:c,next:null},s=rt.updateQueue,s===null?(s={lastEffect:null,stores:null},rt.updateQueue=s,s.lastEffect=n.next=n):(a=s.lastEffect,a===null?s.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,s.lastEffect=n)),n}function Tm(){return wn().memoizedState}function mu(n,s,a,c){var d=nr();rt.flags|=n,d.memoizedState=La(1|s,a,void 0,c===void 0?null:c)}function gu(n,s,a,c){var d=wn();c=c===void 0?null:c;var g=void 0;if(wt!==null){var E=wt.memoizedState;if(g=E.destroy,c!==null&&Fh(c,E.deps)){d.memoizedState=La(s,a,g,c);return}}rt.flags|=n,d.memoizedState=La(1|s,a,g,c)}function Im(n,s){return mu(8390656,8,n,s)}function $h(n,s){return gu(2048,8,n,s)}function Sm(n,s){return gu(4,2,n,s)}function Am(n,s){return gu(4,4,n,s)}function Rm(n,s){if(typeof s=="function")return n=n(),s(n),function(){s(null)};if(s!=null)return n=n(),s.current=n,function(){s.current=null}}function Cm(n,s,a){return a=a!=null?a.concat([n]):null,gu(4,4,Rm.bind(null,s,n),a)}function qh(){}function Pm(n,s){var a=wn();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&Fh(s,c[1])?c[0]:(a.memoizedState=[n,s],n)}function km(n,s){var a=wn();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&Fh(s,c[1])?c[0]:(n=n(),a.memoizedState=[n,s],n)}function Nm(n,s,a){return(as&21)===0?(n.baseState&&(n.baseState=!1,Yt=!0),n.memoizedState=a):(kn(a,s)||(a=la(),rt.lanes|=a,ls|=a,n.baseState=!0),s)}function C0(n,s){var a=Oe;Oe=a!==0&&4>a?a:4,n(!0);var c=bh.transition;bh.transition={};try{n(!1),s()}finally{Oe=a,bh.transition=c}}function xm(){return wn().memoizedState}function P0(n,s,a){var c=mi(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Dm(n))Vm(s,a);else if(a=um(n,s,a,c),a!==null){var d=Wt();On(a,n,c,d),Om(a,s,c)}}function k0(n,s,a){var c=mi(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Dm(n))Vm(s,d);else{var g=n.alternate;if(n.lanes===0&&(g===null||g.lanes===0)&&(g=s.lastRenderedReducer,g!==null))try{var E=s.lastRenderedState,A=g(E,a);if(d.hasEagerState=!0,d.eagerState=A,kn(A,E)){var P=s.interleaved;P===null?(d.next=d,xh(s)):(d.next=P.next,P.next=d),s.interleaved=d;return}}catch{}finally{}a=um(n,s,d,c),a!==null&&(d=Wt(),On(a,n,c,d),Om(a,s,c))}}function Dm(n){var s=n.alternate;return n===rt||s!==null&&s===rt}function Vm(n,s){Va=pu=!0;var a=n.pending;a===null?s.next=s:(s.next=a.next,a.next=s),n.pending=s}function Om(n,s,a){if((a&4194240)!==0){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,ca(n,a)}}var yu={readContext:vn,useCallback:bt,useContext:bt,useEffect:bt,useImperativeHandle:bt,useInsertionEffect:bt,useLayoutEffect:bt,useMemo:bt,useReducer:bt,useRef:bt,useState:bt,useDebugValue:bt,useDeferredValue:bt,useTransition:bt,useMutableSource:bt,useSyncExternalStore:bt,useId:bt,unstable_isNewReconciler:!1},N0={readContext:vn,useCallback:function(n,s){return nr().memoizedState=[n,s===void 0?null:s],n},useContext:vn,useEffect:Im,useImperativeHandle:function(n,s,a){return a=a!=null?a.concat([n]):null,mu(4194308,4,Rm.bind(null,s,n),a)},useLayoutEffect:function(n,s){return mu(4194308,4,n,s)},useInsertionEffect:function(n,s){return mu(4,2,n,s)},useMemo:function(n,s){var a=nr();return s=s===void 0?null:s,n=n(),a.memoizedState=[n,s],n},useReducer:function(n,s,a){var c=nr();return s=a!==void 0?a(s):s,c.memoizedState=c.baseState=s,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:s},c.queue=n,n=n.dispatch=P0.bind(null,rt,n),[c.memoizedState,n]},useRef:function(n){var s=nr();return n={current:n},s.memoizedState=n},useState:Em,useDebugValue:qh,useDeferredValue:function(n){return nr().memoizedState=n},useTransition:function(){var n=Em(!1),s=n[0];return n=C0.bind(null,n[1]),nr().memoizedState=n,[s,n]},useMutableSource:function(){},useSyncExternalStore:function(n,s,a){var c=rt,d=nr();if(et){if(a===void 0)throw Error(t(407));a=a()}else{if(a=s(),At===null)throw Error(t(349));(as&30)!==0||gm(c,s,a)}d.memoizedState=a;var g={value:a,getSnapshot:s};return d.queue=g,Im(_m.bind(null,c,g,n),[n]),c.flags|=2048,La(9,ym.bind(null,c,g,a,s),void 0,null),a},useId:function(){var n=nr(),s=At.identifierPrefix;if(et){var a=kr,c=Pr;a=(c&~(1<<32-sn(c)-1)).toString(32)+a,s=":"+s+"R"+a,a=Oa++,0<a&&(s+="H"+a.toString(32)),s+=":"}else a=R0++,s=":"+s+"r"+a.toString(32)+":";return n.memoizedState=s},unstable_isNewReconciler:!1},x0={readContext:vn,useCallback:Pm,useContext:vn,useEffect:$h,useImperativeHandle:Cm,useInsertionEffect:Sm,useLayoutEffect:Am,useMemo:km,useReducer:zh,useRef:Tm,useState:function(){return zh(Ma)},useDebugValue:qh,useDeferredValue:function(n){var s=wn();return Nm(s,wt.memoizedState,n)},useTransition:function(){var n=zh(Ma)[0],s=wn().memoizedState;return[n,s]},useMutableSource:pm,useSyncExternalStore:mm,useId:xm,unstable_isNewReconciler:!1},D0={readContext:vn,useCallback:Pm,useContext:vn,useEffect:$h,useImperativeHandle:Cm,useInsertionEffect:Sm,useLayoutEffect:Am,useMemo:km,useReducer:Bh,useRef:Tm,useState:function(){return Bh(Ma)},useDebugValue:qh,useDeferredValue:function(n){var s=wn();return wt===null?s.memoizedState=n:Nm(s,wt.memoizedState,n)},useTransition:function(){var n=Bh(Ma)[0],s=wn().memoizedState;return[n,s]},useMutableSource:pm,useSyncExternalStore:mm,useId:xm,unstable_isNewReconciler:!1};function xn(n,s){if(n&&n.defaultProps){s=se({},s),n=n.defaultProps;for(var a in n)s[a]===void 0&&(s[a]=n[a]);return s}return s}function Hh(n,s,a,c){s=n.memoizedState,a=a(c,s),a=a==null?s:se({},s,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var _u={isMounted:function(n){return(n=n._reactInternals)?Cn(n)===n:!1},enqueueSetState:function(n,s,a){n=n._reactInternals;var c=Wt(),d=mi(n),g=xr(c,d);g.payload=s,a!=null&&(g.callback=a),s=hi(n,g,d),s!==null&&(On(s,n,d,c),cu(s,n,d))},enqueueReplaceState:function(n,s,a){n=n._reactInternals;var c=Wt(),d=mi(n),g=xr(c,d);g.tag=1,g.payload=s,a!=null&&(g.callback=a),s=hi(n,g,d),s!==null&&(On(s,n,d,c),cu(s,n,d))},enqueueForceUpdate:function(n,s){n=n._reactInternals;var a=Wt(),c=mi(n),d=xr(a,c);d.tag=2,s!=null&&(d.callback=s),s=hi(n,d,c),s!==null&&(On(s,n,c,a),cu(s,n,c))}};function Mm(n,s,a,c,d,g,E){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,g,E):s.prototype&&s.prototype.isPureReactComponent?!Ta(a,c)||!Ta(d,g):!0}function Lm(n,s,a){var c=!1,d=li,g=s.contextType;return typeof g=="object"&&g!==null?g=vn(g):(d=Qt(s)?ns:Lt.current,c=s.contextTypes,g=(c=c!=null)?lo(n,d):li),s=new s(a,g),n.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=_u,n.stateNode=s,s._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=g),s}function bm(n,s,a,c){n=s.state,typeof s.componentWillReceiveProps=="function"&&s.componentWillReceiveProps(a,c),typeof s.UNSAFE_componentWillReceiveProps=="function"&&s.UNSAFE_componentWillReceiveProps(a,c),s.state!==n&&_u.enqueueReplaceState(s,s.state,null)}function Wh(n,s,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Dh(n);var g=s.contextType;typeof g=="object"&&g!==null?d.context=vn(g):(g=Qt(s)?ns:Lt.current,d.context=lo(n,g)),d.state=n.memoizedState,g=s.getDerivedStateFromProps,typeof g=="function"&&(Hh(n,s,g,a),d.state=n.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(s=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),s!==d.state&&_u.enqueueReplaceState(d,d.state,null),hu(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function yo(n,s){try{var a="",c=s;do a+=xe(c),c=c.return;while(c);var d=a}catch(g){d=`
Error generating stack: `+g.message+`
`+g.stack}return{value:n,source:s,stack:d,digest:null}}function Gh(n,s,a){return{value:n,source:null,stack:a??null,digest:s??null}}function Kh(n,s){try{console.error(s.value)}catch(a){setTimeout(function(){throw a})}}var V0=typeof WeakMap=="function"?WeakMap:Map;function Fm(n,s,a){a=xr(-1,a),a.tag=3,a.payload={element:null};var c=s.value;return a.callback=function(){Au||(Au=!0,ud=c),Kh(n,s)},a}function Um(n,s,a){a=xr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=s.value;a.payload=function(){return c(d)},a.callback=function(){Kh(n,s)}}var g=n.stateNode;return g!==null&&typeof g.componentDidCatch=="function"&&(a.callback=function(){Kh(n,s),typeof c!="function"&&(fi===null?fi=new Set([this]):fi.add(this));var E=s.stack;this.componentDidCatch(s.value,{componentStack:E!==null?E:""})}),a}function jm(n,s,a){var c=n.pingCache;if(c===null){c=n.pingCache=new V0;var d=new Set;c.set(s,d)}else d=c.get(s),d===void 0&&(d=new Set,c.set(s,d));d.has(a)||(d.add(a),n=G0.bind(null,n,s,a),s.then(n,n))}function zm(n){do{var s;if((s=n.tag===13)&&(s=n.memoizedState,s=s!==null?s.dehydrated!==null:!0),s)return n;n=n.return}while(n!==null);return null}function Bm(n,s,a,c,d){return(n.mode&1)===0?(n===s?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(s=xr(-1,1),s.tag=2,hi(a,s,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var O0=ie.ReactCurrentOwner,Yt=!1;function Ht(n,s,a,c){s.child=n===null?lm(s,null,a,c):fo(s,n.child,a,c)}function $m(n,s,a,c,d){a=a.render;var g=s.ref;return mo(s,d),c=Uh(n,s,a,c,g,d),a=jh(),n!==null&&!Yt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Dr(n,s,d)):(et&&a&&Th(s),s.flags|=1,Ht(n,s,c,d),s.child)}function qm(n,s,a,c,d){if(n===null){var g=a.type;return typeof g=="function"&&!gd(g)&&g.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(s.tag=15,s.type=g,Hm(n,s,g,c,d)):(n=xu(a.type,null,c,s,s.mode,d),n.ref=s.ref,n.return=s,s.child=n)}if(g=n.child,(n.lanes&d)===0){var E=g.memoizedProps;if(a=a.compare,a=a!==null?a:Ta,a(E,c)&&n.ref===s.ref)return Dr(n,s,d)}return s.flags|=1,n=yi(g,c),n.ref=s.ref,n.return=s,s.child=n}function Hm(n,s,a,c,d){if(n!==null){var g=n.memoizedProps;if(Ta(g,c)&&n.ref===s.ref)if(Yt=!1,s.pendingProps=c=g,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Yt=!0);else return s.lanes=n.lanes,Dr(n,s,d)}return Qh(n,s,a,c,d)}function Wm(n,s,a){var c=s.pendingProps,d=c.children,g=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((s.mode&1)===0)s.memoizedState={baseLanes:0,cachePool:null,transitions:null},Qe(vo,dn),dn|=a;else{if((a&1073741824)===0)return n=g!==null?g.baseLanes|a:a,s.lanes=s.childLanes=1073741824,s.memoizedState={baseLanes:n,cachePool:null,transitions:null},s.updateQueue=null,Qe(vo,dn),dn|=n,null;s.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=g!==null?g.baseLanes:a,Qe(vo,dn),dn|=c}else g!==null?(c=g.baseLanes|a,s.memoizedState=null):c=a,Qe(vo,dn),dn|=c;return Ht(n,s,d,a),s.child}function Gm(n,s){var a=s.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(s.flags|=512,s.flags|=2097152)}function Qh(n,s,a,c,d){var g=Qt(a)?ns:Lt.current;return g=lo(s,g),mo(s,d),a=Uh(n,s,a,c,g,d),c=jh(),n!==null&&!Yt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Dr(n,s,d)):(et&&c&&Th(s),s.flags|=1,Ht(n,s,a,d),s.child)}function Km(n,s,a,c,d){if(Qt(a)){var g=!0;nu(s)}else g=!1;if(mo(s,d),s.stateNode===null)wu(n,s),Lm(s,a,c),Wh(s,a,c,d),c=!0;else if(n===null){var E=s.stateNode,A=s.memoizedProps;E.props=A;var P=E.context,B=a.contextType;typeof B=="object"&&B!==null?B=vn(B):(B=Qt(a)?ns:Lt.current,B=lo(s,B));var Q=a.getDerivedStateFromProps,X=typeof Q=="function"||typeof E.getSnapshotBeforeUpdate=="function";X||typeof E.UNSAFE_componentWillReceiveProps!="function"&&typeof E.componentWillReceiveProps!="function"||(A!==c||P!==B)&&bm(s,E,c,B),ci=!1;var K=s.memoizedState;E.state=K,hu(s,c,E,d),P=s.memoizedState,A!==c||K!==P||Kt.current||ci?(typeof Q=="function"&&(Hh(s,a,Q,c),P=s.memoizedState),(A=ci||Mm(s,a,A,c,K,P,B))?(X||typeof E.UNSAFE_componentWillMount!="function"&&typeof E.componentWillMount!="function"||(typeof E.componentWillMount=="function"&&E.componentWillMount(),typeof E.UNSAFE_componentWillMount=="function"&&E.UNSAFE_componentWillMount()),typeof E.componentDidMount=="function"&&(s.flags|=4194308)):(typeof E.componentDidMount=="function"&&(s.flags|=4194308),s.memoizedProps=c,s.memoizedState=P),E.props=c,E.state=P,E.context=B,c=A):(typeof E.componentDidMount=="function"&&(s.flags|=4194308),c=!1)}else{E=s.stateNode,cm(n,s),A=s.memoizedProps,B=s.type===s.elementType?A:xn(s.type,A),E.props=B,X=s.pendingProps,K=E.context,P=a.contextType,typeof P=="object"&&P!==null?P=vn(P):(P=Qt(a)?ns:Lt.current,P=lo(s,P));var oe=a.getDerivedStateFromProps;(Q=typeof oe=="function"||typeof E.getSnapshotBeforeUpdate=="function")||typeof E.UNSAFE_componentWillReceiveProps!="function"&&typeof E.componentWillReceiveProps!="function"||(A!==X||K!==P)&&bm(s,E,c,P),ci=!1,K=s.memoizedState,E.state=K,hu(s,c,E,d);var ce=s.memoizedState;A!==X||K!==ce||Kt.current||ci?(typeof oe=="function"&&(Hh(s,a,oe,c),ce=s.memoizedState),(B=ci||Mm(s,a,B,c,K,ce,P)||!1)?(Q||typeof E.UNSAFE_componentWillUpdate!="function"&&typeof E.componentWillUpdate!="function"||(typeof E.componentWillUpdate=="function"&&E.componentWillUpdate(c,ce,P),typeof E.UNSAFE_componentWillUpdate=="function"&&E.UNSAFE_componentWillUpdate(c,ce,P)),typeof E.componentDidUpdate=="function"&&(s.flags|=4),typeof E.getSnapshotBeforeUpdate=="function"&&(s.flags|=1024)):(typeof E.componentDidUpdate!="function"||A===n.memoizedProps&&K===n.memoizedState||(s.flags|=4),typeof E.getSnapshotBeforeUpdate!="function"||A===n.memoizedProps&&K===n.memoizedState||(s.flags|=1024),s.memoizedProps=c,s.memoizedState=ce),E.props=c,E.state=ce,E.context=P,c=B):(typeof E.componentDidUpdate!="function"||A===n.memoizedProps&&K===n.memoizedState||(s.flags|=4),typeof E.getSnapshotBeforeUpdate!="function"||A===n.memoizedProps&&K===n.memoizedState||(s.flags|=1024),c=!1)}return Yh(n,s,a,c,g,d)}function Yh(n,s,a,c,d,g){Gm(n,s);var E=(s.flags&128)!==0;if(!c&&!E)return d&&Zp(s,a,!1),Dr(n,s,g);c=s.stateNode,O0.current=s;var A=E&&typeof a.getDerivedStateFromError!="function"?null:c.render();return s.flags|=1,n!==null&&E?(s.child=fo(s,n.child,null,g),s.child=fo(s,null,A,g)):Ht(n,s,A,g),s.memoizedState=c.state,d&&Zp(s,a,!0),s.child}function Qm(n){var s=n.stateNode;s.pendingContext?Xp(n,s.pendingContext,s.pendingContext!==s.context):s.context&&Xp(n,s.context,!1),Vh(n,s.containerInfo)}function Ym(n,s,a,c,d){return ho(),Rh(d),s.flags|=256,Ht(n,s,a,c),s.child}var Xh={dehydrated:null,treeContext:null,retryLane:0};function Jh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Xm(n,s,a){var c=s.pendingProps,d=nt.current,g=!1,E=(s.flags&128)!==0,A;if((A=E)||(A=n!==null&&n.memoizedState===null?!1:(d&2)!==0),A?(g=!0,s.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Qe(nt,d&1),n===null)return Ah(s),n=s.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((s.mode&1)===0?s.lanes=1:n.data==="$!"?s.lanes=8:s.lanes=1073741824,null):(E=c.children,n=c.fallback,g?(c=s.mode,g=s.child,E={mode:"hidden",children:E},(c&1)===0&&g!==null?(g.childLanes=0,g.pendingProps=E):g=Du(E,c,0,null),n=ds(n,c,a,null),g.return=s,n.return=s,g.sibling=n,s.child=g,s.child.memoizedState=Jh(a),s.memoizedState=Xh,n):Zh(s,E));if(d=n.memoizedState,d!==null&&(A=d.dehydrated,A!==null))return M0(n,s,E,c,A,d,a);if(g){g=c.fallback,E=s.mode,d=n.child,A=d.sibling;var P={mode:"hidden",children:c.children};return(E&1)===0&&s.child!==d?(c=s.child,c.childLanes=0,c.pendingProps=P,s.deletions=null):(c=yi(d,P),c.subtreeFlags=d.subtreeFlags&14680064),A!==null?g=yi(A,g):(g=ds(g,E,a,null),g.flags|=2),g.return=s,c.return=s,c.sibling=g,s.child=c,c=g,g=s.child,E=n.child.memoizedState,E=E===null?Jh(a):{baseLanes:E.baseLanes|a,cachePool:null,transitions:E.transitions},g.memoizedState=E,g.childLanes=n.childLanes&~a,s.memoizedState=Xh,c}return g=n.child,n=g.sibling,c=yi(g,{mode:"visible",children:c.children}),(s.mode&1)===0&&(c.lanes=a),c.return=s,c.sibling=null,n!==null&&(a=s.deletions,a===null?(s.deletions=[n],s.flags|=16):a.push(n)),s.child=c,s.memoizedState=null,c}function Zh(n,s){return s=Du({mode:"visible",children:s},n.mode,0,null),s.return=n,n.child=s}function vu(n,s,a,c){return c!==null&&Rh(c),fo(s,n.child,null,a),n=Zh(s,s.pendingProps.children),n.flags|=2,s.memoizedState=null,n}function M0(n,s,a,c,d,g,E){if(a)return s.flags&256?(s.flags&=-257,c=Gh(Error(t(422))),vu(n,s,E,c)):s.memoizedState!==null?(s.child=n.child,s.flags|=128,null):(g=c.fallback,d=s.mode,c=Du({mode:"visible",children:c.children},d,0,null),g=ds(g,d,E,null),g.flags|=2,c.return=s,g.return=s,c.sibling=g,s.child=c,(s.mode&1)!==0&&fo(s,n.child,null,E),s.child.memoizedState=Jh(E),s.memoizedState=Xh,g);if((s.mode&1)===0)return vu(n,s,E,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var A=c.dgst;return c=A,g=Error(t(419)),c=Gh(g,c,void 0),vu(n,s,E,c)}if(A=(E&n.childLanes)!==0,Yt||A){if(c=At,c!==null){switch(E&-E){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|E))!==0?0:d,d!==0&&d!==g.retryLane&&(g.retryLane=d,Nr(n,d),On(c,n,d,-1))}return md(),c=Gh(Error(t(421))),vu(n,s,E,c)}return d.data==="$?"?(s.flags|=128,s.child=n.child,s=K0.bind(null,n),d._reactRetry=s,null):(n=g.treeContext,hn=oi(d.nextSibling),cn=s,et=!0,Nn=null,n!==null&&(yn[_n++]=Pr,yn[_n++]=kr,yn[_n++]=rs,Pr=n.id,kr=n.overflow,rs=s),s=Zh(s,c.children),s.flags|=4096,s)}function Jm(n,s,a){n.lanes|=s;var c=n.alternate;c!==null&&(c.lanes|=s),Nh(n.return,s,a)}function ed(n,s,a,c,d){var g=n.memoizedState;g===null?n.memoizedState={isBackwards:s,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(g.isBackwards=s,g.rendering=null,g.renderingStartTime=0,g.last=c,g.tail=a,g.tailMode=d)}function Zm(n,s,a){var c=s.pendingProps,d=c.revealOrder,g=c.tail;if(Ht(n,s,c.children,a),c=nt.current,(c&2)!==0)c=c&1|2,s.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=s.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Jm(n,a,s);else if(n.tag===19)Jm(n,a,s);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===s)break e;for(;n.sibling===null;){if(n.return===null||n.return===s)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Qe(nt,c),(s.mode&1)===0)s.memoizedState=null;else switch(d){case"forwards":for(a=s.child,d=null;a!==null;)n=a.alternate,n!==null&&du(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=s.child,s.child=null):(d=a.sibling,a.sibling=null),ed(s,!1,d,a,g);break;case"backwards":for(a=null,d=s.child,s.child=null;d!==null;){if(n=d.alternate,n!==null&&du(n)===null){s.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}ed(s,!0,a,null,g);break;case"together":ed(s,!1,null,null,void 0);break;default:s.memoizedState=null}return s.child}function wu(n,s){(s.mode&1)===0&&n!==null&&(n.alternate=null,s.alternate=null,s.flags|=2)}function Dr(n,s,a){if(n!==null&&(s.dependencies=n.dependencies),ls|=s.lanes,(a&s.childLanes)===0)return null;if(n!==null&&s.child!==n.child)throw Error(t(153));if(s.child!==null){for(n=s.child,a=yi(n,n.pendingProps),s.child=a,a.return=s;n.sibling!==null;)n=n.sibling,a=a.sibling=yi(n,n.pendingProps),a.return=s;a.sibling=null}return s.child}function L0(n,s,a){switch(s.tag){case 3:Qm(s),ho();break;case 5:fm(s);break;case 1:Qt(s.type)&&nu(s);break;case 4:Vh(s,s.stateNode.containerInfo);break;case 10:var c=s.type._context,d=s.memoizedProps.value;Qe(lu,c._currentValue),c._currentValue=d;break;case 13:if(c=s.memoizedState,c!==null)return c.dehydrated!==null?(Qe(nt,nt.current&1),s.flags|=128,null):(a&s.child.childLanes)!==0?Xm(n,s,a):(Qe(nt,nt.current&1),n=Dr(n,s,a),n!==null?n.sibling:null);Qe(nt,nt.current&1);break;case 19:if(c=(a&s.childLanes)!==0,(n.flags&128)!==0){if(c)return Zm(n,s,a);s.flags|=128}if(d=s.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Qe(nt,nt.current),c)break;return null;case 22:case 23:return s.lanes=0,Wm(n,s,a)}return Dr(n,s,a)}var eg,td,tg,ng;eg=function(n,s){for(var a=s.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===s)break;for(;a.sibling===null;){if(a.return===null||a.return===s)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},td=function(){},tg=function(n,s,a,c){var d=n.memoizedProps;if(d!==c){n=s.stateNode,os(tr.current);var g=null;switch(a){case"input":d=Os(n,d),c=Os(n,c),g=[];break;case"select":d=se({},d,{value:void 0}),c=se({},c,{value:void 0}),g=[];break;case"textarea":d=Xo(n,d),c=Xo(n,c),g=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Zl)}Rn(a,c);var E;a=null;for(B in d)if(!c.hasOwnProperty(B)&&d.hasOwnProperty(B)&&d[B]!=null)if(B==="style"){var A=d[B];for(E in A)A.hasOwnProperty(E)&&(a||(a={}),a[E]="")}else B!=="dangerouslySetInnerHTML"&&B!=="children"&&B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&B!=="autoFocus"&&(o.hasOwnProperty(B)?g||(g=[]):(g=g||[]).push(B,null));for(B in c){var P=c[B];if(A=d!=null?d[B]:void 0,c.hasOwnProperty(B)&&P!==A&&(P!=null||A!=null))if(B==="style")if(A){for(E in A)!A.hasOwnProperty(E)||P&&P.hasOwnProperty(E)||(a||(a={}),a[E]="");for(E in P)P.hasOwnProperty(E)&&A[E]!==P[E]&&(a||(a={}),a[E]=P[E])}else a||(g||(g=[]),g.push(B,a)),a=P;else B==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,A=A?A.__html:void 0,P!=null&&A!==P&&(g=g||[]).push(B,P)):B==="children"?typeof P!="string"&&typeof P!="number"||(g=g||[]).push(B,""+P):B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&(o.hasOwnProperty(B)?(P!=null&&B==="onScroll"&&Je("scroll",n),g||A===P||(g=[])):(g=g||[]).push(B,P))}a&&(g=g||[]).push("style",a);var B=g;(s.updateQueue=B)&&(s.flags|=4)}},ng=function(n,s,a,c){a!==c&&(s.flags|=4)};function ba(n,s){if(!et)switch(n.tailMode){case"hidden":s=n.tail;for(var a=null;s!==null;)s.alternate!==null&&(a=s),s=s.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?s||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Ft(n){var s=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(s)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,s}function b0(n,s,a){var c=s.pendingProps;switch(Ih(s),s.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ft(s),null;case 1:return Qt(s.type)&&tu(),Ft(s),null;case 3:return c=s.stateNode,go(),Ze(Kt),Ze(Lt),Lh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(ou(s)?s.flags|=4:n===null||n.memoizedState.isDehydrated&&(s.flags&256)===0||(s.flags|=1024,Nn!==null&&(dd(Nn),Nn=null))),td(n,s),Ft(s),null;case 5:Oh(s);var d=os(Da.current);if(a=s.type,n!==null&&s.stateNode!=null)tg(n,s,a,c,d),n.ref!==s.ref&&(s.flags|=512,s.flags|=2097152);else{if(!c){if(s.stateNode===null)throw Error(t(166));return Ft(s),null}if(n=os(tr.current),ou(s)){c=s.stateNode,a=s.type;var g=s.memoizedProps;switch(c[er]=s,c[Ca]=g,n=(s.mode&1)!==0,a){case"dialog":Je("cancel",c),Je("close",c);break;case"iframe":case"object":case"embed":Je("load",c);break;case"video":case"audio":for(d=0;d<Sa.length;d++)Je(Sa[d],c);break;case"source":Je("error",c);break;case"img":case"image":case"link":Je("error",c),Je("load",c);break;case"details":Je("toggle",c);break;case"input":Sl(c,g),Je("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!g.multiple},Je("invalid",c);break;case"textarea":Jo(c,g),Je("invalid",c)}Rn(a,g),d=null;for(var E in g)if(g.hasOwnProperty(E)){var A=g[E];E==="children"?typeof A=="string"?c.textContent!==A&&(g.suppressHydrationWarning!==!0&&Jl(c.textContent,A,n),d=["children",A]):typeof A=="number"&&c.textContent!==""+A&&(g.suppressHydrationWarning!==!0&&Jl(c.textContent,A,n),d=["children",""+A]):o.hasOwnProperty(E)&&A!=null&&E==="onScroll"&&Je("scroll",c)}switch(a){case"input":Vs(c),Yo(c,g,!0);break;case"textarea":Vs(c),qr(c);break;case"select":case"option":break;default:typeof g.onClick=="function"&&(c.onclick=Zl)}c=d,s.updateQueue=c,c!==null&&(s.flags|=4)}else{E=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Zo(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=E.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=E.createElement(a,{is:c.is}):(n=E.createElement(a),a==="select"&&(E=n,c.multiple?E.multiple=!0:c.size&&(E.size=c.size))):n=E.createElementNS(n,a),n[er]=s,n[Ca]=c,eg(n,s,!1,!1),s.stateNode=n;e:{switch(E=Fs(a,c),a){case"dialog":Je("cancel",n),Je("close",n),d=c;break;case"iframe":case"object":case"embed":Je("load",n),d=c;break;case"video":case"audio":for(d=0;d<Sa.length;d++)Je(Sa[d],n);d=c;break;case"source":Je("error",n),d=c;break;case"img":case"image":case"link":Je("error",n),Je("load",n),d=c;break;case"details":Je("toggle",n),d=c;break;case"input":Sl(n,c),d=Os(n,c),Je("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=se({},c,{value:void 0}),Je("invalid",n);break;case"textarea":Jo(n,c),d=Xo(n,c),Je("invalid",n);break;default:d=c}Rn(a,d),A=d;for(g in A)if(A.hasOwnProperty(g)){var P=A[g];g==="style"?bs(n,P):g==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,P!=null&&Rl(n,P)):g==="children"?typeof P=="string"?(a!=="textarea"||P!=="")&&zi(n,P):typeof P=="number"&&zi(n,""+P):g!=="suppressContentEditableWarning"&&g!=="suppressHydrationWarning"&&g!=="autoFocus"&&(o.hasOwnProperty(g)?P!=null&&g==="onScroll"&&Je("scroll",n):P!=null&&Y(n,g,P,E))}switch(a){case"input":Vs(n),Yo(n,c,!1);break;case"textarea":Vs(n),qr(n);break;case"option":c.value!=null&&n.setAttribute("value",""+be(c.value));break;case"select":n.multiple=!!c.multiple,g=c.value,g!=null?An(n,!!c.multiple,g,!1):c.defaultValue!=null&&An(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=Zl)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(s.flags|=4)}s.ref!==null&&(s.flags|=512,s.flags|=2097152)}return Ft(s),null;case 6:if(n&&s.stateNode!=null)ng(n,s,n.memoizedProps,c);else{if(typeof c!="string"&&s.stateNode===null)throw Error(t(166));if(a=os(Da.current),os(tr.current),ou(s)){if(c=s.stateNode,a=s.memoizedProps,c[er]=s,(g=c.nodeValue!==a)&&(n=cn,n!==null))switch(n.tag){case 3:Jl(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Jl(c.nodeValue,a,(n.mode&1)!==0)}g&&(s.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[er]=s,s.stateNode=c}return Ft(s),null;case 13:if(Ze(nt),c=s.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(et&&hn!==null&&(s.mode&1)!==0&&(s.flags&128)===0)sm(),ho(),s.flags|=98560,g=!1;else if(g=ou(s),c!==null&&c.dehydrated!==null){if(n===null){if(!g)throw Error(t(318));if(g=s.memoizedState,g=g!==null?g.dehydrated:null,!g)throw Error(t(317));g[er]=s}else ho(),(s.flags&128)===0&&(s.memoizedState=null),s.flags|=4;Ft(s),g=!1}else Nn!==null&&(dd(Nn),Nn=null),g=!0;if(!g)return s.flags&65536?s:null}return(s.flags&128)!==0?(s.lanes=a,s):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(s.child.flags|=8192,(s.mode&1)!==0&&(n===null||(nt.current&1)!==0?Et===0&&(Et=3):md())),s.updateQueue!==null&&(s.flags|=4),Ft(s),null);case 4:return go(),td(n,s),n===null&&Aa(s.stateNode.containerInfo),Ft(s),null;case 10:return kh(s.type._context),Ft(s),null;case 17:return Qt(s.type)&&tu(),Ft(s),null;case 19:if(Ze(nt),g=s.memoizedState,g===null)return Ft(s),null;if(c=(s.flags&128)!==0,E=g.rendering,E===null)if(c)ba(g,!1);else{if(Et!==0||n!==null&&(n.flags&128)!==0)for(n=s.child;n!==null;){if(E=du(n),E!==null){for(s.flags|=128,ba(g,!1),c=E.updateQueue,c!==null&&(s.updateQueue=c,s.flags|=4),s.subtreeFlags=0,c=a,a=s.child;a!==null;)g=a,n=c,g.flags&=14680066,E=g.alternate,E===null?(g.childLanes=0,g.lanes=n,g.child=null,g.subtreeFlags=0,g.memoizedProps=null,g.memoizedState=null,g.updateQueue=null,g.dependencies=null,g.stateNode=null):(g.childLanes=E.childLanes,g.lanes=E.lanes,g.child=E.child,g.subtreeFlags=0,g.deletions=null,g.memoizedProps=E.memoizedProps,g.memoizedState=E.memoizedState,g.updateQueue=E.updateQueue,g.type=E.type,n=E.dependencies,g.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Qe(nt,nt.current&1|2),s.child}n=n.sibling}g.tail!==null&&Xe()>wo&&(s.flags|=128,c=!0,ba(g,!1),s.lanes=4194304)}else{if(!c)if(n=du(E),n!==null){if(s.flags|=128,c=!0,a=n.updateQueue,a!==null&&(s.updateQueue=a,s.flags|=4),ba(g,!0),g.tail===null&&g.tailMode==="hidden"&&!E.alternate&&!et)return Ft(s),null}else 2*Xe()-g.renderingStartTime>wo&&a!==1073741824&&(s.flags|=128,c=!0,ba(g,!1),s.lanes=4194304);g.isBackwards?(E.sibling=s.child,s.child=E):(a=g.last,a!==null?a.sibling=E:s.child=E,g.last=E)}return g.tail!==null?(s=g.tail,g.rendering=s,g.tail=s.sibling,g.renderingStartTime=Xe(),s.sibling=null,a=nt.current,Qe(nt,c?a&1|2:a&1),s):(Ft(s),null);case 22:case 23:return pd(),c=s.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(s.flags|=8192),c&&(s.mode&1)!==0?(dn&1073741824)!==0&&(Ft(s),s.subtreeFlags&6&&(s.flags|=8192)):Ft(s),null;case 24:return null;case 25:return null}throw Error(t(156,s.tag))}function F0(n,s){switch(Ih(s),s.tag){case 1:return Qt(s.type)&&tu(),n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 3:return go(),Ze(Kt),Ze(Lt),Lh(),n=s.flags,(n&65536)!==0&&(n&128)===0?(s.flags=n&-65537|128,s):null;case 5:return Oh(s),null;case 13:if(Ze(nt),n=s.memoizedState,n!==null&&n.dehydrated!==null){if(s.alternate===null)throw Error(t(340));ho()}return n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 19:return Ze(nt),null;case 4:return go(),null;case 10:return kh(s.type._context),null;case 22:case 23:return pd(),null;case 24:return null;default:return null}}var Eu=!1,Ut=!1,U0=typeof WeakSet=="function"?WeakSet:Set,ue=null;function _o(n,s){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){st(n,s,c)}else a.current=null}function nd(n,s,a){try{a()}catch(c){st(n,s,c)}}var rg=!1;function j0(n,s){if(ph=Ir,n=Mp(),oh(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,g=c.focusNode;c=c.focusOffset;try{a.nodeType,g.nodeType}catch{a=null;break e}var E=0,A=-1,P=-1,B=0,Q=0,X=n,K=null;t:for(;;){for(var oe;X!==a||d!==0&&X.nodeType!==3||(A=E+d),X!==g||c!==0&&X.nodeType!==3||(P=E+c),X.nodeType===3&&(E+=X.nodeValue.length),(oe=X.firstChild)!==null;)K=X,X=oe;for(;;){if(X===n)break t;if(K===a&&++B===d&&(A=E),K===g&&++Q===c&&(P=E),(oe=X.nextSibling)!==null)break;X=K,K=X.parentNode}X=oe}a=A===-1||P===-1?null:{start:A,end:P}}else a=null}a=a||{start:0,end:0}}else a=null;for(mh={focusedElem:n,selectionRange:a},Ir=!1,ue=s;ue!==null;)if(s=ue,n=s.child,(s.subtreeFlags&1028)!==0&&n!==null)n.return=s,ue=n;else for(;ue!==null;){s=ue;try{var ce=s.alternate;if((s.flags&1024)!==0)switch(s.tag){case 0:case 11:case 15:break;case 1:if(ce!==null){var he=ce.memoizedProps,ut=ce.memoizedState,F=s.stateNode,V=F.getSnapshotBeforeUpdate(s.elementType===s.type?he:xn(s.type,he),ut);F.__reactInternalSnapshotBeforeUpdate=V}break;case 3:var j=s.stateNode.containerInfo;j.nodeType===1?j.textContent="":j.nodeType===9&&j.documentElement&&j.removeChild(j.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(J){st(s,s.return,J)}if(n=s.sibling,n!==null){n.return=s.return,ue=n;break}ue=s.return}return ce=rg,rg=!1,ce}function Fa(n,s,a){var c=s.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var g=d.destroy;d.destroy=void 0,g!==void 0&&nd(s,a,g)}d=d.next}while(d!==c)}}function Tu(n,s){if(s=s.updateQueue,s=s!==null?s.lastEffect:null,s!==null){var a=s=s.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==s)}}function rd(n){var s=n.ref;if(s!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof s=="function"?s(n):s.current=n}}function ig(n){var s=n.alternate;s!==null&&(n.alternate=null,ig(s)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(s=n.stateNode,s!==null&&(delete s[er],delete s[Ca],delete s[vh],delete s[T0],delete s[I0])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function sg(n){return n.tag===5||n.tag===3||n.tag===4}function og(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||sg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function id(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.nodeType===8?a.parentNode.insertBefore(n,s):a.insertBefore(n,s):(a.nodeType===8?(s=a.parentNode,s.insertBefore(n,a)):(s=a,s.appendChild(n)),a=a._reactRootContainer,a!=null||s.onclick!==null||(s.onclick=Zl));else if(c!==4&&(n=n.child,n!==null))for(id(n,s,a),n=n.sibling;n!==null;)id(n,s,a),n=n.sibling}function sd(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.insertBefore(n,s):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(sd(n,s,a),n=n.sibling;n!==null;)sd(n,s,a),n=n.sibling}var Nt=null,Dn=!1;function di(n,s,a){for(a=a.child;a!==null;)ag(n,s,a),a=a.sibling}function ag(n,s,a){if(rn&&typeof rn.onCommitFiberUnmount=="function")try{rn.onCommitFiberUnmount(Wi,a)}catch{}switch(a.tag){case 5:Ut||_o(a,s);case 6:var c=Nt,d=Dn;Nt=null,di(n,s,a),Nt=c,Dn=d,Nt!==null&&(Dn?(n=Nt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Nt.removeChild(a.stateNode));break;case 18:Nt!==null&&(Dn?(n=Nt,a=a.stateNode,n.nodeType===8?_h(n.parentNode,a):n.nodeType===1&&_h(n,a),ni(n)):_h(Nt,a.stateNode));break;case 4:c=Nt,d=Dn,Nt=a.stateNode.containerInfo,Dn=!0,di(n,s,a),Nt=c,Dn=d;break;case 0:case 11:case 14:case 15:if(!Ut&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var g=d,E=g.destroy;g=g.tag,E!==void 0&&((g&2)!==0||(g&4)!==0)&&nd(a,s,E),d=d.next}while(d!==c)}di(n,s,a);break;case 1:if(!Ut&&(_o(a,s),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(A){st(a,s,A)}di(n,s,a);break;case 21:di(n,s,a);break;case 22:a.mode&1?(Ut=(c=Ut)||a.memoizedState!==null,di(n,s,a),Ut=c):di(n,s,a);break;default:di(n,s,a)}}function lg(n){var s=n.updateQueue;if(s!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new U0),s.forEach(function(c){var d=Q0.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Vn(n,s){var a=s.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var g=n,E=s,A=E;e:for(;A!==null;){switch(A.tag){case 5:Nt=A.stateNode,Dn=!1;break e;case 3:Nt=A.stateNode.containerInfo,Dn=!0;break e;case 4:Nt=A.stateNode.containerInfo,Dn=!0;break e}A=A.return}if(Nt===null)throw Error(t(160));ag(g,E,d),Nt=null,Dn=!1;var P=d.alternate;P!==null&&(P.return=null),d.return=null}catch(B){st(d,s,B)}}if(s.subtreeFlags&12854)for(s=s.child;s!==null;)ug(s,n),s=s.sibling}function ug(n,s){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Vn(s,n),rr(n),c&4){try{Fa(3,n,n.return),Tu(3,n)}catch(he){st(n,n.return,he)}try{Fa(5,n,n.return)}catch(he){st(n,n.return,he)}}break;case 1:Vn(s,n),rr(n),c&512&&a!==null&&_o(a,a.return);break;case 5:if(Vn(s,n),rr(n),c&512&&a!==null&&_o(a,a.return),n.flags&32){var d=n.stateNode;try{zi(d,"")}catch(he){st(n,n.return,he)}}if(c&4&&(d=n.stateNode,d!=null)){var g=n.memoizedProps,E=a!==null?a.memoizedProps:g,A=n.type,P=n.updateQueue;if(n.updateQueue=null,P!==null)try{A==="input"&&g.type==="radio"&&g.name!=null&&Ms(d,g),Fs(A,E);var B=Fs(A,g);for(E=0;E<P.length;E+=2){var Q=P[E],X=P[E+1];Q==="style"?bs(d,X):Q==="dangerouslySetInnerHTML"?Rl(d,X):Q==="children"?zi(d,X):Y(d,Q,X,B)}switch(A){case"input":ji(d,g);break;case"textarea":Al(d,g);break;case"select":var K=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!g.multiple;var oe=g.value;oe!=null?An(d,!!g.multiple,oe,!1):K!==!!g.multiple&&(g.defaultValue!=null?An(d,!!g.multiple,g.defaultValue,!0):An(d,!!g.multiple,g.multiple?[]:"",!1))}d[Ca]=g}catch(he){st(n,n.return,he)}}break;case 6:if(Vn(s,n),rr(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,g=n.memoizedProps;try{d.nodeValue=g}catch(he){st(n,n.return,he)}}break;case 3:if(Vn(s,n),rr(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{ni(s.containerInfo)}catch(he){st(n,n.return,he)}break;case 4:Vn(s,n),rr(n);break;case 13:Vn(s,n),rr(n),d=n.child,d.flags&8192&&(g=d.memoizedState!==null,d.stateNode.isHidden=g,!g||d.alternate!==null&&d.alternate.memoizedState!==null||(ld=Xe())),c&4&&lg(n);break;case 22:if(Q=a!==null&&a.memoizedState!==null,n.mode&1?(Ut=(B=Ut)||Q,Vn(s,n),Ut=B):Vn(s,n),rr(n),c&8192){if(B=n.memoizedState!==null,(n.stateNode.isHidden=B)&&!Q&&(n.mode&1)!==0)for(ue=n,Q=n.child;Q!==null;){for(X=ue=Q;ue!==null;){switch(K=ue,oe=K.child,K.tag){case 0:case 11:case 14:case 15:Fa(4,K,K.return);break;case 1:_o(K,K.return);var ce=K.stateNode;if(typeof ce.componentWillUnmount=="function"){c=K,a=K.return;try{s=c,ce.props=s.memoizedProps,ce.state=s.memoizedState,ce.componentWillUnmount()}catch(he){st(c,a,he)}}break;case 5:_o(K,K.return);break;case 22:if(K.memoizedState!==null){dg(X);continue}}oe!==null?(oe.return=K,ue=oe):dg(X)}Q=Q.sibling}e:for(Q=null,X=n;;){if(X.tag===5){if(Q===null){Q=X;try{d=X.stateNode,B?(g=d.style,typeof g.setProperty=="function"?g.setProperty("display","none","important"):g.display="none"):(A=X.stateNode,P=X.memoizedProps.style,E=P!=null&&P.hasOwnProperty("display")?P.display:null,A.style.display=Gr("display",E))}catch(he){st(n,n.return,he)}}}else if(X.tag===6){if(Q===null)try{X.stateNode.nodeValue=B?"":X.memoizedProps}catch(he){st(n,n.return,he)}}else if((X.tag!==22&&X.tag!==23||X.memoizedState===null||X===n)&&X.child!==null){X.child.return=X,X=X.child;continue}if(X===n)break e;for(;X.sibling===null;){if(X.return===null||X.return===n)break e;Q===X&&(Q=null),X=X.return}Q===X&&(Q=null),X.sibling.return=X.return,X=X.sibling}}break;case 19:Vn(s,n),rr(n),c&4&&lg(n);break;case 21:break;default:Vn(s,n),rr(n)}}function rr(n){var s=n.flags;if(s&2){try{e:{for(var a=n.return;a!==null;){if(sg(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(zi(d,""),c.flags&=-33);var g=og(n);sd(n,g,d);break;case 3:case 4:var E=c.stateNode.containerInfo,A=og(n);id(n,A,E);break;default:throw Error(t(161))}}catch(P){st(n,n.return,P)}n.flags&=-3}s&4096&&(n.flags&=-4097)}function z0(n,s,a){ue=n,cg(n)}function cg(n,s,a){for(var c=(n.mode&1)!==0;ue!==null;){var d=ue,g=d.child;if(d.tag===22&&c){var E=d.memoizedState!==null||Eu;if(!E){var A=d.alternate,P=A!==null&&A.memoizedState!==null||Ut;A=Eu;var B=Ut;if(Eu=E,(Ut=P)&&!B)for(ue=d;ue!==null;)E=ue,P=E.child,E.tag===22&&E.memoizedState!==null?fg(d):P!==null?(P.return=E,ue=P):fg(d);for(;g!==null;)ue=g,cg(g),g=g.sibling;ue=d,Eu=A,Ut=B}hg(n)}else(d.subtreeFlags&8772)!==0&&g!==null?(g.return=d,ue=g):hg(n)}}function hg(n){for(;ue!==null;){var s=ue;if((s.flags&8772)!==0){var a=s.alternate;try{if((s.flags&8772)!==0)switch(s.tag){case 0:case 11:case 15:Ut||Tu(5,s);break;case 1:var c=s.stateNode;if(s.flags&4&&!Ut)if(a===null)c.componentDidMount();else{var d=s.elementType===s.type?a.memoizedProps:xn(s.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var g=s.updateQueue;g!==null&&dm(s,g,c);break;case 3:var E=s.updateQueue;if(E!==null){if(a=null,s.child!==null)switch(s.child.tag){case 5:a=s.child.stateNode;break;case 1:a=s.child.stateNode}dm(s,E,a)}break;case 5:var A=s.stateNode;if(a===null&&s.flags&4){a=A;var P=s.memoizedProps;switch(s.type){case"button":case"input":case"select":case"textarea":P.autoFocus&&a.focus();break;case"img":P.src&&(a.src=P.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(s.memoizedState===null){var B=s.alternate;if(B!==null){var Q=B.memoizedState;if(Q!==null){var X=Q.dehydrated;X!==null&&ni(X)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Ut||s.flags&512&&rd(s)}catch(K){st(s,s.return,K)}}if(s===n){ue=null;break}if(a=s.sibling,a!==null){a.return=s.return,ue=a;break}ue=s.return}}function dg(n){for(;ue!==null;){var s=ue;if(s===n){ue=null;break}var a=s.sibling;if(a!==null){a.return=s.return,ue=a;break}ue=s.return}}function fg(n){for(;ue!==null;){var s=ue;try{switch(s.tag){case 0:case 11:case 15:var a=s.return;try{Tu(4,s)}catch(P){st(s,a,P)}break;case 1:var c=s.stateNode;if(typeof c.componentDidMount=="function"){var d=s.return;try{c.componentDidMount()}catch(P){st(s,d,P)}}var g=s.return;try{rd(s)}catch(P){st(s,g,P)}break;case 5:var E=s.return;try{rd(s)}catch(P){st(s,E,P)}}}catch(P){st(s,s.return,P)}if(s===n){ue=null;break}var A=s.sibling;if(A!==null){A.return=s.return,ue=A;break}ue=s.return}}var B0=Math.ceil,Iu=ie.ReactCurrentDispatcher,od=ie.ReactCurrentOwner,En=ie.ReactCurrentBatchConfig,Fe=0,At=null,pt=null,xt=0,dn=0,vo=ai(0),Et=0,Ua=null,ls=0,Su=0,ad=0,ja=null,Xt=null,ld=0,wo=1/0,Vr=null,Au=!1,ud=null,fi=null,Ru=!1,pi=null,Cu=0,za=0,cd=null,Pu=-1,ku=0;function Wt(){return(Fe&6)!==0?Xe():Pu!==-1?Pu:Pu=Xe()}function mi(n){return(n.mode&1)===0?1:(Fe&2)!==0&&xt!==0?xt&-xt:A0.transition!==null?(ku===0&&(ku=la()),ku):(n=Oe,n!==0||(n=window.event,n=n===void 0?16:Ks(n.type)),n)}function On(n,s,a,c){if(50<za)throw za=0,cd=null,Error(t(185));Yi(n,a,c),((Fe&2)===0||n!==At)&&(n===At&&((Fe&2)===0&&(Su|=a),Et===4&&gi(n,xt)),Jt(n,c),a===1&&Fe===0&&(s.mode&1)===0&&(wo=Xe()+500,ru&&ui()))}function Jt(n,s){var a=n.callbackNode;Qi(n,s);var c=wr(n,n===At?xt:0);if(c===0)a!==null&&zs(a),n.callbackNode=null,n.callbackPriority=0;else if(s=c&-c,n.callbackPriority!==s){if(a!=null&&zs(a),s===1)n.tag===0?S0(mg.bind(null,n)):em(mg.bind(null,n)),w0(function(){(Fe&6)===0&&ui()}),a=null;else{switch(qn(c)){case 1:a=Bs;break;case 4:a=sa;break;case 16:a=Hi;break;case 536870912:a=$s;break;default:a=Hi}a=Ig(a,pg.bind(null,n))}n.callbackPriority=s,n.callbackNode=a}}function pg(n,s){if(Pu=-1,ku=0,(Fe&6)!==0)throw Error(t(327));var a=n.callbackNode;if(Eo()&&n.callbackNode!==a)return null;var c=wr(n,n===At?xt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||s)s=Nu(n,c);else{s=c;var d=Fe;Fe|=2;var g=yg();(At!==n||xt!==s)&&(Vr=null,wo=Xe()+500,cs(n,s));do try{H0();break}catch(A){gg(n,A)}while(!0);Ph(),Iu.current=g,Fe=d,pt!==null?s=0:(At=null,xt=0,s=Et)}if(s!==0){if(s===2&&(d=aa(n),d!==0&&(c=d,s=hd(n,d))),s===1)throw a=Ua,cs(n,0),gi(n,c),Jt(n,Xe()),a;if(s===6)gi(n,c);else{if(d=n.current.alternate,(c&30)===0&&!$0(d)&&(s=Nu(n,c),s===2&&(g=aa(n),g!==0&&(c=g,s=hd(n,g))),s===1))throw a=Ua,cs(n,0),gi(n,c),Jt(n,Xe()),a;switch(n.finishedWork=d,n.finishedLanes=c,s){case 0:case 1:throw Error(t(345));case 2:hs(n,Xt,Vr);break;case 3:if(gi(n,c),(c&130023424)===c&&(s=ld+500-Xe(),10<s)){if(wr(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Wt(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=yh(hs.bind(null,n,Xt,Vr),s);break}hs(n,Xt,Vr);break;case 4:if(gi(n,c),(c&4194240)===c)break;for(s=n.eventTimes,d=-1;0<c;){var E=31-sn(c);g=1<<E,E=s[E],E>d&&(d=E),c&=~g}if(c=d,c=Xe()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*B0(c/1960))-c,10<c){n.timeoutHandle=yh(hs.bind(null,n,Xt,Vr),c);break}hs(n,Xt,Vr);break;case 5:hs(n,Xt,Vr);break;default:throw Error(t(329))}}}return Jt(n,Xe()),n.callbackNode===a?pg.bind(null,n):null}function hd(n,s){var a=ja;return n.current.memoizedState.isDehydrated&&(cs(n,s).flags|=256),n=Nu(n,s),n!==2&&(s=Xt,Xt=a,s!==null&&dd(s)),n}function dd(n){Xt===null?Xt=n:Xt.push.apply(Xt,n)}function $0(n){for(var s=n;;){if(s.flags&16384){var a=s.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],g=d.getSnapshot;d=d.value;try{if(!kn(g(),d))return!1}catch{return!1}}}if(a=s.child,s.subtreeFlags&16384&&a!==null)a.return=s,s=a;else{if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return!0;s=s.return}s.sibling.return=s.return,s=s.sibling}}return!0}function gi(n,s){for(s&=~ad,s&=~Su,n.suspendedLanes|=s,n.pingedLanes&=~s,n=n.expirationTimes;0<s;){var a=31-sn(s),c=1<<a;n[a]=-1,s&=~c}}function mg(n){if((Fe&6)!==0)throw Error(t(327));Eo();var s=wr(n,0);if((s&1)===0)return Jt(n,Xe()),null;var a=Nu(n,s);if(n.tag!==0&&a===2){var c=aa(n);c!==0&&(s=c,a=hd(n,c))}if(a===1)throw a=Ua,cs(n,0),gi(n,s),Jt(n,Xe()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=s,hs(n,Xt,Vr),Jt(n,Xe()),null}function fd(n,s){var a=Fe;Fe|=1;try{return n(s)}finally{Fe=a,Fe===0&&(wo=Xe()+500,ru&&ui())}}function us(n){pi!==null&&pi.tag===0&&(Fe&6)===0&&Eo();var s=Fe;Fe|=1;var a=En.transition,c=Oe;try{if(En.transition=null,Oe=1,n)return n()}finally{Oe=c,En.transition=a,Fe=s,(Fe&6)===0&&ui()}}function pd(){dn=vo.current,Ze(vo)}function cs(n,s){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,v0(a)),pt!==null)for(a=pt.return;a!==null;){var c=a;switch(Ih(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&tu();break;case 3:go(),Ze(Kt),Ze(Lt),Lh();break;case 5:Oh(c);break;case 4:go();break;case 13:Ze(nt);break;case 19:Ze(nt);break;case 10:kh(c.type._context);break;case 22:case 23:pd()}a=a.return}if(At=n,pt=n=yi(n.current,null),xt=dn=s,Et=0,Ua=null,ad=Su=ls=0,Xt=ja=null,ss!==null){for(s=0;s<ss.length;s++)if(a=ss[s],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,g=a.pending;if(g!==null){var E=g.next;g.next=d,c.next=E}a.pending=c}ss=null}return n}function gg(n,s){do{var a=pt;try{if(Ph(),fu.current=yu,pu){for(var c=rt.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}pu=!1}if(as=0,St=wt=rt=null,Va=!1,Oa=0,od.current=null,a===null||a.return===null){Et=1,Ua=s,pt=null;break}e:{var g=n,E=a.return,A=a,P=s;if(s=xt,A.flags|=32768,P!==null&&typeof P=="object"&&typeof P.then=="function"){var B=P,Q=A,X=Q.tag;if((Q.mode&1)===0&&(X===0||X===11||X===15)){var K=Q.alternate;K?(Q.updateQueue=K.updateQueue,Q.memoizedState=K.memoizedState,Q.lanes=K.lanes):(Q.updateQueue=null,Q.memoizedState=null)}var oe=zm(E);if(oe!==null){oe.flags&=-257,Bm(oe,E,A,g,s),oe.mode&1&&jm(g,B,s),s=oe,P=B;var ce=s.updateQueue;if(ce===null){var he=new Set;he.add(P),s.updateQueue=he}else ce.add(P);break e}else{if((s&1)===0){jm(g,B,s),md();break e}P=Error(t(426))}}else if(et&&A.mode&1){var ut=zm(E);if(ut!==null){(ut.flags&65536)===0&&(ut.flags|=256),Bm(ut,E,A,g,s),Rh(yo(P,A));break e}}g=P=yo(P,A),Et!==4&&(Et=2),ja===null?ja=[g]:ja.push(g),g=E;do{switch(g.tag){case 3:g.flags|=65536,s&=-s,g.lanes|=s;var F=Fm(g,P,s);hm(g,F);break e;case 1:A=P;var V=g.type,j=g.stateNode;if((g.flags&128)===0&&(typeof V.getDerivedStateFromError=="function"||j!==null&&typeof j.componentDidCatch=="function"&&(fi===null||!fi.has(j)))){g.flags|=65536,s&=-s,g.lanes|=s;var J=Um(g,A,s);hm(g,J);break e}}g=g.return}while(g!==null)}vg(a)}catch(de){s=de,pt===a&&a!==null&&(pt=a=a.return);continue}break}while(!0)}function yg(){var n=Iu.current;return Iu.current=yu,n===null?yu:n}function md(){(Et===0||Et===3||Et===2)&&(Et=4),At===null||(ls&268435455)===0&&(Su&268435455)===0||gi(At,xt)}function Nu(n,s){var a=Fe;Fe|=2;var c=yg();(At!==n||xt!==s)&&(Vr=null,cs(n,s));do try{q0();break}catch(d){gg(n,d)}while(!0);if(Ph(),Fe=a,Iu.current=c,pt!==null)throw Error(t(261));return At=null,xt=0,Et}function q0(){for(;pt!==null;)_g(pt)}function H0(){for(;pt!==null&&!qi();)_g(pt)}function _g(n){var s=Tg(n.alternate,n,dn);n.memoizedProps=n.pendingProps,s===null?vg(n):pt=s,od.current=null}function vg(n){var s=n;do{var a=s.alternate;if(n=s.return,(s.flags&32768)===0){if(a=b0(a,s,dn),a!==null){pt=a;return}}else{if(a=F0(a,s),a!==null){a.flags&=32767,pt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Et=6,pt=null;return}}if(s=s.sibling,s!==null){pt=s;return}pt=s=n}while(s!==null);Et===0&&(Et=5)}function hs(n,s,a){var c=Oe,d=En.transition;try{En.transition=null,Oe=1,W0(n,s,a,c)}finally{En.transition=d,Oe=c}return null}function W0(n,s,a,c){do Eo();while(pi!==null);if((Fe&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var g=a.lanes|a.childLanes;if(th(n,g),n===At&&(pt=At=null,xt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Ru||(Ru=!0,Ig(Hi,function(){return Eo(),null})),g=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||g){g=En.transition,En.transition=null;var E=Oe;Oe=1;var A=Fe;Fe|=4,od.current=null,j0(n,a),ug(a,n),d0(mh),Ir=!!ph,mh=ph=null,n.current=a,z0(a),vr(),Fe=A,Oe=E,En.transition=g}else n.current=a;if(Ru&&(Ru=!1,pi=n,Cu=d),g=n.pendingLanes,g===0&&(fi=null),bl(a.stateNode),Jt(n,Xe()),s!==null)for(c=n.onRecoverableError,a=0;a<s.length;a++)d=s[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(Au)throw Au=!1,n=ud,ud=null,n;return(Cu&1)!==0&&n.tag!==0&&Eo(),g=n.pendingLanes,(g&1)!==0?n===cd?za++:(za=0,cd=n):za=0,ui(),null}function Eo(){if(pi!==null){var n=qn(Cu),s=En.transition,a=Oe;try{if(En.transition=null,Oe=16>n?16:n,pi===null)var c=!1;else{if(n=pi,pi=null,Cu=0,(Fe&6)!==0)throw Error(t(331));var d=Fe;for(Fe|=4,ue=n.current;ue!==null;){var g=ue,E=g.child;if((ue.flags&16)!==0){var A=g.deletions;if(A!==null){for(var P=0;P<A.length;P++){var B=A[P];for(ue=B;ue!==null;){var Q=ue;switch(Q.tag){case 0:case 11:case 15:Fa(8,Q,g)}var X=Q.child;if(X!==null)X.return=Q,ue=X;else for(;ue!==null;){Q=ue;var K=Q.sibling,oe=Q.return;if(ig(Q),Q===B){ue=null;break}if(K!==null){K.return=oe,ue=K;break}ue=oe}}}var ce=g.alternate;if(ce!==null){var he=ce.child;if(he!==null){ce.child=null;do{var ut=he.sibling;he.sibling=null,he=ut}while(he!==null)}}ue=g}}if((g.subtreeFlags&2064)!==0&&E!==null)E.return=g,ue=E;else e:for(;ue!==null;){if(g=ue,(g.flags&2048)!==0)switch(g.tag){case 0:case 11:case 15:Fa(9,g,g.return)}var F=g.sibling;if(F!==null){F.return=g.return,ue=F;break e}ue=g.return}}var V=n.current;for(ue=V;ue!==null;){E=ue;var j=E.child;if((E.subtreeFlags&2064)!==0&&j!==null)j.return=E,ue=j;else e:for(E=V;ue!==null;){if(A=ue,(A.flags&2048)!==0)try{switch(A.tag){case 0:case 11:case 15:Tu(9,A)}}catch(de){st(A,A.return,de)}if(A===E){ue=null;break e}var J=A.sibling;if(J!==null){J.return=A.return,ue=J;break e}ue=A.return}}if(Fe=d,ui(),rn&&typeof rn.onPostCommitFiberRoot=="function")try{rn.onPostCommitFiberRoot(Wi,n)}catch{}c=!0}return c}finally{Oe=a,En.transition=s}}return!1}function wg(n,s,a){s=yo(a,s),s=Fm(n,s,1),n=hi(n,s,1),s=Wt(),n!==null&&(Yi(n,1,s),Jt(n,s))}function st(n,s,a){if(n.tag===3)wg(n,n,a);else for(;s!==null;){if(s.tag===3){wg(s,n,a);break}else if(s.tag===1){var c=s.stateNode;if(typeof s.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(fi===null||!fi.has(c))){n=yo(a,n),n=Um(s,n,1),s=hi(s,n,1),n=Wt(),s!==null&&(Yi(s,1,n),Jt(s,n));break}}s=s.return}}function G0(n,s,a){var c=n.pingCache;c!==null&&c.delete(s),s=Wt(),n.pingedLanes|=n.suspendedLanes&a,At===n&&(xt&a)===a&&(Et===4||Et===3&&(xt&130023424)===xt&&500>Xe()-ld?cs(n,0):ad|=a),Jt(n,s)}function Eg(n,s){s===0&&((n.mode&1)===0?s=1:(s=Zr,Zr<<=1,(Zr&130023424)===0&&(Zr=4194304)));var a=Wt();n=Nr(n,s),n!==null&&(Yi(n,s,a),Jt(n,a))}function K0(n){var s=n.memoizedState,a=0;s!==null&&(a=s.retryLane),Eg(n,a)}function Q0(n,s){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(s),Eg(n,a)}var Tg;Tg=function(n,s,a){if(n!==null)if(n.memoizedProps!==s.pendingProps||Kt.current)Yt=!0;else{if((n.lanes&a)===0&&(s.flags&128)===0)return Yt=!1,L0(n,s,a);Yt=(n.flags&131072)!==0}else Yt=!1,et&&(s.flags&1048576)!==0&&tm(s,su,s.index);switch(s.lanes=0,s.tag){case 2:var c=s.type;wu(n,s),n=s.pendingProps;var d=lo(s,Lt.current);mo(s,a),d=Uh(null,s,c,n,d,a);var g=jh();return s.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(s.tag=1,s.memoizedState=null,s.updateQueue=null,Qt(c)?(g=!0,nu(s)):g=!1,s.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Dh(s),d.updater=_u,s.stateNode=d,d._reactInternals=s,Wh(s,c,n,a),s=Yh(null,s,c,!0,g,a)):(s.tag=0,et&&g&&Th(s),Ht(null,s,d,a),s=s.child),s;case 16:c=s.elementType;e:{switch(wu(n,s),n=s.pendingProps,d=c._init,c=d(c._payload),s.type=c,d=s.tag=X0(c),n=xn(c,n),d){case 0:s=Qh(null,s,c,n,a);break e;case 1:s=Km(null,s,c,n,a);break e;case 11:s=$m(null,s,c,n,a);break e;case 14:s=qm(null,s,c,xn(c.type,n),a);break e}throw Error(t(306,c,""))}return s;case 0:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:xn(c,d),Qh(n,s,c,d,a);case 1:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:xn(c,d),Km(n,s,c,d,a);case 3:e:{if(Qm(s),n===null)throw Error(t(387));c=s.pendingProps,g=s.memoizedState,d=g.element,cm(n,s),hu(s,c,null,a);var E=s.memoizedState;if(c=E.element,g.isDehydrated)if(g={element:c,isDehydrated:!1,cache:E.cache,pendingSuspenseBoundaries:E.pendingSuspenseBoundaries,transitions:E.transitions},s.updateQueue.baseState=g,s.memoizedState=g,s.flags&256){d=yo(Error(t(423)),s),s=Ym(n,s,c,a,d);break e}else if(c!==d){d=yo(Error(t(424)),s),s=Ym(n,s,c,a,d);break e}else for(hn=oi(s.stateNode.containerInfo.firstChild),cn=s,et=!0,Nn=null,a=lm(s,null,c,a),s.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(ho(),c===d){s=Dr(n,s,a);break e}Ht(n,s,c,a)}s=s.child}return s;case 5:return fm(s),n===null&&Ah(s),c=s.type,d=s.pendingProps,g=n!==null?n.memoizedProps:null,E=d.children,gh(c,d)?E=null:g!==null&&gh(c,g)&&(s.flags|=32),Gm(n,s),Ht(n,s,E,a),s.child;case 6:return n===null&&Ah(s),null;case 13:return Xm(n,s,a);case 4:return Vh(s,s.stateNode.containerInfo),c=s.pendingProps,n===null?s.child=fo(s,null,c,a):Ht(n,s,c,a),s.child;case 11:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:xn(c,d),$m(n,s,c,d,a);case 7:return Ht(n,s,s.pendingProps,a),s.child;case 8:return Ht(n,s,s.pendingProps.children,a),s.child;case 12:return Ht(n,s,s.pendingProps.children,a),s.child;case 10:e:{if(c=s.type._context,d=s.pendingProps,g=s.memoizedProps,E=d.value,Qe(lu,c._currentValue),c._currentValue=E,g!==null)if(kn(g.value,E)){if(g.children===d.children&&!Kt.current){s=Dr(n,s,a);break e}}else for(g=s.child,g!==null&&(g.return=s);g!==null;){var A=g.dependencies;if(A!==null){E=g.child;for(var P=A.firstContext;P!==null;){if(P.context===c){if(g.tag===1){P=xr(-1,a&-a),P.tag=2;var B=g.updateQueue;if(B!==null){B=B.shared;var Q=B.pending;Q===null?P.next=P:(P.next=Q.next,Q.next=P),B.pending=P}}g.lanes|=a,P=g.alternate,P!==null&&(P.lanes|=a),Nh(g.return,a,s),A.lanes|=a;break}P=P.next}}else if(g.tag===10)E=g.type===s.type?null:g.child;else if(g.tag===18){if(E=g.return,E===null)throw Error(t(341));E.lanes|=a,A=E.alternate,A!==null&&(A.lanes|=a),Nh(E,a,s),E=g.sibling}else E=g.child;if(E!==null)E.return=g;else for(E=g;E!==null;){if(E===s){E=null;break}if(g=E.sibling,g!==null){g.return=E.return,E=g;break}E=E.return}g=E}Ht(n,s,d.children,a),s=s.child}return s;case 9:return d=s.type,c=s.pendingProps.children,mo(s,a),d=vn(d),c=c(d),s.flags|=1,Ht(n,s,c,a),s.child;case 14:return c=s.type,d=xn(c,s.pendingProps),d=xn(c.type,d),qm(n,s,c,d,a);case 15:return Hm(n,s,s.type,s.pendingProps,a);case 17:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:xn(c,d),wu(n,s),s.tag=1,Qt(c)?(n=!0,nu(s)):n=!1,mo(s,a),Lm(s,c,d),Wh(s,c,d,a),Yh(null,s,c,!0,n,a);case 19:return Zm(n,s,a);case 22:return Wm(n,s,a)}throw Error(t(156,s.tag))};function Ig(n,s){return ia(n,s)}function Y0(n,s,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=s,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Tn(n,s,a,c){return new Y0(n,s,a,c)}function gd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function X0(n){if(typeof n=="function")return gd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===b)return 11;if(n===He)return 14}return 2}function yi(n,s){var a=n.alternate;return a===null?(a=Tn(n.tag,s,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=s,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,s=n.dependencies,a.dependencies=s===null?null:{lanes:s.lanes,firstContext:s.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function xu(n,s,a,c,d,g){var E=2;if(c=n,typeof n=="function")gd(n)&&(E=1);else if(typeof n=="string")E=5;else e:switch(n){case N:return ds(a.children,d,g,s);case S:E=8,d|=8;break;case C:return n=Tn(12,a,s,d|2),n.elementType=C,n.lanes=g,n;case R:return n=Tn(13,a,s,d),n.elementType=R,n.lanes=g,n;case Me:return n=Tn(19,a,s,d),n.elementType=Me,n.lanes=g,n;case ze:return Du(a,d,g,s);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case D:E=10;break e;case k:E=9;break e;case b:E=11;break e;case He:E=14;break e;case vt:E=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return s=Tn(E,a,s,d),s.elementType=n,s.type=c,s.lanes=g,s}function ds(n,s,a,c){return n=Tn(7,n,c,s),n.lanes=a,n}function Du(n,s,a,c){return n=Tn(22,n,c,s),n.elementType=ze,n.lanes=a,n.stateNode={isHidden:!1},n}function yd(n,s,a){return n=Tn(6,n,null,s),n.lanes=a,n}function _d(n,s,a){return s=Tn(4,n.children!==null?n.children:[],n.key,s),s.lanes=a,s.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},s}function J0(n,s,a,c,d){this.tag=s,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ua(0),this.expirationTimes=ua(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ua(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function vd(n,s,a,c,d,g,E,A,P){return n=new J0(n,s,a,A,P),s===1?(s=1,g===!0&&(s|=8)):s=0,g=Tn(3,null,null,s),n.current=g,g.stateNode=n,g.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Dh(g),n}function Z0(n,s,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Re,key:c==null?null:""+c,children:n,containerInfo:s,implementation:a}}function Sg(n){if(!n)return li;n=n._reactInternals;e:{if(Cn(n)!==n||n.tag!==1)throw Error(t(170));var s=n;do{switch(s.tag){case 3:s=s.stateNode.context;break e;case 1:if(Qt(s.type)){s=s.stateNode.__reactInternalMemoizedMergedChildContext;break e}}s=s.return}while(s!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Qt(a))return Jp(n,a,s)}return s}function Ag(n,s,a,c,d,g,E,A,P){return n=vd(a,c,!0,n,d,g,E,A,P),n.context=Sg(null),a=n.current,c=Wt(),d=mi(a),g=xr(c,d),g.callback=s??null,hi(a,g,d),n.current.lanes=d,Yi(n,d,c),Jt(n,c),n}function Vu(n,s,a,c){var d=s.current,g=Wt(),E=mi(d);return a=Sg(a),s.context===null?s.context=a:s.pendingContext=a,s=xr(g,E),s.payload={element:n},c=c===void 0?null:c,c!==null&&(s.callback=c),n=hi(d,s,E),n!==null&&(On(n,d,E,g),cu(n,d,E)),E}function Ou(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Rg(n,s){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<s?a:s}}function wd(n,s){Rg(n,s),(n=n.alternate)&&Rg(n,s)}function eT(){return null}var Cg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ed(n){this._internalRoot=n}Mu.prototype.render=Ed.prototype.render=function(n){var s=this._internalRoot;if(s===null)throw Error(t(409));Vu(n,s,null,null)},Mu.prototype.unmount=Ed.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var s=n.containerInfo;us(function(){Vu(null,n,null,null)}),s[Rr]=null}};function Mu(n){this._internalRoot=n}Mu.prototype.unstable_scheduleHydration=function(n){if(n){var s=fa();n={blockedOn:null,target:n,priority:s};for(var a=0;a<on.length&&s!==0&&s<on[a].priority;a++);on.splice(a,0,n),a===0&&Ws(n)}};function Td(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Lu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Pg(){}function tT(n,s,a,c,d){if(d){if(typeof c=="function"){var g=c;c=function(){var B=Ou(E);g.call(B)}}var E=Ag(s,c,n,0,null,!1,!1,"",Pg);return n._reactRootContainer=E,n[Rr]=E.current,Aa(n.nodeType===8?n.parentNode:n),us(),E}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var A=c;c=function(){var B=Ou(P);A.call(B)}}var P=vd(n,0,!1,null,null,!1,!1,"",Pg);return n._reactRootContainer=P,n[Rr]=P.current,Aa(n.nodeType===8?n.parentNode:n),us(function(){Vu(s,P,a,c)}),P}function bu(n,s,a,c,d){var g=a._reactRootContainer;if(g){var E=g;if(typeof d=="function"){var A=d;d=function(){var P=Ou(E);A.call(P)}}Vu(s,E,n,d)}else E=tT(a,s,n,d,c);return Ou(E)}ha=function(n){switch(n.tag){case 3:var s=n.stateNode;if(s.current.memoizedState.isDehydrated){var a=je(s.pendingLanes);a!==0&&(ca(s,a|1),Jt(s,Xe()),(Fe&6)===0&&(wo=Xe()+500,ui()))}break;case 13:us(function(){var c=Nr(n,1);if(c!==null){var d=Wt();On(c,n,1,d)}}),wd(n,1)}},qs=function(n){if(n.tag===13){var s=Nr(n,134217728);if(s!==null){var a=Wt();On(s,n,134217728,a)}wd(n,134217728)}},da=function(n){if(n.tag===13){var s=mi(n),a=Nr(n,s);if(a!==null){var c=Wt();On(a,n,s,c)}wd(n,s)}},fa=function(){return Oe},pa=function(n,s){var a=Oe;try{return Oe=n,s()}finally{Oe=a}},gr=function(n,s,a){switch(s){case"input":if(ji(n,a),s=a.name,a.type==="radio"&&s!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+s)+'][type="radio"]'),s=0;s<a.length;s++){var c=a[s];if(c!==n&&c.form===n.form){var d=eu(c);if(!d)throw Error(t(90));Qo(c),ji(c,d)}}}break;case"textarea":Al(n,a);break;case"select":s=a.value,s!=null&&An(n,!!a.multiple,s,!1)}},Pl=fd,kl=us;var nT={usingClientEntryPoint:!1,Events:[Pa,oo,eu,Qr,Yr,fd]},Ba={findFiberByHostInstance:ts,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},rT={bundleType:Ba.bundleType,version:Ba.version,rendererPackageName:Ba.rendererPackageName,rendererConfig:Ba.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ie.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Ll(n),n===null?null:n.stateNode},findFiberByHostInstance:Ba.findFiberByHostInstance||eT,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fu.isDisabled&&Fu.supportsFiber)try{Wi=Fu.inject(rT),rn=Fu}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=nT,Zt.createPortal=function(n,s){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Td(s))throw Error(t(200));return Z0(n,s,null,a)},Zt.createRoot=function(n,s){if(!Td(n))throw Error(t(299));var a=!1,c="",d=Cg;return s!=null&&(s.unstable_strictMode===!0&&(a=!0),s.identifierPrefix!==void 0&&(c=s.identifierPrefix),s.onRecoverableError!==void 0&&(d=s.onRecoverableError)),s=vd(n,1,!1,null,null,a,!1,c,d),n[Rr]=s.current,Aa(n.nodeType===8?n.parentNode:n),new Ed(s)},Zt.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var s=n._reactInternals;if(s===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Ll(s),n=n===null?null:n.stateNode,n},Zt.flushSync=function(n){return us(n)},Zt.hydrate=function(n,s,a){if(!Lu(s))throw Error(t(200));return bu(null,n,s,!0,a)},Zt.hydrateRoot=function(n,s,a){if(!Td(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,g="",E=Cg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(g=a.identifierPrefix),a.onRecoverableError!==void 0&&(E=a.onRecoverableError)),s=Ag(s,null,n,1,a??null,d,!1,g,E),n[Rr]=s.current,Aa(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),s.mutableSourceEagerHydrationData==null?s.mutableSourceEagerHydrationData=[a,d]:s.mutableSourceEagerHydrationData.push(a,d);return new Mu(s)},Zt.render=function(n,s,a){if(!Lu(s))throw Error(t(200));return bu(null,n,s,!1,a)},Zt.unmountComponentAtNode=function(n){if(!Lu(n))throw Error(t(40));return n._reactRootContainer?(us(function(){bu(null,null,n,!1,function(){n._reactRootContainer=null,n[Rr]=null})}),!0):!1},Zt.unstable_batchedUpdates=fd,Zt.unstable_renderSubtreeIntoContainer=function(n,s,a,c){if(!Lu(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return bu(n,s,a,!1,c)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var T_;function BE(){if(T_)return jd.exports;T_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),jd.exports=Zk(),jd.exports}var I_;function eN(){if(I_)return Hu;I_=1;var r=BE();return Hu.createRoot=r.createRoot,Hu.hydrateRoot=r.hydrateRoot,Hu}var tN=eN();BE();/**
 * @remix-run/router v1.23.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Cc(){return Cc=Object.assign?Object.assign.bind():function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)({}).hasOwnProperty.call(t,i)&&(r[i]=t[i])}return r},Cc.apply(null,arguments)}var Ii;(function(r){r.Pop="POP",r.Push="PUSH",r.Replace="REPLACE"})(Ii||(Ii={}));const S_="popstate";function nN(r){r===void 0&&(r={});function e(i,o){let{pathname:l,search:h,hash:p}=i.location;return _f("",{pathname:l,search:h,hash:p},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function t(i,o){return typeof o=="string"?o:qE(o)}return iN(e,t,null,r)}function nn(r,e){if(r===!1||r===null||typeof r>"u")throw new Error(e)}function $E(r,e){if(!r){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function rN(){return Math.random().toString(36).substr(2,8)}function A_(r,e){return{usr:r.state,key:r.key,idx:e}}function _f(r,e,t,i){return t===void 0&&(t=null),Cc({pathname:typeof r=="string"?r:r.pathname,search:"",hash:""},typeof e=="string"?Xc(e):e,{state:t,key:e&&e.key||i||rN()})}function qE(r){let{pathname:e="/",search:t="",hash:i=""}=r;return t&&t!=="?"&&(e+=t.charAt(0)==="?"?t:"?"+t),i&&i!=="#"&&(e+=i.charAt(0)==="#"?i:"#"+i),e}function Xc(r){let e={};if(r){let t=r.indexOf("#");t>=0&&(e.hash=r.substr(t),r=r.substr(0,t));let i=r.indexOf("?");i>=0&&(e.search=r.substr(i),r=r.substr(0,i)),r&&(e.pathname=r)}return e}function iN(r,e,t,i){i===void 0&&(i={});let{window:o=document.defaultView,v5Compat:l=!1}=i,h=o.history,p=Ii.Pop,f=null,m=_();m==null&&(m=0,h.replaceState(Cc({},h.state,{idx:m}),""));function _(){return(h.state||{idx:null}).idx}function w(){p=Ii.Pop;let O=_(),re=O==null?null:O-m;m=O,f&&f({action:p,location:z.location,delta:re})}function T(O,re){p=Ii.Push;let te=_f(z.location,O,re);m=_()+1;let Y=A_(te,m),ie=z.createHref(te);try{h.pushState(Y,"",ie)}catch(ye){if(ye instanceof DOMException&&ye.name==="DataCloneError")throw ye;o.location.assign(ie)}l&&f&&f({action:p,location:z.location,delta:1})}function x(O,re){p=Ii.Replace;let te=_f(z.location,O,re);m=_();let Y=A_(te,m),ie=z.createHref(te);h.replaceState(Y,"",ie),l&&f&&f({action:p,location:z.location,delta:0})}function L(O){let re=o.location.origin!=="null"?o.location.origin:o.location.href,te=typeof O=="string"?O:qE(O);return te=te.replace(/ $/,"%20"),nn(re,"No window.location.(origin|href) available to create URL for href: "+te),new URL(te,re)}let z={get action(){return p},get location(){return r(o,h)},listen(O){if(f)throw new Error("A history only accepts one active listener");return o.addEventListener(S_,w),f=O,()=>{o.removeEventListener(S_,w),f=null}},createHref(O){return e(o,O)},createURL:L,encodeLocation(O){let re=L(O);return{pathname:re.pathname,search:re.search,hash:re.hash}},push:T,replace:x,go(O){return h.go(O)}};return z}var R_;(function(r){r.data="data",r.deferred="deferred",r.redirect="redirect",r.error="error"})(R_||(R_={}));function sN(r,e,t){return t===void 0&&(t="/"),oN(r,e,t)}function oN(r,e,t,i){let o=typeof e=="string"?Xc(e):e,l=GE(o.pathname||"/",t);if(l==null)return null;let h=HE(r);aN(h);let p=null,f=vN(l);for(let m=0;p==null&&m<h.length;++m)p=gN(h[m],f);return p}function HE(r,e,t,i){e===void 0&&(e=[]),t===void 0&&(t=[]),i===void 0&&(i="");let o=(l,h,p)=>{let f={relativePath:p===void 0?l.path||"":p,caseSensitive:l.caseSensitive===!0,childrenIndex:h,route:l};f.relativePath.startsWith("/")&&(nn(f.relativePath.startsWith(i),'Absolute route path "'+f.relativePath+'" nested under path '+('"'+i+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),f.relativePath=f.relativePath.slice(i.length));let m=Oo([i,f.relativePath]),_=t.concat(f);l.children&&l.children.length>0&&(nn(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+m+'".')),HE(l.children,e,_,m)),!(l.path==null&&!l.index)&&e.push({path:m,score:pN(m,l.index),routesMeta:_})};return r.forEach((l,h)=>{var p;if(l.path===""||!((p=l.path)!=null&&p.includes("?")))o(l,h);else for(let f of WE(l.path))o(l,h,f)}),e}function WE(r){let e=r.split("/");if(e.length===0)return[];let[t,...i]=e,o=t.endsWith("?"),l=t.replace(/\?$/,"");if(i.length===0)return o?[l,""]:[l];let h=WE(i.join("/")),p=[];return p.push(...h.map(f=>f===""?l:[l,f].join("/"))),o&&p.push(...h),p.map(f=>r.startsWith("/")&&f===""?"/":f)}function aN(r){r.sort((e,t)=>e.score!==t.score?t.score-e.score:mN(e.routesMeta.map(i=>i.childrenIndex),t.routesMeta.map(i=>i.childrenIndex)))}const lN=/^:[\w-]+$/,uN=3,cN=2,hN=1,dN=10,fN=-2,C_=r=>r==="*";function pN(r,e){let t=r.split("/"),i=t.length;return t.some(C_)&&(i+=fN),e&&(i+=cN),t.filter(o=>!C_(o)).reduce((o,l)=>o+(lN.test(l)?uN:l===""?hN:dN),i)}function mN(r,e){return r.length===e.length&&r.slice(0,-1).every((i,o)=>i===e[o])?r[r.length-1]-e[e.length-1]:0}function gN(r,e,t){let{routesMeta:i}=r,o={},l="/",h=[];for(let p=0;p<i.length;++p){let f=i[p],m=p===i.length-1,_=l==="/"?e:e.slice(l.length)||"/",w=yN({path:f.relativePath,caseSensitive:f.caseSensitive,end:m},_),T=f.route;if(!w)return null;Object.assign(o,w.params),h.push({params:o,pathname:Oo([l,w.pathname]),pathnameBase:EN(Oo([l,w.pathnameBase])),route:T}),w.pathnameBase!=="/"&&(l=Oo([l,w.pathnameBase]))}return h}function yN(r,e){typeof r=="string"&&(r={path:r,caseSensitive:!1,end:!0});let[t,i]=_N(r.path,r.caseSensitive,r.end),o=e.match(t);if(!o)return null;let l=o[0],h=l.replace(/(.)\/+$/,"$1"),p=o.slice(1);return{params:i.reduce((m,_,w)=>{let{paramName:T,isOptional:x}=_;if(T==="*"){let z=p[w]||"";h=l.slice(0,l.length-z.length).replace(/(.)\/+$/,"$1")}const L=p[w];return x&&!L?m[T]=void 0:m[T]=(L||"").replace(/%2F/g,"/"),m},{}),pathname:l,pathnameBase:h,pattern:r}}function _N(r,e,t){e===void 0&&(e=!1),t===void 0&&(t=!0),$E(r==="*"||!r.endsWith("*")||r.endsWith("/*"),'Route path "'+r+'" will be treated as if it were '+('"'+r.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+r.replace(/\*$/,"/*")+'".'));let i=[],o="^"+r.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(h,p,f)=>(i.push({paramName:p,isOptional:f!=null}),f?"/?([^\\/]+)?":"/([^\\/]+)"));return r.endsWith("*")?(i.push({paramName:"*"}),o+=r==="*"||r==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):t?o+="\\/*$":r!==""&&r!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,e?void 0:"i"),i]}function vN(r){try{return r.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return $E(!1,'The URL path "'+r+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),r}}function GE(r,e){if(e==="/")return r;if(!r.toLowerCase().startsWith(e.toLowerCase()))return null;let t=e.endsWith("/")?e.length-1:e.length,i=r.charAt(t);return i&&i!=="/"?null:r.slice(t)||"/"}const wN=r=>r.replace(/\/\/+/g,"/"),Oo=r=>wN(r.join("/")),EN=r=>r.replace(/\/+$/,"").replace(/^\/*/,"/");function TN(r){return r!=null&&typeof r.status=="number"&&typeof r.statusText=="string"&&typeof r.internal=="boolean"&&"data"in r}const KE=["post","put","patch","delete"];new Set(KE);const IN=["get",...KE];new Set(IN);/**
 * React Router v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Pc(){return Pc=Object.assign?Object.assign.bind():function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)({}).hasOwnProperty.call(t,i)&&(r[i]=t[i])}return r},Pc.apply(null,arguments)}const SN=ae.createContext(null),AN=ae.createContext(null),QE=ae.createContext(null),Jc=ae.createContext(null),Zc=ae.createContext({outlet:null,matches:[],isDataRoute:!1}),YE=ae.createContext(null);function wp(){return ae.useContext(Jc)!=null}function RN(){return wp()||nn(!1),ae.useContext(Jc).location}function CN(r,e){return PN(r,e)}function PN(r,e,t,i){wp()||nn(!1);let{navigator:o}=ae.useContext(QE),{matches:l}=ae.useContext(Zc),h=l[l.length-1],p=h?h.params:{};h&&h.pathname;let f=h?h.pathnameBase:"/";h&&h.route;let m=RN(),_;if(e){var w;let O=typeof e=="string"?Xc(e):e;f==="/"||(w=O.pathname)!=null&&w.startsWith(f)||nn(!1),_=O}else _=m;let T=_.pathname||"/",x=T;if(f!=="/"){let O=f.replace(/^\//,"").split("/");x="/"+T.replace(/^\//,"").split("/").slice(O.length).join("/")}let L=sN(r,{pathname:x}),z=VN(L&&L.map(O=>Object.assign({},O,{params:Object.assign({},p,O.params),pathname:Oo([f,o.encodeLocation?o.encodeLocation(O.pathname).pathname:O.pathname]),pathnameBase:O.pathnameBase==="/"?f:Oo([f,o.encodeLocation?o.encodeLocation(O.pathnameBase).pathname:O.pathnameBase])})),l,t,i);return e&&z?ae.createElement(Jc.Provider,{value:{location:Pc({pathname:"/",search:"",hash:"",state:null,key:"default"},_),navigationType:Ii.Pop}},z):z}function kN(){let r=bN(),e=TN(r)?r.status+" "+r.statusText:r instanceof Error?r.message:JSON.stringify(r),t=r instanceof Error?r.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return ae.createElement(ae.Fragment,null,ae.createElement("h2",null,"Unexpected Application Error!"),ae.createElement("h3",{style:{fontStyle:"italic"}},e),t?ae.createElement("pre",{style:o},t):null,null)}const NN=ae.createElement(kN,null);class xN extends ae.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:t.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){console.error("React Router caught the following error during render",e,t)}render(){return this.state.error!==void 0?ae.createElement(Zc.Provider,{value:this.props.routeContext},ae.createElement(YE.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function DN(r){let{routeContext:e,match:t,children:i}=r,o=ae.useContext(SN);return o&&o.static&&o.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=t.route.id),ae.createElement(Zc.Provider,{value:e},i)}function VN(r,e,t,i){var o;if(e===void 0&&(e=[]),t===void 0&&(t=null),i===void 0&&(i=null),r==null){var l;if(!t)return null;if(t.errors)r=t.matches;else if((l=i)!=null&&l.v7_partialHydration&&e.length===0&&!t.initialized&&t.matches.length>0)r=t.matches;else return null}let h=r,p=(o=t)==null?void 0:o.errors;if(p!=null){let _=h.findIndex(w=>w.route.id&&(p==null?void 0:p[w.route.id])!==void 0);_>=0||nn(!1),h=h.slice(0,Math.min(h.length,_+1))}let f=!1,m=-1;if(t&&i&&i.v7_partialHydration)for(let _=0;_<h.length;_++){let w=h[_];if((w.route.HydrateFallback||w.route.hydrateFallbackElement)&&(m=_),w.route.id){let{loaderData:T,errors:x}=t,L=w.route.loader&&T[w.route.id]===void 0&&(!x||x[w.route.id]===void 0);if(w.route.lazy||L){f=!0,m>=0?h=h.slice(0,m+1):h=[h[0]];break}}}return h.reduceRight((_,w,T)=>{let x,L=!1,z=null,O=null;t&&(x=p&&w.route.id?p[w.route.id]:void 0,z=w.route.errorElement||NN,f&&(m<0&&T===0?(FN("route-fallback"),L=!0,O=null):m===T&&(L=!0,O=w.route.hydrateFallbackElement||null)));let re=e.concat(h.slice(0,T+1)),te=()=>{let Y;return x?Y=z:L?Y=O:w.route.Component?Y=ae.createElement(w.route.Component,null):w.route.element?Y=w.route.element:Y=_,ae.createElement(DN,{match:w,routeContext:{outlet:_,matches:re,isDataRoute:t!=null},children:Y})};return t&&(w.route.ErrorBoundary||w.route.errorElement||T===0)?ae.createElement(xN,{location:t.location,revalidation:t.revalidation,component:z,error:x,children:te(),routeContext:{outlet:null,matches:re,isDataRoute:!0}}):te()},null)}var XE=(function(r){return r.UseBlocker="useBlocker",r.UseLoaderData="useLoaderData",r.UseActionData="useActionData",r.UseRouteError="useRouteError",r.UseNavigation="useNavigation",r.UseRouteLoaderData="useRouteLoaderData",r.UseMatches="useMatches",r.UseRevalidator="useRevalidator",r.UseNavigateStable="useNavigate",r.UseRouteId="useRouteId",r})(XE||{});function ON(r){let e=ae.useContext(AN);return e||nn(!1),e}function MN(r){let e=ae.useContext(Zc);return e||nn(!1),e}function LN(r){let e=MN(),t=e.matches[e.matches.length-1];return t.route.id||nn(!1),t.route.id}function bN(){var r;let e=ae.useContext(YE),t=ON(XE.UseRouteError),i=LN();return e!==void 0?e:(r=t.errors)==null?void 0:r[i]}const P_={};function FN(r,e,t){P_[r]||(P_[r]=!0)}function UN(r,e){r==null||r.v7_startTransition,r==null||r.v7_relativeSplatPath}function JE(r){nn(!1)}function jN(r){let{basename:e="/",children:t=null,location:i,navigationType:o=Ii.Pop,navigator:l,static:h=!1,future:p}=r;wp()&&nn(!1);let f=e.replace(/^\/*/,"/"),m=ae.useMemo(()=>({basename:f,navigator:l,static:h,future:Pc({v7_relativeSplatPath:!1},p)}),[f,p,l,h]);typeof i=="string"&&(i=Xc(i));let{pathname:_="/",search:w="",hash:T="",state:x=null,key:L="default"}=i,z=ae.useMemo(()=>{let O=GE(_,f);return O==null?null:{location:{pathname:O,search:w,hash:T,state:x,key:L},navigationType:o}},[f,_,w,T,x,L,o]);return z==null?null:ae.createElement(QE.Provider,{value:m},ae.createElement(Jc.Provider,{children:t,value:z}))}function zN(r){let{children:e,location:t}=r;return CN(vf(e),t)}new Promise(()=>{});function vf(r,e){e===void 0&&(e=[]);let t=[];return ae.Children.forEach(r,(i,o)=>{if(!ae.isValidElement(i))return;let l=[...e,o];if(i.type===ae.Fragment){t.push.apply(t,vf(i.props.children,l));return}i.type!==JE&&nn(!1),!i.props.index||!i.props.children||nn(!1);let h={id:i.props.id||l.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(h.children=vf(i.props.children,l)),t.push(h)}),t}/**
 * React Router DOM v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const BN="6";try{window.__reactRouterVersion=BN}catch{}const $N="startTransition",k_=cT[$N];function qN(r){let{basename:e,children:t,future:i,window:o}=r,l=ae.useRef();l.current==null&&(l.current=nN({window:o,v5Compat:!0}));let h=l.current,[p,f]=ae.useState({action:h.action,location:h.location}),{v7_startTransition:m}=i||{},_=ae.useCallback(w=>{m&&k_?k_(()=>f(w)):f(w)},[f,m]);return ae.useLayoutEffect(()=>h.listen(_),[h,_]),ae.useEffect(()=>UN(i),[i]),ae.createElement(jN,{basename:e,children:t,location:p.location,navigationType:p.action,navigator:h,future:i})}var N_;(function(r){r.UseScrollRestoration="useScrollRestoration",r.UseSubmit="useSubmit",r.UseSubmitFetcher="useSubmitFetcher",r.UseFetcher="useFetcher",r.useViewTransitionState="useViewTransitionState"})(N_||(N_={}));var x_;(function(r){r.UseFetcher="useFetcher",r.UseFetchers="useFetchers",r.UseScrollRestoration="useScrollRestoration"})(x_||(x_={}));const HN="http://localhost:8080";function WN(){try{return JSON.parse(localStorage.getItem("authUser")??"null")}catch{return null}}function GN(){localStorage.removeItem("authUser")}function KN({onLogin:r}){const[e,t]=ae.useState(""),[i,o]=ae.useState(""),[l,h]=ae.useState(""),[p,f]=ae.useState(!1);async function m(_){_.preventDefault(),h(""),f(!0);try{const w=await fetch(`${HN}/api/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({account:e.trim(),password:i})}),T=await w.json();if(!w.ok){h(T.detail??"登入失敗");return}const x=T;localStorage.setItem("authUser",JSON.stringify(x)),r(x)}catch{h("無法連線至伺服器，請確認後端服務是否啟動")}finally{f(!1)}}return G.jsx("div",{className:"login-page",children:G.jsxs("form",{onSubmit:m,className:"login-card",children:[G.jsxs("div",{className:"login-form",children:[G.jsx("span",{className:"login-brand",children:"Knowgence"}),G.jsx("p",{className:"login-subtitle",children:"數位教學平台"})]}),G.jsxs("div",{className:"login-field",children:[G.jsx("label",{children:"帳號"}),G.jsx("input",{type:"text",required:!0,autoComplete:"username",placeholder:"學號 或 教師帳號",value:e,onChange:_=>t(_.target.value),className:"login-input"})]}),G.jsxs("div",{className:"login-field",children:[G.jsx("label",{children:"密碼"}),G.jsx("input",{type:"password",required:!0,autoComplete:"current-password",placeholder:"••••••••",value:i,onChange:_=>o(_.target.value),className:"login-input"})]}),l&&G.jsx("p",{className:"login-error",children:l}),G.jsx("button",{type:"submit",disabled:p,className:"submit",children:p?"登入中...":"登入"})]})})}function QN({onLogout:r}){function e(){GN(),r()}return G.jsx("button",{onClick:e,className:"rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700",children:"登出"})}function YN(){const[r,e]=ae.useState("qr");return G.jsxs("div",{className:"flex flex-col items-center gap-6",children:[G.jsxs("div",{className:"flex rounded-xl bg-slate-800 p-1",children:[G.jsx("button",{onClick:()=>e("qr"),className:`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${r==="qr"?"bg-emerald-500 text-white":"text-slate-400 hover:text-slate-200"}`,children:"QR 掃描簽到"}),G.jsx("button",{onClick:()=>e("num"),className:`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${r==="num"?"bg-yellow-500 text-slate-900":"text-slate-400 hover:text-slate-200"}`,children:"數字密碼簽到"})]}),G.jsx("div",{className:"w-full max-w-lg rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-800",children:r==="qr"?G.jsx(Kk,{}):G.jsx(Yk,{})})]})}function XN({user:r}){return G.jsxs("div",{className:"flex flex-col items-center gap-8 py-10",children:[G.jsxs("div",{className:"flex flex-col items-center gap-1",children:[G.jsx("p",{className:"text-slate-400 text-sm",children:"歡迎回來"}),G.jsx("h2",{className:"text-2xl font-bold text-white",children:r.name||r.account}),r.class_name&&G.jsx("span",{className:"rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20",children:r.class_name})]}),G.jsxs("div",{className:"w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800",children:[G.jsx("h3",{className:"mb-4 text-lg font-semibold text-white",children:"課堂簽到"}),G.jsx("p",{className:"mb-6 text-sm text-slate-400",children:"請向老師取得簽到方式，選擇以下其中一種完成簽到："}),G.jsxs("div",{className:"flex flex-col gap-4",children:[G.jsxs("div",{className:"rounded-xl bg-slate-800 p-4",children:[G.jsx("p",{className:"font-medium text-emerald-400",children:"QR Code 掃描"}),G.jsx("p",{className:"mt-1 text-sm text-slate-400",children:"使用 Knowgence Flutter App 掃描老師螢幕上的 QR Code"})]}),G.jsxs("div",{className:"rounded-xl bg-slate-800 p-4",children:[G.jsx("p",{className:"font-medium text-yellow-400",children:"數字密碼簽到"}),G.jsx("p",{className:"mt-1 mb-3 text-sm text-slate-400",children:"輸入老師公布的 4 位數簽到密碼（數字 1–9）"}),G.jsx(JN,{account:r.account})]})]})]})]})}function JN({account:r}){const[e,t]=ae.useState(""),[i,o]=ae.useState("idle");async function l(){if(e.length===4){o("loading");try{const p=wC(sC(ki,"signinSessions"),$y("active","==",!0),$y("type","==","numeric")),f=await IC(p);if(f.empty){o("no_session");return}const m=f.docs[0],_=m.data();if(_.currentPassword!==e){o("wrong_code");return}if(_.sessionEndTime.toDate()<new Date){o("no_session");return}const T=_.signedAccounts??[];if(T.includes(r)){o("already");return}await ul(_s(ki,"signinSessions",m.id),{totalSignIns:yC(1),signedAccounts:[...T,r]}),o("ok"),t("")}catch{o("error")}}}const h={ok:{text:"簽到成功！",cls:"text-emerald-400"},wrong_code:{text:"密碼錯誤，請再確認",cls:"text-red-400"},no_session:{text:"目前沒有進行中的簽到",cls:"text-slate-400"},already:{text:"您已完成簽到",cls:"text-yellow-400"},error:{text:"發生錯誤，請稍後再試",cls:"text-red-400"}};return G.jsxs("div",{className:"flex flex-col gap-2",children:[G.jsxs("div",{className:"flex gap-2",children:[G.jsx("input",{type:"text",maxLength:4,inputMode:"numeric",placeholder:"1234",value:e,onChange:p=>{t(p.target.value.replace(/[^1-9]/g,"").slice(0,4)),o("idle")},className:"w-24 rounded-lg bg-slate-700 px-3 py-2 text-center font-mono text-lg tracking-widest text-white outline-none ring-1 ring-slate-600 focus:ring-yellow-400"}),G.jsx("button",{onClick:l,disabled:e.length!==4||i==="loading"||i==="ok",className:"rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400 disabled:opacity-40",children:i==="loading"?"驗證中...":"確認簽到"})]}),i!=="idle"&&i!=="loading"&&G.jsx("p",{className:`text-sm ${h[i].cls}`,children:h[i].text})]})}function ZN(){const[r,e]=ae.useState(WN);return r?G.jsxs("div",{className:"min-h-screen bg-slate-950",children:[G.jsx("header",{className:"sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm",children:G.jsxs("div",{className:"mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 py-3",children:[G.jsxs("div",{className:"flex items-center gap-3",children:[G.jsx("a",{href:"/",className:"text-xl font-bold text-emerald-400 transition-colors hover:text-emerald-300",children:"Knowgence"}),G.jsx("span",{className:"hidden text-xs text-slate-500 sm:inline",children:"數位教學平台"})]}),G.jsxs("div",{className:"flex items-center gap-3",children:[G.jsxs("span",{className:"hidden text-sm text-slate-400 sm:inline",children:[r.name||r.account,G.jsx("span",{className:`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${r.role==="teacher"?"bg-emerald-500/10 text-emerald-400":"bg-sky-500/10 text-sky-400"}`,children:r.role==="teacher"?"教師":"學生"})]}),r.role==="teacher"&&G.jsx("a",{href:"/",className:"rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300",children:"課堂簽到"}),G.jsx(QN,{onLogout:()=>e(null)})]})]})}),G.jsx("main",{className:"mx-auto max-w-7xl px-4 py-6",children:G.jsx(zN,{children:G.jsx(JE,{path:"/",element:r.role==="teacher"?G.jsx(YN,{}):G.jsx(XN,{user:r})})})})]}):G.jsx(KN,{onLogin:e})}tN.createRoot(document.getElementById("root")).render(G.jsx(ae.StrictMode,{children:G.jsx(qN,{children:G.jsx(ZN,{})})}));
