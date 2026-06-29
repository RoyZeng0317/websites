var VE=Object.defineProperty;var OE=(r,e,t)=>e in r?VE(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Wu=(r,e,t)=>OE(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function D_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Fd={exports:{}},za={},Ud={exports:{}},be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zg;function LE(){if(zg)return be;zg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),I=Symbol.iterator;function A(V){return V===null||typeof V!="object"?null:(V=I&&V[I]||V["@@iterator"],typeof V=="function"?V:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},W=Object.assign,K={};function $(V,B,se){this.props=V,this.context=B,this.refs=K,this.updater=se||j}$.prototype.isReactComponent={},$.prototype.setState=function(V,B){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,B,"setState")},$.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function pe(){}pe.prototype=$.prototype;function le(V,B,se){this.props=V,this.context=B,this.refs=K,this.updater=se||j}var ce=le.prototype=new pe;ce.constructor=le,W(ce,$.prototype),ce.isPureReactComponent=!0;var Te=Array.isArray,Ee=Object.prototype.hasOwnProperty,de={current:null},k={key:!0,ref:!0,__self:!0,__source:!0};function x(V,B,se){var me,ge={},ye=null,Se=null;if(B!=null)for(me in B.ref!==void 0&&(Se=B.ref),B.key!==void 0&&(ye=""+B.key),B)Ee.call(B,me)&&!k.hasOwnProperty(me)&&(ge[me]=B[me]);var Pe=arguments.length-2;if(Pe===1)ge.children=se;else if(1<Pe){for(var Ne=Array(Pe),Ke=0;Ke<Pe;Ke++)Ne[Ke]=arguments[Ke+2];ge.children=Ne}if(V&&V.defaultProps)for(me in Pe=V.defaultProps,Pe)ge[me]===void 0&&(ge[me]=Pe[me]);return{$$typeof:r,type:V,key:ye,ref:Se,props:ge,_owner:de.current}}function R(V,B){return{$$typeof:r,type:V.type,key:B,ref:V.ref,props:V.props,_owner:V._owner}}function b(V){return typeof V=="object"&&V!==null&&V.$$typeof===r}function P(V){var B={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(se){return B[se]})}var O=/\/+/g;function C(V,B){return typeof V=="object"&&V!==null&&V.key!=null?P(""+V.key):B.toString(36)}function $e(V,B,se,me,ge){var ye=typeof V;(ye==="undefined"||ye==="boolean")&&(V=null);var Se=!1;if(V===null)Se=!0;else switch(ye){case"string":case"number":Se=!0;break;case"object":switch(V.$$typeof){case r:case e:Se=!0}}if(Se)return Se=V,ge=ge(Se),V=me===""?"."+C(Se,0):me,Te(ge)?(se="",V!=null&&(se=V.replace(O,"$&/")+"/"),$e(ge,B,se,"",function(Ke){return Ke})):ge!=null&&(b(ge)&&(ge=R(ge,se+(!ge.key||Se&&Se.key===ge.key?"":(""+ge.key).replace(O,"$&/")+"/")+V)),B.push(ge)),1;if(Se=0,me=me===""?".":me+":",Te(V))for(var Pe=0;Pe<V.length;Pe++){ye=V[Pe];var Ne=me+C(ye,Pe);Se+=$e(ye,B,se,Ne,ge)}else if(Ne=A(V),typeof Ne=="function")for(V=Ne.call(V),Pe=0;!(ye=V.next()).done;)ye=ye.value,Ne=me+C(ye,Pe++),Se+=$e(ye,B,se,Ne,ge);else if(ye==="object")throw B=String(V),Error("Objects are not valid as a React child (found: "+(B==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":B)+"). If you meant to render a collection of children, use an array instead.");return Se}function mt(V,B,se){if(V==null)return V;var me=[],ge=0;return $e(V,me,"","",function(ye){return B.call(se,ye,ge++)}),me}function kt(V){if(V._status===-1){var B=V._result;B=B(),B.then(function(se){(V._status===0||V._status===-1)&&(V._status=1,V._result=se)},function(se){(V._status===0||V._status===-1)&&(V._status=2,V._result=se)}),V._status===-1&&(V._status=0,V._result=B)}if(V._status===1)return V._result.default;throw V._result}var He={current:null},H={transition:null},ne={ReactCurrentDispatcher:He,ReactCurrentBatchConfig:H,ReactCurrentOwner:de};function Z(){throw Error("act(...) is not supported in production builds of React.")}return be.Children={map:mt,forEach:function(V,B,se){mt(V,function(){B.apply(this,arguments)},se)},count:function(V){var B=0;return mt(V,function(){B++}),B},toArray:function(V){return mt(V,function(B){return B})||[]},only:function(V){if(!b(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},be.Component=$,be.Fragment=t,be.Profiler=o,be.PureComponent=le,be.StrictMode=i,be.Suspense=g,be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ne,be.act=Z,be.cloneElement=function(V,B,se){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var me=W({},V.props),ge=V.key,ye=V.ref,Se=V._owner;if(B!=null){if(B.ref!==void 0&&(ye=B.ref,Se=de.current),B.key!==void 0&&(ge=""+B.key),V.type&&V.type.defaultProps)var Pe=V.type.defaultProps;for(Ne in B)Ee.call(B,Ne)&&!k.hasOwnProperty(Ne)&&(me[Ne]=B[Ne]===void 0&&Pe!==void 0?Pe[Ne]:B[Ne])}var Ne=arguments.length-2;if(Ne===1)me.children=se;else if(1<Ne){Pe=Array(Ne);for(var Ke=0;Ke<Ne;Ke++)Pe[Ke]=arguments[Ke+2];me.children=Pe}return{$$typeof:r,type:V.type,key:ge,ref:ye,props:me,_owner:Se}},be.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:l,_context:V},V.Consumer=V},be.createElement=x,be.createFactory=function(V){var B=x.bind(null,V);return B.type=V,B},be.createRef=function(){return{current:null}},be.forwardRef=function(V){return{$$typeof:f,render:V}},be.isValidElement=b,be.lazy=function(V){return{$$typeof:E,_payload:{_status:-1,_result:V},_init:kt}},be.memo=function(V,B){return{$$typeof:_,type:V,compare:B===void 0?null:B}},be.startTransition=function(V){var B=H.transition;H.transition={};try{V()}finally{H.transition=B}},be.unstable_act=Z,be.useCallback=function(V,B){return He.current.useCallback(V,B)},be.useContext=function(V){return He.current.useContext(V)},be.useDebugValue=function(){},be.useDeferredValue=function(V){return He.current.useDeferredValue(V)},be.useEffect=function(V,B){return He.current.useEffect(V,B)},be.useId=function(){return He.current.useId()},be.useImperativeHandle=function(V,B,se){return He.current.useImperativeHandle(V,B,se)},be.useInsertionEffect=function(V,B){return He.current.useInsertionEffect(V,B)},be.useLayoutEffect=function(V,B){return He.current.useLayoutEffect(V,B)},be.useMemo=function(V,B){return He.current.useMemo(V,B)},be.useReducer=function(V,B,se){return He.current.useReducer(V,B,se)},be.useRef=function(V){return He.current.useRef(V)},be.useState=function(V){return He.current.useState(V)},be.useSyncExternalStore=function(V,B,se){return He.current.useSyncExternalStore(V,B,se)},be.useTransition=function(){return He.current.useTransition()},be.version="18.3.1",be}var Bg;function Nf(){return Bg||(Bg=1,Ud.exports=LE()),Ud.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $g;function ME(){if($g)return za;$g=1;var r=Nf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(f,g,_){var E,I={},A=null,j=null;_!==void 0&&(A=""+_),g.key!==void 0&&(A=""+g.key),g.ref!==void 0&&(j=g.ref);for(E in g)i.call(g,E)&&!l.hasOwnProperty(E)&&(I[E]=g[E]);if(f&&f.defaultProps)for(E in g=f.defaultProps,g)I[E]===void 0&&(I[E]=g[E]);return{$$typeof:e,type:f,key:A,ref:j,props:I,_owner:o.current}}return za.Fragment=t,za.jsx=h,za.jsxs=h,za}var Hg;function jE(){return Hg||(Hg=1,Fd.exports=ME()),Fd.exports}var w=jE(),Q=Nf();const FE=D_(Q);var Ku={},zd={exports:{}},nn={},Bd={exports:{}},$d={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qg;function UE(){return qg||(qg=1,(function(r){function e(H,ne){var Z=H.length;H.push(ne);e:for(;0<Z;){var V=Z-1>>>1,B=H[V];if(0<o(B,ne))H[V]=ne,H[Z]=B,Z=V;else break e}}function t(H){return H.length===0?null:H[0]}function i(H){if(H.length===0)return null;var ne=H[0],Z=H.pop();if(Z!==ne){H[0]=Z;e:for(var V=0,B=H.length,se=B>>>1;V<se;){var me=2*(V+1)-1,ge=H[me],ye=me+1,Se=H[ye];if(0>o(ge,Z))ye<B&&0>o(Se,ge)?(H[V]=Se,H[ye]=Z,V=ye):(H[V]=ge,H[me]=Z,V=me);else if(ye<B&&0>o(Se,Z))H[V]=Se,H[ye]=Z,V=ye;else break e}}return ne}function o(H,ne){var Z=H.sortIndex-ne.sortIndex;return Z!==0?Z:H.id-ne.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,f=h.now();r.unstable_now=function(){return h.now()-f}}var g=[],_=[],E=1,I=null,A=3,j=!1,W=!1,K=!1,$=typeof setTimeout=="function"?setTimeout:null,pe=typeof clearTimeout=="function"?clearTimeout:null,le=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ce(H){for(var ne=t(_);ne!==null;){if(ne.callback===null)i(_);else if(ne.startTime<=H)i(_),ne.sortIndex=ne.expirationTime,e(g,ne);else break;ne=t(_)}}function Te(H){if(K=!1,ce(H),!W)if(t(g)!==null)W=!0,kt(Ee);else{var ne=t(_);ne!==null&&He(Te,ne.startTime-H)}}function Ee(H,ne){W=!1,K&&(K=!1,pe(x),x=-1),j=!0;var Z=A;try{for(ce(ne),I=t(g);I!==null&&(!(I.expirationTime>ne)||H&&!P());){var V=I.callback;if(typeof V=="function"){I.callback=null,A=I.priorityLevel;var B=V(I.expirationTime<=ne);ne=r.unstable_now(),typeof B=="function"?I.callback=B:I===t(g)&&i(g),ce(ne)}else i(g);I=t(g)}if(I!==null)var se=!0;else{var me=t(_);me!==null&&He(Te,me.startTime-ne),se=!1}return se}finally{I=null,A=Z,j=!1}}var de=!1,k=null,x=-1,R=5,b=-1;function P(){return!(r.unstable_now()-b<R)}function O(){if(k!==null){var H=r.unstable_now();b=H;var ne=!0;try{ne=k(!0,H)}finally{ne?C():(de=!1,k=null)}}else de=!1}var C;if(typeof le=="function")C=function(){le(O)};else if(typeof MessageChannel<"u"){var $e=new MessageChannel,mt=$e.port2;$e.port1.onmessage=O,C=function(){mt.postMessage(null)}}else C=function(){$(O,0)};function kt(H){k=H,de||(de=!0,C())}function He(H,ne){x=$(function(){H(r.unstable_now())},ne)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(H){H.callback=null},r.unstable_continueExecution=function(){W||j||(W=!0,kt(Ee))},r.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<H?Math.floor(1e3/H):5},r.unstable_getCurrentPriorityLevel=function(){return A},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(H){switch(A){case 1:case 2:case 3:var ne=3;break;default:ne=A}var Z=A;A=ne;try{return H()}finally{A=Z}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(H,ne){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var Z=A;A=H;try{return ne()}finally{A=Z}},r.unstable_scheduleCallback=function(H,ne,Z){var V=r.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?V+Z:V):Z=V,H){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=Z+B,H={id:E++,callback:ne,priorityLevel:H,startTime:Z,expirationTime:B,sortIndex:-1},Z>V?(H.sortIndex=Z,e(_,H),t(g)===null&&H===t(_)&&(K?(pe(x),x=-1):K=!0,He(Te,Z-V))):(H.sortIndex=B,e(g,H),W||j||(W=!0,kt(Ee))),H},r.unstable_shouldYield=P,r.unstable_wrapCallback=function(H){var ne=A;return function(){var Z=A;A=ne;try{return H.apply(this,arguments)}finally{A=Z}}}})($d)),$d}var Wg;function zE(){return Wg||(Wg=1,Bd.exports=UE()),Bd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kg;function BE(){if(Kg)return nn;Kg=1;var r=Nf(),e=zE();function t(n){for(var s="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)s+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+s+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function l(n,s){h(n,s),h(n+"Capture",s)}function h(n,s){for(o[n]=s,n=0;n<s.length;n++)i.add(s[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,E={},I={};function A(n){return g.call(I,n)?!0:g.call(E,n)?!1:_.test(n)?I[n]=!0:(E[n]=!0,!1)}function j(n,s,a,c){if(a!==null&&a.type===0)return!1;switch(typeof s){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function W(n,s,a,c){if(s===null||typeof s>"u"||j(n,s,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!s;case 4:return s===!1;case 5:return isNaN(s);case 6:return isNaN(s)||1>s}return!1}function K(n,s,a,c,d,p,v){this.acceptsBooleans=s===2||s===3||s===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=s,this.sanitizeURL=p,this.removeEmptyString=v}var $={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){$[n]=new K(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var s=n[0];$[s]=new K(s,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){$[n]=new K(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){$[n]=new K(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){$[n]=new K(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){$[n]=new K(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){$[n]=new K(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){$[n]=new K(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){$[n]=new K(n,5,!1,n.toLowerCase(),null,!1,!1)});var pe=/[\-:]([a-z])/g;function le(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var s=n.replace(pe,le);$[s]=new K(s,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var s=n.replace(pe,le);$[s]=new K(s,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var s=n.replace(pe,le);$[s]=new K(s,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){$[n]=new K(n,1,!1,n.toLowerCase(),null,!1,!1)}),$.xlinkHref=new K("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){$[n]=new K(n,1,!1,n.toLowerCase(),null,!0,!0)});function ce(n,s,a,c){var d=$.hasOwnProperty(s)?$[s]:null;(d!==null?d.type!==0:c||!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(W(s,a,d,c)&&(a=null),c||d===null?A(s)&&(a===null?n.removeAttribute(s):n.setAttribute(s,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(s=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(s):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,s,a):n.setAttribute(s,a))))}var Te=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ee=Symbol.for("react.element"),de=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),b=Symbol.for("react.provider"),P=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),C=Symbol.for("react.suspense"),$e=Symbol.for("react.suspense_list"),mt=Symbol.for("react.memo"),kt=Symbol.for("react.lazy"),He=Symbol.for("react.offscreen"),H=Symbol.iterator;function ne(n){return n===null||typeof n!="object"?null:(n=H&&n[H]||n["@@iterator"],typeof n=="function"?n:null)}var Z=Object.assign,V;function B(n){if(V===void 0)try{throw Error()}catch(a){var s=a.stack.trim().match(/\n( *(at )?)/);V=s&&s[1]||""}return`
`+V+n}var se=!1;function me(n,s){if(!n||se)return"";se=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(s)if(s=function(){throw Error()},Object.defineProperty(s.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(s,[])}catch(U){var c=U}Reflect.construct(n,[],s)}else{try{s.call()}catch(U){c=U}n.call(s.prototype)}else{try{throw Error()}catch(U){c=U}n()}}catch(U){if(U&&c&&typeof U.stack=="string"){for(var d=U.stack.split(`
`),p=c.stack.split(`
`),v=d.length-1,S=p.length-1;1<=v&&0<=S&&d[v]!==p[S];)S--;for(;1<=v&&0<=S;v--,S--)if(d[v]!==p[S]){if(v!==1||S!==1)do if(v--,S--,0>S||d[v]!==p[S]){var N=`
`+d[v].replace(" at new "," at ");return n.displayName&&N.includes("<anonymous>")&&(N=N.replace("<anonymous>",n.displayName)),N}while(1<=v&&0<=S);break}}}finally{se=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?B(n):""}function ge(n){switch(n.tag){case 5:return B(n.type);case 16:return B("Lazy");case 13:return B("Suspense");case 19:return B("SuspenseList");case 0:case 2:case 15:return n=me(n.type,!1),n;case 11:return n=me(n.type.render,!1),n;case 1:return n=me(n.type,!0),n;default:return""}}function ye(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case k:return"Fragment";case de:return"Portal";case R:return"Profiler";case x:return"StrictMode";case C:return"Suspense";case $e:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case P:return(n.displayName||"Context")+".Consumer";case b:return(n._context.displayName||"Context")+".Provider";case O:var s=n.render;return n=n.displayName,n||(n=s.displayName||s.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case mt:return s=n.displayName||null,s!==null?s:ye(n.type)||"Memo";case kt:s=n._payload,n=n._init;try{return ye(n(s))}catch{}}return null}function Se(n){var s=n.type;switch(n.tag){case 24:return"Cache";case 9:return(s.displayName||"Context")+".Consumer";case 10:return(s._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=s.render,n=n.displayName||n.name||"",s.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return s;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ye(s);case 8:return s===x?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof s=="function")return s.displayName||s.name||null;if(typeof s=="string")return s}return null}function Pe(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ne(n){var s=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(s==="checkbox"||s==="radio")}function Ke(n){var s=Ne(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,s),c=""+n[s];if(!n.hasOwnProperty(s)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,p=a.set;return Object.defineProperty(n,s,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,p.call(this,v)}}),Object.defineProperty(n,s,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[s]}}}}function Tt(n){n._valueTracker||(n._valueTracker=Ke(n))}function ot(n){if(!n)return!1;var s=n._valueTracker;if(!s)return!0;var a=s.getValue(),c="";return n&&(c=Ne(n)?n.checked?"true":"false":n.value),n=c,n!==a?(s.setValue(n),!0):!1}function qe(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function bt(n,s){var a=s.checked;return Z({},s,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function Hn(n,s){var a=s.defaultValue==null?"":s.defaultValue,c=s.checked!=null?s.checked:s.defaultChecked;a=Pe(s.value!=null?s.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:s.type==="checkbox"||s.type==="radio"?s.checked!=null:s.value!=null}}function Fi(n,s){s=s.checked,s!=null&&ce(n,"checked",s,!1)}function Xs(n,s){Fi(n,s);var a=Pe(s.value),c=s.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}s.hasOwnProperty("value")?gt(n,s.type,a):s.hasOwnProperty("defaultValue")&&gt(n,s.type,Pe(s.defaultValue)),s.checked==null&&s.defaultChecked!=null&&(n.defaultChecked=!!s.defaultChecked)}function Go(n,s,a){if(s.hasOwnProperty("value")||s.hasOwnProperty("defaultValue")){var c=s.type;if(!(c!=="submit"&&c!=="reset"||s.value!==void 0&&s.value!==null))return;s=""+n._wrapperState.initialValue,a||s===n.value||(n.value=s),n.defaultValue=s}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function gt(n,s,a){(s!=="number"||qe(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var ct=Array.isArray;function Pn(n,s,a,c){if(n=n.options,s){s={};for(var d=0;d<a.length;d++)s["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=s.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Pe(a),s=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}s!==null||n[d].disabled||(s=n[d])}s!==null&&(s.selected=!0)}}function Qo(n,s){if(s.dangerouslySetInnerHTML!=null)throw Error(t(91));return Z({},s,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Jo(n,s){var a=s.value;if(a==null){if(a=s.children,s=s.defaultValue,a!=null){if(s!=null)throw Error(t(92));if(ct(a)){if(1<a.length)throw Error(t(93));a=a[0]}s=a}s==null&&(s=""),a=s}n._wrapperState={initialValue:Pe(a)}}function bl(n,s){var a=Pe(s.value),c=Pe(s.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),s.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Zr(n){var s=n.textContent;s===n._wrapperState.initialValue&&s!==""&&s!==null&&(n.value=s)}function Yo(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ui(n,s){return n==null||n==="http://www.w3.org/1999/xhtml"?Yo(s):n==="http://www.w3.org/2000/svg"&&s==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var es,Dl=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(s,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(s,a,c,d)})}:n})(function(n,s){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=s;else{for(es=es||document.createElement("div"),es.innerHTML="<svg>"+s.valueOf().toString()+"</svg>",s=es.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;s.firstChild;)n.appendChild(s.firstChild)}});function Zs(n,s){if(s){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=s;return}}n.textContent=s}var ts={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Vl=["Webkit","ms","Moz","O"];Object.keys(ts).forEach(function(n){Vl.forEach(function(s){s=s+n.charAt(0).toUpperCase()+n.substring(1),ts[s]=ts[n]})});function ns(n,s,a){return s==null||typeof s=="boolean"||s===""?"":a||typeof s!="number"||s===0||ts.hasOwnProperty(n)&&ts[n]?(""+s).trim():s+"px"}function zi(n,s){n=n.style;for(var a in s)if(s.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=ns(a,s[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Xo=Z({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Nn(n,s){if(s){if(Xo[n]&&(s.children!=null||s.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(s.dangerouslySetInnerHTML!=null){if(s.children!=null)throw Error(t(60));if(typeof s.dangerouslySetInnerHTML!="object"||!("__html"in s.dangerouslySetInnerHTML))throw Error(t(61))}if(s.style!=null&&typeof s.style!="object")throw Error(t(62))}}function Bi(n,s){if(n.indexOf("-")===-1)return typeof s.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var rs=null;function $i(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var _r=null,vr=null,at=null;function Zo(n){if(n=Aa(n)){if(typeof _r!="function")throw Error(t(280));var s=n.stateNode;s&&(s=au(s),_r(n.stateNode,n.type,s))}}function ss(n){vr?at?at.push(n):at=[n]:vr=n}function is(){if(vr){var n=vr,s=at;if(at=vr=null,Zo(n),s)for(n=0;n<s.length;n++)Zo(s[n])}}function Ol(n,s){return n(s)}function Ll(){}var qn=!1;function Ml(n,s,a){if(qn)return n(s,a);qn=!0;try{return Ol(n,s,a)}finally{qn=!1,(vr!==null||at!==null)&&(Ll(),is())}}function ei(n,s){var a=n.stateNode;if(a===null)return null;var c=au(a);if(c===null)return null;a=c[s];e:switch(s){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,s,typeof a));return a}var os=!1;if(f)try{var as={};Object.defineProperty(as,"passive",{get:function(){os=!0}}),window.addEventListener("test",as,as),window.removeEventListener("test",as,as)}catch{os=!1}function jl(n,s,a,c,d,p,v,S,N){var U=Array.prototype.slice.call(arguments,3);try{s.apply(a,U)}catch(Y){this.onError(Y)}}var wr=!1,Wn=null,Hi=!1,_n=null,Fl={onError:function(n){wr=!0,Wn=n}};function Ul(n,s,a,c,d,p,v,S,N){wr=!1,Wn=null,jl.apply(Fl,arguments)}function ea(n,s,a,c,d,p,v,S,N){if(Ul.apply(this,arguments),wr){if(wr){var U=Wn;wr=!1,Wn=null}else throw Error(t(198));Hi||(Hi=!0,_n=U)}}function bn(n){var s=n,a=n;if(n.alternate)for(;s.return;)s=s.return;else{n=s;do s=n,(s.flags&4098)!==0&&(a=s.return),n=s.return;while(n)}return s.tag===3?a:null}function ta(n){if(n.tag===13){var s=n.memoizedState;if(s===null&&(n=n.alternate,n!==null&&(s=n.memoizedState)),s!==null)return s.dehydrated}return null}function zl(n){if(bn(n)!==n)throw Error(t(188))}function Bl(n){var s=n.alternate;if(!s){if(s=bn(n),s===null)throw Error(t(188));return s!==n?null:n}for(var a=n,c=s;;){var d=a.return;if(d===null)break;var p=d.alternate;if(p===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===p.child){for(p=d.child;p;){if(p===a)return zl(d),n;if(p===c)return zl(d),s;p=p.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=p;else{for(var v=!1,S=d.child;S;){if(S===a){v=!0,a=d,c=p;break}if(S===c){v=!0,c=d,a=p;break}S=S.sibling}if(!v){for(S=p.child;S;){if(S===a){v=!0,a=p,c=d;break}if(S===c){v=!0,c=p,a=d;break}S=S.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:s}function $l(n){return n=Bl(n),n!==null?ti(n):null}function ti(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var s=ti(n);if(s!==null)return s;n=n.sibling}return null}var na=e.unstable_scheduleCallback,qi=e.unstable_cancelCallback,ni=e.unstable_shouldYield,Er=e.unstable_requestPaint,Ye=e.unstable_now,gh=e.unstable_getCurrentPriorityLevel,Wi=e.unstable_ImmediatePriority,ra=e.unstable_UserBlockingPriority,ri=e.unstable_NormalPriority,sa=e.unstable_LowPriority,Ki=e.unstable_IdlePriority,si=null,an=null;function Hl(n){if(an&&typeof an.onCommitFiberRoot=="function")try{an.onCommitFiberRoot(si,n,void 0,(n.current.flags&128)===128)}catch{}}var ln=Math.clz32?Math.clz32:ii,Kn=Math.log,vn=Math.LN2;function ii(n){return n>>>=0,n===0?32:31-(Kn(n)/vn|0)|0}var Gn=64,ls=4194304;function Ue(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Tr(n,s){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,p=n.pingedLanes,v=a&268435455;if(v!==0){var S=v&~d;S!==0?c=Ue(S):(p&=v,p!==0&&(c=Ue(p)))}else v=a&~d,v!==0?c=Ue(v):p!==0&&(c=Ue(p));if(c===0)return 0;if(s!==0&&s!==c&&(s&d)===0&&(d=c&-c,p=s&-s,d>=p||d===16&&(p&4194240)!==0))return s;if((c&4)!==0&&(c|=a&16),s=n.entangledLanes,s!==0)for(n=n.entanglements,s&=c;0<s;)a=31-ln(s),d=1<<a,c|=n[a],s&=~d;return c}function oi(n,s){switch(n){case 1:case 2:case 4:return s+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return s+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ai(n,s){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,p=n.pendingLanes;0<p;){var v=31-ln(p),S=1<<v,N=d[v];N===-1?((S&a)===0||(S&c)!==0)&&(d[v]=oi(S,s)):N<=s&&(n.expiredLanes|=S),p&=~S}}function ia(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function oa(){var n=Gn;return Gn<<=1,(Gn&4194240)===0&&(Gn=64),n}function aa(n){for(var s=[],a=0;31>a;a++)s.push(n);return s}function li(n,s,a){n.pendingLanes|=s,s!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,s=31-ln(s),n[s]=a}function yh(n,s){var a=n.pendingLanes&~s;n.pendingLanes=s,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=s,n.mutableReadLanes&=s,n.entangledLanes&=s,s=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-ln(a),p=1<<d;s[d]=0,c[d]=-1,n[d]=-1,a&=~p}}function la(n,s){var a=n.entangledLanes|=s;for(n=n.entanglements;a;){var c=31-ln(a),d=1<<c;d&s|n[c]&s&&(n[c]|=s),a&=~d}}var Le=0;function Qn(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ua,Gi,ca,ha,da,Jn=!1,Qi=[],Yn=null,Xn=null,Dt=null,ui=new Map,Ir=new Map,un=[],ql="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function us(n,s){switch(n){case"focusin":case"focusout":Yn=null;break;case"dragenter":case"dragleave":Xn=null;break;case"mouseover":case"mouseout":Dt=null;break;case"pointerover":case"pointerout":ui.delete(s.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ir.delete(s.pointerId)}}function Dn(n,s,a,c,d,p){return n===null||n.nativeEvent!==p?(n={blockedOn:s,domEventName:a,eventSystemFlags:c,nativeEvent:p,targetContainers:[d]},s!==null&&(s=Aa(s),s!==null&&Gi(s)),n):(n.eventSystemFlags|=c,s=n.targetContainers,d!==null&&s.indexOf(d)===-1&&s.push(d),n)}function Wl(n,s,a,c,d){switch(s){case"focusin":return Yn=Dn(Yn,n,s,a,c,d),!0;case"dragenter":return Xn=Dn(Xn,n,s,a,c,d),!0;case"mouseover":return Dt=Dn(Dt,n,s,a,c,d),!0;case"pointerover":var p=d.pointerId;return ui.set(p,Dn(ui.get(p)||null,n,s,a,c,d)),!0;case"gotpointercapture":return p=d.pointerId,Ir.set(p,Dn(Ir.get(p)||null,n,s,a,c,d)),!0}return!1}function Ji(n){var s=fi(n.target);if(s!==null){var a=bn(s);if(a!==null){if(s=a.tag,s===13){if(s=ta(a),s!==null){n.blockedOn=s,da(n.priority,function(){ca(a)});return}}else if(s===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function We(n){if(n.blockedOn!==null)return!1;for(var s=n.targetContainers;0<s.length;){var a=Yi(n.domEventName,n.eventSystemFlags,s[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);rs=c,a.target.dispatchEvent(c),rs=null}else return s=Aa(a),s!==null&&Gi(s),n.blockedOn=a,!1;s.shift()}return!0}function Kl(n,s,a){We(n)&&a.delete(s)}function _h(){Jn=!1,Yn!==null&&We(Yn)&&(Yn=null),Xn!==null&&We(Xn)&&(Xn=null),Dt!==null&&We(Dt)&&(Dt=null),ui.forEach(Kl),Ir.forEach(Kl)}function cs(n,s){n.blockedOn===s&&(n.blockedOn=null,Jn||(Jn=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,_h)))}function hs(n){function s(d){return cs(d,n)}if(0<Qi.length){cs(Qi[0],n);for(var a=1;a<Qi.length;a++){var c=Qi[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Yn!==null&&cs(Yn,n),Xn!==null&&cs(Xn,n),Dt!==null&&cs(Dt,n),ui.forEach(s),Ir.forEach(s),a=0;a<un.length;a++)c=un[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<un.length&&(a=un[0],a.blockedOn===null);)Ji(a),a.blockedOn===null&&un.shift()}var xr=Te.ReactCurrentBatchConfig,Sr=!0;function Zn(n,s,a,c){var d=Le,p=xr.transition;xr.transition=null;try{Le=1,fa(n,s,a,c)}finally{Le=d,xr.transition=p}}function Gl(n,s,a,c){var d=Le,p=xr.transition;xr.transition=null;try{Le=4,fa(n,s,a,c)}finally{Le=d,xr.transition=p}}function fa(n,s,a,c){if(Sr){var d=Yi(n,s,a,c);if(d===null)Rh(n,s,c,er,a),us(n,c);else if(Wl(d,n,s,a,c))c.stopPropagation();else if(us(n,c),s&4&&-1<ql.indexOf(n)){for(;d!==null;){var p=Aa(d);if(p!==null&&ua(p),p=Yi(n,s,a,c),p===null&&Rh(n,s,c,er,a),p===d)break;d=p}d!==null&&c.stopPropagation()}else Rh(n,s,c,null,a)}}var er=null;function Yi(n,s,a,c){if(er=null,n=$i(c),n=fi(n),n!==null)if(s=bn(n),s===null)n=null;else if(a=s.tag,a===13){if(n=ta(s),n!==null)return n;n=null}else if(a===3){if(s.stateNode.current.memoizedState.isDehydrated)return s.tag===3?s.stateNode.containerInfo:null;n=null}else s!==n&&(n=null);return er=n,null}function Xi(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(gh()){case Wi:return 1;case ra:return 4;case ri:case sa:return 16;case Ki:return 536870912;default:return 16}default:return 16}}var cn=null,Zi=null,Ar=null;function Ql(){if(Ar)return Ar;var n,s=Zi,a=s.length,c,d="value"in cn?cn.value:cn.textContent,p=d.length;for(n=0;n<a&&s[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&s[a-c]===d[p-c];c++);return Ar=d.slice(n,1<c?1-c:void 0)}function ci(n){var s=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&s===13&&(n=13)):n=s,n===10&&(n=13),32<=n||n===13?n:0}function tr(){return!0}function pa(){return!1}function Ut(n){function s(a,c,d,p,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=p,this.target=v,this.currentTarget=null;for(var S in n)n.hasOwnProperty(S)&&(a=n[S],this[S]=a?a(p):p[S]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?tr:pa,this.isPropagationStopped=pa,this}return Z(s.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=tr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=tr)},persist:function(){},isPersistent:tr}),s}var nr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},hi=Ut(nr),ds=Z({},nr,{view:0,detail:0}),eo=Ut(ds),to,no,hn,di=Z({},ds,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ce,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==hn&&(hn&&n.type==="mousemove"?(to=n.screenX-hn.screenX,no=n.screenY-hn.screenY):no=to=0,hn=n),to)},movementY:function(n){return"movementY"in n?n.movementY:no}}),ma=Ut(di),Jl=Z({},di,{dataTransfer:0}),Yl=Ut(Jl),ro=Z({},ds,{relatedTarget:0}),Vt=Ut(ro),Xl=Z({},nr,{animationName:0,elapsedTime:0,pseudoElement:0}),Zl=Ut(Xl),fs=Z({},nr,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),u=Ut(fs),m=Z({},nr,{data:0}),y=Ut(m),T={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},M={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},z={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function te(n){var s=this.nativeEvent;return s.getModifierState?s.getModifierState(n):(n=z[n])?!!s[n]:!1}function Ce(){return te}var ht=Z({},ds,{key:function(n){if(n.key){var s=T[n.key]||n.key;if(s!=="Unidentified")return s}return n.type==="keypress"?(n=ci(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?M[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ce,charCode:function(n){return n.type==="keypress"?ci(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ci(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Be=Ut(ht),yt=Z({},di,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),dn=Ut(yt),kr=Z({},ds,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ce}),rr=Ut(kr),sr=Z({},nr,{propertyName:0,elapsedTime:0,pseudoElement:0}),so=Ut(sr),ga=Z({},di,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Cw=Ut(ga),Rw=[9,13,27,32],vh=f&&"CompositionEvent"in window,ya=null;f&&"documentMode"in document&&(ya=document.documentMode);var Pw=f&&"TextEvent"in window&&!ya,Dp=f&&(!vh||ya&&8<ya&&11>=ya),Vp=" ",Op=!1;function Lp(n,s){switch(n){case"keyup":return Rw.indexOf(s.keyCode)!==-1;case"keydown":return s.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mp(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var io=!1;function Nw(n,s){switch(n){case"compositionend":return Mp(s);case"keypress":return s.which!==32?null:(Op=!0,Vp);case"textInput":return n=s.data,n===Vp&&Op?null:n;default:return null}}function bw(n,s){if(io)return n==="compositionend"||!vh&&Lp(n,s)?(n=Ql(),Ar=Zi=cn=null,io=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(s.ctrlKey||s.altKey||s.metaKey)||s.ctrlKey&&s.altKey){if(s.char&&1<s.char.length)return s.char;if(s.which)return String.fromCharCode(s.which)}return null;case"compositionend":return Dp&&s.locale!=="ko"?null:s.data;default:return null}}var Dw={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jp(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s==="input"?!!Dw[n.type]:s==="textarea"}function Fp(n,s,a,c){ss(c),s=su(s,"onChange"),0<s.length&&(a=new hi("onChange","change",null,a,c),n.push({event:a,listeners:s}))}var _a=null,va=null;function Vw(n){rm(n,0)}function eu(n){var s=co(n);if(ot(s))return n}function Ow(n,s){if(n==="change")return s}var Up=!1;if(f){var wh;if(f){var Eh="oninput"in document;if(!Eh){var zp=document.createElement("div");zp.setAttribute("oninput","return;"),Eh=typeof zp.oninput=="function"}wh=Eh}else wh=!1;Up=wh&&(!document.documentMode||9<document.documentMode)}function Bp(){_a&&(_a.detachEvent("onpropertychange",$p),va=_a=null)}function $p(n){if(n.propertyName==="value"&&eu(va)){var s=[];Fp(s,va,n,$i(n)),Ml(Vw,s)}}function Lw(n,s,a){n==="focusin"?(Bp(),_a=s,va=a,_a.attachEvent("onpropertychange",$p)):n==="focusout"&&Bp()}function Mw(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return eu(va)}function jw(n,s){if(n==="click")return eu(s)}function Fw(n,s){if(n==="input"||n==="change")return eu(s)}function Uw(n,s){return n===s&&(n!==0||1/n===1/s)||n!==n&&s!==s}var Vn=typeof Object.is=="function"?Object.is:Uw;function wa(n,s){if(Vn(n,s))return!0;if(typeof n!="object"||n===null||typeof s!="object"||s===null)return!1;var a=Object.keys(n),c=Object.keys(s);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(s,d)||!Vn(n[d],s[d]))return!1}return!0}function Hp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function qp(n,s){var a=Hp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=s&&c>=s)return{node:a,offset:s-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Hp(a)}}function Wp(n,s){return n&&s?n===s?!0:n&&n.nodeType===3?!1:s&&s.nodeType===3?Wp(n,s.parentNode):"contains"in n?n.contains(s):n.compareDocumentPosition?!!(n.compareDocumentPosition(s)&16):!1:!1}function Kp(){for(var n=window,s=qe();s instanceof n.HTMLIFrameElement;){try{var a=typeof s.contentWindow.location.href=="string"}catch{a=!1}if(a)n=s.contentWindow;else break;s=qe(n.document)}return s}function Th(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s&&(s==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||s==="textarea"||n.contentEditable==="true")}function zw(n){var s=Kp(),a=n.focusedElem,c=n.selectionRange;if(s!==a&&a&&a.ownerDocument&&Wp(a.ownerDocument.documentElement,a)){if(c!==null&&Th(a)){if(s=c.start,n=c.end,n===void 0&&(n=s),"selectionStart"in a)a.selectionStart=s,a.selectionEnd=Math.min(n,a.value.length);else if(n=(s=a.ownerDocument||document)&&s.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,p=Math.min(c.start,d);c=c.end===void 0?p:Math.min(c.end,d),!n.extend&&p>c&&(d=c,c=p,p=d),d=qp(a,p);var v=qp(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(s=s.createRange(),s.setStart(d.node,d.offset),n.removeAllRanges(),p>c?(n.addRange(s),n.extend(v.node,v.offset)):(s.setEnd(v.node,v.offset),n.addRange(s)))}}for(s=[],n=a;n=n.parentNode;)n.nodeType===1&&s.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<s.length;a++)n=s[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Bw=f&&"documentMode"in document&&11>=document.documentMode,oo=null,Ih=null,Ea=null,xh=!1;function Gp(n,s,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;xh||oo==null||oo!==qe(c)||(c=oo,"selectionStart"in c&&Th(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ea&&wa(Ea,c)||(Ea=c,c=su(Ih,"onSelect"),0<c.length&&(s=new hi("onSelect","select",null,s,a),n.push({event:s,listeners:c}),s.target=oo)))}function tu(n,s){var a={};return a[n.toLowerCase()]=s.toLowerCase(),a["Webkit"+n]="webkit"+s,a["Moz"+n]="moz"+s,a}var ao={animationend:tu("Animation","AnimationEnd"),animationiteration:tu("Animation","AnimationIteration"),animationstart:tu("Animation","AnimationStart"),transitionend:tu("Transition","TransitionEnd")},Sh={},Qp={};f&&(Qp=document.createElement("div").style,"AnimationEvent"in window||(delete ao.animationend.animation,delete ao.animationiteration.animation,delete ao.animationstart.animation),"TransitionEvent"in window||delete ao.transitionend.transition);function nu(n){if(Sh[n])return Sh[n];if(!ao[n])return n;var s=ao[n],a;for(a in s)if(s.hasOwnProperty(a)&&a in Qp)return Sh[n]=s[a];return n}var Jp=nu("animationend"),Yp=nu("animationiteration"),Xp=nu("animationstart"),Zp=nu("transitionend"),em=new Map,tm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ps(n,s){em.set(n,s),l(s,[n])}for(var Ah=0;Ah<tm.length;Ah++){var kh=tm[Ah],$w=kh.toLowerCase(),Hw=kh[0].toUpperCase()+kh.slice(1);ps($w,"on"+Hw)}ps(Jp,"onAnimationEnd"),ps(Yp,"onAnimationIteration"),ps(Xp,"onAnimationStart"),ps("dblclick","onDoubleClick"),ps("focusin","onFocus"),ps("focusout","onBlur"),ps(Zp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ta="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),qw=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ta));function nm(n,s,a){var c=n.type||"unknown-event";n.currentTarget=a,ea(c,s,void 0,n),n.currentTarget=null}function rm(n,s){s=(s&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var p=void 0;if(s)for(var v=c.length-1;0<=v;v--){var S=c[v],N=S.instance,U=S.currentTarget;if(S=S.listener,N!==p&&d.isPropagationStopped())break e;nm(d,S,U),p=N}else for(v=0;v<c.length;v++){if(S=c[v],N=S.instance,U=S.currentTarget,S=S.listener,N!==p&&d.isPropagationStopped())break e;nm(d,S,U),p=N}}}if(Hi)throw n=_n,Hi=!1,_n=null,n}function Xe(n,s){var a=s[Oh];a===void 0&&(a=s[Oh]=new Set);var c=n+"__bubble";a.has(c)||(sm(s,n,2,!1),a.add(c))}function Ch(n,s,a){var c=0;s&&(c|=4),sm(a,n,c,s)}var ru="_reactListening"+Math.random().toString(36).slice(2);function Ia(n){if(!n[ru]){n[ru]=!0,i.forEach(function(a){a!=="selectionchange"&&(qw.has(a)||Ch(a,!1,n),Ch(a,!0,n))});var s=n.nodeType===9?n:n.ownerDocument;s===null||s[ru]||(s[ru]=!0,Ch("selectionchange",!1,s))}}function sm(n,s,a,c){switch(Xi(s)){case 1:var d=Zn;break;case 4:d=Gl;break;default:d=fa}a=d.bind(null,s,a,n),d=void 0,!os||s!=="touchstart"&&s!=="touchmove"&&s!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(s,a,{capture:!0,passive:d}):n.addEventListener(s,a,!0):d!==void 0?n.addEventListener(s,a,{passive:d}):n.addEventListener(s,a,!1)}function Rh(n,s,a,c,d){var p=c;if((s&1)===0&&(s&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var S=c.stateNode.containerInfo;if(S===d||S.nodeType===8&&S.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var N=v.tag;if((N===3||N===4)&&(N=v.stateNode.containerInfo,N===d||N.nodeType===8&&N.parentNode===d))return;v=v.return}for(;S!==null;){if(v=fi(S),v===null)return;if(N=v.tag,N===5||N===6){c=p=v;continue e}S=S.parentNode}}c=c.return}Ml(function(){var U=p,Y=$i(a),X=[];e:{var J=em.get(n);if(J!==void 0){var oe=hi,ue=n;switch(n){case"keypress":if(ci(a)===0)break e;case"keydown":case"keyup":oe=Be;break;case"focusin":ue="focus",oe=Vt;break;case"focusout":ue="blur",oe=Vt;break;case"beforeblur":case"afterblur":oe=Vt;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":oe=ma;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":oe=Yl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":oe=rr;break;case Jp:case Yp:case Xp:oe=Zl;break;case Zp:oe=so;break;case"scroll":oe=eo;break;case"wheel":oe=Cw;break;case"copy":case"cut":case"paste":oe=u;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":oe=dn}var he=(s&4)!==0,dt=!he&&n==="scroll",L=he?J!==null?J+"Capture":null:J;he=[];for(var D=U,F;D!==null;){F=D;var ee=F.stateNode;if(F.tag===5&&ee!==null&&(F=ee,L!==null&&(ee=ei(D,L),ee!=null&&he.push(xa(D,ee,F)))),dt)break;D=D.return}0<he.length&&(J=new oe(J,ue,null,a,Y),X.push({event:J,listeners:he}))}}if((s&7)===0){e:{if(J=n==="mouseover"||n==="pointerover",oe=n==="mouseout"||n==="pointerout",J&&a!==rs&&(ue=a.relatedTarget||a.fromElement)&&(fi(ue)||ue[Cr]))break e;if((oe||J)&&(J=Y.window===Y?Y:(J=Y.ownerDocument)?J.defaultView||J.parentWindow:window,oe?(ue=a.relatedTarget||a.toElement,oe=U,ue=ue?fi(ue):null,ue!==null&&(dt=bn(ue),ue!==dt||ue.tag!==5&&ue.tag!==6)&&(ue=null)):(oe=null,ue=U),oe!==ue)){if(he=ma,ee="onMouseLeave",L="onMouseEnter",D="mouse",(n==="pointerout"||n==="pointerover")&&(he=dn,ee="onPointerLeave",L="onPointerEnter",D="pointer"),dt=oe==null?J:co(oe),F=ue==null?J:co(ue),J=new he(ee,D+"leave",oe,a,Y),J.target=dt,J.relatedTarget=F,ee=null,fi(Y)===U&&(he=new he(L,D+"enter",ue,a,Y),he.target=F,he.relatedTarget=dt,ee=he),dt=ee,oe&&ue)t:{for(he=oe,L=ue,D=0,F=he;F;F=lo(F))D++;for(F=0,ee=L;ee;ee=lo(ee))F++;for(;0<D-F;)he=lo(he),D--;for(;0<F-D;)L=lo(L),F--;for(;D--;){if(he===L||L!==null&&he===L.alternate)break t;he=lo(he),L=lo(L)}he=null}else he=null;oe!==null&&im(X,J,oe,he,!1),ue!==null&&dt!==null&&im(X,dt,ue,he,!0)}}e:{if(J=U?co(U):window,oe=J.nodeName&&J.nodeName.toLowerCase(),oe==="select"||oe==="input"&&J.type==="file")var fe=Ow;else if(jp(J))if(Up)fe=Fw;else{fe=Mw;var ve=Lw}else(oe=J.nodeName)&&oe.toLowerCase()==="input"&&(J.type==="checkbox"||J.type==="radio")&&(fe=jw);if(fe&&(fe=fe(n,U))){Fp(X,fe,a,Y);break e}ve&&ve(n,J,U),n==="focusout"&&(ve=J._wrapperState)&&ve.controlled&&J.type==="number"&&gt(J,"number",J.value)}switch(ve=U?co(U):window,n){case"focusin":(jp(ve)||ve.contentEditable==="true")&&(oo=ve,Ih=U,Ea=null);break;case"focusout":Ea=Ih=oo=null;break;case"mousedown":xh=!0;break;case"contextmenu":case"mouseup":case"dragend":xh=!1,Gp(X,a,Y);break;case"selectionchange":if(Bw)break;case"keydown":case"keyup":Gp(X,a,Y)}var we;if(vh)e:{switch(n){case"compositionstart":var Ae="onCompositionStart";break e;case"compositionend":Ae="onCompositionEnd";break e;case"compositionupdate":Ae="onCompositionUpdate";break e}Ae=void 0}else io?Lp(n,a)&&(Ae="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(Ae="onCompositionStart");Ae&&(Dp&&a.locale!=="ko"&&(io||Ae!=="onCompositionStart"?Ae==="onCompositionEnd"&&io&&(we=Ql()):(cn=Y,Zi="value"in cn?cn.value:cn.textContent,io=!0)),ve=su(U,Ae),0<ve.length&&(Ae=new y(Ae,n,null,a,Y),X.push({event:Ae,listeners:ve}),we?Ae.data=we:(we=Mp(a),we!==null&&(Ae.data=we)))),(we=Pw?Nw(n,a):bw(n,a))&&(U=su(U,"onBeforeInput"),0<U.length&&(Y=new y("onBeforeInput","beforeinput",null,a,Y),X.push({event:Y,listeners:U}),Y.data=we))}rm(X,s)})}function xa(n,s,a){return{instance:n,listener:s,currentTarget:a}}function su(n,s){for(var a=s+"Capture",c=[];n!==null;){var d=n,p=d.stateNode;d.tag===5&&p!==null&&(d=p,p=ei(n,a),p!=null&&c.unshift(xa(n,p,d)),p=ei(n,s),p!=null&&c.push(xa(n,p,d))),n=n.return}return c}function lo(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function im(n,s,a,c,d){for(var p=s._reactName,v=[];a!==null&&a!==c;){var S=a,N=S.alternate,U=S.stateNode;if(N!==null&&N===c)break;S.tag===5&&U!==null&&(S=U,d?(N=ei(a,p),N!=null&&v.unshift(xa(a,N,S))):d||(N=ei(a,p),N!=null&&v.push(xa(a,N,S)))),a=a.return}v.length!==0&&n.push({event:s,listeners:v})}var Ww=/\r\n?/g,Kw=/\u0000|\uFFFD/g;function om(n){return(typeof n=="string"?n:""+n).replace(Ww,`
`).replace(Kw,"")}function iu(n,s,a){if(s=om(s),om(n)!==s&&a)throw Error(t(425))}function ou(){}var Ph=null,Nh=null;function bh(n,s){return n==="textarea"||n==="noscript"||typeof s.children=="string"||typeof s.children=="number"||typeof s.dangerouslySetInnerHTML=="object"&&s.dangerouslySetInnerHTML!==null&&s.dangerouslySetInnerHTML.__html!=null}var Dh=typeof setTimeout=="function"?setTimeout:void 0,Gw=typeof clearTimeout=="function"?clearTimeout:void 0,am=typeof Promise=="function"?Promise:void 0,Qw=typeof queueMicrotask=="function"?queueMicrotask:typeof am<"u"?function(n){return am.resolve(null).then(n).catch(Jw)}:Dh;function Jw(n){setTimeout(function(){throw n})}function Vh(n,s){var a=s,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),hs(s);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);hs(s)}function ms(n){for(;n!=null;n=n.nextSibling){var s=n.nodeType;if(s===1||s===3)break;if(s===8){if(s=n.data,s==="$"||s==="$!"||s==="$?")break;if(s==="/$")return null}}return n}function lm(n){n=n.previousSibling;for(var s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(s===0)return n;s--}else a==="/$"&&s++}n=n.previousSibling}return null}var uo=Math.random().toString(36).slice(2),ir="__reactFiber$"+uo,Sa="__reactProps$"+uo,Cr="__reactContainer$"+uo,Oh="__reactEvents$"+uo,Yw="__reactListeners$"+uo,Xw="__reactHandles$"+uo;function fi(n){var s=n[ir];if(s)return s;for(var a=n.parentNode;a;){if(s=a[Cr]||a[ir]){if(a=s.alternate,s.child!==null||a!==null&&a.child!==null)for(n=lm(n);n!==null;){if(a=n[ir])return a;n=lm(n)}return s}n=a,a=n.parentNode}return null}function Aa(n){return n=n[ir]||n[Cr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function co(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function au(n){return n[Sa]||null}var Lh=[],ho=-1;function gs(n){return{current:n}}function Ze(n){0>ho||(n.current=Lh[ho],Lh[ho]=null,ho--)}function Ge(n,s){ho++,Lh[ho]=n.current,n.current=s}var ys={},zt=gs(ys),Yt=gs(!1),pi=ys;function fo(n,s){var a=n.type.contextTypes;if(!a)return ys;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===s)return c.__reactInternalMemoizedMaskedChildContext;var d={},p;for(p in a)d[p]=s[p];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=s,n.__reactInternalMemoizedMaskedChildContext=d),d}function Xt(n){return n=n.childContextTypes,n!=null}function lu(){Ze(Yt),Ze(zt)}function um(n,s,a){if(zt.current!==ys)throw Error(t(168));Ge(zt,s),Ge(Yt,a)}function cm(n,s,a){var c=n.stateNode;if(s=s.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in s))throw Error(t(108,Se(n)||"Unknown",d));return Z({},a,c)}function uu(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||ys,pi=zt.current,Ge(zt,n),Ge(Yt,Yt.current),!0}function hm(n,s,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=cm(n,s,pi),c.__reactInternalMemoizedMergedChildContext=n,Ze(Yt),Ze(zt),Ge(zt,n)):Ze(Yt),Ge(Yt,a)}var Rr=null,cu=!1,Mh=!1;function dm(n){Rr===null?Rr=[n]:Rr.push(n)}function Zw(n){cu=!0,dm(n)}function _s(){if(!Mh&&Rr!==null){Mh=!0;var n=0,s=Le;try{var a=Rr;for(Le=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Rr=null,cu=!1}catch(d){throw Rr!==null&&(Rr=Rr.slice(n+1)),na(Wi,_s),d}finally{Le=s,Mh=!1}}return null}var po=[],mo=0,hu=null,du=0,wn=[],En=0,mi=null,Pr=1,Nr="";function gi(n,s){po[mo++]=du,po[mo++]=hu,hu=n,du=s}function fm(n,s,a){wn[En++]=Pr,wn[En++]=Nr,wn[En++]=mi,mi=n;var c=Pr;n=Nr;var d=32-ln(c)-1;c&=~(1<<d),a+=1;var p=32-ln(s)+d;if(30<p){var v=d-d%5;p=(c&(1<<v)-1).toString(32),c>>=v,d-=v,Pr=1<<32-ln(s)+d|a<<d|c,Nr=p+n}else Pr=1<<p|a<<d|c,Nr=n}function jh(n){n.return!==null&&(gi(n,1),fm(n,1,0))}function Fh(n){for(;n===hu;)hu=po[--mo],po[mo]=null,du=po[--mo],po[mo]=null;for(;n===mi;)mi=wn[--En],wn[En]=null,Nr=wn[--En],wn[En]=null,Pr=wn[--En],wn[En]=null}var fn=null,pn=null,tt=!1,On=null;function pm(n,s){var a=Sn(5,null,null,0);a.elementType="DELETED",a.stateNode=s,a.return=n,s=n.deletions,s===null?(n.deletions=[a],n.flags|=16):s.push(a)}function mm(n,s){switch(n.tag){case 5:var a=n.type;return s=s.nodeType!==1||a.toLowerCase()!==s.nodeName.toLowerCase()?null:s,s!==null?(n.stateNode=s,fn=n,pn=ms(s.firstChild),!0):!1;case 6:return s=n.pendingProps===""||s.nodeType!==3?null:s,s!==null?(n.stateNode=s,fn=n,pn=null,!0):!1;case 13:return s=s.nodeType!==8?null:s,s!==null?(a=mi!==null?{id:Pr,overflow:Nr}:null,n.memoizedState={dehydrated:s,treeContext:a,retryLane:1073741824},a=Sn(18,null,null,0),a.stateNode=s,a.return=n,n.child=a,fn=n,pn=null,!0):!1;default:return!1}}function Uh(n){return(n.mode&1)!==0&&(n.flags&128)===0}function zh(n){if(tt){var s=pn;if(s){var a=s;if(!mm(n,s)){if(Uh(n))throw Error(t(418));s=ms(a.nextSibling);var c=fn;s&&mm(n,s)?pm(c,a):(n.flags=n.flags&-4097|2,tt=!1,fn=n)}}else{if(Uh(n))throw Error(t(418));n.flags=n.flags&-4097|2,tt=!1,fn=n}}}function gm(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;fn=n}function fu(n){if(n!==fn)return!1;if(!tt)return gm(n),tt=!0,!1;var s;if((s=n.tag!==3)&&!(s=n.tag!==5)&&(s=n.type,s=s!=="head"&&s!=="body"&&!bh(n.type,n.memoizedProps)),s&&(s=pn)){if(Uh(n))throw ym(),Error(t(418));for(;s;)pm(n,s),s=ms(s.nextSibling)}if(gm(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(s===0){pn=ms(n.nextSibling);break e}s--}else a!=="$"&&a!=="$!"&&a!=="$?"||s++}n=n.nextSibling}pn=null}}else pn=fn?ms(n.stateNode.nextSibling):null;return!0}function ym(){for(var n=pn;n;)n=ms(n.nextSibling)}function go(){pn=fn=null,tt=!1}function Bh(n){On===null?On=[n]:On.push(n)}var eE=Te.ReactCurrentBatchConfig;function ka(n,s,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,p=""+n;return s!==null&&s.ref!==null&&typeof s.ref=="function"&&s.ref._stringRef===p?s.ref:(s=function(v){var S=d.refs;v===null?delete S[p]:S[p]=v},s._stringRef=p,s)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function pu(n,s){throw n=Object.prototype.toString.call(s),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":n))}function _m(n){var s=n._init;return s(n._payload)}function vm(n){function s(L,D){if(n){var F=L.deletions;F===null?(L.deletions=[D],L.flags|=16):F.push(D)}}function a(L,D){if(!n)return null;for(;D!==null;)s(L,D),D=D.sibling;return null}function c(L,D){for(L=new Map;D!==null;)D.key!==null?L.set(D.key,D):L.set(D.index,D),D=D.sibling;return L}function d(L,D){return L=As(L,D),L.index=0,L.sibling=null,L}function p(L,D,F){return L.index=F,n?(F=L.alternate,F!==null?(F=F.index,F<D?(L.flags|=2,D):F):(L.flags|=2,D)):(L.flags|=1048576,D)}function v(L){return n&&L.alternate===null&&(L.flags|=2),L}function S(L,D,F,ee){return D===null||D.tag!==6?(D=Dd(F,L.mode,ee),D.return=L,D):(D=d(D,F),D.return=L,D)}function N(L,D,F,ee){var fe=F.type;return fe===k?Y(L,D,F.props.children,ee,F.key):D!==null&&(D.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===kt&&_m(fe)===D.type)?(ee=d(D,F.props),ee.ref=ka(L,D,F),ee.return=L,ee):(ee=ju(F.type,F.key,F.props,null,L.mode,ee),ee.ref=ka(L,D,F),ee.return=L,ee)}function U(L,D,F,ee){return D===null||D.tag!==4||D.stateNode.containerInfo!==F.containerInfo||D.stateNode.implementation!==F.implementation?(D=Vd(F,L.mode,ee),D.return=L,D):(D=d(D,F.children||[]),D.return=L,D)}function Y(L,D,F,ee,fe){return D===null||D.tag!==7?(D=xi(F,L.mode,ee,fe),D.return=L,D):(D=d(D,F),D.return=L,D)}function X(L,D,F){if(typeof D=="string"&&D!==""||typeof D=="number")return D=Dd(""+D,L.mode,F),D.return=L,D;if(typeof D=="object"&&D!==null){switch(D.$$typeof){case Ee:return F=ju(D.type,D.key,D.props,null,L.mode,F),F.ref=ka(L,null,D),F.return=L,F;case de:return D=Vd(D,L.mode,F),D.return=L,D;case kt:var ee=D._init;return X(L,ee(D._payload),F)}if(ct(D)||ne(D))return D=xi(D,L.mode,F,null),D.return=L,D;pu(L,D)}return null}function J(L,D,F,ee){var fe=D!==null?D.key:null;if(typeof F=="string"&&F!==""||typeof F=="number")return fe!==null?null:S(L,D,""+F,ee);if(typeof F=="object"&&F!==null){switch(F.$$typeof){case Ee:return F.key===fe?N(L,D,F,ee):null;case de:return F.key===fe?U(L,D,F,ee):null;case kt:return fe=F._init,J(L,D,fe(F._payload),ee)}if(ct(F)||ne(F))return fe!==null?null:Y(L,D,F,ee,null);pu(L,F)}return null}function oe(L,D,F,ee,fe){if(typeof ee=="string"&&ee!==""||typeof ee=="number")return L=L.get(F)||null,S(D,L,""+ee,fe);if(typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case Ee:return L=L.get(ee.key===null?F:ee.key)||null,N(D,L,ee,fe);case de:return L=L.get(ee.key===null?F:ee.key)||null,U(D,L,ee,fe);case kt:var ve=ee._init;return oe(L,D,F,ve(ee._payload),fe)}if(ct(ee)||ne(ee))return L=L.get(F)||null,Y(D,L,ee,fe,null);pu(D,ee)}return null}function ue(L,D,F,ee){for(var fe=null,ve=null,we=D,Ae=D=0,Pt=null;we!==null&&Ae<F.length;Ae++){we.index>Ae?(Pt=we,we=null):Pt=we.sibling;var Fe=J(L,we,F[Ae],ee);if(Fe===null){we===null&&(we=Pt);break}n&&we&&Fe.alternate===null&&s(L,we),D=p(Fe,D,Ae),ve===null?fe=Fe:ve.sibling=Fe,ve=Fe,we=Pt}if(Ae===F.length)return a(L,we),tt&&gi(L,Ae),fe;if(we===null){for(;Ae<F.length;Ae++)we=X(L,F[Ae],ee),we!==null&&(D=p(we,D,Ae),ve===null?fe=we:ve.sibling=we,ve=we);return tt&&gi(L,Ae),fe}for(we=c(L,we);Ae<F.length;Ae++)Pt=oe(we,L,Ae,F[Ae],ee),Pt!==null&&(n&&Pt.alternate!==null&&we.delete(Pt.key===null?Ae:Pt.key),D=p(Pt,D,Ae),ve===null?fe=Pt:ve.sibling=Pt,ve=Pt);return n&&we.forEach(function(ks){return s(L,ks)}),tt&&gi(L,Ae),fe}function he(L,D,F,ee){var fe=ne(F);if(typeof fe!="function")throw Error(t(150));if(F=fe.call(F),F==null)throw Error(t(151));for(var ve=fe=null,we=D,Ae=D=0,Pt=null,Fe=F.next();we!==null&&!Fe.done;Ae++,Fe=F.next()){we.index>Ae?(Pt=we,we=null):Pt=we.sibling;var ks=J(L,we,Fe.value,ee);if(ks===null){we===null&&(we=Pt);break}n&&we&&ks.alternate===null&&s(L,we),D=p(ks,D,Ae),ve===null?fe=ks:ve.sibling=ks,ve=ks,we=Pt}if(Fe.done)return a(L,we),tt&&gi(L,Ae),fe;if(we===null){for(;!Fe.done;Ae++,Fe=F.next())Fe=X(L,Fe.value,ee),Fe!==null&&(D=p(Fe,D,Ae),ve===null?fe=Fe:ve.sibling=Fe,ve=Fe);return tt&&gi(L,Ae),fe}for(we=c(L,we);!Fe.done;Ae++,Fe=F.next())Fe=oe(we,L,Ae,Fe.value,ee),Fe!==null&&(n&&Fe.alternate!==null&&we.delete(Fe.key===null?Ae:Fe.key),D=p(Fe,D,Ae),ve===null?fe=Fe:ve.sibling=Fe,ve=Fe);return n&&we.forEach(function(DE){return s(L,DE)}),tt&&gi(L,Ae),fe}function dt(L,D,F,ee){if(typeof F=="object"&&F!==null&&F.type===k&&F.key===null&&(F=F.props.children),typeof F=="object"&&F!==null){switch(F.$$typeof){case Ee:e:{for(var fe=F.key,ve=D;ve!==null;){if(ve.key===fe){if(fe=F.type,fe===k){if(ve.tag===7){a(L,ve.sibling),D=d(ve,F.props.children),D.return=L,L=D;break e}}else if(ve.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===kt&&_m(fe)===ve.type){a(L,ve.sibling),D=d(ve,F.props),D.ref=ka(L,ve,F),D.return=L,L=D;break e}a(L,ve);break}else s(L,ve);ve=ve.sibling}F.type===k?(D=xi(F.props.children,L.mode,ee,F.key),D.return=L,L=D):(ee=ju(F.type,F.key,F.props,null,L.mode,ee),ee.ref=ka(L,D,F),ee.return=L,L=ee)}return v(L);case de:e:{for(ve=F.key;D!==null;){if(D.key===ve)if(D.tag===4&&D.stateNode.containerInfo===F.containerInfo&&D.stateNode.implementation===F.implementation){a(L,D.sibling),D=d(D,F.children||[]),D.return=L,L=D;break e}else{a(L,D);break}else s(L,D);D=D.sibling}D=Vd(F,L.mode,ee),D.return=L,L=D}return v(L);case kt:return ve=F._init,dt(L,D,ve(F._payload),ee)}if(ct(F))return ue(L,D,F,ee);if(ne(F))return he(L,D,F,ee);pu(L,F)}return typeof F=="string"&&F!==""||typeof F=="number"?(F=""+F,D!==null&&D.tag===6?(a(L,D.sibling),D=d(D,F),D.return=L,L=D):(a(L,D),D=Dd(F,L.mode,ee),D.return=L,L=D),v(L)):a(L,D)}return dt}var yo=vm(!0),wm=vm(!1),mu=gs(null),gu=null,_o=null,$h=null;function Hh(){$h=_o=gu=null}function qh(n){var s=mu.current;Ze(mu),n._currentValue=s}function Wh(n,s,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&s)!==s?(n.childLanes|=s,c!==null&&(c.childLanes|=s)):c!==null&&(c.childLanes&s)!==s&&(c.childLanes|=s),n===a)break;n=n.return}}function vo(n,s){gu=n,$h=_o=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&s)!==0&&(Zt=!0),n.firstContext=null)}function Tn(n){var s=n._currentValue;if($h!==n)if(n={context:n,memoizedValue:s,next:null},_o===null){if(gu===null)throw Error(t(308));_o=n,gu.dependencies={lanes:0,firstContext:n}}else _o=_o.next=n;return s}var yi=null;function Kh(n){yi===null?yi=[n]:yi.push(n)}function Em(n,s,a,c){var d=s.interleaved;return d===null?(a.next=a,Kh(s)):(a.next=d.next,d.next=a),s.interleaved=a,br(n,c)}function br(n,s){n.lanes|=s;var a=n.alternate;for(a!==null&&(a.lanes|=s),a=n,n=n.return;n!==null;)n.childLanes|=s,a=n.alternate,a!==null&&(a.childLanes|=s),a=n,n=n.return;return a.tag===3?a.stateNode:null}var vs=!1;function Gh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Tm(n,s){n=n.updateQueue,s.updateQueue===n&&(s.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Dr(n,s){return{eventTime:n,lane:s,tag:0,payload:null,callback:null,next:null}}function ws(n,s,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(je&2)!==0){var d=c.pending;return d===null?s.next=s:(s.next=d.next,d.next=s),c.pending=s,br(n,a)}return d=c.interleaved,d===null?(s.next=s,Kh(c)):(s.next=d.next,d.next=s),c.interleaved=s,br(n,a)}function yu(n,s,a){if(s=s.updateQueue,s!==null&&(s=s.shared,(a&4194240)!==0)){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,la(n,a)}}function Im(n,s){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,p=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};p===null?d=p=v:p=p.next=v,a=a.next}while(a!==null);p===null?d=p=s:p=p.next=s}else d=p=s;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:p,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=s:n.next=s,a.lastBaseUpdate=s}function _u(n,s,a,c){var d=n.updateQueue;vs=!1;var p=d.firstBaseUpdate,v=d.lastBaseUpdate,S=d.shared.pending;if(S!==null){d.shared.pending=null;var N=S,U=N.next;N.next=null,v===null?p=U:v.next=U,v=N;var Y=n.alternate;Y!==null&&(Y=Y.updateQueue,S=Y.lastBaseUpdate,S!==v&&(S===null?Y.firstBaseUpdate=U:S.next=U,Y.lastBaseUpdate=N))}if(p!==null){var X=d.baseState;v=0,Y=U=N=null,S=p;do{var J=S.lane,oe=S.eventTime;if((c&J)===J){Y!==null&&(Y=Y.next={eventTime:oe,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var ue=n,he=S;switch(J=s,oe=a,he.tag){case 1:if(ue=he.payload,typeof ue=="function"){X=ue.call(oe,X,J);break e}X=ue;break e;case 3:ue.flags=ue.flags&-65537|128;case 0:if(ue=he.payload,J=typeof ue=="function"?ue.call(oe,X,J):ue,J==null)break e;X=Z({},X,J);break e;case 2:vs=!0}}S.callback!==null&&S.lane!==0&&(n.flags|=64,J=d.effects,J===null?d.effects=[S]:J.push(S))}else oe={eventTime:oe,lane:J,tag:S.tag,payload:S.payload,callback:S.callback,next:null},Y===null?(U=Y=oe,N=X):Y=Y.next=oe,v|=J;if(S=S.next,S===null){if(S=d.shared.pending,S===null)break;J=S,S=J.next,J.next=null,d.lastBaseUpdate=J,d.shared.pending=null}}while(!0);if(Y===null&&(N=X),d.baseState=N,d.firstBaseUpdate=U,d.lastBaseUpdate=Y,s=d.shared.interleaved,s!==null){d=s;do v|=d.lane,d=d.next;while(d!==s)}else p===null&&(d.shared.lanes=0);wi|=v,n.lanes=v,n.memoizedState=X}}function xm(n,s,a){if(n=s.effects,s.effects=null,n!==null)for(s=0;s<n.length;s++){var c=n[s],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var Ca={},or=gs(Ca),Ra=gs(Ca),Pa=gs(Ca);function _i(n){if(n===Ca)throw Error(t(174));return n}function Qh(n,s){switch(Ge(Pa,s),Ge(Ra,n),Ge(or,Ca),n=s.nodeType,n){case 9:case 11:s=(s=s.documentElement)?s.namespaceURI:Ui(null,"");break;default:n=n===8?s.parentNode:s,s=n.namespaceURI||null,n=n.tagName,s=Ui(s,n)}Ze(or),Ge(or,s)}function wo(){Ze(or),Ze(Ra),Ze(Pa)}function Sm(n){_i(Pa.current);var s=_i(or.current),a=Ui(s,n.type);s!==a&&(Ge(Ra,n),Ge(or,a))}function Jh(n){Ra.current===n&&(Ze(or),Ze(Ra))}var st=gs(0);function vu(n){for(var s=n;s!==null;){if(s.tag===13){var a=s.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return s}else if(s.tag===19&&s.memoizedProps.revealOrder!==void 0){if((s.flags&128)!==0)return s}else if(s.child!==null){s.child.return=s,s=s.child;continue}if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return null;s=s.return}s.sibling.return=s.return,s=s.sibling}return null}var Yh=[];function Xh(){for(var n=0;n<Yh.length;n++)Yh[n]._workInProgressVersionPrimary=null;Yh.length=0}var wu=Te.ReactCurrentDispatcher,Zh=Te.ReactCurrentBatchConfig,vi=0,it=null,It=null,Ct=null,Eu=!1,Na=!1,ba=0,tE=0;function Bt(){throw Error(t(321))}function ed(n,s){if(s===null)return!1;for(var a=0;a<s.length&&a<n.length;a++)if(!Vn(n[a],s[a]))return!1;return!0}function td(n,s,a,c,d,p){if(vi=p,it=s,s.memoizedState=null,s.updateQueue=null,s.lanes=0,wu.current=n===null||n.memoizedState===null?iE:oE,n=a(c,d),Na){p=0;do{if(Na=!1,ba=0,25<=p)throw Error(t(301));p+=1,Ct=It=null,s.updateQueue=null,wu.current=aE,n=a(c,d)}while(Na)}if(wu.current=xu,s=It!==null&&It.next!==null,vi=0,Ct=It=it=null,Eu=!1,s)throw Error(t(300));return n}function nd(){var n=ba!==0;return ba=0,n}function ar(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ct===null?it.memoizedState=Ct=n:Ct=Ct.next=n,Ct}function In(){if(It===null){var n=it.alternate;n=n!==null?n.memoizedState:null}else n=It.next;var s=Ct===null?it.memoizedState:Ct.next;if(s!==null)Ct=s,It=n;else{if(n===null)throw Error(t(310));It=n,n={memoizedState:It.memoizedState,baseState:It.baseState,baseQueue:It.baseQueue,queue:It.queue,next:null},Ct===null?it.memoizedState=Ct=n:Ct=Ct.next=n}return Ct}function Da(n,s){return typeof s=="function"?s(n):s}function rd(n){var s=In(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=It,d=c.baseQueue,p=a.pending;if(p!==null){if(d!==null){var v=d.next;d.next=p.next,p.next=v}c.baseQueue=d=p,a.pending=null}if(d!==null){p=d.next,c=c.baseState;var S=v=null,N=null,U=p;do{var Y=U.lane;if((vi&Y)===Y)N!==null&&(N=N.next={lane:0,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null}),c=U.hasEagerState?U.eagerState:n(c,U.action);else{var X={lane:Y,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null};N===null?(S=N=X,v=c):N=N.next=X,it.lanes|=Y,wi|=Y}U=U.next}while(U!==null&&U!==p);N===null?v=c:N.next=S,Vn(c,s.memoizedState)||(Zt=!0),s.memoizedState=c,s.baseState=v,s.baseQueue=N,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do p=d.lane,it.lanes|=p,wi|=p,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[s.memoizedState,a.dispatch]}function sd(n){var s=In(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,p=s.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do p=n(p,v.action),v=v.next;while(v!==d);Vn(p,s.memoizedState)||(Zt=!0),s.memoizedState=p,s.baseQueue===null&&(s.baseState=p),a.lastRenderedState=p}return[p,c]}function Am(){}function km(n,s){var a=it,c=In(),d=s(),p=!Vn(c.memoizedState,d);if(p&&(c.memoizedState=d,Zt=!0),c=c.queue,id(Pm.bind(null,a,c,n),[n]),c.getSnapshot!==s||p||Ct!==null&&Ct.memoizedState.tag&1){if(a.flags|=2048,Va(9,Rm.bind(null,a,c,d,s),void 0,null),Rt===null)throw Error(t(349));(vi&30)!==0||Cm(a,s,d)}return d}function Cm(n,s,a){n.flags|=16384,n={getSnapshot:s,value:a},s=it.updateQueue,s===null?(s={lastEffect:null,stores:null},it.updateQueue=s,s.stores=[n]):(a=s.stores,a===null?s.stores=[n]:a.push(n))}function Rm(n,s,a,c){s.value=a,s.getSnapshot=c,Nm(s)&&bm(n)}function Pm(n,s,a){return a(function(){Nm(s)&&bm(n)})}function Nm(n){var s=n.getSnapshot;n=n.value;try{var a=s();return!Vn(n,a)}catch{return!0}}function bm(n){var s=br(n,1);s!==null&&Fn(s,n,1,-1)}function Dm(n){var s=ar();return typeof n=="function"&&(n=n()),s.memoizedState=s.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:n},s.queue=n,n=n.dispatch=sE.bind(null,it,n),[s.memoizedState,n]}function Va(n,s,a,c){return n={tag:n,create:s,destroy:a,deps:c,next:null},s=it.updateQueue,s===null?(s={lastEffect:null,stores:null},it.updateQueue=s,s.lastEffect=n.next=n):(a=s.lastEffect,a===null?s.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,s.lastEffect=n)),n}function Vm(){return In().memoizedState}function Tu(n,s,a,c){var d=ar();it.flags|=n,d.memoizedState=Va(1|s,a,void 0,c===void 0?null:c)}function Iu(n,s,a,c){var d=In();c=c===void 0?null:c;var p=void 0;if(It!==null){var v=It.memoizedState;if(p=v.destroy,c!==null&&ed(c,v.deps)){d.memoizedState=Va(s,a,p,c);return}}it.flags|=n,d.memoizedState=Va(1|s,a,p,c)}function Om(n,s){return Tu(8390656,8,n,s)}function id(n,s){return Iu(2048,8,n,s)}function Lm(n,s){return Iu(4,2,n,s)}function Mm(n,s){return Iu(4,4,n,s)}function jm(n,s){if(typeof s=="function")return n=n(),s(n),function(){s(null)};if(s!=null)return n=n(),s.current=n,function(){s.current=null}}function Fm(n,s,a){return a=a!=null?a.concat([n]):null,Iu(4,4,jm.bind(null,s,n),a)}function od(){}function Um(n,s){var a=In();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&ed(s,c[1])?c[0]:(a.memoizedState=[n,s],n)}function zm(n,s){var a=In();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&ed(s,c[1])?c[0]:(n=n(),a.memoizedState=[n,s],n)}function Bm(n,s,a){return(vi&21)===0?(n.baseState&&(n.baseState=!1,Zt=!0),n.memoizedState=a):(Vn(a,s)||(a=oa(),it.lanes|=a,wi|=a,n.baseState=!0),s)}function nE(n,s){var a=Le;Le=a!==0&&4>a?a:4,n(!0);var c=Zh.transition;Zh.transition={};try{n(!1),s()}finally{Le=a,Zh.transition=c}}function $m(){return In().memoizedState}function rE(n,s,a){var c=xs(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Hm(n))qm(s,a);else if(a=Em(n,s,a,c),a!==null){var d=Jt();Fn(a,n,c,d),Wm(a,s,c)}}function sE(n,s,a){var c=xs(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Hm(n))qm(s,d);else{var p=n.alternate;if(n.lanes===0&&(p===null||p.lanes===0)&&(p=s.lastRenderedReducer,p!==null))try{var v=s.lastRenderedState,S=p(v,a);if(d.hasEagerState=!0,d.eagerState=S,Vn(S,v)){var N=s.interleaved;N===null?(d.next=d,Kh(s)):(d.next=N.next,N.next=d),s.interleaved=d;return}}catch{}finally{}a=Em(n,s,d,c),a!==null&&(d=Jt(),Fn(a,n,c,d),Wm(a,s,c))}}function Hm(n){var s=n.alternate;return n===it||s!==null&&s===it}function qm(n,s){Na=Eu=!0;var a=n.pending;a===null?s.next=s:(s.next=a.next,a.next=s),n.pending=s}function Wm(n,s,a){if((a&4194240)!==0){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,la(n,a)}}var xu={readContext:Tn,useCallback:Bt,useContext:Bt,useEffect:Bt,useImperativeHandle:Bt,useInsertionEffect:Bt,useLayoutEffect:Bt,useMemo:Bt,useReducer:Bt,useRef:Bt,useState:Bt,useDebugValue:Bt,useDeferredValue:Bt,useTransition:Bt,useMutableSource:Bt,useSyncExternalStore:Bt,useId:Bt,unstable_isNewReconciler:!1},iE={readContext:Tn,useCallback:function(n,s){return ar().memoizedState=[n,s===void 0?null:s],n},useContext:Tn,useEffect:Om,useImperativeHandle:function(n,s,a){return a=a!=null?a.concat([n]):null,Tu(4194308,4,jm.bind(null,s,n),a)},useLayoutEffect:function(n,s){return Tu(4194308,4,n,s)},useInsertionEffect:function(n,s){return Tu(4,2,n,s)},useMemo:function(n,s){var a=ar();return s=s===void 0?null:s,n=n(),a.memoizedState=[n,s],n},useReducer:function(n,s,a){var c=ar();return s=a!==void 0?a(s):s,c.memoizedState=c.baseState=s,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:s},c.queue=n,n=n.dispatch=rE.bind(null,it,n),[c.memoizedState,n]},useRef:function(n){var s=ar();return n={current:n},s.memoizedState=n},useState:Dm,useDebugValue:od,useDeferredValue:function(n){return ar().memoizedState=n},useTransition:function(){var n=Dm(!1),s=n[0];return n=nE.bind(null,n[1]),ar().memoizedState=n,[s,n]},useMutableSource:function(){},useSyncExternalStore:function(n,s,a){var c=it,d=ar();if(tt){if(a===void 0)throw Error(t(407));a=a()}else{if(a=s(),Rt===null)throw Error(t(349));(vi&30)!==0||Cm(c,s,a)}d.memoizedState=a;var p={value:a,getSnapshot:s};return d.queue=p,Om(Pm.bind(null,c,p,n),[n]),c.flags|=2048,Va(9,Rm.bind(null,c,p,a,s),void 0,null),a},useId:function(){var n=ar(),s=Rt.identifierPrefix;if(tt){var a=Nr,c=Pr;a=(c&~(1<<32-ln(c)-1)).toString(32)+a,s=":"+s+"R"+a,a=ba++,0<a&&(s+="H"+a.toString(32)),s+=":"}else a=tE++,s=":"+s+"r"+a.toString(32)+":";return n.memoizedState=s},unstable_isNewReconciler:!1},oE={readContext:Tn,useCallback:Um,useContext:Tn,useEffect:id,useImperativeHandle:Fm,useInsertionEffect:Lm,useLayoutEffect:Mm,useMemo:zm,useReducer:rd,useRef:Vm,useState:function(){return rd(Da)},useDebugValue:od,useDeferredValue:function(n){var s=In();return Bm(s,It.memoizedState,n)},useTransition:function(){var n=rd(Da)[0],s=In().memoizedState;return[n,s]},useMutableSource:Am,useSyncExternalStore:km,useId:$m,unstable_isNewReconciler:!1},aE={readContext:Tn,useCallback:Um,useContext:Tn,useEffect:id,useImperativeHandle:Fm,useInsertionEffect:Lm,useLayoutEffect:Mm,useMemo:zm,useReducer:sd,useRef:Vm,useState:function(){return sd(Da)},useDebugValue:od,useDeferredValue:function(n){var s=In();return It===null?s.memoizedState=n:Bm(s,It.memoizedState,n)},useTransition:function(){var n=sd(Da)[0],s=In().memoizedState;return[n,s]},useMutableSource:Am,useSyncExternalStore:km,useId:$m,unstable_isNewReconciler:!1};function Ln(n,s){if(n&&n.defaultProps){s=Z({},s),n=n.defaultProps;for(var a in n)s[a]===void 0&&(s[a]=n[a]);return s}return s}function ad(n,s,a,c){s=n.memoizedState,a=a(c,s),a=a==null?s:Z({},s,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Su={isMounted:function(n){return(n=n._reactInternals)?bn(n)===n:!1},enqueueSetState:function(n,s,a){n=n._reactInternals;var c=Jt(),d=xs(n),p=Dr(c,d);p.payload=s,a!=null&&(p.callback=a),s=ws(n,p,d),s!==null&&(Fn(s,n,d,c),yu(s,n,d))},enqueueReplaceState:function(n,s,a){n=n._reactInternals;var c=Jt(),d=xs(n),p=Dr(c,d);p.tag=1,p.payload=s,a!=null&&(p.callback=a),s=ws(n,p,d),s!==null&&(Fn(s,n,d,c),yu(s,n,d))},enqueueForceUpdate:function(n,s){n=n._reactInternals;var a=Jt(),c=xs(n),d=Dr(a,c);d.tag=2,s!=null&&(d.callback=s),s=ws(n,d,c),s!==null&&(Fn(s,n,c,a),yu(s,n,c))}};function Km(n,s,a,c,d,p,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,p,v):s.prototype&&s.prototype.isPureReactComponent?!wa(a,c)||!wa(d,p):!0}function Gm(n,s,a){var c=!1,d=ys,p=s.contextType;return typeof p=="object"&&p!==null?p=Tn(p):(d=Xt(s)?pi:zt.current,c=s.contextTypes,p=(c=c!=null)?fo(n,d):ys),s=new s(a,p),n.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=Su,n.stateNode=s,s._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=p),s}function Qm(n,s,a,c){n=s.state,typeof s.componentWillReceiveProps=="function"&&s.componentWillReceiveProps(a,c),typeof s.UNSAFE_componentWillReceiveProps=="function"&&s.UNSAFE_componentWillReceiveProps(a,c),s.state!==n&&Su.enqueueReplaceState(s,s.state,null)}function ld(n,s,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Gh(n);var p=s.contextType;typeof p=="object"&&p!==null?d.context=Tn(p):(p=Xt(s)?pi:zt.current,d.context=fo(n,p)),d.state=n.memoizedState,p=s.getDerivedStateFromProps,typeof p=="function"&&(ad(n,s,p,a),d.state=n.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(s=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),s!==d.state&&Su.enqueueReplaceState(d,d.state,null),_u(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function Eo(n,s){try{var a="",c=s;do a+=ge(c),c=c.return;while(c);var d=a}catch(p){d=`
Error generating stack: `+p.message+`
`+p.stack}return{value:n,source:s,stack:d,digest:null}}function ud(n,s,a){return{value:n,source:null,stack:a??null,digest:s??null}}function cd(n,s){try{console.error(s.value)}catch(a){setTimeout(function(){throw a})}}var lE=typeof WeakMap=="function"?WeakMap:Map;function Jm(n,s,a){a=Dr(-1,a),a.tag=3,a.payload={element:null};var c=s.value;return a.callback=function(){bu||(bu=!0,Sd=c),cd(n,s)},a}function Ym(n,s,a){a=Dr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=s.value;a.payload=function(){return c(d)},a.callback=function(){cd(n,s)}}var p=n.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(a.callback=function(){cd(n,s),typeof c!="function"&&(Ts===null?Ts=new Set([this]):Ts.add(this));var v=s.stack;this.componentDidCatch(s.value,{componentStack:v!==null?v:""})}),a}function Xm(n,s,a){var c=n.pingCache;if(c===null){c=n.pingCache=new lE;var d=new Set;c.set(s,d)}else d=c.get(s),d===void 0&&(d=new Set,c.set(s,d));d.has(a)||(d.add(a),n=TE.bind(null,n,s,a),s.then(n,n))}function Zm(n){do{var s;if((s=n.tag===13)&&(s=n.memoizedState,s=s!==null?s.dehydrated!==null:!0),s)return n;n=n.return}while(n!==null);return null}function eg(n,s,a,c,d){return(n.mode&1)===0?(n===s?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(s=Dr(-1,1),s.tag=2,ws(a,s,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var uE=Te.ReactCurrentOwner,Zt=!1;function Qt(n,s,a,c){s.child=n===null?wm(s,null,a,c):yo(s,n.child,a,c)}function tg(n,s,a,c,d){a=a.render;var p=s.ref;return vo(s,d),c=td(n,s,a,c,p,d),a=nd(),n!==null&&!Zt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Vr(n,s,d)):(tt&&a&&jh(s),s.flags|=1,Qt(n,s,c,d),s.child)}function ng(n,s,a,c,d){if(n===null){var p=a.type;return typeof p=="function"&&!bd(p)&&p.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(s.tag=15,s.type=p,rg(n,s,p,c,d)):(n=ju(a.type,null,c,s,s.mode,d),n.ref=s.ref,n.return=s,s.child=n)}if(p=n.child,(n.lanes&d)===0){var v=p.memoizedProps;if(a=a.compare,a=a!==null?a:wa,a(v,c)&&n.ref===s.ref)return Vr(n,s,d)}return s.flags|=1,n=As(p,c),n.ref=s.ref,n.return=s,s.child=n}function rg(n,s,a,c,d){if(n!==null){var p=n.memoizedProps;if(wa(p,c)&&n.ref===s.ref)if(Zt=!1,s.pendingProps=c=p,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Zt=!0);else return s.lanes=n.lanes,Vr(n,s,d)}return hd(n,s,a,c,d)}function sg(n,s,a){var c=s.pendingProps,d=c.children,p=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((s.mode&1)===0)s.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ge(Io,mn),mn|=a;else{if((a&1073741824)===0)return n=p!==null?p.baseLanes|a:a,s.lanes=s.childLanes=1073741824,s.memoizedState={baseLanes:n,cachePool:null,transitions:null},s.updateQueue=null,Ge(Io,mn),mn|=n,null;s.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=p!==null?p.baseLanes:a,Ge(Io,mn),mn|=c}else p!==null?(c=p.baseLanes|a,s.memoizedState=null):c=a,Ge(Io,mn),mn|=c;return Qt(n,s,d,a),s.child}function ig(n,s){var a=s.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(s.flags|=512,s.flags|=2097152)}function hd(n,s,a,c,d){var p=Xt(a)?pi:zt.current;return p=fo(s,p),vo(s,d),a=td(n,s,a,c,p,d),c=nd(),n!==null&&!Zt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Vr(n,s,d)):(tt&&c&&jh(s),s.flags|=1,Qt(n,s,a,d),s.child)}function og(n,s,a,c,d){if(Xt(a)){var p=!0;uu(s)}else p=!1;if(vo(s,d),s.stateNode===null)ku(n,s),Gm(s,a,c),ld(s,a,c,d),c=!0;else if(n===null){var v=s.stateNode,S=s.memoizedProps;v.props=S;var N=v.context,U=a.contextType;typeof U=="object"&&U!==null?U=Tn(U):(U=Xt(a)?pi:zt.current,U=fo(s,U));var Y=a.getDerivedStateFromProps,X=typeof Y=="function"||typeof v.getSnapshotBeforeUpdate=="function";X||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==c||N!==U)&&Qm(s,v,c,U),vs=!1;var J=s.memoizedState;v.state=J,_u(s,c,v,d),N=s.memoizedState,S!==c||J!==N||Yt.current||vs?(typeof Y=="function"&&(ad(s,a,Y,c),N=s.memoizedState),(S=vs||Km(s,a,S,c,J,N,U))?(X||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(s.flags|=4194308)):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),s.memoizedProps=c,s.memoizedState=N),v.props=c,v.state=N,v.context=U,c=S):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),c=!1)}else{v=s.stateNode,Tm(n,s),S=s.memoizedProps,U=s.type===s.elementType?S:Ln(s.type,S),v.props=U,X=s.pendingProps,J=v.context,N=a.contextType,typeof N=="object"&&N!==null?N=Tn(N):(N=Xt(a)?pi:zt.current,N=fo(s,N));var oe=a.getDerivedStateFromProps;(Y=typeof oe=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==X||J!==N)&&Qm(s,v,c,N),vs=!1,J=s.memoizedState,v.state=J,_u(s,c,v,d);var ue=s.memoizedState;S!==X||J!==ue||Yt.current||vs?(typeof oe=="function"&&(ad(s,a,oe,c),ue=s.memoizedState),(U=vs||Km(s,a,U,c,J,ue,N)||!1)?(Y||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,ue,N),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,ue,N)),typeof v.componentDidUpdate=="function"&&(s.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(s.flags|=1024)):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=1024),s.memoizedProps=c,s.memoizedState=ue),v.props=c,v.state=ue,v.context=N,c=U):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=1024),c=!1)}return dd(n,s,a,c,p,d)}function dd(n,s,a,c,d,p){ig(n,s);var v=(s.flags&128)!==0;if(!c&&!v)return d&&hm(s,a,!1),Vr(n,s,p);c=s.stateNode,uE.current=s;var S=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return s.flags|=1,n!==null&&v?(s.child=yo(s,n.child,null,p),s.child=yo(s,null,S,p)):Qt(n,s,S,p),s.memoizedState=c.state,d&&hm(s,a,!0),s.child}function ag(n){var s=n.stateNode;s.pendingContext?um(n,s.pendingContext,s.pendingContext!==s.context):s.context&&um(n,s.context,!1),Qh(n,s.containerInfo)}function lg(n,s,a,c,d){return go(),Bh(d),s.flags|=256,Qt(n,s,a,c),s.child}var fd={dehydrated:null,treeContext:null,retryLane:0};function pd(n){return{baseLanes:n,cachePool:null,transitions:null}}function ug(n,s,a){var c=s.pendingProps,d=st.current,p=!1,v=(s.flags&128)!==0,S;if((S=v)||(S=n!==null&&n.memoizedState===null?!1:(d&2)!==0),S?(p=!0,s.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Ge(st,d&1),n===null)return zh(s),n=s.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((s.mode&1)===0?s.lanes=1:n.data==="$!"?s.lanes=8:s.lanes=1073741824,null):(v=c.children,n=c.fallback,p?(c=s.mode,p=s.child,v={mode:"hidden",children:v},(c&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=v):p=Fu(v,c,0,null),n=xi(n,c,a,null),p.return=s,n.return=s,p.sibling=n,s.child=p,s.child.memoizedState=pd(a),s.memoizedState=fd,n):md(s,v));if(d=n.memoizedState,d!==null&&(S=d.dehydrated,S!==null))return cE(n,s,v,c,S,d,a);if(p){p=c.fallback,v=s.mode,d=n.child,S=d.sibling;var N={mode:"hidden",children:c.children};return(v&1)===0&&s.child!==d?(c=s.child,c.childLanes=0,c.pendingProps=N,s.deletions=null):(c=As(d,N),c.subtreeFlags=d.subtreeFlags&14680064),S!==null?p=As(S,p):(p=xi(p,v,a,null),p.flags|=2),p.return=s,c.return=s,c.sibling=p,s.child=c,c=p,p=s.child,v=n.child.memoizedState,v=v===null?pd(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},p.memoizedState=v,p.childLanes=n.childLanes&~a,s.memoizedState=fd,c}return p=n.child,n=p.sibling,c=As(p,{mode:"visible",children:c.children}),(s.mode&1)===0&&(c.lanes=a),c.return=s,c.sibling=null,n!==null&&(a=s.deletions,a===null?(s.deletions=[n],s.flags|=16):a.push(n)),s.child=c,s.memoizedState=null,c}function md(n,s){return s=Fu({mode:"visible",children:s},n.mode,0,null),s.return=n,n.child=s}function Au(n,s,a,c){return c!==null&&Bh(c),yo(s,n.child,null,a),n=md(s,s.pendingProps.children),n.flags|=2,s.memoizedState=null,n}function cE(n,s,a,c,d,p,v){if(a)return s.flags&256?(s.flags&=-257,c=ud(Error(t(422))),Au(n,s,v,c)):s.memoizedState!==null?(s.child=n.child,s.flags|=128,null):(p=c.fallback,d=s.mode,c=Fu({mode:"visible",children:c.children},d,0,null),p=xi(p,d,v,null),p.flags|=2,c.return=s,p.return=s,c.sibling=p,s.child=c,(s.mode&1)!==0&&yo(s,n.child,null,v),s.child.memoizedState=pd(v),s.memoizedState=fd,p);if((s.mode&1)===0)return Au(n,s,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var S=c.dgst;return c=S,p=Error(t(419)),c=ud(p,c,void 0),Au(n,s,v,c)}if(S=(v&n.childLanes)!==0,Zt||S){if(c=Rt,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==p.retryLane&&(p.retryLane=d,br(n,d),Fn(c,n,d,-1))}return Nd(),c=ud(Error(t(421))),Au(n,s,v,c)}return d.data==="$?"?(s.flags|=128,s.child=n.child,s=IE.bind(null,n),d._reactRetry=s,null):(n=p.treeContext,pn=ms(d.nextSibling),fn=s,tt=!0,On=null,n!==null&&(wn[En++]=Pr,wn[En++]=Nr,wn[En++]=mi,Pr=n.id,Nr=n.overflow,mi=s),s=md(s,c.children),s.flags|=4096,s)}function cg(n,s,a){n.lanes|=s;var c=n.alternate;c!==null&&(c.lanes|=s),Wh(n.return,s,a)}function gd(n,s,a,c,d){var p=n.memoizedState;p===null?n.memoizedState={isBackwards:s,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(p.isBackwards=s,p.rendering=null,p.renderingStartTime=0,p.last=c,p.tail=a,p.tailMode=d)}function hg(n,s,a){var c=s.pendingProps,d=c.revealOrder,p=c.tail;if(Qt(n,s,c.children,a),c=st.current,(c&2)!==0)c=c&1|2,s.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=s.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&cg(n,a,s);else if(n.tag===19)cg(n,a,s);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===s)break e;for(;n.sibling===null;){if(n.return===null||n.return===s)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Ge(st,c),(s.mode&1)===0)s.memoizedState=null;else switch(d){case"forwards":for(a=s.child,d=null;a!==null;)n=a.alternate,n!==null&&vu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=s.child,s.child=null):(d=a.sibling,a.sibling=null),gd(s,!1,d,a,p);break;case"backwards":for(a=null,d=s.child,s.child=null;d!==null;){if(n=d.alternate,n!==null&&vu(n)===null){s.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}gd(s,!0,a,null,p);break;case"together":gd(s,!1,null,null,void 0);break;default:s.memoizedState=null}return s.child}function ku(n,s){(s.mode&1)===0&&n!==null&&(n.alternate=null,s.alternate=null,s.flags|=2)}function Vr(n,s,a){if(n!==null&&(s.dependencies=n.dependencies),wi|=s.lanes,(a&s.childLanes)===0)return null;if(n!==null&&s.child!==n.child)throw Error(t(153));if(s.child!==null){for(n=s.child,a=As(n,n.pendingProps),s.child=a,a.return=s;n.sibling!==null;)n=n.sibling,a=a.sibling=As(n,n.pendingProps),a.return=s;a.sibling=null}return s.child}function hE(n,s,a){switch(s.tag){case 3:ag(s),go();break;case 5:Sm(s);break;case 1:Xt(s.type)&&uu(s);break;case 4:Qh(s,s.stateNode.containerInfo);break;case 10:var c=s.type._context,d=s.memoizedProps.value;Ge(mu,c._currentValue),c._currentValue=d;break;case 13:if(c=s.memoizedState,c!==null)return c.dehydrated!==null?(Ge(st,st.current&1),s.flags|=128,null):(a&s.child.childLanes)!==0?ug(n,s,a):(Ge(st,st.current&1),n=Vr(n,s,a),n!==null?n.sibling:null);Ge(st,st.current&1);break;case 19:if(c=(a&s.childLanes)!==0,(n.flags&128)!==0){if(c)return hg(n,s,a);s.flags|=128}if(d=s.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Ge(st,st.current),c)break;return null;case 22:case 23:return s.lanes=0,sg(n,s,a)}return Vr(n,s,a)}var dg,yd,fg,pg;dg=function(n,s){for(var a=s.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===s)break;for(;a.sibling===null;){if(a.return===null||a.return===s)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},yd=function(){},fg=function(n,s,a,c){var d=n.memoizedProps;if(d!==c){n=s.stateNode,_i(or.current);var p=null;switch(a){case"input":d=bt(n,d),c=bt(n,c),p=[];break;case"select":d=Z({},d,{value:void 0}),c=Z({},c,{value:void 0}),p=[];break;case"textarea":d=Qo(n,d),c=Qo(n,c),p=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=ou)}Nn(a,c);var v;a=null;for(U in d)if(!c.hasOwnProperty(U)&&d.hasOwnProperty(U)&&d[U]!=null)if(U==="style"){var S=d[U];for(v in S)S.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else U!=="dangerouslySetInnerHTML"&&U!=="children"&&U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&U!=="autoFocus"&&(o.hasOwnProperty(U)?p||(p=[]):(p=p||[]).push(U,null));for(U in c){var N=c[U];if(S=d!=null?d[U]:void 0,c.hasOwnProperty(U)&&N!==S&&(N!=null||S!=null))if(U==="style")if(S){for(v in S)!S.hasOwnProperty(v)||N&&N.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in N)N.hasOwnProperty(v)&&S[v]!==N[v]&&(a||(a={}),a[v]=N[v])}else a||(p||(p=[]),p.push(U,a)),a=N;else U==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,S=S?S.__html:void 0,N!=null&&S!==N&&(p=p||[]).push(U,N)):U==="children"?typeof N!="string"&&typeof N!="number"||(p=p||[]).push(U,""+N):U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&(o.hasOwnProperty(U)?(N!=null&&U==="onScroll"&&Xe("scroll",n),p||S===N||(p=[])):(p=p||[]).push(U,N))}a&&(p=p||[]).push("style",a);var U=p;(s.updateQueue=U)&&(s.flags|=4)}},pg=function(n,s,a,c){a!==c&&(s.flags|=4)};function Oa(n,s){if(!tt)switch(n.tailMode){case"hidden":s=n.tail;for(var a=null;s!==null;)s.alternate!==null&&(a=s),s=s.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?s||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function $t(n){var s=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(s)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,s}function dE(n,s,a){var c=s.pendingProps;switch(Fh(s),s.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $t(s),null;case 1:return Xt(s.type)&&lu(),$t(s),null;case 3:return c=s.stateNode,wo(),Ze(Yt),Ze(zt),Xh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(fu(s)?s.flags|=4:n===null||n.memoizedState.isDehydrated&&(s.flags&256)===0||(s.flags|=1024,On!==null&&(Cd(On),On=null))),yd(n,s),$t(s),null;case 5:Jh(s);var d=_i(Pa.current);if(a=s.type,n!==null&&s.stateNode!=null)fg(n,s,a,c,d),n.ref!==s.ref&&(s.flags|=512,s.flags|=2097152);else{if(!c){if(s.stateNode===null)throw Error(t(166));return $t(s),null}if(n=_i(or.current),fu(s)){c=s.stateNode,a=s.type;var p=s.memoizedProps;switch(c[ir]=s,c[Sa]=p,n=(s.mode&1)!==0,a){case"dialog":Xe("cancel",c),Xe("close",c);break;case"iframe":case"object":case"embed":Xe("load",c);break;case"video":case"audio":for(d=0;d<Ta.length;d++)Xe(Ta[d],c);break;case"source":Xe("error",c);break;case"img":case"image":case"link":Xe("error",c),Xe("load",c);break;case"details":Xe("toggle",c);break;case"input":Hn(c,p),Xe("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!p.multiple},Xe("invalid",c);break;case"textarea":Jo(c,p),Xe("invalid",c)}Nn(a,p),d=null;for(var v in p)if(p.hasOwnProperty(v)){var S=p[v];v==="children"?typeof S=="string"?c.textContent!==S&&(p.suppressHydrationWarning!==!0&&iu(c.textContent,S,n),d=["children",S]):typeof S=="number"&&c.textContent!==""+S&&(p.suppressHydrationWarning!==!0&&iu(c.textContent,S,n),d=["children",""+S]):o.hasOwnProperty(v)&&S!=null&&v==="onScroll"&&Xe("scroll",c)}switch(a){case"input":Tt(c),Go(c,p,!0);break;case"textarea":Tt(c),Zr(c);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(c.onclick=ou)}c=d,s.updateQueue=c,c!==null&&(s.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Yo(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[ir]=s,n[Sa]=c,dg(n,s,!1,!1),s.stateNode=n;e:{switch(v=Bi(a,c),a){case"dialog":Xe("cancel",n),Xe("close",n),d=c;break;case"iframe":case"object":case"embed":Xe("load",n),d=c;break;case"video":case"audio":for(d=0;d<Ta.length;d++)Xe(Ta[d],n);d=c;break;case"source":Xe("error",n),d=c;break;case"img":case"image":case"link":Xe("error",n),Xe("load",n),d=c;break;case"details":Xe("toggle",n),d=c;break;case"input":Hn(n,c),d=bt(n,c),Xe("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=Z({},c,{value:void 0}),Xe("invalid",n);break;case"textarea":Jo(n,c),d=Qo(n,c),Xe("invalid",n);break;default:d=c}Nn(a,d),S=d;for(p in S)if(S.hasOwnProperty(p)){var N=S[p];p==="style"?zi(n,N):p==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,N!=null&&Dl(n,N)):p==="children"?typeof N=="string"?(a!=="textarea"||N!=="")&&Zs(n,N):typeof N=="number"&&Zs(n,""+N):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(o.hasOwnProperty(p)?N!=null&&p==="onScroll"&&Xe("scroll",n):N!=null&&ce(n,p,N,v))}switch(a){case"input":Tt(n),Go(n,c,!1);break;case"textarea":Tt(n),Zr(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Pe(c.value));break;case"select":n.multiple=!!c.multiple,p=c.value,p!=null?Pn(n,!!c.multiple,p,!1):c.defaultValue!=null&&Pn(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=ou)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(s.flags|=4)}s.ref!==null&&(s.flags|=512,s.flags|=2097152)}return $t(s),null;case 6:if(n&&s.stateNode!=null)pg(n,s,n.memoizedProps,c);else{if(typeof c!="string"&&s.stateNode===null)throw Error(t(166));if(a=_i(Pa.current),_i(or.current),fu(s)){if(c=s.stateNode,a=s.memoizedProps,c[ir]=s,(p=c.nodeValue!==a)&&(n=fn,n!==null))switch(n.tag){case 3:iu(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&iu(c.nodeValue,a,(n.mode&1)!==0)}p&&(s.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ir]=s,s.stateNode=c}return $t(s),null;case 13:if(Ze(st),c=s.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(tt&&pn!==null&&(s.mode&1)!==0&&(s.flags&128)===0)ym(),go(),s.flags|=98560,p=!1;else if(p=fu(s),c!==null&&c.dehydrated!==null){if(n===null){if(!p)throw Error(t(318));if(p=s.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(t(317));p[ir]=s}else go(),(s.flags&128)===0&&(s.memoizedState=null),s.flags|=4;$t(s),p=!1}else On!==null&&(Cd(On),On=null),p=!0;if(!p)return s.flags&65536?s:null}return(s.flags&128)!==0?(s.lanes=a,s):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(s.child.flags|=8192,(s.mode&1)!==0&&(n===null||(st.current&1)!==0?xt===0&&(xt=3):Nd())),s.updateQueue!==null&&(s.flags|=4),$t(s),null);case 4:return wo(),yd(n,s),n===null&&Ia(s.stateNode.containerInfo),$t(s),null;case 10:return qh(s.type._context),$t(s),null;case 17:return Xt(s.type)&&lu(),$t(s),null;case 19:if(Ze(st),p=s.memoizedState,p===null)return $t(s),null;if(c=(s.flags&128)!==0,v=p.rendering,v===null)if(c)Oa(p,!1);else{if(xt!==0||n!==null&&(n.flags&128)!==0)for(n=s.child;n!==null;){if(v=vu(n),v!==null){for(s.flags|=128,Oa(p,!1),c=v.updateQueue,c!==null&&(s.updateQueue=c,s.flags|=4),s.subtreeFlags=0,c=a,a=s.child;a!==null;)p=a,n=c,p.flags&=14680066,v=p.alternate,v===null?(p.childLanes=0,p.lanes=n,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=v.childLanes,p.lanes=v.lanes,p.child=v.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=v.memoizedProps,p.memoizedState=v.memoizedState,p.updateQueue=v.updateQueue,p.type=v.type,n=v.dependencies,p.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Ge(st,st.current&1|2),s.child}n=n.sibling}p.tail!==null&&Ye()>xo&&(s.flags|=128,c=!0,Oa(p,!1),s.lanes=4194304)}else{if(!c)if(n=vu(v),n!==null){if(s.flags|=128,c=!0,a=n.updateQueue,a!==null&&(s.updateQueue=a,s.flags|=4),Oa(p,!0),p.tail===null&&p.tailMode==="hidden"&&!v.alternate&&!tt)return $t(s),null}else 2*Ye()-p.renderingStartTime>xo&&a!==1073741824&&(s.flags|=128,c=!0,Oa(p,!1),s.lanes=4194304);p.isBackwards?(v.sibling=s.child,s.child=v):(a=p.last,a!==null?a.sibling=v:s.child=v,p.last=v)}return p.tail!==null?(s=p.tail,p.rendering=s,p.tail=s.sibling,p.renderingStartTime=Ye(),s.sibling=null,a=st.current,Ge(st,c?a&1|2:a&1),s):($t(s),null);case 22:case 23:return Pd(),c=s.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(s.flags|=8192),c&&(s.mode&1)!==0?(mn&1073741824)!==0&&($t(s),s.subtreeFlags&6&&(s.flags|=8192)):$t(s),null;case 24:return null;case 25:return null}throw Error(t(156,s.tag))}function fE(n,s){switch(Fh(s),s.tag){case 1:return Xt(s.type)&&lu(),n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 3:return wo(),Ze(Yt),Ze(zt),Xh(),n=s.flags,(n&65536)!==0&&(n&128)===0?(s.flags=n&-65537|128,s):null;case 5:return Jh(s),null;case 13:if(Ze(st),n=s.memoizedState,n!==null&&n.dehydrated!==null){if(s.alternate===null)throw Error(t(340));go()}return n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 19:return Ze(st),null;case 4:return wo(),null;case 10:return qh(s.type._context),null;case 22:case 23:return Pd(),null;case 24:return null;default:return null}}var Cu=!1,Ht=!1,pE=typeof WeakSet=="function"?WeakSet:Set,ae=null;function To(n,s){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){lt(n,s,c)}else a.current=null}function _d(n,s,a){try{a()}catch(c){lt(n,s,c)}}var mg=!1;function mE(n,s){if(Ph=Sr,n=Kp(),Th(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,p=c.focusNode;c=c.focusOffset;try{a.nodeType,p.nodeType}catch{a=null;break e}var v=0,S=-1,N=-1,U=0,Y=0,X=n,J=null;t:for(;;){for(var oe;X!==a||d!==0&&X.nodeType!==3||(S=v+d),X!==p||c!==0&&X.nodeType!==3||(N=v+c),X.nodeType===3&&(v+=X.nodeValue.length),(oe=X.firstChild)!==null;)J=X,X=oe;for(;;){if(X===n)break t;if(J===a&&++U===d&&(S=v),J===p&&++Y===c&&(N=v),(oe=X.nextSibling)!==null)break;X=J,J=X.parentNode}X=oe}a=S===-1||N===-1?null:{start:S,end:N}}else a=null}a=a||{start:0,end:0}}else a=null;for(Nh={focusedElem:n,selectionRange:a},Sr=!1,ae=s;ae!==null;)if(s=ae,n=s.child,(s.subtreeFlags&1028)!==0&&n!==null)n.return=s,ae=n;else for(;ae!==null;){s=ae;try{var ue=s.alternate;if((s.flags&1024)!==0)switch(s.tag){case 0:case 11:case 15:break;case 1:if(ue!==null){var he=ue.memoizedProps,dt=ue.memoizedState,L=s.stateNode,D=L.getSnapshotBeforeUpdate(s.elementType===s.type?he:Ln(s.type,he),dt);L.__reactInternalSnapshotBeforeUpdate=D}break;case 3:var F=s.stateNode.containerInfo;F.nodeType===1?F.textContent="":F.nodeType===9&&F.documentElement&&F.removeChild(F.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(ee){lt(s,s.return,ee)}if(n=s.sibling,n!==null){n.return=s.return,ae=n;break}ae=s.return}return ue=mg,mg=!1,ue}function La(n,s,a){var c=s.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var p=d.destroy;d.destroy=void 0,p!==void 0&&_d(s,a,p)}d=d.next}while(d!==c)}}function Ru(n,s){if(s=s.updateQueue,s=s!==null?s.lastEffect:null,s!==null){var a=s=s.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==s)}}function vd(n){var s=n.ref;if(s!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof s=="function"?s(n):s.current=n}}function gg(n){var s=n.alternate;s!==null&&(n.alternate=null,gg(s)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(s=n.stateNode,s!==null&&(delete s[ir],delete s[Sa],delete s[Oh],delete s[Yw],delete s[Xw])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function yg(n){return n.tag===5||n.tag===3||n.tag===4}function _g(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||yg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function wd(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.nodeType===8?a.parentNode.insertBefore(n,s):a.insertBefore(n,s):(a.nodeType===8?(s=a.parentNode,s.insertBefore(n,a)):(s=a,s.appendChild(n)),a=a._reactRootContainer,a!=null||s.onclick!==null||(s.onclick=ou));else if(c!==4&&(n=n.child,n!==null))for(wd(n,s,a),n=n.sibling;n!==null;)wd(n,s,a),n=n.sibling}function Ed(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.insertBefore(n,s):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Ed(n,s,a),n=n.sibling;n!==null;)Ed(n,s,a),n=n.sibling}var Ot=null,Mn=!1;function Es(n,s,a){for(a=a.child;a!==null;)vg(n,s,a),a=a.sibling}function vg(n,s,a){if(an&&typeof an.onCommitFiberUnmount=="function")try{an.onCommitFiberUnmount(si,a)}catch{}switch(a.tag){case 5:Ht||To(a,s);case 6:var c=Ot,d=Mn;Ot=null,Es(n,s,a),Ot=c,Mn=d,Ot!==null&&(Mn?(n=Ot,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Ot.removeChild(a.stateNode));break;case 18:Ot!==null&&(Mn?(n=Ot,a=a.stateNode,n.nodeType===8?Vh(n.parentNode,a):n.nodeType===1&&Vh(n,a),hs(n)):Vh(Ot,a.stateNode));break;case 4:c=Ot,d=Mn,Ot=a.stateNode.containerInfo,Mn=!0,Es(n,s,a),Ot=c,Mn=d;break;case 0:case 11:case 14:case 15:if(!Ht&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var p=d,v=p.destroy;p=p.tag,v!==void 0&&((p&2)!==0||(p&4)!==0)&&_d(a,s,v),d=d.next}while(d!==c)}Es(n,s,a);break;case 1:if(!Ht&&(To(a,s),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(S){lt(a,s,S)}Es(n,s,a);break;case 21:Es(n,s,a);break;case 22:a.mode&1?(Ht=(c=Ht)||a.memoizedState!==null,Es(n,s,a),Ht=c):Es(n,s,a);break;default:Es(n,s,a)}}function wg(n){var s=n.updateQueue;if(s!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new pE),s.forEach(function(c){var d=xE.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function jn(n,s){var a=s.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var p=n,v=s,S=v;e:for(;S!==null;){switch(S.tag){case 5:Ot=S.stateNode,Mn=!1;break e;case 3:Ot=S.stateNode.containerInfo,Mn=!0;break e;case 4:Ot=S.stateNode.containerInfo,Mn=!0;break e}S=S.return}if(Ot===null)throw Error(t(160));vg(p,v,d),Ot=null,Mn=!1;var N=d.alternate;N!==null&&(N.return=null),d.return=null}catch(U){lt(d,s,U)}}if(s.subtreeFlags&12854)for(s=s.child;s!==null;)Eg(s,n),s=s.sibling}function Eg(n,s){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(jn(s,n),lr(n),c&4){try{La(3,n,n.return),Ru(3,n)}catch(he){lt(n,n.return,he)}try{La(5,n,n.return)}catch(he){lt(n,n.return,he)}}break;case 1:jn(s,n),lr(n),c&512&&a!==null&&To(a,a.return);break;case 5:if(jn(s,n),lr(n),c&512&&a!==null&&To(a,a.return),n.flags&32){var d=n.stateNode;try{Zs(d,"")}catch(he){lt(n,n.return,he)}}if(c&4&&(d=n.stateNode,d!=null)){var p=n.memoizedProps,v=a!==null?a.memoizedProps:p,S=n.type,N=n.updateQueue;if(n.updateQueue=null,N!==null)try{S==="input"&&p.type==="radio"&&p.name!=null&&Fi(d,p),Bi(S,v);var U=Bi(S,p);for(v=0;v<N.length;v+=2){var Y=N[v],X=N[v+1];Y==="style"?zi(d,X):Y==="dangerouslySetInnerHTML"?Dl(d,X):Y==="children"?Zs(d,X):ce(d,Y,X,U)}switch(S){case"input":Xs(d,p);break;case"textarea":bl(d,p);break;case"select":var J=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!p.multiple;var oe=p.value;oe!=null?Pn(d,!!p.multiple,oe,!1):J!==!!p.multiple&&(p.defaultValue!=null?Pn(d,!!p.multiple,p.defaultValue,!0):Pn(d,!!p.multiple,p.multiple?[]:"",!1))}d[Sa]=p}catch(he){lt(n,n.return,he)}}break;case 6:if(jn(s,n),lr(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,p=n.memoizedProps;try{d.nodeValue=p}catch(he){lt(n,n.return,he)}}break;case 3:if(jn(s,n),lr(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{hs(s.containerInfo)}catch(he){lt(n,n.return,he)}break;case 4:jn(s,n),lr(n);break;case 13:jn(s,n),lr(n),d=n.child,d.flags&8192&&(p=d.memoizedState!==null,d.stateNode.isHidden=p,!p||d.alternate!==null&&d.alternate.memoizedState!==null||(xd=Ye())),c&4&&wg(n);break;case 22:if(Y=a!==null&&a.memoizedState!==null,n.mode&1?(Ht=(U=Ht)||Y,jn(s,n),Ht=U):jn(s,n),lr(n),c&8192){if(U=n.memoizedState!==null,(n.stateNode.isHidden=U)&&!Y&&(n.mode&1)!==0)for(ae=n,Y=n.child;Y!==null;){for(X=ae=Y;ae!==null;){switch(J=ae,oe=J.child,J.tag){case 0:case 11:case 14:case 15:La(4,J,J.return);break;case 1:To(J,J.return);var ue=J.stateNode;if(typeof ue.componentWillUnmount=="function"){c=J,a=J.return;try{s=c,ue.props=s.memoizedProps,ue.state=s.memoizedState,ue.componentWillUnmount()}catch(he){lt(c,a,he)}}break;case 5:To(J,J.return);break;case 22:if(J.memoizedState!==null){xg(X);continue}}oe!==null?(oe.return=J,ae=oe):xg(X)}Y=Y.sibling}e:for(Y=null,X=n;;){if(X.tag===5){if(Y===null){Y=X;try{d=X.stateNode,U?(p=d.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(S=X.stateNode,N=X.memoizedProps.style,v=N!=null&&N.hasOwnProperty("display")?N.display:null,S.style.display=ns("display",v))}catch(he){lt(n,n.return,he)}}}else if(X.tag===6){if(Y===null)try{X.stateNode.nodeValue=U?"":X.memoizedProps}catch(he){lt(n,n.return,he)}}else if((X.tag!==22&&X.tag!==23||X.memoizedState===null||X===n)&&X.child!==null){X.child.return=X,X=X.child;continue}if(X===n)break e;for(;X.sibling===null;){if(X.return===null||X.return===n)break e;Y===X&&(Y=null),X=X.return}Y===X&&(Y=null),X.sibling.return=X.return,X=X.sibling}}break;case 19:jn(s,n),lr(n),c&4&&wg(n);break;case 21:break;default:jn(s,n),lr(n)}}function lr(n){var s=n.flags;if(s&2){try{e:{for(var a=n.return;a!==null;){if(yg(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Zs(d,""),c.flags&=-33);var p=_g(n);Ed(n,p,d);break;case 3:case 4:var v=c.stateNode.containerInfo,S=_g(n);wd(n,S,v);break;default:throw Error(t(161))}}catch(N){lt(n,n.return,N)}n.flags&=-3}s&4096&&(n.flags&=-4097)}function gE(n,s,a){ae=n,Tg(n)}function Tg(n,s,a){for(var c=(n.mode&1)!==0;ae!==null;){var d=ae,p=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||Cu;if(!v){var S=d.alternate,N=S!==null&&S.memoizedState!==null||Ht;S=Cu;var U=Ht;if(Cu=v,(Ht=N)&&!U)for(ae=d;ae!==null;)v=ae,N=v.child,v.tag===22&&v.memoizedState!==null?Sg(d):N!==null?(N.return=v,ae=N):Sg(d);for(;p!==null;)ae=p,Tg(p),p=p.sibling;ae=d,Cu=S,Ht=U}Ig(n)}else(d.subtreeFlags&8772)!==0&&p!==null?(p.return=d,ae=p):Ig(n)}}function Ig(n){for(;ae!==null;){var s=ae;if((s.flags&8772)!==0){var a=s.alternate;try{if((s.flags&8772)!==0)switch(s.tag){case 0:case 11:case 15:Ht||Ru(5,s);break;case 1:var c=s.stateNode;if(s.flags&4&&!Ht)if(a===null)c.componentDidMount();else{var d=s.elementType===s.type?a.memoizedProps:Ln(s.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var p=s.updateQueue;p!==null&&xm(s,p,c);break;case 3:var v=s.updateQueue;if(v!==null){if(a=null,s.child!==null)switch(s.child.tag){case 5:a=s.child.stateNode;break;case 1:a=s.child.stateNode}xm(s,v,a)}break;case 5:var S=s.stateNode;if(a===null&&s.flags&4){a=S;var N=s.memoizedProps;switch(s.type){case"button":case"input":case"select":case"textarea":N.autoFocus&&a.focus();break;case"img":N.src&&(a.src=N.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(s.memoizedState===null){var U=s.alternate;if(U!==null){var Y=U.memoizedState;if(Y!==null){var X=Y.dehydrated;X!==null&&hs(X)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Ht||s.flags&512&&vd(s)}catch(J){lt(s,s.return,J)}}if(s===n){ae=null;break}if(a=s.sibling,a!==null){a.return=s.return,ae=a;break}ae=s.return}}function xg(n){for(;ae!==null;){var s=ae;if(s===n){ae=null;break}var a=s.sibling;if(a!==null){a.return=s.return,ae=a;break}ae=s.return}}function Sg(n){for(;ae!==null;){var s=ae;try{switch(s.tag){case 0:case 11:case 15:var a=s.return;try{Ru(4,s)}catch(N){lt(s,a,N)}break;case 1:var c=s.stateNode;if(typeof c.componentDidMount=="function"){var d=s.return;try{c.componentDidMount()}catch(N){lt(s,d,N)}}var p=s.return;try{vd(s)}catch(N){lt(s,p,N)}break;case 5:var v=s.return;try{vd(s)}catch(N){lt(s,v,N)}}}catch(N){lt(s,s.return,N)}if(s===n){ae=null;break}var S=s.sibling;if(S!==null){S.return=s.return,ae=S;break}ae=s.return}}var yE=Math.ceil,Pu=Te.ReactCurrentDispatcher,Td=Te.ReactCurrentOwner,xn=Te.ReactCurrentBatchConfig,je=0,Rt=null,_t=null,Lt=0,mn=0,Io=gs(0),xt=0,Ma=null,wi=0,Nu=0,Id=0,ja=null,en=null,xd=0,xo=1/0,Or=null,bu=!1,Sd=null,Ts=null,Du=!1,Is=null,Vu=0,Fa=0,Ad=null,Ou=-1,Lu=0;function Jt(){return(je&6)!==0?Ye():Ou!==-1?Ou:Ou=Ye()}function xs(n){return(n.mode&1)===0?1:(je&2)!==0&&Lt!==0?Lt&-Lt:eE.transition!==null?(Lu===0&&(Lu=oa()),Lu):(n=Le,n!==0||(n=window.event,n=n===void 0?16:Xi(n.type)),n)}function Fn(n,s,a,c){if(50<Fa)throw Fa=0,Ad=null,Error(t(185));li(n,a,c),((je&2)===0||n!==Rt)&&(n===Rt&&((je&2)===0&&(Nu|=a),xt===4&&Ss(n,Lt)),tn(n,c),a===1&&je===0&&(s.mode&1)===0&&(xo=Ye()+500,cu&&_s()))}function tn(n,s){var a=n.callbackNode;ai(n,s);var c=Tr(n,n===Rt?Lt:0);if(c===0)a!==null&&qi(a),n.callbackNode=null,n.callbackPriority=0;else if(s=c&-c,n.callbackPriority!==s){if(a!=null&&qi(a),s===1)n.tag===0?Zw(kg.bind(null,n)):dm(kg.bind(null,n)),Qw(function(){(je&6)===0&&_s()}),a=null;else{switch(Qn(c)){case 1:a=Wi;break;case 4:a=ra;break;case 16:a=ri;break;case 536870912:a=Ki;break;default:a=ri}a=Og(a,Ag.bind(null,n))}n.callbackPriority=s,n.callbackNode=a}}function Ag(n,s){if(Ou=-1,Lu=0,(je&6)!==0)throw Error(t(327));var a=n.callbackNode;if(So()&&n.callbackNode!==a)return null;var c=Tr(n,n===Rt?Lt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||s)s=Mu(n,c);else{s=c;var d=je;je|=2;var p=Rg();(Rt!==n||Lt!==s)&&(Or=null,xo=Ye()+500,Ti(n,s));do try{wE();break}catch(S){Cg(n,S)}while(!0);Hh(),Pu.current=p,je=d,_t!==null?s=0:(Rt=null,Lt=0,s=xt)}if(s!==0){if(s===2&&(d=ia(n),d!==0&&(c=d,s=kd(n,d))),s===1)throw a=Ma,Ti(n,0),Ss(n,c),tn(n,Ye()),a;if(s===6)Ss(n,c);else{if(d=n.current.alternate,(c&30)===0&&!_E(d)&&(s=Mu(n,c),s===2&&(p=ia(n),p!==0&&(c=p,s=kd(n,p))),s===1))throw a=Ma,Ti(n,0),Ss(n,c),tn(n,Ye()),a;switch(n.finishedWork=d,n.finishedLanes=c,s){case 0:case 1:throw Error(t(345));case 2:Ii(n,en,Or);break;case 3:if(Ss(n,c),(c&130023424)===c&&(s=xd+500-Ye(),10<s)){if(Tr(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Jt(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=Dh(Ii.bind(null,n,en,Or),s);break}Ii(n,en,Or);break;case 4:if(Ss(n,c),(c&4194240)===c)break;for(s=n.eventTimes,d=-1;0<c;){var v=31-ln(c);p=1<<v,v=s[v],v>d&&(d=v),c&=~p}if(c=d,c=Ye()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*yE(c/1960))-c,10<c){n.timeoutHandle=Dh(Ii.bind(null,n,en,Or),c);break}Ii(n,en,Or);break;case 5:Ii(n,en,Or);break;default:throw Error(t(329))}}}return tn(n,Ye()),n.callbackNode===a?Ag.bind(null,n):null}function kd(n,s){var a=ja;return n.current.memoizedState.isDehydrated&&(Ti(n,s).flags|=256),n=Mu(n,s),n!==2&&(s=en,en=a,s!==null&&Cd(s)),n}function Cd(n){en===null?en=n:en.push.apply(en,n)}function _E(n){for(var s=n;;){if(s.flags&16384){var a=s.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],p=d.getSnapshot;d=d.value;try{if(!Vn(p(),d))return!1}catch{return!1}}}if(a=s.child,s.subtreeFlags&16384&&a!==null)a.return=s,s=a;else{if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return!0;s=s.return}s.sibling.return=s.return,s=s.sibling}}return!0}function Ss(n,s){for(s&=~Id,s&=~Nu,n.suspendedLanes|=s,n.pingedLanes&=~s,n=n.expirationTimes;0<s;){var a=31-ln(s),c=1<<a;n[a]=-1,s&=~c}}function kg(n){if((je&6)!==0)throw Error(t(327));So();var s=Tr(n,0);if((s&1)===0)return tn(n,Ye()),null;var a=Mu(n,s);if(n.tag!==0&&a===2){var c=ia(n);c!==0&&(s=c,a=kd(n,c))}if(a===1)throw a=Ma,Ti(n,0),Ss(n,s),tn(n,Ye()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=s,Ii(n,en,Or),tn(n,Ye()),null}function Rd(n,s){var a=je;je|=1;try{return n(s)}finally{je=a,je===0&&(xo=Ye()+500,cu&&_s())}}function Ei(n){Is!==null&&Is.tag===0&&(je&6)===0&&So();var s=je;je|=1;var a=xn.transition,c=Le;try{if(xn.transition=null,Le=1,n)return n()}finally{Le=c,xn.transition=a,je=s,(je&6)===0&&_s()}}function Pd(){mn=Io.current,Ze(Io)}function Ti(n,s){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,Gw(a)),_t!==null)for(a=_t.return;a!==null;){var c=a;switch(Fh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&lu();break;case 3:wo(),Ze(Yt),Ze(zt),Xh();break;case 5:Jh(c);break;case 4:wo();break;case 13:Ze(st);break;case 19:Ze(st);break;case 10:qh(c.type._context);break;case 22:case 23:Pd()}a=a.return}if(Rt=n,_t=n=As(n.current,null),Lt=mn=s,xt=0,Ma=null,Id=Nu=wi=0,en=ja=null,yi!==null){for(s=0;s<yi.length;s++)if(a=yi[s],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,p=a.pending;if(p!==null){var v=p.next;p.next=d,c.next=v}a.pending=c}yi=null}return n}function Cg(n,s){do{var a=_t;try{if(Hh(),wu.current=xu,Eu){for(var c=it.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}Eu=!1}if(vi=0,Ct=It=it=null,Na=!1,ba=0,Td.current=null,a===null||a.return===null){xt=1,Ma=s,_t=null;break}e:{var p=n,v=a.return,S=a,N=s;if(s=Lt,S.flags|=32768,N!==null&&typeof N=="object"&&typeof N.then=="function"){var U=N,Y=S,X=Y.tag;if((Y.mode&1)===0&&(X===0||X===11||X===15)){var J=Y.alternate;J?(Y.updateQueue=J.updateQueue,Y.memoizedState=J.memoizedState,Y.lanes=J.lanes):(Y.updateQueue=null,Y.memoizedState=null)}var oe=Zm(v);if(oe!==null){oe.flags&=-257,eg(oe,v,S,p,s),oe.mode&1&&Xm(p,U,s),s=oe,N=U;var ue=s.updateQueue;if(ue===null){var he=new Set;he.add(N),s.updateQueue=he}else ue.add(N);break e}else{if((s&1)===0){Xm(p,U,s),Nd();break e}N=Error(t(426))}}else if(tt&&S.mode&1){var dt=Zm(v);if(dt!==null){(dt.flags&65536)===0&&(dt.flags|=256),eg(dt,v,S,p,s),Bh(Eo(N,S));break e}}p=N=Eo(N,S),xt!==4&&(xt=2),ja===null?ja=[p]:ja.push(p),p=v;do{switch(p.tag){case 3:p.flags|=65536,s&=-s,p.lanes|=s;var L=Jm(p,N,s);Im(p,L);break e;case 1:S=N;var D=p.type,F=p.stateNode;if((p.flags&128)===0&&(typeof D.getDerivedStateFromError=="function"||F!==null&&typeof F.componentDidCatch=="function"&&(Ts===null||!Ts.has(F)))){p.flags|=65536,s&=-s,p.lanes|=s;var ee=Ym(p,S,s);Im(p,ee);break e}}p=p.return}while(p!==null)}Ng(a)}catch(fe){s=fe,_t===a&&a!==null&&(_t=a=a.return);continue}break}while(!0)}function Rg(){var n=Pu.current;return Pu.current=xu,n===null?xu:n}function Nd(){(xt===0||xt===3||xt===2)&&(xt=4),Rt===null||(wi&268435455)===0&&(Nu&268435455)===0||Ss(Rt,Lt)}function Mu(n,s){var a=je;je|=2;var c=Rg();(Rt!==n||Lt!==s)&&(Or=null,Ti(n,s));do try{vE();break}catch(d){Cg(n,d)}while(!0);if(Hh(),je=a,Pu.current=c,_t!==null)throw Error(t(261));return Rt=null,Lt=0,xt}function vE(){for(;_t!==null;)Pg(_t)}function wE(){for(;_t!==null&&!ni();)Pg(_t)}function Pg(n){var s=Vg(n.alternate,n,mn);n.memoizedProps=n.pendingProps,s===null?Ng(n):_t=s,Td.current=null}function Ng(n){var s=n;do{var a=s.alternate;if(n=s.return,(s.flags&32768)===0){if(a=dE(a,s,mn),a!==null){_t=a;return}}else{if(a=fE(a,s),a!==null){a.flags&=32767,_t=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{xt=6,_t=null;return}}if(s=s.sibling,s!==null){_t=s;return}_t=s=n}while(s!==null);xt===0&&(xt=5)}function Ii(n,s,a){var c=Le,d=xn.transition;try{xn.transition=null,Le=1,EE(n,s,a,c)}finally{xn.transition=d,Le=c}return null}function EE(n,s,a,c){do So();while(Is!==null);if((je&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var p=a.lanes|a.childLanes;if(yh(n,p),n===Rt&&(_t=Rt=null,Lt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Du||(Du=!0,Og(ri,function(){return So(),null})),p=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||p){p=xn.transition,xn.transition=null;var v=Le;Le=1;var S=je;je|=4,Td.current=null,mE(n,a),Eg(a,n),zw(Nh),Sr=!!Ph,Nh=Ph=null,n.current=a,gE(a),Er(),je=S,Le=v,xn.transition=p}else n.current=a;if(Du&&(Du=!1,Is=n,Vu=d),p=n.pendingLanes,p===0&&(Ts=null),Hl(a.stateNode),tn(n,Ye()),s!==null)for(c=n.onRecoverableError,a=0;a<s.length;a++)d=s[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(bu)throw bu=!1,n=Sd,Sd=null,n;return(Vu&1)!==0&&n.tag!==0&&So(),p=n.pendingLanes,(p&1)!==0?n===Ad?Fa++:(Fa=0,Ad=n):Fa=0,_s(),null}function So(){if(Is!==null){var n=Qn(Vu),s=xn.transition,a=Le;try{if(xn.transition=null,Le=16>n?16:n,Is===null)var c=!1;else{if(n=Is,Is=null,Vu=0,(je&6)!==0)throw Error(t(331));var d=je;for(je|=4,ae=n.current;ae!==null;){var p=ae,v=p.child;if((ae.flags&16)!==0){var S=p.deletions;if(S!==null){for(var N=0;N<S.length;N++){var U=S[N];for(ae=U;ae!==null;){var Y=ae;switch(Y.tag){case 0:case 11:case 15:La(8,Y,p)}var X=Y.child;if(X!==null)X.return=Y,ae=X;else for(;ae!==null;){Y=ae;var J=Y.sibling,oe=Y.return;if(gg(Y),Y===U){ae=null;break}if(J!==null){J.return=oe,ae=J;break}ae=oe}}}var ue=p.alternate;if(ue!==null){var he=ue.child;if(he!==null){ue.child=null;do{var dt=he.sibling;he.sibling=null,he=dt}while(he!==null)}}ae=p}}if((p.subtreeFlags&2064)!==0&&v!==null)v.return=p,ae=v;else e:for(;ae!==null;){if(p=ae,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:La(9,p,p.return)}var L=p.sibling;if(L!==null){L.return=p.return,ae=L;break e}ae=p.return}}var D=n.current;for(ae=D;ae!==null;){v=ae;var F=v.child;if((v.subtreeFlags&2064)!==0&&F!==null)F.return=v,ae=F;else e:for(v=D;ae!==null;){if(S=ae,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:Ru(9,S)}}catch(fe){lt(S,S.return,fe)}if(S===v){ae=null;break e}var ee=S.sibling;if(ee!==null){ee.return=S.return,ae=ee;break e}ae=S.return}}if(je=d,_s(),an&&typeof an.onPostCommitFiberRoot=="function")try{an.onPostCommitFiberRoot(si,n)}catch{}c=!0}return c}finally{Le=a,xn.transition=s}}return!1}function bg(n,s,a){s=Eo(a,s),s=Jm(n,s,1),n=ws(n,s,1),s=Jt(),n!==null&&(li(n,1,s),tn(n,s))}function lt(n,s,a){if(n.tag===3)bg(n,n,a);else for(;s!==null;){if(s.tag===3){bg(s,n,a);break}else if(s.tag===1){var c=s.stateNode;if(typeof s.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(Ts===null||!Ts.has(c))){n=Eo(a,n),n=Ym(s,n,1),s=ws(s,n,1),n=Jt(),s!==null&&(li(s,1,n),tn(s,n));break}}s=s.return}}function TE(n,s,a){var c=n.pingCache;c!==null&&c.delete(s),s=Jt(),n.pingedLanes|=n.suspendedLanes&a,Rt===n&&(Lt&a)===a&&(xt===4||xt===3&&(Lt&130023424)===Lt&&500>Ye()-xd?Ti(n,0):Id|=a),tn(n,s)}function Dg(n,s){s===0&&((n.mode&1)===0?s=1:(s=ls,ls<<=1,(ls&130023424)===0&&(ls=4194304)));var a=Jt();n=br(n,s),n!==null&&(li(n,s,a),tn(n,a))}function IE(n){var s=n.memoizedState,a=0;s!==null&&(a=s.retryLane),Dg(n,a)}function xE(n,s){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(s),Dg(n,a)}var Vg;Vg=function(n,s,a){if(n!==null)if(n.memoizedProps!==s.pendingProps||Yt.current)Zt=!0;else{if((n.lanes&a)===0&&(s.flags&128)===0)return Zt=!1,hE(n,s,a);Zt=(n.flags&131072)!==0}else Zt=!1,tt&&(s.flags&1048576)!==0&&fm(s,du,s.index);switch(s.lanes=0,s.tag){case 2:var c=s.type;ku(n,s),n=s.pendingProps;var d=fo(s,zt.current);vo(s,a),d=td(null,s,c,n,d,a);var p=nd();return s.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(s.tag=1,s.memoizedState=null,s.updateQueue=null,Xt(c)?(p=!0,uu(s)):p=!1,s.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Gh(s),d.updater=Su,s.stateNode=d,d._reactInternals=s,ld(s,c,n,a),s=dd(null,s,c,!0,p,a)):(s.tag=0,tt&&p&&jh(s),Qt(null,s,d,a),s=s.child),s;case 16:c=s.elementType;e:{switch(ku(n,s),n=s.pendingProps,d=c._init,c=d(c._payload),s.type=c,d=s.tag=AE(c),n=Ln(c,n),d){case 0:s=hd(null,s,c,n,a);break e;case 1:s=og(null,s,c,n,a);break e;case 11:s=tg(null,s,c,n,a);break e;case 14:s=ng(null,s,c,Ln(c.type,n),a);break e}throw Error(t(306,c,""))}return s;case 0:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:Ln(c,d),hd(n,s,c,d,a);case 1:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:Ln(c,d),og(n,s,c,d,a);case 3:e:{if(ag(s),n===null)throw Error(t(387));c=s.pendingProps,p=s.memoizedState,d=p.element,Tm(n,s),_u(s,c,null,a);var v=s.memoizedState;if(c=v.element,p.isDehydrated)if(p={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},s.updateQueue.baseState=p,s.memoizedState=p,s.flags&256){d=Eo(Error(t(423)),s),s=lg(n,s,c,a,d);break e}else if(c!==d){d=Eo(Error(t(424)),s),s=lg(n,s,c,a,d);break e}else for(pn=ms(s.stateNode.containerInfo.firstChild),fn=s,tt=!0,On=null,a=wm(s,null,c,a),s.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(go(),c===d){s=Vr(n,s,a);break e}Qt(n,s,c,a)}s=s.child}return s;case 5:return Sm(s),n===null&&zh(s),c=s.type,d=s.pendingProps,p=n!==null?n.memoizedProps:null,v=d.children,bh(c,d)?v=null:p!==null&&bh(c,p)&&(s.flags|=32),ig(n,s),Qt(n,s,v,a),s.child;case 6:return n===null&&zh(s),null;case 13:return ug(n,s,a);case 4:return Qh(s,s.stateNode.containerInfo),c=s.pendingProps,n===null?s.child=yo(s,null,c,a):Qt(n,s,c,a),s.child;case 11:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:Ln(c,d),tg(n,s,c,d,a);case 7:return Qt(n,s,s.pendingProps,a),s.child;case 8:return Qt(n,s,s.pendingProps.children,a),s.child;case 12:return Qt(n,s,s.pendingProps.children,a),s.child;case 10:e:{if(c=s.type._context,d=s.pendingProps,p=s.memoizedProps,v=d.value,Ge(mu,c._currentValue),c._currentValue=v,p!==null)if(Vn(p.value,v)){if(p.children===d.children&&!Yt.current){s=Vr(n,s,a);break e}}else for(p=s.child,p!==null&&(p.return=s);p!==null;){var S=p.dependencies;if(S!==null){v=p.child;for(var N=S.firstContext;N!==null;){if(N.context===c){if(p.tag===1){N=Dr(-1,a&-a),N.tag=2;var U=p.updateQueue;if(U!==null){U=U.shared;var Y=U.pending;Y===null?N.next=N:(N.next=Y.next,Y.next=N),U.pending=N}}p.lanes|=a,N=p.alternate,N!==null&&(N.lanes|=a),Wh(p.return,a,s),S.lanes|=a;break}N=N.next}}else if(p.tag===10)v=p.type===s.type?null:p.child;else if(p.tag===18){if(v=p.return,v===null)throw Error(t(341));v.lanes|=a,S=v.alternate,S!==null&&(S.lanes|=a),Wh(v,a,s),v=p.sibling}else v=p.child;if(v!==null)v.return=p;else for(v=p;v!==null;){if(v===s){v=null;break}if(p=v.sibling,p!==null){p.return=v.return,v=p;break}v=v.return}p=v}Qt(n,s,d.children,a),s=s.child}return s;case 9:return d=s.type,c=s.pendingProps.children,vo(s,a),d=Tn(d),c=c(d),s.flags|=1,Qt(n,s,c,a),s.child;case 14:return c=s.type,d=Ln(c,s.pendingProps),d=Ln(c.type,d),ng(n,s,c,d,a);case 15:return rg(n,s,s.type,s.pendingProps,a);case 17:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:Ln(c,d),ku(n,s),s.tag=1,Xt(c)?(n=!0,uu(s)):n=!1,vo(s,a),Gm(s,c,d),ld(s,c,d,a),dd(null,s,c,!0,n,a);case 19:return hg(n,s,a);case 22:return sg(n,s,a)}throw Error(t(156,s.tag))};function Og(n,s){return na(n,s)}function SE(n,s,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=s,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Sn(n,s,a,c){return new SE(n,s,a,c)}function bd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function AE(n){if(typeof n=="function")return bd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===O)return 11;if(n===mt)return 14}return 2}function As(n,s){var a=n.alternate;return a===null?(a=Sn(n.tag,s,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=s,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,s=n.dependencies,a.dependencies=s===null?null:{lanes:s.lanes,firstContext:s.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function ju(n,s,a,c,d,p){var v=2;if(c=n,typeof n=="function")bd(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case k:return xi(a.children,d,p,s);case x:v=8,d|=8;break;case R:return n=Sn(12,a,s,d|2),n.elementType=R,n.lanes=p,n;case C:return n=Sn(13,a,s,d),n.elementType=C,n.lanes=p,n;case $e:return n=Sn(19,a,s,d),n.elementType=$e,n.lanes=p,n;case He:return Fu(a,d,p,s);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case b:v=10;break e;case P:v=9;break e;case O:v=11;break e;case mt:v=14;break e;case kt:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return s=Sn(v,a,s,d),s.elementType=n,s.type=c,s.lanes=p,s}function xi(n,s,a,c){return n=Sn(7,n,c,s),n.lanes=a,n}function Fu(n,s,a,c){return n=Sn(22,n,c,s),n.elementType=He,n.lanes=a,n.stateNode={isHidden:!1},n}function Dd(n,s,a){return n=Sn(6,n,null,s),n.lanes=a,n}function Vd(n,s,a){return s=Sn(4,n.children!==null?n.children:[],n.key,s),s.lanes=a,s.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},s}function kE(n,s,a,c,d){this.tag=s,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=aa(0),this.expirationTimes=aa(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=aa(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Od(n,s,a,c,d,p,v,S,N){return n=new kE(n,s,a,S,N),s===1?(s=1,p===!0&&(s|=8)):s=0,p=Sn(3,null,null,s),n.current=p,p.stateNode=n,p.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Gh(p),n}function CE(n,s,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:de,key:c==null?null:""+c,children:n,containerInfo:s,implementation:a}}function Lg(n){if(!n)return ys;n=n._reactInternals;e:{if(bn(n)!==n||n.tag!==1)throw Error(t(170));var s=n;do{switch(s.tag){case 3:s=s.stateNode.context;break e;case 1:if(Xt(s.type)){s=s.stateNode.__reactInternalMemoizedMergedChildContext;break e}}s=s.return}while(s!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Xt(a))return cm(n,a,s)}return s}function Mg(n,s,a,c,d,p,v,S,N){return n=Od(a,c,!0,n,d,p,v,S,N),n.context=Lg(null),a=n.current,c=Jt(),d=xs(a),p=Dr(c,d),p.callback=s??null,ws(a,p,d),n.current.lanes=d,li(n,d,c),tn(n,c),n}function Uu(n,s,a,c){var d=s.current,p=Jt(),v=xs(d);return a=Lg(a),s.context===null?s.context=a:s.pendingContext=a,s=Dr(p,v),s.payload={element:n},c=c===void 0?null:c,c!==null&&(s.callback=c),n=ws(d,s,v),n!==null&&(Fn(n,d,v,p),yu(n,d,v)),v}function zu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function jg(n,s){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<s?a:s}}function Ld(n,s){jg(n,s),(n=n.alternate)&&jg(n,s)}function RE(){return null}var Fg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Md(n){this._internalRoot=n}Bu.prototype.render=Md.prototype.render=function(n){var s=this._internalRoot;if(s===null)throw Error(t(409));Uu(n,s,null,null)},Bu.prototype.unmount=Md.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var s=n.containerInfo;Ei(function(){Uu(null,n,null,null)}),s[Cr]=null}};function Bu(n){this._internalRoot=n}Bu.prototype.unstable_scheduleHydration=function(n){if(n){var s=ha();n={blockedOn:null,target:n,priority:s};for(var a=0;a<un.length&&s!==0&&s<un[a].priority;a++);un.splice(a,0,n),a===0&&Ji(n)}};function jd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function $u(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Ug(){}function PE(n,s,a,c,d){if(d){if(typeof c=="function"){var p=c;c=function(){var U=zu(v);p.call(U)}}var v=Mg(s,c,n,0,null,!1,!1,"",Ug);return n._reactRootContainer=v,n[Cr]=v.current,Ia(n.nodeType===8?n.parentNode:n),Ei(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var S=c;c=function(){var U=zu(N);S.call(U)}}var N=Od(n,0,!1,null,null,!1,!1,"",Ug);return n._reactRootContainer=N,n[Cr]=N.current,Ia(n.nodeType===8?n.parentNode:n),Ei(function(){Uu(s,N,a,c)}),N}function Hu(n,s,a,c,d){var p=a._reactRootContainer;if(p){var v=p;if(typeof d=="function"){var S=d;d=function(){var N=zu(v);S.call(N)}}Uu(s,v,n,d)}else v=PE(a,s,n,d,c);return zu(v)}ua=function(n){switch(n.tag){case 3:var s=n.stateNode;if(s.current.memoizedState.isDehydrated){var a=Ue(s.pendingLanes);a!==0&&(la(s,a|1),tn(s,Ye()),(je&6)===0&&(xo=Ye()+500,_s()))}break;case 13:Ei(function(){var c=br(n,1);if(c!==null){var d=Jt();Fn(c,n,1,d)}}),Ld(n,1)}},Gi=function(n){if(n.tag===13){var s=br(n,134217728);if(s!==null){var a=Jt();Fn(s,n,134217728,a)}Ld(n,134217728)}},ca=function(n){if(n.tag===13){var s=xs(n),a=br(n,s);if(a!==null){var c=Jt();Fn(a,n,s,c)}Ld(n,s)}},ha=function(){return Le},da=function(n,s){var a=Le;try{return Le=n,s()}finally{Le=a}},_r=function(n,s,a){switch(s){case"input":if(Xs(n,a),s=a.name,a.type==="radio"&&s!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+s)+'][type="radio"]'),s=0;s<a.length;s++){var c=a[s];if(c!==n&&c.form===n.form){var d=au(c);if(!d)throw Error(t(90));ot(c),Xs(c,d)}}}break;case"textarea":bl(n,a);break;case"select":s=a.value,s!=null&&Pn(n,!!a.multiple,s,!1)}},Ol=Rd,Ll=Ei;var NE={usingClientEntryPoint:!1,Events:[Aa,co,au,ss,is,Rd]},Ua={findFiberByHostInstance:fi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},bE={bundleType:Ua.bundleType,version:Ua.version,rendererPackageName:Ua.rendererPackageName,rendererConfig:Ua.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Te.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=$l(n),n===null?null:n.stateNode},findFiberByHostInstance:Ua.findFiberByHostInstance||RE,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var qu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!qu.isDisabled&&qu.supportsFiber)try{si=qu.inject(bE),an=qu}catch{}}return nn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=NE,nn.createPortal=function(n,s){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!jd(s))throw Error(t(200));return CE(n,s,null,a)},nn.createRoot=function(n,s){if(!jd(n))throw Error(t(299));var a=!1,c="",d=Fg;return s!=null&&(s.unstable_strictMode===!0&&(a=!0),s.identifierPrefix!==void 0&&(c=s.identifierPrefix),s.onRecoverableError!==void 0&&(d=s.onRecoverableError)),s=Od(n,1,!1,null,null,a,!1,c,d),n[Cr]=s.current,Ia(n.nodeType===8?n.parentNode:n),new Md(s)},nn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var s=n._reactInternals;if(s===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=$l(s),n=n===null?null:n.stateNode,n},nn.flushSync=function(n){return Ei(n)},nn.hydrate=function(n,s,a){if(!$u(s))throw Error(t(200));return Hu(null,n,s,!0,a)},nn.hydrateRoot=function(n,s,a){if(!jd(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,p="",v=Fg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(p=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),s=Mg(s,null,n,1,a??null,d,!1,p,v),n[Cr]=s.current,Ia(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),s.mutableSourceEagerHydrationData==null?s.mutableSourceEagerHydrationData=[a,d]:s.mutableSourceEagerHydrationData.push(a,d);return new Bu(s)},nn.render=function(n,s,a){if(!$u(s))throw Error(t(200));return Hu(null,n,s,!1,a)},nn.unmountComponentAtNode=function(n){if(!$u(n))throw Error(t(40));return n._reactRootContainer?(Ei(function(){Hu(null,null,n,!1,function(){n._reactRootContainer=null,n[Cr]=null})}),!0):!1},nn.unstable_batchedUpdates=Rd,nn.unstable_renderSubtreeIntoContainer=function(n,s,a,c){if(!$u(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Hu(n,s,a,!1,c)},nn.version="18.3.1-next-f1338f8080-20240426",nn}var Gg;function $E(){if(Gg)return zd.exports;Gg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),zd.exports=BE(),zd.exports}var Qg;function HE(){if(Qg)return Ku;Qg=1;var r=$E();return Ku.createRoot=r.createRoot,Ku.hydrateRoot=r.hydrateRoot,Ku}var qE=HE();const WE=D_(qE);let KE={data:""},GE=r=>{if(typeof window=="object"){let e=(r?r.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(r||document.head).appendChild(e),e.firstChild}return r||KE},QE=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,JE=/\/\*[^]*?\*\/|  +/g,Jg=/\n+/g,Ps=(r,e)=>{let t="",i="",o="";for(let l in r){let h=r[l];l[0]=="@"?l[1]=="i"?t=l+" "+h+";":i+=l[1]=="f"?Ps(h,l):l+"{"+Ps(h,l[1]=="k"?"":e)+"}":typeof h=="object"?i+=Ps(h,e?e.replace(/([^,])+/g,f=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,g=>/&/.test(g)?g.replace(/&/g,f):f?f+" "+g:g)):l):h!=null&&(l=l[1]=="-"?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=Ps.p?Ps.p(l,h):l+":"+h+";")}return t+(e&&o?e+"{"+o+"}":o)+i},Cs={},V_=r=>{if(typeof r=="object"){let e="";for(let t in r)e+=t+V_(r[t]);return e}return r},YE=(r,e,t,i,o)=>{let l=V_(r),h=Cs[l]||(Cs[l]=(g=>{let _=0,E=11;for(;_<g.length;)E=101*E+g.charCodeAt(_++)>>>0;return"go"+E})(l));if(!Cs[h]){let g=l!==r?r:(_=>{let E,I,A=[{}];for(;E=QE.exec(_.replace(JE,""));)E[4]?A.shift():E[3]?(I=E[3].replace(Jg," ").trim(),A.unshift(A[0][I]=A[0][I]||{})):A[0][E[1]]=E[2].replace(Jg," ").trim();return A[0]})(r);Cs[h]=Ps(o?{["@keyframes "+h]:g}:g,t?"":"."+h)}let f=t&&Cs.g;return t&&(Cs.g=Cs[h]),((g,_,E,I)=>{I?_.data=_.data.replace(I,g):_.data.indexOf(g)===-1&&(_.data=E?g+_.data:_.data+g)})(Cs[h],e,i,f),h},XE=(r,e,t)=>r.reduce((i,o,l)=>{let h=e[l];if(h&&h.call){let f=h(t),g=f&&f.props&&f.props.className||/^go/.test(f)&&f;h=g?"."+g:f&&typeof f=="object"?f.props?"":Ps(f,""):f===!1?"":f}return i+o+(h??"")},"");function Hc(r){let e=this||{},t=r.call?r(e.p):r;return YE(t.unshift?t.raw?XE(t,[].slice.call(arguments,1),e.p):t.reduce((i,o)=>Object.assign(i,o&&o.call?o(e.p):o),{}):t,GE(e.target),e.g,e.o,e.k)}let O_,rf,sf;Hc.bind({g:1});let Hr=Hc.bind({k:1});function ZE(r,e,t,i){Ps.p=e,O_=r,rf=t,sf=i}function Ks(r,e){let t=this||{};return function(){let i=arguments;function o(l,h){let f=Object.assign({},l),g=f.className||o.className;t.p=Object.assign({theme:rf&&rf()},f),t.o=/go\d/.test(g),f.className=Hc.apply(t,i)+(g?" "+g:"");let _=r;return r[0]&&(_=f.as||r,delete f.as),sf&&_[0]&&sf(f),O_(_,f)}return o}}var eT=r=>typeof r=="function",gc=(r,e)=>eT(r)?r(e):r,tT=(()=>{let r=0;return()=>(++r).toString()})(),L_=(()=>{let r;return()=>{if(r===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r}})(),nT=20,bf="default",M_=(r,e)=>{let{toastLimit:t}=r.settings;switch(e.type){case 0:return{...r,toasts:[e.toast,...r.toasts].slice(0,t)};case 1:return{...r,toasts:r.toasts.map(h=>h.id===e.toast.id?{...h,...e.toast}:h)};case 2:let{toast:i}=e;return M_(r,{type:r.toasts.find(h=>h.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=e;return{...r,toasts:r.toasts.map(h=>h.id===o||o===void 0?{...h,dismissed:!0,visible:!1}:h)};case 4:return e.toastId===void 0?{...r,toasts:[]}:{...r,toasts:r.toasts.filter(h=>h.id!==e.toastId)};case 5:return{...r,pausedAt:e.time};case 6:let l=e.time-(r.pausedAt||0);return{...r,pausedAt:void 0,toasts:r.toasts.map(h=>({...h,pauseDuration:h.pauseDuration+l}))}}},sc=[],j_={toasts:[],pausedAt:void 0,settings:{toastLimit:nT}},cr={},F_=(r,e=bf)=>{cr[e]=M_(cr[e]||j_,r),sc.forEach(([t,i])=>{t===e&&i(cr[e])})},U_=r=>Object.keys(cr).forEach(e=>F_(r,e)),rT=r=>Object.keys(cr).find(e=>cr[e].toasts.some(t=>t.id===r)),qc=(r=bf)=>e=>{F_(e,r)},sT={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},iT=(r={},e=bf)=>{let[t,i]=Q.useState(cr[e]||j_),o=Q.useRef(cr[e]);Q.useEffect(()=>(o.current!==cr[e]&&i(cr[e]),sc.push([e,i]),()=>{let h=sc.findIndex(([f])=>f===e);h>-1&&sc.splice(h,1)}),[e]);let l=t.toasts.map(h=>{var f,g,_;return{...r,...r[h.type],...h,removeDelay:h.removeDelay||((f=r[h.type])==null?void 0:f.removeDelay)||(r==null?void 0:r.removeDelay),duration:h.duration||((g=r[h.type])==null?void 0:g.duration)||(r==null?void 0:r.duration)||sT[h.type],style:{...r.style,...(_=r[h.type])==null?void 0:_.style,...h.style}}});return{...t,toasts:l}},oT=(r,e="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:r,pauseDuration:0,...t,id:(t==null?void 0:t.id)||tT()}),yl=r=>(e,t)=>{let i=oT(e,r,t);return qc(i.toasterId||rT(i.id))({type:2,toast:i}),i.id},St=(r,e)=>yl("blank")(r,e);St.error=yl("error");St.success=yl("success");St.loading=yl("loading");St.custom=yl("custom");St.dismiss=(r,e)=>{let t={type:3,toastId:r};e?qc(e)(t):U_(t)};St.dismissAll=r=>St.dismiss(void 0,r);St.remove=(r,e)=>{let t={type:4,toastId:r};e?qc(e)(t):U_(t)};St.removeAll=r=>St.remove(void 0,r);St.promise=(r,e,t)=>{let i=St.loading(e.loading,{...t,...t==null?void 0:t.loading});return typeof r=="function"&&(r=r()),r.then(o=>{let l=e.success?gc(e.success,o):void 0;return l?St.success(l,{id:i,...t,...t==null?void 0:t.success}):St.dismiss(i),o}).catch(o=>{let l=e.error?gc(e.error,o):void 0;l?St.error(l,{id:i,...t,...t==null?void 0:t.error}):St.dismiss(i)}),r};var aT=1e3,lT=(r,e="default")=>{let{toasts:t,pausedAt:i}=iT(r,e),o=Q.useRef(new Map).current,l=Q.useCallback((I,A=aT)=>{if(o.has(I))return;let j=setTimeout(()=>{o.delete(I),h({type:4,toastId:I})},A);o.set(I,j)},[]);Q.useEffect(()=>{if(i)return;let I=Date.now(),A=t.map(j=>{if(j.duration===1/0)return;let W=(j.duration||0)+j.pauseDuration-(I-j.createdAt);if(W<0){j.visible&&St.dismiss(j.id);return}return setTimeout(()=>St.dismiss(j.id,e),W)});return()=>{A.forEach(j=>j&&clearTimeout(j))}},[t,i,e]);let h=Q.useCallback(qc(e),[e]),f=Q.useCallback(()=>{h({type:5,time:Date.now()})},[h]),g=Q.useCallback((I,A)=>{h({type:1,toast:{id:I,height:A}})},[h]),_=Q.useCallback(()=>{i&&h({type:6,time:Date.now()})},[i,h]),E=Q.useCallback((I,A)=>{let{reverseOrder:j=!1,gutter:W=8,defaultPosition:K}=A||{},$=t.filter(ce=>(ce.position||K)===(I.position||K)&&ce.height),pe=$.findIndex(ce=>ce.id===I.id),le=$.filter((ce,Te)=>Te<pe&&ce.visible).length;return $.filter(ce=>ce.visible).slice(...j?[le+1]:[0,le]).reduce((ce,Te)=>ce+(Te.height||0)+W,0)},[t]);return Q.useEffect(()=>{t.forEach(I=>{if(I.dismissed)l(I.id,I.removeDelay);else{let A=o.get(I.id);A&&(clearTimeout(A),o.delete(I.id))}})},[t,l]),{toasts:t,handlers:{updateHeight:g,startPause:f,endPause:_,calculateOffset:E}}},uT=Hr`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,cT=Hr`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,hT=Hr`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,dT=Ks("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${uT} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${cT} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${r=>r.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${hT} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,fT=Hr`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,pT=Ks("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${r=>r.secondary||"#e0e0e0"};
  border-right-color: ${r=>r.primary||"#616161"};
  animation: ${fT} 1s linear infinite;
`,mT=Hr`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,gT=Hr`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,yT=Ks("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${mT} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${gT} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${r=>r.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,_T=Ks("div")`
  position: absolute;
`,vT=Ks("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,wT=Hr`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ET=Ks("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${wT} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,TT=({toast:r})=>{let{icon:e,type:t,iconTheme:i}=r;return e!==void 0?typeof e=="string"?Q.createElement(ET,null,e):e:t==="blank"?null:Q.createElement(vT,null,Q.createElement(pT,{...i}),t!=="loading"&&Q.createElement(_T,null,t==="error"?Q.createElement(dT,{...i}):Q.createElement(yT,{...i})))},IT=r=>`
0% {transform: translate3d(0,${r*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,xT=r=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${r*-150}%,-1px) scale(.6); opacity:0;}
`,ST="0%{opacity:0;} 100%{opacity:1;}",AT="0%{opacity:1;} 100%{opacity:0;}",kT=Ks("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,CT=Ks("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,RT=(r,e)=>{let t=r.includes("top")?1:-1,[i,o]=L_()?[ST,AT]:[IT(t),xT(t)];return{animation:e?`${Hr(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${Hr(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},PT=Q.memo(({toast:r,position:e,style:t,children:i})=>{let o=r.height?RT(r.position||e||"top-center",r.visible):{opacity:0},l=Q.createElement(TT,{toast:r}),h=Q.createElement(CT,{...r.ariaProps},gc(r.message,r));return Q.createElement(kT,{className:r.className,style:{...o,...t,...r.style}},typeof i=="function"?i({icon:l,message:h}):Q.createElement(Q.Fragment,null,l,h))});ZE(Q.createElement);var NT=({id:r,className:e,style:t,onHeightUpdate:i,children:o})=>{let l=Q.useCallback(h=>{if(h){let f=()=>{let g=h.getBoundingClientRect().height;i(r,g)};f(),new MutationObserver(f).observe(h,{subtree:!0,childList:!0,characterData:!0})}},[r,i]);return Q.createElement("div",{ref:l,className:e,style:t},o)},bT=(r,e)=>{let t=r.includes("top"),i=t?{top:0}:{bottom:0},o=r.includes("center")?{justifyContent:"center"}:r.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:L_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(t?1:-1)}px)`,...i,...o}},DT=Hc`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Gu=16,VT=({reverseOrder:r,position:e="top-center",toastOptions:t,gutter:i,children:o,toasterId:l,containerStyle:h,containerClassName:f})=>{let{toasts:g,handlers:_}=lT(t,l);return Q.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:Gu,left:Gu,right:Gu,bottom:Gu,pointerEvents:"none",...h},className:f,onMouseEnter:_.startPause,onMouseLeave:_.endPause},g.map(E=>{let I=E.position||e,A=_.calculateOffset(E,{reverseOrder:r,gutter:i,defaultPosition:e}),j=bT(I,A);return Q.createElement(NT,{id:E.id,key:E.id,onHeightUpdate:_.updateHeight,className:E.visible?DT:"",style:j},E.type==="custom"?gc(E.message,E):o?o(E):Q.createElement(PT,{toast:E,position:I}))}))},Qe=St;const OT=()=>{};var Yg={};/**
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
 */const z_=function(r){const e=[];let t=0;for(let i=0;i<r.length;i++){let o=r.charCodeAt(i);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&i+1<r.length&&(r.charCodeAt(i+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++i)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},LT=function(r){const e=[];let t=0,i=0;for(;t<r.length;){const o=r[t++];if(o<128)e[i++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[i++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],f=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|f&63)-65536;e[i++]=String.fromCharCode(55296+(g>>10)),e[i++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[i++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},B_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,f=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,E=l>>2,I=(l&3)<<4|f>>4;let A=(f&15)<<2|_>>6,j=_&63;g||(j=64,h||(A=64)),i.push(t[E],t[I],t[A],t[j])}return i.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(z_(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):LT(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],f=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const I=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||f==null||_==null||I==null)throw new MT;const A=l<<2|f>>4;if(i.push(A),_!==64){const j=f<<4&240|_>>2;if(i.push(j),I!==64){const W=_<<6&192|I;i.push(W)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class MT extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const jT=function(r){const e=z_(r);return B_.encodeByteArray(e,!0)},yc=function(r){return jT(r).replace(/\./g,"")},$_=function(r){try{return B_.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function FT(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const UT=()=>FT().__FIREBASE_DEFAULTS__,zT=()=>{if(typeof process>"u"||typeof Yg>"u")return;const r=Yg.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},BT=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&$_(r[1]);return e&&JSON.parse(e)},Wc=()=>{try{return OT()||UT()||zT()||BT()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},H_=r=>{var e,t;return(t=(e=Wc())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},$T=r=>{const e=H_(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},q_=()=>{var r;return(r=Wc())==null?void 0:r.config},W_=r=>{var e;return(e=Wc())==null?void 0:e[`_${r}`]};/**
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
 */class HT{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
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
 */function qT(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${i}`,aud:i,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}},...r};return[yc(JSON.stringify(t)),yc(JSON.stringify(h)),""].join(".")}/**
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
 */function Gt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function WT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Gt())}function KT(){var e;const r=(e=Wc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function GT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function QT(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function JT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function YT(){const r=Gt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function XT(){return!KT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ZT(){try{return typeof indexedDB=="object"}catch{return!1}}function eI(){return new Promise((r,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(i);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(i),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)==null?void 0:l.message)||"")}}catch(t){e(t)}})}/**
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
 */const tI="FirebaseError";class Jr extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=tI,Object.setPrototypeOf(this,Jr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_l.prototype.create)}}class _l{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?nI(l,i):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new Jr(o,f,i)}}function nI(r,e){return r.replace(rI,(t,i)=>{const o=e[i];return o!=null?String(o):`<${i}?>`})}const rI=/\{\$([^}]+)}/g;function sI(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Pi(r,e){if(r===e)return!0;const t=Object.keys(r),i=Object.keys(e);for(const o of t){if(!i.includes(o))return!1;const l=r[o],h=e[o];if(Xg(l)&&Xg(h)){if(!Pi(l,h))return!1}else if(l!==h)return!1}for(const o of i)if(!t.includes(o))return!1;return!0}function Xg(r){return r!==null&&typeof r=="object"}/**
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
 */function vl(r){const e=[];for(const[t,i]of Object.entries(r))Array.isArray(i)?i.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Ha(r){const e={};return r.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[o,l]=i.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function qa(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function iI(r,e){const t=new oI(r,e);return t.subscribe.bind(t)}class oI{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let o;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");aI(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:i},o.next===void 0&&(o.next=Hd),o.error===void 0&&(o.error=Hd),o.complete===void 0&&(o.complete=Hd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function aI(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Hd(){}/**
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
 */function pt(r){return r&&r._delegate?r._delegate:r}/**
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
 */function wl(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function K_(r){return(await fetch(r,{credentials:"include"})).ok}class Ni{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Si="[DEFAULT]";/**
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
 */class lI{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new HT;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&i.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(i)return null;throw o}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(cI(e))try{this.getOrInitializeService({instanceIdentifier:Si})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});i.resolve(l)}catch{}}}}clearInstance(e=Si){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Si){return this.instances.has(e)}getOptions(e=Si){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[l,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(l);i===f&&h.resolve(o)}return o}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(i)??new Set;o.add(e),this.onInitCallbacks.set(i,o);const l=this.instances.get(i);return l&&e(l,i),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const o of i)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:uI(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Si){return this.component?this.component.multipleInstances?e:Si:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function uI(r){return r===Si?void 0:r}function cI(r){return r.instantiationMode==="EAGER"}/**
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
 */class hI{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new lI(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Oe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Oe||(Oe={}));const dI={debug:Oe.DEBUG,verbose:Oe.VERBOSE,info:Oe.INFO,warn:Oe.WARN,error:Oe.ERROR,silent:Oe.SILENT},fI=Oe.INFO,pI={[Oe.DEBUG]:"log",[Oe.VERBOSE]:"log",[Oe.INFO]:"info",[Oe.WARN]:"warn",[Oe.ERROR]:"error"},mI=(r,e,...t)=>{if(e<r.logLevel)return;const i=new Date().toISOString(),o=pI[e];if(o)console[o](`[${i}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Df{constructor(e){this.name=e,this._logLevel=fI,this._logHandler=mI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?dI[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Oe.DEBUG,...e),this._logHandler(this,Oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Oe.VERBOSE,...e),this._logHandler(this,Oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Oe.INFO,...e),this._logHandler(this,Oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Oe.WARN,...e),this._logHandler(this,Oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Oe.ERROR,...e),this._logHandler(this,Oe.ERROR,...e)}}const gI=(r,e)=>e.some(t=>r instanceof t);let Zg,ey;function yI(){return Zg||(Zg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function _I(){return ey||(ey=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const G_=new WeakMap,of=new WeakMap,Q_=new WeakMap,qd=new WeakMap,Vf=new WeakMap;function vI(r){const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(Vs(r.result)),o()},h=()=>{i(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&G_.set(t,r)}).catch(()=>{}),Vf.set(e,r),e}function wI(r){if(of.has(r))return;const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{i(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});of.set(r,e)}let af={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return of.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Q_.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Vs(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function EI(r){af=r(af)}function TI(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=r.call(Wd(this),e,...t);return Q_.set(i,e.sort?e.sort():[e]),Vs(i)}:_I().includes(r)?function(...e){return r.apply(Wd(this),e),Vs(G_.get(this))}:function(...e){return Vs(r.apply(Wd(this),e))}}function II(r){return typeof r=="function"?TI(r):(r instanceof IDBTransaction&&wI(r),gI(r,yI())?new Proxy(r,af):r)}function Vs(r){if(r instanceof IDBRequest)return vI(r);if(qd.has(r))return qd.get(r);const e=II(r);return e!==r&&(qd.set(r,e),Vf.set(e,r)),e}const Wd=r=>Vf.get(r);function xI(r,e,{blocked:t,upgrade:i,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),f=Vs(h);return i&&h.addEventListener("upgradeneeded",g=>{i(Vs(h.result),g.oldVersion,g.newVersion,Vs(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),f}const SI=["get","getKey","getAll","getAllKeys","count"],AI=["put","add","delete","clear"],Kd=new Map;function ty(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Kd.get(e))return Kd.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,o=AI.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(o||SI.includes(t)))return;const l=async function(h,...f){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return i&&(_=_.index(f.shift())),(await Promise.all([_[t](...f),o&&g.done]))[0]};return Kd.set(e,l),l}EI(r=>({...r,get:(e,t,i)=>ty(e,t)||r.get(e,t,i),has:(e,t)=>!!ty(e,t)||r.has(e,t)}));/**
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
 */class kI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(CI(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function CI(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const lf="@firebase/app",ny="0.14.13";/**
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
 */const qr=new Df("@firebase/app"),RI="@firebase/app-compat",PI="@firebase/analytics-compat",NI="@firebase/analytics",bI="@firebase/app-check-compat",DI="@firebase/app-check",VI="@firebase/auth",OI="@firebase/auth-compat",LI="@firebase/database",MI="@firebase/data-connect",jI="@firebase/database-compat",FI="@firebase/functions",UI="@firebase/functions-compat",zI="@firebase/installations",BI="@firebase/installations-compat",$I="@firebase/messaging",HI="@firebase/messaging-compat",qI="@firebase/performance",WI="@firebase/performance-compat",KI="@firebase/remote-config",GI="@firebase/remote-config-compat",QI="@firebase/storage",JI="@firebase/storage-compat",YI="@firebase/firestore",XI="@firebase/ai",ZI="@firebase/firestore-compat",e1="firebase",t1="12.14.0";/**
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
 */const uf="[DEFAULT]",n1={[lf]:"fire-core",[RI]:"fire-core-compat",[NI]:"fire-analytics",[PI]:"fire-analytics-compat",[DI]:"fire-app-check",[bI]:"fire-app-check-compat",[VI]:"fire-auth",[OI]:"fire-auth-compat",[LI]:"fire-rtdb",[MI]:"fire-data-connect",[jI]:"fire-rtdb-compat",[FI]:"fire-fn",[UI]:"fire-fn-compat",[zI]:"fire-iid",[BI]:"fire-iid-compat",[$I]:"fire-fcm",[HI]:"fire-fcm-compat",[qI]:"fire-perf",[WI]:"fire-perf-compat",[KI]:"fire-rc",[GI]:"fire-rc-compat",[QI]:"fire-gcs",[JI]:"fire-gcs-compat",[YI]:"fire-fst",[ZI]:"fire-fst-compat",[XI]:"fire-vertex","fire-js":"fire-js",[e1]:"fire-js-all"};/**
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
 */const _c=new Map,r1=new Map,cf=new Map;function ry(r,e){try{r.container.addComponent(e)}catch(t){qr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Oo(r){const e=r.name;if(cf.has(e))return qr.debug(`There were multiple attempts to register component ${e}.`),!1;cf.set(e,r);for(const t of _c.values())ry(t,r);for(const t of r1.values())ry(t,r);return!0}function Of(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function gn(r){return r==null?!1:r.settings!==void 0}/**
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
 */const s1={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Os=new _l("app","Firebase",s1);/**
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
 */class i1{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Ni("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Os.create("app-deleted",{appName:this._name})}}/**
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
 */const zo=t1;function J_(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const i={name:uf,automaticDataCollectionEnabled:!0,...e},o=i.name;if(typeof o!="string"||!o)throw Os.create("bad-app-name",{appName:String(o)});if(t||(t=q_()),!t)throw Os.create("no-options");const l=_c.get(o);if(l){if(Pi(t,l.options)&&Pi(i,l.config))return l;throw Os.create("duplicate-app",{appName:o})}const h=new hI(o);for(const g of cf.values())h.addComponent(g);const f=new i1(t,i,h);return _c.set(o,f),f}function Y_(r=uf){const e=_c.get(r);if(!e&&r===uf&&q_())return J_();if(!e)throw Os.create("no-app",{appName:r});return e}function Ls(r,e,t){let i=n1[r]??r;t&&(i+=`-${t}`);const o=i.match(/\s|\//),l=e.match(/\s|\//);if(o||l){const h=[`Unable to register library "${i}" with version "${e}":`];o&&h.push(`library name "${i}" contains illegal characters (whitespace or "/")`),o&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),qr.warn(h.join(" "));return}Oo(new Ni(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const o1="firebase-heartbeat-database",a1=1,nl="firebase-heartbeat-store";let Gd=null;function X_(){return Gd||(Gd=xI(o1,a1,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(nl)}catch(t){console.warn(t)}}}}).catch(r=>{throw Os.create("idb-open",{originalErrorMessage:r.message})})),Gd}async function l1(r){try{const t=(await X_()).transaction(nl),i=await t.objectStore(nl).get(Z_(r));return await t.done,i}catch(e){if(e instanceof Jr)qr.warn(e.message);else{const t=Os.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});qr.warn(t.message)}}}async function sy(r,e){try{const i=(await X_()).transaction(nl,"readwrite");await i.objectStore(nl).put(e,Z_(r)),await i.done}catch(t){if(t instanceof Jr)qr.warn(t.message);else{const i=Os.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});qr.warn(i.message)}}}function Z_(r){return`${r.name}!${r.options.appId}`}/**
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
 */const u1=1024,c1=30;class h1{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new f1(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=iy();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>c1){const h=p1(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){qr.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=iy(),{heartbeatsToSend:i,unsentEntries:o}=d1(this._heartbeatsCache.heartbeats),l=yc(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return qr.warn(t),""}}}function iy(){return new Date().toISOString().substring(0,10)}function d1(r,e=u1){const t=[];let i=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),oy(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),oy(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class f1{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ZT()?eI().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await l1(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return sy(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return sy(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function oy(r){return yc(JSON.stringify({version:2,heartbeats:r})).length}function p1(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let i=1;i<r.length;i++)r[i].date<t&&(t=r[i].date,e=i);return e}/**
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
 */function m1(r){Oo(new Ni("platform-logger",e=>new kI(e),"PRIVATE")),Oo(new Ni("heartbeat",e=>new h1(e),"PRIVATE")),Ls(lf,ny,r),Ls(lf,ny,"esm2020"),Ls("fire-js","")}m1("");function ev(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const g1=ev,tv=new _l("auth","Firebase",ev());/**
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
 */const vc=new Df("@firebase/auth");function y1(r,...e){vc.logLevel<=Oe.WARN&&vc.warn(`Auth (${zo}): ${r}`,...e)}function ic(r,...e){vc.logLevel<=Oe.ERROR&&vc.error(`Auth (${zo}): ${r}`,...e)}/**
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
 */function Rn(r,...e){throw Mf(r,...e)}function zn(r,...e){return Mf(r,...e)}function Lf(r,e,t){const i={...g1(),[e]:t};return new _l("auth","Firebase",i).create(e,{appName:r.name})}function Br(r){return Lf(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function _1(r,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&Rn(r,"argument-error"),Lf(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Mf(r,...e){if(typeof r!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=r.name),r._errorFactory.create(t,...i)}return tv.create(r,...e)}function Ie(r,e,...t){if(!r)throw Mf(e,...t)}function jr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw ic(e),new Error(e)}function Wr(r,e){r||jr(e)}/**
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
 */function hf(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function v1(){return ay()==="http:"||ay()==="https:"}function ay(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
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
 */function w1(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(v1()||QT()||"connection"in navigator)?navigator.onLine:!0}function E1(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
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
 */class El{constructor(e,t){this.shortDelay=e,this.longDelay=t,Wr(t>e,"Short delay should be less than long delay!"),this.isMobile=WT()||JT()}get(){return w1()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function jf(r,e){Wr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class nv{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;jr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;jr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;jr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const T1={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const I1=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],x1=new El(3e4,6e4);function Gs(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Yr(r,e,t,i,o={}){return rv(r,o,async()=>{let l={},h={};i&&(e==="GET"?h=i:l={body:JSON.stringify(i)});const f=vl({key:r.config.apiKey,...h}).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _={method:e,headers:g,...l};return GT()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&wl(r.emulatorConfig.host)&&(_.credentials="include"),nv.fetch()(await sv(r,r.config.apiHost,t,f),_)})}async function rv(r,e,t){r._canInitEmulator=!1;const i={...T1,...e};try{const o=new A1(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw Qu(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const f=l.ok?h.errorMessage:h.error.message,[g,_]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw Qu(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw Qu(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw Qu(r,"user-disabled",h);const E=i[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw Lf(r,E,_);Rn(r,E)}}catch(o){if(o instanceof Jr)throw o;Rn(r,"network-request-failed",{message:String(o)})}}async function Tl(r,e,t,i,o={}){const l=await Yr(r,e,t,i,o);return"mfaPendingCredential"in l&&Rn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function sv(r,e,t,i){const o=`${e}${t}?${i}`,l=r,h=l.config.emulator?jf(r.config,o):`${r.config.apiScheme}://${o}`;return I1.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function S1(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class A1{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(zn(this.auth,"network-request-failed")),x1.get())})}}function Qu(r,e,t){const i={appName:r.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const o=zn(r,e,i);return o.customData._tokenResponse=t,o}function ly(r){return r!==void 0&&r.enterprise!==void 0}class k1{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return S1(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function C1(r,e){return Yr(r,"GET","/v2/recaptchaConfig",Gs(r,e))}/**
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
 */async function R1(r,e){return Yr(r,"POST","/v1/accounts:delete",e)}async function wc(r,e){return Yr(r,"POST","/v1/accounts:lookup",e)}/**
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
 */function Ya(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function P1(r,e=!1){const t=pt(r),i=await t.getIdToken(e),o=Ff(i);Ie(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:i,authTime:Ya(Qd(o.auth_time)),issuedAtTime:Ya(Qd(o.iat)),expirationTime:Ya(Qd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function Qd(r){return Number(r)*1e3}function Ff(r){const[e,t,i]=r.split(".");if(e===void 0||t===void 0||i===void 0)return ic("JWT malformed, contained fewer than 3 sections"),null;try{const o=$_(t);return o?JSON.parse(o):(ic("Failed to decode base64 JWT payload"),null)}catch(o){return ic("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function uy(r){const e=Ff(r);return Ie(e,"internal-error"),Ie(typeof e.exp<"u","internal-error"),Ie(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Lo(r,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof Jr&&N1(i)&&r.auth.currentUser===r&&await r.auth.signOut(),i}}function N1({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
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
 */class b1{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const i=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class df{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ya(this.lastLoginAt),this.creationTime=Ya(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ec(r){var I;const e=r.auth,t=await r.getIdToken(),i=await Lo(r,wc(e,{idToken:t}));Ie(i==null?void 0:i.users.length,e,"internal-error");const o=i.users[0];r._notifyReloadListener(o);const l=(I=o.providerUserInfo)!=null&&I.length?iv(o.providerUserInfo):[],h=V1(r.providerData,l),f=r.isAnonymous,g=!(r.email&&o.passwordHash)&&!(h!=null&&h.length),_=f?g:!1,E={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new df(o.createdAt,o.lastLoginAt),isAnonymous:_};Object.assign(r,E)}async function D1(r){const e=pt(r);await Ec(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function V1(r,e){return[...r.filter(i=>!e.some(o=>o.providerId===i.providerId)),...e]}function iv(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function O1(r,e){const t=await rv(r,{},async()=>{const i=vl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await sv(r,o,"/v1/token",`key=${l}`),f=await r._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:i};return r.emulatorConfig&&wl(r.emulatorConfig.host)&&(g.credentials="include"),nv.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function L1(r,e){return Yr(r,"POST","/v2/accounts:revokeToken",Gs(r,e))}/**
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
 */class Po{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Ie(e.idToken,"internal-error"),Ie(typeof e.idToken<"u","internal-error"),Ie(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):uy(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Ie(e.length!==0,"internal-error");const t=uy(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Ie(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:o,expiresIn:l}=await O1(e,t);this.updateTokensAndExpiration(i,o,Number(l))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:o,expirationTime:l}=t,h=new Po;return i&&(Ie(typeof i=="string","internal-error",{appName:e}),h.refreshToken=i),o&&(Ie(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(Ie(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Po,this.toJSON())}_performRefresh(){return jr("not implemented")}}/**
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
 */function Rs(r,e){Ie(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Un{constructor({uid:e,auth:t,stsTokenManager:i,...o}){this.providerId="firebase",this.proactiveRefresh=new b1(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new df(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Lo(this,this.stsTokenManager.getToken(this.auth,e));return Ie(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return P1(this,e)}reload(){return D1(this)}_assign(e){this!==e&&(Ie(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Un({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){Ie(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await Ec(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(gn(this.auth.app))return Promise.reject(Br(this.auth));const e=await this.getIdToken();return await Lo(this,R1(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const i=t.displayName??void 0,o=t.email??void 0,l=t.phoneNumber??void 0,h=t.photoURL??void 0,f=t.tenantId??void 0,g=t._redirectEventId??void 0,_=t.createdAt??void 0,E=t.lastLoginAt??void 0,{uid:I,emailVerified:A,isAnonymous:j,providerData:W,stsTokenManager:K}=t;Ie(I&&K,e,"internal-error");const $=Po.fromJSON(this.name,K);Ie(typeof I=="string",e,"internal-error"),Rs(i,e.name),Rs(o,e.name),Ie(typeof A=="boolean",e,"internal-error"),Ie(typeof j=="boolean",e,"internal-error"),Rs(l,e.name),Rs(h,e.name),Rs(f,e.name),Rs(g,e.name),Rs(_,e.name),Rs(E,e.name);const pe=new Un({uid:I,auth:e,email:o,emailVerified:A,displayName:i,isAnonymous:j,photoURL:h,phoneNumber:l,tenantId:f,stsTokenManager:$,createdAt:_,lastLoginAt:E});return W&&Array.isArray(W)&&(pe.providerData=W.map(le=>({...le}))),g&&(pe._redirectEventId=g),pe}static async _fromIdTokenResponse(e,t,i=!1){const o=new Po;o.updateFromServerResponse(t);const l=new Un({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:i});return await Ec(l),l}static async _fromGetAccountInfoResponse(e,t,i){const o=t.users[0];Ie(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?iv(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),f=new Po;f.updateFromIdToken(i);const g=new Un({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new df(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
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
 */const cy=new Map;function Fr(r){Wr(r instanceof Function,"Expected a class definition");let e=cy.get(r);return e?(Wr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,cy.set(r,e),e)}/**
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
 */class ov{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ov.type="NONE";const hy=ov;/**
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
 */function oc(r,e,t){return`firebase:${r}:${e}:${t}`}class No{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:o,name:l}=this.auth;this.fullUserKey=oc(this.userKey,o.apiKey,l),this.fullPersistenceKey=oc("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await wc(this.auth,{idToken:e}).catch(()=>{});return t?Un._fromGetAccountInfoResponse(this.auth,t,e):null}return Un._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new No(Fr(hy),e,i);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Fr(hy);const h=oc(i,e.config.apiKey,e.name);let f=null;for(const _ of t)try{const E=await _._get(h);if(E){let I;if(typeof E=="string"){const A=await wc(e,{idToken:E}).catch(()=>{});if(!A)break;I=await Un._fromGetAccountInfoResponse(e,A,E)}else I=Un._fromJSON(e,E);_!==l&&(f=I),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new No(l,e,i):(l=g[0],f&&await l._set(h,f.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new No(l,e,i))}}/**
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
 */function dy(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(cv(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(av(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(dv(e))return"Blackberry";if(fv(e))return"Webos";if(lv(e))return"Safari";if((e.includes("chrome/")||uv(e))&&!e.includes("edge/"))return"Chrome";if(hv(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=r.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function av(r=Gt()){return/firefox\//i.test(r)}function lv(r=Gt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function uv(r=Gt()){return/crios\//i.test(r)}function cv(r=Gt()){return/iemobile/i.test(r)}function hv(r=Gt()){return/android/i.test(r)}function dv(r=Gt()){return/blackberry/i.test(r)}function fv(r=Gt()){return/webos/i.test(r)}function Uf(r=Gt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function M1(r=Gt()){var e;return Uf(r)&&!!((e=window.navigator)!=null&&e.standalone)}function j1(){return YT()&&document.documentMode===10}function pv(r=Gt()){return Uf(r)||hv(r)||fv(r)||dv(r)||/windows phone/i.test(r)||cv(r)}/**
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
 */function mv(r,e=[]){let t;switch(r){case"Browser":t=dy(Gt());break;case"Worker":t=`${dy(Gt())}-${r}`;break;default:t=r}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${zo}/${i}`}/**
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
 */class F1{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=l=>new Promise((h,f)=>{try{const g=e(l);h(g)}catch(g){f(g)}});i.onAbort=t,this.queue.push(i);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function U1(r,e={}){return Yr(r,"GET","/v2/passwordPolicy",Gs(r,e))}/**
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
 */const z1=6;class B1{constructor(e){var i;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??z1,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let o=0;o<e.length;o++)i=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
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
 */class $1{constructor(e,t,i,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new fy(this),this.idTokenSubscription=new fy(this),this.beforeStateQueue=new F1(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=tv,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Fr(t)),this._initializationPromise=this.queue(async()=>{var i,o,l;if(!this._deleted&&(this.persistenceManager=await No.create(this,e),(i=this._resolvePersistenceManagerAvailable)==null||i.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)==null?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await wc(this,{idToken:e}),i=await Un._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var l;if(gn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let i=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(l=this.redirectUser)==null?void 0:l._redirectEventId,f=i==null?void 0:i._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===f)&&(g!=null&&g.user)&&(i=g.user,o=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(i)}catch(h){i=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return Ie(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ec(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=E1()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(gn(this.app))return Promise.reject(Br(this));const t=e?pt(e):null;return t&&Ie(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Ie(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return gn(this.app)?Promise.reject(Br(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return gn(this.app)?Promise.reject(Br(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await U1(this),t=new B1(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new _l("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await L1(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Fr(e)||this._popupRedirectResolver;Ie(t,this,"argument-error"),this.redirectPersistenceManager=await No.create(this,[Fr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)==null?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(Ie(f,this,"internal-error"),f.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,i,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Ie(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=mv(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){var t;if(gn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&y1(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Qs(r){return pt(r)}class fy{constructor(e){this.auth=e,this.observer=null,this.addObserver=iI(t=>this.observer=t)}get next(){return Ie(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Kc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function H1(r){Kc=r}function gv(r){return Kc.loadJS(r)}function q1(){return Kc.recaptchaEnterpriseScript}function W1(){return Kc.gapiScript}function K1(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class G1{constructor(){this.enterprise=new Q1}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Q1{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const J1="recaptcha-enterprise",yv="NO_RECAPTCHA";class Y1{constructor(e){this.type=J1,this.auth=Qs(e)}async verify(e="verify",t=!1){async function i(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,f)=>{C1(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const _=new k1(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{f(g)})})}function o(l,h,f){const g=window.grecaptcha;ly(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(yv)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new G1().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{i(this.auth).then(f=>{if(!t&&ly(window.grecaptcha))o(f,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=q1();g.length!==0&&(g+=f),gv(g).then(()=>{o(f,l,h)}).catch(_=>{h(_)})}}).catch(f=>{h(f)})})}}async function py(r,e,t,i=!1,o=!1){const l=new Y1(r);let h;if(o)h=yv;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const f={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const g=f.phoneEnrollmentInfo.phoneNumber,_=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const g=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return i?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function ff(r,e,t,i,o){var l;if((l=r._getRecaptchaConfig())!=null&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await py(r,e,t,t==="getOobCode");return i(r,h)}else return i(r,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await py(r,e,t,t==="getOobCode");return i(r,f)}else return Promise.reject(h)})}/**
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
 */function X1(r,e){const t=Of(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(Pi(l,e??{}))return o;Rn(o,"already-initialized")}return t.initialize({options:e})}function Z1(r,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(Fr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function ex(r,e,t){const i=Qs(r);Ie(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const o=!1,l=_v(e),{host:h,port:f}=tx(e),g=f===null?"":`:${f}`,_={url:`${l}//${h}${g}/`},E=Object.freeze({host:h,port:f,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!i._canInitEmulator){Ie(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),Ie(Pi(_,i.config.emulator)&&Pi(E,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=_,i.emulatorConfig=E,i.settings.appVerificationDisabledForTesting=!0,wl(h)?K_(`${l}//${h}${g}`):nx()}function _v(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function tx(r){const e=_v(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(i);if(o){const l=o[1];return{host:l,port:my(i.substr(l.length+1))}}else{const[l,h]=i.split(":");return{host:l,port:my(h)}}}function my(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function nx(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
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
 */class zf{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return jr("not implemented")}_getIdTokenResponse(e){return jr("not implemented")}_linkToIdToken(e,t){return jr("not implemented")}_getReauthenticationResolver(e){return jr("not implemented")}}async function rx(r,e){return Yr(r,"POST","/v1/accounts:signUp",e)}/**
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
 */async function sx(r,e){return Tl(r,"POST","/v1/accounts:signInWithPassword",Gs(r,e))}/**
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
 */async function ix(r,e){return Tl(r,"POST","/v1/accounts:signInWithEmailLink",Gs(r,e))}async function ox(r,e){return Tl(r,"POST","/v1/accounts:signInWithEmailLink",Gs(r,e))}/**
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
 */class rl extends zf{constructor(e,t,i,o=null){super("password",i),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new rl(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new rl(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ff(e,t,"signInWithPassword",sx);case"emailLink":return ix(e,{email:this._email,oobCode:this._password});default:Rn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ff(e,i,"signUpPassword",rx);case"emailLink":return ox(e,{idToken:t,email:this._email,oobCode:this._password});default:Rn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function bo(r,e){return Tl(r,"POST","/v1/accounts:signInWithIdp",Gs(r,e))}/**
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
 */const ax="http://localhost";class bi extends zf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new bi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Rn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:o,...l}=t;if(!i||!o)return null;const h=new bi(i,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return bo(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,bo(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,bo(e,t)}buildRequest(){const e={requestUri:ax,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=vl(t)}return e}}/**
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
 */function lx(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function ux(r){const e=Ha(qa(r)).link,t=e?Ha(qa(e)).deep_link_id:null,i=Ha(qa(r)).deep_link_id;return(i?Ha(qa(i)).link:null)||i||t||e||r}class Bf{constructor(e){const t=Ha(qa(e)),i=t.apiKey??null,o=t.oobCode??null,l=lx(t.mode??null);Ie(i&&o&&l,"argument-error"),this.apiKey=i,this.operation=l,this.code=o,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=ux(e);try{return new Bf(t)}catch{return null}}}/**
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
 */class Bo{constructor(){this.providerId=Bo.PROVIDER_ID}static credential(e,t){return rl._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=Bf.parseLink(t);return Ie(i,"argument-error"),rl._fromEmailAndCode(e,i.code,i.tenantId)}}Bo.PROVIDER_ID="password";Bo.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Bo.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class $f{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Il extends $f{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Ns extends Il{constructor(){super("facebook.com")}static credential(e){return bi._fromParams({providerId:Ns.PROVIDER_ID,signInMethod:Ns.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ns.credentialFromTaggedObject(e)}static credentialFromError(e){return Ns.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ns.credential(e.oauthAccessToken)}catch{return null}}}Ns.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ns.PROVIDER_ID="facebook.com";/**
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
 */class Mr extends Il{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return bi._fromParams({providerId:Mr.PROVIDER_ID,signInMethod:Mr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Mr.credentialFromTaggedObject(e)}static credentialFromError(e){return Mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return Mr.credential(t,i)}catch{return null}}}Mr.GOOGLE_SIGN_IN_METHOD="google.com";Mr.PROVIDER_ID="google.com";/**
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
 */class bs extends Il{constructor(){super("github.com")}static credential(e){return bi._fromParams({providerId:bs.PROVIDER_ID,signInMethod:bs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bs.credentialFromTaggedObject(e)}static credentialFromError(e){return bs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bs.credential(e.oauthAccessToken)}catch{return null}}}bs.GITHUB_SIGN_IN_METHOD="github.com";bs.PROVIDER_ID="github.com";/**
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
 */class Ds extends Il{constructor(){super("twitter.com")}static credential(e,t){return bi._fromParams({providerId:Ds.PROVIDER_ID,signInMethod:Ds.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ds.credentialFromTaggedObject(e)}static credentialFromError(e){return Ds.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Ds.credential(t,i)}catch{return null}}}Ds.TWITTER_SIGN_IN_METHOD="twitter.com";Ds.PROVIDER_ID="twitter.com";/**
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
 */async function cx(r,e){return Tl(r,"POST","/v1/accounts:signUp",Gs(r,e))}/**
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
 */class Di{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,o=!1){const l=await Un._fromIdTokenResponse(e,i,o),h=gy(i);return new Di({user:l,providerId:h,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const o=gy(i);return new Di({user:e,providerId:o,_tokenResponse:i,operationType:t})}}function gy(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
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
 */class Tc extends Jr{constructor(e,t,i,o){super(t.code,t.message),this.operationType=i,this.user=o,Object.setPrototypeOf(this,Tc.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,o){return new Tc(e,t,i,o)}}function vv(r,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?Tc._fromErrorAndOperation(r,l,e,i):l})}async function hx(r,e,t=!1){const i=await Lo(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Di._forOperation(r,"link",i)}/**
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
 */async function dx(r,e,t=!1){const{auth:i}=r;if(gn(i.app))return Promise.reject(Br(i));const o="reauthenticate";try{const l=await Lo(r,vv(i,o,e,r),t);Ie(l.idToken,i,"internal-error");const h=Ff(l.idToken);Ie(h,i,"internal-error");const{sub:f}=h;return Ie(r.uid===f,i,"user-mismatch"),Di._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Rn(i,"user-mismatch"),l}}/**
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
 */async function wv(r,e,t=!1){if(gn(r.app))return Promise.reject(Br(r));const i="signIn",o=await vv(r,i,e),l=await Di._fromIdTokenResponse(r,i,o);return t||await r._updateCurrentUser(l.user),l}async function fx(r,e){return wv(Qs(r),e)}/**
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
 */async function Ev(r){const e=Qs(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function px(r,e,t){if(gn(r.app))return Promise.reject(Br(r));const i=Qs(r),h=await ff(i,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",cx).catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&Ev(r),g}),f=await Di._fromIdTokenResponse(i,"signIn",h);return await i._updateCurrentUser(f.user),f}function mx(r,e,t){return gn(r.app)?Promise.reject(Br(r)):fx(pt(r),Bo.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&Ev(r),i})}/**
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
 */async function gx(r,e){return Yr(r,"POST","/v1/accounts:update",e)}/**
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
 */async function Tv(r,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const i=pt(r),l={idToken:await i.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},h=await Lo(i,gx(i.auth,l));i.displayName=h.displayName||null,i.photoURL=h.photoUrl||null;const f=i.providerData.find(({providerId:g})=>g==="password");f&&(f.displayName=i.displayName,f.photoURL=i.photoURL),await i._updateTokensIfNecessary(h)}function yx(r,e,t,i){return pt(r).onIdTokenChanged(e,t,i)}function _x(r,e,t){return pt(r).beforeAuthStateChanged(e,t)}function vx(r,e,t,i){return pt(r).onAuthStateChanged(e,t,i)}function wx(r){return pt(r).signOut()}async function Ex(r){return pt(r).delete()}const Ic="__sak";/**
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
 */class Iv{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ic,"1"),this.storage.removeItem(Ic),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Tx=1e3,Ix=10;class xv extends Iv{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=pv(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),o=this.localCache[t];i!==o&&e(t,o,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,g)=>{this.notifyListeners(h,g)});return}const i=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(i);!t&&this.localCache[i]===h||this.notifyListeners(i,h)},l=this.storage.getItem(i);j1()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,Ix):o()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},Tx)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}xv.type="LOCAL";const xx=xv;/**
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
 */class Sv extends Iv{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Sv.type="SESSION";const Av=Sv;/**
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
 */function Sx(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Gc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const i=new Gc(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:o});const f=Array.from(h).map(async _=>_(t.origin,l)),g=await Sx(f);t.ports[0].postMessage({status:"done",eventId:i,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Gc.receivers=[];/**
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
 */function Hf(r="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return r+t}/**
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
 */class Ax{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((f,g)=>{const _=Hf("",20);o.port1.start();const E=setTimeout(()=>{g(new Error("unsupported_event"))},i);h={messageChannel:o,onMessage(I){const A=I;if(A.data.eventId===_)switch(A.data.status){case"ack":clearTimeout(E),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),f(A.data.response);break;default:clearTimeout(E),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
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
 */function hr(){return window}function kx(r){hr().location.href=r}/**
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
 */function kv(){return typeof hr().WorkerGlobalScope<"u"&&typeof hr().importScripts=="function"}async function Cx(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Rx(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function Px(){return kv()?self:null}/**
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
 */const Cv="firebaseLocalStorageDb",Nx=1,xc="firebaseLocalStorage",Rv="fbase_key";class xl{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Qc(r,e){return r.transaction([xc],e?"readwrite":"readonly").objectStore(xc)}function bx(){const r=indexedDB.deleteDatabase(Cv);return new xl(r).toPromise()}function Pv(){const r=indexedDB.open(Cv,Nx);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const i=r.result;try{i.createObjectStore(xc,{keyPath:Rv})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const i=r.result;i.objectStoreNames.contains(xc)?e(i):(i.close(),await bx(),e(await Pv()))})})}async function yy(r,e,t){const i=Qc(r,!0).put({[Rv]:e,value:t});return new xl(i).toPromise()}async function Dx(r,e){const t=Qc(r,!1).get(e),i=await new xl(t).toPromise();return i===void 0?null:i.value}function _y(r,e){const t=Qc(r,!0).delete(e);return new xl(t).toPromise()}const Vx=800,Ox=3;class Nv{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Pv(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>Ox)throw i;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return kv()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Gc._getInstance(Px()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,i;if(this.activeServiceWorker=await Cx(),!this.activeServiceWorker)return;this.sender=new Ax(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(i=e[0])!=null&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Rx()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await yy(e,Ic,"1"),await _y(e,Ic)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>yy(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>Dx(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_y(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=Qc(o,!1).getAll();return new xl(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)i.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!i.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Vx)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Nv.type="LOCAL";const Lx=Nv;new El(3e4,6e4);/**
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
 */function bv(r,e){return e?Fr(e):(Ie(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
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
 */class qf extends zf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bo(e,this._buildIdpRequest())}_linkToIdToken(e,t){return bo(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return bo(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Mx(r){return wv(r.auth,new qf(r),r.bypassAuthState)}function jx(r){const{auth:e,user:t}=r;return Ie(t,e,"internal-error"),dx(t,new qf(r),r.bypassAuthState)}async function Fx(r){const{auth:e,user:t}=r;return Ie(t,e,"internal-error"),hx(t,new qf(r),r.bypassAuthState)}/**
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
 */class Dv{constructor(e,t,i,o,l=!1){this.auth=e,this.resolver=i,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:o,tenantId:l,error:h,type:f}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:i,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Mx;case"linkViaPopup":case"linkViaRedirect":return Fx;case"reauthViaPopup":case"reauthViaRedirect":return jx;default:Rn(this.auth,"internal-error")}}resolve(e){Wr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Wr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Ux=new El(2e3,1e4);async function zx(r,e,t){if(gn(r.app))return Promise.reject(zn(r,"operation-not-supported-in-this-environment"));const i=Qs(r);_1(r,e,$f);const o=bv(i,t);return new Ai(i,"signInViaPopup",e,o).executeNotNull()}class Ai extends Dv{constructor(e,t,i,o,l){super(e,t,o,l),this.provider=i,this.authWindow=null,this.pollId=null,Ai.currentPopupAction&&Ai.currentPopupAction.cancel(),Ai.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Ie(e,this.auth,"internal-error"),e}async onExecution(){Wr(this.filter.length===1,"Popup operations only handle one event");const e=Hf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(zn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(zn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ai.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if((i=(t=this.authWindow)==null?void 0:t.window)!=null&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(zn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ux.get())};e()}}Ai.currentPopupAction=null;/**
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
 */const Bx="pendingRedirect",ac=new Map;class $x extends Dv{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=ac.get(this.auth._key());if(!e){try{const i=await Hx(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}ac.set(this.auth._key(),e)}return this.bypassAuthState||ac.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Hx(r,e){const t=Kx(e),i=Wx(r);if(!await i._isAvailable())return!1;const o=await i._get(t)==="true";return await i._remove(t),o}function qx(r,e){ac.set(r._key(),e)}function Wx(r){return Fr(r._redirectPersistence)}function Kx(r){return oc(Bx,r.config.apiKey,r.name)}async function Gx(r,e,t=!1){if(gn(r.app))return Promise.reject(Br(r));const i=Qs(r),o=bv(i,e),h=await new $x(i,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await i._persistUserIfCurrent(h.user),await i._setRedirectUser(null,e)),h}/**
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
 */const Qx=600*1e3;class Jx{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Yx(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!Vv(e)){const o=((i=e.error.code)==null?void 0:i.split("auth/")[1])||"internal-error";t.onError(zn(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Qx&&this.cachedEventUids.clear(),this.cachedEventUids.has(vy(e))}saveEventToCache(e){this.cachedEventUids.add(vy(e)),this.lastProcessedEventTime=Date.now()}}function vy(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Vv({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Yx(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Vv(r);default:return!1}}/**
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
 */async function Xx(r,e={}){return Yr(r,"GET","/v1/projects",e)}/**
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
 */const Zx=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,eS=/^https?/;async function tS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await Xx(r);for(const t of e)try{if(nS(t))return}catch{}Rn(r,"unauthorized-domain")}function nS(r){const e=hf(),{protocol:t,hostname:i}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&i===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===i}if(!eS.test(t))return!1;if(Zx.test(r))return i===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(i)}/**
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
 */const rS=new El(3e4,6e4);function wy(){const r=hr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function sS(r){return new Promise((e,t)=>{var o,l,h;function i(){wy(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{wy(),t(zn(r,"network-request-failed"))},timeout:rS.get()})}if((l=(o=hr().gapi)==null?void 0:o.iframes)!=null&&l.Iframe)e(gapi.iframes.getContext());else if((h=hr().gapi)!=null&&h.load)i();else{const f=K1("iframefcb");return hr()[f]=()=>{gapi.load?i():t(zn(r,"network-request-failed"))},gv(`${W1()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw lc=null,e})}let lc=null;function iS(r){return lc=lc||sS(r),lc}/**
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
 */const oS=new El(5e3,15e3),aS="__/auth/iframe",lS="emulator/auth/iframe",uS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},cS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function hS(r){const e=r.config;Ie(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?jf(e,lS):`https://${r.config.authDomain}/${aS}`,i={apiKey:e.apiKey,appName:r.name,v:zo},o=cS.get(r.config.apiHost);o&&(i.eid=o);const l=r._getFrameworks();return l.length&&(i.fw=l.join(",")),`${t}?${vl(i).slice(1)}`}async function dS(r){const e=await iS(r),t=hr().gapi;return Ie(t,r,"internal-error"),e.open({where:document.body,url:hS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:uS,dontclear:!0},i=>new Promise(async(o,l)=>{await i.restyle({setHideOnLeave:!1});const h=zn(r,"network-request-failed"),f=hr().setTimeout(()=>{l(h)},oS.get());function g(){hr().clearTimeout(f),o(i)}i.ping(g).then(g,()=>{l(h)})}))}/**
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
 */const fS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},pS=500,mS=600,gS="_blank",yS="http://localhost";class Ey{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function _S(r,e,t,i=pS,o=mS){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-i)/2,0).toString();let f="";const g={...fS,width:i.toString(),height:o.toString(),top:l,left:h},_=Gt().toLowerCase();t&&(f=uv(_)?gS:t),av(_)&&(e=e||yS,g.scrollbars="yes");const E=Object.entries(g).reduce((A,[j,W])=>`${A}${j}=${W},`,"");if(M1(_)&&f!=="_self")return vS(e||"",f),new Ey(null);const I=window.open(e||"",f,E);Ie(I,r,"popup-blocked");try{I.focus()}catch{}return new Ey(I)}function vS(r,e){const t=document.createElement("a");t.href=r,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
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
 */const wS="__/auth/handler",ES="emulator/auth/handler",TS=encodeURIComponent("fac");async function Ty(r,e,t,i,o,l){Ie(r.config.authDomain,r,"auth-domain-config-required"),Ie(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:i,v:zo,eventId:o};if(e instanceof $f){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",sI(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[E,I]of Object.entries({}))h[E]=I}if(e instanceof Il){const E=e.getScopes().filter(I=>I!=="");E.length>0&&(h.scopes=E.join(","))}r.tenantId&&(h.tid=r.tenantId);const f=h;for(const E of Object.keys(f))f[E]===void 0&&delete f[E];const g=await r._getAppCheckToken(),_=g?`#${TS}=${encodeURIComponent(g)}`:"";return`${IS(r)}?${vl(f).slice(1)}${_}`}function IS({config:r}){return r.emulator?jf(r,ES):`https://${r.authDomain}/${wS}`}/**
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
 */const Jd="webStorageSupport";class xS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Av,this._completeRedirectFn=Gx,this._overrideRedirectResult=qx}async _openPopup(e,t,i,o){var h;Wr((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const l=await Ty(e,t,i,hf(),o);return _S(e,l,Hf())}async _openRedirect(e,t,i,o){await this._originValidation(e);const l=await Ty(e,t,i,hf(),o);return kx(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Wr(l,"If manager is not set, promise should be"),l)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await dS(e),i=new Jx(e);return t.register("authEvent",o=>(Ie(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:i.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Jd,{type:Jd},o=>{var h;const l=(h=o==null?void 0:o[0])==null?void 0:h[Jd];l!==void 0&&t(!!l),Rn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=tS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return pv()||lv()||Uf()}}const SS=xS;var Iy="@firebase/auth",xy="1.13.2";/**
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
 */class AS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Ie(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function kS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function CS(r){Oo(new Ni("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=i.options;Ie(h&&!h.includes(":"),"invalid-api-key",{appName:i.name});const g={apiKey:h,authDomain:f,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:mv(r)},_=new $1(i,o,l,g);return Z1(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Oo(new Ni("auth-internal",e=>{const t=Qs(e.getProvider("auth").getImmediate());return(i=>new AS(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ls(Iy,xy,kS(r)),Ls(Iy,xy,"esm2020")}/**
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
 */const RS=300,PS=W_("authIdTokenMaxAge")||RS;let Sy=null;const NS=r=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>PS)return;const o=t==null?void 0:t.token;Sy!==o&&(Sy=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function bS(r=Y_()){const e=Of(r,"auth");if(e.isInitialized())return e.getImmediate();const t=X1(r,{popupRedirectResolver:SS,persistence:[Lx,xx,Av]}),i=W_("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(i,location.origin);if(location.origin===l.origin){const h=NS(l.toString());_x(t,h,()=>h(t.currentUser)),yx(t,f=>h(f))}}const o=H_("auth");return o&&ex(t,`http://${o}`),t}function DS(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}H1({loadJS(r){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",r),i.onload=e,i.onerror=o=>{const l=zn("internal-error");l.customData=o,t(l)},i.type="text/javascript",i.charset="UTF-8",DS().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});CS("Browser");var VS="firebase",OS="12.14.0";/**
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
 */Ls(VS,OS,"app");var Ay=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ms,Ov;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(k,x){function R(){}R.prototype=x.prototype,k.F=x.prototype,k.prototype=new R,k.prototype.constructor=k,k.D=function(b,P,O){for(var C=Array(arguments.length-2),$e=2;$e<arguments.length;$e++)C[$e-2]=arguments[$e];return x.prototype[P].apply(b,C)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(i,t),i.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(k,x,R){R||(R=0);const b=Array(16);if(typeof x=="string")for(var P=0;P<16;++P)b[P]=x.charCodeAt(R++)|x.charCodeAt(R++)<<8|x.charCodeAt(R++)<<16|x.charCodeAt(R++)<<24;else for(P=0;P<16;++P)b[P]=x[R++]|x[R++]<<8|x[R++]<<16|x[R++]<<24;x=k.g[0],R=k.g[1],P=k.g[2];let O=k.g[3],C;C=x+(O^R&(P^O))+b[0]+3614090360&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[1]+3905402710&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[2]+606105819&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[3]+3250441966&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[4]+4118548399&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[5]+1200080426&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[6]+2821735955&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[7]+4249261313&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[8]+1770035416&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[9]+2336552879&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[10]+4294925233&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[11]+2304563134&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[12]+1804603682&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[13]+4254626195&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[14]+2792965006&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[15]+1236535329&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(P^O&(R^P))+b[1]+4129170786&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[6]+3225465664&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[11]+643717713&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[0]+3921069994&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[5]+3593408605&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[10]+38016083&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[15]+3634488961&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[4]+3889429448&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[9]+568446438&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[14]+3275163606&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[3]+4107603335&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[8]+1163531501&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[13]+2850285829&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[2]+4243563512&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[7]+1735328473&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[12]+2368359562&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(R^P^O)+b[5]+4294588738&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[8]+2272392833&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[11]+1839030562&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[14]+4259657740&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[1]+2763975236&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[4]+1272893353&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[7]+4139469664&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[10]+3200236656&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[13]+681279174&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[0]+3936430074&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[3]+3572445317&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[6]+76029189&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[9]+3654602809&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[12]+3873151461&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[15]+530742520&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[2]+3299628645&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(P^(R|~O))+b[0]+4096336452&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[7]+1126891415&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[14]+2878612391&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[5]+4237533241&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[12]+1700485571&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[3]+2399980690&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[10]+4293915773&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[1]+2240044497&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[8]+1873313359&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[15]+4264355552&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[6]+2734768916&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[13]+1309151649&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[4]+4149444226&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[11]+3174756917&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[2]+718787259&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[9]+3951481745&4294967295,k.g[0]=k.g[0]+x&4294967295,k.g[1]=k.g[1]+(P+(C<<21&4294967295|C>>>11))&4294967295,k.g[2]=k.g[2]+P&4294967295,k.g[3]=k.g[3]+O&4294967295}i.prototype.v=function(k,x){x===void 0&&(x=k.length);const R=x-this.blockSize,b=this.C;let P=this.h,O=0;for(;O<x;){if(P==0)for(;O<=R;)o(this,k,O),O+=this.blockSize;if(typeof k=="string"){for(;O<x;)if(b[P++]=k.charCodeAt(O++),P==this.blockSize){o(this,b),P=0;break}}else for(;O<x;)if(b[P++]=k[O++],P==this.blockSize){o(this,b),P=0;break}}this.h=P,this.o+=x},i.prototype.A=function(){var k=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);k[0]=128;for(var x=1;x<k.length-8;++x)k[x]=0;x=this.o*8;for(var R=k.length-8;R<k.length;++R)k[R]=x&255,x/=256;for(this.v(k),k=Array(16),x=0,R=0;R<4;++R)for(let b=0;b<32;b+=8)k[x++]=this.g[R]>>>b&255;return k};function l(k,x){var R=f;return Object.prototype.hasOwnProperty.call(R,k)?R[k]:R[k]=x(k)}function h(k,x){this.h=x;const R=[];let b=!0;for(let P=k.length-1;P>=0;P--){const O=k[P]|0;b&&O==x||(R[P]=O,b=!1)}this.g=R}var f={};function g(k){return-128<=k&&k<128?l(k,function(x){return new h([x|0],x<0?-1:0)}):new h([k|0],k<0?-1:0)}function _(k){if(isNaN(k)||!isFinite(k))return I;if(k<0)return $(_(-k));const x=[];let R=1;for(let b=0;k>=R;b++)x[b]=k/R|0,R*=4294967296;return new h(x,0)}function E(k,x){if(k.length==0)throw Error("number format error: empty string");if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(k.charAt(0)=="-")return $(E(k.substring(1),x));if(k.indexOf("-")>=0)throw Error('number format error: interior "-" character');const R=_(Math.pow(x,8));let b=I;for(let O=0;O<k.length;O+=8){var P=Math.min(8,k.length-O);const C=parseInt(k.substring(O,O+P),x);P<8?(P=_(Math.pow(x,P)),b=b.j(P).add(_(C))):(b=b.j(R),b=b.add(_(C)))}return b}var I=g(0),A=g(1),j=g(16777216);r=h.prototype,r.m=function(){if(K(this))return-$(this).m();let k=0,x=1;for(let R=0;R<this.g.length;R++){const b=this.i(R);k+=(b>=0?b:4294967296+b)*x,x*=4294967296}return k},r.toString=function(k){if(k=k||10,k<2||36<k)throw Error("radix out of range: "+k);if(W(this))return"0";if(K(this))return"-"+$(this).toString(k);const x=_(Math.pow(k,6));var R=this;let b="";for(;;){const P=Te(R,x).g;R=pe(R,P.j(x));let O=((R.g.length>0?R.g[0]:R.h)>>>0).toString(k);if(R=P,W(R))return O+b;for(;O.length<6;)O="0"+O;b=O+b}},r.i=function(k){return k<0?0:k<this.g.length?this.g[k]:this.h};function W(k){if(k.h!=0)return!1;for(let x=0;x<k.g.length;x++)if(k.g[x]!=0)return!1;return!0}function K(k){return k.h==-1}r.l=function(k){return k=pe(this,k),K(k)?-1:W(k)?0:1};function $(k){const x=k.g.length,R=[];for(let b=0;b<x;b++)R[b]=~k.g[b];return new h(R,~k.h).add(A)}r.abs=function(){return K(this)?$(this):this},r.add=function(k){const x=Math.max(this.g.length,k.g.length),R=[];let b=0;for(let P=0;P<=x;P++){let O=b+(this.i(P)&65535)+(k.i(P)&65535),C=(O>>>16)+(this.i(P)>>>16)+(k.i(P)>>>16);b=C>>>16,O&=65535,C&=65535,R[P]=C<<16|O}return new h(R,R[R.length-1]&-2147483648?-1:0)};function pe(k,x){return k.add($(x))}r.j=function(k){if(W(this)||W(k))return I;if(K(this))return K(k)?$(this).j($(k)):$($(this).j(k));if(K(k))return $(this.j($(k)));if(this.l(j)<0&&k.l(j)<0)return _(this.m()*k.m());const x=this.g.length+k.g.length,R=[];for(var b=0;b<2*x;b++)R[b]=0;for(b=0;b<this.g.length;b++)for(let P=0;P<k.g.length;P++){const O=this.i(b)>>>16,C=this.i(b)&65535,$e=k.i(P)>>>16,mt=k.i(P)&65535;R[2*b+2*P]+=C*mt,le(R,2*b+2*P),R[2*b+2*P+1]+=O*mt,le(R,2*b+2*P+1),R[2*b+2*P+1]+=C*$e,le(R,2*b+2*P+1),R[2*b+2*P+2]+=O*$e,le(R,2*b+2*P+2)}for(k=0;k<x;k++)R[k]=R[2*k+1]<<16|R[2*k];for(k=x;k<2*x;k++)R[k]=0;return new h(R,0)};function le(k,x){for(;(k[x]&65535)!=k[x];)k[x+1]+=k[x]>>>16,k[x]&=65535,x++}function ce(k,x){this.g=k,this.h=x}function Te(k,x){if(W(x))throw Error("division by zero");if(W(k))return new ce(I,I);if(K(k))return x=Te($(k),x),new ce($(x.g),$(x.h));if(K(x))return x=Te(k,$(x)),new ce($(x.g),x.h);if(k.g.length>30){if(K(k)||K(x))throw Error("slowDivide_ only works with positive integers.");for(var R=A,b=x;b.l(k)<=0;)R=Ee(R),b=Ee(b);var P=de(R,1),O=de(b,1);for(b=de(b,2),R=de(R,2);!W(b);){var C=O.add(b);C.l(k)<=0&&(P=P.add(R),O=C),b=de(b,1),R=de(R,1)}return x=pe(k,P.j(x)),new ce(P,x)}for(P=I;k.l(x)>=0;){for(R=Math.max(1,Math.floor(k.m()/x.m())),b=Math.ceil(Math.log(R)/Math.LN2),b=b<=48?1:Math.pow(2,b-48),O=_(R),C=O.j(x);K(C)||C.l(k)>0;)R-=b,O=_(R),C=O.j(x);W(O)&&(O=A),P=P.add(O),k=pe(k,C)}return new ce(P,k)}r.B=function(k){return Te(this,k).h},r.and=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)&k.i(b);return new h(R,this.h&k.h)},r.or=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)|k.i(b);return new h(R,this.h|k.h)},r.xor=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)^k.i(b);return new h(R,this.h^k.h)};function Ee(k){const x=k.g.length+1,R=[];for(let b=0;b<x;b++)R[b]=k.i(b)<<1|k.i(b-1)>>>31;return new h(R,k.h)}function de(k,x){const R=x>>5;x%=32;const b=k.g.length-R,P=[];for(let O=0;O<b;O++)P[O]=x>0?k.i(O+R)>>>x|k.i(O+R+1)<<32-x:k.i(O+R);return new h(P,k.h)}i.prototype.digest=i.prototype.A,i.prototype.reset=i.prototype.u,i.prototype.update=i.prototype.v,Ov=i,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=E,Ms=h}).apply(typeof Ay<"u"?Ay:typeof self<"u"?self:typeof window<"u"?window:{});var Ju=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Lv,Wa,Mv,uc,pf,jv,Fv,Uv;(function(){var r,e=Object.defineProperty;function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ju=="object"&&Ju];for(var m=0;m<u.length;++m){var y=u[m];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var i=t(this);function o(u,m){if(m)e:{var y=i;u=u.split(".");for(var T=0;T<u.length-1;T++){var M=u[T];if(!(M in y))break e;y=y[M]}u=u[u.length-1],T=y[u],m=m(T),m!=T&&m!=null&&e(y,u,{configurable:!0,writable:!0,value:m})}}o("Symbol.dispose",function(u){return u||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(u){return u||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(u){return u||function(m){var y=[],T;for(T in m)Object.prototype.hasOwnProperty.call(m,T)&&y.push([T,m[T]]);return y}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function f(u){var m=typeof u;return m=="object"&&u!=null||m=="function"}function g(u,m,y){return u.call.apply(u.bind,arguments)}function _(u,m,y){return _=g,_.apply(null,arguments)}function E(u,m){var y=Array.prototype.slice.call(arguments,1);return function(){var T=y.slice();return T.push.apply(T,arguments),u.apply(this,T)}}function I(u,m){function y(){}y.prototype=m.prototype,u.Z=m.prototype,u.prototype=new y,u.prototype.constructor=u,u.Ob=function(T,M,z){for(var te=Array(arguments.length-2),Ce=2;Ce<arguments.length;Ce++)te[Ce-2]=arguments[Ce];return m.prototype[M].apply(T,te)}}var A=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?u=>u&&AsyncContext.Snapshot.wrap(u):u=>u;function j(u){const m=u.length;if(m>0){const y=Array(m);for(let T=0;T<m;T++)y[T]=u[T];return y}return[]}function W(u,m){for(let T=1;T<arguments.length;T++){const M=arguments[T];var y=typeof M;if(y=y!="object"?y:M?Array.isArray(M)?"array":y:"null",y=="array"||y=="object"&&typeof M.length=="number"){y=u.length||0;const z=M.length||0;u.length=y+z;for(let te=0;te<z;te++)u[y+te]=M[te]}else u.push(M)}}class K{constructor(m,y){this.i=m,this.j=y,this.h=0,this.g=null}get(){let m;return this.h>0?(this.h--,m=this.g,this.g=m.next,m.next=null):m=this.i(),m}}function $(u){h.setTimeout(()=>{throw u},0)}function pe(){var u=k;let m=null;return u.g&&(m=u.g,u.g=u.g.next,u.g||(u.h=null),m.next=null),m}class le{constructor(){this.h=this.g=null}add(m,y){const T=ce.get();T.set(m,y),this.h?this.h.next=T:this.g=T,this.h=T}}var ce=new K(()=>new Te,u=>u.reset());class Te{constructor(){this.next=this.g=this.h=null}set(m,y){this.h=m,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let Ee,de=!1,k=new le,x=()=>{const u=Promise.resolve(void 0);Ee=()=>{u.then(R)}};function R(){for(var u;u=pe();){try{u.h.call(u.g)}catch(y){$(y)}var m=ce;m.j(u),m.h<100&&(m.h++,u.next=m.g,m.g=u)}de=!1}function b(){this.u=this.u,this.C=this.C}b.prototype.u=!1,b.prototype.dispose=function(){this.u||(this.u=!0,this.N())},b.prototype[Symbol.dispose]=function(){this.dispose()},b.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function P(u,m){this.type=u,this.g=this.target=m,this.defaultPrevented=!1}P.prototype.h=function(){this.defaultPrevented=!0};var O=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var u=!1,m=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};h.addEventListener("test",y,m),h.removeEventListener("test",y,m)}catch{}return u})();function C(u){return/^[\s\xa0]*$/.test(u)}function $e(u,m){P.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u&&this.init(u,m)}I($e,P),$e.prototype.init=function(u,m){const y=this.type=u.type,T=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;this.target=u.target||u.srcElement,this.g=m,m=u.relatedTarget,m||(y=="mouseover"?m=u.fromElement:y=="mouseout"&&(m=u.toElement)),this.relatedTarget=m,T?(this.clientX=T.clientX!==void 0?T.clientX:T.pageX,this.clientY=T.clientY!==void 0?T.clientY:T.pageY,this.screenX=T.screenX||0,this.screenY=T.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=u.pointerType,this.state=u.state,this.i=u,u.defaultPrevented&&$e.Z.h.call(this)},$e.prototype.h=function(){$e.Z.h.call(this);const u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var mt="closure_listenable_"+(Math.random()*1e6|0),kt=0;function He(u,m,y,T,M){this.listener=u,this.proxy=null,this.src=m,this.type=y,this.capture=!!T,this.ha=M,this.key=++kt,this.da=this.fa=!1}function H(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function ne(u,m,y){for(const T in u)m.call(y,u[T],T,u)}function Z(u,m){for(const y in u)m.call(void 0,u[y],y,u)}function V(u){const m={};for(const y in u)m[y]=u[y];return m}const B="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function se(u,m){let y,T;for(let M=1;M<arguments.length;M++){T=arguments[M];for(y in T)u[y]=T[y];for(let z=0;z<B.length;z++)y=B[z],Object.prototype.hasOwnProperty.call(T,y)&&(u[y]=T[y])}}function me(u){this.src=u,this.g={},this.h=0}me.prototype.add=function(u,m,y,T,M){const z=u.toString();u=this.g[z],u||(u=this.g[z]=[],this.h++);const te=ye(u,m,T,M);return te>-1?(m=u[te],y||(m.fa=!1)):(m=new He(m,this.src,z,!!T,M),m.fa=y,u.push(m)),m};function ge(u,m){const y=m.type;if(y in u.g){var T=u.g[y],M=Array.prototype.indexOf.call(T,m,void 0),z;(z=M>=0)&&Array.prototype.splice.call(T,M,1),z&&(H(m),u.g[y].length==0&&(delete u.g[y],u.h--))}}function ye(u,m,y,T){for(let M=0;M<u.length;++M){const z=u[M];if(!z.da&&z.listener==m&&z.capture==!!y&&z.ha==T)return M}return-1}var Se="closure_lm_"+(Math.random()*1e6|0),Pe={};function Ne(u,m,y,T,M){if(Array.isArray(m)){for(let z=0;z<m.length;z++)Ne(u,m[z],y,T,M);return null}return y=Go(y),u&&u[mt]?u.J(m,y,f(T)?!!T.capture:!1,M):Ke(u,m,y,!1,T,M)}function Ke(u,m,y,T,M,z){if(!m)throw Error("Invalid event type");const te=f(M)?!!M.capture:!!M;let Ce=Fi(u);if(Ce||(u[Se]=Ce=new me(u)),y=Ce.add(m,y,T,te,z),y.proxy)return y;if(T=Tt(),y.proxy=T,T.src=u,T.listener=y,u.addEventListener)O||(M=te),M===void 0&&(M=!1),u.addEventListener(m.toString(),T,M);else if(u.attachEvent)u.attachEvent(bt(m.toString()),T);else if(u.addListener&&u.removeListener)u.addListener(T);else throw Error("addEventListener and attachEvent are unavailable.");return y}function Tt(){function u(y){return m.call(u.src,u.listener,y)}const m=Hn;return u}function ot(u,m,y,T,M){if(Array.isArray(m))for(var z=0;z<m.length;z++)ot(u,m[z],y,T,M);else T=f(T)?!!T.capture:!!T,y=Go(y),u&&u[mt]?(u=u.i,z=String(m).toString(),z in u.g&&(m=u.g[z],y=ye(m,y,T,M),y>-1&&(H(m[y]),Array.prototype.splice.call(m,y,1),m.length==0&&(delete u.g[z],u.h--)))):u&&(u=Fi(u))&&(m=u.g[m.toString()],u=-1,m&&(u=ye(m,y,T,M)),(y=u>-1?m[u]:null)&&qe(y))}function qe(u){if(typeof u!="number"&&u&&!u.da){var m=u.src;if(m&&m[mt])ge(m.i,u);else{var y=u.type,T=u.proxy;m.removeEventListener?m.removeEventListener(y,T,u.capture):m.detachEvent?m.detachEvent(bt(y),T):m.addListener&&m.removeListener&&m.removeListener(T),(y=Fi(m))?(ge(y,u),y.h==0&&(y.src=null,m[Se]=null)):H(u)}}}function bt(u){return u in Pe?Pe[u]:Pe[u]="on"+u}function Hn(u,m){if(u.da)u=!0;else{m=new $e(m,this);const y=u.listener,T=u.ha||u.src;u.fa&&qe(u),u=y.call(T,m)}return u}function Fi(u){return u=u[Se],u instanceof me?u:null}var Xs="__closure_events_fn_"+(Math.random()*1e9>>>0);function Go(u){return typeof u=="function"?u:(u[Xs]||(u[Xs]=function(m){return u.handleEvent(m)}),u[Xs])}function gt(){b.call(this),this.i=new me(this),this.M=this,this.G=null}I(gt,b),gt.prototype[mt]=!0,gt.prototype.removeEventListener=function(u,m,y,T){ot(this,u,m,y,T)};function ct(u,m){var y,T=u.G;if(T)for(y=[];T;T=T.G)y.push(T);if(u=u.M,T=m.type||m,typeof m=="string")m=new P(m,u);else if(m instanceof P)m.target=m.target||u;else{var M=m;m=new P(T,u),se(m,M)}M=!0;let z,te;if(y)for(te=y.length-1;te>=0;te--)z=m.g=y[te],M=Pn(z,T,!0,m)&&M;if(z=m.g=u,M=Pn(z,T,!0,m)&&M,M=Pn(z,T,!1,m)&&M,y)for(te=0;te<y.length;te++)z=m.g=y[te],M=Pn(z,T,!1,m)&&M}gt.prototype.N=function(){if(gt.Z.N.call(this),this.i){var u=this.i;for(const m in u.g){const y=u.g[m];for(let T=0;T<y.length;T++)H(y[T]);delete u.g[m],u.h--}}this.G=null},gt.prototype.J=function(u,m,y,T){return this.i.add(String(u),m,!1,y,T)},gt.prototype.K=function(u,m,y,T){return this.i.add(String(u),m,!0,y,T)};function Pn(u,m,y,T){if(m=u.i.g[String(m)],!m)return!0;m=m.concat();let M=!0;for(let z=0;z<m.length;++z){const te=m[z];if(te&&!te.da&&te.capture==y){const Ce=te.listener,ht=te.ha||te.src;te.fa&&ge(u.i,te),M=Ce.call(ht,T)!==!1&&M}}return M&&!T.defaultPrevented}function Qo(u,m){if(typeof u!="function")if(u&&typeof u.handleEvent=="function")u=_(u.handleEvent,u);else throw Error("Invalid listener argument");return Number(m)>2147483647?-1:h.setTimeout(u,m||0)}function Jo(u){u.g=Qo(()=>{u.g=null,u.i&&(u.i=!1,Jo(u))},u.l);const m=u.h;u.h=null,u.m.apply(null,m)}class bl extends b{constructor(m,y){super(),this.m=m,this.l=y,this.h=null,this.i=!1,this.g=null}j(m){this.h=arguments,this.g?this.i=!0:Jo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Zr(u){b.call(this),this.h=u,this.g={}}I(Zr,b);var Yo=[];function Ui(u){ne(u.g,function(m,y){this.g.hasOwnProperty(y)&&qe(m)},u),u.g={}}Zr.prototype.N=function(){Zr.Z.N.call(this),Ui(this)},Zr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var es=h.JSON.stringify,Dl=h.JSON.parse,Zs=class{stringify(u){return h.JSON.stringify(u,void 0)}parse(u){return h.JSON.parse(u,void 0)}};function ts(){}function Vl(){}var ns={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function zi(){P.call(this,"d")}I(zi,P);function Xo(){P.call(this,"c")}I(Xo,P);var Nn={},Bi=null;function rs(){return Bi=Bi||new gt}Nn.Ia="serverreachability";function $i(u){P.call(this,Nn.Ia,u)}I($i,P);function _r(u){const m=rs();ct(m,new $i(m))}Nn.STAT_EVENT="statevent";function vr(u,m){P.call(this,Nn.STAT_EVENT,u),this.stat=m}I(vr,P);function at(u){const m=rs();ct(m,new vr(m,u))}Nn.Ja="timingevent";function Zo(u,m){P.call(this,Nn.Ja,u),this.size=m}I(Zo,P);function ss(u,m){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){u()},m)}function is(){this.g=!0}is.prototype.ua=function(){this.g=!1};function Ol(u,m,y,T,M,z){u.info(function(){if(u.g)if(z){var te="",Ce=z.split("&");for(let Be=0;Be<Ce.length;Be++){var ht=Ce[Be].split("=");if(ht.length>1){const yt=ht[0];ht=ht[1];const dn=yt.split("_");te=dn.length>=2&&dn[1]=="type"?te+(yt+"="+ht+"&"):te+(yt+"=redacted&")}}}else te=null;else te=z;return"XMLHTTP REQ ("+T+") [attempt "+M+"]: "+m+`
`+y+`
`+te})}function Ll(u,m,y,T,M,z,te){u.info(function(){return"XMLHTTP RESP ("+T+") [ attempt "+M+"]: "+m+`
`+y+`
`+z+" "+te})}function qn(u,m,y,T){u.info(function(){return"XMLHTTP TEXT ("+m+"): "+ei(u,y)+(T?" "+T:"")})}function Ml(u,m){u.info(function(){return"TIMEOUT: "+m})}is.prototype.info=function(){};function ei(u,m){if(!u.g)return m;if(!m)return null;try{const z=JSON.parse(m);if(z){for(u=0;u<z.length;u++)if(Array.isArray(z[u])){var y=z[u];if(!(y.length<2)){var T=y[1];if(Array.isArray(T)&&!(T.length<1)){var M=T[0];if(M!="noop"&&M!="stop"&&M!="close")for(let te=1;te<T.length;te++)T[te]=""}}}}return es(z)}catch{return m}}var os={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},as={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},jl;function wr(){}I(wr,ts),wr.prototype.g=function(){return new XMLHttpRequest},jl=new wr;function Wn(u){return encodeURIComponent(String(u))}function Hi(u){var m=1;u=u.split(":");const y=[];for(;m>0&&u.length;)y.push(u.shift()),m--;return u.length&&y.push(u.join(":")),y}function _n(u,m,y,T){this.j=u,this.i=m,this.l=y,this.S=T||1,this.V=new Zr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Fl}function Fl(){this.i=null,this.g="",this.h=!1}var Ul={},ea={};function bn(u,m,y){u.M=1,u.A=Tr(vn(m)),u.u=y,u.R=!0,ta(u,null)}function ta(u,m){u.F=Date.now(),ti(u),u.B=vn(u.A);var y=u.B,T=u.S;Array.isArray(T)||(T=[String(T)]),ha(y.i,"t",T),u.C=0,y=u.j.L,u.h=new Fl,u.g=Jl(u.j,y?m:null,!u.u),u.P>0&&(u.O=new bl(_(u.Y,u,u.g),u.P)),m=u.V,y=u.g,T=u.ba;var M="readystatechange";Array.isArray(M)||(M&&(Yo[0]=M.toString()),M=Yo);for(let z=0;z<M.length;z++){const te=Ne(y,M[z],T||m.handleEvent,!1,m.h||m);if(!te)break;m.g[te.key]=te}m=u.J?V(u.J):{},u.u?(u.v||(u.v="POST"),m["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.B,u.v,u.u,m)):(u.v="GET",u.g.ea(u.B,u.v,null,m)),_r(),Ol(u.i,u.v,u.B,u.l,u.S,u.u)}_n.prototype.ba=function(u){u=u.target;const m=this.O;m&&Zn(u)==3?m.j():this.Y(u)},_n.prototype.Y=function(u){try{if(u==this.g)e:{const Ce=Zn(this.g),ht=this.g.ya(),Be=this.g.ca();if(!(Ce<3)&&(Ce!=3||this.g&&(this.h.h||this.g.la()||Gl(this.g)))){this.K||Ce!=4||ht==7||(ht==8||Be<=0?_r(3):_r(2)),qi(this);var m=this.g.ca();this.X=m;var y=zl(this);if(this.o=m==200,Ll(this.i,this.v,this.B,this.l,this.S,Ce,m),this.o){if(this.U&&!this.L){t:{if(this.g){var T,M=this.g;if((T=M.g?M.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(T)){var z=T;break t}}z=null}if(u=z)qn(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Ye(this,u);else{this.o=!1,this.m=3,at(12),Er(this),ni(this);break e}}if(this.R){u=!0;let yt;for(;!this.K&&this.C<y.length;)if(yt=$l(this,y),yt==ea){Ce==4&&(this.m=4,at(14),u=!1),qn(this.i,this.l,null,"[Incomplete Response]");break}else if(yt==Ul){this.m=4,at(15),qn(this.i,this.l,y,"[Invalid Chunk]"),u=!1;break}else qn(this.i,this.l,yt,null),Ye(this,yt);if(Bl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ce!=4||y.length!=0||this.h.h||(this.m=1,at(16),u=!1),this.o=this.o&&u,!u)qn(this.i,this.l,y,"[Invalid Chunked Response]"),Er(this),ni(this);else if(y.length>0&&!this.W){this.W=!0;var te=this.j;te.g==this&&te.aa&&!te.P&&(te.j.info("Great, no buffering proxy detected. Bytes received: "+y.length),hi(te),te.P=!0,at(11))}}else qn(this.i,this.l,y,null),Ye(this,y);Ce==4&&Er(this),this.o&&!this.K&&(Ce==4?to(this.j,this):(this.o=!1,ti(this)))}else fa(this.g),m==400&&y.indexOf("Unknown SID")>0?(this.m=3,at(12)):(this.m=0,at(13)),Er(this),ni(this)}}}catch{}finally{}};function zl(u){if(!Bl(u))return u.g.la();const m=Gl(u.g);if(m==="")return"";let y="";const T=m.length,M=Zn(u.g)==4;if(!u.h.i){if(typeof TextDecoder>"u")return Er(u),ni(u),"";u.h.i=new h.TextDecoder}for(let z=0;z<T;z++)u.h.h=!0,y+=u.h.i.decode(m[z],{stream:!(M&&z==T-1)});return m.length=0,u.h.g+=y,u.C=0,u.h.g}function Bl(u){return u.g?u.v=="GET"&&u.M!=2&&u.j.Aa:!1}function $l(u,m){var y=u.C,T=m.indexOf(`
`,y);return T==-1?ea:(y=Number(m.substring(y,T)),isNaN(y)?Ul:(T+=1,T+y>m.length?ea:(m=m.slice(T,T+y),u.C=T+y,m)))}_n.prototype.cancel=function(){this.K=!0,Er(this)};function ti(u){u.T=Date.now()+u.H,na(u,u.H)}function na(u,m){if(u.D!=null)throw Error("WatchDog timer not null");u.D=ss(_(u.aa,u),m)}function qi(u){u.D&&(h.clearTimeout(u.D),u.D=null)}_n.prototype.aa=function(){this.D=null;const u=Date.now();u-this.T>=0?(Ml(this.i,this.B),this.M!=2&&(_r(),at(17)),Er(this),this.m=2,ni(this)):na(this,this.T-u)};function ni(u){u.j.I==0||u.K||to(u.j,u)}function Er(u){qi(u);var m=u.O;m&&typeof m.dispose=="function"&&m.dispose(),u.O=null,Ui(u.V),u.g&&(m=u.g,u.g=null,m.abort(),m.dispose())}function Ye(u,m){try{var y=u.j;if(y.I!=0&&(y.g==u||sa(y.h,u))){if(!u.L&&sa(y.h,u)&&y.I==3){try{var T=y.Ba.g.parse(m)}catch{T=null}if(Array.isArray(T)&&T.length==3){var M=T;if(M[0]==0){e:if(!y.v){if(y.g)if(y.g.F+3e3<u.F)eo(y),cn(y);else break e;nr(y),at(18)}}else y.xa=M[1],0<y.xa-y.K&&M[2]<37500&&y.F&&y.A==0&&!y.C&&(y.C=ss(_(y.Va,y),6e3));ri(y.h)<=1&&y.ta&&(y.ta=void 0)}else hn(y,11)}else if((u.L||y.g==u)&&eo(y),!C(m))for(M=y.Ba.g.parse(m),m=0;m<M.length;m++){let Be=M[m];const yt=Be[0];if(!(yt<=y.K))if(y.K=yt,Be=Be[1],y.I==2)if(Be[0]=="c"){y.M=Be[1],y.ba=Be[2];const dn=Be[3];dn!=null&&(y.ka=dn,y.j.info("VER="+y.ka));const kr=Be[4];kr!=null&&(y.za=kr,y.j.info("SVER="+y.za));const rr=Be[5];rr!=null&&typeof rr=="number"&&rr>0&&(T=1.5*rr,y.O=T,y.j.info("backChannelRequestTimeoutMs_="+T)),T=y;const sr=u.g;if(sr){const so=sr.g?sr.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(so){var z=T.h;z.g||so.indexOf("spdy")==-1&&so.indexOf("quic")==-1&&so.indexOf("h2")==-1||(z.j=z.l,z.g=new Set,z.h&&(Ki(z,z.h),z.h=null))}if(T.G){const ga=sr.g?sr.g.getResponseHeader("X-HTTP-Session-Id"):null;ga&&(T.wa=ga,Ue(T.J,T.G,ga))}}y.I=3,y.l&&y.l.ra(),y.aa&&(y.T=Date.now()-u.F,y.j.info("Handshake RTT: "+y.T+"ms")),T=y;var te=u;if(T.na=ma(T,T.L?T.ba:null,T.W),te.L){si(T.h,te);var Ce=te,ht=T.O;ht&&(Ce.H=ht),Ce.D&&(qi(Ce),ti(Ce)),T.g=te}else Ut(T);y.i.length>0&&Ar(y)}else Be[0]!="stop"&&Be[0]!="close"||hn(y,7);else y.I==3&&(Be[0]=="stop"||Be[0]=="close"?Be[0]=="stop"?hn(y,7):Xi(y):Be[0]!="noop"&&y.l&&y.l.qa(Be),y.A=0)}}_r(4)}catch{}}var gh=class{constructor(u,m){this.g=u,this.map=m}};function Wi(u){this.l=u||10,h.PerformanceNavigationTiming?(u=h.performance.getEntriesByType("navigation"),u=u.length>0&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ra(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function ri(u){return u.h?1:u.g?u.g.size:0}function sa(u,m){return u.h?u.h==m:u.g?u.g.has(m):!1}function Ki(u,m){u.g?u.g.add(m):u.h=m}function si(u,m){u.h&&u.h==m?u.h=null:u.g&&u.g.has(m)&&u.g.delete(m)}Wi.prototype.cancel=function(){if(this.i=an(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function an(u){if(u.h!=null)return u.i.concat(u.h.G);if(u.g!=null&&u.g.size!==0){let m=u.i;for(const y of u.g.values())m=m.concat(y.G);return m}return j(u.i)}var Hl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ln(u,m){if(u){u=u.split("&");for(let y=0;y<u.length;y++){const T=u[y].indexOf("=");let M,z=null;T>=0?(M=u[y].substring(0,T),z=u[y].substring(T+1)):M=u[y],m(M,z?decodeURIComponent(z.replace(/\+/g," ")):"")}}}function Kn(u){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let m;u instanceof Kn?(this.l=u.l,ii(this,u.j),this.o=u.o,this.g=u.g,Gn(this,u.u),this.h=u.h,ls(this,da(u.i)),this.m=u.m):u&&(m=String(u).match(Hl))?(this.l=!1,ii(this,m[1]||"",!0),this.o=oi(m[2]||""),this.g=oi(m[3]||"",!0),Gn(this,m[4]),this.h=oi(m[5]||"",!0),ls(this,m[6]||"",!0),this.m=oi(m[7]||"")):(this.l=!1,this.i=new Le(null,this.l))}Kn.prototype.toString=function(){const u=[];var m=this.j;m&&u.push(ai(m,oa,!0),":");var y=this.g;return(y||m=="file")&&(u.push("//"),(m=this.o)&&u.push(ai(m,oa,!0),"@"),u.push(Wn(y).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.u,y!=null&&u.push(":",String(y))),(y=this.h)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push(ai(y,y.charAt(0)=="/"?li:aa,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",ai(y,la)),u.join("")},Kn.prototype.resolve=function(u){const m=vn(this);let y=!!u.j;y?ii(m,u.j):y=!!u.o,y?m.o=u.o:y=!!u.g,y?m.g=u.g:y=u.u!=null;var T=u.h;if(y)Gn(m,u.u);else if(y=!!u.h){if(T.charAt(0)!="/")if(this.g&&!this.h)T="/"+T;else{var M=m.h.lastIndexOf("/");M!=-1&&(T=m.h.slice(0,M+1)+T)}if(M=T,M==".."||M==".")T="";else if(M.indexOf("./")!=-1||M.indexOf("/.")!=-1){T=M.lastIndexOf("/",0)==0,M=M.split("/");const z=[];for(let te=0;te<M.length;){const Ce=M[te++];Ce=="."?T&&te==M.length&&z.push(""):Ce==".."?((z.length>1||z.length==1&&z[0]!="")&&z.pop(),T&&te==M.length&&z.push("")):(z.push(Ce),T=!0)}T=z.join("/")}else T=M}return y?m.h=T:y=u.i.toString()!=="",y?ls(m,da(u.i)):y=!!u.m,y&&(m.m=u.m),m};function vn(u){return new Kn(u)}function ii(u,m,y){u.j=y?oi(m,!0):m,u.j&&(u.j=u.j.replace(/:$/,""))}function Gn(u,m){if(m){if(m=Number(m),isNaN(m)||m<0)throw Error("Bad port number "+m);u.u=m}else u.u=null}function ls(u,m,y){m instanceof Le?(u.i=m,Qi(u.i,u.l)):(y||(m=ai(m,yh)),u.i=new Le(m,u.l))}function Ue(u,m,y){u.i.set(m,y)}function Tr(u){return Ue(u,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),u}function oi(u,m){return u?m?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function ai(u,m,y){return typeof u=="string"?(u=encodeURI(u).replace(m,ia),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function ia(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var oa=/[#\/\?@]/g,aa=/[#\?:]/g,li=/[#\?]/g,yh=/[#\?@]/g,la=/#/g;function Le(u,m){this.h=this.g=null,this.i=u||null,this.j=!!m}function Qn(u){u.g||(u.g=new Map,u.h=0,u.i&&ln(u.i,function(m,y){u.add(decodeURIComponent(m.replace(/\+/g," ")),y)}))}r=Le.prototype,r.add=function(u,m){Qn(this),this.i=null,u=Jn(this,u);let y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(m),this.h+=1,this};function ua(u,m){Qn(u),m=Jn(u,m),u.g.has(m)&&(u.i=null,u.h-=u.g.get(m).length,u.g.delete(m))}function Gi(u,m){return Qn(u),m=Jn(u,m),u.g.has(m)}r.forEach=function(u,m){Qn(this),this.g.forEach(function(y,T){y.forEach(function(M){u.call(m,M,T,this)},this)},this)};function ca(u,m){Qn(u);let y=[];if(typeof m=="string")Gi(u,m)&&(y=y.concat(u.g.get(Jn(u,m))));else for(u=Array.from(u.g.values()),m=0;m<u.length;m++)y=y.concat(u[m]);return y}r.set=function(u,m){return Qn(this),this.i=null,u=Jn(this,u),Gi(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[m]),this.h+=1,this},r.get=function(u,m){return u?(u=ca(this,u),u.length>0?String(u[0]):m):m};function ha(u,m,y){ua(u,m),y.length>0&&(u.i=null,u.g.set(Jn(u,m),j(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],m=Array.from(this.g.keys());for(let T=0;T<m.length;T++){var y=m[T];const M=Wn(y);y=ca(this,y);for(let z=0;z<y.length;z++){let te=M;y[z]!==""&&(te+="="+Wn(y[z])),u.push(te)}}return this.i=u.join("&")};function da(u){const m=new Le;return m.i=u.i,u.g&&(m.g=new Map(u.g),m.h=u.h),m}function Jn(u,m){return m=String(m),u.j&&(m=m.toLowerCase()),m}function Qi(u,m){m&&!u.j&&(Qn(u),u.i=null,u.g.forEach(function(y,T){const M=T.toLowerCase();T!=M&&(ua(this,T),ha(this,M,y))},u)),u.j=m}function Yn(u,m){const y=new is;if(h.Image){const T=new Image;T.onload=E(Dt,y,"TestLoadImage: loaded",!0,m,T),T.onerror=E(Dt,y,"TestLoadImage: error",!1,m,T),T.onabort=E(Dt,y,"TestLoadImage: abort",!1,m,T),T.ontimeout=E(Dt,y,"TestLoadImage: timeout",!1,m,T),h.setTimeout(function(){T.ontimeout&&T.ontimeout()},1e4),T.src=u}else m(!1)}function Xn(u,m){const y=new is,T=new AbortController,M=setTimeout(()=>{T.abort(),Dt(y,"TestPingServer: timeout",!1,m)},1e4);fetch(u,{signal:T.signal}).then(z=>{clearTimeout(M),z.ok?Dt(y,"TestPingServer: ok",!0,m):Dt(y,"TestPingServer: server error",!1,m)}).catch(()=>{clearTimeout(M),Dt(y,"TestPingServer: error",!1,m)})}function Dt(u,m,y,T,M){try{M&&(M.onload=null,M.onerror=null,M.onabort=null,M.ontimeout=null),T(y)}catch{}}function ui(){this.g=new Zs}function Ir(u){this.i=u.Sb||null,this.h=u.ab||!1}I(Ir,ts),Ir.prototype.g=function(){return new un(this.i,this.h)};function un(u,m){gt.call(this),this.H=u,this.o=m,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}I(un,gt),r=un.prototype,r.open=function(u,m){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=u,this.D=m,this.readyState=1,Dn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const m={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};u&&(m.body=u),(this.H||h).fetch(new Request(this.D,m)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,us(this)),this.readyState=0},r.Pa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,Dn(this)),this.g&&(this.readyState=3,Dn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;ql(this)}else u.text().then(this.Oa.bind(this),this.ga.bind(this))};function ql(u){u.j.read().then(u.Ma.bind(u)).catch(u.ga.bind(u))}r.Ma=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var m=u.value?u.value:new Uint8Array(0);(m=this.B.decode(m,{stream:!u.done}))&&(this.response=this.responseText+=m)}u.done?us(this):Dn(this),this.readyState==3&&ql(this)}},r.Oa=function(u){this.g&&(this.response=this.responseText=u,us(this))},r.Na=function(u){this.g&&(this.response=u,us(this))},r.ga=function(){this.g&&us(this)};function us(u){u.readyState=4,u.l=null,u.j=null,u.B=null,Dn(u)}r.setRequestHeader=function(u,m){this.A.append(u,m)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],m=this.h.entries();for(var y=m.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=m.next();return u.join(`\r
`)};function Dn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(un.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Wl(u){let m="";return ne(u,function(y,T){m+=T,m+=":",m+=y,m+=`\r
`}),m}function Ji(u,m,y){e:{for(T in y){var T=!1;break e}T=!0}T||(y=Wl(y),typeof u=="string"?y!=null&&Wn(y):Ue(u,m,y))}function We(u){gt.call(this),this.headers=new Map,this.L=u||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}I(We,gt);var Kl=/^https?$/i,_h=["POST","PUT"];r=We.prototype,r.Fa=function(u){this.H=u},r.ea=function(u,m,y,T){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);m=m?m.toUpperCase():"GET",this.D=u,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():jl.g(),this.g.onreadystatechange=A(_(this.Ca,this));try{this.B=!0,this.g.open(m,String(u),!0),this.B=!1}catch(z){cs(this,z);return}if(u=y||"",y=new Map(this.headers),T)if(Object.getPrototypeOf(T)===Object.prototype)for(var M in T)y.set(M,T[M]);else if(typeof T.keys=="function"&&typeof T.get=="function")for(const z of T.keys())y.set(z,T.get(z));else throw Error("Unknown input type for opt_headers: "+String(T));T=Array.from(y.keys()).find(z=>z.toLowerCase()=="content-type"),M=h.FormData&&u instanceof h.FormData,!(Array.prototype.indexOf.call(_h,m,void 0)>=0)||T||M||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[z,te]of y)this.g.setRequestHeader(z,te);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(u),this.v=!1}catch(z){cs(this,z)}};function cs(u,m){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=m,u.o=5,hs(u),Sr(u)}function hs(u){u.A||(u.A=!0,ct(u,"complete"),ct(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=u||7,ct(this,"complete"),ct(this,"abort"),Sr(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Sr(this,!0)),We.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?xr(this):this.Xa())},r.Xa=function(){xr(this)};function xr(u){if(u.h&&typeof l<"u"){if(u.v&&Zn(u)==4)setTimeout(u.Ca.bind(u),0);else if(ct(u,"readystatechange"),Zn(u)==4){u.h=!1;try{const z=u.ca();e:switch(z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var m=!0;break e;default:m=!1}var y;if(!(y=m)){var T;if(T=z===0){let te=String(u.D).match(Hl)[1]||null;!te&&h.self&&h.self.location&&(te=h.self.location.protocol.slice(0,-1)),T=!Kl.test(te?te.toLowerCase():"")}y=T}if(y)ct(u,"complete"),ct(u,"success");else{u.o=6;try{var M=Zn(u)>2?u.g.statusText:""}catch{M=""}u.l=M+" ["+u.ca()+"]",hs(u)}}finally{Sr(u)}}}}function Sr(u,m){if(u.g){u.m&&(clearTimeout(u.m),u.m=null);const y=u.g;u.g=null,m||ct(u,"ready");try{y.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Zn(u){return u.g?u.g.readyState:0}r.ca=function(){try{return Zn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(u){if(this.g){var m=this.g.responseText;return u&&m.indexOf(u)==0&&(m=m.substring(u.length)),Dl(m)}};function Gl(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.F){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function fa(u){const m={};u=(u.g&&Zn(u)>=2&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let T=0;T<u.length;T++){if(C(u[T]))continue;var y=Hi(u[T]);const M=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const z=m[M]||[];m[M]=z,z.push(y)}Z(m,function(T){return T.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function er(u,m,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||m}function Yi(u){this.za=0,this.i=[],this.j=new is,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=er("failFast",!1,u),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=er("baseRetryDelayMs",5e3,u),this.Za=er("retryDelaySeedMs",1e4,u),this.Ta=er("forwardChannelMaxRetries",2,u),this.va=er("forwardChannelRequestTimeoutMs",2e4,u),this.ma=u&&u.xmlHttpFactory||void 0,this.Ua=u&&u.Rb||void 0,this.Aa=u&&u.useFetchStreams||!1,this.O=void 0,this.L=u&&u.supportsCrossDomainXhr||!1,this.M="",this.h=new Wi(u&&u.concurrentRequestLimit),this.Ba=new ui,this.S=u&&u.fastHandshake||!1,this.R=u&&u.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=u&&u.Pb||!1,u&&u.ua&&this.j.ua(),u&&u.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&u&&u.detectBufferingProxy||!1,this.ia=void 0,u&&u.longPollingTimeout&&u.longPollingTimeout>0&&(this.ia=u.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Yi.prototype,r.ka=8,r.I=1,r.connect=function(u,m,y,T){at(0),this.W=u,this.H=m||{},y&&T!==void 0&&(this.H.OSID=y,this.H.OAID=T),this.F=this.X,this.J=ma(this,null,this.W),Ar(this)};function Xi(u){if(Zi(u),u.I==3){var m=u.V++,y=vn(u.J);if(Ue(y,"SID",u.M),Ue(y,"RID",m),Ue(y,"TYPE","terminate"),tr(u,y),m=new _n(u,u.j,m),m.M=2,m.A=Tr(vn(y)),y=!1,h.navigator&&h.navigator.sendBeacon)try{y=h.navigator.sendBeacon(m.A.toString(),"")}catch{}!y&&h.Image&&(new Image().src=m.A,y=!0),y||(m.g=Jl(m.j,null),m.g.ea(m.A)),m.F=Date.now(),ti(m)}di(u)}function cn(u){u.g&&(hi(u),u.g.cancel(),u.g=null)}function Zi(u){cn(u),u.v&&(h.clearTimeout(u.v),u.v=null),eo(u),u.h.cancel(),u.m&&(typeof u.m=="number"&&h.clearTimeout(u.m),u.m=null)}function Ar(u){if(!ra(u.h)&&!u.m){u.m=!0;var m=u.Ea;Ee||x(),de||(Ee(),de=!0),k.add(m,u),u.D=0}}function Ql(u,m){return ri(u.h)>=u.h.j-(u.m?1:0)?!1:u.m?(u.i=m.G.concat(u.i),!0):u.I==1||u.I==2||u.D>=(u.Sa?0:u.Ta)?!1:(u.m=ss(_(u.Ea,u,m),no(u,u.D)),u.D++,!0)}r.Ea=function(u){if(this.m)if(this.m=null,this.I==1){if(!u){this.V=Math.floor(Math.random()*1e5),u=this.V++;const M=new _n(this,this.j,u);let z=this.o;if(this.U&&(z?(z=V(z),se(z,this.U)):z=this.U),this.u!==null||this.R||(M.J=z,z=null),this.S)e:{for(var m=0,y=0;y<this.i.length;y++){t:{var T=this.i[y];if("__data__"in T.map&&(T=T.map.__data__,typeof T=="string")){T=T.length;break t}T=void 0}if(T===void 0)break;if(m+=T,m>4096){m=y;break e}if(m===4096||y===this.i.length-1){m=y+1;break e}}m=1e3}else m=1e3;m=pa(this,M,m),y=vn(this.J),Ue(y,"RID",u),Ue(y,"CVER",22),this.G&&Ue(y,"X-HTTP-Session-Id",this.G),tr(this,y),z&&(this.R?m="headers="+Wn(Wl(z))+"&"+m:this.u&&Ji(y,this.u,z)),Ki(this.h,M),this.Ra&&Ue(y,"TYPE","init"),this.S?(Ue(y,"$req",m),Ue(y,"SID","null"),M.U=!0,bn(M,y,null)):bn(M,y,m),this.I=2}}else this.I==3&&(u?ci(this,u):this.i.length==0||ra(this.h)||ci(this))};function ci(u,m){var y;m?y=m.l:y=u.V++;const T=vn(u.J);Ue(T,"SID",u.M),Ue(T,"RID",y),Ue(T,"AID",u.K),tr(u,T),u.u&&u.o&&Ji(T,u.u,u.o),y=new _n(u,u.j,y,u.D+1),u.u===null&&(y.J=u.o),m&&(u.i=m.G.concat(u.i)),m=pa(u,y,1e3),y.H=Math.round(u.va*.5)+Math.round(u.va*.5*Math.random()),Ki(u.h,y),bn(y,T,m)}function tr(u,m){u.H&&ne(u.H,function(y,T){Ue(m,T,y)}),u.l&&ne({},function(y,T){Ue(m,T,y)})}function pa(u,m,y){y=Math.min(u.i.length,y);const T=u.l?_(u.l.Ka,u.l,u):null;e:{var M=u.i;let Ce=-1;for(;;){const ht=["count="+y];Ce==-1?y>0?(Ce=M[0].g,ht.push("ofs="+Ce)):Ce=0:ht.push("ofs="+Ce);let Be=!0;for(let yt=0;yt<y;yt++){var z=M[yt].g;const dn=M[yt].map;if(z-=Ce,z<0)Ce=Math.max(0,M[yt].g-100),Be=!1;else try{z="req"+z+"_"||"";try{var te=dn instanceof Map?dn:Object.entries(dn);for(const[kr,rr]of te){let sr=rr;f(rr)&&(sr=es(rr)),ht.push(z+kr+"="+encodeURIComponent(sr))}}catch(kr){throw ht.push(z+"type="+encodeURIComponent("_badmap")),kr}}catch{T&&T(dn)}}if(Be){te=ht.join("&");break e}}te=void 0}return u=u.i.splice(0,y),m.G=u,te}function Ut(u){if(!u.g&&!u.v){u.Y=1;var m=u.Da;Ee||x(),de||(Ee(),de=!0),k.add(m,u),u.A=0}}function nr(u){return u.g||u.v||u.A>=3?!1:(u.Y++,u.v=ss(_(u.Da,u),no(u,u.A)),u.A++,!0)}r.Da=function(){if(this.v=null,ds(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var u=4*this.T;this.j.info("BP detection timer enabled: "+u),this.B=ss(_(this.Wa,this),u)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,at(10),cn(this),ds(this))};function hi(u){u.B!=null&&(h.clearTimeout(u.B),u.B=null)}function ds(u){u.g=new _n(u,u.j,"rpc",u.Y),u.u===null&&(u.g.J=u.o),u.g.P=0;var m=vn(u.na);Ue(m,"RID","rpc"),Ue(m,"SID",u.M),Ue(m,"AID",u.K),Ue(m,"CI",u.F?"0":"1"),!u.F&&u.ia&&Ue(m,"TO",u.ia),Ue(m,"TYPE","xmlhttp"),tr(u,m),u.u&&u.o&&Ji(m,u.u,u.o),u.O&&(u.g.H=u.O);var y=u.g;u=u.ba,y.M=1,y.A=Tr(vn(m)),y.u=null,y.R=!0,ta(y,u)}r.Va=function(){this.C!=null&&(this.C=null,cn(this),nr(this),at(19))};function eo(u){u.C!=null&&(h.clearTimeout(u.C),u.C=null)}function to(u,m){var y=null;if(u.g==m){eo(u),hi(u),u.g=null;var T=2}else if(sa(u.h,m))y=m.G,si(u.h,m),T=1;else return;if(u.I!=0){if(m.o)if(T==1){y=m.u?m.u.length:0,m=Date.now()-m.F;var M=u.D;T=rs(),ct(T,new Zo(T,y)),Ar(u)}else Ut(u);else if(M=m.m,M==3||M==0&&m.X>0||!(T==1&&Ql(u,m)||T==2&&nr(u)))switch(y&&y.length>0&&(m=u.h,m.i=m.i.concat(y)),M){case 1:hn(u,5);break;case 4:hn(u,10);break;case 3:hn(u,6);break;default:hn(u,2)}}}function no(u,m){let y=u.Qa+Math.floor(Math.random()*u.Za);return u.isActive()||(y*=2),y*m}function hn(u,m){if(u.j.info("Error code "+m),m==2){var y=_(u.bb,u),T=u.Ua;const M=!T;T=new Kn(T||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||ii(T,"https"),Tr(T),M?Yn(T.toString(),y):Xn(T.toString(),y)}else at(2);u.I=0,u.l&&u.l.pa(m),di(u),Zi(u)}r.bb=function(u){u?(this.j.info("Successfully pinged google.com"),at(2)):(this.j.info("Failed to ping google.com"),at(1))};function di(u){if(u.I=0,u.ja=[],u.l){const m=an(u.h);(m.length!=0||u.i.length!=0)&&(W(u.ja,m),W(u.ja,u.i),u.h.i.length=0,j(u.i),u.i.length=0),u.l.oa()}}function ma(u,m,y){var T=y instanceof Kn?vn(y):new Kn(y);if(T.g!="")m&&(T.g=m+"."+T.g),Gn(T,T.u);else{var M=h.location;T=M.protocol,m=m?m+"."+M.hostname:M.hostname,M=+M.port;const z=new Kn(null);T&&ii(z,T),m&&(z.g=m),M&&Gn(z,M),y&&(z.h=y),T=z}return y=u.G,m=u.wa,y&&m&&Ue(T,y,m),Ue(T,"VER",u.ka),tr(u,T),T}function Jl(u,m,y){if(m&&!u.L)throw Error("Can't create secondary domain capable XhrIo object.");return m=u.Aa&&!u.ma?new We(new Ir({ab:y})):new We(u.ma),m.Fa(u.L),m}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Yl(){}r=Yl.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function ro(){}ro.prototype.g=function(u,m){return new Vt(u,m)};function Vt(u,m){gt.call(this),this.g=new Yi(m),this.l=u,this.h=m&&m.messageUrlParams||null,u=m&&m.messageHeaders||null,m&&m.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=m&&m.initMessageHeaders||null,m&&m.messageContentType&&(u?u["X-WebChannel-Content-Type"]=m.messageContentType:u={"X-WebChannel-Content-Type":m.messageContentType}),m&&m.sa&&(u?u["X-WebChannel-Client-Profile"]=m.sa:u={"X-WebChannel-Client-Profile":m.sa}),this.g.U=u,(u=m&&m.Qb)&&!C(u)&&(this.g.u=u),this.A=m&&m.supportsCrossDomainXhr||!1,this.v=m&&m.sendRawJson||!1,(m=m&&m.httpSessionIdParam)&&!C(m)&&(this.g.G=m,u=this.h,u!==null&&m in u&&(u=this.h,m in u&&delete u[m])),this.j=new fs(this)}I(Vt,gt),Vt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Vt.prototype.close=function(){Xi(this.g)},Vt.prototype.o=function(u){var m=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.v&&(y={},y.__data__=es(u),u=y);m.i.push(new gh(m.Ya++,u)),m.I==3&&Ar(m)},Vt.prototype.N=function(){this.g.l=null,delete this.j,Xi(this.g),delete this.g,Vt.Z.N.call(this)};function Xl(u){zi.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var m=u.__sm__;if(m){e:{for(const y in m){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,m=m!==null&&u in m?m[u]:void 0),this.data=m}else this.data=u}I(Xl,zi);function Zl(){Xo.call(this),this.status=1}I(Zl,Xo);function fs(u){this.g=u}I(fs,Yl),fs.prototype.ra=function(){ct(this.g,"a")},fs.prototype.qa=function(u){ct(this.g,new Xl(u))},fs.prototype.pa=function(u){ct(this.g,new Zl)},fs.prototype.oa=function(){ct(this.g,"b")},ro.prototype.createWebChannel=ro.prototype.g,Vt.prototype.send=Vt.prototype.o,Vt.prototype.open=Vt.prototype.m,Vt.prototype.close=Vt.prototype.close,Uv=function(){return new ro},Fv=function(){return rs()},jv=Nn,pf={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},os.NO_ERROR=0,os.TIMEOUT=8,os.HTTP_ERROR=6,uc=os,as.COMPLETE="complete",Mv=as,Vl.EventType=ns,ns.OPEN="a",ns.CLOSE="b",ns.ERROR="c",ns.MESSAGE="d",gt.prototype.listen=gt.prototype.J,Wa=Vl,We.prototype.listenOnce=We.prototype.K,We.prototype.getLastError=We.prototype.Ha,We.prototype.getLastErrorCode=We.prototype.ya,We.prototype.getStatus=We.prototype.ca,We.prototype.getResponseJson=We.prototype.La,We.prototype.getResponseText=We.prototype.la,We.prototype.send=We.prototype.ea,We.prototype.setWithCredentials=We.prototype.Fa,Lv=We}).apply(typeof Ju<"u"?Ju:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */let Wt=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};Wt.UNAUTHENTICATED=new Wt(null),Wt.GOOGLE_CREDENTIALS=new Wt("google-credentials-uid"),Wt.FIRST_PARTY=new Wt("first-party-uid"),Wt.MOCK_USER=new Wt("mock-user");/**
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
 */let $o="12.14.0";function LS(r){$o=r}/**
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
 */const Vi=new Df("@firebase/firestore");function Ao(){return Vi.logLevel}function re(r,...e){if(Vi.logLevel<=Oe.DEBUG){const t=e.map(Wf);Vi.debug(`Firestore (${$o}): ${r}`,...t)}}function Kr(r,...e){if(Vi.logLevel<=Oe.ERROR){const t=e.map(Wf);Vi.error(`Firestore (${$o}): ${r}`,...t)}}function Oi(r,...e){if(Vi.logLevel<=Oe.WARN){const t=e.map(Wf);Vi.warn(`Firestore (${$o}): ${r}`,...t)}}function Wf(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
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
 */function xe(r,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,zv(r,i,t)}function zv(r,e,t){let i=`FIRESTORE (${$o}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Kr(i),new Error(i)}function ze(r,e,t,i){let o="Unexpected state";typeof t=="string"?o=t:i=t,r||zv(e,o,i)}function Re(r,e){return r}/**
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
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ie extends Jr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class $r{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Bv{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Wt.UNAUTHENTICATED)))}shutdown(){}}class jS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class FS{constructor(e){this.t=e,this.currentUser=Wt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ze(this.o===void 0,42304);let i=this.i;const o=g=>this.i!==i?(i=this.i,t(g)):Promise.resolve();let l=new $r;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new $r,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{re("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(re("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new $r)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(re("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(ze(typeof i.accessToken=="string",31837,{l:i}),new Bv(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ze(e===null||typeof e=="string",2055,{h:e}),new Wt(e)}}class US{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=Wt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class zS{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new US(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Wt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ky{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class BS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,gn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ze(this.o===void 0,3512);const i=l=>{l.error!=null&&re("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,re("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>i(l)))};const o=l=>{re("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):re("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ky(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ze(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ky(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function $S(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<r;i++)t[i]=Math.floor(256*Math.random());return t}/**
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
 */class Kf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const o=$S(40);for(let l=0;l<o.length;++l)i.length<20&&o[l]<t&&(i+=e.charAt(o[l]%62))}return i}}function De(r,e){return r<e?-1:r>e?1:0}function mf(r,e){const t=Math.min(r.length,e.length);for(let i=0;i<t;i++){const o=r.charAt(i),l=e.charAt(i);if(o!==l)return Yd(o)===Yd(l)?De(o,l):Yd(o)?1:-1}return De(r.length,e.length)}const HS=55296,qS=57343;function Yd(r){const e=r.charCodeAt(0);return e>=HS&&e<=qS}function Mo(r,e,t){return r.length===e.length&&r.every(((i,o)=>t(i,e[o])))}/**
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
 */const Cy="__name__";class ur{constructor(e,t,i){t===void 0?t=0:t>e.length&&xe(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&xe(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return ur.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ur?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let o=0;o<i;o++){const l=ur.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return De(e.length,t.length)}static compareSegments(e,t){const i=ur.isNumericId(e),o=ur.isNumericId(t);return i&&!o?-1:!i&&o?1:i&&o?ur.extractNumericId(e).compare(ur.extractNumericId(t)):mf(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ms.fromString(e.substring(4,e.length-2))}}class Je extends ur{construct(e,t,i){return new Je(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new ie(q.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((o=>o.length>0)))}return new Je(t)}static emptyPath(){return new Je([])}}const WS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class jt extends ur{construct(e,t,i){return new jt(e,t,i)}static isValidIdentifier(e){return WS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),jt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Cy}static keyField(){return new jt([Cy])}static fromServerFormat(e){const t=[];let i="",o=0;const l=()=>{if(i.length===0)throw new ie(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let h=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new ie(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new ie(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=g,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(i+=f,o++):(l(),o++)}if(l(),h)throw new ie(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new jt(t)}static emptyPath(){return new jt([])}}/**
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
 */class _e{constructor(e){this.path=e}static fromPath(e){return new _e(Je.fromString(e))}static fromName(e){return new _e(Je.fromString(e).popFirst(5))}static empty(){return new _e(Je.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Je.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Je.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new _e(new Je(e.slice()))}}/**
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
 */function $v(r,e,t){if(!t)throw new ie(q.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function KS(r,e,t,i){if(e===!0&&i===!0)throw new ie(q.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Ry(r){if(!_e.isDocumentKey(r))throw new ie(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Py(r){if(_e.isDocumentKey(r))throw new ie(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Hv(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Jc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":xe(12329,{type:typeof r})}function on(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ie(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Jc(r);throw new ie(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
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
 */function Et(r,e){const t={typeString:r};return e&&(t.value=e),t}function Sl(r,e){if(!Hv(r))throw new ie(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const o=e[i].typeString,l="value"in e[i]?{value:e[i].value}:void 0;if(!(i in r)){t=`JSON missing required field: '${i}'`;break}const h=r[i];if(o&&typeof h!==o){t=`JSON field '${i}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${i}' field to equal '${l.value}'`;break}}if(t)throw new ie(q.INVALID_ARGUMENT,t);return!0}/**
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
 */const Ny=-62135596800,by=1e6;class et{static now(){return et.fromMillis(Date.now())}static fromDate(e){return et.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*by);return new et(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ie(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ie(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ny)throw new ie(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ie(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/by}_compareTo(e){return this.seconds===e.seconds?De(this.nanoseconds,e.nanoseconds):De(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:et._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Sl(e,et._jsonSchema))return new et(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ny;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}et._jsonSchemaVersion="firestore/timestamp/1.0",et._jsonSchema={type:Et("string",et._jsonSchemaVersion),seconds:Et("number"),nanoseconds:Et("number")};/**
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
 */class ke{static fromTimestamp(e){return new ke(e)}static min(){return new ke(new et(0,0))}static max(){return new ke(new et(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const sl=-1;function GS(r,e){const t=r.toTimestamp().seconds,i=r.toTimestamp().nanoseconds+1,o=ke.fromTimestamp(i===1e9?new et(t+1,0):new et(t,i));return new Us(o,_e.empty(),e)}function QS(r){return new Us(r.readTime,r.key,sl)}class Us{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new Us(ke.min(),_e.empty(),sl)}static max(){return new Us(ke.max(),_e.empty(),sl)}}function JS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=_e.comparator(r.documentKey,e.documentKey),t!==0?t:De(r.largestBatchId,e.largestBatchId))}/**
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
 */const YS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class XS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function Ho(r){if(r.code!==q.FAILED_PRECONDITION||r.message!==YS)throw r;re("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class G{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&xe(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new G(((i,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(i,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(i,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof G?t:G.resolve(t)}catch(t){return G.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):G.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):G.reject(t)}static resolve(e){return new G(((t,i)=>{t(e)}))}static reject(e){return new G(((t,i)=>{i(e)}))}static waitFor(e){return new G(((t,i)=>{let o=0,l=0,h=!1;e.forEach((f=>{++o,f.next((()=>{++l,h&&l===o&&t()}),(g=>i(g)))})),h=!0,l===o&&t()}))}static or(e){let t=G.resolve(!1);for(const i of e)t=t.next((o=>o?G.resolve(o):i()));return t}static forEach(e,t){const i=[];return e.forEach(((o,l)=>{i.push(t.call(this,o,l))})),this.waitFor(i)}static mapArray(e,t){return new G(((i,o)=>{const l=e.length,h=new Array(l);let f=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((E=>{h[_]=E,++f,f===l&&i(h)}),(E=>o(E)))}}))}static doWhile(e,t){return new G(((i,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):i()};l()}))}}function ZS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function qo(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class Yc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this.ae(i),this.ue=i=>t.writeSequenceNumber(i))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Yc.ce=-1;/**
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
 */const Gf=-1;function Xc(r){return r==null}function Sc(r){return r===0&&1/r==-1/0}function eA(r){return typeof r=="number"&&Number.isInteger(r)&&!Sc(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const qv="";function tA(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Dy(e)),e=nA(r.get(t),e);return Dy(e)}function nA(r,e){let t=e;const i=r.length;for(let o=0;o<i;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case qv:t+="";break;default:t+=l}}return t}function Dy(r){return r+qv+""}/**
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
 */function Vy(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Js(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Wv(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class nt{constructor(e,t){this.comparator=e,this.root=t||Mt.EMPTY}insert(e,t){return new nt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Mt.BLACK,null,null))}remove(e){return new nt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Mt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const o=this.comparator(e,i.key);if(o===0)return t+i.left.size;o<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Yu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Yu(this.root,e,this.comparator,!1)}getReverseIterator(){return new Yu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Yu(this.root,e,this.comparator,!0)}}class Yu{constructor(e,t,i,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?i(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Mt{constructor(e,t,i,o,l){this.key=e,this.value=t,this.color=i??Mt.RED,this.left=o??Mt.EMPTY,this.right=l??Mt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,o,l){return new Mt(e??this.key,t??this.value,i??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let o=this;const l=i(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,i),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,i)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Mt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Mt.EMPTY;i=o.right.min(),o=o.copy(i.key,i.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Mt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Mt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw xe(43730,{key:this.key,value:this.value});if(this.right.isRed())throw xe(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw xe(27949);return e+(this.isRed()?0:1)}}Mt.EMPTY=null,Mt.RED=!0,Mt.BLACK=!1;Mt.EMPTY=new class{constructor(){this.size=0}get key(){throw xe(57766)}get value(){throw xe(16141)}get color(){throw xe(16727)}get left(){throw xe(29726)}get right(){throw xe(36894)}copy(e,t,i,o,l){return this}insert(e,t,i){return new Mt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class At{constructor(e){this.comparator=e,this.data=new nt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const o=i.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Oy(this.data.getIterator())}getIteratorFrom(e){return new Oy(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof At)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new At(this.comparator);return t.data=e,t}}class Oy{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class yn{constructor(e){this.fields=e,e.sort(jt.comparator)}static empty(){return new yn([])}unionWith(e){let t=new At(jt.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new yn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Mo(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
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
 */class Kv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ft{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Kv("Invalid base64 string: "+l):l}})(e);return new Ft(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Ft(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return De(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ft.EMPTY_BYTE_STRING=new Ft("");const rA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function zs(r){if(ze(!!r,39018),typeof r=="string"){let e=0;const t=rA.exec(r);if(ze(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const i=new Date(r);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:ft(r.seconds),nanos:ft(r.nanos)}}function ft(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Bs(r){return typeof r=="string"?Ft.fromBase64String(r):Ft.fromUint8Array(r)}/**
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
 */const Gv="server_timestamp",Qv="__type__",Jv="__previous_value__",Yv="__local_write_time__";function Qf(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Qv])==null?void 0:i.stringValue)===Gv}function Zc(r){const e=r.mapValue.fields[Jv];return Qf(e)?Zc(e):e}function il(r){const e=zs(r.mapValue.fields[Yv].timestampValue);return new et(e.seconds,e.nanos)}/**
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
 */class sA{constructor(e,t,i,o,l,h,f,g,_,E,I){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=E,this.apiKey=I}}const Ac="(default)";class ol{constructor(e,t){this.projectId=e,this.database=t||Ac}static empty(){return new ol("","")}get isDefaultDatabase(){return this.database===Ac}isEqual(e){return e instanceof ol&&e.projectId===this.projectId&&e.database===this.database}}function iA(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new ie(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ol(r.options.projectId,e)}/**
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
 */const Xv="__type__",oA="__max__",Xu={mapValue:{}},Zv="__vector__",kc="value";function $s(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Qf(r)?4:lA(r)?9007199254740991:aA(r)?10:11:xe(28295,{value:r})}function mr(r,e){if(r===e)return!0;const t=$s(r);if(t!==$s(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return il(r).isEqual(il(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=zs(o.timestampValue),f=zs(l.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Bs(o.bytesValue).isEqual(Bs(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ft(o.geoPointValue.latitude)===ft(l.geoPointValue.latitude)&&ft(o.geoPointValue.longitude)===ft(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ft(o.integerValue)===ft(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ft(o.doubleValue),f=ft(l.doubleValue);return h===f?Sc(h)===Sc(f):isNaN(h)&&isNaN(f)}return!1})(r,e);case 9:return Mo(r.arrayValue.values||[],e.arrayValue.values||[],mr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},f=l.mapValue.fields||{};if(Vy(h)!==Vy(f))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(f[g]===void 0||!mr(h[g],f[g])))return!1;return!0})(r,e);default:return xe(52216,{left:r})}}function al(r,e){return(r.values||[]).find((t=>mr(t,e)))!==void 0}function jo(r,e){if(r===e)return 0;const t=$s(r),i=$s(e);if(t!==i)return De(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return De(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const f=ft(l.integerValue||l.doubleValue),g=ft(h.integerValue||h.doubleValue);return f<g?-1:f>g?1:f===g?0:isNaN(f)?isNaN(g)?0:-1:1})(r,e);case 3:return Ly(r.timestampValue,e.timestampValue);case 4:return Ly(il(r),il(e));case 5:return mf(r.stringValue,e.stringValue);case 6:return(function(l,h){const f=Bs(l),g=Bs(h);return f.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const f=l.split("/"),g=h.split("/");for(let _=0;_<f.length&&_<g.length;_++){const E=De(f[_],g[_]);if(E!==0)return E}return De(f.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const f=De(ft(l.latitude),ft(h.latitude));return f!==0?f:De(ft(l.longitude),ft(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return My(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var A,j,W,K;const f=l.fields||{},g=h.fields||{},_=(A=f[kc])==null?void 0:A.arrayValue,E=(j=g[kc])==null?void 0:j.arrayValue,I=De(((W=_==null?void 0:_.values)==null?void 0:W.length)||0,((K=E==null?void 0:E.values)==null?void 0:K.length)||0);return I!==0?I:My(_,E)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===Xu.mapValue&&h===Xu.mapValue)return 0;if(l===Xu.mapValue)return 1;if(h===Xu.mapValue)return-1;const f=l.fields||{},g=Object.keys(f),_=h.fields||{},E=Object.keys(_);g.sort(),E.sort();for(let I=0;I<g.length&&I<E.length;++I){const A=mf(g[I],E[I]);if(A!==0)return A;const j=jo(f[g[I]],_[E[I]]);if(j!==0)return j}return De(g.length,E.length)})(r.mapValue,e.mapValue);default:throw xe(23264,{he:t})}}function Ly(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return De(r,e);const t=zs(r),i=zs(e),o=De(t.seconds,i.seconds);return o!==0?o:De(t.nanos,i.nanos)}function My(r,e){const t=r.values||[],i=e.values||[];for(let o=0;o<t.length&&o<i.length;++o){const l=jo(t[o],i[o]);if(l)return l}return De(t.length,i.length)}function Fo(r){return gf(r)}function gf(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const i=zs(t);return`time(${i.seconds},${i.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Bs(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return _e.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let i="[",o=!0;for(const l of t.values||[])o?o=!1:i+=",",i+=gf(l);return i+"]"})(r.arrayValue):"mapValue"in r?(function(t){const i=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of i)l?l=!1:o+=",",o+=`${h}:${gf(t.fields[h])}`;return o+"}"})(r.mapValue):xe(61005,{value:r})}function cc(r){switch($s(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Zc(r);return e?16+cc(e):16;case 5:return 2*r.stringValue.length;case 6:return Bs(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((o,l)=>o+cc(l)),0)})(r.arrayValue);case 10:case 11:return(function(i){let o=0;return Js(i.fields,((l,h)=>{o+=l.length+cc(h)})),o})(r.mapValue);default:throw xe(13486,{value:r})}}function jy(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function ll(r){return!!r&&"integerValue"in r}function e0(r){return ll(r)||(function(t){return!!t&&"doubleValue"in t})(r)}function Jf(r){return!!r&&"arrayValue"in r}function Fy(r){return!!r&&"nullValue"in r}function Uy(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function hc(r){return!!r&&"mapValue"in r}function aA(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Xv])==null?void 0:i.stringValue)===Zv}function Xa(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Js(r.mapValue.fields,((t,i)=>e.mapValue.fields[t]=Xa(i))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Xa(r.arrayValue.values[t]);return e}return{...r}}function lA(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===oA}/**
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
 */class sn{constructor(e){this.value=e}static empty(){return new sn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!hc(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Xa(t)}setAll(e){let t=jt.emptyPath(),i={},o=[];e.forEach(((h,f)=>{if(!t.isImmediateParentOf(f)){const g=this.getFieldsMap(t);this.applyChanges(g,i,o),i={},o=[],t=f.popLast()}h?i[f.lastSegment()]=Xa(h):o.push(f.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,i,o)}delete(e){const t=this.field(e.popLast());hc(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return mr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let o=t.mapValue.fields[e.get(i)];hc(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,i){Js(t,((o,l)=>e[o]=l));for(const o of i)delete e[o]}clone(){return new sn(Xa(this.value))}}function t0(r){const e=[];return Js(r.fields,((t,i)=>{const o=new jt([t]);if(hc(i)){const l=t0(i.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new yn(e)}/**
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
 */class Kt{constructor(e,t,i,o,l,h,f){this.key=e,this.documentType=t,this.version=i,this.readTime=o,this.createTime=l,this.data=h,this.documentState=f}static newInvalidDocument(e){return new Kt(e,0,ke.min(),ke.min(),ke.min(),sn.empty(),0)}static newFoundDocument(e,t,i,o){return new Kt(e,1,t,ke.min(),i,o,0)}static newNoDocument(e,t){return new Kt(e,2,t,ke.min(),ke.min(),sn.empty(),0)}static newUnknownDocument(e,t){return new Kt(e,3,t,ke.min(),ke.min(),sn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ke.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=sn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=sn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ke.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Kt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Kt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Cc{constructor(e,t){this.position=e,this.inclusive=t}}function zy(r,e,t){let i=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?i=_e.comparator(_e.fromName(h.referenceValue),t.key):i=jo(h,t.data.field(l.field)),l.dir==="desc"&&(i*=-1),i!==0)break}return i}function By(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!mr(r.position[t],e.position[t]))return!1;return!0}/**
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
 */class ul{constructor(e,t="asc"){this.field=e,this.dir=t}}function uA(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
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
 */class n0{}class wt extends n0{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new hA(e,t,i):t==="array-contains"?new pA(e,i):t==="in"?new mA(e,i):t==="not-in"?new gA(e,i):t==="array-contains-any"?new yA(e,i):new wt(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new dA(e,i):new fA(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(jo(t,this.value)):t!==null&&$s(this.value)===$s(t)&&this.matchesComparison(jo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return xe(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $n extends n0{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new $n(e,t)}matches(e){return r0(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function r0(r){return r.op==="and"}function s0(r){return cA(r)&&r0(r)}function cA(r){for(const e of r.filters)if(e instanceof $n)return!1;return!0}function yf(r){if(r instanceof wt)return r.field.canonicalString()+r.op.toString()+Fo(r.value);if(s0(r))return r.filters.map((e=>yf(e))).join(",");{const e=r.filters.map((t=>yf(t))).join(",");return`${r.op}(${e})`}}function i0(r,e){return r instanceof wt?(function(i,o){return o instanceof wt&&i.op===o.op&&i.field.isEqual(o.field)&&mr(i.value,o.value)})(r,e):r instanceof $n?(function(i,o){return o instanceof $n&&i.op===o.op&&i.filters.length===o.filters.length?i.filters.reduce(((l,h,f)=>l&&i0(h,o.filters[f])),!0):!1})(r,e):void xe(19439)}function o0(r){return r instanceof wt?(function(t){return`${t.field.canonicalString()} ${t.op} ${Fo(t.value)}`})(r):r instanceof $n?(function(t){return t.op.toString()+" {"+t.getFilters().map(o0).join(" ,")+"}"})(r):"Filter"}class hA extends wt{constructor(e,t,i){super(e,t,i),this.key=_e.fromName(i.referenceValue)}matches(e){const t=_e.comparator(e.key,this.key);return this.matchesComparison(t)}}class dA extends wt{constructor(e,t){super(e,"in",t),this.keys=a0("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class fA extends wt{constructor(e,t){super(e,"not-in",t),this.keys=a0("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function a0(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((i=>_e.fromName(i.referenceValue)))}class pA extends wt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Jf(t)&&al(t.arrayValue,this.value)}}class mA extends wt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&al(this.value.arrayValue,t)}}class gA extends wt{constructor(e,t){super(e,"not-in",t)}matches(e){if(al(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!al(this.value.arrayValue,t)}}class yA extends wt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Jf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>al(this.value.arrayValue,i)))}}/**
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
 */class _A{constructor(e,t=null,i=[],o=[],l=null,h=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=o,this.limit=l,this.startAt=h,this.endAt=f,this.Te=null}}function $y(r,e=null,t=[],i=[],o=null,l=null,h=null){return new _A(r,e,t,i,o,l,h)}function Yf(r){const e=Re(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>yf(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(l){return l.field.canonicalString()+l.dir})(i))).join(","),Xc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>Fo(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>Fo(i))).join(",")),e.Te=t}return e.Te}function Xf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!uA(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!i0(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!By(r.startAt,e.startAt)&&By(r.endAt,e.endAt)}function _f(r){return _e.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class Wo{constructor(e,t=null,i=[],o=[],l=null,h="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=o,this.limit=l,this.limitType=h,this.startAt=f,this.endAt=g,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function vA(r,e,t,i,o,l,h,f){return new Wo(r,e,t,i,o,l,h,f)}function eh(r){return new Wo(r)}function Hy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function wA(r){return _e.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function l0(r){return r.collectionGroup!==null}function Za(r){const e=Re(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const l of e.explicitOrderBy)e.Ie.push(l),t.add(l.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new At(jt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(f=f.add(_.field))}))})),f})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Ie.push(new ul(l,i))})),t.has(jt.keyField().canonicalString())||e.Ie.push(new ul(jt.keyField(),i))}return e.Ie}function dr(r){const e=Re(r);return e.Ee||(e.Ee=EA(e,Za(r))),e.Ee}function EA(r,e){if(r.limitType==="F")return $y(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new ul(o.field,l)}));const t=r.endAt?new Cc(r.endAt.position,r.endAt.inclusive):null,i=r.startAt?new Cc(r.startAt.position,r.startAt.inclusive):null;return $y(r.path,r.collectionGroup,e,r.filters,r.limit,t,i)}}function vf(r,e){const t=r.filters.concat([e]);return new Wo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function TA(r,e){const t=r.explicitOrderBy.concat([e]);return new Wo(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Rc(r,e,t){return new Wo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function th(r,e){return Xf(dr(r),dr(e))&&r.limitType===e.limitType}function u0(r){return`${Yf(dr(r))}|lt:${r.limitType}`}function ko(r){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((o=>o0(o))).join(", ")}]`),Xc(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((o=>Fo(o))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((o=>Fo(o))).join(",")),`Target(${i})`})(dr(r))}; limitType=${r.limitType})`}function nh(r,e){return e.isFoundDocument()&&(function(i,o){const l=o.key.path;return i.collectionGroup!==null?o.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(l):_e.isDocumentKey(i.path)?i.path.isEqual(l):i.path.isImmediateParentOf(l)})(r,e)&&(function(i,o){for(const l of Za(i))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(i,o){for(const l of i.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(i,o){return!(i.startAt&&!(function(h,f,g){const _=zy(h,f,g);return h.inclusive?_<=0:_<0})(i.startAt,Za(i),o)||i.endAt&&!(function(h,f,g){const _=zy(h,f,g);return h.inclusive?_>=0:_>0})(i.endAt,Za(i),o))})(r,e)}function IA(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function c0(r){return(e,t)=>{let i=!1;for(const o of Za(r)){const l=xA(o,e,t);if(l!==0)return l;i=i||o.field.isKeyField()}return 0}}function xA(r,e,t){const i=r.field.isKeyField()?_e.comparator(e.key,t.key):(function(l,h,f){const g=h.data.field(l),_=f.data.field(l);return g!==null&&_!==null?jo(g,_):xe(42886)})(r.field,e,t);switch(r.dir){case"asc":return i;case"desc":return-1*i;default:return xe(19790,{direction:r.dir})}}/**
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
 */class Mi{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[o,l]of i)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),o=this.inner[i];if(o===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return i.length===1?delete this.inner[t]:i.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Js(this.inner,((t,i)=>{for(const[o,l]of i)e(o,l)}))}isEmpty(){return Wv(this.inner)}size(){return this.innerSize}}/**
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
 */const SA=new nt(_e.comparator);function Gr(){return SA}const h0=new nt(_e.comparator);function Ka(...r){let e=h0;for(const t of r)e=e.insert(t.key,t);return e}function d0(r){let e=h0;return r.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function ki(){return el()}function f0(){return el()}function el(){return new Mi((r=>r.toString()),((r,e)=>r.isEqual(e)))}const AA=new nt(_e.comparator),kA=new At(_e.comparator);function Ve(...r){let e=kA;for(const t of r)e=e.add(t);return e}const CA=new At(De);function RA(){return CA}/**
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
 */function rh(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sc(e)?"-0":e}}function Zf(r){return{integerValue:""+r}}function PA(r,e){return eA(e)?Zf(e):rh(r,e)}/**
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
 */class sh{constructor(){this._=void 0}}function NA(r,e,t){return r instanceof cl?(function(o,l){const h={fields:{[Qv]:{stringValue:Gv},[Yv]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&Qf(l)&&(l=Zc(l)),l&&(h.fields[Jv]=l),{mapValue:h}})(t,e):r instanceof hl?m0(r,e):r instanceof dl?g0(r,e):r instanceof fl?(function(o,l){const h=p0(o,l),f=bc(h)+bc(o.Ae);return ll(h)&&ll(o.Ae)?Zf(f):rh(o.serializer,f)})(r,e):r instanceof Pc?(function(o,l){return qy(o,l,Math.min)})(r,e):r instanceof Nc?(function(o,l){return qy(o,l,Math.max)})(r,e):void 0}function bA(r,e,t){return r instanceof hl?m0(r,e):r instanceof dl?g0(r,e):t}function p0(r,e){return r instanceof fl?e0(e)?e:{integerValue:0}:null}class cl extends sh{}class hl extends sh{constructor(e){super(),this.elements=e}}function m0(r,e){const t=y0(e);for(const i of r.elements)t.some((o=>mr(o,i)))||t.push(i);return{arrayValue:{values:t}}}class dl extends sh{constructor(e){super(),this.elements=e}}function g0(r,e){let t=y0(e);for(const i of r.elements)t=t.filter((o=>!mr(o,i)));return{arrayValue:{values:t}}}class ep extends sh{constructor(e,t){super(),this.serializer=e,this.Ae=t}}class fl extends ep{}class Pc extends ep{}class Nc extends ep{}function qy(r,e,t){if(!e0(e))return r.Ae;const i=t(bc(e),bc(r.Ae));return ll(e)&&ll(r.Ae)?Zf(i):rh(r.serializer,i)}function bc(r){return ft(r.integerValue||r.doubleValue)}function y0(r){return Jf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class DA{constructor(e,t){this.field=e,this.transform=t}}function VA(r,e){return r.field.isEqual(e.field)&&(function(i,o){return i instanceof hl&&o instanceof hl||i instanceof dl&&o instanceof dl?Mo(i.elements,o.elements,mr):i instanceof fl&&o instanceof fl||i instanceof Pc&&o instanceof Pc||i instanceof Nc&&o instanceof Nc?mr(i.Ae,o.Ae):i instanceof cl&&o instanceof cl})(r.transform,e.transform)}class OA{constructor(e,t){this.version=e,this.transformResults=t}}class Cn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Cn}static exists(e){return new Cn(void 0,e)}static updateTime(e){return new Cn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function dc(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class ih{}function _0(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new tp(r.key,Cn.none()):new Al(r.key,r.data,Cn.none());{const t=r.data,i=sn.empty();let o=new At(jt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?i.delete(l):i.set(l,h),o=o.add(l)}return new Ys(r.key,i,new yn(o.toArray()),Cn.none())}}function LA(r,e,t){r instanceof Al?(function(o,l,h){const f=o.value.clone(),g=Ky(o.fieldTransforms,l,h.transformResults);f.setAll(g),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):r instanceof Ys?(function(o,l,h){if(!dc(o.precondition,l))return void l.convertToUnknownDocument(h.version);const f=Ky(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(v0(o)),g.setAll(f),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function tl(r,e,t,i){return r instanceof Al?(function(l,h,f,g){if(!dc(l.precondition,h))return f;const _=l.value.clone(),E=Gy(l.fieldTransforms,g,h);return _.setAll(E),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,i):r instanceof Ys?(function(l,h,f,g){if(!dc(l.precondition,h))return f;const _=Gy(l.fieldTransforms,g,h),E=h.data;return E.setAll(v0(l)),E.setAll(_),h.convertToFoundDocument(h.version,E).setHasLocalMutations(),f===null?null:f.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((I=>I.field)))})(r,e,t,i):(function(l,h,f){return dc(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f})(r,e,t)}function MA(r,e){let t=null;for(const i of r.fieldTransforms){const o=e.data.field(i.field),l=p0(i.transform,o||null);l!=null&&(t===null&&(t=sn.empty()),t.set(i.field,l))}return t||null}function Wy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(i,o){return i===void 0&&o===void 0||!(!i||!o)&&Mo(i,o,((l,h)=>VA(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Al extends ih{constructor(e,t,i,o=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Ys extends ih{constructor(e,t,i,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function v0(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=r.data.field(t);e.set(t,i)}})),e}function Ky(r,e,t){const i=new Map;ze(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,f=e.data.field(l.field);i.set(l.field,bA(h,f,t[o]))}return i}function Gy(r,e,t){const i=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);i.set(o.field,NA(l,h,e))}return i}class tp extends ih{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class jA extends ih{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class FA{constructor(e,t,i,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=o}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&LA(l,e,i[o])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=tl(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=tl(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=f0();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let f=this.applyToLocalView(h,l.mutatedFields);f=t.has(o.key)?null:f;const g=_0(h,f);g!==null&&i.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(ke.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Ve())}isEqual(e){return this.batchId===e.batchId&&Mo(this.mutations,e.mutations,((t,i)=>Wy(t,i)))&&Mo(this.baseMutations,e.baseMutations,((t,i)=>Wy(t,i)))}}class np{constructor(e,t,i,o){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=o}static from(e,t,i){ze(e.mutations.length===i.length,58842,{me:e.mutations.length,fe:i.length});let o=(function(){return AA})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,i[h].version);return new np(e,t,i,o)}}/**
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
 */class UA{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class zA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var vt,Me;function BA(r){switch(r){case q.OK:return xe(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return xe(15467,{code:r})}}function w0(r){if(r===void 0)return Kr("GRPC error has no .code"),q.UNKNOWN;switch(r){case vt.OK:return q.OK;case vt.CANCELLED:return q.CANCELLED;case vt.UNKNOWN:return q.UNKNOWN;case vt.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case vt.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case vt.INTERNAL:return q.INTERNAL;case vt.UNAVAILABLE:return q.UNAVAILABLE;case vt.UNAUTHENTICATED:return q.UNAUTHENTICATED;case vt.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case vt.NOT_FOUND:return q.NOT_FOUND;case vt.ALREADY_EXISTS:return q.ALREADY_EXISTS;case vt.PERMISSION_DENIED:return q.PERMISSION_DENIED;case vt.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case vt.ABORTED:return q.ABORTED;case vt.OUT_OF_RANGE:return q.OUT_OF_RANGE;case vt.UNIMPLEMENTED:return q.UNIMPLEMENTED;case vt.DATA_LOSS:return q.DATA_LOSS;default:return xe(39323,{code:r})}}(Me=vt||(vt={}))[Me.OK=0]="OK",Me[Me.CANCELLED=1]="CANCELLED",Me[Me.UNKNOWN=2]="UNKNOWN",Me[Me.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Me[Me.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Me[Me.NOT_FOUND=5]="NOT_FOUND",Me[Me.ALREADY_EXISTS=6]="ALREADY_EXISTS",Me[Me.PERMISSION_DENIED=7]="PERMISSION_DENIED",Me[Me.UNAUTHENTICATED=16]="UNAUTHENTICATED",Me[Me.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Me[Me.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Me[Me.ABORTED=10]="ABORTED",Me[Me.OUT_OF_RANGE=11]="OUT_OF_RANGE",Me[Me.UNIMPLEMENTED=12]="UNIMPLEMENTED",Me[Me.INTERNAL=13]="INTERNAL",Me[Me.UNAVAILABLE=14]="UNAVAILABLE",Me[Me.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function $A(){return new TextEncoder}/**
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
 */const HA=new Ms([4294967295,4294967295],0);function Qy(r){const e=$A().encode(r),t=new Ov;return t.update(e),new Uint8Array(t.digest())}function Jy(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new Ms([t,i],0),new Ms([o,l],0)]}class rp{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new Ga(`Invalid padding: ${t}`);if(i<0)throw new Ga(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new Ga(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new Ga(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Ms.fromNumber(this.ge)}ye(e,t,i){let o=e.add(t.multiply(Ms.fromNumber(i)));return o.compare(HA)===1&&(o=new Ms([o.getBits(0),o.getBits(1)],0)),o.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Qy(e),[i,o]=Jy(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);if(!this.we(h))return!1}return!0}static create(e,t,i){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new rp(l,o,t);return i.forEach((f=>h.insert(f))),h}insert(e){if(this.ge===0)return;const t=Qy(e),[i,o]=Jy(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);this.Se(h)}}Se(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class Ga extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class kl{constructor(e,t,i,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const o=new Map;return o.set(e,Cl.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new kl(ke.min(),o,new nt(De),Gr(),Ve())}}class Cl{constructor(e,t,i,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new Cl(i,t,Ve(),Ve(),Ve())}}/**
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
 */class fc{constructor(e,t,i,o){this.be=e,this.removedTargetIds=t,this.key=i,this.De=o}}class E0{constructor(e,t){this.targetId=e,this.Ce=t}}class T0{constructor(e,t,i=Ft.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=o}}class Yy{constructor(e){this.targetId=e,this.ve=0,this.Fe=Xy(),this.Me=Ft.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=Ve(),t=Ve(),i=Ve();return this.Fe.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:i=i.add(o);break;default:xe(38017,{changeType:l})}})),new Cl(this.Me,this.xe,e,t,i)}qe(){this.Oe=!1,this.Fe=Xy()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,ze(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const Ba="WatchChangeAggregator";class qA{constructor(e){this.Ge=e,this.ze=new Map,this.je=Gr(),this.Je=Zu(),this.He=Zu(),this.Ze=new nt(De)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const i=this.ze.get(t);if(i)switch(e.state){case 0:this.nt(t)&&i.Le(e.resumeToken);break;case 1:i.We(),i.Ne||i.qe(),i.Le(e.resumeToken);break;case 2:i.We(),i.Ne||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Qe(),i.Le(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Le(e.resumeToken));break;default:xe(56790,{state:e.state})}else re(Ba,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((i,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,i=e.Ce.count,o=this.st(t);if(o){const l=o.target;if(_f(l))if(i===0){const h=new _e(l.path);this.et(t,h,Kt.newNoDocument(h,ke.min()))}else ze(i===1,20013,{expectedCount:i});else{const h=this.ot(t);if(h!==i){const f=this._t(e),g=f?this.ut(f,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,_)}}}}}_t(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:o=0},hashCount:l=0}=t;let h,f;try{h=Bs(i).toUint8Array()}catch(g){if(g instanceof Kv)return Oi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{f=new rp(h,o,l)}catch(g){return Oi(g instanceof Ga?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return f.ge===0?null:f}ut(e,t,i){return t.Ce.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.Ge.getRemoteKeysForTarget(t);let o=0;return i.forEach((l=>{const h=this.Ge.lt(),f=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(f)||(this.et(t,l,null),o++)})),o}Pt(e){const t=new Map;this.ze.forEach(((l,h)=>{const f=this.st(h);if(f){if(l.current&&_f(f.target)){const g=new _e(f.target.path);this.Tt(g).has(h)||this.It(h,g)||this.et(h,g,Kt.newNoDocument(g,e))}l.Be&&(t.set(h,l.ke()),l.qe())}}));let i=Ve();this.He.forEach(((l,h)=>{let f=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)})),f&&(i=i.add(l))})),this.je.forEach(((l,h)=>h.setReadTime(e)));const o=new kl(e,t,this.Ze,this.je,i);return this.je=Gr(),this.Je=Zu(),this.He=Zu(),this.Ze=new nt(De),o}Ye(e,t){const i=this.ze.get(e);if(!i||!this.nt(e))return void re(Ba,`addDocumentToTarget received document for unknown inactive target (${e})`);const o=this.It(e,t.key)?2:0;i.Ke(t.key,o),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Tt(t.key).add(e)),this.He=this.He.insert(t.key,this.Et(t.key).add(e))}et(e,t,i){const o=this.ze.get(e);o&&this.nt(e)?(this.It(e,t)?o.Ke(t,1):o.Ue(t),this.He=this.He.insert(t,this.Et(t).delete(e)),this.He=this.He.insert(t,this.Et(t).add(e)),i&&(this.je=this.je.insert(t,i))):re(Ba,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ze.delete(e)}ot(e){const t=this.ze.get(e);if(!t)return 0;const i=t.ke();return this.Ge.getRemoteKeysForTarget(e).size+i.addedDocuments.size-i.removedDocuments.size}$e(e){let t=this.ze.get(e);t||(re(Ba,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Yy(e),this.ze.set(e,t)),t.$e()}Et(e){let t=this.He.get(e);return t||(t=new At(De),this.He=this.He.insert(e,t)),t}Tt(e){let t=this.Je.get(e);return t||(t=new At(De),this.Je=this.Je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||re(Ba,"Detected inactive target",e),t}st(e){const t=this.ze.get(e);return t===void 0||t.Ne?null:this.Ge.Rt(e)}rt(e){this.ze.set(e,new Yy(e)),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Zu(){return new nt(_e.comparator)}function Xy(){return new nt(_e.comparator)}const WA={asc:"ASCENDING",desc:"DESCENDING"},KA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},GA={and:"AND",or:"OR"};class QA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function wf(r,e){return r.useProto3Json||Xc(e)?e:{value:e}}function Dc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function I0(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function JA(r,e){return Dc(r,e.toTimestamp())}function fr(r){return ze(!!r,49232),ke.fromTimestamp((function(t){const i=zs(t);return new et(i.seconds,i.nanos)})(r))}function sp(r,e){return Ef(r,e).canonicalString()}function Ef(r,e){const t=(function(o){return new Je(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function x0(r){const e=Je.fromString(r);return ze(R0(e),10190,{key:e.toString()}),e}function Tf(r,e){return sp(r.databaseId,e.path)}function Xd(r,e){const t=x0(e);if(t.get(1)!==r.databaseId.projectId)throw new ie(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ie(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new _e(A0(t))}function S0(r,e){return sp(r.databaseId,e)}function YA(r){const e=x0(r);return e.length===4?Je.emptyPath():A0(e)}function If(r){return new Je(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function A0(r){return ze(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Zy(r,e,t){return{name:Tf(r,e),fields:t.value.mapValue.fields}}function XA(r,e){let t;if("targetChange"in e){e.targetChange;const i=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:xe(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,E){return _.useProto3Json?(ze(E===void 0||typeof E=="string",58123),Ft.fromBase64String(E||"")):(ze(E===void 0||E instanceof Buffer||E instanceof Uint8Array,16193),Ft.fromUint8Array(E||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,f=h&&(function(_){const E=_.code===void 0?q.UNKNOWN:w0(_.code);return new ie(E,_.message||"")})(h);t=new T0(i,o,l,f||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const o=Xd(r,i.document.name),l=fr(i.document.updateTime),h=i.document.createTime?fr(i.document.createTime):ke.min(),f=new sn({mapValue:{fields:i.document.fields}}),g=Kt.newFoundDocument(o,l,h,f),_=i.targetIds||[],E=i.removedTargetIds||[];t=new fc(_,E,g.key,g)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const o=Xd(r,i.document),l=i.readTime?fr(i.readTime):ke.min(),h=Kt.newNoDocument(o,l),f=i.removedTargetIds||[];t=new fc([],f,h.key,h)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const o=Xd(r,i.document),l=i.removedTargetIds||[];t=new fc([],l,o,null)}else{if(!("filter"in e))return xe(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:o=0,unchangedNames:l}=i,h=new zA(o,l),f=i.targetId;t=new E0(f,h)}}return t}function ZA(r,e){let t;if(e instanceof Al)t={update:Zy(r,e.key,e.value)};else if(e instanceof tp)t={delete:Tf(r,e.key)};else if(e instanceof Ys)t={update:Zy(r,e.key,e.data),updateMask:lk(e.fieldMask)};else{if(!(e instanceof jA))return xe(16599,{Vt:e.type});t={verify:Tf(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(l,h){const f=h.transform;if(f instanceof cl)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof hl)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof dl)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof fl)return{fieldPath:h.field.canonicalString(),increment:f.Ae};if(f instanceof Pc)return{fieldPath:h.field.canonicalString(),minimum:f.Ae};if(f instanceof Nc)return{fieldPath:h.field.canonicalString(),maximum:f.Ae};throw xe(20930,{transform:h.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:JA(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:xe(27497)})(r,e.precondition)),t}function ek(r,e){return r&&r.length>0?(ze(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?fr(o.updateTime):fr(l);return h.isEqual(ke.min())&&(h=fr(l)),new OA(h,o.transformResults||[])})(t,e)))):[]}function tk(r,e){return{documents:[S0(r,e.path)]}}function nk(r,e){const t={structuredQuery:{}},i=e.path;let o;e.collectionGroup!==null?(o=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=S0(r,o);const l=(function(_){if(_.length!==0)return C0($n.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((E=>(function(A){return{field:Co(A.field),direction:ik(A.dir)}})(E)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const f=wf(r,e.limit);return f!==null&&(t.structuredQuery.limit=f),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{dt:t,parent:o}}function rk(r){let e=YA(r.parent);const t=r.structuredQuery,i=t.from?t.from.length:0;let o=null;if(i>0){ze(i===1,65062);const E=t.from[0];E.allDescendants?o=E.collectionId:e=e.child(E.collectionId)}let l=[];t.where&&(l=(function(I){const A=k0(I);return A instanceof $n&&s0(A)?A.getFilters():[A]})(t.where));let h=[];t.orderBy&&(h=(function(I){return I.map((A=>(function(W){return new ul(Ro(W.field),(function($){switch($){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(W.direction))})(A)))})(t.orderBy));let f=null;t.limit&&(f=(function(I){let A;return A=typeof I=="object"?I.value:I,Xc(A)?null:A})(t.limit));let g=null;t.startAt&&(g=(function(I){const A=!!I.before,j=I.values||[];return new Cc(j,A)})(t.startAt));let _=null;return t.endAt&&(_=(function(I){const A=!I.before,j=I.values||[];return new Cc(j,A)})(t.endAt)),vA(e,o,h,l,f,"F",g,_)}function sk(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return xe(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function k0(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=Ro(t.unaryFilter.field);return wt.create(i,"==",{doubleValue:NaN});case"IS_NULL":const o=Ro(t.unaryFilter.field);return wt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=Ro(t.unaryFilter.field);return wt.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=Ro(t.unaryFilter.field);return wt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return xe(61313);default:return xe(60726)}})(r):r.fieldFilter!==void 0?(function(t){return wt.create(Ro(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return xe(58110);default:return xe(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return $n.create(t.compositeFilter.filters.map((i=>k0(i))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return xe(1026)}})(t.compositeFilter.op))})(r):xe(30097,{filter:r})}function ik(r){return WA[r]}function ok(r){return KA[r]}function ak(r){return GA[r]}function Co(r){return{fieldPath:r.canonicalString()}}function Ro(r){return jt.fromServerFormat(r.fieldPath)}function C0(r){return r instanceof wt?(function(t){if(t.op==="=="){if(Uy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NAN"}};if(Fy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Uy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NAN"}};if(Fy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Co(t.field),op:ok(t.op),value:t.value}}})(r):r instanceof $n?(function(t){const i=t.getFilters().map((o=>C0(o)));return i.length===1?i[0]:{compositeFilter:{op:ak(t.op),filters:i}}})(r):xe(54877,{filter:r})}function lk(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function R0(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function P0(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
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
 */class Ur{constructor(e,t,i,o,l=ke.min(),h=ke.min(),f=Ft.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=g}withSequenceNumber(e){return new Ur(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ur(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ur(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ur(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class uk{constructor(e){this.gt=e}}function ck(r){const e=rk({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Rc(e,e.limit,"L"):e}/**
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
 */class hk{constructor(){this.Sn=new dk}addToCollectionParentIndex(e,t){return this.Sn.add(t),G.resolve()}getCollectionParents(e,t){return G.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return G.resolve()}deleteFieldIndex(e,t){return G.resolve()}deleteAllFieldIndexes(e){return G.resolve()}createTargetIndexes(e,t){return G.resolve()}getDocumentsMatchingTarget(e,t){return G.resolve(null)}getIndexType(e,t){return G.resolve(0)}getFieldIndexes(e,t){return G.resolve([])}getNextCollectionGroupToUpdate(e){return G.resolve(null)}getMinOffset(e,t){return G.resolve(Us.min())}getMinOffsetFromCollectionGroup(e,t){return G.resolve(Us.min())}updateCollectionGroup(e,t,i){return G.resolve()}updateIndexEntries(e,t){return G.resolve()}}class dk{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t]||new At(Je.comparator),l=!o.has(i);return this.index[t]=o.add(i),l}has(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t];return o&&o.has(i)}getEntries(e){return(this.index[e]||new At(Je.comparator)).toArray()}}/**
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
 */const e_={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},N0=41943040;class rn{static withCacheSize(e){return new rn(e,rn.DEFAULT_COLLECTION_PERCENTILE,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
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
 */rn.DEFAULT_COLLECTION_PERCENTILE=10,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,rn.DEFAULT=new rn(N0,rn.DEFAULT_COLLECTION_PERCENTILE,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),rn.DISABLED=new rn(-1,0,0);/**
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
 */class Hs{constructor(e){this.ir=e}next(){return this.ir+=2,this.ir}static sr(){return new Hs(0)}static _r(){return new Hs(-1)}}/**
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
 */const t_="LruGarbageCollector",fk=1048576;function n_([r,e],[t,i]){const o=De(r,t);return o===0?De(e,i):o}class pk{constructor(e){this.hr=e,this.buffer=new At(n_),this.Pr=0}Tr(){return++this.Pr}Ir(e){const t=[e,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();n_(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class mk{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(e){re(t_,`Garbage collection scheduled in ${e}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){qo(t)?re(t_,"Ignoring IndexedDB error during garbage collection: ",t):await Ho(t)}await this.Rr(3e5)}))}}class gk{constructor(e,t){this.Ar=e,this.params=t}calculateTargetCount(e,t){return this.Ar.Vr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return G.resolve(Yc.ce);const i=new pk(t);return this.Ar.forEachTarget(e,(o=>i.Ir(o.sequenceNumber))).next((()=>this.Ar.dr(e,(o=>i.Ir(o))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Ar.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Ar.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(re("LruGarbageCollector","Garbage collection skipped; disabled"),G.resolve(e_)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(re("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),e_):this.mr(e,t)))}getCacheSize(e){return this.Ar.getCacheSize(e)}mr(e,t){let i,o,l,h,f,g,_;const E=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((I=>(I>this.params.maximumSequenceNumbersToCollect?(re("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${I}`),o=this.params.maximumSequenceNumbersToCollect):o=I,h=Date.now(),this.nthSequenceNumber(e,o)))).next((I=>(i=I,f=Date.now(),this.removeTargets(e,i,t)))).next((I=>(l=I,g=Date.now(),this.removeOrphanedDocuments(e,i)))).next((I=>(_=Date.now(),Ao()<=Oe.DEBUG&&re("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-E}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${l} targets in `+(g-f)+`ms
	Removed ${I} documents in `+(_-g)+`ms
Total Duration: ${_-E}ms`),G.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:I}))))}}function yk(r,e){return new gk(r,e)}/**
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
 */class _k{constructor(){this.changes=new Mi((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Kt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?G.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class vk{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class wk{constructor(e,t,i,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=o}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(i=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(i!==null&&tl(i.mutation,o,yn.empty(),et.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,Ve()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=Ve()){const o=ki();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,i).next((l=>{let h=Ka();return l.forEach(((f,g)=>{h=h.insert(f,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const i=ki();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,Ve())))}populateOverlays(e,t,i){const o=[];return i.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,f)=>{t.set(h,f)}))}))}computeViews(e,t,i,o){let l=Gr();const h=el(),f=(function(){return el()})();return t.forEach(((g,_)=>{const E=i.get(_.key);o.has(_.key)&&(E===void 0||E.mutation instanceof Ys)?l=l.insert(_.key,_):E!==void 0?(h.set(_.key,E.mutation.getFieldMask()),tl(E.mutation,_,E.mutation.getFieldMask(),et.now())):h.set(_.key,yn.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,E)=>h.set(_,E))),t.forEach(((_,E)=>f.set(_,new vk(E,h.get(_)??null)))),f)))}recalculateAndSaveOverlays(e,t){const i=el();let o=new nt(((h,f)=>h-f)),l=Ve();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const f of h)f.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let E=i.get(g)||yn.empty();E=f.applyToLocalView(_,E),i.set(g,E);const I=(o.get(f.batchId)||Ve()).add(g);o=o.insert(f.batchId,I)}))})).next((()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const g=f.getNext(),_=g.key,E=g.value,I=f0();E.forEach((A=>{if(!l.has(A)){const j=_0(t.get(A),i.get(A));j!==null&&I.set(A,j),l=l.add(A)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,I))}return G.waitFor(h)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,o){return wA(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):l0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,o):this.getDocumentsMatchingCollectionQuery(e,t,i,o)}getNextDocuments(e,t,i,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,o-l.size):G.resolve(ki());let f=sl,g=l;return h.next((_=>G.forEach(_,((E,I)=>(f<I.largestBatchId&&(f=I.largestBatchId),l.get(E)?G.resolve():this.remoteDocumentCache.getEntry(e,E).next((A=>{g=g.insert(E,A)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,Ve()))).next((E=>({batchId:f,changes:d0(E)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new _e(t)).next((i=>{let o=Ka();return i.isFoundDocument()&&(o=o.insert(i.key,i)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,o){const l=t.collectionGroup;let h=Ka();return this.indexManager.getCollectionParents(e,l).next((f=>G.forEach(f,(g=>{const _=(function(I,A){return new Wo(A,null,I.explicitOrderBy.slice(),I.filters.slice(),I.limit,I.limitType,I.startAt,I.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,i,o).next((E=>{E.forEach(((I,A)=>{h=h.insert(I,A)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,i,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,l,o)))).next((h=>{l.forEach(((g,_)=>{const E=_.getKey();h.get(E)===null&&(h=h.insert(E,Kt.newInvalidDocument(E)))}));let f=Ka();return h.forEach(((g,_)=>{const E=l.get(g);E!==void 0&&tl(E.mutation,_,yn.empty(),et.now()),nh(t,_)&&(f=f.insert(g,_))})),f}))}}/**
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
 */class Ek{constructor(e){this.serializer=e,this.Or=new Map,this.Nr=new Map}getBundleMetadata(e,t){return G.resolve(this.Or.get(t))}saveBundleMetadata(e,t){return this.Or.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:fr(o.createTime)}})(t)),G.resolve()}getNamedQuery(e,t){return G.resolve(this.Nr.get(t))}saveNamedQuery(e,t){return this.Nr.set(t.name,(function(o){return{name:o.name,query:ck(o.bundledQuery),readTime:fr(o.readTime)}})(t)),G.resolve()}}/**
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
 */class Tk{constructor(){this.overlays=new nt(_e.comparator),this.Br=new Map}getOverlay(e,t){return G.resolve(this.overlays.get(t))}getOverlays(e,t){const i=ki();return G.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&i.set(o,l)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((o,l)=>{this.wt(e,t,l)})),G.resolve()}removeOverlaysForBatchId(e,t,i){const o=this.Br.get(i);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.Br.delete(i)),G.resolve()}getOverlaysForCollection(e,t,i){const o=ki(),l=t.length+1,h=new _e(t.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const g=f.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>i&&o.set(g.getKey(),g)}return G.resolve(o)}getOverlaysForCollectionGroup(e,t,i,o){let l=new nt(((_,E)=>_-E));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>i){let E=l.get(_.largestBatchId);E===null&&(E=ki(),l=l.insert(_.largestBatchId,E)),E.set(_.getKey(),_)}}const f=ki(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,E)=>f.set(_,E))),!(f.size()>=o)););return G.resolve(f)}wt(e,t,i){const o=this.overlays.get(i.key);if(o!==null){const h=this.Br.get(o.largestBatchId).delete(i.key);this.Br.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(i.key,new UA(t,i));let l=this.Br.get(t);l===void 0&&(l=Ve(),this.Br.set(t,l)),this.Br.set(t,l.add(i.key))}}/**
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
 */class Ik{constructor(){this.sessionToken=Ft.EMPTY_BYTE_STRING}getSessionToken(e){return G.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,G.resolve()}}/**
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
 */class ip{constructor(){this.Lr=new At(Nt.kr),this.qr=new At(Nt.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(e,t){const i=new Nt(e,t);this.Lr=this.Lr.add(i),this.qr=this.qr.add(i)}Ur(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.$r(new Nt(e,t))}Wr(e,t){e.forEach((i=>this.removeReference(i,t)))}Qr(e){const t=new _e(new Je([])),i=new Nt(t,e),o=new Nt(t,e+1),l=[];return this.qr.forEachInRange([i,o],(h=>{this.$r(h),l.push(h.key)})),l}Gr(){this.Lr.forEach((e=>this.$r(e)))}$r(e){this.Lr=this.Lr.delete(e),this.qr=this.qr.delete(e)}zr(e){const t=new _e(new Je([])),i=new Nt(t,e),o=new Nt(t,e+1);let l=Ve();return this.qr.forEachInRange([i,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new Nt(e,0),i=this.Lr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class Nt{constructor(e,t){this.key=e,this.jr=t}static kr(e,t){return _e.comparator(e.key,t.key)||De(e.jr,t.jr)}static Kr(e,t){return De(e.jr,t.jr)||_e.comparator(e.key,t.key)}}/**
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
 */class xk{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Xn=1,this.Jr=new At(Nt.kr)}checkEmpty(e){return G.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,o){const l=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new FA(l,t,i,o);this.mutationQueue.push(h);for(const f of o)this.Jr=this.Jr.add(new Nt(f.key,l)),this.indexManager.addToCollectionParentIndex(e,f.key.path.popLast());return G.resolve(h)}lookupMutationBatch(e,t){return G.resolve(this.Hr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,o=this.Zr(i),l=o<0?0:o;return G.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return G.resolve(this.mutationQueue.length===0?Gf:this.Xn-1)}getAllMutationBatches(e){return G.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new Nt(t,0),o=new Nt(t,Number.POSITIVE_INFINITY),l=[];return this.Jr.forEachInRange([i,o],(h=>{const f=this.Hr(h.jr);l.push(f)})),G.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new At(De);return t.forEach((o=>{const l=new Nt(o,0),h=new Nt(o,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([l,h],(f=>{i=i.add(f.jr)}))})),G.resolve(this.Xr(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,o=i.length+1;let l=i;_e.isDocumentKey(l)||(l=l.child(""));const h=new Nt(new _e(l),0);let f=new At(De);return this.Jr.forEachWhile((g=>{const _=g.key.path;return!!i.isPrefixOf(_)&&(_.length===o&&(f=f.add(g.jr)),!0)}),h),G.resolve(this.Xr(f))}Xr(e){const t=[];return e.forEach((i=>{const o=this.Hr(i);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){ze(this.Yr(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Jr;return G.forEach(t.mutations,(o=>{const l=new Nt(o.key,t.batchId);return i=i.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Jr=i}))}tr(e){}containsKey(e,t){const i=new Nt(t,0),o=this.Jr.firstAfterOrEqual(i);return G.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,G.resolve()}Yr(e,t){return this.Zr(e)}Zr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Hr(e){const t=this.Zr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Sk{constructor(e){this.ei=e,this.docs=(function(){return new nt(_e.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,o=this.docs.get(i),l=o?o.size:0,h=this.ei(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return G.resolve(i?i.document.mutableCopy():Kt.newInvalidDocument(t))}getEntries(e,t){let i=Gr();return t.forEach((o=>{const l=this.docs.get(o);i=i.insert(o,l?l.document.mutableCopy():Kt.newInvalidDocument(o))})),G.resolve(i)}getDocumentsMatchingQuery(e,t,i,o){let l=Gr();const h=t.path,f=new _e(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(f);for(;g.hasNext();){const{key:_,value:{document:E}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||JS(QS(E),i)<=0||(o.has(E.key)||nh(t,E))&&(l=l.insert(E.key,E.mutableCopy()))}return G.resolve(l)}getAllFromCollectionGroup(e,t,i,o){xe(9500)}ti(e,t){return G.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new Ak(this)}getSize(e){return G.resolve(this.size)}}class Ak extends _k{constructor(e){super(),this.Fr=e}applyChanges(e){const t=[];return this.changes.forEach(((i,o)=>{o.isValidDocument()?t.push(this.Fr.addEntry(e,o)):this.Fr.removeEntry(i)})),G.waitFor(t)}getFromCache(e,t){return this.Fr.getEntry(e,t)}getAllFromCache(e,t){return this.Fr.getEntries(e,t)}}/**
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
 */class kk{constructor(e){this.persistence=e,this.ni=new Mi((t=>Yf(t)),Xf),this.lastRemoteSnapshotVersion=ke.min(),this.highestTargetId=0,this.ri=0,this.ii=new ip,this.targetCount=0,this.si=Hs.sr()}forEachTarget(e,t){return this.ni.forEach(((i,o)=>t(o))),G.resolve()}getLastRemoteSnapshotVersion(e){return G.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return G.resolve(this.ri)}allocateTargetId(e){return this.highestTargetId=this.si.next(),G.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.ri&&(this.ri=t),G.resolve()}cr(e){this.ni.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.si=new Hs(t),this.highestTargetId=t),e.sequenceNumber>this.ri&&(this.ri=e.sequenceNumber)}addTargetData(e,t){return this.cr(t),this.targetCount+=1,G.resolve()}updateTargetData(e,t){return this.cr(t),G.resolve()}removeTargetData(e,t){return this.ni.delete(t.target),this.ii.Qr(t.targetId),this.targetCount-=1,G.resolve()}removeTargets(e,t,i){let o=0;const l=[];return this.ni.forEach(((h,f)=>{f.sequenceNumber<=t&&i.get(f.targetId)===null&&(this.ni.delete(h),l.push(this.removeMatchingKeysForTargetId(e,f.targetId)),o++)})),G.waitFor(l).next((()=>o))}getTargetCount(e){return G.resolve(this.targetCount)}getTargetData(e,t){const i=this.ni.get(t)||null;return G.resolve(i)}addMatchingKeys(e,t,i){return this.ii.Ur(t,i),G.resolve()}removeMatchingKeys(e,t,i){this.ii.Wr(t,i);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),G.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.ii.Qr(t),G.resolve()}getMatchingKeysForTargetId(e,t){const i=this.ii.zr(t);return G.resolve(i)}containsKey(e,t){return G.resolve(this.ii.containsKey(t))}}/**
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
 */class b0{constructor(e,t){this.oi={},this.overlays={},this._i=new Yc(0),this.ai=!1,this.ai=!0,this.ui=new Ik,this.referenceDelegate=e(this),this.ci=new kk(this),this.indexManager=new hk,this.remoteDocumentCache=(function(o){return new Sk(o)})((i=>this.referenceDelegate.li(i))),this.serializer=new uk(t),this.hi=new Ek(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Tk,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.oi[e.toKey()];return i||(i=new xk(t,this.referenceDelegate),this.oi[e.toKey()]=i),i}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(e,t,i){re("MemoryPersistence","Starting transaction:",e);const o=new Ck(this._i.next());return this.referenceDelegate.Pi(),i(o).next((l=>this.referenceDelegate.Ti(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ii(e,t){return G.or(Object.values(this.oi).map((i=>()=>i.containsKey(e,t))))}}class Ck extends XS{constructor(e){super(),this.currentSequenceNumber=e}}class op{constructor(e){this.persistence=e,this.Ei=new ip,this.Ri=null}static Ai(e){return new op(e)}get Vi(){if(this.Ri)return this.Ri;throw xe(60996)}addReference(e,t,i){return this.Ei.addReference(i,t),this.Vi.delete(i.toString()),G.resolve()}removeReference(e,t,i){return this.Ei.removeReference(i,t),this.Vi.add(i.toString()),G.resolve()}markPotentiallyOrphaned(e,t){return this.Vi.add(t.toString()),G.resolve()}removeTarget(e,t){this.Ei.Qr(t.targetId).forEach((o=>this.Vi.add(o.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.Vi.add(l.toString())))})).next((()=>i.removeTargetData(e,t)))}Pi(){this.Ri=new Set}Ti(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return G.forEach(this.Vi,(i=>{const o=_e.fromPath(i);return this.di(e,o).next((l=>{l||t.removeEntry(o,ke.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.di(e,t).next((i=>{i?this.Vi.delete(t.toString()):this.Vi.add(t.toString())}))}li(e){return 0}di(e,t){return G.or([()=>G.resolve(this.Ei.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class Vc{constructor(e,t){this.persistence=e,this.mi=new Mi((i=>tA(i.path)),((i,o)=>i.isEqual(o))),this.garbageCollector=yk(this,t)}static Ai(e,t){return new Vc(e,t)}Pi(){}Ti(e){return G.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Vr(e){const t=this.gr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((o=>i+o))))}gr(e){let t=0;return this.dr(e,(i=>{t++})).next((()=>t))}dr(e,t){return G.forEach(this.mi,((i,o)=>this.yr(e,i,o).next((l=>l?G.resolve():t(o)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ti(e,(h=>this.yr(e,h,t).next((f=>{f||(i++,l.removeEntry(h,ke.min()))})))).next((()=>l.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.mi.set(t,e.currentSequenceNumber),G.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),G.resolve()}removeReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),G.resolve()}updateLimboDocument(e,t){return this.mi.set(t,e.currentSequenceNumber),G.resolve()}li(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=cc(e.data.value)),t}yr(e,t,i){return G.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.mi.get(t);return G.resolve(o!==void 0&&o>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class ap{constructor(e,t,i,o){this.targetId=e,this.fromCache=t,this.Ps=i,this.Ts=o}static Is(e,t){let i=Ve(),o=Ve();for(const l of t.docChanges)switch(l.type){case 0:i=i.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new ap(e,t.fromCache,i,o)}}/**
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
 */class Rk{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Pk{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return XT()?8:ZS(Gt())>0?6:4})()}initialize(e,t){this.ds=e,this.indexManager=t,this.Es=!0}getDocumentsMatchingQuery(e,t,i,o){const l={result:null};return this.fs(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.gs(e,t,o,i).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new Rk;return this.ps(e,t,h).next((f=>{if(l.result=f,this.Rs)return this.ys(e,t,h,f.size)}))})).next((()=>l.result))}ys(e,t,i,o){return i.documentReadCount<this.As?(Ao()<=Oe.DEBUG&&re("QueryEngine","SDK will not create cache indexes for query:",ko(t),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),G.resolve()):(Ao()<=Oe.DEBUG&&re("QueryEngine","Query:",ko(t),"scans",i.documentReadCount,"local documents and returns",o,"documents as results."),i.documentReadCount>this.Vs*o?(Ao()<=Oe.DEBUG&&re("QueryEngine","The SDK decides to create cache indexes for query:",ko(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,dr(t))):G.resolve())}fs(e,t){if(Hy(t))return G.resolve(null);let i=dr(t);return this.indexManager.getIndexType(e,i).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=Rc(t,null,"F"),i=dr(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((l=>{const h=Ve(...l);return this.ds.getDocuments(e,h).next((f=>this.indexManager.getMinOffset(e,i).next((g=>{const _=this.ws(t,f);return this.Ss(t,_,h,g.readTime)?this.fs(e,Rc(t,null,"F")):this.bs(e,_,t,g)}))))})))))}gs(e,t,i,o){return Hy(t)||o.isEqual(ke.min())?G.resolve(null):this.ds.getDocuments(e,i).next((l=>{const h=this.ws(t,l);return this.Ss(t,h,i,o)?G.resolve(null):(Ao()<=Oe.DEBUG&&re("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),ko(t)),this.bs(e,h,t,GS(o,sl)).next((f=>f)))}))}ws(e,t){let i=new At(c0(e));return t.forEach(((o,l)=>{nh(e,l)&&(i=i.add(l))})),i}Ss(e,t,i,o){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ps(e,t,i){return Ao()<=Oe.DEBUG&&re("QueryEngine","Using full collection scan to execute query:",ko(t)),this.ds.getDocumentsMatchingQuery(e,t,Us.min(),i)}bs(e,t,i,o){return this.ds.getDocumentsMatchingQuery(e,i,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
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
 */const lp="LocalStore",Nk=3e8;class bk{constructor(e,t,i,o){this.persistence=e,this.Ds=t,this.serializer=o,this.Cs=new nt(De),this.vs=new Mi((l=>Yf(l)),Xf),this.Fs=new Map,this.Ms=e.getRemoteDocumentCache(),this.ci=e.getTargetCache(),this.hi=e.getBundleCache(),this.xs(i)}xs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new wk(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Cs)))}}function Dk(r,e,t,i){return new bk(r,e,t,i)}async function D0(r,e){const t=Re(r);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let o;return t.mutationQueue.getAllMutationBatches(i).next((l=>(o=l,t.xs(e),t.mutationQueue.getAllMutationBatches(i)))).next((l=>{const h=[],f=[];let g=Ve();for(const _ of o){h.push(_.batchId);for(const E of _.mutations)g=g.add(E.key)}for(const _ of l){f.push(_.batchId);for(const E of _.mutations)g=g.add(E.key)}return t.localDocuments.getDocuments(i,g).next((_=>({Os:_,removedBatchIds:h,addedBatchIds:f})))}))}))}function Vk(r,e){const t=Re(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const o=e.batch.keys(),l=t.Ms.newChangeBuffer({trackRemovals:!0});return(function(f,g,_,E){const I=_.batch,A=I.keys();let j=G.resolve();return A.forEach((W=>{j=j.next((()=>E.getEntry(g,W))).next((K=>{const $=_.docVersions.get(W);ze($!==null,48541),K.version.compareTo($)<0&&(I.applyToRemoteDocument(K,_),K.isValidDocument()&&(K.setReadTime(_.commitVersion),E.addEntry(K)))}))})),j.next((()=>f.mutationQueue.removeMutationBatch(g,I)))})(t,i,e,l).next((()=>l.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(f){let g=Ve();for(let _=0;_<f.mutationResults.length;++_)f.mutationResults[_].transformResults.length>0&&(g=g.add(f.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(i,o)))}))}function V0(r){const e=Re(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ci.getLastRemoteSnapshotVersion(t)))}function Ok(r,e){const t=Re(r),i=e.snapshotVersion;let o=t.Cs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Ms.newChangeBuffer({trackRemovals:!0});o=t.Cs;const f=[];e.targetChanges.forEach(((E,I)=>{const A=o.get(I);if(!A)return;f.push(t.ci.removeMatchingKeys(l,E.removedDocuments,I).next((()=>t.ci.addMatchingKeys(l,E.addedDocuments,I))));let j=A.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(I)!==null?j=j.withResumeToken(Ft.EMPTY_BYTE_STRING,ke.min()).withLastLimboFreeSnapshotVersion(ke.min()):E.resumeToken.approximateByteSize()>0&&(j=j.withResumeToken(E.resumeToken,i)),o=o.insert(I,j),(function(K,$,pe){return K.resumeToken.approximateByteSize()===0||$.snapshotVersion.toMicroseconds()-K.snapshotVersion.toMicroseconds()>=Nk?!0:pe.addedDocuments.size+pe.modifiedDocuments.size+pe.removedDocuments.size>0})(A,j,E)&&f.push(t.ci.updateTargetData(l,j))}));let g=Gr(),_=Ve();if(e.documentUpdates.forEach((E=>{e.resolvedLimboDocuments.has(E)&&f.push(t.persistence.referenceDelegate.updateLimboDocument(l,E))})),f.push(Lk(l,h,e.documentUpdates).next((E=>{g=E.Ns,_=E.Bs}))),!i.isEqual(ke.min())){const E=t.ci.getLastRemoteSnapshotVersion(l).next((I=>t.ci.setTargetsMetadata(l,l.currentSequenceNumber,i)));f.push(E)}return G.waitFor(f).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Cs=o,l)))}function Lk(r,e,t){let i=Ve(),o=Ve();return t.forEach((l=>i=i.add(l))),e.getEntries(r,i).next((l=>{let h=Gr();return t.forEach(((f,g)=>{const _=l.get(f);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(f)),g.isNoDocument()&&g.version.isEqual(ke.min())?(e.removeEntry(f,g.readTime),h=h.insert(f,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(f,g)):re(lp,"Ignoring outdated watch update for ",f,". Current version:",_.version," Watch version:",g.version)})),{Ns:h,Bs:o}}))}function Mk(r,e){const t=Re(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Gf),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function jk(r,e){const t=Re(r);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let o;return t.ci.getTargetData(i,e).next((l=>l?(o=l,G.resolve(o)):t.ci.allocateTargetId(i).next((h=>(o=new Ur(e,h,"TargetPurposeListen",i.currentSequenceNumber),t.ci.addTargetData(i,o).next((()=>o)))))))})).then((i=>{const o=t.Cs.get(i.targetId);return(o===null||i.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Cs=t.Cs.insert(i.targetId,i),t.vs.set(e,i.targetId)),i}))}async function xf(r,e,t){const i=Re(r),o=i.Cs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",l,(h=>i.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!qo(h))throw h;re(lp,`Failed to update sequence numbers for target ${e}: ${h}`)}i.Cs=i.Cs.remove(e),i.vs.delete(o.target)}function r_(r,e,t){const i=Re(r);let o=ke.min(),l=Ve();return i.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,E){const I=Re(g),A=I.vs.get(E);return A!==void 0?G.resolve(I.Cs.get(A)):I.ci.getTargetData(_,E)})(i,h,dr(e)).next((f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,i.ci.getMatchingKeysForTargetId(h,f.targetId).next((g=>{l=g}))})).next((()=>i.Ds.getDocumentsMatchingQuery(h,e,t?o:ke.min(),t?l:Ve()))).next((f=>(Fk(i,IA(e),f),{documents:f,Ls:l})))))}function Fk(r,e,t){let i=r.Fs.get(e)||ke.min();t.forEach(((o,l)=>{l.readTime.compareTo(i)>0&&(i=l.readTime)})),r.Fs.set(e,i)}class s_{constructor(){this.activeTargetIds=RA()}Ws(e){this.activeTargetIds=this.activeTargetIds.add(e)}Qs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}$s(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Uk{constructor(){this.Co=new s_,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Co.Ws(e),this.vo[e]||"not-current"}updateQueryState(e,t,i){this.vo[e]=t}removeLocalQueryTarget(e){this.Co.Qs(e)}isLocalQueryTarget(e){return this.Co.activeTargetIds.has(e)}clearQueryState(e){delete this.vo[e]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(e){return this.Co.activeTargetIds.has(e)}start(){return this.Co=new s_,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class zk{Fo(e){}shutdown(){}}/**
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
 */const i_="ConnectivityMonitor";class o_{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(e){this.Bo.push(e)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){re(i_,"Network connectivity changed: AVAILABLE");for(const e of this.Bo)e(0)}No(){re(i_,"Network connectivity changed: UNAVAILABLE");for(const e of this.Bo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ec=null;function Sf(){return ec===null?ec=(function(){return 268435456+Math.round(2147483648*Math.random())})():ec++,"0x"+ec.toString(16)}/**
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
 */const Zd="RestConnection",Bk={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class $k{get ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Ko=`projects/${i}/databases/${o}`,this.Uo=this.databaseId.database===Ac?`project_id=${i}`:`project_id=${i}&database_id=${o}`}$o(e,t,i,o,l){const h=Sf(),f=this.Wo(e,t.toUriEncodedString());re(Zd,`Sending RPC '${e}' ${h}:`,f,i);const g={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(g,o,l);const{host:_}=new URL(f),E=wl(_);return this.Go(e,f,g,i,E).then((I=>(re(Zd,`Received RPC '${e}' ${h}: `,I),I)),(I=>{throw Oi(Zd,`RPC '${e}' ${h} failed with error: `,I,"url: ",f,"request:",i),I}))}zo(e,t,i,o,l,h){return this.$o(e,t,i,o,l)}Qo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+$o})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),i&&i.headers.forEach(((o,l)=>e[l]=o))}Wo(e,t){const i=Bk[e];let o=`${this.qo}/v1/${t}:${i}`;return this.databaseInfo.apiKey&&(o=`${o}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),o}terminate(){}}/**
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
 */class Hk{constructor(e){this.jo=e.jo,this.Jo=e.Jo}Ho(e){this.Zo=e}Xo(e){this.Yo=e}e_(e){this.t_=e}onMessage(e){this.n_=e}close(){this.Jo()}send(e){this.jo(e)}r_(){this.Zo()}i_(){this.Yo()}s_(e){this.t_(e)}o_(e){this.n_(e)}}/**
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
 */const qt="WebChannelConnection",$a=(r,e,t)=>{r.listen(e,(i=>{try{t(i)}catch(o){setTimeout((()=>{throw o}),0)}}))};class Do extends $k{constructor(e){super(e),this.__=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static a_(){if(!Do.u_){const e=Fv();$a(e,jv.STAT_EVENT,(t=>{t.stat===pf.PROXY?re(qt,"STAT_EVENT: detected buffering proxy"):t.stat===pf.NOPROXY&&re(qt,"STAT_EVENT: detected no buffering proxy")})),Do.u_=!0}}Go(e,t,i,o,l){const h=Sf();return new Promise(((f,g)=>{const _=new Lv;_.setWithCredentials(!0),_.listenOnce(Mv.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case uc.NO_ERROR:const I=_.getResponseJson();re(qt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(I)),f(I);break;case uc.TIMEOUT:re(qt,`RPC '${e}' ${h} timed out`),g(new ie(q.DEADLINE_EXCEEDED,"Request time out"));break;case uc.HTTP_ERROR:const A=_.getStatus();if(re(qt,`RPC '${e}' ${h} failed with status:`,A,"response text:",_.getResponseText()),A>0){let j=_.getResponseJson();Array.isArray(j)&&(j=j[0]);const W=j==null?void 0:j.error;if(W&&W.status&&W.message){const K=(function(pe){const le=pe.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(le)>=0?le:q.UNKNOWN})(W.status);g(new ie(K,W.message))}else g(new ie(q.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new ie(q.UNAVAILABLE,"Connection failed."));break;default:xe(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{re(qt,`RPC '${e}' ${h} completed.`)}}));const E=JSON.stringify(o);re(qt,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",E,i,15)}))}P_(e,t,i){const o=Sf(),l=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=this.createWebChannelTransport(),f={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},g=this.longPollingOptions.timeoutSeconds;g!==void 0&&(f.longPollingTimeout=Math.round(1e3*g)),this.useFetchStreams&&(f.useFetchStreams=!0),this.Qo(f.initMessageHeaders,t,i),f.encodeInitMessageHeaders=!0;const _=l.join("");re(qt,`Creating RPC '${e}' stream ${o}: ${_}`,f);const E=h.createWebChannel(_,f);this.T_(E);let I=!1,A=!1;const j=new Hk({jo:W=>{A?re(qt,`Not sending because RPC '${e}' stream ${o} is closed:`,W):(I||(re(qt,`Opening RPC '${e}' stream ${o} transport.`),E.open(),I=!0),re(qt,`RPC '${e}' stream ${o} sending:`,W),E.send(W))},Jo:()=>E.close()});return $a(E,Wa.EventType.OPEN,(()=>{A||(re(qt,`RPC '${e}' stream ${o} transport opened.`),j.r_())})),$a(E,Wa.EventType.CLOSE,(()=>{A||(A=!0,re(qt,`RPC '${e}' stream ${o} transport closed`),j.s_(),this.I_(E))})),$a(E,Wa.EventType.ERROR,(W=>{A||(A=!0,Oi(qt,`RPC '${e}' stream ${o} transport errored. Name:`,W.name,"Message:",W.message),j.s_(new ie(q.UNAVAILABLE,"The operation could not be completed")))})),$a(E,Wa.EventType.MESSAGE,(W=>{var K;if(!A){const $=W.data[0];ze(!!$,16349);const pe=$,le=(pe==null?void 0:pe.error)||((K=pe[0])==null?void 0:K.error);if(le){re(qt,`RPC '${e}' stream ${o} received error:`,le);const ce=le.status;let Te=(function(k){const x=vt[k];if(x!==void 0)return w0(x)})(ce),Ee=le.message;ce==="NOT_FOUND"&&Ee.includes("database")&&Ee.includes("does not exist")&&Ee.includes(this.databaseId.database)&&Oi(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Te===void 0&&(Te=q.INTERNAL,Ee="Unknown error status: "+ce+" with message "+le.message),A=!0,j.s_(new ie(Te,Ee)),E.close()}else re(qt,`RPC '${e}' stream ${o} received:`,$),j.o_($)}})),Do.a_(),setTimeout((()=>{j.i_()}),0),j}terminate(){this.__.forEach((e=>e.close())),this.__=[]}T_(e){this.__.push(e)}I_(e){this.__=this.__.filter((t=>t===e))}Qo(e,t,i){super.Qo(e,t,i),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Uv()}}/**
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
 */function qk(r){return new Do(r)}function ef(){return typeof document<"u"?document:null}/**
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
 */function oh(r){return new QA(r,!0)}/**
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
 */Do.u_=!1;class O0{constructor(e,t,i=1e3,o=1.5,l=6e4){this.Di=e,this.timerId=t,this.E_=i,this.R_=o,this.A_=l,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(e){this.cancel();const t=Math.floor(this.V_+this.p_()),i=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-i);o>0&&re("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
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
 */const a_="PersistentStream";class L0{constructor(e,t,i,o,l,h,f,g){this.Di=e,this.w_=i,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new O0(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(e,t){this.q_(),this.K_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(Kr(t.toString()),Kr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.e_(t)}U_(){}auth(){this.state=1;const e=this.W_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,o])=>{this.b_===t&&this.Q_(i,o)}),(i=>{e((()=>{const o=new ie(q.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(o)}))}))}Q_(e,t){const i=this.W_(this.b_);this.stream=this.z_(e,t),this.stream.Ho((()=>{i((()=>this.listener.Ho()))})),this.stream.Xo((()=>{i((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((o=>{i((()=>this.G_(o)))})),this.stream.onMessage((o=>{i((()=>++this.v_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return re(a_,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Di.enqueueAndForget((()=>this.b_===e?t():(re(a_,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Wk extends L0{constructor(e,t,i,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=XA(this.serializer,e),i=(function(l){if(!("targetChange"in l))return ke.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?ke.min():h.readTime?fr(h.readTime):ke.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=If(this.serializer),t.addTarget=(function(l,h){let f;const g=h.target;if(f=_f(g)?{documents:tk(l,g)}:{query:nk(l,g).dt},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=I0(l,h.resumeToken);const _=wf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}else if(h.snapshotVersion.compareTo(ke.min())>0){f.readTime=Dc(l,h.snapshotVersion.toTimestamp());const _=wf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}return f})(this.serializer,e);const i=sk(this.serializer,e);i&&(t.labels=i),this.k_(t)}Z_(e){const t={};t.database=If(this.serializer),t.removeTarget=e,this.k_(t)}}class Kk extends L0{constructor(e,t,i,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return ze(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ze(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){ze(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=ek(e.writeResults,e.commitTime),i=fr(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=If(this.serializer),this.k_(e)}Y_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>ZA(this.serializer,i)))};this.k_(t)}}/**
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
 */class Gk{}class Qk extends Gk{constructor(e,t,i,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new ie(q.FAILED_PRECONDITION,"The client has already been terminated.")}$o(e,t,i,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.$o(e,Ef(t,i),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new ie(q.UNKNOWN,l.toString())}))}zo(e,t,i,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,f])=>this.connection.zo(e,Ef(t,i),o,h,f,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new ie(q.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function Jk(r,e,t,i){return new Qk(r,e,t,i)}class Yk{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Kr(t),this._a=!1):re("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const gr="RemoteStore";class Xk{constructor(e,t,i,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new Hs(1e3),this.Aa=new Hs(1001),this.Va=new Set,this.da=[],this.ma=l,this.ma.Fo((h=>{i.enqueueAndForget((async()=>{ji(this)&&(re(gr,"Restarting streams for network reachability change."),await(async function(g){const _=Re(g);_.Va.add(4),await Rl(_),_.fa.set("Unknown"),_.Va.delete(4),await ah(_)})(this))}))})),this.fa=new Yk(i,o)}}async function ah(r){if(ji(r))for(const e of r.da)await e(!0)}async function Rl(r){for(const e of r.da)await e(!1)}function Af(r,e){return r.Ia.get(e)||void 0}function M0(r,e){const t=Re(r),i=Af(t,e.targetId);if(i!==void 0&&t.Ta.has(i))return;const o=(function(f,g){const _=Af(f,g);_!==void 0&&f.Ea.delete(_);const E=(function(A,j){return j%2!=0?A.Aa.next():A.Ra.next()})(f,g);return f.Ia.set(g,E),f.Ea.set(E,g),E})(t,e.targetId);re(gr,"remoteStoreListen mapping SDK target ID to remote",e.targetId,o);const l=new Ur(e.target,o,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ta.set(o,l),dp(t)?hp(t):Ko(t).x_()&&cp(t,l)}function up(r,e){const t=Re(r),i=Ko(t),o=Af(t,e);re(gr,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,o),t.Ta.delete(o),t.Ia.delete(e),t.Ea.delete(o),i.x_()&&j0(t,o),t.Ta.size===0&&(i.x_()?i.B_():ji(t)&&t.fa.set("Unknown"))}function cp(r,e){if(r.ga.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ke.min())>0){const t=r.Ea.get(e.targetId);if(t===void 0)return void re(gr,"SDK target ID not found for remote ID: "+e.targetId);const i=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(i)}Ko(r).H_(e)}function j0(r,e){r.ga.$e(e),Ko(r).Z_(e)}function hp(r){r.ga=new qA({getRemoteKeysForTarget:e=>{const t=r.Ea.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):Ve()},Rt:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Ko(r).start(),r.fa.aa()}function dp(r){return ji(r)&&!Ko(r).M_()&&r.Ta.size>0}function ji(r){return Re(r).Va.size===0}function F0(r){r.ga=void 0}async function Zk(r){r.fa.set("Online")}async function eC(r){r.Ta.forEach(((e,t)=>{cp(r,e)}))}async function tC(r,e){F0(r),dp(r)?(r.fa.la(e),hp(r)):r.fa.set("Unknown")}async function nC(r,e,t){if(r.fa.set("Online"),e instanceof T0&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const f of l.targetIds){if(o.Ta.has(f)){const g=o.Ea.get(f);g!==void 0&&(await o.remoteSyncer.rejectListen(g,h),o.Ia.delete(g),o.Ea.delete(f)),o.Ta.delete(f)}o.ga.removeTarget(f)}})(r,e)}catch(i){re(gr,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await Oc(r,i)}else if(e instanceof fc?r.ga.Xe(e):e instanceof E0?r.ga.it(e):r.ga.tt(e),!t.isEqual(ke.min()))try{const i=await V0(r.localStore);t.compareTo(i)>=0&&await(function(l,h){const f=l.ga.Pt(h);f.targetChanges.forEach(((_,E)=>{if(_.resumeToken.approximateByteSize()>0){const I=l.Ta.get(E);I&&l.Ta.set(E,I.withResumeToken(_.resumeToken,h))}})),f.targetMismatches.forEach(((_,E)=>{const I=l.Ta.get(_);if(!I)return;l.Ta.set(_,I.withResumeToken(Ft.EMPTY_BYTE_STRING,I.snapshotVersion)),j0(l,_);const A=new Ur(I.target,_,E,I.sequenceNumber);cp(l,A)}));const g=(function(E,I){const A=new Map;I.targetChanges.forEach(((W,K)=>{const $=E.Ea.get(K);$!==void 0&&A.set($,W)}));let j=new nt(De);return I.targetMismatches.forEach(((W,K)=>{const $=E.Ea.get(W);$!==void 0&&(j=j.insert($,K))})),new kl(I.snapshotVersion,A,j,I.documentUpdates,I.resolvedLimboDocuments)})(l,f);return l.remoteSyncer.applyRemoteEvent(g)})(r,t)}catch(i){re(gr,"Failed to raise snapshot:",i),await Oc(r,i)}}async function Oc(r,e,t){if(!qo(e))throw e;r.Va.add(1),await Rl(r),r.fa.set("Offline"),t||(t=()=>V0(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{re(gr,"Retrying IndexedDB access"),await t(),r.Va.delete(1),await ah(r)}))}function U0(r,e){return e().catch((t=>Oc(r,t,e)))}async function lh(r){const e=Re(r),t=qs(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Gf;for(;rC(e);)try{const o=await Mk(e.localStore,i);if(o===null){e.Pa.length===0&&t.B_();break}i=o.batchId,sC(e,o)}catch(o){await Oc(e,o)}z0(e)&&B0(e)}function rC(r){return ji(r)&&r.Pa.length<10}function sC(r,e){r.Pa.push(e);const t=qs(r);t.x_()&&t.X_&&t.Y_(e.mutations)}function z0(r){return ji(r)&&!qs(r).M_()&&r.Pa.length>0}function B0(r){qs(r).start()}async function iC(r){qs(r).na()}async function oC(r){const e=qs(r);for(const t of r.Pa)e.Y_(t.mutations)}async function aC(r,e,t){const i=r.Pa.shift(),o=np.from(i,e,t);await U0(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await lh(r)}async function lC(r,e){e&&qs(r).X_&&await(async function(i,o){if((function(h){return BA(h)&&h!==q.ABORTED})(o.code)){const l=i.Pa.shift();qs(i).N_(),await U0(i,(()=>i.remoteSyncer.rejectFailedWrite(l.batchId,o))),await lh(i)}})(r,e),z0(r)&&B0(r)}async function l_(r,e){const t=Re(r);t.asyncQueue.verifyOperationInProgress(),re(gr,"RemoteStore received new credentials");const i=ji(t);t.Va.add(3),await Rl(t),i&&t.fa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Va.delete(3),await ah(t)}async function uC(r,e){const t=Re(r);e?(t.Va.delete(2),await ah(t)):e||(t.Va.add(2),await Rl(t),t.fa.set("Unknown"))}function Ko(r){return r.pa||(r.pa=(function(t,i,o){const l=Re(t);return l.ia(),new Wk(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:Zk.bind(null,r),Xo:eC.bind(null,r),e_:tC.bind(null,r),J_:nC.bind(null,r)}),r.da.push((async e=>{e?(r.pa.N_(),dp(r)?hp(r):r.fa.set("Unknown")):(await r.pa.stop(),F0(r))}))),r.pa}function qs(r){return r.ya||(r.ya=(function(t,i,o){const l=Re(t);return l.ia(),new Kk(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:()=>Promise.resolve(),Xo:iC.bind(null,r),e_:lC.bind(null,r),ea:oC.bind(null,r),ta:aC.bind(null,r)}),r.da.push((async e=>{e?(r.ya.N_(),await lh(r)):(await r.ya.stop(),r.Pa.length>0&&(re(gr,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ya}/**
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
 */class fp{constructor(e,t,i,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=o,this.removalCallback=l,this.deferred=new $r,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,o,l){const h=Date.now()+i,f=new fp(e,t,h,o,l);return f.start(i),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ie(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function pp(r,e){if(Kr("AsyncQueue",`${e}: ${r}`),qo(r))return new ie(q.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class Vo{static emptySet(e){return new Vo(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||_e.comparator(t.key,i.key):(t,i)=>_e.comparator(t.key,i.key),this.keyedMap=Ka(),this.sortedSet=new nt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Vo)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new Vo;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
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
 */class u_{constructor(){this.wa=new nt(_e.comparator)}track(e){const t=e.doc.key,i=this.wa.get(t);i?e.type!==0&&i.type===3?this.wa=this.wa.insert(t,e):e.type===3&&i.type!==1?this.wa=this.wa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.wa=this.wa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.wa=this.wa.remove(t):e.type===1&&i.type===2?this.wa=this.wa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):xe(63341,{At:e,Sa:i}):this.wa=this.wa.insert(t,e)}ba(){const e=[];return this.wa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Uo{constructor(e,t,i,o,l,h,f,g,_){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,i,o,l){const h=[];return t.forEach((f=>{h.push({type:0,doc:f})})),new Uo(e,t,Vo.emptySet(t),h,i,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&th(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==i[o].type||!t[o].doc.isEqual(i[o].doc))return!1;return!0}}/**
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
 */class cC{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((e=>e.Fa()))}}class hC{constructor(){this.queries=c_(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(t,i){const o=Re(t),l=o.queries;o.queries=c_(),l.forEach(((h,f)=>{for(const g of f.Ca)g.onError(i)}))})(this,new ie(q.ABORTED,"Firestore shutting down"))}}function c_(){return new Mi((r=>u0(r)),th)}async function mp(r,e){const t=Re(r);let i=3;const o=e.query;let l=t.queries.get(o);l?!l.va()&&e.Fa()&&(i=2):(l=new cC,i=e.Fa()?0:1);try{switch(i){case 0:l.Da=await t.onListen(o,!0);break;case 1:l.Da=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const f=pp(h,`Initialization of query '${ko(e.query)}' failed`);return void e.onError(f)}t.queries.set(o,l),l.Ca.push(e),e.xa(t.onlineState),l.Da&&e.Oa(l.Da)&&yp(t)}async function gp(r,e){const t=Re(r),i=e.query;let o=3;const l=t.queries.get(i);if(l){const h=l.Ca.indexOf(e);h>=0&&(l.Ca.splice(h,1),l.Ca.length===0?o=e.Fa()?0:1:!l.va()&&e.Fa()&&(o=2))}switch(o){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function dC(r,e){const t=Re(r);let i=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const f of h.Ca)f.Oa(o)&&(i=!0);h.Da=o}}i&&yp(t)}function fC(r,e,t){const i=Re(r),o=i.queries.get(e);if(o)for(const l of o.Ca)l.onError(t);i.queries.delete(e)}function yp(r){r.Ma.forEach((e=>{e.next()}))}var kf,h_;(h_=kf||(kf={})).Na="default",h_.Cache="cache";class _p{constructor(e,t,i){this.query=e,this.Ba=t,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=i||{}}Oa(e){if(!this.options.includeMetadataChanges){const i=[];for(const o of e.docChanges)o.type!==3&&i.push(o);e=new Uo(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.La?this.qa(e)&&(this.Ba.next(e),t=!0):this.Ka(e,this.onlineState)&&(this.Ua(e),t=!0),this.ka=e,t}onError(e){this.Ba.error(e)}xa(e){this.onlineState=e;let t=!1;return this.ka&&!this.La&&this.Ka(this.ka,e)&&(this.Ua(this.ka),t=!0),t}Ka(e,t){if(!e.fromCache||!this.Fa())return!0;const i=t!=="Offline";return(!this.options.$a||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.ka&&this.ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Ua(e){e=Uo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.La=!0,this.Ba.next(e)}Fa(){return this.options.source!==kf.Cache}}/**
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
 */class $0{constructor(e){this.key=e}}class H0{constructor(e){this.key=e}}class pC{constructor(e,t){this.query=e,this.eu=t,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=Ve(),this.mutatedKeys=Ve(),this.ru=c0(e),this.iu=new Vo(this.ru)}get su(){return this.eu}ou(e,t){const i=t?t._u:new u_,o=t?t.iu:this.iu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,f=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((E,I)=>{const A=o.get(E),j=nh(this.query,I)?I:null,W=!!A&&this.mutatedKeys.has(A.key),K=!!j&&(j.hasLocalMutations||this.mutatedKeys.has(j.key)&&j.hasCommittedMutations);let $=!1;A&&j?A.data.isEqual(j.data)?W!==K&&(i.track({type:3,doc:j}),$=!0):this.au(A,j)||(i.track({type:2,doc:j}),$=!0,(g&&this.ru(j,g)>0||_&&this.ru(j,_)<0)&&(f=!0)):!A&&j?(i.track({type:0,doc:j}),$=!0):A&&!j&&(i.track({type:1,doc:A}),$=!0,(g||_)&&(f=!0)),$&&(j?(h=h.add(j),l=K?l.add(E):l.delete(E)):(h=h.delete(E),l=l.delete(E)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const E=this.query.limitType==="F"?h.last():h.first();h=h.delete(E.key),l=l.delete(E.key),i.track({type:1,doc:E})}return{iu:h,_u:i,Ss:f,mutatedKeys:l}}au(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,o){const l=this.iu;this.iu=e.iu,this.mutatedKeys=e.mutatedKeys;const h=e._u.ba();h.sort(((E,I)=>(function(j,W){const K=$=>{switch($){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return xe(20277,{At:$})}};return K(j)-K(W)})(E.type,I.type)||this.ru(E.doc,I.doc))),this.uu(i),o=o??!1;const f=t&&!o?this.cu():[],g=this.nu.size===0&&this.current&&!o?1:0,_=g!==this.tu;return this.tu=g,h.length!==0||_?{snapshot:new Uo(this.query,e.iu,l,h,e.mutatedKeys,g===0,_,!1,!!i&&i.resumeToken.approximateByteSize()>0),lu:f}:{lu:f}}xa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new u_,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(e){return!this.eu.has(e)&&!!this.iu.has(e)&&!this.iu.get(e).hasLocalMutations}uu(e){e&&(e.addedDocuments.forEach((t=>this.eu=this.eu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.eu=this.eu.delete(t))),this.current=e.current)}cu(){if(!this.current)return[];const e=this.nu;this.nu=Ve(),this.iu.forEach((i=>{this.hu(i.key)&&(this.nu=this.nu.add(i.key))}));const t=[];return e.forEach((i=>{this.nu.has(i)||t.push(new H0(i))})),this.nu.forEach((i=>{e.has(i)||t.push(new $0(i))})),t}Pu(e){this.eu=e.Ls,this.nu=Ve();const t=this.ou(e.documents);return this.applyChanges(t,!0)}Tu(){return Uo.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const vp="SyncEngine";class mC{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class gC{constructor(e){this.key=e,this.Iu=!1}}class yC{constructor(e,t,i,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.Eu={},this.Ru=new Mi((f=>u0(f)),th),this.Au=new Map,this.Vu=new Set,this.du=new nt(_e.comparator),this.mu=new Map,this.fu=new ip,this.gu={},this.pu=new Map,this.yu=Hs._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function _C(r,e,t=!0){const i=J0(r);let o;const l=i.Ru.get(e);return l?(i.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.Tu()):o=await q0(i,e,t,!0),o}async function vC(r,e){const t=J0(r);await q0(t,e,!0,!1)}async function q0(r,e,t,i){const o=await jk(r.localStore,dr(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let f;return i&&(f=await wC(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&M0(r.remoteStore,o),f}async function wC(r,e,t,i,o){r.Su=(I,A,j)=>(async function(K,$,pe,le){let ce=$.view.ou(pe);ce.Ss&&(ce=await r_(K.localStore,$.query,!1).then((({documents:k})=>$.view.ou(k,ce))));const Te=le&&le.targetChanges.get($.targetId),Ee=le&&le.targetMismatches.get($.targetId)!=null,de=$.view.applyChanges(ce,K.isPrimaryClient,Te,Ee);return f_(K,$.targetId,de.lu),de.snapshot})(r,I,A,j);const l=await r_(r.localStore,e,!0),h=new pC(e,l.Ls),f=h.ou(l.documents),g=Cl.createSynthesizedTargetChangeForCurrentChange(t,i&&r.onlineState!=="Offline",o),_=h.applyChanges(f,r.isPrimaryClient,g);f_(r,t,_.lu);const E=new mC(e,t,h);return r.Ru.set(e,E),r.Au.has(t)?r.Au.get(t).push(e):r.Au.set(t,[e]),_.snapshot}async function EC(r,e,t){const i=Re(r),o=i.Ru.get(e),l=i.Au.get(o.targetId);if(l.length>1)return i.Au.set(o.targetId,l.filter((h=>!th(h,e)))),void i.Ru.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(o.targetId),i.sharedClientState.isActiveQueryTarget(o.targetId)||await xf(i.localStore,o.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(o.targetId),t&&up(i.remoteStore,o.targetId),Cf(i,o.targetId)})).catch(Ho)):(Cf(i,o.targetId),await xf(i.localStore,o.targetId,!0))}async function TC(r,e){const t=Re(r),i=t.Ru.get(e),o=t.Au.get(i.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),up(t.remoteStore,i.targetId))}async function IC(r,e,t){const i=PC(r);try{const o=await(function(h,f){const g=Re(h),_=et.now(),E=f.reduce(((j,W)=>j.add(W.key)),Ve());let I,A;return g.persistence.runTransaction("Locally write mutations","readwrite",(j=>{let W=Gr(),K=Ve();return g.Ms.getEntries(j,E).next(($=>{W=$,W.forEach(((pe,le)=>{le.isValidDocument()||(K=K.add(pe))}))})).next((()=>g.localDocuments.getOverlayedDocuments(j,W))).next(($=>{I=$;const pe=[];for(const le of f){const ce=MA(le,I.get(le.key).overlayedDocument);ce!=null&&pe.push(new Ys(le.key,ce,t0(ce.value.mapValue),Cn.exists(!0)))}return g.mutationQueue.addMutationBatch(j,_,pe,f)})).next(($=>{A=$;const pe=$.applyToLocalDocumentSet(I,K);return g.documentOverlayCache.saveOverlays(j,$.batchId,pe)}))})).then((()=>({batchId:A.batchId,changes:d0(I)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(o.batchId),(function(h,f,g){let _=h.gu[h.currentUser.toKey()];_||(_=new nt(De)),_=_.insert(f,g),h.gu[h.currentUser.toKey()]=_})(i,o.batchId,t),await Pl(i,o.changes),await lh(i.remoteStore)}catch(o){const l=pp(o,"Failed to persist write");t.reject(l)}}async function W0(r,e){const t=Re(r);try{const i=await Ok(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.mu.get(l);h&&(ze(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.Iu=!0:o.modifiedDocuments.size>0?ze(h.Iu,14607):o.removedDocuments.size>0&&(ze(h.Iu,42227),h.Iu=!1))})),await Pl(t,i,e)}catch(i){await Ho(i)}}function d_(r,e,t){const i=Re(r);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const o=[];i.Ru.forEach(((l,h)=>{const f=h.view.xa(e);f.snapshot&&o.push(f.snapshot)})),(function(h,f){const g=Re(h);g.onlineState=f;let _=!1;g.queries.forEach(((E,I)=>{for(const A of I.Ca)A.xa(f)&&(_=!0)})),_&&yp(g)})(i.eventManager,e),o.length&&i.Eu.J_(o),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function xC(r,e,t){const i=Re(r);i.sharedClientState.updateQueryState(e,"rejected",t);const o=i.mu.get(e),l=o&&o.key;if(l){let h=new nt(_e.comparator);h=h.insert(l,Kt.newNoDocument(l,ke.min()));const f=Ve().add(l),g=new kl(ke.min(),new Map,new nt(De),h,f);await W0(i,g),i.du=i.du.remove(l),i.mu.delete(e),wp(i)}else await xf(i.localStore,e,!1).then((()=>Cf(i,e,t))).catch(Ho)}async function SC(r,e){const t=Re(r),i=e.batch.batchId;try{const o=await Vk(t.localStore,e);G0(t,i,null),K0(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await Pl(t,o)}catch(o){await Ho(o)}}async function AC(r,e,t){const i=Re(r);try{const o=await(function(h,f){const g=Re(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let E;return g.mutationQueue.lookupMutationBatch(_,f).next((I=>(ze(I!==null,37113),E=I.keys(),g.mutationQueue.removeMutationBatch(_,I)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,E,f))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,E))).next((()=>g.localDocuments.getDocuments(_,E)))}))})(i.localStore,e);G0(i,e,t),K0(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await Pl(i,o)}catch(o){await Ho(o)}}function K0(r,e){(r.pu.get(e)||[]).forEach((t=>{t.resolve()})),r.pu.delete(e)}function G0(r,e,t){const i=Re(r);let o=i.gu[i.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),i.gu[i.currentUser.toKey()]=o}}function Cf(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const i of r.Au.get(e))r.Ru.delete(i),t&&r.Eu.bu(i,t);r.Au.delete(e),r.isPrimaryClient&&r.fu.Qr(e).forEach((i=>{r.fu.containsKey(i)||Q0(r,i)}))}function Q0(r,e){r.Vu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(up(r.remoteStore,t),r.du=r.du.remove(e),r.mu.delete(t),wp(r))}function f_(r,e,t){for(const i of t)i instanceof $0?(r.fu.addReference(i.key,e),kC(r,i)):i instanceof H0?(re(vp,"Document no longer in limbo: "+i.key),r.fu.removeReference(i.key,e),r.fu.containsKey(i.key)||Q0(r,i.key)):xe(19791,{Du:i})}function kC(r,e){const t=e.key,i=t.path.canonicalString();r.du.get(t)||r.Vu.has(i)||(re(vp,"New document in limbo: "+t),r.Vu.add(i),wp(r))}function wp(r){for(;r.Vu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Vu.values().next().value;r.Vu.delete(e);const t=new _e(Je.fromString(e)),i=r.yu.next();r.mu.set(i,new gC(t)),r.du=r.du.insert(t,i),M0(r.remoteStore,new Ur(dr(eh(t.path)),i,"TargetPurposeLimboResolution",Yc.ce))}}async function Pl(r,e,t){const i=Re(r),o=[],l=[],h=[];i.Ru.isEmpty()||(i.Ru.forEach(((f,g)=>{h.push(i.Su(g,e,t).then((_=>{var E;if((_||t)&&i.isPrimaryClient){const I=_?!_.fromCache:(E=t==null?void 0:t.targetChanges.get(g.targetId))==null?void 0:E.current;i.sharedClientState.updateQueryState(g.targetId,I?"current":"not-current")}if(_){o.push(_);const I=ap.Is(g.targetId,_);l.push(I)}})))})),await Promise.all(h),i.Eu.J_(o),await(async function(g,_){const E=Re(g);try{await E.persistence.runTransaction("notifyLocalViewChanges","readwrite",(I=>G.forEach(_,(A=>G.forEach(A.Ps,(j=>E.persistence.referenceDelegate.addReference(I,A.targetId,j))).next((()=>G.forEach(A.Ts,(j=>E.persistence.referenceDelegate.removeReference(I,A.targetId,j)))))))))}catch(I){if(!qo(I))throw I;re(lp,"Failed to update sequence numbers: "+I)}for(const I of _){const A=I.targetId;if(!I.fromCache){const j=E.Cs.get(A),W=j.snapshotVersion,K=j.withLastLimboFreeSnapshotVersion(W);E.Cs=E.Cs.insert(A,K)}}})(i.localStore,l))}async function CC(r,e){const t=Re(r);if(!t.currentUser.isEqual(e)){re(vp,"User change. New user:",e.toKey());const i=await D0(t.localStore,e);t.currentUser=e,(function(l,h){l.pu.forEach((f=>{f.forEach((g=>{g.reject(new ie(q.CANCELLED,h))}))})),l.pu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await Pl(t,i.Os)}}function RC(r,e){const t=Re(r),i=t.mu.get(e);if(i&&i.Iu)return Ve().add(i.key);{let o=Ve();const l=t.Au.get(e);if(!l)return o;for(const h of l){const f=t.Ru.get(h);o=o.unionWith(f.view.su)}return o}}function J0(r){const e=Re(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=W0.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=RC.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=xC.bind(null,e),e.Eu.J_=dC.bind(null,e.eventManager),e.Eu.bu=fC.bind(null,e.eventManager),e}function PC(r){const e=Re(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=SC.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=AC.bind(null,e),e}class Lc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=oh(e.databaseInfo.databaseId),this.sharedClientState=this.Fu(e),this.persistence=this.Mu(e),await this.persistence.start(),this.localStore=this.xu(e),this.gcScheduler=this.Ou(e,this.localStore),this.indexBackfillerScheduler=this.Nu(e,this.localStore)}Ou(e,t){return null}Nu(e,t){return null}xu(e){return Dk(this.persistence,new Pk,e.initialUser,this.serializer)}Mu(e){return new b0(op.Ai,this.serializer)}Fu(e){return new Uk}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Lc.provider={build:()=>new Lc};class NC extends Lc{constructor(e){super(),this.cacheSizeBytes=e}Ou(e,t){ze(this.persistence.referenceDelegate instanceof Vc,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new mk(i,e.asyncQueue,t)}Mu(e){const t=this.cacheSizeBytes!==void 0?rn.withCacheSize(this.cacheSizeBytes):rn.DEFAULT;return new b0((i=>Vc.Ai(i,t)),this.serializer)}}class Rf{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>d_(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=CC.bind(null,this.syncEngine),await uC(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new hC})()}createDatastore(e){const t=oh(e.databaseInfo.databaseId),i=qk(e.databaseInfo);return Jk(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,o,l,h,f){return new Xk(i,o,l,h,f)})(this.localStore,this.datastore,e.asyncQueue,(t=>d_(this.syncEngine,t,0)),(function(){return o_.v()?new o_:new zk})())}createSyncEngine(e,t){return(function(o,l,h,f,g,_,E){const I=new yC(o,l,h,f,g,_);return E&&(I.wu=!0),I})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Re(o);re(gr,"RemoteStore shutting down."),l.Va.add(5),await Rl(l),l.ma.shutdown(),l.fa.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Rf.provider={build:()=>new Rf};/**
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
 */class Ep{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Lu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Lu(this.observer.error,e):Kr("Uncaught Error in snapshot listener:",e.toString()))}ku(){this.muted=!0}Lu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Ws="FirestoreClient";class bC{constructor(e,t,i,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this._databaseInfo=o,this.user=Wt.UNAUTHENTICATED,this.clientId=Kf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(i,(async h=>{re(Ws,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(i,(h=>(re(Ws,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new $r;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=pp(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function tf(r,e){r.asyncQueue.verifyOperationInProgress(),re(Ws,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let i=t.initialUser;r.setCredentialChangeListener((async o=>{i.isEqual(o)||(await D0(e.localStore,o),i=o)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function p_(r,e){r.asyncQueue.verifyOperationInProgress();const t=await DC(r);re(Ws,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((i=>l_(e.remoteStore,i))),r.setAppCheckTokenChangeListener(((i,o)=>l_(e.remoteStore,o))),r._onlineComponents=e}async function DC(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){re(Ws,"Using user provided OfflineComponentProvider");try{await tf(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===q.FAILED_PRECONDITION||o.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;Oi("Error using user provided cache. Falling back to memory cache: "+t),await tf(r,new Lc)}}else re(Ws,"Using default OfflineComponentProvider"),await tf(r,new NC(void 0));return r._offlineComponents}async function Y0(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(re(Ws,"Using user provided OnlineComponentProvider"),await p_(r,r._uninitializedComponentsProvider._online)):(re(Ws,"Using default OnlineComponentProvider"),await p_(r,new Rf))),r._onlineComponents}function VC(r){return Y0(r).then((e=>e.syncEngine))}async function Mc(r){const e=await Y0(r),t=e.eventManager;return t.onListen=_C.bind(null,e.syncEngine),t.onUnlisten=EC.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=vC.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=TC.bind(null,e.syncEngine),t}function OC(r,e,t,i){const o=new Ep(i),l=new _p(e,o,t);return r.asyncQueue.enqueueAndForget((async()=>mp(await Mc(r),l))),()=>{o.ku(),r.asyncQueue.enqueueAndForget((async()=>gp(await Mc(r),l)))}}function LC(r,e,t={}){const i=new $r;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const E=new Ep({next:A=>{E.ku(),h.enqueueAndForget((()=>gp(l,I)));const j=A.docs.has(f);!j&&A.fromCache?_.reject(new ie(q.UNAVAILABLE,"Failed to get document because the client is offline.")):j&&A.fromCache&&g&&g.source==="server"?_.reject(new ie(q.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(A)},error:A=>_.reject(A)}),I=new _p(eh(f.path),E,{includeMetadataChanges:!0,$a:!0});return mp(l,I)})(await Mc(r),r.asyncQueue,e,t,i))),i.promise}function MC(r,e,t={}){const i=new $r;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const E=new Ep({next:A=>{E.ku(),h.enqueueAndForget((()=>gp(l,I))),A.fromCache&&g.source==="server"?_.reject(new ie(q.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):_.resolve(A)},error:A=>_.reject(A)}),I=new _p(f,E,{includeMetadataChanges:!0,$a:!0});return mp(l,I)})(await Mc(r),r.asyncQueue,e,t,i))),i.promise}function jC(r,e){const t=new $r;return r.asyncQueue.enqueueAndForget((async()=>IC(await VC(r),e,t))),t.promise}/**
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
 */function X0(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const FC="ComponentProvider",m_=new Map;function UC(r,e,t,i,o){return new sA(r,e,t,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,X0(o.experimentalLongPollingOptions),o.useFetchStreams,o.isUsingEmulator,i)}/**
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
 */const Z0="firestore.googleapis.com",g_=!0;class y_{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new ie(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Z0,this.ssl=g_}else this.host=e.host,this.ssl=e.ssl??g_;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=N0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<fk)throw new ie(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}KS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=X0(e.experimentalLongPollingOptions??{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new ie(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new ie(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new ie(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,o){return i.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class uh{constructor(e,t,i,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new y_({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ie(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ie(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new y_(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new MS;switch(i.type){case"firstParty":return new zS(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new ie(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=m_.get(t);i&&(re(FC,"Removing Datastore"),m_.delete(t),i.terminate())})(this),Promise.resolve()}}function zC(r,e,t,i={}){var _;r=on(r,uh);const o=wl(e),l=r._getSettings(),h={...l,emulatorOptions:r._getEmulatorOptions()},f=`${e}:${t}`;o&&K_(`https://${f}`),l.host!==Z0&&l.host!==f&&Oi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const g={...l,host:f,ssl:o,emulatorOptions:i};if(!Pi(g,h)&&(r._setSettings(g),i.mockUserToken)){let E,I;if(typeof i.mockUserToken=="string")E=i.mockUserToken,I=Wt.MOCK_USER;else{E=qT(i.mockUserToken,(_=r._app)==null?void 0:_.options.projectId);const A=i.mockUserToken.sub||i.mockUserToken.user_id;if(!A)throw new ie(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");I=new Wt(A)}r._authCredentials=new jS(new Bv(E,I))}}/**
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
 */class Xr{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Xr(this.firestore,e,this._query)}}class ut{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new js(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ut(this.firestore,e,this._key)}toJSON(){return{type:ut._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(Sl(t,ut._jsonSchema))return new ut(e,i||null,new _e(Je.fromString(t.referencePath)))}}ut._jsonSchemaVersion="firestore/documentReference/1.0",ut._jsonSchema={type:Et("string",ut._jsonSchemaVersion),referencePath:Et("string")};class js extends Xr{constructor(e,t,i){super(e,t,eh(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ut(this.firestore,null,new _e(e))}withConverter(e){return new js(this.firestore,e,this._path)}}function jc(r,e,...t){if(r=pt(r),$v("collection","path",e),r instanceof uh){const i=Je.fromString(e,...t);return Py(i),new js(r,null,i)}{if(!(r instanceof ut||r instanceof js))throw new ie(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Je.fromString(e,...t));return Py(i),new js(r.firestore,null,i)}}function zr(r,e,...t){if(r=pt(r),arguments.length===1&&(e=Kf.newId()),$v("doc","path",e),r instanceof uh){const i=Je.fromString(e,...t);return Ry(i),new ut(r,null,new _e(i))}{if(!(r instanceof ut||r instanceof js))throw new ie(q.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Je.fromString(e,...t));return Ry(i),new ut(r.firestore,r instanceof js?r.converter:null,new _e(i))}}/**
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
 */const __="AsyncQueue";class v_{constructor(e=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new O0(this,"async_queue_retry"),this.cc=()=>{const i=ef();i&&re(__,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this.lc=e;const t=ef();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hc(),this.Pc(e)}enterRestrictedMode(e){if(!this.rc){this.rc=!0,this.ac=e||!1;const t=ef();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.cc)}}enqueue(e){if(this.hc(),this.rc)return new Promise((()=>{}));const t=new $r;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.nc.push(e),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(e){if(!qo(e))throw e;re(__,"Operation failed with retryable error: "+e)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(e){const t=this.lc.then((()=>(this._c=!0,e().catch((i=>{throw this.oc=i,this._c=!1,Kr("INTERNAL UNHANDLED ERROR: ",w_(i)),i})).then((i=>(this._c=!1,i))))));return this.lc=t,t}enqueueAfterDelay(e,t,i){this.hc(),this.uc.indexOf(e)>-1&&(t=0);const o=fp.createAndSchedule(this,e,t,i,(l=>this.Ic(l)));return this.sc.push(o),o}hc(){this.oc&&xe(47125,{Ec:w_(this.oc)})}verifyOperationInProgress(){}async Rc(){let e;do e=this.lc,await e;while(e!==this.lc)}Ac(e){for(const t of this.sc)if(t.timerId===e)return!0;return!1}Vc(e){return this.Rc().then((()=>{this.sc.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.sc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Rc()}))}dc(e){this.uc.push(e)}Ic(e){const t=this.sc.indexOf(e);this.sc.splice(t,1)}}function w_(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class Qr extends uh{constructor(e,t,i,o){super(e,t,i,o),this.type="firestore",this._queue=new v_,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new v_(e),this._firestoreClient=void 0,await e}}}function BC(r,e){const t=typeof r=="object"?r:Y_(),i=typeof r=="string"?r:Ac,o=Of(t,"firestore").getImmediate({identifier:i});if(!o._initialized){const l=$T("firestore");l&&zC(o,...l)}return o}function ch(r){if(r._terminated)throw new ie(q.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||$C(r),r._firestoreClient}function $C(r){var i,o,l,h;const e=r._freezeSettings(),t=UC(r._databaseId,((i=r._app)==null?void 0:i.options.appId)||"",r._persistenceKey,(o=r._app)==null?void 0:o.options.apiKey,e);r._componentsProvider||(l=e.localCache)!=null&&l._offlineComponentProvider&&((h=e.localCache)!=null&&h._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new bC(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(g){const _=g==null?void 0:g._online.build();return{_offline:g==null?void 0:g._offline.build(_),_online:_}})(r._componentsProvider))}/**
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
 */class kn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new kn(Ft.fromBase64String(e))}catch(t){throw new ie(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new kn(Ft.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:kn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Sl(e,kn._jsonSchema))return kn.fromBase64String(e.bytes)}}kn._jsonSchemaVersion="firestore/bytes/1.0",kn._jsonSchema={type:Et("string",kn._jsonSchemaVersion),bytes:Et("string")};/**
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
 */class Tp{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ie(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new jt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class hh{constructor(e){this._methodName=e}}/**
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
 */class pr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ie(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ie(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return De(this._lat,e._lat)||De(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:pr._jsonSchemaVersion}}static fromJSON(e){if(Sl(e,pr._jsonSchema))return new pr(e.latitude,e.longitude)}}pr._jsonSchemaVersion="firestore/geoPoint/1.0",pr._jsonSchema={type:Et("string",pr._jsonSchemaVersion),latitude:Et("number"),longitude:Et("number")};/**
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
 */class Bn{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,o){if(i.length!==o.length)return!1;for(let l=0;l<i.length;++l)if(i[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Bn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Sl(e,Bn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Bn(e.vectorValues);throw new ie(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Bn._jsonSchemaVersion="firestore/vectorValue/1.0",Bn._jsonSchema={type:Et("string",Bn._jsonSchemaVersion),vectorValues:Et("object")};/**
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
 */const HC=/^__.*__$/;class qC{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new Ys(e,this.data,this.fieldMask,t,this.fieldTransforms):new Al(e,this.data,t,this.fieldTransforms)}}class ew{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return new Ys(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function tw(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw xe(40011,{dataSource:r})}}class Ip{constructor(e,t,i,o,l,h){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=o,l===void 0&&this.mc(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Ip({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.yc(e),i}wc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.mc(),i}Sc(e){return this.i({path:void 0,arrayElement:!0})}bc(e){return Fc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}mc(){if(this.path)for(let e=0;e<this.path.length;e++)this.yc(this.path.get(e))}yc(e){if(e.length===0)throw this.bc("Document fields must not be empty");if(tw(this.dataSource)&&HC.test(e))throw this.bc('Document fields cannot begin and end with "__"')}}class WC{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||oh(e)}V(e,t,i,o=!1){return new Ip({dataSource:e,methodName:t,targetDoc:i,path:jt.emptyPath(),arrayElement:!1,hasConverter:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function dh(r){const e=r._freezeSettings(),t=oh(r._databaseId);return new WC(r._databaseId,!!e.ignoreUndefinedProperties,t)}function nw(r,e,t,i,o,l={}){const h=r.V(l.merge||l.mergeFields?2:0,e,t,o);Sp("Data must be an object, but it was:",h,i);const f=rw(i,h);let g,_;if(l.merge)g=new yn(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const E=[];for(const I of l.mergeFields){const A=Li(e,I,t);if(!h.contains(A))throw new ie(q.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);ow(E,A)||E.push(A)}g=new yn(E),_=h.fieldTransforms.filter((I=>g.covers(I.field)))}else g=null,_=h.fieldTransforms;return new qC(new sn(f),g,_)}class fh extends hh{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.bc(`${this._methodName}() can only appear at the top level of your update data`):e.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof fh}}class xp extends hh{_toFieldTransform(e){return new DA(e.path,new cl)}isEqual(e){return e instanceof xp}}function KC(r,e,t,i){const o=r.V(1,e,t);Sp("Data must be an object, but it was:",o,i);const l=[],h=sn.empty();Js(i,((g,_)=>{const E=iw(e,g,t);_=pt(_);const I=o.wc(E);if(_ instanceof fh)l.push(E);else{const A=Nl(_,I);A!=null&&(l.push(E),h.set(E,A))}}));const f=new yn(l);return new ew(h,f,o.fieldTransforms)}function GC(r,e,t,i,o,l){const h=r.V(1,e,t),f=[Li(e,i,t)],g=[o];if(l.length%2!=0)throw new ie(q.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<l.length;A+=2)f.push(Li(e,l[A])),g.push(l[A+1]);const _=[],E=sn.empty();for(let A=f.length-1;A>=0;--A)if(!ow(_,f[A])){const j=f[A];let W=g[A];W=pt(W);const K=h.wc(j);if(W instanceof fh)_.push(j);else{const $=Nl(W,K);$!=null&&(_.push(j),E.set(j,$))}}const I=new yn(_);return new ew(E,I,h.fieldTransforms)}function QC(r,e,t,i=!1){return Nl(t,r.V(i?4:3,e))}function Nl(r,e){if(sw(r=pt(r)))return Sp("Unsupported field value:",e,r),rw(r,e);if(r instanceof hh)return(function(i,o){if(!tw(o.dataSource))throw o.bc(`${i._methodName}() can only be used with update() and set()`);if(!o.path)throw o.bc(`${i._methodName}() is not currently supported inside arrays`);const l=i._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.bc("Nested arrays are not supported");return(function(i,o){const l=[];let h=0;for(const f of i){let g=Nl(f,o.Sc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(i,o){if((i=pt(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return PA(o.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const l=et.fromDate(i);return{timestampValue:Dc(o.serializer,l)}}if(i instanceof et){const l=new et(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Dc(o.serializer,l)}}if(i instanceof pr)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof kn)return{bytesValue:I0(o.serializer,i._byteString)};if(i instanceof ut){const l=o.databaseId,h=i.firestore._databaseId;if(!h.isEqual(l))throw o.bc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:sp(i.firestore._databaseId||o.databaseId,i._key.path)}}if(i instanceof Bn)return(function(h,f){const g=h instanceof Bn?h.toArray():h;return{mapValue:{fields:{[Xv]:{stringValue:Zv},[kc]:{arrayValue:{values:g.map((E=>{if(typeof E!="number")throw f.bc("VectorValues must only contain numeric values.");return rh(f.serializer,E)}))}}}}}})(i,o);if(P0(i))return i._toProto(o.serializer);throw o.bc(`Unsupported field value: ${Jc(i)}`)})(r,e)}function rw(r,e){const t={};return Wv(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Js(r,((i,o)=>{const l=Nl(o,e.gc(i));l!=null&&(t[i]=l)})),{mapValue:{fields:t}}}function sw(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof et||r instanceof pr||r instanceof kn||r instanceof ut||r instanceof hh||r instanceof Bn||P0(r))}function Sp(r,e,t){if(!sw(t)||!Hv(t)){const i=Jc(t);throw i==="an object"?e.bc(r+" a custom object"):e.bc(r+" "+i)}}function Li(r,e,t){if((e=pt(e))instanceof Tp)return e._internalPath;if(typeof e=="string")return iw(r,e);throw Fc("Field path arguments must be of type string or ",r,!1,void 0,t)}const JC=new RegExp("[~\\*/\\[\\]]");function iw(r,e,t){if(e.search(JC)>=0)throw Fc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Tp(...e.split("."))._internalPath}catch{throw Fc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Fc(r,e,t,i,o){const l=i&&!i.isEmpty(),h=o!==void 0;let f=`Function ${e}() called with invalid data`;t&&(f+=" (via `toFirestore()`)"),f+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${i}`),h&&(g+=` in document ${o}`),g+=")"),new ie(q.INVALID_ARGUMENT,f+r+g)}function ow(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class YC{convertValue(e,t="none"){switch($s(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ft(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Bs(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw xe(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return Js(e,((o,l)=>{i[o]=this.convertValue(l,t)})),i}convertVectorValue(e){var i,o,l;const t=(l=(o=(i=e.fields)==null?void 0:i[kc].arrayValue)==null?void 0:o.values)==null?void 0:l.map((h=>ft(h.doubleValue)));return new Bn(t)}convertGeoPoint(e){return new pr(ft(e.latitude),ft(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=Zc(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(il(e));default:return null}}convertTimestamp(e){const t=zs(e);return new et(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=Je.fromString(e);ze(R0(i),9688,{name:e});const o=new ol(i.get(1),i.get(3)),l=new _e(i.popFirst(5));return o.isEqual(t)||Kr(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
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
 */class Ap extends YC{constructor(e){super(),this.firestore=e}convertBytes(e){return new kn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ut(this.firestore,null,t)}}function Pf(){return new xp("serverTimestamp")}const E_="@firebase/firestore",T_="4.15.0";/**
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
 */function I_(r){return(function(t,i){if(typeof t!="object"||t===null)return!1;const o=t;for(const l of i)if(l in o&&typeof o[l]=="function")return!0;return!1})(r,["next","error","complete"])}/**
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
 */class aw{constructor(e,t,i,o,l){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new ut(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new XC(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Li("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class XC extends aw{data(){return super.data()}}/**
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
 */function lw(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ie(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class kp{}class Cp extends kp{}function Rp(r,e,...t){let i=[];e instanceof kp&&i.push(e),i=i.concat(t),(function(l){const h=l.filter((g=>g instanceof Pp)).length,f=l.filter((g=>g instanceof ph)).length;if(h>1||h>0&&f>0)throw new ie(q.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const o of i)r=o._apply(r);return r}class ph extends Cp{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new ph(e,t,i)}_apply(e){const t=this._parse(e);return hw(e._query,t),new Xr(e.firestore,e.converter,vf(e._query,t))}_parse(e){const t=dh(e.firestore);return(function(l,h,f,g,_,E,I){let A;if(_.isKeyField()){if(E==="array-contains"||E==="array-contains-any")throw new ie(q.INVALID_ARGUMENT,`Invalid Query. You can't perform '${E}' queries on documentId().`);if(E==="in"||E==="not-in"){S_(I,E);const W=[];for(const K of I)W.push(x_(g,l,K));A={arrayValue:{values:W}}}else A=x_(g,l,I)}else E!=="in"&&E!=="not-in"&&E!=="array-contains-any"||S_(I,E),A=QC(f,h,I,E==="in"||E==="not-in");return wt.create(_,E,A)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function uw(r,e,t){const i=e,o=Li("where",r);return ph._create(o,i,t)}class Pp extends kp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Pp(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:$n.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const f=l.getFlattenedFilters();for(const g of f)hw(h,g),h=vf(h,g)})(e._query,t),new Xr(e.firestore,e.converter,vf(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Np extends Cp{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Np(e,t)}_apply(e){const t=(function(o,l,h){if(o.startAt!==null)throw new ie(q.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new ie(q.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ul(l,h)})(e._query,this._field,this._direction);return new Xr(e.firestore,e.converter,TA(e._query,t))}}function ZC(r,e="asc"){const t=e,i=Li("orderBy",r);return Np._create(i,t)}class bp extends Cp{constructor(e,t,i){super(),this.type=e,this._limit=t,this._limitType=i}static _create(e,t,i){return new bp(e,t,i)}_apply(e){return new Xr(e.firestore,e.converter,Rc(e._query,this._limit,this._limitType))}}function cw(r){return bp._create("limit",r,"F")}function x_(r,e,t){if(typeof(t=pt(t))=="string"){if(t==="")throw new ie(q.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!l0(e)&&t.indexOf("/")!==-1)throw new ie(q.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(Je.fromString(t));if(!_e.isDocumentKey(i))throw new ie(q.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return jy(r,new _e(i))}if(t instanceof ut)return jy(r,t._key);throw new ie(q.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Jc(t)}.`)}function S_(r,e){if(!Array.isArray(r)||r.length===0)throw new ie(q.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function hw(r,e){const t=(function(o,l){for(const h of o)for(const f of h.getFlattenedFilters())if(l.indexOf(f.op)>=0)return f.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ie(q.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ie(q.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function dw(r,e,t){let i;return i=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,i}class Qa{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ci extends aw{constructor(e,t,i,o,l,h){super(e,t,i,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new pc(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(Li("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Ci._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Ci._jsonSchemaVersion="firestore/documentSnapshot/1.0",Ci._jsonSchema={type:Et("string",Ci._jsonSchemaVersion),bundleSource:Et("string","DocumentSnapshot"),bundleName:Et("string"),bundle:Et("string")};class pc extends Ci{data(e={}){return super.data(e)}}class Ri{constructor(e,t,i,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Qa(o.hasPendingWrites,o.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new pc(this._firestore,this._userDataWriter,i.key,i,new Qa(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ie(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((f=>{const g=new pc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Qa(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>l||f.type!==3)).map((f=>{const g=new pc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Qa(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,E=-1;return f.type!==0&&(_=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),E=h.indexOf(f.doc.key)),{type:eR(f.type),doc:g,oldIndex:_,newIndex:E}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Ri._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Kf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),i.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function eR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return xe(61501,{type:r})}}/**
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
 */Ri._jsonSchemaVersion="firestore/querySnapshot/1.0",Ri._jsonSchema={type:Et("string",Ri._jsonSchemaVersion),bundleSource:Et("string","QuerySnapshot"),bundleName:Et("string"),bundle:Et("string")};/**
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
 */function fw(r){r=on(r,ut);const e=on(r.firestore,Qr),t=ch(e);return LC(t,r._key).then((i=>gw(e,r,i)))}function pw(r){r=on(r,Xr);const e=on(r.firestore,Qr),t=ch(e),i=new Ap(e);return lw(r._query),MC(t,r._query).then((o=>new Ri(e,i,r,o)))}function mw(r,e,t){r=on(r,ut);const i=on(r.firestore,Qr),o=dw(r.converter,e,t),l=dh(i);return mh(i,[nw(l,"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,Cn.none())])}function Uc(r,e,t,...i){r=on(r,ut);const o=on(r.firestore,Qr),l=dh(o);let h;return h=typeof(e=pt(e))=="string"||e instanceof Tp?GC(l,"updateDoc",r._key,e,t,i):KC(l,"updateDoc",r._key,e),mh(o,[h.toMutation(r._key,Cn.exists(!0))])}function Ja(r){return mh(on(r.firestore,Qr),[new tp(r._key,Cn.none())])}function tR(r,e){const t=on(r.firestore,Qr),i=zr(r),o=dw(r.converter,e),l=dh(r.firestore);return mh(t,[nw(l,"addDoc",i._key,o,r.converter!==null,{}).toMutation(i._key,Cn.exists(!1))]).then((()=>i))}function nR(r,...e){var _,E,I;r=pt(r);let t={includeMetadataChanges:!1,source:"default"},i=0;typeof e[i]!="object"||I_(e[i])||(t=e[i++]);const o={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(I_(e[i])){const A=e[i];e[i]=(_=A.next)==null?void 0:_.bind(A),e[i+1]=(E=A.error)==null?void 0:E.bind(A),e[i+2]=(I=A.complete)==null?void 0:I.bind(A)}let l,h,f;if(r instanceof ut)h=on(r.firestore,Qr),f=eh(r._key.path),l={next:A=>{e[i]&&e[i](gw(h,r,A))},error:e[i+1],complete:e[i+2]};else{const A=on(r,Xr);h=on(A.firestore,Qr),f=A._query;const j=new Ap(h);l={next:W=>{e[i]&&e[i](new Ri(h,j,A,W))},error:e[i+1],complete:e[i+2]},lw(r._query)}const g=ch(h);return OC(g,f,o,l)}function mh(r,e){const t=ch(r);return jC(t,e)}function gw(r,e,t){const i=t.docs.get(e._key),o=new Ap(r);return new Ci(r,o,e._key,i,new Qa(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){LS(zo),Oo(new Ni("firestore",((i,{instanceIdentifier:o,options:l})=>{const h=i.getProvider("app").getImmediate(),f=new Qr(new FS(i.getProvider("auth-internal")),new BS(h,i.getProvider("app-check-internal")),iA(h,o),h);return l={useFetchStreams:t,...l},f._setSettings(l),f}),"PUBLIC").setMultipleInstances(!0)),Ls(E_,T_,e),Ls(E_,T_,"esm2020")})();const rR={apiKey:"AIzaSyD05YrLl8ll974Yvh_m9VjLiiYyhpf6FBw",authDomain:"p-chats-26652.firebaseapp.com",projectId:"p-chats-26652",storageBucket:"p-chats-26652.appspot.com",messagingSenderId:"277447074008",appId:"1:277447074008:web:da2e5b56682e43161077ad"},yw=J_(rR),pl=bS(yw),An=BC(yw);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sR=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),_w=(...r)=>r.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var iR={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oR=Q.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:o="",children:l,iconNode:h,...f},g)=>Q.createElement("svg",{ref:g,...iR,width:e,height:e,stroke:r,strokeWidth:i?Number(t)*24/Number(e):t,className:_w("lucide",o),...f},[...h.map(([_,E])=>Q.createElement(_,E)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=(r,e)=>{const t=Q.forwardRef(({className:i,...o},l)=>Q.createElement(oR,{ref:l,iconNode:e,className:_w(`lucide-${sR(r)}`,i),...o}));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vw=rt("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aR=rt("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lR=rt("CircleMinus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ml=rt("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gl=rt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uR=rt("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mc=rt("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=rt("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A_=rt("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cR=rt("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yr=rt("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hR=rt("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ww=rt("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zc=rt("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dR=rt("Paperclip",[["path",{d:"M13.234 20.252 21 12.3",key:"1cbrk9"}],["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",key:"1pkts6"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fR=rt("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pR=rt("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mR=rt("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k_=rt("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gR=rt("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yR=rt("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ew=rt("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _R=rt("Undo2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C_=rt("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);function vR({onRegister:r}){const[e,t]=Q.useState(""),[i,o]=Q.useState(""),[l,h]=Q.useState(!1),[f,g]=Q.useState(!1),_=async()=>{h(!0);try{await zx(pl,new Mr)}catch(I){Qe.error(I.message||"Google 登入失敗")}finally{h(!1)}},E=async I=>{if(I.preventDefault(),!e||!i){Qe.error("請填寫電子郵件和密碼");return}h(!0);try{await mx(pl,e,i)}catch(A){Qe.error(A.message||"登入失敗")}finally{h(!1)}};return w.jsx("div",{className:"min-h-full flex items-center justify-center bg-gray-950 px-4 py-8",children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-8",children:[w.jsxs("div",{className:"text-center mb-8",children:[w.jsx("div",{className:"inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 rounded-full mb-3",children:w.jsx(Fs,{className:"w-10 h-10 text-orange-500"})}),w.jsx("h1",{className:"text-2xl font-bold text-white",children:"P Chats"}),w.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"端到端加密 · 訊息不存伺服器 · 閱後即焚"})]}),w.jsxs("button",{onClick:_,disabled:l,className:"w-full flex items-center justify-center gap-3 border border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50 mb-5",children:[w.jsxs("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",children:[w.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),w.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),w.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),w.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]}),"使用 Google 帳號登入"]}),w.jsxs("div",{className:"relative mb-5",children:[w.jsx("div",{className:"absolute inset-0 flex items-center",children:w.jsx("div",{className:"w-full border-t border-gray-800"})}),w.jsx("div",{className:"relative flex justify-center text-xs",children:w.jsx("span",{className:"px-3 bg-gray-900 text-gray-500",children:"或使用帳號密碼"})})]}),w.jsxs("form",{onSubmit:E,className:"space-y-3",children:[w.jsxs("div",{className:"relative",children:[w.jsx(ww,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:"email",placeholder:"電子郵件",value:e,onChange:I=>t(I.target.value),className:"w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"})]}),w.jsxs("div",{className:"relative",children:[w.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:f?"text":"password",placeholder:"密碼",value:i,onChange:I=>o(I.target.value),className:"w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"}),w.jsx("button",{type:"button",onClick:()=>g(!f),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300",children:f?w.jsx(ml,{className:"w-4 h-4"}):w.jsx(gl,{className:"w-4 h-4"})})]}),w.jsx("button",{type:"submit",disabled:l,className:"w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center",children:l?w.jsx("span",{className:"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"}):"登入"})]}),w.jsxs("p",{className:"text-center text-sm text-gray-500 mt-4",children:["還沒有帳號？"," ",w.jsx("button",{onClick:r,className:"text-orange-500 font-medium hover:underline",children:"點此註冊"})]})]})})}function wR({onBack:r}){const[e,t]=Q.useState(""),[i,o]=Q.useState(""),[l,h]=Q.useState(""),[f,g]=Q.useState(""),[_,E]=Q.useState(!1),[I,A]=Q.useState(!1),j=async K=>{if(K.preventDefault(),!e||!i||!l||!f){Qe.error("請填寫所有欄位");return}if(l!==f){Qe.error("兩次輸入的密碼不一致");return}if(l.length<6){Qe.error("密碼長度至少 6 個字元");return}E(!0);try{const $=await px(pl,i,l);await Tv($.user,{displayName:e})}catch($){const pe=$.code;pe==="auth/email-already-in-use"?Qe.error("此電子郵件已被使用"):pe==="auth/invalid-email"?Qe.error("電子郵件格式不正確"):pe==="auth/weak-password"?Qe.error("密碼強度不足"):Qe.error($.message||"註冊失敗")}finally{E(!1)}},W="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";return w.jsx("div",{className:"min-h-full flex items-center justify-center bg-gray-950 px-4 py-8",children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-8",children:[w.jsxs("button",{onClick:r,className:"flex items-center gap-1 text-gray-500 hover:text-gray-300 mb-6 text-sm transition-colors",children:[w.jsx(vw,{className:"w-4 h-4"})," 返回登入"]}),w.jsxs("div",{className:"text-center mb-7",children:[w.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-3",children:w.jsx(C_,{className:"w-8 h-8 text-orange-500"})}),w.jsx("h1",{className:"text-xl font-bold text-white",children:"建立帳號"})]}),w.jsxs("form",{onSubmit:j,className:"space-y-3",children:[w.jsxs("div",{className:"relative",children:[w.jsx(C_,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:"text",placeholder:"顯示名稱",value:e,onChange:K=>t(K.target.value),className:W})]}),w.jsxs("div",{className:"relative",children:[w.jsx(ww,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:"email",placeholder:"電子郵件",value:i,onChange:K=>o(K.target.value),className:W})]}),w.jsxs("div",{className:"relative",children:[w.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:I?"text":"password",placeholder:"密碼（至少 6 字元）",value:l,onChange:K=>h(K.target.value),className:"w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"}),w.jsx("button",{type:"button",onClick:()=>A(!I),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300",children:I?w.jsx(ml,{className:"w-4 h-4"}):w.jsx(gl,{className:"w-4 h-4"})})]}),w.jsxs("div",{className:"relative",children:[w.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:I?"text":"password",placeholder:"確認密碼",value:f,onChange:K=>g(K.target.value),className:W})]}),w.jsx("button",{type:"submit",disabled:_,className:"w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center mt-1",children:_?w.jsx("span",{className:"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"}):"建立帳號"})]})]})})}const tc=r=>btoa(String.fromCharCode(...new Uint8Array(r instanceof ArrayBuffer?r:r.buffer,r.byteOffset,r.byteLength))),nc=r=>Uint8Array.from(atob(r),e=>e.charCodeAt(0));class ER{constructor(){Wu(this,"keyPair",null);Wu(this,"_publicKeyBase64","");Wu(this,"sharedSecrets",new Map)}async generateKeyPair(){this.keyPair=await crypto.subtle.generateKey({name:"X25519"},!0,["deriveKey"]);const e=await crypto.subtle.exportKey("raw",this.keyPair.publicKey);this._publicKeyBase64=tc(e)}get publicKeyBase64(){return this._publicKeyBase64}async getSharedSecret(e,t){const i=this.sharedSecrets.get(e);if(i)return i;const o=await crypto.subtle.importKey("raw",nc(t),{name:"X25519"},!1,[]),l=await crypto.subtle.deriveKey({name:"X25519",public:o},this.keyPair.privateKey,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"]);return this.sharedSecrets.set(e,l),l}async encrypt(e,t){const i=crypto.getRandomValues(new Uint8Array(12)),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:i,tagLength:128},t,new TextEncoder().encode(e)),l=new Uint8Array(o),h=l.slice(0,l.length-16),f=l.slice(l.length-16);return{ct:tc(h),nonce:tc(i),mac:tc(f)}}async decrypt(e,t){const i=nc(e.ct),o=nc(e.mac),l=new Uint8Array(i.length+o.length);l.set(i),l.set(o,i.length);const h=await crypto.subtle.decrypt({name:"AES-GCM",iv:nc(e.nonce),tagLength:128},t,l);return new TextDecoder().decode(h)}clearSharedSecret(e){this.sharedSecrets.delete(e)}}const Lr=new ER;async function Bc(r){const e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(r));return btoa(String.fromCharCode(...new Uint8Array(e)))}const $c=r=>localStorage.getItem(`pchat_lock_${r}`),Tw=(r,e)=>localStorage.setItem(`pchat_lock_${r}`,e),TR=r=>localStorage.removeItem(`pchat_lock_${r}`),Iw=location.hostname==="localhost"?"localhost":location.hostname;async function xw(){if(!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}async function Sw(r,e){try{const t=crypto.getRandomValues(new Uint8Array(32)),i=await navigator.credentials.create({publicKey:{challenge:t,rp:{id:Iw,name:"P Chats"},user:{id:new TextEncoder().encode(`${e}_${r}`),name:`pchat_${r.slice(0,8)}`,displayName:"P Chats 聊天室鎖"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"preferred"},timeout:6e4}});if(!i)return!1;const o=btoa(String.fromCharCode(...new Uint8Array(i.rawId)));return localStorage.setItem(`pchat_biometric_cred_${r}`,o),localStorage.setItem(`pchat_biometric_${r}`,"1"),!0}catch{return!1}}async function IR(r){const e=localStorage.getItem(`pchat_biometric_cred_${r}`);if(!e)return!1;try{const t=Uint8Array.from(atob(e),l=>l.charCodeAt(0)),i=crypto.getRandomValues(new Uint8Array(32));return!!await navigator.credentials.get({publicKey:{challenge:i,allowCredentials:[{type:"public-key",id:t}],userVerification:"required",rpId:Iw,timeout:6e4}})}catch{return!1}}function Aw(r){return localStorage.getItem(`pchat_biometric_${r}`)==="1"}function R_(r){localStorage.removeItem(`pchat_biometric_${r}`),localStorage.removeItem(`pchat_biometric_cred_${r}`)}function xR(r){return`${String(r.getHours()).padStart(2,"0")}:${String(r.getMinutes()).padStart(2,"0")}`}function SR(r){switch(r){case"exit":return"退出後";case"1m":return"1 分鐘";case"3m":return"3 分鐘";case"5m":return"5 分鐘";default:return""}}function AR({message:r,onLongPress:e}){const{isSentByMe:t,recalled:i,burnTimer:o,text:l,mediaUrl:h,mediaType:f,fileName:g,edited:_,isBurned:E,timestamp:I}=r,A=o!=="off";if(i)return w.jsx("div",{className:`flex mb-1 ${t?"justify-end":"justify-start"}`,children:w.jsxs("div",{className:"flex items-center gap-1.5 px-4 py-2 bg-gray-800 border border-gray-700 rounded-2xl max-w-xs",children:[w.jsx(lR,{className:"w-3.5 h-3.5 text-gray-500 flex-shrink-0"}),w.jsx("span",{className:"text-xs text-gray-500 italic",children:t?"你收回了一則訊息":"對方收回了一則訊息"})]})});const j=t?A?"bg-orange-600":"bg-blue-600":A?"bg-orange-900/60":"bg-gray-700",W=t?"rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm":"rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl";return w.jsx("div",{className:`flex mb-1 ${t?"justify-end":"justify-start"}`,children:w.jsxs("div",{className:`max-w-xs md:max-w-md ${j} ${W} ${h&&f!=="file"?"p-1":"px-3.5 py-2.5"} cursor-pointer select-none`,onContextMenu:K=>{K.preventDefault(),e==null||e()},onClick:K=>{K.detail===2&&(e==null||e())},children:[h&&f==="image"&&w.jsx("img",{src:h,alt:"圖片",className:"rounded-xl max-w-full object-cover cursor-zoom-in",style:{maxHeight:240},onClick:()=>window.open(h,"_blank")}),h&&f==="video"&&w.jsx("video",{src:h,controls:!0,className:"rounded-xl max-w-full",style:{maxHeight:240}}),h&&f==="file"&&w.jsxs("a",{href:h,target:"_blank",rel:"noreferrer",className:"flex items-center gap-2 py-1 hover:opacity-70 transition-opacity",children:[w.jsx(uR,{className:"w-7 h-7 text-orange-400 flex-shrink-0"}),w.jsx("span",{className:"text-sm text-blue-300 underline truncate max-w-[200px]",children:g||"檔案"})]}),l&&w.jsxs("div",{className:`flex items-start gap-1.5 ${h?"px-2.5 pt-1.5 pb-1":""}`,children:[A&&w.jsx(Fs,{className:"w-3.5 h-3.5 text-orange-300 flex-shrink-0 mt-0.5"}),w.jsx("p",{className:"text-sm text-white leading-relaxed whitespace-pre-wrap break-words",children:l})]}),w.jsxs("div",{className:`flex items-center gap-1.5 mt-0.5 ${h&&f!=="file"?"px-2.5 pb-1.5":""}`,children:[!l&&A&&w.jsx(Fs,{className:"w-3 h-3 text-orange-300"}),w.jsx("span",{className:"text-[10px] text-white/50",children:xR(I)}),_&&w.jsx("span",{className:"text-[10px] text-white/40",children:"已編輯"}),A&&w.jsx("span",{className:"text-[10px] text-orange-300",children:SR(o)}),E&&w.jsx("span",{className:"text-[10px] text-orange-400",children:"已焚燒"})]})]})})}const P_={off:"關閉焚燒",exit:"對方退出後","1m":"1 分鐘後","3m":"3 分鐘後","5m":"5 分鐘後"},N_={"1m":6e4,"3m":18e4,"5m":3e5};function kR(r,e){return[r,e].sort().join("_")}function CR({user:r,peer:e,onClose:t,onLock:i}){const[o,l]=Q.useState([]),[h,f]=Q.useState(""),[g,_]=Q.useState("off"),[E,I]=Q.useState(!1),[A,j]=Q.useState(!1),[W,K]=Q.useState(0),[$,pe]=Q.useState(!1),[le,ce]=Q.useState(null),[Te,Ee]=Q.useState(null),[de,k]=Q.useState(!1),x=Q.useRef(null),R=Q.useRef(null),b=Q.useRef(null),P=kR(r.uid,e.userId),O=Q.useRef(new Set);Q.useEffect(()=>{let H=!1;return(async()=>{var Z,V;try{const B=zr(An,"users",r.uid),se=await fw(B);(!se.exists()||!((Z=se.data())!=null&&Z.publicKey)||((V=se.data())==null?void 0:V.publicKey)!==Lr.publicKeyBase64)&&await mw(B,{displayName:r.displayName||r.email||"Unknown",photoURL:r.photoURL||"",publicKey:Lr.publicKeyBase64,lastSeen:Pf()},{merge:!0}),e.publicKey&&(b.current=await Lr.getSharedSecret(e.userId,e.publicKey)),H||pe(!0)}catch(B){console.error(B),H||pe(!0)}})(),()=>{H=!0}},[r,e]),Q.useEffect(()=>{if(!$)return;const H=Rp(jc(An,"chats",P,"messages"),ZC("timestamp")),ne=nR(H,async Z=>{var V;for(const B of Z.docChanges()){if(B.type==="added"){const se=B.doc.data(),me=se.from,ge=me===r.uid,ye=se.burnTimer||"off";if(se.recalled){l(ot=>{var qe;return ot.find(bt=>bt.documentId===B.doc.id)?ot:[...ot,{documentId:B.doc.id,from:me,to:se.to,text:"",timestamp:((qe=se.timestamp)==null?void 0:qe.toDate())??new Date,burnTimer:ye,isBurned:!1,isSentByMe:ge,recalled:!0,edited:!1}]}),ge||Ja(B.doc.ref).catch(()=>{});continue}let Se="",Pe,Ne,Ke;try{if(b.current&&se.ct){const ot=await Lr.decrypt({ct:se.ct,nonce:se.nonce,mac:se.mac},b.current),qe=JSON.parse(ot);Se=qe.text||"",Pe=qe.mediaUrl,Ne=qe.mediaType,Ke=qe.fileName}}catch{}const Tt={documentId:B.doc.id,from:me,to:se.to,text:Se,timestamp:((V=se.timestamp)==null?void 0:V.toDate())??new Date,burnTimer:ye,mediaUrl:Pe,mediaType:Ne,fileName:Ke,isBurned:!1,isSentByMe:ge,recalled:!1,edited:se.edited||!1};if(l(ot=>{const qe=ot.findIndex(bt=>bt.documentId===Tt.documentId);if(qe>=0){const bt=[...ot];return bt[qe]={...ot[qe],...Tt,text:Tt.text||ot[qe].text,mediaUrl:Tt.mediaUrl??ot[qe].mediaUrl,mediaType:Tt.mediaType??ot[qe].mediaType,fileName:Tt.fileName??ot[qe].fileName},bt}return[...ot,Tt]}),ye!=="off"&&ye!=="exit"&&N_[ye]){const ot=B.doc.ref,qe=B.doc.id;setTimeout(()=>{l(bt=>bt.map(Hn=>Hn.documentId===qe?{...Hn,isBurned:!0}:Hn)),setTimeout(()=>{l(bt=>bt.filter(Hn=>Hn.documentId!==qe)),ge||Ja(ot).catch(()=>{})},800)},N_[ye])}!ge&&ye==="exit"&&O.current.add(B.doc.id)}if(B.type==="modified"){const se=B.doc.data();if(se.recalled)l(me=>me.map(ge=>ge.documentId===B.doc.id?{...ge,recalled:!0}:ge)),setTimeout(()=>l(me=>me.filter(ge=>ge.documentId!==B.doc.id)),800),Ja(B.doc.ref).catch(()=>{});else if(se.edited&&!se.recalled&&b.current&&se.from!==r.uid)try{const ge=await Lr.decrypt({ct:se.ct,nonce:se.nonce,mac:se.mac},b.current),ye=JSON.parse(ge);l(Se=>Se.map(Pe=>Pe.documentId===B.doc.id?{...Pe,text:ye.text||"",edited:!0}:Pe))}catch{}}if(B.type==="removed"){const me=B.doc.data().burnTimer,ge=B.doc.id;me!=="off"?(l(ye=>ye.map(Se=>Se.documentId===ge?{...Se,isBurned:!0}:Se)),setTimeout(()=>l(ye=>ye.filter(Se=>Se.documentId!==ge)),800)):l(ye=>ye.filter(Se=>Se.documentId!==ge))}}});return()=>{ne(),O.current.forEach(Z=>{Ja(zr(An,"chats",P,"messages",Z)).catch(()=>{})})}},[$,P,r.uid,e.userId]),Q.useEffect(()=>{var H;(H=x.current)==null||H.scrollIntoView({behavior:"smooth"})},[o]);const C=Q.useCallback(async(H,ne,Z,V)=>{const B=(H??h).trim();if(!B&&!ne)return;f("");const se=JSON.stringify({text:B,mediaUrl:ne,mediaType:Z,fileName:V});let me=null;if(b.current)try{me=await Lr.encrypt(se,b.current)}catch{}const ge={from:r.uid,to:e.userId,burnTimer:g,mediaType:Z||null,fileName:V||null,recalled:!1,edited:!1,timestamp:Pf(),...me??{ct:"",nonce:"",mac:""}},ye=jc(An,"chats",P,"messages"),Se=await tR(ye,ge).catch(()=>null);if(!Se){Qe.error("發送失敗");return}const Pe={documentId:Se.id,from:r.uid,to:e.userId,text:B,mediaUrl:ne,mediaType:Z,fileName:V,timestamp:new Date,burnTimer:g,isBurned:!1,isSentByMe:!0,recalled:!1,edited:!1};l(Ne=>{const Ke=Ne.findIndex(Tt=>Tt.documentId===Se.id);if(Ke>=0){const Tt=[...Ne];return Tt[Ke]={...Ne[Ke],text:B||Ne[Ke].text,mediaUrl:ne??Ne[Ke].mediaUrl,mediaType:Z??Ne[Ke].mediaType,fileName:V??Ne[Ke].fileName},Tt}return[...Ne,Pe]})},[h,g,P,r.uid,e.userId]),$e=async H=>{ce(null),await Uc(zr(An,"chats",P,"messages",H.documentId),{recalled:!0,ct:"",nonce:"",mac:""}).catch(()=>Qe.error("收回失敗")),l(ne=>ne.map(Z=>Z.documentId===H.documentId?{...Z,recalled:!0}:Z)),setTimeout(()=>l(ne=>ne.filter(Z=>Z.documentId!==H.documentId)),800)},mt=async(H,ne)=>{if(b.current){try{const Z=await Lr.encrypt(JSON.stringify({text:ne}),b.current);await Uc(zr(An,"chats",P,"messages",H),{...Z,edited:!0}),l(V=>V.map(B=>B.documentId===H?{...B,text:ne,edited:!0}:B))}catch{Qe.error("編輯失敗")}Ee(null)}},kt=async H=>{var Z;const ne=(Z=H.target.files)==null?void 0:Z[0];if(ne){if(H.target.value="",ne.size>20*1024*1024){Qe.error("檔案不得超過 20 MB");return}j(!0),K(5);try{const V=new FormData;V.append("file",ne);const se=await fetch("http://localhost:3001/api/upload",{method:"POST",body:V});if(!se.ok)throw new Error(await se.text());K(90);const{url:me,mediaType:ge,fileName:ye}=await se.json();await C("",me,ge,ye),K(100)}catch{Qe.error("上傳失敗，請確認後端伺服器是否啟動")}finally{j(!1),K(0)}}},He=g!=="off";return w.jsxs("div",{className:"flex flex-col h-full bg-gray-950",children:[w.jsxs("div",{className:"flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900 flex-shrink-0",children:[w.jsx("button",{onClick:t,className:"text-gray-500 hover:text-gray-200 transition-colors",children:w.jsx(vw,{className:"w-5 h-5"})}),w.jsx("div",{className:"w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden",children:e.photoURL?w.jsx("img",{src:e.photoURL,alt:"",className:"w-full h-full object-cover"}):w.jsx("span",{className:"text-orange-400 font-bold text-sm",children:(e.displayName[0]||"?").toUpperCase()})}),w.jsxs("div",{className:"flex-1 min-w-0",children:[w.jsx("p",{className:"font-semibold text-white text-sm truncate",children:e.displayName}),w.jsx("p",{className:"text-[10px] text-green-400 font-medium",children:"E2E 加密"})]}),w.jsx("button",{onClick:()=>k(!0),title:"鎖定設定",className:"text-gray-500 hover:text-gray-300 transition-colors",children:w.jsx(yR,{className:"w-4 h-4"})}),w.jsx("button",{onClick:i,title:"鎖定此聊天室",className:"text-gray-500 hover:text-orange-400 transition-colors",children:w.jsx(yr,{className:"w-5 h-5"})})]}),He&&w.jsxs("div",{className:"flex items-center gap-2 px-4 py-1.5 bg-orange-950/40 border-b border-orange-900/30 flex-shrink-0",children:[w.jsx(Fs,{className:"w-3.5 h-3.5 text-orange-400"}),w.jsxs("span",{className:"text-xs text-orange-400",children:["焚燒模式 — ",P_[g],"自動銷毀"]})]}),A&&w.jsx("div",{className:"h-1 bg-gray-800 flex-shrink-0",children:w.jsx("div",{className:"h-full bg-orange-500 transition-all duration-200",style:{width:`${W||5}%`}})}),w.jsxs("div",{className:"flex-1 overflow-y-auto px-4 py-4",children:[!$&&w.jsx("div",{className:"flex justify-center py-8",children:w.jsx("div",{className:"w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"})}),$&&o.length===0&&w.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center",children:[w.jsx(yr,{className:"w-10 h-10 text-gray-700 mb-3"}),w.jsx("p",{className:"text-sm text-gray-500",children:"尚無訊息"}),w.jsx("p",{className:"text-xs text-gray-600 mt-1",children:"訊息閱後即從伺服器刪除"})]}),o.map(H=>w.jsx(AR,{message:H,onLongPress:H.isSentByMe&&!H.recalled?()=>ce(H):void 0},H.documentId)),w.jsx("div",{ref:x})]}),w.jsx("div",{className:"chat-input-bar flex-shrink-0 border-t border-gray-800 bg-gray-900 px-3 py-2",children:w.jsxs("div",{className:"flex items-center gap-2",children:[w.jsxs("div",{className:"relative",children:[w.jsxs("button",{onClick:()=>I(!E),className:"flex flex-col items-center p-1",children:[w.jsx(Fs,{className:`w-5 h-5 ${He?"text-orange-500":"text-gray-600"}`}),w.jsx("span",{className:`text-[9px] leading-none mt-0.5 ${He?"text-orange-500":"text-gray-600"}`,children:g==="off"?"關閉":g==="exit"?"退出":g})]}),E&&w.jsxs("div",{className:"absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1 min-w-[150px] z-10",children:[w.jsx("p",{className:"px-3 py-1.5 text-xs font-semibold text-gray-400 border-b border-gray-700",children:"訊息焚燒時間"}),Object.entries(P_).map(([H,ne])=>w.jsxs("button",{onClick:()=>{_(H),I(!1)},className:`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-orange-900/30 transition-colors ${g===H?"text-orange-400 font-semibold":"text-gray-300"}`,children:[w.jsx(Fs,{className:`w-3.5 h-3.5 ${g===H?"text-orange-400":"text-gray-600"}`}),ne,g===H&&w.jsx("span",{className:"ml-auto text-orange-400 text-xs",children:"✓"})]},H))]})]}),w.jsx("button",{onClick:()=>{var H;return(H=R.current)==null?void 0:H.click()},disabled:A,className:"text-gray-600 hover:text-gray-300 transition-colors p-1 disabled:opacity-40",children:w.jsx(dR,{className:"w-5 h-5"})}),w.jsx("input",{ref:R,type:"file",className:"hidden",onChange:kt}),w.jsx("input",{type:"text",placeholder:"輸入訊息（加密傳送）...",value:h,onChange:H=>f(H.target.value),onKeyDown:H=>{H.key==="Enter"&&!H.shiftKey&&(H.preventDefault(),C())},className:"flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),w.jsx("button",{onClick:()=>C(),disabled:!h.trim()&&!A,className:"w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-40",children:w.jsx(mR,{className:"w-4 h-4 text-white"})})]})}),le&&w.jsx("div",{className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60",onClick:()=>ce(null),children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-t-2xl py-2",onClick:H=>H.stopPropagation(),children:[w.jsx("div",{className:"w-10 h-1 bg-gray-600 rounded-full mx-auto mb-3"}),!le.mediaUrl&&w.jsxs("button",{onClick:()=>{Ee({id:le.documentId,text:le.text}),ce(null)},className:"w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors",children:[w.jsx(fR,{className:"w-4 h-4"})," 編輯訊息"]}),w.jsxs("button",{onClick:()=>$e(le),className:"w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 transition-colors",children:[w.jsx(_R,{className:"w-4 h-4"})," 收回訊息"]})]})}),Te&&w.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",onClick:()=>Ee(null),children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-2xl p-5",onClick:H=>H.stopPropagation(),children:[w.jsx("h3",{className:"font-semibold text-white mb-3",children:"編輯訊息"}),w.jsx("textarea",{value:Te.text,onChange:H=>Ee({...Te,text:H.target.value}),rows:3,autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"}),w.jsxs("div",{className:"flex gap-2 mt-3",children:[w.jsx("button",{onClick:()=>Ee(null),className:"flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),w.jsx("button",{onClick:()=>mt(Te.id,Te.text),className:"flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})}),de&&w.jsx(RR,{peerUid:e.userId,userId:r.uid,peerName:e.displayName,onClose:()=>k(!1),onLockAndClose:()=>{k(!1),i()}}),E&&w.jsx("div",{className:"fixed inset-0 z-0",onClick:()=>I(!1)})]})}function RR({peerUid:r,userId:e,peerName:t,onClose:i,onLockAndClose:o}){const l=!!$c(r),[h,f]=Q.useState(Aw(r)),[g,_]=Q.useState(!1),[E,I]=Q.useState("main"),[A,j]=Q.useState(""),[W,K]=Q.useState(""),[$,pe]=Q.useState(""),[le,ce]=Q.useState(!1),[Te,Ee]=Q.useState(""),[de,k]=Q.useState(!1);Q.useEffect(()=>{xw().then(_)},[]);const x=async()=>{if(h)R_(r),f(!1),Qe.success("指紋解鎖已停用");else{k(!0);const P=await Sw(r,e);k(!1),P?(f(!0),Qe.success("指紋解鎖已啟用")):Qe.error("指紋設定失敗")}},R=async()=>{if(l){if(!A){Ee("請輸入舊密碼");return}if(await Bc(A)!==$c(r)){Ee("舊密碼錯誤");return}}if(W.length<4){Ee("新密碼至少 4 個字元");return}if(W!==$){Ee("兩次密碼不一致");return}Tw(r,await Bc(W)),Qe.success("密碼已更新"),i()},b=()=>{TR(r),R_(r),Qe.success("鎖定已移除"),i()};return w.jsx("div",{className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60",onClick:i,children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-t-2xl pt-2 pb-6 px-5",onClick:P=>P.stopPropagation(),children:[w.jsx("div",{className:"w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4"}),E==="main"&&w.jsxs(w.Fragment,{children:[w.jsx("h3",{className:"font-bold text-white mb-1",children:"鎖定設定"}),w.jsxs("p",{className:"text-xs text-gray-500 mb-5",children:["與 ",t," 的聊天室"]}),g&&l&&w.jsxs("button",{onClick:x,disabled:de,className:"w-full flex items-center gap-3 py-3 border-b border-gray-700",children:[w.jsx("div",{className:`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${h?"bg-orange-500":"bg-gray-600"}`,children:w.jsx("div",{className:`w-5 h-5 bg-white rounded-full shadow transition-transform ${h?"translate-x-5":"translate-x-0"}`})}),w.jsxs("div",{className:"flex-1 text-left",children:[w.jsxs("p",{className:"text-sm text-gray-200 flex items-center gap-1.5",children:[w.jsx(mc,{className:"w-4 h-4 text-orange-400"}),"指紋解鎖"]}),w.jsx("p",{className:"text-xs text-gray-500",children:h?"已啟用":"已停用"})]}),de&&w.jsx("span",{className:"w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"})]}),w.jsxs("button",{onClick:()=>{I("changePw"),Ee("")},className:"w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left",children:[w.jsx(yr,{className:"w-5 h-5 text-orange-500 flex-shrink-0"}),w.jsxs("div",{className:"flex-1",children:[w.jsx("p",{className:"text-sm text-gray-200",children:l?"修改密碼":"設定密碼"}),w.jsx("p",{className:"text-xs text-gray-500",children:l?"更換此聊天室的解鎖密碼":"尚未設定密碼"})]})]}),l&&w.jsxs("button",{onClick:b,className:"w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left",children:[w.jsx(Ew,{className:"w-5 h-5 text-red-400 flex-shrink-0"}),w.jsxs("div",{className:"flex-1",children:[w.jsx("p",{className:"text-sm text-red-400",children:"移除鎖定"}),w.jsx("p",{className:"text-xs text-gray-500",children:"清除此聊天室的密碼與指紋設定"})]})]}),w.jsx("button",{onClick:o,className:"w-full mt-4 py-3 bg-gray-700 text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-600",children:"立即鎖定聊天室"})]}),E==="changePw"&&w.jsxs(w.Fragment,{children:[w.jsx("button",{onClick:()=>I("main"),className:"flex items-center gap-1 text-gray-500 hover:text-gray-300 mb-4 text-sm",children:"← 返回"}),w.jsx("h3",{className:"font-bold text-white mb-4",children:l?"修改密碼":"設定密碼"}),w.jsxs("div",{className:"space-y-3",children:[l&&w.jsxs("div",{className:"relative",children:[w.jsx("input",{type:le?"text":"password",placeholder:"舊密碼",value:A,onChange:P=>{j(P.target.value),Ee("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500",autoFocus:!0}),w.jsx("button",{type:"button",onClick:()=>ce(!le),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:le?w.jsx(ml,{className:"w-4 h-4"}):w.jsx(gl,{className:"w-4 h-4"})})]}),w.jsxs("div",{className:"relative",children:[w.jsx("input",{type:le?"text":"password",placeholder:"新密碼（至少 4 字元）",value:W,onChange:P=>{K(P.target.value),Ee("")},autoFocus:!l,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"}),!l&&w.jsx("button",{type:"button",onClick:()=>ce(!le),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:le?w.jsx(ml,{className:"w-4 h-4"}):w.jsx(gl,{className:"w-4 h-4"})})]}),w.jsx("input",{type:le?"text":"password",placeholder:"確認新密碼",value:$,onChange:P=>{pe(P.target.value),Ee("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),Te&&w.jsx("p",{className:"text-xs text-red-400",children:Te}),w.jsxs("div",{className:"flex gap-2 pt-1",children:[w.jsx("button",{onClick:()=>I("main"),className:"flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),w.jsx("button",{onClick:R,className:"flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})]})]})})}function PR({user:r,size:e=10}){const t=`w-${e} h-${e}`;return w.jsx("div",{className:`${t} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0`,children:r.photoURL?w.jsx("img",{src:r.photoURL,alt:"",className:"w-full h-full object-cover"}):w.jsx("span",{className:"text-orange-700 font-bold text-sm",children:(r.displayName[0]||"?").toUpperCase()})})}function kw({user:r,trailing:e,onClick:t}){return w.jsxs("div",{onClick:t,className:"flex items-center gap-3 p-4 border border-gray-700 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer",children:[w.jsx(PR,{user:r,size:10}),w.jsxs("div",{className:"flex-1 min-w-0",children:[w.jsx("p",{className:"font-semibold text-white text-sm truncate",children:r.displayName}),w.jsxs("p",{className:"text-xs text-orange-600 truncate",children:["@",r.userHandle]})]}),e]})}function NR({peerUid:r,userId:e,onUnlock:t,onCancel:i}){const o=!$c(r),l=Aw(r),[h,f]=Q.useState(""),[g,_]=Q.useState(""),[E,I]=Q.useState(!1),[A,j]=Q.useState(""),[W,K]=Q.useState(!1),[$,pe]=Q.useState(!1),[le,ce]=Q.useState(!l),[Te,Ee]=Q.useState(!1);Q.useEffect(()=>{xw().then(x=>{pe(x),x&&!o&&l&&ce(!1)})},[]);const de=async()=>{Ee(!0);const x=await IR(r);Ee(!1),x?t():(j("指紋驗證失敗，請改用密碼"),ce(!0))},k=async x=>{if(x.preventDefault(),o){if(h.length<4){j("密碼至少 4 個字元");return}if(h!==g){j("兩次密碼不一致");return}Tw(r,await Bc(h)),W&&$&&(await Sw(r,e)||Qe.error("指紋設定失敗，仍可使用密碼解鎖")),t()}else{if(await Bc(h)!==$c(r)){j("密碼錯誤");return}t()}};return w.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",children:w.jsxs("div",{className:"w-full max-w-xs bg-gray-800 rounded-2xl p-6",children:[w.jsxs("div",{className:"text-center mb-5",children:[w.jsx("div",{className:"inline-flex items-center justify-center w-14 h-14 bg-orange-500/10 rounded-full mb-3",children:l&&!o?w.jsx(mc,{className:"w-7 h-7 text-orange-500"}):w.jsx(yr,{className:"w-7 h-7 text-orange-500"})}),w.jsx("h2",{className:"font-bold text-white",children:o?"設定此聊天室密碼":"解鎖聊天室"}),w.jsx("p",{className:"text-xs text-gray-400 mt-1",children:o?"此聊天室可設定獨立密碼":"此聊天室已啟用獨立鎖定"})]}),!o&&l&&!le&&w.jsxs("div",{className:"flex flex-col items-center gap-3 mb-4",children:[w.jsx("button",{type:"button",onClick:de,disabled:Te,className:"w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center hover:bg-orange-500/20 transition-colors disabled:opacity-50",children:Te?w.jsx("span",{className:"w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"}):w.jsx(mc,{className:"w-10 h-10 text-orange-400"})}),w.jsx("p",{className:"text-sm text-gray-400",children:"觸碰以進行指紋驗證"}),w.jsx("button",{type:"button",onClick:()=>{ce(!0),j("")},className:"text-xs text-gray-500 hover:text-gray-300 underline",children:"改用密碼"})]}),(o||!l||le)&&w.jsxs("form",{onSubmit:k,className:"space-y-3",children:[w.jsxs("div",{className:"relative",children:[w.jsx("input",{type:E?"text":"password",placeholder:o?"設定密碼（至少 4 字元）":"輸入密碼",value:h,onChange:x=>{f(x.target.value),j("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"}),w.jsx("button",{type:"button",onClick:()=>I(!E),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:E?w.jsx(ml,{className:"w-4 h-4"}):w.jsx(gl,{className:"w-4 h-4"})})]}),o&&w.jsx("input",{type:E?"text":"password",placeholder:"確認密碼",value:g,onChange:x=>{_(x.target.value),j("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),o&&$&&w.jsxs("button",{type:"button",onClick:()=>K(!W),className:"w-full flex items-center gap-3 px-1 py-1",children:[w.jsx("div",{className:`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${W?"bg-orange-500":"bg-gray-600"}`,children:w.jsx("div",{className:`w-5 h-5 bg-white rounded-full shadow transition-transform ${W?"translate-x-5":"translate-x-0"}`})}),w.jsxs("span",{className:"text-sm text-gray-300 flex items-center gap-1.5",children:[w.jsx(mc,{className:"w-4 h-4 text-orange-400"}),"同時啟用指紋解鎖"]})]}),A&&w.jsx("p",{className:"text-xs text-red-400",children:A}),w.jsxs("div",{className:"flex gap-2 pt-1",children:[w.jsx("button",{type:"button",onClick:i,className:"flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),w.jsx("button",{type:"submit",className:"flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:o?"設定":"解鎖"})]})]}),!o&&l&&!le&&w.jsx("button",{type:"button",onClick:i,className:"w-full mt-3 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"})]})})}function bR({user:r}){const[e,t]=Q.useState("home"),[i,o]=Q.useState(null),[l,h]=Q.useState(!1),[f,g]=Q.useState(null),[_,E]=Q.useState(new Set),[I,A]=Q.useState(()=>{try{const k=localStorage.getItem(`pchat_recent_${r.uid}`);return k?JSON.parse(k):[]}catch{return[]}}),[j,W]=Q.useState(null),[K,$]=Q.useState(r.displayName||""),pe=Q.useRef(!1);Q.useEffect(()=>{if(pe.current)return;pe.current=!0,(async()=>{await Lr.generateKeyPair();const x=await le(r);W(x)})()},[r]);const le=async k=>{const x=zr(An,"users",k.uid),b=(await fw(x)).data();let P=b==null?void 0:b.userHandle;return P||(P=`u_${k.uid.replace(/[^a-z0-9]/g,"").substring(0,8)}`),await mw(x,{displayName:k.displayName||k.email||"Unknown",photoURL:k.photoURL||"",publicKey:Lr.publicKeyBase64,userHandle:P,lastSeen:Pf()},{merge:!0}),P},ce=k=>{if(!_.has(k.userId)){g(k),h(!0);return}de(k),o(k)},Te=()=>{h(!1),f&&(E(k=>new Set([...k,f.userId])),de(f),o(f),g(null))},Ee=()=>{i&&E(k=>{const x=new Set(k);return x.delete(i.userId),x}),o(null)},de=k=>{A(x=>{const R=[k,...x.filter(b=>b.userId!==k.userId)].slice(0,50);try{localStorage.setItem(`pchat_recent_${r.uid}`,JSON.stringify(R))}catch{}return R})};return i?w.jsx("div",{className:"h-full",children:w.jsx(CR,{user:r,peer:i,onClose:()=>o(null),onLock:Ee})}):w.jsxs("div",{className:"flex h-full",children:[w.jsxs("div",{className:"max-[480px]:hidden flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 w-16 sm:w-52 transition-all",children:[w.jsxs("div",{className:"flex items-center gap-2.5 px-4 py-5 border-b border-gray-800",children:[w.jsx(Fs,{className:"w-7 h-7 text-orange-500 flex-shrink-0"}),w.jsx("span",{className:"hidden sm:block text-lg font-bold text-white truncate",children:"P Chats"})]}),w.jsx("nav",{className:"flex-1 py-3 space-y-1 px-2",children:[{key:"home",label:"首頁",Icon:A_},{key:"messages",label:"訊息",Icon:zc},{key:"settings",label:"設定",Icon:k_}].map(({key:k,label:x,Icon:R})=>w.jsxs("button",{onClick:()=>t(k),className:`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                ${e===k?"bg-orange-500/10 text-orange-400":"text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,children:[w.jsx(R,{className:"w-5 h-5 flex-shrink-0"}),w.jsx("span",{className:"hidden sm:block text-sm font-medium",children:x})]},k))}),w.jsx("div",{className:"px-3 pb-4 hidden sm:block",children:w.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-2 bg-orange-950/30 rounded-xl",children:[w.jsx(yr,{className:"w-3 h-3 text-orange-400 flex-shrink-0"}),w.jsx("span",{className:"text-[10px] text-orange-400 leading-tight",children:"E2E 加密保護"})]})})]}),w.jsxs("div",{className:"flex-1 overflow-hidden max-[480px]:pb-16",children:[e==="home"&&w.jsx(DR,{user:r,myHandle:j,onOpenChat:ce}),e==="messages"&&w.jsx(VR,{recentChats:I,onOpenChat:ce}),e==="settings"&&w.jsx(OR,{user:r,myHandle:j,myDisplayName:K,onHandleUpdate:W,onDisplayNameUpdate:$})]}),w.jsx("nav",{className:`hidden max-[480px]:flex fixed bottom-0 left-0 right-0 z-20
        bg-gray-900 border-t border-gray-800 items-center justify-around
        px-2 py-1 safe-pb`,children:[{key:"home",label:"首頁",Icon:A_},{key:"messages",label:"訊息",Icon:zc},{key:"settings",label:"設定",Icon:k_}].map(({key:k,label:x,Icon:R})=>w.jsxs("button",{onClick:()=>t(k),className:`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors
              ${e===k?"text-orange-400":"text-gray-500"}`,children:[w.jsx(R,{className:"w-5 h-5"}),w.jsx("span",{className:"text-[10px] font-medium",children:x})]},k))}),l&&f&&w.jsx(NR,{peerUid:f.userId,userId:r.uid,onUnlock:Te,onCancel:()=>{h(!1),g(null)}})]})}function DR({user:r,myHandle:e,onOpenChat:t}){const[i,o]=Q.useState(""),[l,h]=Q.useState(!1),[f,g]=Q.useState(void 0),_=async()=>{const E=i.trim().toLowerCase();if(E){h(!0),g(void 0);try{const I=await pw(Rp(jc(An,"users"),uw("userHandle","==",E),cw(1)));if(I.empty||I.docs[0].id===r.uid)g(null);else{const A=I.docs[0].data();g({userId:I.docs[0].id,displayName:A.displayName||I.docs[0].id,photoURL:A.photoURL||"",userHandle:A.userHandle||"",publicKey:A.publicKey||""})}}catch{Qe.error("搜尋失敗，請稍後再試"),g(void 0)}finally{h(!1)}}};return w.jsxs("div",{className:"flex flex-col h-full overflow-y-auto",children:[w.jsxs("div",{className:"flex items-center justify-between px-5 pt-5 pb-3",children:[w.jsx("h1",{className:"text-xl font-bold text-white",children:"P Chats"}),w.jsx(Fs,{className:"w-6 h-6 text-orange-500"})]}),w.jsxs("div",{className:"px-5 space-y-5 pb-5",children:[w.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 bg-orange-950/30 rounded-xl",children:[w.jsx(yr,{className:"w-3.5 h-3.5 text-orange-400 flex-shrink-0"}),w.jsx("span",{className:"text-xs text-orange-400",children:"端到端加密 · 訊息閱後即從伺服器刪除"})]}),w.jsxs("div",{className:"border border-gray-700 bg-gray-800/50 rounded-xl p-4",children:[w.jsx("p",{className:"text-xs text-gray-400 font-medium mb-1.5",children:"我的用戶 ID"}),w.jsx("p",{className:"text-2xl font-bold text-white",children:e?`@${e}`:"載入中..."}),w.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"其他使用者需輸入此 ID 才能找到你（可至設定修改）"})]}),w.jsxs("div",{children:[w.jsx("p",{className:"text-xs font-semibold text-gray-400 mb-2",children:"搜尋用戶"}),w.jsxs("div",{className:"flex gap-2",children:[w.jsxs("div",{className:"relative flex-1",children:[w.jsx(pR,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),w.jsx("input",{type:"text",placeholder:"輸入對方的用戶 ID…",value:i,onChange:E=>o(E.target.value),onKeyDown:E=>E.key==="Enter"&&_(),className:"w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"})]}),w.jsx("button",{onClick:_,disabled:l,className:"px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1.5",children:l?w.jsx("span",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}):"搜尋"})]})]}),f===null&&w.jsxs("div",{className:"flex items-center gap-3 px-4 py-4 bg-gray-800 rounded-xl",children:[w.jsx("span",{className:"text-gray-500 text-2xl",children:"👤"}),w.jsx("span",{className:"text-sm text-gray-400",children:"找不到此用戶 ID"})]}),f&&w.jsx(kw,{user:f,trailing:w.jsx("button",{onClick:()=>t(f),className:"px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600",children:"開始對話"}),onClick:()=>t(f)})]})]})}function VR({recentChats:r,onOpenChat:e}){return w.jsxs("div",{className:"flex flex-col h-full",children:[w.jsx("div",{className:"px-5 pt-5 pb-3",children:w.jsx("h1",{className:"text-xl font-bold text-white",children:"訊息"})}),r.length===0?w.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center text-center px-8",children:[w.jsx(zc,{className:"w-16 h-16 text-gray-700 mb-4"}),w.jsx("p",{className:"text-base text-gray-400 font-medium",children:"尚無最近對話"}),w.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"從首頁搜尋用戶來開始對話"})]}):w.jsx("div",{className:"flex-1 overflow-y-auto px-5 pb-5 space-y-2",children:r.map(t=>w.jsx(kw,{user:t,onClick:()=>e(t),trailing:w.jsx(zc,{className:"w-4 h-4 text-gray-300"})},t.userId))})]})}function OR({user:r,myHandle:e,myDisplayName:t,onHandleUpdate:i,onDisplayNameUpdate:o}){const[l,h]=Q.useState(!1),[f,g]=Q.useState(!1),[_,E]=Q.useState(t),[I,A]=Q.useState(e||""),[j,W]=Q.useState(""),[K,$]=Q.useState(""),pe=async()=>{const de=_.trim();if(!de){W("顯示名稱不得為空");return}if(de.length>30){W("最多 30 個字元");return}await Tv(r,{displayName:de}),await Uc(zr(An,"users",r.uid),{displayName:de}),o(de),h(!1),Qe.success("顯示名稱已更新")},le=async()=>{const de=I.toLowerCase().trim();if(de.length<3){$("至少需要 3 個字元");return}if(de.length>20){$("最多 20 個字元");return}if(!/^[a-z0-9_]+$/.test(de)){$("只能使用英文小寫、數字與底線");return}const k=await pw(Rp(jc(An,"users"),uw("userHandle","==",de),cw(1)));if(!k.empty&&k.docs[0].id!==r.uid){$("此 ID 已被使用");return}await Uc(zr(An,"users",r.uid),{userHandle:de}),i(de),g(!1),Qe.success("用戶 ID 已更新")},ce=async()=>{confirm("確定要登出嗎？")&&await wx(pl)},Te=async()=>{if(confirm("刪除帳號後，所有資料將永久移除且無法還原。確定要繼續嗎？"))try{await Ja(zr(An,"users",r.uid)).catch(()=>{}),await Ex(r)}catch(de){de.code==="auth/requires-recent-login"?Qe.error("請先重新登入後再刪除帳號"):Qe.error("刪除帳號失敗")}},Ee=(t[0]||(e==null?void 0:e[0])||"?").toUpperCase();return w.jsxs("div",{className:"flex flex-col h-full overflow-y-auto",children:[w.jsx("div",{className:"px-5 pt-5 pb-3",children:w.jsx("h1",{className:"text-xl font-bold text-white",children:"設定"})}),w.jsxs(rc,{label:"個人資料",children:[w.jsx(nf,{icon:w.jsx("div",{className:"w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm",children:Ee}),title:t||"尚未設定",subtitle:"顯示名稱",onClick:()=>{E(t),W(""),h(!0)}}),w.jsx("div",{className:"h-px bg-gray-700 ml-14"}),w.jsx(nf,{icon:w.jsx("div",{className:"w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm",children:"@"}),title:e?`@${e}`:"尚未設定",subtitle:"用戶 ID",onClick:()=>{A(e||""),$(""),g(!0)}})]}),w.jsx(rc,{label:"安全性",children:w.jsxs("div",{className:"px-4 py-3 flex items-start gap-3",children:[w.jsx(yr,{className:"w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"}),w.jsxs("div",{children:[w.jsx("p",{className:"text-sm font-medium text-gray-200",children:"獨立聊天室鎖定"}),w.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["每個聊天對象可設定不同密碼及指紋解鎖，",w.jsx("br",{}),"在對話視窗中開啟鎖定設定即可管理。"]})]})]})}),w.jsxs(rc,{label:"關於",children:[w.jsxs("div",{className:"px-4 py-3 flex items-start gap-3",children:[w.jsx(gR,{className:"w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"}),w.jsxs("div",{children:[w.jsx("p",{className:"text-sm font-medium text-gray-200",children:"端到端加密"}),w.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["X25519 金鑰交換 · AES-256-GCM 加密",w.jsx("br",{}),"訊息閱後即從伺服器刪除"]})]})]}),w.jsx("div",{className:"h-px bg-gray-700 ml-14"}),w.jsxs("div",{className:"px-4 py-3 flex items-center gap-3",children:[w.jsx(cR,{className:"w-5 h-5 text-orange-500 flex-shrink-0"}),w.jsx("p",{className:"text-sm text-gray-300 flex-1",children:"版本"}),w.jsx("span",{className:"text-sm text-gray-500",children:"2.0.0"})]})]}),w.jsx(rc,{label:"帳號管理",children:w.jsx(nf,{icon:w.jsx(Ew,{className:"w-5 h-5 text-red-500"}),title:"刪除帳號",subtitle:"永久刪除帳號及所有資料",titleClass:"text-red-500",onClick:Te})}),w.jsx("div",{className:"px-5 pb-6 mt-2",children:w.jsxs("button",{onClick:ce,className:"w-full flex items-center justify-center gap-2 border border-red-800 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-950/30 transition-colors",children:[w.jsx(hR,{className:"w-4 h-4"})," 登出"]})}),l&&w.jsxs(b_,{title:"修改顯示名稱",onClose:()=>h(!1),onSave:pe,children:[w.jsx("p",{className:"text-xs text-gray-400 mb-3",children:"最多 30 個字元，其他使用者看到的名稱。"}),w.jsx("input",{type:"text",value:_,onChange:de=>{E(de.target.value),W("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500",placeholder:"顯示名稱"}),j&&w.jsx("p",{className:"text-xs text-red-500 mt-1",children:j})]}),f&&w.jsxs(b_,{title:"修改用戶 ID",onClose:()=>g(!1),onSave:le,children:[w.jsx("p",{className:"text-xs text-gray-400 mb-3",children:"3–20 字元，只能使用英文小寫字母、數字與底線 (_)。"}),w.jsxs("div",{className:"relative",children:[w.jsx("span",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm",children:"@"}),w.jsx("input",{type:"text",value:I,onChange:de=>{A(de.target.value.toLowerCase()),$("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500",placeholder:"用戶 ID"})]}),K&&w.jsx("p",{className:"text-xs text-red-500 mt-1",children:K})]})]})}function rc({label:r,children:e}){return w.jsxs("div",{className:"mb-4",children:[w.jsx("p",{className:"px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide",children:r}),w.jsx("div",{className:"mx-5 border border-gray-800 rounded-xl overflow-hidden bg-gray-900",children:e})]})}function nf({icon:r,title:e,subtitle:t,onClick:i,titleClass:o=""}){return w.jsxs("div",{onClick:i,className:"flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer",children:[w.jsx("div",{className:"flex-shrink-0",children:r}),w.jsxs("div",{className:"flex-1 min-w-0",children:[w.jsx("p",{className:`text-sm font-medium ${o||"text-gray-200"}`,children:e}),t&&w.jsx("p",{className:"text-xs text-gray-500",children:t})]}),w.jsx(aR,{className:`w-4 h-4 ${o?"text-red-400":"text-gray-600"} flex-shrink-0`})]})}function b_({title:r,children:e,onClose:t,onSave:i}){return w.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",onClick:t,children:w.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-2xl p-5",onClick:o=>o.stopPropagation(),children:[w.jsx("h3",{className:"font-bold text-white mb-3",children:r}),e,w.jsxs("div",{className:"flex gap-2 mt-4",children:[w.jsx("button",{onClick:t,className:"flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),w.jsx("button",{onClick:i,className:"flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})})}function LR(){const[r,e]=Q.useState(null),[t,i]=Q.useState("loading");return Q.useEffect(()=>vx(pl,o=>{e(o),i(o?"home":"login")}),[]),t==="loading"?w.jsx("div",{className:"flex items-center justify-center h-full bg-white",children:w.jsx("div",{className:"w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"})}):t==="home"&&r?w.jsx(bR,{user:r}):t==="register"?w.jsx(wR,{onBack:()=>i("login")}):w.jsx(vR,{onRegister:()=>i("register")})}WE.createRoot(document.getElementById("root")).render(w.jsxs(FE.StrictMode,{children:[w.jsx(LR,{}),w.jsx(VT,{position:"top-center",toastOptions:{duration:3e3}})]}));
