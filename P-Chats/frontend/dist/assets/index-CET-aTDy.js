var LE=Object.defineProperty;var ME=(r,e,t)=>e in r?LE(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Gu=(r,e,t)=>ME(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function j_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Fd={exports:{}},Ba={},Ud={exports:{}},be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qg;function jE(){if(qg)return be;qg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),I=Symbol.iterator;function A(V){return V===null||typeof V!="object"?null:(V=I&&V[I]||V["@@iterator"],typeof V=="function"?V:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},W=Object.assign,K={};function $(V,z,le){this.props=V,this.context=z,this.refs=K,this.updater=le||j}$.prototype.isReactComponent={},$.prototype.setState=function(V,z){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,z,"setState")},$.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function me(){}me.prototype=$.prototype;function ae(V,z,le){this.props=V,this.context=z,this.refs=K,this.updater=le||j}var ce=ae.prototype=new me;ce.constructor=ae,W(ce,$.prototype),ce.isPureReactComponent=!0;var xe=Array.isArray,Te=Object.prototype.hasOwnProperty,de={current:null},k={key:!0,ref:!0,__self:!0,__source:!0};function x(V,z,le){var ge,pe={},ye=null,ve=null;if(z!=null)for(ge in z.ref!==void 0&&(ve=z.ref),z.key!==void 0&&(ye=""+z.key),z)Te.call(z,ge)&&!k.hasOwnProperty(ge)&&(pe[ge]=z[ge]);var Ne=arguments.length-2;if(Ne===1)pe.children=le;else if(1<Ne){for(var Ie=Array(Ne),Be=0;Be<Ne;Be++)Ie[Be]=arguments[Be+2];pe.children=Ie}if(V&&V.defaultProps)for(ge in Ne=V.defaultProps,Ne)pe[ge]===void 0&&(pe[ge]=Ne[ge]);return{$$typeof:r,type:V,key:ye,ref:ve,props:pe,_owner:de.current}}function R(V,z){return{$$typeof:r,type:V.type,key:z,ref:V.ref,props:V.props,_owner:V._owner}}function b(V){return typeof V=="object"&&V!==null&&V.$$typeof===r}function P(V){var z={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(le){return z[le]})}var O=/\/+/g;function C(V,z){return typeof V=="object"&&V!==null&&V.key!=null?P(""+V.key):z.toString(36)}function qe(V,z,le,ge,pe){var ye=typeof V;(ye==="undefined"||ye==="boolean")&&(V=null);var ve=!1;if(V===null)ve=!0;else switch(ye){case"string":case"number":ve=!0;break;case"object":switch(V.$$typeof){case r:case e:ve=!0}}if(ve)return ve=V,pe=pe(ve),V=ge===""?"."+C(ve,0):ge,xe(pe)?(le="",V!=null&&(le=V.replace(O,"$&/")+"/"),qe(pe,z,le,"",function(Be){return Be})):pe!=null&&(b(pe)&&(pe=R(pe,le+(!pe.key||ve&&ve.key===pe.key?"":(""+pe.key).replace(O,"$&/")+"/")+V)),z.push(pe)),1;if(ve=0,ge=ge===""?".":ge+":",xe(V))for(var Ne=0;Ne<V.length;Ne++){ye=V[Ne];var Ie=ge+C(ye,Ne);ve+=qe(ye,z,le,Ie,pe)}else if(Ie=A(V),typeof Ie=="function")for(V=Ie.call(V),Ne=0;!(ye=V.next()).done;)ye=ye.value,Ie=ge+C(ye,Ne++),ve+=qe(ye,z,le,Ie,pe);else if(ye==="object")throw z=String(V),Error("Objects are not valid as a React child (found: "+(z==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":z)+"). If you meant to render a collection of children, use an array instead.");return ve}function yt(V,z,le){if(V==null)return V;var ge=[],pe=0;return qe(V,ge,"","",function(ye){return z.call(le,ye,pe++)}),ge}function Ct(V){if(V._status===-1){var z=V._result;z=z(),z.then(function(le){(V._status===0||V._status===-1)&&(V._status=1,V._result=le)},function(le){(V._status===0||V._status===-1)&&(V._status=2,V._result=le)}),V._status===-1&&(V._status=0,V._result=z)}if(V._status===1)return V._result.default;throw V._result}var We={current:null},H={transition:null},ne={ReactCurrentDispatcher:We,ReactCurrentBatchConfig:H,ReactCurrentOwner:de};function Z(){throw Error("act(...) is not supported in production builds of React.")}return be.Children={map:yt,forEach:function(V,z,le){yt(V,function(){z.apply(this,arguments)},le)},count:function(V){var z=0;return yt(V,function(){z++}),z},toArray:function(V){return yt(V,function(z){return z})||[]},only:function(V){if(!b(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},be.Component=$,be.Fragment=t,be.Profiler=o,be.PureComponent=ae,be.StrictMode=i,be.Suspense=g,be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ne,be.act=Z,be.cloneElement=function(V,z,le){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var ge=W({},V.props),pe=V.key,ye=V.ref,ve=V._owner;if(z!=null){if(z.ref!==void 0&&(ye=z.ref,ve=de.current),z.key!==void 0&&(pe=""+z.key),V.type&&V.type.defaultProps)var Ne=V.type.defaultProps;for(Ie in z)Te.call(z,Ie)&&!k.hasOwnProperty(Ie)&&(ge[Ie]=z[Ie]===void 0&&Ne!==void 0?Ne[Ie]:z[Ie])}var Ie=arguments.length-2;if(Ie===1)ge.children=le;else if(1<Ie){Ne=Array(Ie);for(var Be=0;Be<Ie;Be++)Ne[Be]=arguments[Be+2];ge.children=Ne}return{$$typeof:r,type:V.type,key:pe,ref:ye,props:ge,_owner:ve}},be.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:l,_context:V},V.Consumer=V},be.createElement=x,be.createFactory=function(V){var z=x.bind(null,V);return z.type=V,z},be.createRef=function(){return{current:null}},be.forwardRef=function(V){return{$$typeof:f,render:V}},be.isValidElement=b,be.lazy=function(V){return{$$typeof:w,_payload:{_status:-1,_result:V},_init:Ct}},be.memo=function(V,z){return{$$typeof:_,type:V,compare:z===void 0?null:z}},be.startTransition=function(V){var z=H.transition;H.transition={};try{V()}finally{H.transition=z}},be.unstable_act=Z,be.useCallback=function(V,z){return We.current.useCallback(V,z)},be.useContext=function(V){return We.current.useContext(V)},be.useDebugValue=function(){},be.useDeferredValue=function(V){return We.current.useDeferredValue(V)},be.useEffect=function(V,z){return We.current.useEffect(V,z)},be.useId=function(){return We.current.useId()},be.useImperativeHandle=function(V,z,le){return We.current.useImperativeHandle(V,z,le)},be.useInsertionEffect=function(V,z){return We.current.useInsertionEffect(V,z)},be.useLayoutEffect=function(V,z){return We.current.useLayoutEffect(V,z)},be.useMemo=function(V,z){return We.current.useMemo(V,z)},be.useReducer=function(V,z,le){return We.current.useReducer(V,z,le)},be.useRef=function(V){return We.current.useRef(V)},be.useState=function(V){return We.current.useState(V)},be.useSyncExternalStore=function(V,z,le){return We.current.useSyncExternalStore(V,z,le)},be.useTransition=function(){return We.current.useTransition()},be.version="18.3.1",be}var Wg;function bf(){return Wg||(Wg=1,Ud.exports=jE()),Ud.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kg;function FE(){if(Kg)return Ba;Kg=1;var r=bf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(f,g,_){var w,I={},A=null,j=null;_!==void 0&&(A=""+_),g.key!==void 0&&(A=""+g.key),g.ref!==void 0&&(j=g.ref);for(w in g)i.call(g,w)&&!l.hasOwnProperty(w)&&(I[w]=g[w]);if(f&&f.defaultProps)for(w in g=f.defaultProps,g)I[w]===void 0&&(I[w]=g[w]);return{$$typeof:e,type:f,key:A,ref:j,props:I,_owner:o.current}}return Ba.Fragment=t,Ba.jsx=h,Ba.jsxs=h,Ba}var Gg;function UE(){return Gg||(Gg=1,Fd.exports=FE()),Fd.exports}var E=UE(),Q=bf();const zE=j_(Q);var Qu={},zd={exports:{}},nn={},Bd={exports:{}},$d={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qg;function BE(){return Qg||(Qg=1,(function(r){function e(H,ne){var Z=H.length;H.push(ne);e:for(;0<Z;){var V=Z-1>>>1,z=H[V];if(0<o(z,ne))H[V]=ne,H[Z]=z,Z=V;else break e}}function t(H){return H.length===0?null:H[0]}function i(H){if(H.length===0)return null;var ne=H[0],Z=H.pop();if(Z!==ne){H[0]=Z;e:for(var V=0,z=H.length,le=z>>>1;V<le;){var ge=2*(V+1)-1,pe=H[ge],ye=ge+1,ve=H[ye];if(0>o(pe,Z))ye<z&&0>o(ve,pe)?(H[V]=ve,H[ye]=Z,V=ye):(H[V]=pe,H[ge]=Z,V=ge);else if(ye<z&&0>o(ve,Z))H[V]=ve,H[ye]=Z,V=ye;else break e}}return ne}function o(H,ne){var Z=H.sortIndex-ne.sortIndex;return Z!==0?Z:H.id-ne.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,f=h.now();r.unstable_now=function(){return h.now()-f}}var g=[],_=[],w=1,I=null,A=3,j=!1,W=!1,K=!1,$=typeof setTimeout=="function"?setTimeout:null,me=typeof clearTimeout=="function"?clearTimeout:null,ae=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ce(H){for(var ne=t(_);ne!==null;){if(ne.callback===null)i(_);else if(ne.startTime<=H)i(_),ne.sortIndex=ne.expirationTime,e(g,ne);else break;ne=t(_)}}function xe(H){if(K=!1,ce(H),!W)if(t(g)!==null)W=!0,Ct(Te);else{var ne=t(_);ne!==null&&We(xe,ne.startTime-H)}}function Te(H,ne){W=!1,K&&(K=!1,me(x),x=-1),j=!0;var Z=A;try{for(ce(ne),I=t(g);I!==null&&(!(I.expirationTime>ne)||H&&!P());){var V=I.callback;if(typeof V=="function"){I.callback=null,A=I.priorityLevel;var z=V(I.expirationTime<=ne);ne=r.unstable_now(),typeof z=="function"?I.callback=z:I===t(g)&&i(g),ce(ne)}else i(g);I=t(g)}if(I!==null)var le=!0;else{var ge=t(_);ge!==null&&We(xe,ge.startTime-ne),le=!1}return le}finally{I=null,A=Z,j=!1}}var de=!1,k=null,x=-1,R=5,b=-1;function P(){return!(r.unstable_now()-b<R)}function O(){if(k!==null){var H=r.unstable_now();b=H;var ne=!0;try{ne=k(!0,H)}finally{ne?C():(de=!1,k=null)}}else de=!1}var C;if(typeof ae=="function")C=function(){ae(O)};else if(typeof MessageChannel<"u"){var qe=new MessageChannel,yt=qe.port2;qe.port1.onmessage=O,C=function(){yt.postMessage(null)}}else C=function(){$(O,0)};function Ct(H){k=H,de||(de=!0,C())}function We(H,ne){x=$(function(){H(r.unstable_now())},ne)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(H){H.callback=null},r.unstable_continueExecution=function(){W||j||(W=!0,Ct(Te))},r.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<H?Math.floor(1e3/H):5},r.unstable_getCurrentPriorityLevel=function(){return A},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(H){switch(A){case 1:case 2:case 3:var ne=3;break;default:ne=A}var Z=A;A=ne;try{return H()}finally{A=Z}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(H,ne){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var Z=A;A=H;try{return ne()}finally{A=Z}},r.unstable_scheduleCallback=function(H,ne,Z){var V=r.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?V+Z:V):Z=V,H){case 1:var z=-1;break;case 2:z=250;break;case 5:z=1073741823;break;case 4:z=1e4;break;default:z=5e3}return z=Z+z,H={id:w++,callback:ne,priorityLevel:H,startTime:Z,expirationTime:z,sortIndex:-1},Z>V?(H.sortIndex=Z,e(_,H),t(g)===null&&H===t(_)&&(K?(me(x),x=-1):K=!0,We(xe,Z-V))):(H.sortIndex=z,e(g,H),W||j||(W=!0,Ct(Te))),H},r.unstable_shouldYield=P,r.unstable_wrapCallback=function(H){var ne=A;return function(){var Z=A;A=ne;try{return H.apply(this,arguments)}finally{A=Z}}}})($d)),$d}var Jg;function $E(){return Jg||(Jg=1,Bd.exports=BE()),Bd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yg;function HE(){if(Yg)return nn;Yg=1;var r=bf(),e=$E();function t(n){for(var s="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)s+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+s+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function l(n,s){h(n,s),h(n+"Capture",s)}function h(n,s){for(o[n]=s,n=0;n<s.length;n++)i.add(s[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},I={};function A(n){return g.call(I,n)?!0:g.call(w,n)?!1:_.test(n)?I[n]=!0:(w[n]=!0,!1)}function j(n,s,a,c){if(a!==null&&a.type===0)return!1;switch(typeof s){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function W(n,s,a,c){if(s===null||typeof s>"u"||j(n,s,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!s;case 4:return s===!1;case 5:return isNaN(s);case 6:return isNaN(s)||1>s}return!1}function K(n,s,a,c,d,p,v){this.acceptsBooleans=s===2||s===3||s===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=s,this.sanitizeURL=p,this.removeEmptyString=v}var $={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){$[n]=new K(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var s=n[0];$[s]=new K(s,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){$[n]=new K(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){$[n]=new K(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){$[n]=new K(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){$[n]=new K(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){$[n]=new K(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){$[n]=new K(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){$[n]=new K(n,5,!1,n.toLowerCase(),null,!1,!1)});var me=/[\-:]([a-z])/g;function ae(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var s=n.replace(me,ae);$[s]=new K(s,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var s=n.replace(me,ae);$[s]=new K(s,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var s=n.replace(me,ae);$[s]=new K(s,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){$[n]=new K(n,1,!1,n.toLowerCase(),null,!1,!1)}),$.xlinkHref=new K("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){$[n]=new K(n,1,!1,n.toLowerCase(),null,!0,!0)});function ce(n,s,a,c){var d=$.hasOwnProperty(s)?$[s]:null;(d!==null?d.type!==0:c||!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(W(s,a,d,c)&&(a=null),c||d===null?A(s)&&(a===null?n.removeAttribute(s):n.setAttribute(s,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(s=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(s):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,s,a):n.setAttribute(s,a))))}var xe=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Te=Symbol.for("react.element"),de=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),b=Symbol.for("react.provider"),P=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),C=Symbol.for("react.suspense"),qe=Symbol.for("react.suspense_list"),yt=Symbol.for("react.memo"),Ct=Symbol.for("react.lazy"),We=Symbol.for("react.offscreen"),H=Symbol.iterator;function ne(n){return n===null||typeof n!="object"?null:(n=H&&n[H]||n["@@iterator"],typeof n=="function"?n:null)}var Z=Object.assign,V;function z(n){if(V===void 0)try{throw Error()}catch(a){var s=a.stack.trim().match(/\n( *(at )?)/);V=s&&s[1]||""}return`
`+V+n}var le=!1;function ge(n,s){if(!n||le)return"";le=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(s)if(s=function(){throw Error()},Object.defineProperty(s.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(s,[])}catch(U){var c=U}Reflect.construct(n,[],s)}else{try{s.call()}catch(U){c=U}n.call(s.prototype)}else{try{throw Error()}catch(U){c=U}n()}}catch(U){if(U&&c&&typeof U.stack=="string"){for(var d=U.stack.split(`
`),p=c.stack.split(`
`),v=d.length-1,S=p.length-1;1<=v&&0<=S&&d[v]!==p[S];)S--;for(;1<=v&&0<=S;v--,S--)if(d[v]!==p[S]){if(v!==1||S!==1)do if(v--,S--,0>S||d[v]!==p[S]){var N=`
`+d[v].replace(" at new "," at ");return n.displayName&&N.includes("<anonymous>")&&(N=N.replace("<anonymous>",n.displayName)),N}while(1<=v&&0<=S);break}}}finally{le=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?z(n):""}function pe(n){switch(n.tag){case 5:return z(n.type);case 16:return z("Lazy");case 13:return z("Suspense");case 19:return z("SuspenseList");case 0:case 2:case 15:return n=ge(n.type,!1),n;case 11:return n=ge(n.type.render,!1),n;case 1:return n=ge(n.type,!0),n;default:return""}}function ye(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case k:return"Fragment";case de:return"Portal";case R:return"Profiler";case x:return"StrictMode";case C:return"Suspense";case qe:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case P:return(n.displayName||"Context")+".Consumer";case b:return(n._context.displayName||"Context")+".Provider";case O:var s=n.render;return n=n.displayName,n||(n=s.displayName||s.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case yt:return s=n.displayName||null,s!==null?s:ye(n.type)||"Memo";case Ct:s=n._payload,n=n._init;try{return ye(n(s))}catch{}}return null}function ve(n){var s=n.type;switch(n.tag){case 24:return"Cache";case 9:return(s.displayName||"Context")+".Consumer";case 10:return(s._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=s.render,n=n.displayName||n.name||"",s.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return s;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ye(s);case 8:return s===x?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof s=="function")return s.displayName||s.name||null;if(typeof s=="string")return s}return null}function Ne(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ie(n){var s=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(s==="checkbox"||s==="radio")}function Be(n){var s=Ie(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,s),c=""+n[s];if(!n.hasOwnProperty(s)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,p=a.set;return Object.defineProperty(n,s,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,p.call(this,v)}}),Object.defineProperty(n,s,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[s]}}}}function ht(n){n._valueTracker||(n._valueTracker=Be(n))}function et(n){if(!n)return!1;var s=n._valueTracker;if(!s)return!0;var a=s.getValue(),c="";return n&&(c=Ie(n)?n.checked?"true":"false":n.value),n=c,n!==a?(s.setValue(n),!0):!1}function tt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function at(n,s){var a=s.checked;return Z({},s,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function Hn(n,s){var a=s.defaultValue==null?"":s.defaultValue,c=s.checked!=null?s.checked:s.defaultChecked;a=Ne(s.value!=null?s.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:s.type==="checkbox"||s.type==="radio"?s.checked!=null:s.value!=null}}function Fi(n,s){s=s.checked,s!=null&&ce(n,"checked",s,!1)}function Ys(n,s){Fi(n,s);var a=Ne(s.value),c=s.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}s.hasOwnProperty("value")?_t(n,s.type,a):s.hasOwnProperty("defaultValue")&&_t(n,s.type,Ne(s.defaultValue)),s.checked==null&&s.defaultChecked!=null&&(n.defaultChecked=!!s.defaultChecked)}function Qo(n,s,a){if(s.hasOwnProperty("value")||s.hasOwnProperty("defaultValue")){var c=s.type;if(!(c!=="submit"&&c!=="reset"||s.value!==void 0&&s.value!==null))return;s=""+n._wrapperState.initialValue,a||s===n.value||(n.value=s),n.defaultValue=s}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function _t(n,s,a){(s!=="number"||tt(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var dt=Array.isArray;function Rn(n,s,a,c){if(n=n.options,s){s={};for(var d=0;d<a.length;d++)s["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=s.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Ne(a),s=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}s!==null||n[d].disabled||(s=n[d])}s!==null&&(s.selected=!0)}}function Jo(n,s){if(s.dangerouslySetInnerHTML!=null)throw Error(t(91));return Z({},s,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Yo(n,s){var a=s.value;if(a==null){if(a=s.children,s=s.defaultValue,a!=null){if(s!=null)throw Error(t(92));if(dt(a)){if(1<a.length)throw Error(t(93));a=a[0]}s=a}s==null&&(s=""),a=s}n._wrapperState={initialValue:Ne(a)}}function Vl(n,s){var a=Ne(s.value),c=Ne(s.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),s.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Xr(n){var s=n.textContent;s===n._wrapperState.initialValue&&s!==""&&s!==null&&(n.value=s)}function Xo(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ui(n,s){return n==null||n==="http://www.w3.org/1999/xhtml"?Xo(s):n==="http://www.w3.org/2000/svg"&&s==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Zr,Ol=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(s,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(s,a,c,d)})}:n})(function(n,s){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=s;else{for(Zr=Zr||document.createElement("div"),Zr.innerHTML="<svg>"+s.valueOf().toString()+"</svg>",s=Zr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;s.firstChild;)n.appendChild(s.firstChild)}});function Xs(n,s){if(s){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=s;return}}n.textContent=s}var es={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ll=["Webkit","ms","Moz","O"];Object.keys(es).forEach(function(n){Ll.forEach(function(s){s=s+n.charAt(0).toUpperCase()+n.substring(1),es[s]=es[n]})});function ts(n,s,a){return s==null||typeof s=="boolean"||s===""?"":a||typeof s!="number"||s===0||es.hasOwnProperty(n)&&es[n]?(""+s).trim():s+"px"}function zi(n,s){n=n.style;for(var a in s)if(s.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=ts(a,s[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Zo=Z({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Pn(n,s){if(s){if(Zo[n]&&(s.children!=null||s.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(s.dangerouslySetInnerHTML!=null){if(s.children!=null)throw Error(t(60));if(typeof s.dangerouslySetInnerHTML!="object"||!("__html"in s.dangerouslySetInnerHTML))throw Error(t(61))}if(s.style!=null&&typeof s.style!="object")throw Error(t(62))}}function Bi(n,s){if(n.indexOf("-")===-1)return typeof s.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ns=null;function $i(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var _r=null,vr=null,lt=null;function ea(n){if(n=ka(n)){if(typeof _r!="function")throw Error(t(280));var s=n.stateNode;s&&(s=uu(s),_r(n.stateNode,n.type,s))}}function rs(n){vr?lt?lt.push(n):lt=[n]:vr=n}function ss(){if(vr){var n=vr,s=lt;if(lt=vr=null,ea(n),s)for(n=0;n<s.length;n++)ea(s[n])}}function Ml(n,s){return n(s)}function jl(){}var qn=!1;function Fl(n,s,a){if(qn)return n(s,a);qn=!0;try{return Ml(n,s,a)}finally{qn=!1,(vr!==null||lt!==null)&&(jl(),ss())}}function Zs(n,s){var a=n.stateNode;if(a===null)return null;var c=uu(a);if(c===null)return null;a=c[s];e:switch(s){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,s,typeof a));return a}var is=!1;if(f)try{var os={};Object.defineProperty(os,"passive",{get:function(){is=!0}}),window.addEventListener("test",os,os),window.removeEventListener("test",os,os)}catch{is=!1}function Ul(n,s,a,c,d,p,v,S,N){var U=Array.prototype.slice.call(arguments,3);try{s.apply(a,U)}catch(Y){this.onError(Y)}}var wr=!1,Wn=null,Hi=!1,_n=null,zl={onError:function(n){wr=!0,Wn=n}};function Bl(n,s,a,c,d,p,v,S,N){wr=!1,Wn=null,Ul.apply(zl,arguments)}function ta(n,s,a,c,d,p,v,S,N){if(Bl.apply(this,arguments),wr){if(wr){var U=Wn;wr=!1,Wn=null}else throw Error(t(198));Hi||(Hi=!0,_n=U)}}function Nn(n){var s=n,a=n;if(n.alternate)for(;s.return;)s=s.return;else{n=s;do s=n,(s.flags&4098)!==0&&(a=s.return),n=s.return;while(n)}return s.tag===3?a:null}function na(n){if(n.tag===13){var s=n.memoizedState;if(s===null&&(n=n.alternate,n!==null&&(s=n.memoizedState)),s!==null)return s.dehydrated}return null}function $l(n){if(Nn(n)!==n)throw Error(t(188))}function Hl(n){var s=n.alternate;if(!s){if(s=Nn(n),s===null)throw Error(t(188));return s!==n?null:n}for(var a=n,c=s;;){var d=a.return;if(d===null)break;var p=d.alternate;if(p===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===p.child){for(p=d.child;p;){if(p===a)return $l(d),n;if(p===c)return $l(d),s;p=p.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=p;else{for(var v=!1,S=d.child;S;){if(S===a){v=!0,a=d,c=p;break}if(S===c){v=!0,c=d,a=p;break}S=S.sibling}if(!v){for(S=p.child;S;){if(S===a){v=!0,a=p,c=d;break}if(S===c){v=!0,c=p,a=d;break}S=S.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:s}function ql(n){return n=Hl(n),n!==null?ei(n):null}function ei(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var s=ei(n);if(s!==null)return s;n=n.sibling}return null}var ra=e.unstable_scheduleCallback,qi=e.unstable_cancelCallback,ti=e.unstable_shouldYield,Er=e.unstable_requestPaint,Je=e.unstable_now,gh=e.unstable_getCurrentPriorityLevel,Wi=e.unstable_ImmediatePriority,sa=e.unstable_UserBlockingPriority,ni=e.unstable_NormalPriority,ia=e.unstable_LowPriority,Ki=e.unstable_IdlePriority,ri=null,on=null;function Wl(n){if(on&&typeof on.onCommitFiberRoot=="function")try{on.onCommitFiberRoot(ri,n,void 0,(n.current.flags&128)===128)}catch{}}var an=Math.clz32?Math.clz32:si,Kn=Math.log,vn=Math.LN2;function si(n){return n>>>=0,n===0?32:31-(Kn(n)/vn|0)|0}var Gn=64,as=4194304;function Ue(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Tr(n,s){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,p=n.pingedLanes,v=a&268435455;if(v!==0){var S=v&~d;S!==0?c=Ue(S):(p&=v,p!==0&&(c=Ue(p)))}else v=a&~d,v!==0?c=Ue(v):p!==0&&(c=Ue(p));if(c===0)return 0;if(s!==0&&s!==c&&(s&d)===0&&(d=c&-c,p=s&-s,d>=p||d===16&&(p&4194240)!==0))return s;if((c&4)!==0&&(c|=a&16),s=n.entangledLanes,s!==0)for(n=n.entanglements,s&=c;0<s;)a=31-an(s),d=1<<a,c|=n[a],s&=~d;return c}function ii(n,s){switch(n){case 1:case 2:case 4:return s+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return s+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function oi(n,s){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,p=n.pendingLanes;0<p;){var v=31-an(p),S=1<<v,N=d[v];N===-1?((S&a)===0||(S&c)!==0)&&(d[v]=ii(S,s)):N<=s&&(n.expiredLanes|=S),p&=~S}}function oa(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function aa(){var n=Gn;return Gn<<=1,(Gn&4194240)===0&&(Gn=64),n}function la(n){for(var s=[],a=0;31>a;a++)s.push(n);return s}function ai(n,s,a){n.pendingLanes|=s,s!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,s=31-an(s),n[s]=a}function yh(n,s){var a=n.pendingLanes&~s;n.pendingLanes=s,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=s,n.mutableReadLanes&=s,n.entangledLanes&=s,s=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-an(a),p=1<<d;s[d]=0,c[d]=-1,n[d]=-1,a&=~p}}function ua(n,s){var a=n.entangledLanes|=s;for(n=n.entanglements;a;){var c=31-an(a),d=1<<c;d&s|n[c]&s&&(n[c]|=s),a&=~d}}var Le=0;function Qn(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ca,Gi,ha,da,fa,Jn=!1,Qi=[],Yn=null,Xn=null,Dt=null,li=new Map,Ir=new Map,ln=[],Kl="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ls(n,s){switch(n){case"focusin":case"focusout":Yn=null;break;case"dragenter":case"dragleave":Xn=null;break;case"mouseover":case"mouseout":Dt=null;break;case"pointerover":case"pointerout":li.delete(s.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ir.delete(s.pointerId)}}function bn(n,s,a,c,d,p){return n===null||n.nativeEvent!==p?(n={blockedOn:s,domEventName:a,eventSystemFlags:c,nativeEvent:p,targetContainers:[d]},s!==null&&(s=ka(s),s!==null&&Gi(s)),n):(n.eventSystemFlags|=c,s=n.targetContainers,d!==null&&s.indexOf(d)===-1&&s.push(d),n)}function Gl(n,s,a,c,d){switch(s){case"focusin":return Yn=bn(Yn,n,s,a,c,d),!0;case"dragenter":return Xn=bn(Xn,n,s,a,c,d),!0;case"mouseover":return Dt=bn(Dt,n,s,a,c,d),!0;case"pointerover":var p=d.pointerId;return li.set(p,bn(li.get(p)||null,n,s,a,c,d)),!0;case"gotpointercapture":return p=d.pointerId,Ir.set(p,bn(Ir.get(p)||null,n,s,a,c,d)),!0}return!1}function Ji(n){var s=di(n.target);if(s!==null){var a=Nn(s);if(a!==null){if(s=a.tag,s===13){if(s=na(a),s!==null){n.blockedOn=s,fa(n.priority,function(){ha(a)});return}}else if(s===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ke(n){if(n.blockedOn!==null)return!1;for(var s=n.targetContainers;0<s.length;){var a=Yi(n.domEventName,n.eventSystemFlags,s[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);ns=c,a.target.dispatchEvent(c),ns=null}else return s=ka(a),s!==null&&Gi(s),n.blockedOn=a,!1;s.shift()}return!0}function Ql(n,s,a){Ke(n)&&a.delete(s)}function _h(){Jn=!1,Yn!==null&&Ke(Yn)&&(Yn=null),Xn!==null&&Ke(Xn)&&(Xn=null),Dt!==null&&Ke(Dt)&&(Dt=null),li.forEach(Ql),Ir.forEach(Ql)}function us(n,s){n.blockedOn===s&&(n.blockedOn=null,Jn||(Jn=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,_h)))}function cs(n){function s(d){return us(d,n)}if(0<Qi.length){us(Qi[0],n);for(var a=1;a<Qi.length;a++){var c=Qi[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Yn!==null&&us(Yn,n),Xn!==null&&us(Xn,n),Dt!==null&&us(Dt,n),li.forEach(s),Ir.forEach(s),a=0;a<ln.length;a++)c=ln[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<ln.length&&(a=ln[0],a.blockedOn===null);)Ji(a),a.blockedOn===null&&ln.shift()}var xr=xe.ReactCurrentBatchConfig,Sr=!0;function Zn(n,s,a,c){var d=Le,p=xr.transition;xr.transition=null;try{Le=1,pa(n,s,a,c)}finally{Le=d,xr.transition=p}}function Jl(n,s,a,c){var d=Le,p=xr.transition;xr.transition=null;try{Le=4,pa(n,s,a,c)}finally{Le=d,xr.transition=p}}function pa(n,s,a,c){if(Sr){var d=Yi(n,s,a,c);if(d===null)Rh(n,s,c,er,a),ls(n,c);else if(Gl(d,n,s,a,c))c.stopPropagation();else if(ls(n,c),s&4&&-1<Kl.indexOf(n)){for(;d!==null;){var p=ka(d);if(p!==null&&ca(p),p=Yi(n,s,a,c),p===null&&Rh(n,s,c,er,a),p===d)break;d=p}d!==null&&c.stopPropagation()}else Rh(n,s,c,null,a)}}var er=null;function Yi(n,s,a,c){if(er=null,n=$i(c),n=di(n),n!==null)if(s=Nn(n),s===null)n=null;else if(a=s.tag,a===13){if(n=na(s),n!==null)return n;n=null}else if(a===3){if(s.stateNode.current.memoizedState.isDehydrated)return s.tag===3?s.stateNode.containerInfo:null;n=null}else s!==n&&(n=null);return er=n,null}function Xi(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(gh()){case Wi:return 1;case sa:return 4;case ni:case ia:return 16;case Ki:return 536870912;default:return 16}default:return 16}}var un=null,Zi=null,Ar=null;function Yl(){if(Ar)return Ar;var n,s=Zi,a=s.length,c,d="value"in un?un.value:un.textContent,p=d.length;for(n=0;n<a&&s[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&s[a-c]===d[p-c];c++);return Ar=d.slice(n,1<c?1-c:void 0)}function ui(n){var s=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&s===13&&(n=13)):n=s,n===10&&(n=13),32<=n||n===13?n:0}function tr(){return!0}function ma(){return!1}function Ut(n){function s(a,c,d,p,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=p,this.target=v,this.currentTarget=null;for(var S in n)n.hasOwnProperty(S)&&(a=n[S],this[S]=a?a(p):p[S]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?tr:ma,this.isPropagationStopped=ma,this}return Z(s.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=tr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=tr)},persist:function(){},isPersistent:tr}),s}var nr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ci=Ut(nr),hs=Z({},nr,{view:0,detail:0}),eo=Ut(hs),to,no,cn,hi=Z({},hs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Re,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==cn&&(cn&&n.type==="mousemove"?(to=n.screenX-cn.screenX,no=n.screenY-cn.screenY):no=to=0,cn=n),to)},movementY:function(n){return"movementY"in n?n.movementY:no}}),ga=Ut(hi),Xl=Z({},hi,{dataTransfer:0}),Zl=Ut(Xl),ro=Z({},hs,{relatedTarget:0}),Vt=Ut(ro),eu=Z({},nr,{animationName:0,elapsedTime:0,pseudoElement:0}),tu=Ut(eu),ds=Z({},nr,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),u=Ut(ds),m=Z({},nr,{data:0}),y=Ut(m),T={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},M={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},B={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function te(n){var s=this.nativeEvent;return s.getModifierState?s.getModifierState(n):(n=B[n])?!!s[n]:!1}function Re(){return te}var ft=Z({},hs,{key:function(n){if(n.key){var s=T[n.key]||n.key;if(s!=="Unidentified")return s}return n.type==="keypress"?(n=ui(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?M[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Re,charCode:function(n){return n.type==="keypress"?ui(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ui(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),$e=Ut(ft),vt=Z({},hi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hn=Ut(vt),kr=Z({},hs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Re}),rr=Ut(kr),sr=Z({},nr,{propertyName:0,elapsedTime:0,pseudoElement:0}),so=Ut(sr),ya=Z({},hi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Pw=Ut(ya),Nw=[9,13,27,32],vh=f&&"CompositionEvent"in window,_a=null;f&&"documentMode"in document&&(_a=document.documentMode);var bw=f&&"TextEvent"in window&&!_a,Mp=f&&(!vh||_a&&8<_a&&11>=_a),jp=" ",Fp=!1;function Up(n,s){switch(n){case"keyup":return Nw.indexOf(s.keyCode)!==-1;case"keydown":return s.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zp(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var io=!1;function Dw(n,s){switch(n){case"compositionend":return zp(s);case"keypress":return s.which!==32?null:(Fp=!0,jp);case"textInput":return n=s.data,n===jp&&Fp?null:n;default:return null}}function Vw(n,s){if(io)return n==="compositionend"||!vh&&Up(n,s)?(n=Yl(),Ar=Zi=un=null,io=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(s.ctrlKey||s.altKey||s.metaKey)||s.ctrlKey&&s.altKey){if(s.char&&1<s.char.length)return s.char;if(s.which)return String.fromCharCode(s.which)}return null;case"compositionend":return Mp&&s.locale!=="ko"?null:s.data;default:return null}}var Ow={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Bp(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s==="input"?!!Ow[n.type]:s==="textarea"}function $p(n,s,a,c){rs(c),s=ou(s,"onChange"),0<s.length&&(a=new ci("onChange","change",null,a,c),n.push({event:a,listeners:s}))}var va=null,wa=null;function Lw(n){am(n,0)}function nu(n){var s=co(n);if(et(s))return n}function Mw(n,s){if(n==="change")return s}var Hp=!1;if(f){var wh;if(f){var Eh="oninput"in document;if(!Eh){var qp=document.createElement("div");qp.setAttribute("oninput","return;"),Eh=typeof qp.oninput=="function"}wh=Eh}else wh=!1;Hp=wh&&(!document.documentMode||9<document.documentMode)}function Wp(){va&&(va.detachEvent("onpropertychange",Kp),wa=va=null)}function Kp(n){if(n.propertyName==="value"&&nu(wa)){var s=[];$p(s,wa,n,$i(n)),Fl(Lw,s)}}function jw(n,s,a){n==="focusin"?(Wp(),va=s,wa=a,va.attachEvent("onpropertychange",Kp)):n==="focusout"&&Wp()}function Fw(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return nu(wa)}function Uw(n,s){if(n==="click")return nu(s)}function zw(n,s){if(n==="input"||n==="change")return nu(s)}function Bw(n,s){return n===s&&(n!==0||1/n===1/s)||n!==n&&s!==s}var Dn=typeof Object.is=="function"?Object.is:Bw;function Ea(n,s){if(Dn(n,s))return!0;if(typeof n!="object"||n===null||typeof s!="object"||s===null)return!1;var a=Object.keys(n),c=Object.keys(s);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(s,d)||!Dn(n[d],s[d]))return!1}return!0}function Gp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Qp(n,s){var a=Gp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=s&&c>=s)return{node:a,offset:s-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Gp(a)}}function Jp(n,s){return n&&s?n===s?!0:n&&n.nodeType===3?!1:s&&s.nodeType===3?Jp(n,s.parentNode):"contains"in n?n.contains(s):n.compareDocumentPosition?!!(n.compareDocumentPosition(s)&16):!1:!1}function Yp(){for(var n=window,s=tt();s instanceof n.HTMLIFrameElement;){try{var a=typeof s.contentWindow.location.href=="string"}catch{a=!1}if(a)n=s.contentWindow;else break;s=tt(n.document)}return s}function Th(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s&&(s==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||s==="textarea"||n.contentEditable==="true")}function $w(n){var s=Yp(),a=n.focusedElem,c=n.selectionRange;if(s!==a&&a&&a.ownerDocument&&Jp(a.ownerDocument.documentElement,a)){if(c!==null&&Th(a)){if(s=c.start,n=c.end,n===void 0&&(n=s),"selectionStart"in a)a.selectionStart=s,a.selectionEnd=Math.min(n,a.value.length);else if(n=(s=a.ownerDocument||document)&&s.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,p=Math.min(c.start,d);c=c.end===void 0?p:Math.min(c.end,d),!n.extend&&p>c&&(d=c,c=p,p=d),d=Qp(a,p);var v=Qp(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(s=s.createRange(),s.setStart(d.node,d.offset),n.removeAllRanges(),p>c?(n.addRange(s),n.extend(v.node,v.offset)):(s.setEnd(v.node,v.offset),n.addRange(s)))}}for(s=[],n=a;n=n.parentNode;)n.nodeType===1&&s.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<s.length;a++)n=s[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Hw=f&&"documentMode"in document&&11>=document.documentMode,oo=null,Ih=null,Ta=null,xh=!1;function Xp(n,s,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;xh||oo==null||oo!==tt(c)||(c=oo,"selectionStart"in c&&Th(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ta&&Ea(Ta,c)||(Ta=c,c=ou(Ih,"onSelect"),0<c.length&&(s=new ci("onSelect","select",null,s,a),n.push({event:s,listeners:c}),s.target=oo)))}function ru(n,s){var a={};return a[n.toLowerCase()]=s.toLowerCase(),a["Webkit"+n]="webkit"+s,a["Moz"+n]="moz"+s,a}var ao={animationend:ru("Animation","AnimationEnd"),animationiteration:ru("Animation","AnimationIteration"),animationstart:ru("Animation","AnimationStart"),transitionend:ru("Transition","TransitionEnd")},Sh={},Zp={};f&&(Zp=document.createElement("div").style,"AnimationEvent"in window||(delete ao.animationend.animation,delete ao.animationiteration.animation,delete ao.animationstart.animation),"TransitionEvent"in window||delete ao.transitionend.transition);function su(n){if(Sh[n])return Sh[n];if(!ao[n])return n;var s=ao[n],a;for(a in s)if(s.hasOwnProperty(a)&&a in Zp)return Sh[n]=s[a];return n}var em=su("animationend"),tm=su("animationiteration"),nm=su("animationstart"),rm=su("transitionend"),sm=new Map,im="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function fs(n,s){sm.set(n,s),l(s,[n])}for(var Ah=0;Ah<im.length;Ah++){var kh=im[Ah],qw=kh.toLowerCase(),Ww=kh[0].toUpperCase()+kh.slice(1);fs(qw,"on"+Ww)}fs(em,"onAnimationEnd"),fs(tm,"onAnimationIteration"),fs(nm,"onAnimationStart"),fs("dblclick","onDoubleClick"),fs("focusin","onFocus"),fs("focusout","onBlur"),fs(rm,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ia="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Kw=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ia));function om(n,s,a){var c=n.type||"unknown-event";n.currentTarget=a,ta(c,s,void 0,n),n.currentTarget=null}function am(n,s){s=(s&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var p=void 0;if(s)for(var v=c.length-1;0<=v;v--){var S=c[v],N=S.instance,U=S.currentTarget;if(S=S.listener,N!==p&&d.isPropagationStopped())break e;om(d,S,U),p=N}else for(v=0;v<c.length;v++){if(S=c[v],N=S.instance,U=S.currentTarget,S=S.listener,N!==p&&d.isPropagationStopped())break e;om(d,S,U),p=N}}}if(Hi)throw n=_n,Hi=!1,_n=null,n}function Ye(n,s){var a=s[Oh];a===void 0&&(a=s[Oh]=new Set);var c=n+"__bubble";a.has(c)||(lm(s,n,2,!1),a.add(c))}function Ch(n,s,a){var c=0;s&&(c|=4),lm(a,n,c,s)}var iu="_reactListening"+Math.random().toString(36).slice(2);function xa(n){if(!n[iu]){n[iu]=!0,i.forEach(function(a){a!=="selectionchange"&&(Kw.has(a)||Ch(a,!1,n),Ch(a,!0,n))});var s=n.nodeType===9?n:n.ownerDocument;s===null||s[iu]||(s[iu]=!0,Ch("selectionchange",!1,s))}}function lm(n,s,a,c){switch(Xi(s)){case 1:var d=Zn;break;case 4:d=Jl;break;default:d=pa}a=d.bind(null,s,a,n),d=void 0,!is||s!=="touchstart"&&s!=="touchmove"&&s!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(s,a,{capture:!0,passive:d}):n.addEventListener(s,a,!0):d!==void 0?n.addEventListener(s,a,{passive:d}):n.addEventListener(s,a,!1)}function Rh(n,s,a,c,d){var p=c;if((s&1)===0&&(s&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var S=c.stateNode.containerInfo;if(S===d||S.nodeType===8&&S.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var N=v.tag;if((N===3||N===4)&&(N=v.stateNode.containerInfo,N===d||N.nodeType===8&&N.parentNode===d))return;v=v.return}for(;S!==null;){if(v=di(S),v===null)return;if(N=v.tag,N===5||N===6){c=p=v;continue e}S=S.parentNode}}c=c.return}Fl(function(){var U=p,Y=$i(a),X=[];e:{var J=sm.get(n);if(J!==void 0){var ie=ci,ue=n;switch(n){case"keypress":if(ui(a)===0)break e;case"keydown":case"keyup":ie=$e;break;case"focusin":ue="focus",ie=Vt;break;case"focusout":ue="blur",ie=Vt;break;case"beforeblur":case"afterblur":ie=Vt;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ie=ga;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ie=Zl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ie=rr;break;case em:case tm:case nm:ie=tu;break;case rm:ie=so;break;case"scroll":ie=eo;break;case"wheel":ie=Pw;break;case"copy":case"cut":case"paste":ie=u;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ie=hn}var he=(s&4)!==0,pt=!he&&n==="scroll",L=he?J!==null?J+"Capture":null:J;he=[];for(var D=U,F;D!==null;){F=D;var ee=F.stateNode;if(F.tag===5&&ee!==null&&(F=ee,L!==null&&(ee=Zs(D,L),ee!=null&&he.push(Sa(D,ee,F)))),pt)break;D=D.return}0<he.length&&(J=new ie(J,ue,null,a,Y),X.push({event:J,listeners:he}))}}if((s&7)===0){e:{if(J=n==="mouseover"||n==="pointerover",ie=n==="mouseout"||n==="pointerout",J&&a!==ns&&(ue=a.relatedTarget||a.fromElement)&&(di(ue)||ue[Cr]))break e;if((ie||J)&&(J=Y.window===Y?Y:(J=Y.ownerDocument)?J.defaultView||J.parentWindow:window,ie?(ue=a.relatedTarget||a.toElement,ie=U,ue=ue?di(ue):null,ue!==null&&(pt=Nn(ue),ue!==pt||ue.tag!==5&&ue.tag!==6)&&(ue=null)):(ie=null,ue=U),ie!==ue)){if(he=ga,ee="onMouseLeave",L="onMouseEnter",D="mouse",(n==="pointerout"||n==="pointerover")&&(he=hn,ee="onPointerLeave",L="onPointerEnter",D="pointer"),pt=ie==null?J:co(ie),F=ue==null?J:co(ue),J=new he(ee,D+"leave",ie,a,Y),J.target=pt,J.relatedTarget=F,ee=null,di(Y)===U&&(he=new he(L,D+"enter",ue,a,Y),he.target=F,he.relatedTarget=pt,ee=he),pt=ee,ie&&ue)t:{for(he=ie,L=ue,D=0,F=he;F;F=lo(F))D++;for(F=0,ee=L;ee;ee=lo(ee))F++;for(;0<D-F;)he=lo(he),D--;for(;0<F-D;)L=lo(L),F--;for(;D--;){if(he===L||L!==null&&he===L.alternate)break t;he=lo(he),L=lo(L)}he=null}else he=null;ie!==null&&um(X,J,ie,he,!1),ue!==null&&pt!==null&&um(X,pt,ue,he,!0)}}e:{if(J=U?co(U):window,ie=J.nodeName&&J.nodeName.toLowerCase(),ie==="select"||ie==="input"&&J.type==="file")var fe=Mw;else if(Bp(J))if(Hp)fe=zw;else{fe=Fw;var we=jw}else(ie=J.nodeName)&&ie.toLowerCase()==="input"&&(J.type==="checkbox"||J.type==="radio")&&(fe=Uw);if(fe&&(fe=fe(n,U))){$p(X,fe,a,Y);break e}we&&we(n,J,U),n==="focusout"&&(we=J._wrapperState)&&we.controlled&&J.type==="number"&&_t(J,"number",J.value)}switch(we=U?co(U):window,n){case"focusin":(Bp(we)||we.contentEditable==="true")&&(oo=we,Ih=U,Ta=null);break;case"focusout":Ta=Ih=oo=null;break;case"mousedown":xh=!0;break;case"contextmenu":case"mouseup":case"dragend":xh=!1,Xp(X,a,Y);break;case"selectionchange":if(Hw)break;case"keydown":case"keyup":Xp(X,a,Y)}var Ee;if(vh)e:{switch(n){case"compositionstart":var ke="onCompositionStart";break e;case"compositionend":ke="onCompositionEnd";break e;case"compositionupdate":ke="onCompositionUpdate";break e}ke=void 0}else io?Up(n,a)&&(ke="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(ke="onCompositionStart");ke&&(Mp&&a.locale!=="ko"&&(io||ke!=="onCompositionStart"?ke==="onCompositionEnd"&&io&&(Ee=Yl()):(un=Y,Zi="value"in un?un.value:un.textContent,io=!0)),we=ou(U,ke),0<we.length&&(ke=new y(ke,n,null,a,Y),X.push({event:ke,listeners:we}),Ee?ke.data=Ee:(Ee=zp(a),Ee!==null&&(ke.data=Ee)))),(Ee=bw?Dw(n,a):Vw(n,a))&&(U=ou(U,"onBeforeInput"),0<U.length&&(Y=new y("onBeforeInput","beforeinput",null,a,Y),X.push({event:Y,listeners:U}),Y.data=Ee))}am(X,s)})}function Sa(n,s,a){return{instance:n,listener:s,currentTarget:a}}function ou(n,s){for(var a=s+"Capture",c=[];n!==null;){var d=n,p=d.stateNode;d.tag===5&&p!==null&&(d=p,p=Zs(n,a),p!=null&&c.unshift(Sa(n,p,d)),p=Zs(n,s),p!=null&&c.push(Sa(n,p,d))),n=n.return}return c}function lo(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function um(n,s,a,c,d){for(var p=s._reactName,v=[];a!==null&&a!==c;){var S=a,N=S.alternate,U=S.stateNode;if(N!==null&&N===c)break;S.tag===5&&U!==null&&(S=U,d?(N=Zs(a,p),N!=null&&v.unshift(Sa(a,N,S))):d||(N=Zs(a,p),N!=null&&v.push(Sa(a,N,S)))),a=a.return}v.length!==0&&n.push({event:s,listeners:v})}var Gw=/\r\n?/g,Qw=/\u0000|\uFFFD/g;function cm(n){return(typeof n=="string"?n:""+n).replace(Gw,`
`).replace(Qw,"")}function au(n,s,a){if(s=cm(s),cm(n)!==s&&a)throw Error(t(425))}function lu(){}var Ph=null,Nh=null;function bh(n,s){return n==="textarea"||n==="noscript"||typeof s.children=="string"||typeof s.children=="number"||typeof s.dangerouslySetInnerHTML=="object"&&s.dangerouslySetInnerHTML!==null&&s.dangerouslySetInnerHTML.__html!=null}var Dh=typeof setTimeout=="function"?setTimeout:void 0,Jw=typeof clearTimeout=="function"?clearTimeout:void 0,hm=typeof Promise=="function"?Promise:void 0,Yw=typeof queueMicrotask=="function"?queueMicrotask:typeof hm<"u"?function(n){return hm.resolve(null).then(n).catch(Xw)}:Dh;function Xw(n){setTimeout(function(){throw n})}function Vh(n,s){var a=s,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),cs(s);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);cs(s)}function ps(n){for(;n!=null;n=n.nextSibling){var s=n.nodeType;if(s===1||s===3)break;if(s===8){if(s=n.data,s==="$"||s==="$!"||s==="$?")break;if(s==="/$")return null}}return n}function dm(n){n=n.previousSibling;for(var s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(s===0)return n;s--}else a==="/$"&&s++}n=n.previousSibling}return null}var uo=Math.random().toString(36).slice(2),ir="__reactFiber$"+uo,Aa="__reactProps$"+uo,Cr="__reactContainer$"+uo,Oh="__reactEvents$"+uo,Zw="__reactListeners$"+uo,eE="__reactHandles$"+uo;function di(n){var s=n[ir];if(s)return s;for(var a=n.parentNode;a;){if(s=a[Cr]||a[ir]){if(a=s.alternate,s.child!==null||a!==null&&a.child!==null)for(n=dm(n);n!==null;){if(a=n[ir])return a;n=dm(n)}return s}n=a,a=n.parentNode}return null}function ka(n){return n=n[ir]||n[Cr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function co(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function uu(n){return n[Aa]||null}var Lh=[],ho=-1;function ms(n){return{current:n}}function Xe(n){0>ho||(n.current=Lh[ho],Lh[ho]=null,ho--)}function Ge(n,s){ho++,Lh[ho]=n.current,n.current=s}var gs={},zt=ms(gs),Yt=ms(!1),fi=gs;function fo(n,s){var a=n.type.contextTypes;if(!a)return gs;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===s)return c.__reactInternalMemoizedMaskedChildContext;var d={},p;for(p in a)d[p]=s[p];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=s,n.__reactInternalMemoizedMaskedChildContext=d),d}function Xt(n){return n=n.childContextTypes,n!=null}function cu(){Xe(Yt),Xe(zt)}function fm(n,s,a){if(zt.current!==gs)throw Error(t(168));Ge(zt,s),Ge(Yt,a)}function pm(n,s,a){var c=n.stateNode;if(s=s.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in s))throw Error(t(108,ve(n)||"Unknown",d));return Z({},a,c)}function hu(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||gs,fi=zt.current,Ge(zt,n),Ge(Yt,Yt.current),!0}function mm(n,s,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=pm(n,s,fi),c.__reactInternalMemoizedMergedChildContext=n,Xe(Yt),Xe(zt),Ge(zt,n)):Xe(Yt),Ge(Yt,a)}var Rr=null,du=!1,Mh=!1;function gm(n){Rr===null?Rr=[n]:Rr.push(n)}function tE(n){du=!0,gm(n)}function ys(){if(!Mh&&Rr!==null){Mh=!0;var n=0,s=Le;try{var a=Rr;for(Le=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Rr=null,du=!1}catch(d){throw Rr!==null&&(Rr=Rr.slice(n+1)),ra(Wi,ys),d}finally{Le=s,Mh=!1}}return null}var po=[],mo=0,fu=null,pu=0,wn=[],En=0,pi=null,Pr=1,Nr="";function mi(n,s){po[mo++]=pu,po[mo++]=fu,fu=n,pu=s}function ym(n,s,a){wn[En++]=Pr,wn[En++]=Nr,wn[En++]=pi,pi=n;var c=Pr;n=Nr;var d=32-an(c)-1;c&=~(1<<d),a+=1;var p=32-an(s)+d;if(30<p){var v=d-d%5;p=(c&(1<<v)-1).toString(32),c>>=v,d-=v,Pr=1<<32-an(s)+d|a<<d|c,Nr=p+n}else Pr=1<<p|a<<d|c,Nr=n}function jh(n){n.return!==null&&(mi(n,1),ym(n,1,0))}function Fh(n){for(;n===fu;)fu=po[--mo],po[mo]=null,pu=po[--mo],po[mo]=null;for(;n===pi;)pi=wn[--En],wn[En]=null,Nr=wn[--En],wn[En]=null,Pr=wn[--En],wn[En]=null}var dn=null,fn=null,nt=!1,Vn=null;function _m(n,s){var a=Sn(5,null,null,0);a.elementType="DELETED",a.stateNode=s,a.return=n,s=n.deletions,s===null?(n.deletions=[a],n.flags|=16):s.push(a)}function vm(n,s){switch(n.tag){case 5:var a=n.type;return s=s.nodeType!==1||a.toLowerCase()!==s.nodeName.toLowerCase()?null:s,s!==null?(n.stateNode=s,dn=n,fn=ps(s.firstChild),!0):!1;case 6:return s=n.pendingProps===""||s.nodeType!==3?null:s,s!==null?(n.stateNode=s,dn=n,fn=null,!0):!1;case 13:return s=s.nodeType!==8?null:s,s!==null?(a=pi!==null?{id:Pr,overflow:Nr}:null,n.memoizedState={dehydrated:s,treeContext:a,retryLane:1073741824},a=Sn(18,null,null,0),a.stateNode=s,a.return=n,n.child=a,dn=n,fn=null,!0):!1;default:return!1}}function Uh(n){return(n.mode&1)!==0&&(n.flags&128)===0}function zh(n){if(nt){var s=fn;if(s){var a=s;if(!vm(n,s)){if(Uh(n))throw Error(t(418));s=ps(a.nextSibling);var c=dn;s&&vm(n,s)?_m(c,a):(n.flags=n.flags&-4097|2,nt=!1,dn=n)}}else{if(Uh(n))throw Error(t(418));n.flags=n.flags&-4097|2,nt=!1,dn=n}}}function wm(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;dn=n}function mu(n){if(n!==dn)return!1;if(!nt)return wm(n),nt=!0,!1;var s;if((s=n.tag!==3)&&!(s=n.tag!==5)&&(s=n.type,s=s!=="head"&&s!=="body"&&!bh(n.type,n.memoizedProps)),s&&(s=fn)){if(Uh(n))throw Em(),Error(t(418));for(;s;)_m(n,s),s=ps(s.nextSibling)}if(wm(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(s===0){fn=ps(n.nextSibling);break e}s--}else a!=="$"&&a!=="$!"&&a!=="$?"||s++}n=n.nextSibling}fn=null}}else fn=dn?ps(n.stateNode.nextSibling):null;return!0}function Em(){for(var n=fn;n;)n=ps(n.nextSibling)}function go(){fn=dn=null,nt=!1}function Bh(n){Vn===null?Vn=[n]:Vn.push(n)}var nE=xe.ReactCurrentBatchConfig;function Ca(n,s,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,p=""+n;return s!==null&&s.ref!==null&&typeof s.ref=="function"&&s.ref._stringRef===p?s.ref:(s=function(v){var S=d.refs;v===null?delete S[p]:S[p]=v},s._stringRef=p,s)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function gu(n,s){throw n=Object.prototype.toString.call(s),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":n))}function Tm(n){var s=n._init;return s(n._payload)}function Im(n){function s(L,D){if(n){var F=L.deletions;F===null?(L.deletions=[D],L.flags|=16):F.push(D)}}function a(L,D){if(!n)return null;for(;D!==null;)s(L,D),D=D.sibling;return null}function c(L,D){for(L=new Map;D!==null;)D.key!==null?L.set(D.key,D):L.set(D.index,D),D=D.sibling;return L}function d(L,D){return L=Ss(L,D),L.index=0,L.sibling=null,L}function p(L,D,F){return L.index=F,n?(F=L.alternate,F!==null?(F=F.index,F<D?(L.flags|=2,D):F):(L.flags|=2,D)):(L.flags|=1048576,D)}function v(L){return n&&L.alternate===null&&(L.flags|=2),L}function S(L,D,F,ee){return D===null||D.tag!==6?(D=Dd(F,L.mode,ee),D.return=L,D):(D=d(D,F),D.return=L,D)}function N(L,D,F,ee){var fe=F.type;return fe===k?Y(L,D,F.props.children,ee,F.key):D!==null&&(D.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===Ct&&Tm(fe)===D.type)?(ee=d(D,F.props),ee.ref=Ca(L,D,F),ee.return=L,ee):(ee=Uu(F.type,F.key,F.props,null,L.mode,ee),ee.ref=Ca(L,D,F),ee.return=L,ee)}function U(L,D,F,ee){return D===null||D.tag!==4||D.stateNode.containerInfo!==F.containerInfo||D.stateNode.implementation!==F.implementation?(D=Vd(F,L.mode,ee),D.return=L,D):(D=d(D,F.children||[]),D.return=L,D)}function Y(L,D,F,ee,fe){return D===null||D.tag!==7?(D=Ii(F,L.mode,ee,fe),D.return=L,D):(D=d(D,F),D.return=L,D)}function X(L,D,F){if(typeof D=="string"&&D!==""||typeof D=="number")return D=Dd(""+D,L.mode,F),D.return=L,D;if(typeof D=="object"&&D!==null){switch(D.$$typeof){case Te:return F=Uu(D.type,D.key,D.props,null,L.mode,F),F.ref=Ca(L,null,D),F.return=L,F;case de:return D=Vd(D,L.mode,F),D.return=L,D;case Ct:var ee=D._init;return X(L,ee(D._payload),F)}if(dt(D)||ne(D))return D=Ii(D,L.mode,F,null),D.return=L,D;gu(L,D)}return null}function J(L,D,F,ee){var fe=D!==null?D.key:null;if(typeof F=="string"&&F!==""||typeof F=="number")return fe!==null?null:S(L,D,""+F,ee);if(typeof F=="object"&&F!==null){switch(F.$$typeof){case Te:return F.key===fe?N(L,D,F,ee):null;case de:return F.key===fe?U(L,D,F,ee):null;case Ct:return fe=F._init,J(L,D,fe(F._payload),ee)}if(dt(F)||ne(F))return fe!==null?null:Y(L,D,F,ee,null);gu(L,F)}return null}function ie(L,D,F,ee,fe){if(typeof ee=="string"&&ee!==""||typeof ee=="number")return L=L.get(F)||null,S(D,L,""+ee,fe);if(typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case Te:return L=L.get(ee.key===null?F:ee.key)||null,N(D,L,ee,fe);case de:return L=L.get(ee.key===null?F:ee.key)||null,U(D,L,ee,fe);case Ct:var we=ee._init;return ie(L,D,F,we(ee._payload),fe)}if(dt(ee)||ne(ee))return L=L.get(F)||null,Y(D,L,ee,fe,null);gu(D,ee)}return null}function ue(L,D,F,ee){for(var fe=null,we=null,Ee=D,ke=D=0,Nt=null;Ee!==null&&ke<F.length;ke++){Ee.index>ke?(Nt=Ee,Ee=null):Nt=Ee.sibling;var Fe=J(L,Ee,F[ke],ee);if(Fe===null){Ee===null&&(Ee=Nt);break}n&&Ee&&Fe.alternate===null&&s(L,Ee),D=p(Fe,D,ke),we===null?fe=Fe:we.sibling=Fe,we=Fe,Ee=Nt}if(ke===F.length)return a(L,Ee),nt&&mi(L,ke),fe;if(Ee===null){for(;ke<F.length;ke++)Ee=X(L,F[ke],ee),Ee!==null&&(D=p(Ee,D,ke),we===null?fe=Ee:we.sibling=Ee,we=Ee);return nt&&mi(L,ke),fe}for(Ee=c(L,Ee);ke<F.length;ke++)Nt=ie(Ee,L,ke,F[ke],ee),Nt!==null&&(n&&Nt.alternate!==null&&Ee.delete(Nt.key===null?ke:Nt.key),D=p(Nt,D,ke),we===null?fe=Nt:we.sibling=Nt,we=Nt);return n&&Ee.forEach(function(As){return s(L,As)}),nt&&mi(L,ke),fe}function he(L,D,F,ee){var fe=ne(F);if(typeof fe!="function")throw Error(t(150));if(F=fe.call(F),F==null)throw Error(t(151));for(var we=fe=null,Ee=D,ke=D=0,Nt=null,Fe=F.next();Ee!==null&&!Fe.done;ke++,Fe=F.next()){Ee.index>ke?(Nt=Ee,Ee=null):Nt=Ee.sibling;var As=J(L,Ee,Fe.value,ee);if(As===null){Ee===null&&(Ee=Nt);break}n&&Ee&&As.alternate===null&&s(L,Ee),D=p(As,D,ke),we===null?fe=As:we.sibling=As,we=As,Ee=Nt}if(Fe.done)return a(L,Ee),nt&&mi(L,ke),fe;if(Ee===null){for(;!Fe.done;ke++,Fe=F.next())Fe=X(L,Fe.value,ee),Fe!==null&&(D=p(Fe,D,ke),we===null?fe=Fe:we.sibling=Fe,we=Fe);return nt&&mi(L,ke),fe}for(Ee=c(L,Ee);!Fe.done;ke++,Fe=F.next())Fe=ie(Ee,L,ke,Fe.value,ee),Fe!==null&&(n&&Fe.alternate!==null&&Ee.delete(Fe.key===null?ke:Fe.key),D=p(Fe,D,ke),we===null?fe=Fe:we.sibling=Fe,we=Fe);return n&&Ee.forEach(function(OE){return s(L,OE)}),nt&&mi(L,ke),fe}function pt(L,D,F,ee){if(typeof F=="object"&&F!==null&&F.type===k&&F.key===null&&(F=F.props.children),typeof F=="object"&&F!==null){switch(F.$$typeof){case Te:e:{for(var fe=F.key,we=D;we!==null;){if(we.key===fe){if(fe=F.type,fe===k){if(we.tag===7){a(L,we.sibling),D=d(we,F.props.children),D.return=L,L=D;break e}}else if(we.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===Ct&&Tm(fe)===we.type){a(L,we.sibling),D=d(we,F.props),D.ref=Ca(L,we,F),D.return=L,L=D;break e}a(L,we);break}else s(L,we);we=we.sibling}F.type===k?(D=Ii(F.props.children,L.mode,ee,F.key),D.return=L,L=D):(ee=Uu(F.type,F.key,F.props,null,L.mode,ee),ee.ref=Ca(L,D,F),ee.return=L,L=ee)}return v(L);case de:e:{for(we=F.key;D!==null;){if(D.key===we)if(D.tag===4&&D.stateNode.containerInfo===F.containerInfo&&D.stateNode.implementation===F.implementation){a(L,D.sibling),D=d(D,F.children||[]),D.return=L,L=D;break e}else{a(L,D);break}else s(L,D);D=D.sibling}D=Vd(F,L.mode,ee),D.return=L,L=D}return v(L);case Ct:return we=F._init,pt(L,D,we(F._payload),ee)}if(dt(F))return ue(L,D,F,ee);if(ne(F))return he(L,D,F,ee);gu(L,F)}return typeof F=="string"&&F!==""||typeof F=="number"?(F=""+F,D!==null&&D.tag===6?(a(L,D.sibling),D=d(D,F),D.return=L,L=D):(a(L,D),D=Dd(F,L.mode,ee),D.return=L,L=D),v(L)):a(L,D)}return pt}var yo=Im(!0),xm=Im(!1),yu=ms(null),_u=null,_o=null,$h=null;function Hh(){$h=_o=_u=null}function qh(n){var s=yu.current;Xe(yu),n._currentValue=s}function Wh(n,s,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&s)!==s?(n.childLanes|=s,c!==null&&(c.childLanes|=s)):c!==null&&(c.childLanes&s)!==s&&(c.childLanes|=s),n===a)break;n=n.return}}function vo(n,s){_u=n,$h=_o=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&s)!==0&&(Zt=!0),n.firstContext=null)}function Tn(n){var s=n._currentValue;if($h!==n)if(n={context:n,memoizedValue:s,next:null},_o===null){if(_u===null)throw Error(t(308));_o=n,_u.dependencies={lanes:0,firstContext:n}}else _o=_o.next=n;return s}var gi=null;function Kh(n){gi===null?gi=[n]:gi.push(n)}function Sm(n,s,a,c){var d=s.interleaved;return d===null?(a.next=a,Kh(s)):(a.next=d.next,d.next=a),s.interleaved=a,br(n,c)}function br(n,s){n.lanes|=s;var a=n.alternate;for(a!==null&&(a.lanes|=s),a=n,n=n.return;n!==null;)n.childLanes|=s,a=n.alternate,a!==null&&(a.childLanes|=s),a=n,n=n.return;return a.tag===3?a.stateNode:null}var _s=!1;function Gh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Am(n,s){n=n.updateQueue,s.updateQueue===n&&(s.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Dr(n,s){return{eventTime:n,lane:s,tag:0,payload:null,callback:null,next:null}}function vs(n,s,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(je&2)!==0){var d=c.pending;return d===null?s.next=s:(s.next=d.next,d.next=s),c.pending=s,br(n,a)}return d=c.interleaved,d===null?(s.next=s,Kh(c)):(s.next=d.next,d.next=s),c.interleaved=s,br(n,a)}function vu(n,s,a){if(s=s.updateQueue,s!==null&&(s=s.shared,(a&4194240)!==0)){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,ua(n,a)}}function km(n,s){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,p=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};p===null?d=p=v:p=p.next=v,a=a.next}while(a!==null);p===null?d=p=s:p=p.next=s}else d=p=s;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:p,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=s:n.next=s,a.lastBaseUpdate=s}function wu(n,s,a,c){var d=n.updateQueue;_s=!1;var p=d.firstBaseUpdate,v=d.lastBaseUpdate,S=d.shared.pending;if(S!==null){d.shared.pending=null;var N=S,U=N.next;N.next=null,v===null?p=U:v.next=U,v=N;var Y=n.alternate;Y!==null&&(Y=Y.updateQueue,S=Y.lastBaseUpdate,S!==v&&(S===null?Y.firstBaseUpdate=U:S.next=U,Y.lastBaseUpdate=N))}if(p!==null){var X=d.baseState;v=0,Y=U=N=null,S=p;do{var J=S.lane,ie=S.eventTime;if((c&J)===J){Y!==null&&(Y=Y.next={eventTime:ie,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var ue=n,he=S;switch(J=s,ie=a,he.tag){case 1:if(ue=he.payload,typeof ue=="function"){X=ue.call(ie,X,J);break e}X=ue;break e;case 3:ue.flags=ue.flags&-65537|128;case 0:if(ue=he.payload,J=typeof ue=="function"?ue.call(ie,X,J):ue,J==null)break e;X=Z({},X,J);break e;case 2:_s=!0}}S.callback!==null&&S.lane!==0&&(n.flags|=64,J=d.effects,J===null?d.effects=[S]:J.push(S))}else ie={eventTime:ie,lane:J,tag:S.tag,payload:S.payload,callback:S.callback,next:null},Y===null?(U=Y=ie,N=X):Y=Y.next=ie,v|=J;if(S=S.next,S===null){if(S=d.shared.pending,S===null)break;J=S,S=J.next,J.next=null,d.lastBaseUpdate=J,d.shared.pending=null}}while(!0);if(Y===null&&(N=X),d.baseState=N,d.firstBaseUpdate=U,d.lastBaseUpdate=Y,s=d.shared.interleaved,s!==null){d=s;do v|=d.lane,d=d.next;while(d!==s)}else p===null&&(d.shared.lanes=0);vi|=v,n.lanes=v,n.memoizedState=X}}function Cm(n,s,a){if(n=s.effects,s.effects=null,n!==null)for(s=0;s<n.length;s++){var c=n[s],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var Ra={},or=ms(Ra),Pa=ms(Ra),Na=ms(Ra);function yi(n){if(n===Ra)throw Error(t(174));return n}function Qh(n,s){switch(Ge(Na,s),Ge(Pa,n),Ge(or,Ra),n=s.nodeType,n){case 9:case 11:s=(s=s.documentElement)?s.namespaceURI:Ui(null,"");break;default:n=n===8?s.parentNode:s,s=n.namespaceURI||null,n=n.tagName,s=Ui(s,n)}Xe(or),Ge(or,s)}function wo(){Xe(or),Xe(Pa),Xe(Na)}function Rm(n){yi(Na.current);var s=yi(or.current),a=Ui(s,n.type);s!==a&&(Ge(Pa,n),Ge(or,a))}function Jh(n){Pa.current===n&&(Xe(or),Xe(Pa))}var it=ms(0);function Eu(n){for(var s=n;s!==null;){if(s.tag===13){var a=s.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return s}else if(s.tag===19&&s.memoizedProps.revealOrder!==void 0){if((s.flags&128)!==0)return s}else if(s.child!==null){s.child.return=s,s=s.child;continue}if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return null;s=s.return}s.sibling.return=s.return,s=s.sibling}return null}var Yh=[];function Xh(){for(var n=0;n<Yh.length;n++)Yh[n]._workInProgressVersionPrimary=null;Yh.length=0}var Tu=xe.ReactCurrentDispatcher,Zh=xe.ReactCurrentBatchConfig,_i=0,ot=null,xt=null,Rt=null,Iu=!1,ba=!1,Da=0,rE=0;function Bt(){throw Error(t(321))}function ed(n,s){if(s===null)return!1;for(var a=0;a<s.length&&a<n.length;a++)if(!Dn(n[a],s[a]))return!1;return!0}function td(n,s,a,c,d,p){if(_i=p,ot=s,s.memoizedState=null,s.updateQueue=null,s.lanes=0,Tu.current=n===null||n.memoizedState===null?aE:lE,n=a(c,d),ba){p=0;do{if(ba=!1,Da=0,25<=p)throw Error(t(301));p+=1,Rt=xt=null,s.updateQueue=null,Tu.current=uE,n=a(c,d)}while(ba)}if(Tu.current=Au,s=xt!==null&&xt.next!==null,_i=0,Rt=xt=ot=null,Iu=!1,s)throw Error(t(300));return n}function nd(){var n=Da!==0;return Da=0,n}function ar(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Rt===null?ot.memoizedState=Rt=n:Rt=Rt.next=n,Rt}function In(){if(xt===null){var n=ot.alternate;n=n!==null?n.memoizedState:null}else n=xt.next;var s=Rt===null?ot.memoizedState:Rt.next;if(s!==null)Rt=s,xt=n;else{if(n===null)throw Error(t(310));xt=n,n={memoizedState:xt.memoizedState,baseState:xt.baseState,baseQueue:xt.baseQueue,queue:xt.queue,next:null},Rt===null?ot.memoizedState=Rt=n:Rt=Rt.next=n}return Rt}function Va(n,s){return typeof s=="function"?s(n):s}function rd(n){var s=In(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=xt,d=c.baseQueue,p=a.pending;if(p!==null){if(d!==null){var v=d.next;d.next=p.next,p.next=v}c.baseQueue=d=p,a.pending=null}if(d!==null){p=d.next,c=c.baseState;var S=v=null,N=null,U=p;do{var Y=U.lane;if((_i&Y)===Y)N!==null&&(N=N.next={lane:0,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null}),c=U.hasEagerState?U.eagerState:n(c,U.action);else{var X={lane:Y,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null};N===null?(S=N=X,v=c):N=N.next=X,ot.lanes|=Y,vi|=Y}U=U.next}while(U!==null&&U!==p);N===null?v=c:N.next=S,Dn(c,s.memoizedState)||(Zt=!0),s.memoizedState=c,s.baseState=v,s.baseQueue=N,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do p=d.lane,ot.lanes|=p,vi|=p,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[s.memoizedState,a.dispatch]}function sd(n){var s=In(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,p=s.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do p=n(p,v.action),v=v.next;while(v!==d);Dn(p,s.memoizedState)||(Zt=!0),s.memoizedState=p,s.baseQueue===null&&(s.baseState=p),a.lastRenderedState=p}return[p,c]}function Pm(){}function Nm(n,s){var a=ot,c=In(),d=s(),p=!Dn(c.memoizedState,d);if(p&&(c.memoizedState=d,Zt=!0),c=c.queue,id(Vm.bind(null,a,c,n),[n]),c.getSnapshot!==s||p||Rt!==null&&Rt.memoizedState.tag&1){if(a.flags|=2048,Oa(9,Dm.bind(null,a,c,d,s),void 0,null),Pt===null)throw Error(t(349));(_i&30)!==0||bm(a,s,d)}return d}function bm(n,s,a){n.flags|=16384,n={getSnapshot:s,value:a},s=ot.updateQueue,s===null?(s={lastEffect:null,stores:null},ot.updateQueue=s,s.stores=[n]):(a=s.stores,a===null?s.stores=[n]:a.push(n))}function Dm(n,s,a,c){s.value=a,s.getSnapshot=c,Om(s)&&Lm(n)}function Vm(n,s,a){return a(function(){Om(s)&&Lm(n)})}function Om(n){var s=n.getSnapshot;n=n.value;try{var a=s();return!Dn(n,a)}catch{return!0}}function Lm(n){var s=br(n,1);s!==null&&jn(s,n,1,-1)}function Mm(n){var s=ar();return typeof n=="function"&&(n=n()),s.memoizedState=s.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Va,lastRenderedState:n},s.queue=n,n=n.dispatch=oE.bind(null,ot,n),[s.memoizedState,n]}function Oa(n,s,a,c){return n={tag:n,create:s,destroy:a,deps:c,next:null},s=ot.updateQueue,s===null?(s={lastEffect:null,stores:null},ot.updateQueue=s,s.lastEffect=n.next=n):(a=s.lastEffect,a===null?s.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,s.lastEffect=n)),n}function jm(){return In().memoizedState}function xu(n,s,a,c){var d=ar();ot.flags|=n,d.memoizedState=Oa(1|s,a,void 0,c===void 0?null:c)}function Su(n,s,a,c){var d=In();c=c===void 0?null:c;var p=void 0;if(xt!==null){var v=xt.memoizedState;if(p=v.destroy,c!==null&&ed(c,v.deps)){d.memoizedState=Oa(s,a,p,c);return}}ot.flags|=n,d.memoizedState=Oa(1|s,a,p,c)}function Fm(n,s){return xu(8390656,8,n,s)}function id(n,s){return Su(2048,8,n,s)}function Um(n,s){return Su(4,2,n,s)}function zm(n,s){return Su(4,4,n,s)}function Bm(n,s){if(typeof s=="function")return n=n(),s(n),function(){s(null)};if(s!=null)return n=n(),s.current=n,function(){s.current=null}}function $m(n,s,a){return a=a!=null?a.concat([n]):null,Su(4,4,Bm.bind(null,s,n),a)}function od(){}function Hm(n,s){var a=In();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&ed(s,c[1])?c[0]:(a.memoizedState=[n,s],n)}function qm(n,s){var a=In();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&ed(s,c[1])?c[0]:(n=n(),a.memoizedState=[n,s],n)}function Wm(n,s,a){return(_i&21)===0?(n.baseState&&(n.baseState=!1,Zt=!0),n.memoizedState=a):(Dn(a,s)||(a=aa(),ot.lanes|=a,vi|=a,n.baseState=!0),s)}function sE(n,s){var a=Le;Le=a!==0&&4>a?a:4,n(!0);var c=Zh.transition;Zh.transition={};try{n(!1),s()}finally{Le=a,Zh.transition=c}}function Km(){return In().memoizedState}function iE(n,s,a){var c=Is(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Gm(n))Qm(s,a);else if(a=Sm(n,s,a,c),a!==null){var d=Jt();jn(a,n,c,d),Jm(a,s,c)}}function oE(n,s,a){var c=Is(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Gm(n))Qm(s,d);else{var p=n.alternate;if(n.lanes===0&&(p===null||p.lanes===0)&&(p=s.lastRenderedReducer,p!==null))try{var v=s.lastRenderedState,S=p(v,a);if(d.hasEagerState=!0,d.eagerState=S,Dn(S,v)){var N=s.interleaved;N===null?(d.next=d,Kh(s)):(d.next=N.next,N.next=d),s.interleaved=d;return}}catch{}finally{}a=Sm(n,s,d,c),a!==null&&(d=Jt(),jn(a,n,c,d),Jm(a,s,c))}}function Gm(n){var s=n.alternate;return n===ot||s!==null&&s===ot}function Qm(n,s){ba=Iu=!0;var a=n.pending;a===null?s.next=s:(s.next=a.next,a.next=s),n.pending=s}function Jm(n,s,a){if((a&4194240)!==0){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,ua(n,a)}}var Au={readContext:Tn,useCallback:Bt,useContext:Bt,useEffect:Bt,useImperativeHandle:Bt,useInsertionEffect:Bt,useLayoutEffect:Bt,useMemo:Bt,useReducer:Bt,useRef:Bt,useState:Bt,useDebugValue:Bt,useDeferredValue:Bt,useTransition:Bt,useMutableSource:Bt,useSyncExternalStore:Bt,useId:Bt,unstable_isNewReconciler:!1},aE={readContext:Tn,useCallback:function(n,s){return ar().memoizedState=[n,s===void 0?null:s],n},useContext:Tn,useEffect:Fm,useImperativeHandle:function(n,s,a){return a=a!=null?a.concat([n]):null,xu(4194308,4,Bm.bind(null,s,n),a)},useLayoutEffect:function(n,s){return xu(4194308,4,n,s)},useInsertionEffect:function(n,s){return xu(4,2,n,s)},useMemo:function(n,s){var a=ar();return s=s===void 0?null:s,n=n(),a.memoizedState=[n,s],n},useReducer:function(n,s,a){var c=ar();return s=a!==void 0?a(s):s,c.memoizedState=c.baseState=s,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:s},c.queue=n,n=n.dispatch=iE.bind(null,ot,n),[c.memoizedState,n]},useRef:function(n){var s=ar();return n={current:n},s.memoizedState=n},useState:Mm,useDebugValue:od,useDeferredValue:function(n){return ar().memoizedState=n},useTransition:function(){var n=Mm(!1),s=n[0];return n=sE.bind(null,n[1]),ar().memoizedState=n,[s,n]},useMutableSource:function(){},useSyncExternalStore:function(n,s,a){var c=ot,d=ar();if(nt){if(a===void 0)throw Error(t(407));a=a()}else{if(a=s(),Pt===null)throw Error(t(349));(_i&30)!==0||bm(c,s,a)}d.memoizedState=a;var p={value:a,getSnapshot:s};return d.queue=p,Fm(Vm.bind(null,c,p,n),[n]),c.flags|=2048,Oa(9,Dm.bind(null,c,p,a,s),void 0,null),a},useId:function(){var n=ar(),s=Pt.identifierPrefix;if(nt){var a=Nr,c=Pr;a=(c&~(1<<32-an(c)-1)).toString(32)+a,s=":"+s+"R"+a,a=Da++,0<a&&(s+="H"+a.toString(32)),s+=":"}else a=rE++,s=":"+s+"r"+a.toString(32)+":";return n.memoizedState=s},unstable_isNewReconciler:!1},lE={readContext:Tn,useCallback:Hm,useContext:Tn,useEffect:id,useImperativeHandle:$m,useInsertionEffect:Um,useLayoutEffect:zm,useMemo:qm,useReducer:rd,useRef:jm,useState:function(){return rd(Va)},useDebugValue:od,useDeferredValue:function(n){var s=In();return Wm(s,xt.memoizedState,n)},useTransition:function(){var n=rd(Va)[0],s=In().memoizedState;return[n,s]},useMutableSource:Pm,useSyncExternalStore:Nm,useId:Km,unstable_isNewReconciler:!1},uE={readContext:Tn,useCallback:Hm,useContext:Tn,useEffect:id,useImperativeHandle:$m,useInsertionEffect:Um,useLayoutEffect:zm,useMemo:qm,useReducer:sd,useRef:jm,useState:function(){return sd(Va)},useDebugValue:od,useDeferredValue:function(n){var s=In();return xt===null?s.memoizedState=n:Wm(s,xt.memoizedState,n)},useTransition:function(){var n=sd(Va)[0],s=In().memoizedState;return[n,s]},useMutableSource:Pm,useSyncExternalStore:Nm,useId:Km,unstable_isNewReconciler:!1};function On(n,s){if(n&&n.defaultProps){s=Z({},s),n=n.defaultProps;for(var a in n)s[a]===void 0&&(s[a]=n[a]);return s}return s}function ad(n,s,a,c){s=n.memoizedState,a=a(c,s),a=a==null?s:Z({},s,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var ku={isMounted:function(n){return(n=n._reactInternals)?Nn(n)===n:!1},enqueueSetState:function(n,s,a){n=n._reactInternals;var c=Jt(),d=Is(n),p=Dr(c,d);p.payload=s,a!=null&&(p.callback=a),s=vs(n,p,d),s!==null&&(jn(s,n,d,c),vu(s,n,d))},enqueueReplaceState:function(n,s,a){n=n._reactInternals;var c=Jt(),d=Is(n),p=Dr(c,d);p.tag=1,p.payload=s,a!=null&&(p.callback=a),s=vs(n,p,d),s!==null&&(jn(s,n,d,c),vu(s,n,d))},enqueueForceUpdate:function(n,s){n=n._reactInternals;var a=Jt(),c=Is(n),d=Dr(a,c);d.tag=2,s!=null&&(d.callback=s),s=vs(n,d,c),s!==null&&(jn(s,n,c,a),vu(s,n,c))}};function Ym(n,s,a,c,d,p,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,p,v):s.prototype&&s.prototype.isPureReactComponent?!Ea(a,c)||!Ea(d,p):!0}function Xm(n,s,a){var c=!1,d=gs,p=s.contextType;return typeof p=="object"&&p!==null?p=Tn(p):(d=Xt(s)?fi:zt.current,c=s.contextTypes,p=(c=c!=null)?fo(n,d):gs),s=new s(a,p),n.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=ku,n.stateNode=s,s._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=p),s}function Zm(n,s,a,c){n=s.state,typeof s.componentWillReceiveProps=="function"&&s.componentWillReceiveProps(a,c),typeof s.UNSAFE_componentWillReceiveProps=="function"&&s.UNSAFE_componentWillReceiveProps(a,c),s.state!==n&&ku.enqueueReplaceState(s,s.state,null)}function ld(n,s,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Gh(n);var p=s.contextType;typeof p=="object"&&p!==null?d.context=Tn(p):(p=Xt(s)?fi:zt.current,d.context=fo(n,p)),d.state=n.memoizedState,p=s.getDerivedStateFromProps,typeof p=="function"&&(ad(n,s,p,a),d.state=n.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(s=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),s!==d.state&&ku.enqueueReplaceState(d,d.state,null),wu(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function Eo(n,s){try{var a="",c=s;do a+=pe(c),c=c.return;while(c);var d=a}catch(p){d=`
Error generating stack: `+p.message+`
`+p.stack}return{value:n,source:s,stack:d,digest:null}}function ud(n,s,a){return{value:n,source:null,stack:a??null,digest:s??null}}function cd(n,s){try{console.error(s.value)}catch(a){setTimeout(function(){throw a})}}var cE=typeof WeakMap=="function"?WeakMap:Map;function eg(n,s,a){a=Dr(-1,a),a.tag=3,a.payload={element:null};var c=s.value;return a.callback=function(){Vu||(Vu=!0,Sd=c),cd(n,s)},a}function tg(n,s,a){a=Dr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=s.value;a.payload=function(){return c(d)},a.callback=function(){cd(n,s)}}var p=n.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(a.callback=function(){cd(n,s),typeof c!="function"&&(Es===null?Es=new Set([this]):Es.add(this));var v=s.stack;this.componentDidCatch(s.value,{componentStack:v!==null?v:""})}),a}function ng(n,s,a){var c=n.pingCache;if(c===null){c=n.pingCache=new cE;var d=new Set;c.set(s,d)}else d=c.get(s),d===void 0&&(d=new Set,c.set(s,d));d.has(a)||(d.add(a),n=xE.bind(null,n,s,a),s.then(n,n))}function rg(n){do{var s;if((s=n.tag===13)&&(s=n.memoizedState,s=s!==null?s.dehydrated!==null:!0),s)return n;n=n.return}while(n!==null);return null}function sg(n,s,a,c,d){return(n.mode&1)===0?(n===s?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(s=Dr(-1,1),s.tag=2,vs(a,s,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var hE=xe.ReactCurrentOwner,Zt=!1;function Qt(n,s,a,c){s.child=n===null?xm(s,null,a,c):yo(s,n.child,a,c)}function ig(n,s,a,c,d){a=a.render;var p=s.ref;return vo(s,d),c=td(n,s,a,c,p,d),a=nd(),n!==null&&!Zt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Vr(n,s,d)):(nt&&a&&jh(s),s.flags|=1,Qt(n,s,c,d),s.child)}function og(n,s,a,c,d){if(n===null){var p=a.type;return typeof p=="function"&&!bd(p)&&p.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(s.tag=15,s.type=p,ag(n,s,p,c,d)):(n=Uu(a.type,null,c,s,s.mode,d),n.ref=s.ref,n.return=s,s.child=n)}if(p=n.child,(n.lanes&d)===0){var v=p.memoizedProps;if(a=a.compare,a=a!==null?a:Ea,a(v,c)&&n.ref===s.ref)return Vr(n,s,d)}return s.flags|=1,n=Ss(p,c),n.ref=s.ref,n.return=s,s.child=n}function ag(n,s,a,c,d){if(n!==null){var p=n.memoizedProps;if(Ea(p,c)&&n.ref===s.ref)if(Zt=!1,s.pendingProps=c=p,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Zt=!0);else return s.lanes=n.lanes,Vr(n,s,d)}return hd(n,s,a,c,d)}function lg(n,s,a){var c=s.pendingProps,d=c.children,p=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((s.mode&1)===0)s.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ge(Io,pn),pn|=a;else{if((a&1073741824)===0)return n=p!==null?p.baseLanes|a:a,s.lanes=s.childLanes=1073741824,s.memoizedState={baseLanes:n,cachePool:null,transitions:null},s.updateQueue=null,Ge(Io,pn),pn|=n,null;s.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=p!==null?p.baseLanes:a,Ge(Io,pn),pn|=c}else p!==null?(c=p.baseLanes|a,s.memoizedState=null):c=a,Ge(Io,pn),pn|=c;return Qt(n,s,d,a),s.child}function ug(n,s){var a=s.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(s.flags|=512,s.flags|=2097152)}function hd(n,s,a,c,d){var p=Xt(a)?fi:zt.current;return p=fo(s,p),vo(s,d),a=td(n,s,a,c,p,d),c=nd(),n!==null&&!Zt?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Vr(n,s,d)):(nt&&c&&jh(s),s.flags|=1,Qt(n,s,a,d),s.child)}function cg(n,s,a,c,d){if(Xt(a)){var p=!0;hu(s)}else p=!1;if(vo(s,d),s.stateNode===null)Ru(n,s),Xm(s,a,c),ld(s,a,c,d),c=!0;else if(n===null){var v=s.stateNode,S=s.memoizedProps;v.props=S;var N=v.context,U=a.contextType;typeof U=="object"&&U!==null?U=Tn(U):(U=Xt(a)?fi:zt.current,U=fo(s,U));var Y=a.getDerivedStateFromProps,X=typeof Y=="function"||typeof v.getSnapshotBeforeUpdate=="function";X||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==c||N!==U)&&Zm(s,v,c,U),_s=!1;var J=s.memoizedState;v.state=J,wu(s,c,v,d),N=s.memoizedState,S!==c||J!==N||Yt.current||_s?(typeof Y=="function"&&(ad(s,a,Y,c),N=s.memoizedState),(S=_s||Ym(s,a,S,c,J,N,U))?(X||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(s.flags|=4194308)):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),s.memoizedProps=c,s.memoizedState=N),v.props=c,v.state=N,v.context=U,c=S):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),c=!1)}else{v=s.stateNode,Am(n,s),S=s.memoizedProps,U=s.type===s.elementType?S:On(s.type,S),v.props=U,X=s.pendingProps,J=v.context,N=a.contextType,typeof N=="object"&&N!==null?N=Tn(N):(N=Xt(a)?fi:zt.current,N=fo(s,N));var ie=a.getDerivedStateFromProps;(Y=typeof ie=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==X||J!==N)&&Zm(s,v,c,N),_s=!1,J=s.memoizedState,v.state=J,wu(s,c,v,d);var ue=s.memoizedState;S!==X||J!==ue||Yt.current||_s?(typeof ie=="function"&&(ad(s,a,ie,c),ue=s.memoizedState),(U=_s||Ym(s,a,U,c,J,ue,N)||!1)?(Y||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,ue,N),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,ue,N)),typeof v.componentDidUpdate=="function"&&(s.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(s.flags|=1024)):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=1024),s.memoizedProps=c,s.memoizedState=ue),v.props=c,v.state=ue,v.context=N,c=U):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&J===n.memoizedState||(s.flags|=1024),c=!1)}return dd(n,s,a,c,p,d)}function dd(n,s,a,c,d,p){ug(n,s);var v=(s.flags&128)!==0;if(!c&&!v)return d&&mm(s,a,!1),Vr(n,s,p);c=s.stateNode,hE.current=s;var S=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return s.flags|=1,n!==null&&v?(s.child=yo(s,n.child,null,p),s.child=yo(s,null,S,p)):Qt(n,s,S,p),s.memoizedState=c.state,d&&mm(s,a,!0),s.child}function hg(n){var s=n.stateNode;s.pendingContext?fm(n,s.pendingContext,s.pendingContext!==s.context):s.context&&fm(n,s.context,!1),Qh(n,s.containerInfo)}function dg(n,s,a,c,d){return go(),Bh(d),s.flags|=256,Qt(n,s,a,c),s.child}var fd={dehydrated:null,treeContext:null,retryLane:0};function pd(n){return{baseLanes:n,cachePool:null,transitions:null}}function fg(n,s,a){var c=s.pendingProps,d=it.current,p=!1,v=(s.flags&128)!==0,S;if((S=v)||(S=n!==null&&n.memoizedState===null?!1:(d&2)!==0),S?(p=!0,s.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Ge(it,d&1),n===null)return zh(s),n=s.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((s.mode&1)===0?s.lanes=1:n.data==="$!"?s.lanes=8:s.lanes=1073741824,null):(v=c.children,n=c.fallback,p?(c=s.mode,p=s.child,v={mode:"hidden",children:v},(c&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=v):p=zu(v,c,0,null),n=Ii(n,c,a,null),p.return=s,n.return=s,p.sibling=n,s.child=p,s.child.memoizedState=pd(a),s.memoizedState=fd,n):md(s,v));if(d=n.memoizedState,d!==null&&(S=d.dehydrated,S!==null))return dE(n,s,v,c,S,d,a);if(p){p=c.fallback,v=s.mode,d=n.child,S=d.sibling;var N={mode:"hidden",children:c.children};return(v&1)===0&&s.child!==d?(c=s.child,c.childLanes=0,c.pendingProps=N,s.deletions=null):(c=Ss(d,N),c.subtreeFlags=d.subtreeFlags&14680064),S!==null?p=Ss(S,p):(p=Ii(p,v,a,null),p.flags|=2),p.return=s,c.return=s,c.sibling=p,s.child=c,c=p,p=s.child,v=n.child.memoizedState,v=v===null?pd(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},p.memoizedState=v,p.childLanes=n.childLanes&~a,s.memoizedState=fd,c}return p=n.child,n=p.sibling,c=Ss(p,{mode:"visible",children:c.children}),(s.mode&1)===0&&(c.lanes=a),c.return=s,c.sibling=null,n!==null&&(a=s.deletions,a===null?(s.deletions=[n],s.flags|=16):a.push(n)),s.child=c,s.memoizedState=null,c}function md(n,s){return s=zu({mode:"visible",children:s},n.mode,0,null),s.return=n,n.child=s}function Cu(n,s,a,c){return c!==null&&Bh(c),yo(s,n.child,null,a),n=md(s,s.pendingProps.children),n.flags|=2,s.memoizedState=null,n}function dE(n,s,a,c,d,p,v){if(a)return s.flags&256?(s.flags&=-257,c=ud(Error(t(422))),Cu(n,s,v,c)):s.memoizedState!==null?(s.child=n.child,s.flags|=128,null):(p=c.fallback,d=s.mode,c=zu({mode:"visible",children:c.children},d,0,null),p=Ii(p,d,v,null),p.flags|=2,c.return=s,p.return=s,c.sibling=p,s.child=c,(s.mode&1)!==0&&yo(s,n.child,null,v),s.child.memoizedState=pd(v),s.memoizedState=fd,p);if((s.mode&1)===0)return Cu(n,s,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var S=c.dgst;return c=S,p=Error(t(419)),c=ud(p,c,void 0),Cu(n,s,v,c)}if(S=(v&n.childLanes)!==0,Zt||S){if(c=Pt,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==p.retryLane&&(p.retryLane=d,br(n,d),jn(c,n,d,-1))}return Nd(),c=ud(Error(t(421))),Cu(n,s,v,c)}return d.data==="$?"?(s.flags|=128,s.child=n.child,s=SE.bind(null,n),d._reactRetry=s,null):(n=p.treeContext,fn=ps(d.nextSibling),dn=s,nt=!0,Vn=null,n!==null&&(wn[En++]=Pr,wn[En++]=Nr,wn[En++]=pi,Pr=n.id,Nr=n.overflow,pi=s),s=md(s,c.children),s.flags|=4096,s)}function pg(n,s,a){n.lanes|=s;var c=n.alternate;c!==null&&(c.lanes|=s),Wh(n.return,s,a)}function gd(n,s,a,c,d){var p=n.memoizedState;p===null?n.memoizedState={isBackwards:s,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(p.isBackwards=s,p.rendering=null,p.renderingStartTime=0,p.last=c,p.tail=a,p.tailMode=d)}function mg(n,s,a){var c=s.pendingProps,d=c.revealOrder,p=c.tail;if(Qt(n,s,c.children,a),c=it.current,(c&2)!==0)c=c&1|2,s.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=s.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&pg(n,a,s);else if(n.tag===19)pg(n,a,s);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===s)break e;for(;n.sibling===null;){if(n.return===null||n.return===s)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Ge(it,c),(s.mode&1)===0)s.memoizedState=null;else switch(d){case"forwards":for(a=s.child,d=null;a!==null;)n=a.alternate,n!==null&&Eu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=s.child,s.child=null):(d=a.sibling,a.sibling=null),gd(s,!1,d,a,p);break;case"backwards":for(a=null,d=s.child,s.child=null;d!==null;){if(n=d.alternate,n!==null&&Eu(n)===null){s.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}gd(s,!0,a,null,p);break;case"together":gd(s,!1,null,null,void 0);break;default:s.memoizedState=null}return s.child}function Ru(n,s){(s.mode&1)===0&&n!==null&&(n.alternate=null,s.alternate=null,s.flags|=2)}function Vr(n,s,a){if(n!==null&&(s.dependencies=n.dependencies),vi|=s.lanes,(a&s.childLanes)===0)return null;if(n!==null&&s.child!==n.child)throw Error(t(153));if(s.child!==null){for(n=s.child,a=Ss(n,n.pendingProps),s.child=a,a.return=s;n.sibling!==null;)n=n.sibling,a=a.sibling=Ss(n,n.pendingProps),a.return=s;a.sibling=null}return s.child}function fE(n,s,a){switch(s.tag){case 3:hg(s),go();break;case 5:Rm(s);break;case 1:Xt(s.type)&&hu(s);break;case 4:Qh(s,s.stateNode.containerInfo);break;case 10:var c=s.type._context,d=s.memoizedProps.value;Ge(yu,c._currentValue),c._currentValue=d;break;case 13:if(c=s.memoizedState,c!==null)return c.dehydrated!==null?(Ge(it,it.current&1),s.flags|=128,null):(a&s.child.childLanes)!==0?fg(n,s,a):(Ge(it,it.current&1),n=Vr(n,s,a),n!==null?n.sibling:null);Ge(it,it.current&1);break;case 19:if(c=(a&s.childLanes)!==0,(n.flags&128)!==0){if(c)return mg(n,s,a);s.flags|=128}if(d=s.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Ge(it,it.current),c)break;return null;case 22:case 23:return s.lanes=0,lg(n,s,a)}return Vr(n,s,a)}var gg,yd,yg,_g;gg=function(n,s){for(var a=s.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===s)break;for(;a.sibling===null;){if(a.return===null||a.return===s)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},yd=function(){},yg=function(n,s,a,c){var d=n.memoizedProps;if(d!==c){n=s.stateNode,yi(or.current);var p=null;switch(a){case"input":d=at(n,d),c=at(n,c),p=[];break;case"select":d=Z({},d,{value:void 0}),c=Z({},c,{value:void 0}),p=[];break;case"textarea":d=Jo(n,d),c=Jo(n,c),p=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=lu)}Pn(a,c);var v;a=null;for(U in d)if(!c.hasOwnProperty(U)&&d.hasOwnProperty(U)&&d[U]!=null)if(U==="style"){var S=d[U];for(v in S)S.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else U!=="dangerouslySetInnerHTML"&&U!=="children"&&U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&U!=="autoFocus"&&(o.hasOwnProperty(U)?p||(p=[]):(p=p||[]).push(U,null));for(U in c){var N=c[U];if(S=d!=null?d[U]:void 0,c.hasOwnProperty(U)&&N!==S&&(N!=null||S!=null))if(U==="style")if(S){for(v in S)!S.hasOwnProperty(v)||N&&N.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in N)N.hasOwnProperty(v)&&S[v]!==N[v]&&(a||(a={}),a[v]=N[v])}else a||(p||(p=[]),p.push(U,a)),a=N;else U==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,S=S?S.__html:void 0,N!=null&&S!==N&&(p=p||[]).push(U,N)):U==="children"?typeof N!="string"&&typeof N!="number"||(p=p||[]).push(U,""+N):U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&(o.hasOwnProperty(U)?(N!=null&&U==="onScroll"&&Ye("scroll",n),p||S===N||(p=[])):(p=p||[]).push(U,N))}a&&(p=p||[]).push("style",a);var U=p;(s.updateQueue=U)&&(s.flags|=4)}},_g=function(n,s,a,c){a!==c&&(s.flags|=4)};function La(n,s){if(!nt)switch(n.tailMode){case"hidden":s=n.tail;for(var a=null;s!==null;)s.alternate!==null&&(a=s),s=s.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?s||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function $t(n){var s=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(s)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,s}function pE(n,s,a){var c=s.pendingProps;switch(Fh(s),s.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $t(s),null;case 1:return Xt(s.type)&&cu(),$t(s),null;case 3:return c=s.stateNode,wo(),Xe(Yt),Xe(zt),Xh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(mu(s)?s.flags|=4:n===null||n.memoizedState.isDehydrated&&(s.flags&256)===0||(s.flags|=1024,Vn!==null&&(Cd(Vn),Vn=null))),yd(n,s),$t(s),null;case 5:Jh(s);var d=yi(Na.current);if(a=s.type,n!==null&&s.stateNode!=null)yg(n,s,a,c,d),n.ref!==s.ref&&(s.flags|=512,s.flags|=2097152);else{if(!c){if(s.stateNode===null)throw Error(t(166));return $t(s),null}if(n=yi(or.current),mu(s)){c=s.stateNode,a=s.type;var p=s.memoizedProps;switch(c[ir]=s,c[Aa]=p,n=(s.mode&1)!==0,a){case"dialog":Ye("cancel",c),Ye("close",c);break;case"iframe":case"object":case"embed":Ye("load",c);break;case"video":case"audio":for(d=0;d<Ia.length;d++)Ye(Ia[d],c);break;case"source":Ye("error",c);break;case"img":case"image":case"link":Ye("error",c),Ye("load",c);break;case"details":Ye("toggle",c);break;case"input":Hn(c,p),Ye("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!p.multiple},Ye("invalid",c);break;case"textarea":Yo(c,p),Ye("invalid",c)}Pn(a,p),d=null;for(var v in p)if(p.hasOwnProperty(v)){var S=p[v];v==="children"?typeof S=="string"?c.textContent!==S&&(p.suppressHydrationWarning!==!0&&au(c.textContent,S,n),d=["children",S]):typeof S=="number"&&c.textContent!==""+S&&(p.suppressHydrationWarning!==!0&&au(c.textContent,S,n),d=["children",""+S]):o.hasOwnProperty(v)&&S!=null&&v==="onScroll"&&Ye("scroll",c)}switch(a){case"input":ht(c),Qo(c,p,!0);break;case"textarea":ht(c),Xr(c);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(c.onclick=lu)}c=d,s.updateQueue=c,c!==null&&(s.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Xo(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[ir]=s,n[Aa]=c,gg(n,s,!1,!1),s.stateNode=n;e:{switch(v=Bi(a,c),a){case"dialog":Ye("cancel",n),Ye("close",n),d=c;break;case"iframe":case"object":case"embed":Ye("load",n),d=c;break;case"video":case"audio":for(d=0;d<Ia.length;d++)Ye(Ia[d],n);d=c;break;case"source":Ye("error",n),d=c;break;case"img":case"image":case"link":Ye("error",n),Ye("load",n),d=c;break;case"details":Ye("toggle",n),d=c;break;case"input":Hn(n,c),d=at(n,c),Ye("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=Z({},c,{value:void 0}),Ye("invalid",n);break;case"textarea":Yo(n,c),d=Jo(n,c),Ye("invalid",n);break;default:d=c}Pn(a,d),S=d;for(p in S)if(S.hasOwnProperty(p)){var N=S[p];p==="style"?zi(n,N):p==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,N!=null&&Ol(n,N)):p==="children"?typeof N=="string"?(a!=="textarea"||N!=="")&&Xs(n,N):typeof N=="number"&&Xs(n,""+N):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(o.hasOwnProperty(p)?N!=null&&p==="onScroll"&&Ye("scroll",n):N!=null&&ce(n,p,N,v))}switch(a){case"input":ht(n),Qo(n,c,!1);break;case"textarea":ht(n),Xr(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Ne(c.value));break;case"select":n.multiple=!!c.multiple,p=c.value,p!=null?Rn(n,!!c.multiple,p,!1):c.defaultValue!=null&&Rn(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=lu)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(s.flags|=4)}s.ref!==null&&(s.flags|=512,s.flags|=2097152)}return $t(s),null;case 6:if(n&&s.stateNode!=null)_g(n,s,n.memoizedProps,c);else{if(typeof c!="string"&&s.stateNode===null)throw Error(t(166));if(a=yi(Na.current),yi(or.current),mu(s)){if(c=s.stateNode,a=s.memoizedProps,c[ir]=s,(p=c.nodeValue!==a)&&(n=dn,n!==null))switch(n.tag){case 3:au(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&au(c.nodeValue,a,(n.mode&1)!==0)}p&&(s.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ir]=s,s.stateNode=c}return $t(s),null;case 13:if(Xe(it),c=s.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(nt&&fn!==null&&(s.mode&1)!==0&&(s.flags&128)===0)Em(),go(),s.flags|=98560,p=!1;else if(p=mu(s),c!==null&&c.dehydrated!==null){if(n===null){if(!p)throw Error(t(318));if(p=s.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(t(317));p[ir]=s}else go(),(s.flags&128)===0&&(s.memoizedState=null),s.flags|=4;$t(s),p=!1}else Vn!==null&&(Cd(Vn),Vn=null),p=!0;if(!p)return s.flags&65536?s:null}return(s.flags&128)!==0?(s.lanes=a,s):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(s.child.flags|=8192,(s.mode&1)!==0&&(n===null||(it.current&1)!==0?St===0&&(St=3):Nd())),s.updateQueue!==null&&(s.flags|=4),$t(s),null);case 4:return wo(),yd(n,s),n===null&&xa(s.stateNode.containerInfo),$t(s),null;case 10:return qh(s.type._context),$t(s),null;case 17:return Xt(s.type)&&cu(),$t(s),null;case 19:if(Xe(it),p=s.memoizedState,p===null)return $t(s),null;if(c=(s.flags&128)!==0,v=p.rendering,v===null)if(c)La(p,!1);else{if(St!==0||n!==null&&(n.flags&128)!==0)for(n=s.child;n!==null;){if(v=Eu(n),v!==null){for(s.flags|=128,La(p,!1),c=v.updateQueue,c!==null&&(s.updateQueue=c,s.flags|=4),s.subtreeFlags=0,c=a,a=s.child;a!==null;)p=a,n=c,p.flags&=14680066,v=p.alternate,v===null?(p.childLanes=0,p.lanes=n,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=v.childLanes,p.lanes=v.lanes,p.child=v.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=v.memoizedProps,p.memoizedState=v.memoizedState,p.updateQueue=v.updateQueue,p.type=v.type,n=v.dependencies,p.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Ge(it,it.current&1|2),s.child}n=n.sibling}p.tail!==null&&Je()>xo&&(s.flags|=128,c=!0,La(p,!1),s.lanes=4194304)}else{if(!c)if(n=Eu(v),n!==null){if(s.flags|=128,c=!0,a=n.updateQueue,a!==null&&(s.updateQueue=a,s.flags|=4),La(p,!0),p.tail===null&&p.tailMode==="hidden"&&!v.alternate&&!nt)return $t(s),null}else 2*Je()-p.renderingStartTime>xo&&a!==1073741824&&(s.flags|=128,c=!0,La(p,!1),s.lanes=4194304);p.isBackwards?(v.sibling=s.child,s.child=v):(a=p.last,a!==null?a.sibling=v:s.child=v,p.last=v)}return p.tail!==null?(s=p.tail,p.rendering=s,p.tail=s.sibling,p.renderingStartTime=Je(),s.sibling=null,a=it.current,Ge(it,c?a&1|2:a&1),s):($t(s),null);case 22:case 23:return Pd(),c=s.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(s.flags|=8192),c&&(s.mode&1)!==0?(pn&1073741824)!==0&&($t(s),s.subtreeFlags&6&&(s.flags|=8192)):$t(s),null;case 24:return null;case 25:return null}throw Error(t(156,s.tag))}function mE(n,s){switch(Fh(s),s.tag){case 1:return Xt(s.type)&&cu(),n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 3:return wo(),Xe(Yt),Xe(zt),Xh(),n=s.flags,(n&65536)!==0&&(n&128)===0?(s.flags=n&-65537|128,s):null;case 5:return Jh(s),null;case 13:if(Xe(it),n=s.memoizedState,n!==null&&n.dehydrated!==null){if(s.alternate===null)throw Error(t(340));go()}return n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 19:return Xe(it),null;case 4:return wo(),null;case 10:return qh(s.type._context),null;case 22:case 23:return Pd(),null;case 24:return null;default:return null}}var Pu=!1,Ht=!1,gE=typeof WeakSet=="function"?WeakSet:Set,oe=null;function To(n,s){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){ut(n,s,c)}else a.current=null}function _d(n,s,a){try{a()}catch(c){ut(n,s,c)}}var vg=!1;function yE(n,s){if(Ph=Sr,n=Yp(),Th(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,p=c.focusNode;c=c.focusOffset;try{a.nodeType,p.nodeType}catch{a=null;break e}var v=0,S=-1,N=-1,U=0,Y=0,X=n,J=null;t:for(;;){for(var ie;X!==a||d!==0&&X.nodeType!==3||(S=v+d),X!==p||c!==0&&X.nodeType!==3||(N=v+c),X.nodeType===3&&(v+=X.nodeValue.length),(ie=X.firstChild)!==null;)J=X,X=ie;for(;;){if(X===n)break t;if(J===a&&++U===d&&(S=v),J===p&&++Y===c&&(N=v),(ie=X.nextSibling)!==null)break;X=J,J=X.parentNode}X=ie}a=S===-1||N===-1?null:{start:S,end:N}}else a=null}a=a||{start:0,end:0}}else a=null;for(Nh={focusedElem:n,selectionRange:a},Sr=!1,oe=s;oe!==null;)if(s=oe,n=s.child,(s.subtreeFlags&1028)!==0&&n!==null)n.return=s,oe=n;else for(;oe!==null;){s=oe;try{var ue=s.alternate;if((s.flags&1024)!==0)switch(s.tag){case 0:case 11:case 15:break;case 1:if(ue!==null){var he=ue.memoizedProps,pt=ue.memoizedState,L=s.stateNode,D=L.getSnapshotBeforeUpdate(s.elementType===s.type?he:On(s.type,he),pt);L.__reactInternalSnapshotBeforeUpdate=D}break;case 3:var F=s.stateNode.containerInfo;F.nodeType===1?F.textContent="":F.nodeType===9&&F.documentElement&&F.removeChild(F.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(ee){ut(s,s.return,ee)}if(n=s.sibling,n!==null){n.return=s.return,oe=n;break}oe=s.return}return ue=vg,vg=!1,ue}function Ma(n,s,a){var c=s.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var p=d.destroy;d.destroy=void 0,p!==void 0&&_d(s,a,p)}d=d.next}while(d!==c)}}function Nu(n,s){if(s=s.updateQueue,s=s!==null?s.lastEffect:null,s!==null){var a=s=s.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==s)}}function vd(n){var s=n.ref;if(s!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof s=="function"?s(n):s.current=n}}function wg(n){var s=n.alternate;s!==null&&(n.alternate=null,wg(s)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(s=n.stateNode,s!==null&&(delete s[ir],delete s[Aa],delete s[Oh],delete s[Zw],delete s[eE])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Eg(n){return n.tag===5||n.tag===3||n.tag===4}function Tg(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Eg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function wd(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.nodeType===8?a.parentNode.insertBefore(n,s):a.insertBefore(n,s):(a.nodeType===8?(s=a.parentNode,s.insertBefore(n,a)):(s=a,s.appendChild(n)),a=a._reactRootContainer,a!=null||s.onclick!==null||(s.onclick=lu));else if(c!==4&&(n=n.child,n!==null))for(wd(n,s,a),n=n.sibling;n!==null;)wd(n,s,a),n=n.sibling}function Ed(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.insertBefore(n,s):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Ed(n,s,a),n=n.sibling;n!==null;)Ed(n,s,a),n=n.sibling}var Ot=null,Ln=!1;function ws(n,s,a){for(a=a.child;a!==null;)Ig(n,s,a),a=a.sibling}function Ig(n,s,a){if(on&&typeof on.onCommitFiberUnmount=="function")try{on.onCommitFiberUnmount(ri,a)}catch{}switch(a.tag){case 5:Ht||To(a,s);case 6:var c=Ot,d=Ln;Ot=null,ws(n,s,a),Ot=c,Ln=d,Ot!==null&&(Ln?(n=Ot,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Ot.removeChild(a.stateNode));break;case 18:Ot!==null&&(Ln?(n=Ot,a=a.stateNode,n.nodeType===8?Vh(n.parentNode,a):n.nodeType===1&&Vh(n,a),cs(n)):Vh(Ot,a.stateNode));break;case 4:c=Ot,d=Ln,Ot=a.stateNode.containerInfo,Ln=!0,ws(n,s,a),Ot=c,Ln=d;break;case 0:case 11:case 14:case 15:if(!Ht&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var p=d,v=p.destroy;p=p.tag,v!==void 0&&((p&2)!==0||(p&4)!==0)&&_d(a,s,v),d=d.next}while(d!==c)}ws(n,s,a);break;case 1:if(!Ht&&(To(a,s),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(S){ut(a,s,S)}ws(n,s,a);break;case 21:ws(n,s,a);break;case 22:a.mode&1?(Ht=(c=Ht)||a.memoizedState!==null,ws(n,s,a),Ht=c):ws(n,s,a);break;default:ws(n,s,a)}}function xg(n){var s=n.updateQueue;if(s!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new gE),s.forEach(function(c){var d=AE.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Mn(n,s){var a=s.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var p=n,v=s,S=v;e:for(;S!==null;){switch(S.tag){case 5:Ot=S.stateNode,Ln=!1;break e;case 3:Ot=S.stateNode.containerInfo,Ln=!0;break e;case 4:Ot=S.stateNode.containerInfo,Ln=!0;break e}S=S.return}if(Ot===null)throw Error(t(160));Ig(p,v,d),Ot=null,Ln=!1;var N=d.alternate;N!==null&&(N.return=null),d.return=null}catch(U){ut(d,s,U)}}if(s.subtreeFlags&12854)for(s=s.child;s!==null;)Sg(s,n),s=s.sibling}function Sg(n,s){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Mn(s,n),lr(n),c&4){try{Ma(3,n,n.return),Nu(3,n)}catch(he){ut(n,n.return,he)}try{Ma(5,n,n.return)}catch(he){ut(n,n.return,he)}}break;case 1:Mn(s,n),lr(n),c&512&&a!==null&&To(a,a.return);break;case 5:if(Mn(s,n),lr(n),c&512&&a!==null&&To(a,a.return),n.flags&32){var d=n.stateNode;try{Xs(d,"")}catch(he){ut(n,n.return,he)}}if(c&4&&(d=n.stateNode,d!=null)){var p=n.memoizedProps,v=a!==null?a.memoizedProps:p,S=n.type,N=n.updateQueue;if(n.updateQueue=null,N!==null)try{S==="input"&&p.type==="radio"&&p.name!=null&&Fi(d,p),Bi(S,v);var U=Bi(S,p);for(v=0;v<N.length;v+=2){var Y=N[v],X=N[v+1];Y==="style"?zi(d,X):Y==="dangerouslySetInnerHTML"?Ol(d,X):Y==="children"?Xs(d,X):ce(d,Y,X,U)}switch(S){case"input":Ys(d,p);break;case"textarea":Vl(d,p);break;case"select":var J=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!p.multiple;var ie=p.value;ie!=null?Rn(d,!!p.multiple,ie,!1):J!==!!p.multiple&&(p.defaultValue!=null?Rn(d,!!p.multiple,p.defaultValue,!0):Rn(d,!!p.multiple,p.multiple?[]:"",!1))}d[Aa]=p}catch(he){ut(n,n.return,he)}}break;case 6:if(Mn(s,n),lr(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,p=n.memoizedProps;try{d.nodeValue=p}catch(he){ut(n,n.return,he)}}break;case 3:if(Mn(s,n),lr(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{cs(s.containerInfo)}catch(he){ut(n,n.return,he)}break;case 4:Mn(s,n),lr(n);break;case 13:Mn(s,n),lr(n),d=n.child,d.flags&8192&&(p=d.memoizedState!==null,d.stateNode.isHidden=p,!p||d.alternate!==null&&d.alternate.memoizedState!==null||(xd=Je())),c&4&&xg(n);break;case 22:if(Y=a!==null&&a.memoizedState!==null,n.mode&1?(Ht=(U=Ht)||Y,Mn(s,n),Ht=U):Mn(s,n),lr(n),c&8192){if(U=n.memoizedState!==null,(n.stateNode.isHidden=U)&&!Y&&(n.mode&1)!==0)for(oe=n,Y=n.child;Y!==null;){for(X=oe=Y;oe!==null;){switch(J=oe,ie=J.child,J.tag){case 0:case 11:case 14:case 15:Ma(4,J,J.return);break;case 1:To(J,J.return);var ue=J.stateNode;if(typeof ue.componentWillUnmount=="function"){c=J,a=J.return;try{s=c,ue.props=s.memoizedProps,ue.state=s.memoizedState,ue.componentWillUnmount()}catch(he){ut(c,a,he)}}break;case 5:To(J,J.return);break;case 22:if(J.memoizedState!==null){Cg(X);continue}}ie!==null?(ie.return=J,oe=ie):Cg(X)}Y=Y.sibling}e:for(Y=null,X=n;;){if(X.tag===5){if(Y===null){Y=X;try{d=X.stateNode,U?(p=d.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(S=X.stateNode,N=X.memoizedProps.style,v=N!=null&&N.hasOwnProperty("display")?N.display:null,S.style.display=ts("display",v))}catch(he){ut(n,n.return,he)}}}else if(X.tag===6){if(Y===null)try{X.stateNode.nodeValue=U?"":X.memoizedProps}catch(he){ut(n,n.return,he)}}else if((X.tag!==22&&X.tag!==23||X.memoizedState===null||X===n)&&X.child!==null){X.child.return=X,X=X.child;continue}if(X===n)break e;for(;X.sibling===null;){if(X.return===null||X.return===n)break e;Y===X&&(Y=null),X=X.return}Y===X&&(Y=null),X.sibling.return=X.return,X=X.sibling}}break;case 19:Mn(s,n),lr(n),c&4&&xg(n);break;case 21:break;default:Mn(s,n),lr(n)}}function lr(n){var s=n.flags;if(s&2){try{e:{for(var a=n.return;a!==null;){if(Eg(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Xs(d,""),c.flags&=-33);var p=Tg(n);Ed(n,p,d);break;case 3:case 4:var v=c.stateNode.containerInfo,S=Tg(n);wd(n,S,v);break;default:throw Error(t(161))}}catch(N){ut(n,n.return,N)}n.flags&=-3}s&4096&&(n.flags&=-4097)}function _E(n,s,a){oe=n,Ag(n)}function Ag(n,s,a){for(var c=(n.mode&1)!==0;oe!==null;){var d=oe,p=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||Pu;if(!v){var S=d.alternate,N=S!==null&&S.memoizedState!==null||Ht;S=Pu;var U=Ht;if(Pu=v,(Ht=N)&&!U)for(oe=d;oe!==null;)v=oe,N=v.child,v.tag===22&&v.memoizedState!==null?Rg(d):N!==null?(N.return=v,oe=N):Rg(d);for(;p!==null;)oe=p,Ag(p),p=p.sibling;oe=d,Pu=S,Ht=U}kg(n)}else(d.subtreeFlags&8772)!==0&&p!==null?(p.return=d,oe=p):kg(n)}}function kg(n){for(;oe!==null;){var s=oe;if((s.flags&8772)!==0){var a=s.alternate;try{if((s.flags&8772)!==0)switch(s.tag){case 0:case 11:case 15:Ht||Nu(5,s);break;case 1:var c=s.stateNode;if(s.flags&4&&!Ht)if(a===null)c.componentDidMount();else{var d=s.elementType===s.type?a.memoizedProps:On(s.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var p=s.updateQueue;p!==null&&Cm(s,p,c);break;case 3:var v=s.updateQueue;if(v!==null){if(a=null,s.child!==null)switch(s.child.tag){case 5:a=s.child.stateNode;break;case 1:a=s.child.stateNode}Cm(s,v,a)}break;case 5:var S=s.stateNode;if(a===null&&s.flags&4){a=S;var N=s.memoizedProps;switch(s.type){case"button":case"input":case"select":case"textarea":N.autoFocus&&a.focus();break;case"img":N.src&&(a.src=N.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(s.memoizedState===null){var U=s.alternate;if(U!==null){var Y=U.memoizedState;if(Y!==null){var X=Y.dehydrated;X!==null&&cs(X)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Ht||s.flags&512&&vd(s)}catch(J){ut(s,s.return,J)}}if(s===n){oe=null;break}if(a=s.sibling,a!==null){a.return=s.return,oe=a;break}oe=s.return}}function Cg(n){for(;oe!==null;){var s=oe;if(s===n){oe=null;break}var a=s.sibling;if(a!==null){a.return=s.return,oe=a;break}oe=s.return}}function Rg(n){for(;oe!==null;){var s=oe;try{switch(s.tag){case 0:case 11:case 15:var a=s.return;try{Nu(4,s)}catch(N){ut(s,a,N)}break;case 1:var c=s.stateNode;if(typeof c.componentDidMount=="function"){var d=s.return;try{c.componentDidMount()}catch(N){ut(s,d,N)}}var p=s.return;try{vd(s)}catch(N){ut(s,p,N)}break;case 5:var v=s.return;try{vd(s)}catch(N){ut(s,v,N)}}}catch(N){ut(s,s.return,N)}if(s===n){oe=null;break}var S=s.sibling;if(S!==null){S.return=s.return,oe=S;break}oe=s.return}}var vE=Math.ceil,bu=xe.ReactCurrentDispatcher,Td=xe.ReactCurrentOwner,xn=xe.ReactCurrentBatchConfig,je=0,Pt=null,wt=null,Lt=0,pn=0,Io=ms(0),St=0,ja=null,vi=0,Du=0,Id=0,Fa=null,en=null,xd=0,xo=1/0,Or=null,Vu=!1,Sd=null,Es=null,Ou=!1,Ts=null,Lu=0,Ua=0,Ad=null,Mu=-1,ju=0;function Jt(){return(je&6)!==0?Je():Mu!==-1?Mu:Mu=Je()}function Is(n){return(n.mode&1)===0?1:(je&2)!==0&&Lt!==0?Lt&-Lt:nE.transition!==null?(ju===0&&(ju=aa()),ju):(n=Le,n!==0||(n=window.event,n=n===void 0?16:Xi(n.type)),n)}function jn(n,s,a,c){if(50<Ua)throw Ua=0,Ad=null,Error(t(185));ai(n,a,c),((je&2)===0||n!==Pt)&&(n===Pt&&((je&2)===0&&(Du|=a),St===4&&xs(n,Lt)),tn(n,c),a===1&&je===0&&(s.mode&1)===0&&(xo=Je()+500,du&&ys()))}function tn(n,s){var a=n.callbackNode;oi(n,s);var c=Tr(n,n===Pt?Lt:0);if(c===0)a!==null&&qi(a),n.callbackNode=null,n.callbackPriority=0;else if(s=c&-c,n.callbackPriority!==s){if(a!=null&&qi(a),s===1)n.tag===0?tE(Ng.bind(null,n)):gm(Ng.bind(null,n)),Yw(function(){(je&6)===0&&ys()}),a=null;else{switch(Qn(c)){case 1:a=Wi;break;case 4:a=sa;break;case 16:a=ni;break;case 536870912:a=Ki;break;default:a=ni}a=Fg(a,Pg.bind(null,n))}n.callbackPriority=s,n.callbackNode=a}}function Pg(n,s){if(Mu=-1,ju=0,(je&6)!==0)throw Error(t(327));var a=n.callbackNode;if(So()&&n.callbackNode!==a)return null;var c=Tr(n,n===Pt?Lt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||s)s=Fu(n,c);else{s=c;var d=je;je|=2;var p=Dg();(Pt!==n||Lt!==s)&&(Or=null,xo=Je()+500,Ei(n,s));do try{TE();break}catch(S){bg(n,S)}while(!0);Hh(),bu.current=p,je=d,wt!==null?s=0:(Pt=null,Lt=0,s=St)}if(s!==0){if(s===2&&(d=oa(n),d!==0&&(c=d,s=kd(n,d))),s===1)throw a=ja,Ei(n,0),xs(n,c),tn(n,Je()),a;if(s===6)xs(n,c);else{if(d=n.current.alternate,(c&30)===0&&!wE(d)&&(s=Fu(n,c),s===2&&(p=oa(n),p!==0&&(c=p,s=kd(n,p))),s===1))throw a=ja,Ei(n,0),xs(n,c),tn(n,Je()),a;switch(n.finishedWork=d,n.finishedLanes=c,s){case 0:case 1:throw Error(t(345));case 2:Ti(n,en,Or);break;case 3:if(xs(n,c),(c&130023424)===c&&(s=xd+500-Je(),10<s)){if(Tr(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Jt(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=Dh(Ti.bind(null,n,en,Or),s);break}Ti(n,en,Or);break;case 4:if(xs(n,c),(c&4194240)===c)break;for(s=n.eventTimes,d=-1;0<c;){var v=31-an(c);p=1<<v,v=s[v],v>d&&(d=v),c&=~p}if(c=d,c=Je()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*vE(c/1960))-c,10<c){n.timeoutHandle=Dh(Ti.bind(null,n,en,Or),c);break}Ti(n,en,Or);break;case 5:Ti(n,en,Or);break;default:throw Error(t(329))}}}return tn(n,Je()),n.callbackNode===a?Pg.bind(null,n):null}function kd(n,s){var a=Fa;return n.current.memoizedState.isDehydrated&&(Ei(n,s).flags|=256),n=Fu(n,s),n!==2&&(s=en,en=a,s!==null&&Cd(s)),n}function Cd(n){en===null?en=n:en.push.apply(en,n)}function wE(n){for(var s=n;;){if(s.flags&16384){var a=s.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],p=d.getSnapshot;d=d.value;try{if(!Dn(p(),d))return!1}catch{return!1}}}if(a=s.child,s.subtreeFlags&16384&&a!==null)a.return=s,s=a;else{if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return!0;s=s.return}s.sibling.return=s.return,s=s.sibling}}return!0}function xs(n,s){for(s&=~Id,s&=~Du,n.suspendedLanes|=s,n.pingedLanes&=~s,n=n.expirationTimes;0<s;){var a=31-an(s),c=1<<a;n[a]=-1,s&=~c}}function Ng(n){if((je&6)!==0)throw Error(t(327));So();var s=Tr(n,0);if((s&1)===0)return tn(n,Je()),null;var a=Fu(n,s);if(n.tag!==0&&a===2){var c=oa(n);c!==0&&(s=c,a=kd(n,c))}if(a===1)throw a=ja,Ei(n,0),xs(n,s),tn(n,Je()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=s,Ti(n,en,Or),tn(n,Je()),null}function Rd(n,s){var a=je;je|=1;try{return n(s)}finally{je=a,je===0&&(xo=Je()+500,du&&ys())}}function wi(n){Ts!==null&&Ts.tag===0&&(je&6)===0&&So();var s=je;je|=1;var a=xn.transition,c=Le;try{if(xn.transition=null,Le=1,n)return n()}finally{Le=c,xn.transition=a,je=s,(je&6)===0&&ys()}}function Pd(){pn=Io.current,Xe(Io)}function Ei(n,s){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,Jw(a)),wt!==null)for(a=wt.return;a!==null;){var c=a;switch(Fh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&cu();break;case 3:wo(),Xe(Yt),Xe(zt),Xh();break;case 5:Jh(c);break;case 4:wo();break;case 13:Xe(it);break;case 19:Xe(it);break;case 10:qh(c.type._context);break;case 22:case 23:Pd()}a=a.return}if(Pt=n,wt=n=Ss(n.current,null),Lt=pn=s,St=0,ja=null,Id=Du=vi=0,en=Fa=null,gi!==null){for(s=0;s<gi.length;s++)if(a=gi[s],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,p=a.pending;if(p!==null){var v=p.next;p.next=d,c.next=v}a.pending=c}gi=null}return n}function bg(n,s){do{var a=wt;try{if(Hh(),Tu.current=Au,Iu){for(var c=ot.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}Iu=!1}if(_i=0,Rt=xt=ot=null,ba=!1,Da=0,Td.current=null,a===null||a.return===null){St=1,ja=s,wt=null;break}e:{var p=n,v=a.return,S=a,N=s;if(s=Lt,S.flags|=32768,N!==null&&typeof N=="object"&&typeof N.then=="function"){var U=N,Y=S,X=Y.tag;if((Y.mode&1)===0&&(X===0||X===11||X===15)){var J=Y.alternate;J?(Y.updateQueue=J.updateQueue,Y.memoizedState=J.memoizedState,Y.lanes=J.lanes):(Y.updateQueue=null,Y.memoizedState=null)}var ie=rg(v);if(ie!==null){ie.flags&=-257,sg(ie,v,S,p,s),ie.mode&1&&ng(p,U,s),s=ie,N=U;var ue=s.updateQueue;if(ue===null){var he=new Set;he.add(N),s.updateQueue=he}else ue.add(N);break e}else{if((s&1)===0){ng(p,U,s),Nd();break e}N=Error(t(426))}}else if(nt&&S.mode&1){var pt=rg(v);if(pt!==null){(pt.flags&65536)===0&&(pt.flags|=256),sg(pt,v,S,p,s),Bh(Eo(N,S));break e}}p=N=Eo(N,S),St!==4&&(St=2),Fa===null?Fa=[p]:Fa.push(p),p=v;do{switch(p.tag){case 3:p.flags|=65536,s&=-s,p.lanes|=s;var L=eg(p,N,s);km(p,L);break e;case 1:S=N;var D=p.type,F=p.stateNode;if((p.flags&128)===0&&(typeof D.getDerivedStateFromError=="function"||F!==null&&typeof F.componentDidCatch=="function"&&(Es===null||!Es.has(F)))){p.flags|=65536,s&=-s,p.lanes|=s;var ee=tg(p,S,s);km(p,ee);break e}}p=p.return}while(p!==null)}Og(a)}catch(fe){s=fe,wt===a&&a!==null&&(wt=a=a.return);continue}break}while(!0)}function Dg(){var n=bu.current;return bu.current=Au,n===null?Au:n}function Nd(){(St===0||St===3||St===2)&&(St=4),Pt===null||(vi&268435455)===0&&(Du&268435455)===0||xs(Pt,Lt)}function Fu(n,s){var a=je;je|=2;var c=Dg();(Pt!==n||Lt!==s)&&(Or=null,Ei(n,s));do try{EE();break}catch(d){bg(n,d)}while(!0);if(Hh(),je=a,bu.current=c,wt!==null)throw Error(t(261));return Pt=null,Lt=0,St}function EE(){for(;wt!==null;)Vg(wt)}function TE(){for(;wt!==null&&!ti();)Vg(wt)}function Vg(n){var s=jg(n.alternate,n,pn);n.memoizedProps=n.pendingProps,s===null?Og(n):wt=s,Td.current=null}function Og(n){var s=n;do{var a=s.alternate;if(n=s.return,(s.flags&32768)===0){if(a=pE(a,s,pn),a!==null){wt=a;return}}else{if(a=mE(a,s),a!==null){a.flags&=32767,wt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{St=6,wt=null;return}}if(s=s.sibling,s!==null){wt=s;return}wt=s=n}while(s!==null);St===0&&(St=5)}function Ti(n,s,a){var c=Le,d=xn.transition;try{xn.transition=null,Le=1,IE(n,s,a,c)}finally{xn.transition=d,Le=c}return null}function IE(n,s,a,c){do So();while(Ts!==null);if((je&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var p=a.lanes|a.childLanes;if(yh(n,p),n===Pt&&(wt=Pt=null,Lt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Ou||(Ou=!0,Fg(ni,function(){return So(),null})),p=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||p){p=xn.transition,xn.transition=null;var v=Le;Le=1;var S=je;je|=4,Td.current=null,yE(n,a),Sg(a,n),$w(Nh),Sr=!!Ph,Nh=Ph=null,n.current=a,_E(a),Er(),je=S,Le=v,xn.transition=p}else n.current=a;if(Ou&&(Ou=!1,Ts=n,Lu=d),p=n.pendingLanes,p===0&&(Es=null),Wl(a.stateNode),tn(n,Je()),s!==null)for(c=n.onRecoverableError,a=0;a<s.length;a++)d=s[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(Vu)throw Vu=!1,n=Sd,Sd=null,n;return(Lu&1)!==0&&n.tag!==0&&So(),p=n.pendingLanes,(p&1)!==0?n===Ad?Ua++:(Ua=0,Ad=n):Ua=0,ys(),null}function So(){if(Ts!==null){var n=Qn(Lu),s=xn.transition,a=Le;try{if(xn.transition=null,Le=16>n?16:n,Ts===null)var c=!1;else{if(n=Ts,Ts=null,Lu=0,(je&6)!==0)throw Error(t(331));var d=je;for(je|=4,oe=n.current;oe!==null;){var p=oe,v=p.child;if((oe.flags&16)!==0){var S=p.deletions;if(S!==null){for(var N=0;N<S.length;N++){var U=S[N];for(oe=U;oe!==null;){var Y=oe;switch(Y.tag){case 0:case 11:case 15:Ma(8,Y,p)}var X=Y.child;if(X!==null)X.return=Y,oe=X;else for(;oe!==null;){Y=oe;var J=Y.sibling,ie=Y.return;if(wg(Y),Y===U){oe=null;break}if(J!==null){J.return=ie,oe=J;break}oe=ie}}}var ue=p.alternate;if(ue!==null){var he=ue.child;if(he!==null){ue.child=null;do{var pt=he.sibling;he.sibling=null,he=pt}while(he!==null)}}oe=p}}if((p.subtreeFlags&2064)!==0&&v!==null)v.return=p,oe=v;else e:for(;oe!==null;){if(p=oe,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:Ma(9,p,p.return)}var L=p.sibling;if(L!==null){L.return=p.return,oe=L;break e}oe=p.return}}var D=n.current;for(oe=D;oe!==null;){v=oe;var F=v.child;if((v.subtreeFlags&2064)!==0&&F!==null)F.return=v,oe=F;else e:for(v=D;oe!==null;){if(S=oe,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:Nu(9,S)}}catch(fe){ut(S,S.return,fe)}if(S===v){oe=null;break e}var ee=S.sibling;if(ee!==null){ee.return=S.return,oe=ee;break e}oe=S.return}}if(je=d,ys(),on&&typeof on.onPostCommitFiberRoot=="function")try{on.onPostCommitFiberRoot(ri,n)}catch{}c=!0}return c}finally{Le=a,xn.transition=s}}return!1}function Lg(n,s,a){s=Eo(a,s),s=eg(n,s,1),n=vs(n,s,1),s=Jt(),n!==null&&(ai(n,1,s),tn(n,s))}function ut(n,s,a){if(n.tag===3)Lg(n,n,a);else for(;s!==null;){if(s.tag===3){Lg(s,n,a);break}else if(s.tag===1){var c=s.stateNode;if(typeof s.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(Es===null||!Es.has(c))){n=Eo(a,n),n=tg(s,n,1),s=vs(s,n,1),n=Jt(),s!==null&&(ai(s,1,n),tn(s,n));break}}s=s.return}}function xE(n,s,a){var c=n.pingCache;c!==null&&c.delete(s),s=Jt(),n.pingedLanes|=n.suspendedLanes&a,Pt===n&&(Lt&a)===a&&(St===4||St===3&&(Lt&130023424)===Lt&&500>Je()-xd?Ei(n,0):Id|=a),tn(n,s)}function Mg(n,s){s===0&&((n.mode&1)===0?s=1:(s=as,as<<=1,(as&130023424)===0&&(as=4194304)));var a=Jt();n=br(n,s),n!==null&&(ai(n,s,a),tn(n,a))}function SE(n){var s=n.memoizedState,a=0;s!==null&&(a=s.retryLane),Mg(n,a)}function AE(n,s){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(s),Mg(n,a)}var jg;jg=function(n,s,a){if(n!==null)if(n.memoizedProps!==s.pendingProps||Yt.current)Zt=!0;else{if((n.lanes&a)===0&&(s.flags&128)===0)return Zt=!1,fE(n,s,a);Zt=(n.flags&131072)!==0}else Zt=!1,nt&&(s.flags&1048576)!==0&&ym(s,pu,s.index);switch(s.lanes=0,s.tag){case 2:var c=s.type;Ru(n,s),n=s.pendingProps;var d=fo(s,zt.current);vo(s,a),d=td(null,s,c,n,d,a);var p=nd();return s.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(s.tag=1,s.memoizedState=null,s.updateQueue=null,Xt(c)?(p=!0,hu(s)):p=!1,s.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Gh(s),d.updater=ku,s.stateNode=d,d._reactInternals=s,ld(s,c,n,a),s=dd(null,s,c,!0,p,a)):(s.tag=0,nt&&p&&jh(s),Qt(null,s,d,a),s=s.child),s;case 16:c=s.elementType;e:{switch(Ru(n,s),n=s.pendingProps,d=c._init,c=d(c._payload),s.type=c,d=s.tag=CE(c),n=On(c,n),d){case 0:s=hd(null,s,c,n,a);break e;case 1:s=cg(null,s,c,n,a);break e;case 11:s=ig(null,s,c,n,a);break e;case 14:s=og(null,s,c,On(c.type,n),a);break e}throw Error(t(306,c,""))}return s;case 0:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:On(c,d),hd(n,s,c,d,a);case 1:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:On(c,d),cg(n,s,c,d,a);case 3:e:{if(hg(s),n===null)throw Error(t(387));c=s.pendingProps,p=s.memoizedState,d=p.element,Am(n,s),wu(s,c,null,a);var v=s.memoizedState;if(c=v.element,p.isDehydrated)if(p={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},s.updateQueue.baseState=p,s.memoizedState=p,s.flags&256){d=Eo(Error(t(423)),s),s=dg(n,s,c,a,d);break e}else if(c!==d){d=Eo(Error(t(424)),s),s=dg(n,s,c,a,d);break e}else for(fn=ps(s.stateNode.containerInfo.firstChild),dn=s,nt=!0,Vn=null,a=xm(s,null,c,a),s.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(go(),c===d){s=Vr(n,s,a);break e}Qt(n,s,c,a)}s=s.child}return s;case 5:return Rm(s),n===null&&zh(s),c=s.type,d=s.pendingProps,p=n!==null?n.memoizedProps:null,v=d.children,bh(c,d)?v=null:p!==null&&bh(c,p)&&(s.flags|=32),ug(n,s),Qt(n,s,v,a),s.child;case 6:return n===null&&zh(s),null;case 13:return fg(n,s,a);case 4:return Qh(s,s.stateNode.containerInfo),c=s.pendingProps,n===null?s.child=yo(s,null,c,a):Qt(n,s,c,a),s.child;case 11:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:On(c,d),ig(n,s,c,d,a);case 7:return Qt(n,s,s.pendingProps,a),s.child;case 8:return Qt(n,s,s.pendingProps.children,a),s.child;case 12:return Qt(n,s,s.pendingProps.children,a),s.child;case 10:e:{if(c=s.type._context,d=s.pendingProps,p=s.memoizedProps,v=d.value,Ge(yu,c._currentValue),c._currentValue=v,p!==null)if(Dn(p.value,v)){if(p.children===d.children&&!Yt.current){s=Vr(n,s,a);break e}}else for(p=s.child,p!==null&&(p.return=s);p!==null;){var S=p.dependencies;if(S!==null){v=p.child;for(var N=S.firstContext;N!==null;){if(N.context===c){if(p.tag===1){N=Dr(-1,a&-a),N.tag=2;var U=p.updateQueue;if(U!==null){U=U.shared;var Y=U.pending;Y===null?N.next=N:(N.next=Y.next,Y.next=N),U.pending=N}}p.lanes|=a,N=p.alternate,N!==null&&(N.lanes|=a),Wh(p.return,a,s),S.lanes|=a;break}N=N.next}}else if(p.tag===10)v=p.type===s.type?null:p.child;else if(p.tag===18){if(v=p.return,v===null)throw Error(t(341));v.lanes|=a,S=v.alternate,S!==null&&(S.lanes|=a),Wh(v,a,s),v=p.sibling}else v=p.child;if(v!==null)v.return=p;else for(v=p;v!==null;){if(v===s){v=null;break}if(p=v.sibling,p!==null){p.return=v.return,v=p;break}v=v.return}p=v}Qt(n,s,d.children,a),s=s.child}return s;case 9:return d=s.type,c=s.pendingProps.children,vo(s,a),d=Tn(d),c=c(d),s.flags|=1,Qt(n,s,c,a),s.child;case 14:return c=s.type,d=On(c,s.pendingProps),d=On(c.type,d),og(n,s,c,d,a);case 15:return ag(n,s,s.type,s.pendingProps,a);case 17:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:On(c,d),Ru(n,s),s.tag=1,Xt(c)?(n=!0,hu(s)):n=!1,vo(s,a),Xm(s,c,d),ld(s,c,d,a),dd(null,s,c,!0,n,a);case 19:return mg(n,s,a);case 22:return lg(n,s,a)}throw Error(t(156,s.tag))};function Fg(n,s){return ra(n,s)}function kE(n,s,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=s,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Sn(n,s,a,c){return new kE(n,s,a,c)}function bd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function CE(n){if(typeof n=="function")return bd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===O)return 11;if(n===yt)return 14}return 2}function Ss(n,s){var a=n.alternate;return a===null?(a=Sn(n.tag,s,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=s,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,s=n.dependencies,a.dependencies=s===null?null:{lanes:s.lanes,firstContext:s.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function Uu(n,s,a,c,d,p){var v=2;if(c=n,typeof n=="function")bd(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case k:return Ii(a.children,d,p,s);case x:v=8,d|=8;break;case R:return n=Sn(12,a,s,d|2),n.elementType=R,n.lanes=p,n;case C:return n=Sn(13,a,s,d),n.elementType=C,n.lanes=p,n;case qe:return n=Sn(19,a,s,d),n.elementType=qe,n.lanes=p,n;case We:return zu(a,d,p,s);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case b:v=10;break e;case P:v=9;break e;case O:v=11;break e;case yt:v=14;break e;case Ct:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return s=Sn(v,a,s,d),s.elementType=n,s.type=c,s.lanes=p,s}function Ii(n,s,a,c){return n=Sn(7,n,c,s),n.lanes=a,n}function zu(n,s,a,c){return n=Sn(22,n,c,s),n.elementType=We,n.lanes=a,n.stateNode={isHidden:!1},n}function Dd(n,s,a){return n=Sn(6,n,null,s),n.lanes=a,n}function Vd(n,s,a){return s=Sn(4,n.children!==null?n.children:[],n.key,s),s.lanes=a,s.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},s}function RE(n,s,a,c,d){this.tag=s,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=la(0),this.expirationTimes=la(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=la(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Od(n,s,a,c,d,p,v,S,N){return n=new RE(n,s,a,S,N),s===1?(s=1,p===!0&&(s|=8)):s=0,p=Sn(3,null,null,s),n.current=p,p.stateNode=n,p.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Gh(p),n}function PE(n,s,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:de,key:c==null?null:""+c,children:n,containerInfo:s,implementation:a}}function Ug(n){if(!n)return gs;n=n._reactInternals;e:{if(Nn(n)!==n||n.tag!==1)throw Error(t(170));var s=n;do{switch(s.tag){case 3:s=s.stateNode.context;break e;case 1:if(Xt(s.type)){s=s.stateNode.__reactInternalMemoizedMergedChildContext;break e}}s=s.return}while(s!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Xt(a))return pm(n,a,s)}return s}function zg(n,s,a,c,d,p,v,S,N){return n=Od(a,c,!0,n,d,p,v,S,N),n.context=Ug(null),a=n.current,c=Jt(),d=Is(a),p=Dr(c,d),p.callback=s??null,vs(a,p,d),n.current.lanes=d,ai(n,d,c),tn(n,c),n}function Bu(n,s,a,c){var d=s.current,p=Jt(),v=Is(d);return a=Ug(a),s.context===null?s.context=a:s.pendingContext=a,s=Dr(p,v),s.payload={element:n},c=c===void 0?null:c,c!==null&&(s.callback=c),n=vs(d,s,v),n!==null&&(jn(n,d,v,p),vu(n,d,v)),v}function $u(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Bg(n,s){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<s?a:s}}function Ld(n,s){Bg(n,s),(n=n.alternate)&&Bg(n,s)}function NE(){return null}var $g=typeof reportError=="function"?reportError:function(n){console.error(n)};function Md(n){this._internalRoot=n}Hu.prototype.render=Md.prototype.render=function(n){var s=this._internalRoot;if(s===null)throw Error(t(409));Bu(n,s,null,null)},Hu.prototype.unmount=Md.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var s=n.containerInfo;wi(function(){Bu(null,n,null,null)}),s[Cr]=null}};function Hu(n){this._internalRoot=n}Hu.prototype.unstable_scheduleHydration=function(n){if(n){var s=da();n={blockedOn:null,target:n,priority:s};for(var a=0;a<ln.length&&s!==0&&s<ln[a].priority;a++);ln.splice(a,0,n),a===0&&Ji(n)}};function jd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function qu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Hg(){}function bE(n,s,a,c,d){if(d){if(typeof c=="function"){var p=c;c=function(){var U=$u(v);p.call(U)}}var v=zg(s,c,n,0,null,!1,!1,"",Hg);return n._reactRootContainer=v,n[Cr]=v.current,xa(n.nodeType===8?n.parentNode:n),wi(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var S=c;c=function(){var U=$u(N);S.call(U)}}var N=Od(n,0,!1,null,null,!1,!1,"",Hg);return n._reactRootContainer=N,n[Cr]=N.current,xa(n.nodeType===8?n.parentNode:n),wi(function(){Bu(s,N,a,c)}),N}function Wu(n,s,a,c,d){var p=a._reactRootContainer;if(p){var v=p;if(typeof d=="function"){var S=d;d=function(){var N=$u(v);S.call(N)}}Bu(s,v,n,d)}else v=bE(a,s,n,d,c);return $u(v)}ca=function(n){switch(n.tag){case 3:var s=n.stateNode;if(s.current.memoizedState.isDehydrated){var a=Ue(s.pendingLanes);a!==0&&(ua(s,a|1),tn(s,Je()),(je&6)===0&&(xo=Je()+500,ys()))}break;case 13:wi(function(){var c=br(n,1);if(c!==null){var d=Jt();jn(c,n,1,d)}}),Ld(n,1)}},Gi=function(n){if(n.tag===13){var s=br(n,134217728);if(s!==null){var a=Jt();jn(s,n,134217728,a)}Ld(n,134217728)}},ha=function(n){if(n.tag===13){var s=Is(n),a=br(n,s);if(a!==null){var c=Jt();jn(a,n,s,c)}Ld(n,s)}},da=function(){return Le},fa=function(n,s){var a=Le;try{return Le=n,s()}finally{Le=a}},_r=function(n,s,a){switch(s){case"input":if(Ys(n,a),s=a.name,a.type==="radio"&&s!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+s)+'][type="radio"]'),s=0;s<a.length;s++){var c=a[s];if(c!==n&&c.form===n.form){var d=uu(c);if(!d)throw Error(t(90));et(c),Ys(c,d)}}}break;case"textarea":Vl(n,a);break;case"select":s=a.value,s!=null&&Rn(n,!!a.multiple,s,!1)}},Ml=Rd,jl=wi;var DE={usingClientEntryPoint:!1,Events:[ka,co,uu,rs,ss,Rd]},za={findFiberByHostInstance:di,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},VE={bundleType:za.bundleType,version:za.version,rendererPackageName:za.rendererPackageName,rendererConfig:za.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:xe.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ql(n),n===null?null:n.stateNode},findFiberByHostInstance:za.findFiberByHostInstance||NE,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ku=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ku.isDisabled&&Ku.supportsFiber)try{ri=Ku.inject(VE),on=Ku}catch{}}return nn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=DE,nn.createPortal=function(n,s){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!jd(s))throw Error(t(200));return PE(n,s,null,a)},nn.createRoot=function(n,s){if(!jd(n))throw Error(t(299));var a=!1,c="",d=$g;return s!=null&&(s.unstable_strictMode===!0&&(a=!0),s.identifierPrefix!==void 0&&(c=s.identifierPrefix),s.onRecoverableError!==void 0&&(d=s.onRecoverableError)),s=Od(n,1,!1,null,null,a,!1,c,d),n[Cr]=s.current,xa(n.nodeType===8?n.parentNode:n),new Md(s)},nn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var s=n._reactInternals;if(s===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ql(s),n=n===null?null:n.stateNode,n},nn.flushSync=function(n){return wi(n)},nn.hydrate=function(n,s,a){if(!qu(s))throw Error(t(200));return Wu(null,n,s,!0,a)},nn.hydrateRoot=function(n,s,a){if(!jd(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,p="",v=$g;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(p=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),s=zg(s,null,n,1,a??null,d,!1,p,v),n[Cr]=s.current,xa(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),s.mutableSourceEagerHydrationData==null?s.mutableSourceEagerHydrationData=[a,d]:s.mutableSourceEagerHydrationData.push(a,d);return new Hu(s)},nn.render=function(n,s,a){if(!qu(s))throw Error(t(200));return Wu(null,n,s,!1,a)},nn.unmountComponentAtNode=function(n){if(!qu(n))throw Error(t(40));return n._reactRootContainer?(wi(function(){Wu(null,null,n,!1,function(){n._reactRootContainer=null,n[Cr]=null})}),!0):!1},nn.unstable_batchedUpdates=Rd,nn.unstable_renderSubtreeIntoContainer=function(n,s,a,c){if(!qu(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Wu(n,s,a,!1,c)},nn.version="18.3.1-next-f1338f8080-20240426",nn}var Xg;function qE(){if(Xg)return zd.exports;Xg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),zd.exports=HE(),zd.exports}var Zg;function WE(){if(Zg)return Qu;Zg=1;var r=qE();return Qu.createRoot=r.createRoot,Qu.hydrateRoot=r.hydrateRoot,Qu}var KE=WE();const GE=j_(KE);let QE={data:""},JE=r=>{if(typeof window=="object"){let e=(r?r.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(r||document.head).appendChild(e),e.firstChild}return r||QE},YE=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,XE=/\/\*[^]*?\*\/|  +/g,ey=/\n+/g,Rs=(r,e)=>{let t="",i="",o="";for(let l in r){let h=r[l];l[0]=="@"?l[1]=="i"?t=l+" "+h+";":i+=l[1]=="f"?Rs(h,l):l+"{"+Rs(h,l[1]=="k"?"":e)+"}":typeof h=="object"?i+=Rs(h,e?e.replace(/([^,])+/g,f=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,g=>/&/.test(g)?g.replace(/&/g,f):f?f+" "+g:g)):l):h!=null&&(l=l[1]=="-"?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=Rs.p?Rs.p(l,h):l+":"+h+";")}return t+(e&&o?e+"{"+o+"}":o)+i},ks={},F_=r=>{if(typeof r=="object"){let e="";for(let t in r)e+=t+F_(r[t]);return e}return r},ZE=(r,e,t,i,o)=>{let l=F_(r),h=ks[l]||(ks[l]=(g=>{let _=0,w=11;for(;_<g.length;)w=101*w+g.charCodeAt(_++)>>>0;return"go"+w})(l));if(!ks[h]){let g=l!==r?r:(_=>{let w,I,A=[{}];for(;w=YE.exec(_.replace(XE,""));)w[4]?A.shift():w[3]?(I=w[3].replace(ey," ").trim(),A.unshift(A[0][I]=A[0][I]||{})):A[0][w[1]]=w[2].replace(ey," ").trim();return A[0]})(r);ks[h]=Rs(o?{["@keyframes "+h]:g}:g,t?"":"."+h)}let f=t&&ks.g;return t&&(ks.g=ks[h]),((g,_,w,I)=>{I?_.data=_.data.replace(I,g):_.data.indexOf(g)===-1&&(_.data=w?g+_.data:_.data+g)})(ks[h],e,i,f),h},eT=(r,e,t)=>r.reduce((i,o,l)=>{let h=e[l];if(h&&h.call){let f=h(t),g=f&&f.props&&f.props.className||/^go/.test(f)&&f;h=g?"."+g:f&&typeof f=="object"?f.props?"":Rs(f,""):f===!1?"":f}return i+o+(h??"")},"");function qc(r){let e=this||{},t=r.call?r(e.p):r;return ZE(t.unshift?t.raw?eT(t,[].slice.call(arguments,1),e.p):t.reduce((i,o)=>Object.assign(i,o&&o.call?o(e.p):o),{}):t,JE(e.target),e.g,e.o,e.k)}let U_,rf,sf;qc.bind({g:1});let Hr=qc.bind({k:1});function tT(r,e,t,i){Rs.p=e,U_=r,rf=t,sf=i}function Ws(r,e){let t=this||{};return function(){let i=arguments;function o(l,h){let f=Object.assign({},l),g=f.className||o.className;t.p=Object.assign({theme:rf&&rf()},f),t.o=/go\d/.test(g),f.className=qc.apply(t,i)+(g?" "+g:"");let _=r;return r[0]&&(_=f.as||r,delete f.as),sf&&_[0]&&sf(f),U_(_,f)}return o}}var nT=r=>typeof r=="function",_c=(r,e)=>nT(r)?r(e):r,rT=(()=>{let r=0;return()=>(++r).toString()})(),z_=(()=>{let r;return()=>{if(r===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r}})(),sT=20,Df="default",B_=(r,e)=>{let{toastLimit:t}=r.settings;switch(e.type){case 0:return{...r,toasts:[e.toast,...r.toasts].slice(0,t)};case 1:return{...r,toasts:r.toasts.map(h=>h.id===e.toast.id?{...h,...e.toast}:h)};case 2:let{toast:i}=e;return B_(r,{type:r.toasts.find(h=>h.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=e;return{...r,toasts:r.toasts.map(h=>h.id===o||o===void 0?{...h,dismissed:!0,visible:!1}:h)};case 4:return e.toastId===void 0?{...r,toasts:[]}:{...r,toasts:r.toasts.filter(h=>h.id!==e.toastId)};case 5:return{...r,pausedAt:e.time};case 6:let l=e.time-(r.pausedAt||0);return{...r,pausedAt:void 0,toasts:r.toasts.map(h=>({...h,pauseDuration:h.pauseDuration+l}))}}},oc=[],$_={toasts:[],pausedAt:void 0,settings:{toastLimit:sT}},cr={},H_=(r,e=Df)=>{cr[e]=B_(cr[e]||$_,r),oc.forEach(([t,i])=>{t===e&&i(cr[e])})},q_=r=>Object.keys(cr).forEach(e=>H_(r,e)),iT=r=>Object.keys(cr).find(e=>cr[e].toasts.some(t=>t.id===r)),Wc=(r=Df)=>e=>{H_(e,r)},oT={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},aT=(r={},e=Df)=>{let[t,i]=Q.useState(cr[e]||$_),o=Q.useRef(cr[e]);Q.useEffect(()=>(o.current!==cr[e]&&i(cr[e]),oc.push([e,i]),()=>{let h=oc.findIndex(([f])=>f===e);h>-1&&oc.splice(h,1)}),[e]);let l=t.toasts.map(h=>{var f,g,_;return{...r,...r[h.type],...h,removeDelay:h.removeDelay||((f=r[h.type])==null?void 0:f.removeDelay)||(r==null?void 0:r.removeDelay),duration:h.duration||((g=r[h.type])==null?void 0:g.duration)||(r==null?void 0:r.duration)||oT[h.type],style:{...r.style,...(_=r[h.type])==null?void 0:_.style,...h.style}}});return{...t,toasts:l}},lT=(r,e="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:r,pauseDuration:0,...t,id:(t==null?void 0:t.id)||rT()}),_l=r=>(e,t)=>{let i=lT(e,r,t);return Wc(i.toasterId||iT(i.id))({type:2,toast:i}),i.id},At=(r,e)=>_l("blank")(r,e);At.error=_l("error");At.success=_l("success");At.loading=_l("loading");At.custom=_l("custom");At.dismiss=(r,e)=>{let t={type:3,toastId:r};e?Wc(e)(t):q_(t)};At.dismissAll=r=>At.dismiss(void 0,r);At.remove=(r,e)=>{let t={type:4,toastId:r};e?Wc(e)(t):q_(t)};At.removeAll=r=>At.remove(void 0,r);At.promise=(r,e,t)=>{let i=At.loading(e.loading,{...t,...t==null?void 0:t.loading});return typeof r=="function"&&(r=r()),r.then(o=>{let l=e.success?_c(e.success,o):void 0;return l?At.success(l,{id:i,...t,...t==null?void 0:t.success}):At.dismiss(i),o}).catch(o=>{let l=e.error?_c(e.error,o):void 0;l?At.error(l,{id:i,...t,...t==null?void 0:t.error}):At.dismiss(i)}),r};var uT=1e3,cT=(r,e="default")=>{let{toasts:t,pausedAt:i}=aT(r,e),o=Q.useRef(new Map).current,l=Q.useCallback((I,A=uT)=>{if(o.has(I))return;let j=setTimeout(()=>{o.delete(I),h({type:4,toastId:I})},A);o.set(I,j)},[]);Q.useEffect(()=>{if(i)return;let I=Date.now(),A=t.map(j=>{if(j.duration===1/0)return;let W=(j.duration||0)+j.pauseDuration-(I-j.createdAt);if(W<0){j.visible&&At.dismiss(j.id);return}return setTimeout(()=>At.dismiss(j.id,e),W)});return()=>{A.forEach(j=>j&&clearTimeout(j))}},[t,i,e]);let h=Q.useCallback(Wc(e),[e]),f=Q.useCallback(()=>{h({type:5,time:Date.now()})},[h]),g=Q.useCallback((I,A)=>{h({type:1,toast:{id:I,height:A}})},[h]),_=Q.useCallback(()=>{i&&h({type:6,time:Date.now()})},[i,h]),w=Q.useCallback((I,A)=>{let{reverseOrder:j=!1,gutter:W=8,defaultPosition:K}=A||{},$=t.filter(ce=>(ce.position||K)===(I.position||K)&&ce.height),me=$.findIndex(ce=>ce.id===I.id),ae=$.filter((ce,xe)=>xe<me&&ce.visible).length;return $.filter(ce=>ce.visible).slice(...j?[ae+1]:[0,ae]).reduce((ce,xe)=>ce+(xe.height||0)+W,0)},[t]);return Q.useEffect(()=>{t.forEach(I=>{if(I.dismissed)l(I.id,I.removeDelay);else{let A=o.get(I.id);A&&(clearTimeout(A),o.delete(I.id))}})},[t,l]),{toasts:t,handlers:{updateHeight:g,startPause:f,endPause:_,calculateOffset:w}}},hT=Hr`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,dT=Hr`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,fT=Hr`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,pT=Ws("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${hT} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${dT} 0.15s ease-out forwards;
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
    animation: ${fT} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,mT=Hr`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,gT=Ws("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${r=>r.secondary||"#e0e0e0"};
  border-right-color: ${r=>r.primary||"#616161"};
  animation: ${mT} 1s linear infinite;
`,yT=Hr`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,_T=Hr`
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
}`,vT=Ws("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${yT} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${_T} 0.2s ease-out forwards;
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
`,wT=Ws("div")`
  position: absolute;
`,ET=Ws("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,TT=Hr`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,IT=Ws("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${TT} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,xT=({toast:r})=>{let{icon:e,type:t,iconTheme:i}=r;return e!==void 0?typeof e=="string"?Q.createElement(IT,null,e):e:t==="blank"?null:Q.createElement(ET,null,Q.createElement(gT,{...i}),t!=="loading"&&Q.createElement(wT,null,t==="error"?Q.createElement(pT,{...i}):Q.createElement(vT,{...i})))},ST=r=>`
0% {transform: translate3d(0,${r*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,AT=r=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${r*-150}%,-1px) scale(.6); opacity:0;}
`,kT="0%{opacity:0;} 100%{opacity:1;}",CT="0%{opacity:1;} 100%{opacity:0;}",RT=Ws("div")`
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
`,PT=Ws("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,NT=(r,e)=>{let t=r.includes("top")?1:-1,[i,o]=z_()?[kT,CT]:[ST(t),AT(t)];return{animation:e?`${Hr(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${Hr(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},bT=Q.memo(({toast:r,position:e,style:t,children:i})=>{let o=r.height?NT(r.position||e||"top-center",r.visible):{opacity:0},l=Q.createElement(xT,{toast:r}),h=Q.createElement(PT,{...r.ariaProps},_c(r.message,r));return Q.createElement(RT,{className:r.className,style:{...o,...t,...r.style}},typeof i=="function"?i({icon:l,message:h}):Q.createElement(Q.Fragment,null,l,h))});tT(Q.createElement);var DT=({id:r,className:e,style:t,onHeightUpdate:i,children:o})=>{let l=Q.useCallback(h=>{if(h){let f=()=>{let g=h.getBoundingClientRect().height;i(r,g)};f(),new MutationObserver(f).observe(h,{subtree:!0,childList:!0,characterData:!0})}},[r,i]);return Q.createElement("div",{ref:l,className:e,style:t},o)},VT=(r,e)=>{let t=r.includes("top"),i=t?{top:0}:{bottom:0},o=r.includes("center")?{justifyContent:"center"}:r.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:z_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(t?1:-1)}px)`,...i,...o}},OT=qc`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Ju=16,LT=({reverseOrder:r,position:e="top-center",toastOptions:t,gutter:i,children:o,toasterId:l,containerStyle:h,containerClassName:f})=>{let{toasts:g,handlers:_}=cT(t,l);return Q.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:Ju,left:Ju,right:Ju,bottom:Ju,pointerEvents:"none",...h},className:f,onMouseEnter:_.startPause,onMouseLeave:_.endPause},g.map(w=>{let I=w.position||e,A=_.calculateOffset(w,{reverseOrder:r,gutter:i,defaultPosition:e}),j=VT(I,A);return Q.createElement(DT,{id:w.id,key:w.id,onHeightUpdate:_.updateHeight,className:w.visible?OT:"",style:j},w.type==="custom"?_c(w.message,w):o?o(w):Q.createElement(bT,{toast:w,position:I}))}))},He=At;const MT=()=>{};var ty={};/**
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
 */const W_=function(r){const e=[];let t=0;for(let i=0;i<r.length;i++){let o=r.charCodeAt(i);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&i+1<r.length&&(r.charCodeAt(i+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++i)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},jT=function(r){const e=[];let t=0,i=0;for(;t<r.length;){const o=r[t++];if(o<128)e[i++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[i++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],f=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|f&63)-65536;e[i++]=String.fromCharCode(55296+(g>>10)),e[i++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[i++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},K_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,f=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,w=l>>2,I=(l&3)<<4|f>>4;let A=(f&15)<<2|_>>6,j=_&63;g||(j=64,h||(A=64)),i.push(t[w],t[I],t[A],t[j])}return i.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(W_(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):jT(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],f=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const I=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||f==null||_==null||I==null)throw new FT;const A=l<<2|f>>4;if(i.push(A),_!==64){const j=f<<4&240|_>>2;if(i.push(j),I!==64){const W=_<<6&192|I;i.push(W)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class FT extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const UT=function(r){const e=W_(r);return K_.encodeByteArray(e,!0)},vc=function(r){return UT(r).replace(/\./g,"")},G_=function(r){try{return K_.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function zT(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const BT=()=>zT().__FIREBASE_DEFAULTS__,$T=()=>{if(typeof process>"u"||typeof ty>"u")return;const r=ty.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},HT=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&G_(r[1]);return e&&JSON.parse(e)},Kc=()=>{try{return MT()||BT()||$T()||HT()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Q_=r=>{var e,t;return(t=(e=Kc())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},qT=r=>{const e=Q_(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},J_=()=>{var r;return(r=Kc())==null?void 0:r.config},Y_=r=>{var e;return(e=Kc())==null?void 0:e[`_${r}`]};/**
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
 */class WT{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
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
 */function KT(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${i}`,aud:i,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}},...r};return[vc(JSON.stringify(t)),vc(JSON.stringify(h)),""].join(".")}/**
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
 */function Gt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function GT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Gt())}function QT(){var e;const r=(e=Kc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function JT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function YT(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function XT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ZT(){const r=Gt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function eI(){return!QT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function tI(){try{return typeof indexedDB=="object"}catch{return!1}}function nI(){return new Promise((r,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(i);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(i),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)==null?void 0:l.message)||"")}}catch(t){e(t)}})}/**
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
 */const rI="FirebaseError";class Qr extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=rI,Object.setPrototypeOf(this,Qr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,vl.prototype.create)}}class vl{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?sI(l,i):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new Qr(o,f,i)}}function sI(r,e){return r.replace(iI,(t,i)=>{const o=e[i];return o!=null?String(o):`<${i}?>`})}const iI=/\{\$([^}]+)}/g;function oI(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Ri(r,e){if(r===e)return!0;const t=Object.keys(r),i=Object.keys(e);for(const o of t){if(!i.includes(o))return!1;const l=r[o],h=e[o];if(ny(l)&&ny(h)){if(!Ri(l,h))return!1}else if(l!==h)return!1}for(const o of i)if(!t.includes(o))return!1;return!0}function ny(r){return r!==null&&typeof r=="object"}/**
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
 */function wl(r){const e=[];for(const[t,i]of Object.entries(r))Array.isArray(i)?i.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Wa(r){const e={};return r.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[o,l]=i.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function Ka(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function aI(r,e){const t=new lI(r,e);return t.subscribe.bind(t)}class lI{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let o;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");uI(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:i},o.next===void 0&&(o.next=Hd),o.error===void 0&&(o.error=Hd),o.complete===void 0&&(o.complete=Hd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function uI(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Hd(){}/**
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
 */function gt(r){return r&&r._delegate?r._delegate:r}/**
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
 */function El(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function X_(r){return(await fetch(r,{credentials:"include"})).ok}class Pi{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const xi="[DEFAULT]";/**
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
 */class cI{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new WT;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&i.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(i)return null;throw o}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(dI(e))try{this.getOrInitializeService({instanceIdentifier:xi})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});i.resolve(l)}catch{}}}}clearInstance(e=xi){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=xi){return this.instances.has(e)}getOptions(e=xi){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[l,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(l);i===f&&h.resolve(o)}return o}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(i)??new Set;o.add(e),this.onInitCallbacks.set(i,o);const l=this.instances.get(i);return l&&e(l,i),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const o of i)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:hI(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=xi){return this.component?this.component.multipleInstances?e:xi:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function hI(r){return r===xi?void 0:r}function dI(r){return r.instantiationMode==="EAGER"}/**
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
 */class fI{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new cI(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Oe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Oe||(Oe={}));const pI={debug:Oe.DEBUG,verbose:Oe.VERBOSE,info:Oe.INFO,warn:Oe.WARN,error:Oe.ERROR,silent:Oe.SILENT},mI=Oe.INFO,gI={[Oe.DEBUG]:"log",[Oe.VERBOSE]:"log",[Oe.INFO]:"info",[Oe.WARN]:"warn",[Oe.ERROR]:"error"},yI=(r,e,...t)=>{if(e<r.logLevel)return;const i=new Date().toISOString(),o=gI[e];if(o)console[o](`[${i}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Vf{constructor(e){this.name=e,this._logLevel=mI,this._logHandler=yI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?pI[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Oe.DEBUG,...e),this._logHandler(this,Oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Oe.VERBOSE,...e),this._logHandler(this,Oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Oe.INFO,...e),this._logHandler(this,Oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Oe.WARN,...e),this._logHandler(this,Oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Oe.ERROR,...e),this._logHandler(this,Oe.ERROR,...e)}}const _I=(r,e)=>e.some(t=>r instanceof t);let ry,sy;function vI(){return ry||(ry=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function wI(){return sy||(sy=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Z_=new WeakMap,of=new WeakMap,ev=new WeakMap,qd=new WeakMap,Of=new WeakMap;function EI(r){const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(Ds(r.result)),o()},h=()=>{i(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&Z_.set(t,r)}).catch(()=>{}),Of.set(e,r),e}function TI(r){if(of.has(r))return;const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{i(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});of.set(r,e)}let af={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return of.get(r);if(e==="objectStoreNames")return r.objectStoreNames||ev.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ds(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function II(r){af=r(af)}function xI(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=r.call(Wd(this),e,...t);return ev.set(i,e.sort?e.sort():[e]),Ds(i)}:wI().includes(r)?function(...e){return r.apply(Wd(this),e),Ds(Z_.get(this))}:function(...e){return Ds(r.apply(Wd(this),e))}}function SI(r){return typeof r=="function"?xI(r):(r instanceof IDBTransaction&&TI(r),_I(r,vI())?new Proxy(r,af):r)}function Ds(r){if(r instanceof IDBRequest)return EI(r);if(qd.has(r))return qd.get(r);const e=SI(r);return e!==r&&(qd.set(r,e),Of.set(e,r)),e}const Wd=r=>Of.get(r);function AI(r,e,{blocked:t,upgrade:i,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),f=Ds(h);return i&&h.addEventListener("upgradeneeded",g=>{i(Ds(h.result),g.oldVersion,g.newVersion,Ds(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),f}const kI=["get","getKey","getAll","getAllKeys","count"],CI=["put","add","delete","clear"],Kd=new Map;function iy(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Kd.get(e))return Kd.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,o=CI.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(o||kI.includes(t)))return;const l=async function(h,...f){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return i&&(_=_.index(f.shift())),(await Promise.all([_[t](...f),o&&g.done]))[0]};return Kd.set(e,l),l}II(r=>({...r,get:(e,t,i)=>iy(e,t)||r.get(e,t,i),has:(e,t)=>!!iy(e,t)||r.has(e,t)}));/**
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
 */class RI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(PI(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function PI(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const lf="@firebase/app",oy="0.14.13";/**
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
 */const qr=new Vf("@firebase/app"),NI="@firebase/app-compat",bI="@firebase/analytics-compat",DI="@firebase/analytics",VI="@firebase/app-check-compat",OI="@firebase/app-check",LI="@firebase/auth",MI="@firebase/auth-compat",jI="@firebase/database",FI="@firebase/data-connect",UI="@firebase/database-compat",zI="@firebase/functions",BI="@firebase/functions-compat",$I="@firebase/installations",HI="@firebase/installations-compat",qI="@firebase/messaging",WI="@firebase/messaging-compat",KI="@firebase/performance",GI="@firebase/performance-compat",QI="@firebase/remote-config",JI="@firebase/remote-config-compat",YI="@firebase/storage",XI="@firebase/storage-compat",ZI="@firebase/firestore",e1="@firebase/ai",t1="@firebase/firestore-compat",n1="firebase",r1="12.14.0";/**
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
 */const uf="[DEFAULT]",s1={[lf]:"fire-core",[NI]:"fire-core-compat",[DI]:"fire-analytics",[bI]:"fire-analytics-compat",[OI]:"fire-app-check",[VI]:"fire-app-check-compat",[LI]:"fire-auth",[MI]:"fire-auth-compat",[jI]:"fire-rtdb",[FI]:"fire-data-connect",[UI]:"fire-rtdb-compat",[zI]:"fire-fn",[BI]:"fire-fn-compat",[$I]:"fire-iid",[HI]:"fire-iid-compat",[qI]:"fire-fcm",[WI]:"fire-fcm-compat",[KI]:"fire-perf",[GI]:"fire-perf-compat",[QI]:"fire-rc",[JI]:"fire-rc-compat",[YI]:"fire-gcs",[XI]:"fire-gcs-compat",[ZI]:"fire-fst",[t1]:"fire-fst-compat",[e1]:"fire-vertex","fire-js":"fire-js",[n1]:"fire-js-all"};/**
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
 */const wc=new Map,i1=new Map,cf=new Map;function ay(r,e){try{r.container.addComponent(e)}catch(t){qr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Oo(r){const e=r.name;if(cf.has(e))return qr.debug(`There were multiple attempts to register component ${e}.`),!1;cf.set(e,r);for(const t of wc.values())ay(t,r);for(const t of i1.values())ay(t,r);return!0}function Lf(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function mn(r){return r==null?!1:r.settings!==void 0}/**
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
 */const o1={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Vs=new vl("app","Firebase",o1);/**
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
 */class a1{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Pi("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Vs.create("app-deleted",{appName:this._name})}}/**
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
 */const Bo=r1;function tv(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const i={name:uf,automaticDataCollectionEnabled:!0,...e},o=i.name;if(typeof o!="string"||!o)throw Vs.create("bad-app-name",{appName:String(o)});if(t||(t=J_()),!t)throw Vs.create("no-options");const l=wc.get(o);if(l){if(Ri(t,l.options)&&Ri(i,l.config))return l;throw Vs.create("duplicate-app",{appName:o})}const h=new fI(o);for(const g of cf.values())h.addComponent(g);const f=new a1(t,i,h);return wc.set(o,f),f}function nv(r=uf){const e=wc.get(r);if(!e&&r===uf&&J_())return tv();if(!e)throw Vs.create("no-app",{appName:r});return e}function Os(r,e,t){let i=s1[r]??r;t&&(i+=`-${t}`);const o=i.match(/\s|\//),l=e.match(/\s|\//);if(o||l){const h=[`Unable to register library "${i}" with version "${e}":`];o&&h.push(`library name "${i}" contains illegal characters (whitespace or "/")`),o&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),qr.warn(h.join(" "));return}Oo(new Pi(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const l1="firebase-heartbeat-database",u1=1,sl="firebase-heartbeat-store";let Gd=null;function rv(){return Gd||(Gd=AI(l1,u1,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(sl)}catch(t){console.warn(t)}}}}).catch(r=>{throw Vs.create("idb-open",{originalErrorMessage:r.message})})),Gd}async function c1(r){try{const t=(await rv()).transaction(sl),i=await t.objectStore(sl).get(sv(r));return await t.done,i}catch(e){if(e instanceof Qr)qr.warn(e.message);else{const t=Vs.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});qr.warn(t.message)}}}async function ly(r,e){try{const i=(await rv()).transaction(sl,"readwrite");await i.objectStore(sl).put(e,sv(r)),await i.done}catch(t){if(t instanceof Qr)qr.warn(t.message);else{const i=Vs.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});qr.warn(i.message)}}}function sv(r){return`${r.name}!${r.options.appId}`}/**
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
 */const h1=1024,d1=30;class f1{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new m1(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=uy();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>d1){const h=g1(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){qr.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=uy(),{heartbeatsToSend:i,unsentEntries:o}=p1(this._heartbeatsCache.heartbeats),l=vc(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return qr.warn(t),""}}}function uy(){return new Date().toISOString().substring(0,10)}function p1(r,e=h1){const t=[];let i=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),cy(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),cy(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class m1{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return tI()?nI().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await c1(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return ly(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return ly(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function cy(r){return vc(JSON.stringify({version:2,heartbeats:r})).length}function g1(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let i=1;i<r.length;i++)r[i].date<t&&(t=r[i].date,e=i);return e}/**
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
 */function y1(r){Oo(new Pi("platform-logger",e=>new RI(e),"PRIVATE")),Oo(new Pi("heartbeat",e=>new f1(e),"PRIVATE")),Os(lf,oy,r),Os(lf,oy,"esm2020"),Os("fire-js","")}y1("");function iv(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _1=iv,ov=new vl("auth","Firebase",iv());/**
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
 */const Ec=new Vf("@firebase/auth");function v1(r,...e){Ec.logLevel<=Oe.WARN&&Ec.warn(`Auth (${Bo}): ${r}`,...e)}function ac(r,...e){Ec.logLevel<=Oe.ERROR&&Ec.error(`Auth (${Bo}): ${r}`,...e)}/**
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
 */function Cn(r,...e){throw jf(r,...e)}function Un(r,...e){return jf(r,...e)}function Mf(r,e,t){const i={..._1(),[e]:t};return new vl("auth","Firebase",i).create(e,{appName:r.name})}function Br(r){return Mf(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function w1(r,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&Cn(r,"argument-error"),Mf(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function jf(r,...e){if(typeof r!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=r.name),r._errorFactory.create(t,...i)}return ov.create(r,...e)}function Se(r,e,...t){if(!r)throw jf(e,...t)}function Fr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw ac(e),new Error(e)}function Wr(r,e){r||Fr(e)}/**
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
 */function hf(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function E1(){return hy()==="http:"||hy()==="https:"}function hy(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
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
 */function T1(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(E1()||YT()||"connection"in navigator)?navigator.onLine:!0}function I1(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
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
 */class Tl{constructor(e,t){this.shortDelay=e,this.longDelay=t,Wr(t>e,"Short delay should be less than long delay!"),this.isMobile=GT()||XT()}get(){return T1()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Ff(r,e){Wr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class av{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Fr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Fr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Fr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const x1={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const S1=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],A1=new Tl(3e4,6e4);function Ks(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Jr(r,e,t,i,o={}){return lv(r,o,async()=>{let l={},h={};i&&(e==="GET"?h=i:l={body:JSON.stringify(i)});const f=wl({key:r.config.apiKey,...h}).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _={method:e,headers:g,...l};return JT()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&El(r.emulatorConfig.host)&&(_.credentials="include"),av.fetch()(await uv(r,r.config.apiHost,t,f),_)})}async function lv(r,e,t){r._canInitEmulator=!1;const i={...x1,...e};try{const o=new C1(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw Yu(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const f=l.ok?h.errorMessage:h.error.message,[g,_]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw Yu(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw Yu(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw Yu(r,"user-disabled",h);const w=i[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw Mf(r,w,_);Cn(r,w)}}catch(o){if(o instanceof Qr)throw o;Cn(r,"network-request-failed",{message:String(o)})}}async function Il(r,e,t,i,o={}){const l=await Jr(r,e,t,i,o);return"mfaPendingCredential"in l&&Cn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function uv(r,e,t,i){const o=`${e}${t}?${i}`,l=r,h=l.config.emulator?Ff(r.config,o):`${r.config.apiScheme}://${o}`;return S1.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function k1(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class C1{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(Un(this.auth,"network-request-failed")),A1.get())})}}function Yu(r,e,t){const i={appName:r.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const o=Un(r,e,i);return o.customData._tokenResponse=t,o}function dy(r){return r!==void 0&&r.enterprise!==void 0}class R1{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return k1(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function P1(r,e){return Jr(r,"GET","/v2/recaptchaConfig",Ks(r,e))}/**
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
 */async function N1(r,e){return Jr(r,"POST","/v1/accounts:delete",e)}async function Tc(r,e){return Jr(r,"POST","/v1/accounts:lookup",e)}/**
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
 */function Za(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function b1(r,e=!1){const t=gt(r),i=await t.getIdToken(e),o=Uf(i);Se(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:i,authTime:Za(Qd(o.auth_time)),issuedAtTime:Za(Qd(o.iat)),expirationTime:Za(Qd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function Qd(r){return Number(r)*1e3}function Uf(r){const[e,t,i]=r.split(".");if(e===void 0||t===void 0||i===void 0)return ac("JWT malformed, contained fewer than 3 sections"),null;try{const o=G_(t);return o?JSON.parse(o):(ac("Failed to decode base64 JWT payload"),null)}catch(o){return ac("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function fy(r){const e=Uf(r);return Se(e,"internal-error"),Se(typeof e.exp<"u","internal-error"),Se(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Lo(r,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof Qr&&D1(i)&&r.auth.currentUser===r&&await r.auth.signOut(),i}}function D1({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
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
 */class V1{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const i=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class df{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Za(this.lastLoginAt),this.creationTime=Za(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ic(r){var I;const e=r.auth,t=await r.getIdToken(),i=await Lo(r,Tc(e,{idToken:t}));Se(i==null?void 0:i.users.length,e,"internal-error");const o=i.users[0];r._notifyReloadListener(o);const l=(I=o.providerUserInfo)!=null&&I.length?cv(o.providerUserInfo):[],h=L1(r.providerData,l),f=r.isAnonymous,g=!(r.email&&o.passwordHash)&&!(h!=null&&h.length),_=f?g:!1,w={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new df(o.createdAt,o.lastLoginAt),isAnonymous:_};Object.assign(r,w)}async function O1(r){const e=gt(r);await Ic(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function L1(r,e){return[...r.filter(i=>!e.some(o=>o.providerId===i.providerId)),...e]}function cv(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function M1(r,e){const t=await lv(r,{},async()=>{const i=wl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await uv(r,o,"/v1/token",`key=${l}`),f=await r._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:i};return r.emulatorConfig&&El(r.emulatorConfig.host)&&(g.credentials="include"),av.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function j1(r,e){return Jr(r,"POST","/v2/accounts:revokeToken",Ks(r,e))}/**
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
 */class Po{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Se(e.idToken,"internal-error"),Se(typeof e.idToken<"u","internal-error"),Se(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):fy(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Se(e.length!==0,"internal-error");const t=fy(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Se(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:o,expiresIn:l}=await M1(e,t);this.updateTokensAndExpiration(i,o,Number(l))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:o,expirationTime:l}=t,h=new Po;return i&&(Se(typeof i=="string","internal-error",{appName:e}),h.refreshToken=i),o&&(Se(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(Se(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Po,this.toJSON())}_performRefresh(){return Fr("not implemented")}}/**
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
 */function Cs(r,e){Se(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Fn{constructor({uid:e,auth:t,stsTokenManager:i,...o}){this.providerId="firebase",this.proactiveRefresh=new V1(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new df(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Lo(this,this.stsTokenManager.getToken(this.auth,e));return Se(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return b1(this,e)}reload(){return O1(this)}_assign(e){this!==e&&(Se(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Fn({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){Se(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await Ic(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(mn(this.auth.app))return Promise.reject(Br(this.auth));const e=await this.getIdToken();return await Lo(this,N1(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const i=t.displayName??void 0,o=t.email??void 0,l=t.phoneNumber??void 0,h=t.photoURL??void 0,f=t.tenantId??void 0,g=t._redirectEventId??void 0,_=t.createdAt??void 0,w=t.lastLoginAt??void 0,{uid:I,emailVerified:A,isAnonymous:j,providerData:W,stsTokenManager:K}=t;Se(I&&K,e,"internal-error");const $=Po.fromJSON(this.name,K);Se(typeof I=="string",e,"internal-error"),Cs(i,e.name),Cs(o,e.name),Se(typeof A=="boolean",e,"internal-error"),Se(typeof j=="boolean",e,"internal-error"),Cs(l,e.name),Cs(h,e.name),Cs(f,e.name),Cs(g,e.name),Cs(_,e.name),Cs(w,e.name);const me=new Fn({uid:I,auth:e,email:o,emailVerified:A,displayName:i,isAnonymous:j,photoURL:h,phoneNumber:l,tenantId:f,stsTokenManager:$,createdAt:_,lastLoginAt:w});return W&&Array.isArray(W)&&(me.providerData=W.map(ae=>({...ae}))),g&&(me._redirectEventId=g),me}static async _fromIdTokenResponse(e,t,i=!1){const o=new Po;o.updateFromServerResponse(t);const l=new Fn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:i});return await Ic(l),l}static async _fromGetAccountInfoResponse(e,t,i){const o=t.users[0];Se(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?cv(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),f=new Po;f.updateFromIdToken(i);const g=new Fn({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new df(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
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
 */const py=new Map;function Ur(r){Wr(r instanceof Function,"Expected a class definition");let e=py.get(r);return e?(Wr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,py.set(r,e),e)}/**
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
 */class hv{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}hv.type="NONE";const my=hv;/**
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
 */function lc(r,e,t){return`firebase:${r}:${e}:${t}`}class No{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:o,name:l}=this.auth;this.fullUserKey=lc(this.userKey,o.apiKey,l),this.fullPersistenceKey=lc("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Tc(this.auth,{idToken:e}).catch(()=>{});return t?Fn._fromGetAccountInfoResponse(this.auth,t,e):null}return Fn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new No(Ur(my),e,i);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Ur(my);const h=lc(i,e.config.apiKey,e.name);let f=null;for(const _ of t)try{const w=await _._get(h);if(w){let I;if(typeof w=="string"){const A=await Tc(e,{idToken:w}).catch(()=>{});if(!A)break;I=await Fn._fromGetAccountInfoResponse(e,A,w)}else I=Fn._fromJSON(e,w);_!==l&&(f=I),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new No(l,e,i):(l=g[0],f&&await l._set(h,f.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new No(l,e,i))}}/**
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
 */function gy(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(mv(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(dv(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(yv(e))return"Blackberry";if(_v(e))return"Webos";if(fv(e))return"Safari";if((e.includes("chrome/")||pv(e))&&!e.includes("edge/"))return"Chrome";if(gv(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=r.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function dv(r=Gt()){return/firefox\//i.test(r)}function fv(r=Gt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function pv(r=Gt()){return/crios\//i.test(r)}function mv(r=Gt()){return/iemobile/i.test(r)}function gv(r=Gt()){return/android/i.test(r)}function yv(r=Gt()){return/blackberry/i.test(r)}function _v(r=Gt()){return/webos/i.test(r)}function zf(r=Gt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function F1(r=Gt()){var e;return zf(r)&&!!((e=window.navigator)!=null&&e.standalone)}function U1(){return ZT()&&document.documentMode===10}function vv(r=Gt()){return zf(r)||gv(r)||_v(r)||yv(r)||/windows phone/i.test(r)||mv(r)}/**
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
 */function wv(r,e=[]){let t;switch(r){case"Browser":t=gy(Gt());break;case"Worker":t=`${gy(Gt())}-${r}`;break;default:t=r}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Bo}/${i}`}/**
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
 */class z1{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=l=>new Promise((h,f)=>{try{const g=e(l);h(g)}catch(g){f(g)}});i.onAbort=t,this.queue.push(i);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function B1(r,e={}){return Jr(r,"GET","/v2/passwordPolicy",Ks(r,e))}/**
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
 */const $1=6;class H1{constructor(e){var i;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??$1,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let o=0;o<e.length;o++)i=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
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
 */class q1{constructor(e,t,i,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new yy(this),this.idTokenSubscription=new yy(this),this.beforeStateQueue=new z1(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ov,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ur(t)),this._initializationPromise=this.queue(async()=>{var i,o,l;if(!this._deleted&&(this.persistenceManager=await No.create(this,e),(i=this._resolvePersistenceManagerAvailable)==null||i.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)==null?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Tc(this,{idToken:e}),i=await Fn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var l;if(mn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let i=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(l=this.redirectUser)==null?void 0:l._redirectEventId,f=i==null?void 0:i._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===f)&&(g!=null&&g.user)&&(i=g.user,o=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(i)}catch(h){i=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return Se(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ic(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=I1()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(mn(this.app))return Promise.reject(Br(this));const t=e?gt(e):null;return t&&Se(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Se(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return mn(this.app)?Promise.reject(Br(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return mn(this.app)?Promise.reject(Br(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ur(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await B1(this),t=new H1(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new vl("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await j1(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ur(e)||this._popupRedirectResolver;Se(t,this,"argument-error"),this.redirectPersistenceManager=await No.create(this,[Ur(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)==null?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(Se(f,this,"internal-error"),f.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,i,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Se(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=wv(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){var t;if(mn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&v1(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Gs(r){return gt(r)}class yy{constructor(e){this.auth=e,this.observer=null,this.addObserver=aI(t=>this.observer=t)}get next(){return Se(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Gc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function W1(r){Gc=r}function Ev(r){return Gc.loadJS(r)}function K1(){return Gc.recaptchaEnterpriseScript}function G1(){return Gc.gapiScript}function Q1(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class J1{constructor(){this.enterprise=new Y1}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Y1{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const X1="recaptcha-enterprise",Tv="NO_RECAPTCHA";class Z1{constructor(e){this.type=X1,this.auth=Gs(e)}async verify(e="verify",t=!1){async function i(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,f)=>{P1(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const _=new R1(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{f(g)})})}function o(l,h,f){const g=window.grecaptcha;dy(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(Tv)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new J1().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{i(this.auth).then(f=>{if(!t&&dy(window.grecaptcha))o(f,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=K1();g.length!==0&&(g+=f),Ev(g).then(()=>{o(f,l,h)}).catch(_=>{h(_)})}}).catch(f=>{h(f)})})}}async function _y(r,e,t,i=!1,o=!1){const l=new Z1(r);let h;if(o)h=Tv;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const f={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const g=f.phoneEnrollmentInfo.phoneNumber,_=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const g=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return i?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function ff(r,e,t,i,o){var l;if((l=r._getRecaptchaConfig())!=null&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await _y(r,e,t,t==="getOobCode");return i(r,h)}else return i(r,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await _y(r,e,t,t==="getOobCode");return i(r,f)}else return Promise.reject(h)})}/**
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
 */function ex(r,e){const t=Lf(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(Ri(l,e??{}))return o;Cn(o,"already-initialized")}return t.initialize({options:e})}function tx(r,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(Ur);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function nx(r,e,t){const i=Gs(r);Se(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const o=!1,l=Iv(e),{host:h,port:f}=rx(e),g=f===null?"":`:${f}`,_={url:`${l}//${h}${g}/`},w=Object.freeze({host:h,port:f,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!i._canInitEmulator){Se(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),Se(Ri(_,i.config.emulator)&&Ri(w,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=_,i.emulatorConfig=w,i.settings.appVerificationDisabledForTesting=!0,El(h)?X_(`${l}//${h}${g}`):sx()}function Iv(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function rx(r){const e=Iv(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(i);if(o){const l=o[1];return{host:l,port:vy(i.substr(l.length+1))}}else{const[l,h]=i.split(":");return{host:l,port:vy(h)}}}function vy(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function sx(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
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
 */class Bf{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Fr("not implemented")}_getIdTokenResponse(e){return Fr("not implemented")}_linkToIdToken(e,t){return Fr("not implemented")}_getReauthenticationResolver(e){return Fr("not implemented")}}async function ix(r,e){return Jr(r,"POST","/v1/accounts:signUp",e)}/**
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
 */async function ox(r,e){return Il(r,"POST","/v1/accounts:signInWithPassword",Ks(r,e))}/**
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
 */async function ax(r,e){return Il(r,"POST","/v1/accounts:signInWithEmailLink",Ks(r,e))}async function lx(r,e){return Il(r,"POST","/v1/accounts:signInWithEmailLink",Ks(r,e))}/**
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
 */class il extends Bf{constructor(e,t,i,o=null){super("password",i),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new il(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new il(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ff(e,t,"signInWithPassword",ox);case"emailLink":return ax(e,{email:this._email,oobCode:this._password});default:Cn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ff(e,i,"signUpPassword",ix);case"emailLink":return lx(e,{idToken:t,email:this._email,oobCode:this._password});default:Cn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function bo(r,e){return Il(r,"POST","/v1/accounts:signInWithIdp",Ks(r,e))}/**
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
 */const ux="http://localhost";class Ni extends Bf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ni(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Cn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:o,...l}=t;if(!i||!o)return null;const h=new Ni(i,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return bo(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,bo(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,bo(e,t)}buildRequest(){const e={requestUri:ux,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=wl(t)}return e}}/**
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
 */function cx(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function hx(r){const e=Wa(Ka(r)).link,t=e?Wa(Ka(e)).deep_link_id:null,i=Wa(Ka(r)).deep_link_id;return(i?Wa(Ka(i)).link:null)||i||t||e||r}class $f{constructor(e){const t=Wa(Ka(e)),i=t.apiKey??null,o=t.oobCode??null,l=cx(t.mode??null);Se(i&&o&&l,"argument-error"),this.apiKey=i,this.operation=l,this.code=o,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=hx(e);try{return new $f(t)}catch{return null}}}/**
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
 */class $o{constructor(){this.providerId=$o.PROVIDER_ID}static credential(e,t){return il._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=$f.parseLink(t);return Se(i,"argument-error"),il._fromEmailAndCode(e,i.code,i.tenantId)}}$o.PROVIDER_ID="password";$o.EMAIL_PASSWORD_SIGN_IN_METHOD="password";$o.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Hf{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class xl extends Hf{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Ps extends xl{constructor(){super("facebook.com")}static credential(e){return Ni._fromParams({providerId:Ps.PROVIDER_ID,signInMethod:Ps.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ps.credentialFromTaggedObject(e)}static credentialFromError(e){return Ps.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ps.credential(e.oauthAccessToken)}catch{return null}}}Ps.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ps.PROVIDER_ID="facebook.com";/**
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
 */class Mr extends xl{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ni._fromParams({providerId:Mr.PROVIDER_ID,signInMethod:Mr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Mr.credentialFromTaggedObject(e)}static credentialFromError(e){return Mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return Mr.credential(t,i)}catch{return null}}}Mr.GOOGLE_SIGN_IN_METHOD="google.com";Mr.PROVIDER_ID="google.com";/**
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
 */class Ns extends xl{constructor(){super("github.com")}static credential(e){return Ni._fromParams({providerId:Ns.PROVIDER_ID,signInMethod:Ns.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ns.credentialFromTaggedObject(e)}static credentialFromError(e){return Ns.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ns.credential(e.oauthAccessToken)}catch{return null}}}Ns.GITHUB_SIGN_IN_METHOD="github.com";Ns.PROVIDER_ID="github.com";/**
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
 */class bs extends xl{constructor(){super("twitter.com")}static credential(e,t){return Ni._fromParams({providerId:bs.PROVIDER_ID,signInMethod:bs.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return bs.credentialFromTaggedObject(e)}static credentialFromError(e){return bs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return bs.credential(t,i)}catch{return null}}}bs.TWITTER_SIGN_IN_METHOD="twitter.com";bs.PROVIDER_ID="twitter.com";/**
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
 */async function dx(r,e){return Il(r,"POST","/v1/accounts:signUp",Ks(r,e))}/**
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
 */class bi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,o=!1){const l=await Fn._fromIdTokenResponse(e,i,o),h=wy(i);return new bi({user:l,providerId:h,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const o=wy(i);return new bi({user:e,providerId:o,_tokenResponse:i,operationType:t})}}function wy(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
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
 */class xc extends Qr{constructor(e,t,i,o){super(t.code,t.message),this.operationType=i,this.user=o,Object.setPrototypeOf(this,xc.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,o){return new xc(e,t,i,o)}}function xv(r,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?xc._fromErrorAndOperation(r,l,e,i):l})}async function fx(r,e,t=!1){const i=await Lo(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return bi._forOperation(r,"link",i)}/**
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
 */async function px(r,e,t=!1){const{auth:i}=r;if(mn(i.app))return Promise.reject(Br(i));const o="reauthenticate";try{const l=await Lo(r,xv(i,o,e,r),t);Se(l.idToken,i,"internal-error");const h=Uf(l.idToken);Se(h,i,"internal-error");const{sub:f}=h;return Se(r.uid===f,i,"user-mismatch"),bi._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Cn(i,"user-mismatch"),l}}/**
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
 */async function Sv(r,e,t=!1){if(mn(r.app))return Promise.reject(Br(r));const i="signIn",o=await xv(r,i,e),l=await bi._fromIdTokenResponse(r,i,o);return t||await r._updateCurrentUser(l.user),l}async function mx(r,e){return Sv(Gs(r),e)}/**
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
 */async function Av(r){const e=Gs(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function gx(r,e,t){if(mn(r.app))return Promise.reject(Br(r));const i=Gs(r),h=await ff(i,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",dx).catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&Av(r),g}),f=await bi._fromIdTokenResponse(i,"signIn",h);return await i._updateCurrentUser(f.user),f}function yx(r,e,t){return mn(r.app)?Promise.reject(Br(r)):mx(gt(r),$o.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&Av(r),i})}/**
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
 */async function _x(r,e){return Jr(r,"POST","/v1/accounts:update",e)}/**
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
 */async function kv(r,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const i=gt(r),l={idToken:await i.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},h=await Lo(i,_x(i.auth,l));i.displayName=h.displayName||null,i.photoURL=h.photoUrl||null;const f=i.providerData.find(({providerId:g})=>g==="password");f&&(f.displayName=i.displayName,f.photoURL=i.photoURL),await i._updateTokensIfNecessary(h)}function vx(r,e,t,i){return gt(r).onIdTokenChanged(e,t,i)}function wx(r,e,t){return gt(r).beforeAuthStateChanged(e,t)}function Ex(r,e,t,i){return gt(r).onAuthStateChanged(e,t,i)}function Tx(r){return gt(r).signOut()}async function Ix(r){return gt(r).delete()}const Sc="__sak";/**
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
 */class Cv{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Sc,"1"),this.storage.removeItem(Sc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const xx=1e3,Sx=10;class Rv extends Cv{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=vv(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),o=this.localCache[t];i!==o&&e(t,o,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,g)=>{this.notifyListeners(h,g)});return}const i=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(i);!t&&this.localCache[i]===h||this.notifyListeners(i,h)},l=this.storage.getItem(i);U1()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,Sx):o()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},xx)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Rv.type="LOCAL";const Ax=Rv;/**
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
 */class Pv extends Cv{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Pv.type="SESSION";const Nv=Pv;/**
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
 */function kx(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Qc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const i=new Qc(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:o});const f=Array.from(h).map(async _=>_(t.origin,l)),g=await kx(f);t.ports[0].postMessage({status:"done",eventId:i,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Qc.receivers=[];/**
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
 */function qf(r="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return r+t}/**
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
 */class Cx{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((f,g)=>{const _=qf("",20);o.port1.start();const w=setTimeout(()=>{g(new Error("unsupported_event"))},i);h={messageChannel:o,onMessage(I){const A=I;if(A.data.eventId===_)switch(A.data.status){case"ack":clearTimeout(w),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),f(A.data.response);break;default:clearTimeout(w),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
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
 */function hr(){return window}function Rx(r){hr().location.href=r}/**
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
 */function bv(){return typeof hr().WorkerGlobalScope<"u"&&typeof hr().importScripts=="function"}async function Px(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Nx(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function bx(){return bv()?self:null}/**
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
 */const Dv="firebaseLocalStorageDb",Dx=1,Ac="firebaseLocalStorage",Vv="fbase_key";class Sl{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Jc(r,e){return r.transaction([Ac],e?"readwrite":"readonly").objectStore(Ac)}function Vx(){const r=indexedDB.deleteDatabase(Dv);return new Sl(r).toPromise()}function Ov(){const r=indexedDB.open(Dv,Dx);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const i=r.result;try{i.createObjectStore(Ac,{keyPath:Vv})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const i=r.result;i.objectStoreNames.contains(Ac)?e(i):(i.close(),await Vx(),e(await Ov()))})})}async function Ey(r,e,t){const i=Jc(r,!0).put({[Vv]:e,value:t});return new Sl(i).toPromise()}async function Ox(r,e){const t=Jc(r,!1).get(e),i=await new Sl(t).toPromise();return i===void 0?null:i.value}function Ty(r,e){const t=Jc(r,!0).delete(e);return new Sl(t).toPromise()}const Lx=800,Mx=3;class Lv{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Ov(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>Mx)throw i;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return bv()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Qc._getInstance(bx()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,i;if(this.activeServiceWorker=await Px(),!this.activeServiceWorker)return;this.sender=new Cx(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(i=e[0])!=null&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Nx()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Ey(e,Sc,"1"),await Ty(e,Sc)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>Ey(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>Ox(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ty(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=Jc(o,!1).getAll();return new Sl(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)i.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!i.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Lx)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Lv.type="LOCAL";const jx=Lv;new Tl(3e4,6e4);/**
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
 */function Mv(r,e){return e?Ur(e):(Se(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
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
 */class Wf extends Bf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bo(e,this._buildIdpRequest())}_linkToIdToken(e,t){return bo(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return bo(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Fx(r){return Sv(r.auth,new Wf(r),r.bypassAuthState)}function Ux(r){const{auth:e,user:t}=r;return Se(t,e,"internal-error"),px(t,new Wf(r),r.bypassAuthState)}async function zx(r){const{auth:e,user:t}=r;return Se(t,e,"internal-error"),fx(t,new Wf(r),r.bypassAuthState)}/**
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
 */class jv{constructor(e,t,i,o,l=!1){this.auth=e,this.resolver=i,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:o,tenantId:l,error:h,type:f}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:i,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Fx;case"linkViaPopup":case"linkViaRedirect":return zx;case"reauthViaPopup":case"reauthViaRedirect":return Ux;default:Cn(this.auth,"internal-error")}}resolve(e){Wr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Wr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Bx=new Tl(2e3,1e4);async function $x(r,e,t){if(mn(r.app))return Promise.reject(Un(r,"operation-not-supported-in-this-environment"));const i=Gs(r);w1(r,e,Hf);const o=Mv(i,t);return new Si(i,"signInViaPopup",e,o).executeNotNull()}class Si extends jv{constructor(e,t,i,o,l){super(e,t,o,l),this.provider=i,this.authWindow=null,this.pollId=null,Si.currentPopupAction&&Si.currentPopupAction.cancel(),Si.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Se(e,this.auth,"internal-error"),e}async onExecution(){Wr(this.filter.length===1,"Popup operations only handle one event");const e=qf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Un(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Un(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Si.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if((i=(t=this.authWindow)==null?void 0:t.window)!=null&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Un(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Bx.get())};e()}}Si.currentPopupAction=null;/**
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
 */const Hx="pendingRedirect",uc=new Map;class qx extends jv{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=uc.get(this.auth._key());if(!e){try{const i=await Wx(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}uc.set(this.auth._key(),e)}return this.bypassAuthState||uc.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Wx(r,e){const t=Qx(e),i=Gx(r);if(!await i._isAvailable())return!1;const o=await i._get(t)==="true";return await i._remove(t),o}function Kx(r,e){uc.set(r._key(),e)}function Gx(r){return Ur(r._redirectPersistence)}function Qx(r){return lc(Hx,r.config.apiKey,r.name)}async function Jx(r,e,t=!1){if(mn(r.app))return Promise.reject(Br(r));const i=Gs(r),o=Mv(i,e),h=await new qx(i,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await i._persistUserIfCurrent(h.user),await i._setRedirectUser(null,e)),h}/**
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
 */const Yx=600*1e3;class Xx{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zx(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!Fv(e)){const o=((i=e.error.code)==null?void 0:i.split("auth/")[1])||"internal-error";t.onError(Un(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Yx&&this.cachedEventUids.clear(),this.cachedEventUids.has(Iy(e))}saveEventToCache(e){this.cachedEventUids.add(Iy(e)),this.lastProcessedEventTime=Date.now()}}function Iy(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Fv({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Zx(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Fv(r);default:return!1}}/**
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
 */async function eS(r,e={}){return Jr(r,"GET","/v1/projects",e)}/**
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
 */const tS=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nS=/^https?/;async function rS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await eS(r);for(const t of e)try{if(sS(t))return}catch{}Cn(r,"unauthorized-domain")}function sS(r){const e=hf(),{protocol:t,hostname:i}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&i===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===i}if(!nS.test(t))return!1;if(tS.test(r))return i===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(i)}/**
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
 */const iS=new Tl(3e4,6e4);function xy(){const r=hr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function oS(r){return new Promise((e,t)=>{var o,l,h;function i(){xy(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{xy(),t(Un(r,"network-request-failed"))},timeout:iS.get()})}if((l=(o=hr().gapi)==null?void 0:o.iframes)!=null&&l.Iframe)e(gapi.iframes.getContext());else if((h=hr().gapi)!=null&&h.load)i();else{const f=Q1("iframefcb");return hr()[f]=()=>{gapi.load?i():t(Un(r,"network-request-failed"))},Ev(`${G1()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw cc=null,e})}let cc=null;function aS(r){return cc=cc||oS(r),cc}/**
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
 */const lS=new Tl(5e3,15e3),uS="__/auth/iframe",cS="emulator/auth/iframe",hS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fS(r){const e=r.config;Se(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Ff(e,cS):`https://${r.config.authDomain}/${uS}`,i={apiKey:e.apiKey,appName:r.name,v:Bo},o=dS.get(r.config.apiHost);o&&(i.eid=o);const l=r._getFrameworks();return l.length&&(i.fw=l.join(",")),`${t}?${wl(i).slice(1)}`}async function pS(r){const e=await aS(r),t=hr().gapi;return Se(t,r,"internal-error"),e.open({where:document.body,url:fS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hS,dontclear:!0},i=>new Promise(async(o,l)=>{await i.restyle({setHideOnLeave:!1});const h=Un(r,"network-request-failed"),f=hr().setTimeout(()=>{l(h)},lS.get());function g(){hr().clearTimeout(f),o(i)}i.ping(g).then(g,()=>{l(h)})}))}/**
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
 */const mS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gS=500,yS=600,_S="_blank",vS="http://localhost";class Sy{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wS(r,e,t,i=gS,o=yS){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-i)/2,0).toString();let f="";const g={...mS,width:i.toString(),height:o.toString(),top:l,left:h},_=Gt().toLowerCase();t&&(f=pv(_)?_S:t),dv(_)&&(e=e||vS,g.scrollbars="yes");const w=Object.entries(g).reduce((A,[j,W])=>`${A}${j}=${W},`,"");if(F1(_)&&f!=="_self")return ES(e||"",f),new Sy(null);const I=window.open(e||"",f,w);Se(I,r,"popup-blocked");try{I.focus()}catch{}return new Sy(I)}function ES(r,e){const t=document.createElement("a");t.href=r,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
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
 */const TS="__/auth/handler",IS="emulator/auth/handler",xS=encodeURIComponent("fac");async function Ay(r,e,t,i,o,l){Se(r.config.authDomain,r,"auth-domain-config-required"),Se(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:i,v:Bo,eventId:o};if(e instanceof Hf){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",oI(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[w,I]of Object.entries({}))h[w]=I}if(e instanceof xl){const w=e.getScopes().filter(I=>I!=="");w.length>0&&(h.scopes=w.join(","))}r.tenantId&&(h.tid=r.tenantId);const f=h;for(const w of Object.keys(f))f[w]===void 0&&delete f[w];const g=await r._getAppCheckToken(),_=g?`#${xS}=${encodeURIComponent(g)}`:"";return`${SS(r)}?${wl(f).slice(1)}${_}`}function SS({config:r}){return r.emulator?Ff(r,IS):`https://${r.authDomain}/${TS}`}/**
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
 */const Jd="webStorageSupport";class AS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Nv,this._completeRedirectFn=Jx,this._overrideRedirectResult=Kx}async _openPopup(e,t,i,o){var h;Wr((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const l=await Ay(e,t,i,hf(),o);return wS(e,l,qf())}async _openRedirect(e,t,i,o){await this._originValidation(e);const l=await Ay(e,t,i,hf(),o);return Rx(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Wr(l,"If manager is not set, promise should be"),l)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await pS(e),i=new Xx(e);return t.register("authEvent",o=>(Se(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:i.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Jd,{type:Jd},o=>{var h;const l=(h=o==null?void 0:o[0])==null?void 0:h[Jd];l!==void 0&&t(!!l),Cn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=rS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return vv()||fv()||zf()}}const kS=AS;var ky="@firebase/auth",Cy="1.13.2";/**
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
 */class CS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Se(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function RS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function PS(r){Oo(new Pi("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=i.options;Se(h&&!h.includes(":"),"invalid-api-key",{appName:i.name});const g={apiKey:h,authDomain:f,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:wv(r)},_=new q1(i,o,l,g);return tx(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Oo(new Pi("auth-internal",e=>{const t=Gs(e.getProvider("auth").getImmediate());return(i=>new CS(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Os(ky,Cy,RS(r)),Os(ky,Cy,"esm2020")}/**
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
 */const NS=300,bS=Y_("authIdTokenMaxAge")||NS;let Ry=null;const DS=r=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>bS)return;const o=t==null?void 0:t.token;Ry!==o&&(Ry=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function VS(r=nv()){const e=Lf(r,"auth");if(e.isInitialized())return e.getImmediate();const t=ex(r,{popupRedirectResolver:kS,persistence:[jx,Ax,Nv]}),i=Y_("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(i,location.origin);if(location.origin===l.origin){const h=DS(l.toString());wx(t,h,()=>h(t.currentUser)),vx(t,f=>h(f))}}const o=Q_("auth");return o&&nx(t,`http://${o}`),t}function OS(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}W1({loadJS(r){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",r),i.onload=e,i.onerror=o=>{const l=Un("internal-error");l.customData=o,t(l)},i.type="text/javascript",i.charset="UTF-8",OS().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});PS("Browser");var LS="firebase",MS="12.14.0";/**
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
 */Os(LS,MS,"app");var Py=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ls,Uv;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(k,x){function R(){}R.prototype=x.prototype,k.F=x.prototype,k.prototype=new R,k.prototype.constructor=k,k.D=function(b,P,O){for(var C=Array(arguments.length-2),qe=2;qe<arguments.length;qe++)C[qe-2]=arguments[qe];return x.prototype[P].apply(b,C)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(i,t),i.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(k,x,R){R||(R=0);const b=Array(16);if(typeof x=="string")for(var P=0;P<16;++P)b[P]=x.charCodeAt(R++)|x.charCodeAt(R++)<<8|x.charCodeAt(R++)<<16|x.charCodeAt(R++)<<24;else for(P=0;P<16;++P)b[P]=x[R++]|x[R++]<<8|x[R++]<<16|x[R++]<<24;x=k.g[0],R=k.g[1],P=k.g[2];let O=k.g[3],C;C=x+(O^R&(P^O))+b[0]+3614090360&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[1]+3905402710&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[2]+606105819&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[3]+3250441966&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[4]+4118548399&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[5]+1200080426&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[6]+2821735955&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[7]+4249261313&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[8]+1770035416&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[9]+2336552879&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[10]+4294925233&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[11]+2304563134&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(O^R&(P^O))+b[12]+1804603682&4294967295,x=R+(C<<7&4294967295|C>>>25),C=O+(P^x&(R^P))+b[13]+4254626195&4294967295,O=x+(C<<12&4294967295|C>>>20),C=P+(R^O&(x^R))+b[14]+2792965006&4294967295,P=O+(C<<17&4294967295|C>>>15),C=R+(x^P&(O^x))+b[15]+1236535329&4294967295,R=P+(C<<22&4294967295|C>>>10),C=x+(P^O&(R^P))+b[1]+4129170786&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[6]+3225465664&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[11]+643717713&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[0]+3921069994&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[5]+3593408605&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[10]+38016083&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[15]+3634488961&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[4]+3889429448&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[9]+568446438&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[14]+3275163606&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[3]+4107603335&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[8]+1163531501&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(P^O&(R^P))+b[13]+2850285829&4294967295,x=R+(C<<5&4294967295|C>>>27),C=O+(R^P&(x^R))+b[2]+4243563512&4294967295,O=x+(C<<9&4294967295|C>>>23),C=P+(x^R&(O^x))+b[7]+1735328473&4294967295,P=O+(C<<14&4294967295|C>>>18),C=R+(O^x&(P^O))+b[12]+2368359562&4294967295,R=P+(C<<20&4294967295|C>>>12),C=x+(R^P^O)+b[5]+4294588738&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[8]+2272392833&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[11]+1839030562&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[14]+4259657740&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[1]+2763975236&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[4]+1272893353&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[7]+4139469664&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[10]+3200236656&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[13]+681279174&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[0]+3936430074&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[3]+3572445317&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[6]+76029189&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(R^P^O)+b[9]+3654602809&4294967295,x=R+(C<<4&4294967295|C>>>28),C=O+(x^R^P)+b[12]+3873151461&4294967295,O=x+(C<<11&4294967295|C>>>21),C=P+(O^x^R)+b[15]+530742520&4294967295,P=O+(C<<16&4294967295|C>>>16),C=R+(P^O^x)+b[2]+3299628645&4294967295,R=P+(C<<23&4294967295|C>>>9),C=x+(P^(R|~O))+b[0]+4096336452&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[7]+1126891415&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[14]+2878612391&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[5]+4237533241&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[12]+1700485571&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[3]+2399980690&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[10]+4293915773&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[1]+2240044497&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[8]+1873313359&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[15]+4264355552&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[6]+2734768916&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[13]+1309151649&4294967295,R=P+(C<<21&4294967295|C>>>11),C=x+(P^(R|~O))+b[4]+4149444226&4294967295,x=R+(C<<6&4294967295|C>>>26),C=O+(R^(x|~P))+b[11]+3174756917&4294967295,O=x+(C<<10&4294967295|C>>>22),C=P+(x^(O|~R))+b[2]+718787259&4294967295,P=O+(C<<15&4294967295|C>>>17),C=R+(O^(P|~x))+b[9]+3951481745&4294967295,k.g[0]=k.g[0]+x&4294967295,k.g[1]=k.g[1]+(P+(C<<21&4294967295|C>>>11))&4294967295,k.g[2]=k.g[2]+P&4294967295,k.g[3]=k.g[3]+O&4294967295}i.prototype.v=function(k,x){x===void 0&&(x=k.length);const R=x-this.blockSize,b=this.C;let P=this.h,O=0;for(;O<x;){if(P==0)for(;O<=R;)o(this,k,O),O+=this.blockSize;if(typeof k=="string"){for(;O<x;)if(b[P++]=k.charCodeAt(O++),P==this.blockSize){o(this,b),P=0;break}}else for(;O<x;)if(b[P++]=k[O++],P==this.blockSize){o(this,b),P=0;break}}this.h=P,this.o+=x},i.prototype.A=function(){var k=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);k[0]=128;for(var x=1;x<k.length-8;++x)k[x]=0;x=this.o*8;for(var R=k.length-8;R<k.length;++R)k[R]=x&255,x/=256;for(this.v(k),k=Array(16),x=0,R=0;R<4;++R)for(let b=0;b<32;b+=8)k[x++]=this.g[R]>>>b&255;return k};function l(k,x){var R=f;return Object.prototype.hasOwnProperty.call(R,k)?R[k]:R[k]=x(k)}function h(k,x){this.h=x;const R=[];let b=!0;for(let P=k.length-1;P>=0;P--){const O=k[P]|0;b&&O==x||(R[P]=O,b=!1)}this.g=R}var f={};function g(k){return-128<=k&&k<128?l(k,function(x){return new h([x|0],x<0?-1:0)}):new h([k|0],k<0?-1:0)}function _(k){if(isNaN(k)||!isFinite(k))return I;if(k<0)return $(_(-k));const x=[];let R=1;for(let b=0;k>=R;b++)x[b]=k/R|0,R*=4294967296;return new h(x,0)}function w(k,x){if(k.length==0)throw Error("number format error: empty string");if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(k.charAt(0)=="-")return $(w(k.substring(1),x));if(k.indexOf("-")>=0)throw Error('number format error: interior "-" character');const R=_(Math.pow(x,8));let b=I;for(let O=0;O<k.length;O+=8){var P=Math.min(8,k.length-O);const C=parseInt(k.substring(O,O+P),x);P<8?(P=_(Math.pow(x,P)),b=b.j(P).add(_(C))):(b=b.j(R),b=b.add(_(C)))}return b}var I=g(0),A=g(1),j=g(16777216);r=h.prototype,r.m=function(){if(K(this))return-$(this).m();let k=0,x=1;for(let R=0;R<this.g.length;R++){const b=this.i(R);k+=(b>=0?b:4294967296+b)*x,x*=4294967296}return k},r.toString=function(k){if(k=k||10,k<2||36<k)throw Error("radix out of range: "+k);if(W(this))return"0";if(K(this))return"-"+$(this).toString(k);const x=_(Math.pow(k,6));var R=this;let b="";for(;;){const P=xe(R,x).g;R=me(R,P.j(x));let O=((R.g.length>0?R.g[0]:R.h)>>>0).toString(k);if(R=P,W(R))return O+b;for(;O.length<6;)O="0"+O;b=O+b}},r.i=function(k){return k<0?0:k<this.g.length?this.g[k]:this.h};function W(k){if(k.h!=0)return!1;for(let x=0;x<k.g.length;x++)if(k.g[x]!=0)return!1;return!0}function K(k){return k.h==-1}r.l=function(k){return k=me(this,k),K(k)?-1:W(k)?0:1};function $(k){const x=k.g.length,R=[];for(let b=0;b<x;b++)R[b]=~k.g[b];return new h(R,~k.h).add(A)}r.abs=function(){return K(this)?$(this):this},r.add=function(k){const x=Math.max(this.g.length,k.g.length),R=[];let b=0;for(let P=0;P<=x;P++){let O=b+(this.i(P)&65535)+(k.i(P)&65535),C=(O>>>16)+(this.i(P)>>>16)+(k.i(P)>>>16);b=C>>>16,O&=65535,C&=65535,R[P]=C<<16|O}return new h(R,R[R.length-1]&-2147483648?-1:0)};function me(k,x){return k.add($(x))}r.j=function(k){if(W(this)||W(k))return I;if(K(this))return K(k)?$(this).j($(k)):$($(this).j(k));if(K(k))return $(this.j($(k)));if(this.l(j)<0&&k.l(j)<0)return _(this.m()*k.m());const x=this.g.length+k.g.length,R=[];for(var b=0;b<2*x;b++)R[b]=0;for(b=0;b<this.g.length;b++)for(let P=0;P<k.g.length;P++){const O=this.i(b)>>>16,C=this.i(b)&65535,qe=k.i(P)>>>16,yt=k.i(P)&65535;R[2*b+2*P]+=C*yt,ae(R,2*b+2*P),R[2*b+2*P+1]+=O*yt,ae(R,2*b+2*P+1),R[2*b+2*P+1]+=C*qe,ae(R,2*b+2*P+1),R[2*b+2*P+2]+=O*qe,ae(R,2*b+2*P+2)}for(k=0;k<x;k++)R[k]=R[2*k+1]<<16|R[2*k];for(k=x;k<2*x;k++)R[k]=0;return new h(R,0)};function ae(k,x){for(;(k[x]&65535)!=k[x];)k[x+1]+=k[x]>>>16,k[x]&=65535,x++}function ce(k,x){this.g=k,this.h=x}function xe(k,x){if(W(x))throw Error("division by zero");if(W(k))return new ce(I,I);if(K(k))return x=xe($(k),x),new ce($(x.g),$(x.h));if(K(x))return x=xe(k,$(x)),new ce($(x.g),x.h);if(k.g.length>30){if(K(k)||K(x))throw Error("slowDivide_ only works with positive integers.");for(var R=A,b=x;b.l(k)<=0;)R=Te(R),b=Te(b);var P=de(R,1),O=de(b,1);for(b=de(b,2),R=de(R,2);!W(b);){var C=O.add(b);C.l(k)<=0&&(P=P.add(R),O=C),b=de(b,1),R=de(R,1)}return x=me(k,P.j(x)),new ce(P,x)}for(P=I;k.l(x)>=0;){for(R=Math.max(1,Math.floor(k.m()/x.m())),b=Math.ceil(Math.log(R)/Math.LN2),b=b<=48?1:Math.pow(2,b-48),O=_(R),C=O.j(x);K(C)||C.l(k)>0;)R-=b,O=_(R),C=O.j(x);W(O)&&(O=A),P=P.add(O),k=me(k,C)}return new ce(P,k)}r.B=function(k){return xe(this,k).h},r.and=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)&k.i(b);return new h(R,this.h&k.h)},r.or=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)|k.i(b);return new h(R,this.h|k.h)},r.xor=function(k){const x=Math.max(this.g.length,k.g.length),R=[];for(let b=0;b<x;b++)R[b]=this.i(b)^k.i(b);return new h(R,this.h^k.h)};function Te(k){const x=k.g.length+1,R=[];for(let b=0;b<x;b++)R[b]=k.i(b)<<1|k.i(b-1)>>>31;return new h(R,k.h)}function de(k,x){const R=x>>5;x%=32;const b=k.g.length-R,P=[];for(let O=0;O<b;O++)P[O]=x>0?k.i(O+R)>>>x|k.i(O+R+1)<<32-x:k.i(O+R);return new h(P,k.h)}i.prototype.digest=i.prototype.A,i.prototype.reset=i.prototype.u,i.prototype.update=i.prototype.v,Uv=i,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=w,Ls=h}).apply(typeof Py<"u"?Py:typeof self<"u"?self:typeof window<"u"?window:{});var Xu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zv,Ga,Bv,hc,pf,$v,Hv,qv;(function(){var r,e=Object.defineProperty;function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xu=="object"&&Xu];for(var m=0;m<u.length;++m){var y=u[m];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var i=t(this);function o(u,m){if(m)e:{var y=i;u=u.split(".");for(var T=0;T<u.length-1;T++){var M=u[T];if(!(M in y))break e;y=y[M]}u=u[u.length-1],T=y[u],m=m(T),m!=T&&m!=null&&e(y,u,{configurable:!0,writable:!0,value:m})}}o("Symbol.dispose",function(u){return u||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(u){return u||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(u){return u||function(m){var y=[],T;for(T in m)Object.prototype.hasOwnProperty.call(m,T)&&y.push([T,m[T]]);return y}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function f(u){var m=typeof u;return m=="object"&&u!=null||m=="function"}function g(u,m,y){return u.call.apply(u.bind,arguments)}function _(u,m,y){return _=g,_.apply(null,arguments)}function w(u,m){var y=Array.prototype.slice.call(arguments,1);return function(){var T=y.slice();return T.push.apply(T,arguments),u.apply(this,T)}}function I(u,m){function y(){}y.prototype=m.prototype,u.Z=m.prototype,u.prototype=new y,u.prototype.constructor=u,u.Ob=function(T,M,B){for(var te=Array(arguments.length-2),Re=2;Re<arguments.length;Re++)te[Re-2]=arguments[Re];return m.prototype[M].apply(T,te)}}var A=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?u=>u&&AsyncContext.Snapshot.wrap(u):u=>u;function j(u){const m=u.length;if(m>0){const y=Array(m);for(let T=0;T<m;T++)y[T]=u[T];return y}return[]}function W(u,m){for(let T=1;T<arguments.length;T++){const M=arguments[T];var y=typeof M;if(y=y!="object"?y:M?Array.isArray(M)?"array":y:"null",y=="array"||y=="object"&&typeof M.length=="number"){y=u.length||0;const B=M.length||0;u.length=y+B;for(let te=0;te<B;te++)u[y+te]=M[te]}else u.push(M)}}class K{constructor(m,y){this.i=m,this.j=y,this.h=0,this.g=null}get(){let m;return this.h>0?(this.h--,m=this.g,this.g=m.next,m.next=null):m=this.i(),m}}function $(u){h.setTimeout(()=>{throw u},0)}function me(){var u=k;let m=null;return u.g&&(m=u.g,u.g=u.g.next,u.g||(u.h=null),m.next=null),m}class ae{constructor(){this.h=this.g=null}add(m,y){const T=ce.get();T.set(m,y),this.h?this.h.next=T:this.g=T,this.h=T}}var ce=new K(()=>new xe,u=>u.reset());class xe{constructor(){this.next=this.g=this.h=null}set(m,y){this.h=m,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let Te,de=!1,k=new ae,x=()=>{const u=Promise.resolve(void 0);Te=()=>{u.then(R)}};function R(){for(var u;u=me();){try{u.h.call(u.g)}catch(y){$(y)}var m=ce;m.j(u),m.h<100&&(m.h++,u.next=m.g,m.g=u)}de=!1}function b(){this.u=this.u,this.C=this.C}b.prototype.u=!1,b.prototype.dispose=function(){this.u||(this.u=!0,this.N())},b.prototype[Symbol.dispose]=function(){this.dispose()},b.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function P(u,m){this.type=u,this.g=this.target=m,this.defaultPrevented=!1}P.prototype.h=function(){this.defaultPrevented=!0};var O=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var u=!1,m=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};h.addEventListener("test",y,m),h.removeEventListener("test",y,m)}catch{}return u})();function C(u){return/^[\s\xa0]*$/.test(u)}function qe(u,m){P.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u&&this.init(u,m)}I(qe,P),qe.prototype.init=function(u,m){const y=this.type=u.type,T=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;this.target=u.target||u.srcElement,this.g=m,m=u.relatedTarget,m||(y=="mouseover"?m=u.fromElement:y=="mouseout"&&(m=u.toElement)),this.relatedTarget=m,T?(this.clientX=T.clientX!==void 0?T.clientX:T.pageX,this.clientY=T.clientY!==void 0?T.clientY:T.pageY,this.screenX=T.screenX||0,this.screenY=T.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=u.pointerType,this.state=u.state,this.i=u,u.defaultPrevented&&qe.Z.h.call(this)},qe.prototype.h=function(){qe.Z.h.call(this);const u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var yt="closure_listenable_"+(Math.random()*1e6|0),Ct=0;function We(u,m,y,T,M){this.listener=u,this.proxy=null,this.src=m,this.type=y,this.capture=!!T,this.ha=M,this.key=++Ct,this.da=this.fa=!1}function H(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function ne(u,m,y){for(const T in u)m.call(y,u[T],T,u)}function Z(u,m){for(const y in u)m.call(void 0,u[y],y,u)}function V(u){const m={};for(const y in u)m[y]=u[y];return m}const z="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function le(u,m){let y,T;for(let M=1;M<arguments.length;M++){T=arguments[M];for(y in T)u[y]=T[y];for(let B=0;B<z.length;B++)y=z[B],Object.prototype.hasOwnProperty.call(T,y)&&(u[y]=T[y])}}function ge(u){this.src=u,this.g={},this.h=0}ge.prototype.add=function(u,m,y,T,M){const B=u.toString();u=this.g[B],u||(u=this.g[B]=[],this.h++);const te=ye(u,m,T,M);return te>-1?(m=u[te],y||(m.fa=!1)):(m=new We(m,this.src,B,!!T,M),m.fa=y,u.push(m)),m};function pe(u,m){const y=m.type;if(y in u.g){var T=u.g[y],M=Array.prototype.indexOf.call(T,m,void 0),B;(B=M>=0)&&Array.prototype.splice.call(T,M,1),B&&(H(m),u.g[y].length==0&&(delete u.g[y],u.h--))}}function ye(u,m,y,T){for(let M=0;M<u.length;++M){const B=u[M];if(!B.da&&B.listener==m&&B.capture==!!y&&B.ha==T)return M}return-1}var ve="closure_lm_"+(Math.random()*1e6|0),Ne={};function Ie(u,m,y,T,M){if(Array.isArray(m)){for(let B=0;B<m.length;B++)Ie(u,m[B],y,T,M);return null}return y=Qo(y),u&&u[yt]?u.J(m,y,f(T)?!!T.capture:!1,M):Be(u,m,y,!1,T,M)}function Be(u,m,y,T,M,B){if(!m)throw Error("Invalid event type");const te=f(M)?!!M.capture:!!M;let Re=Fi(u);if(Re||(u[ve]=Re=new ge(u)),y=Re.add(m,y,T,te,B),y.proxy)return y;if(T=ht(),y.proxy=T,T.src=u,T.listener=y,u.addEventListener)O||(M=te),M===void 0&&(M=!1),u.addEventListener(m.toString(),T,M);else if(u.attachEvent)u.attachEvent(at(m.toString()),T);else if(u.addListener&&u.removeListener)u.addListener(T);else throw Error("addEventListener and attachEvent are unavailable.");return y}function ht(){function u(y){return m.call(u.src,u.listener,y)}const m=Hn;return u}function et(u,m,y,T,M){if(Array.isArray(m))for(var B=0;B<m.length;B++)et(u,m[B],y,T,M);else T=f(T)?!!T.capture:!!T,y=Qo(y),u&&u[yt]?(u=u.i,B=String(m).toString(),B in u.g&&(m=u.g[B],y=ye(m,y,T,M),y>-1&&(H(m[y]),Array.prototype.splice.call(m,y,1),m.length==0&&(delete u.g[B],u.h--)))):u&&(u=Fi(u))&&(m=u.g[m.toString()],u=-1,m&&(u=ye(m,y,T,M)),(y=u>-1?m[u]:null)&&tt(y))}function tt(u){if(typeof u!="number"&&u&&!u.da){var m=u.src;if(m&&m[yt])pe(m.i,u);else{var y=u.type,T=u.proxy;m.removeEventListener?m.removeEventListener(y,T,u.capture):m.detachEvent?m.detachEvent(at(y),T):m.addListener&&m.removeListener&&m.removeListener(T),(y=Fi(m))?(pe(y,u),y.h==0&&(y.src=null,m[ve]=null)):H(u)}}}function at(u){return u in Ne?Ne[u]:Ne[u]="on"+u}function Hn(u,m){if(u.da)u=!0;else{m=new qe(m,this);const y=u.listener,T=u.ha||u.src;u.fa&&tt(u),u=y.call(T,m)}return u}function Fi(u){return u=u[ve],u instanceof ge?u:null}var Ys="__closure_events_fn_"+(Math.random()*1e9>>>0);function Qo(u){return typeof u=="function"?u:(u[Ys]||(u[Ys]=function(m){return u.handleEvent(m)}),u[Ys])}function _t(){b.call(this),this.i=new ge(this),this.M=this,this.G=null}I(_t,b),_t.prototype[yt]=!0,_t.prototype.removeEventListener=function(u,m,y,T){et(this,u,m,y,T)};function dt(u,m){var y,T=u.G;if(T)for(y=[];T;T=T.G)y.push(T);if(u=u.M,T=m.type||m,typeof m=="string")m=new P(m,u);else if(m instanceof P)m.target=m.target||u;else{var M=m;m=new P(T,u),le(m,M)}M=!0;let B,te;if(y)for(te=y.length-1;te>=0;te--)B=m.g=y[te],M=Rn(B,T,!0,m)&&M;if(B=m.g=u,M=Rn(B,T,!0,m)&&M,M=Rn(B,T,!1,m)&&M,y)for(te=0;te<y.length;te++)B=m.g=y[te],M=Rn(B,T,!1,m)&&M}_t.prototype.N=function(){if(_t.Z.N.call(this),this.i){var u=this.i;for(const m in u.g){const y=u.g[m];for(let T=0;T<y.length;T++)H(y[T]);delete u.g[m],u.h--}}this.G=null},_t.prototype.J=function(u,m,y,T){return this.i.add(String(u),m,!1,y,T)},_t.prototype.K=function(u,m,y,T){return this.i.add(String(u),m,!0,y,T)};function Rn(u,m,y,T){if(m=u.i.g[String(m)],!m)return!0;m=m.concat();let M=!0;for(let B=0;B<m.length;++B){const te=m[B];if(te&&!te.da&&te.capture==y){const Re=te.listener,ft=te.ha||te.src;te.fa&&pe(u.i,te),M=Re.call(ft,T)!==!1&&M}}return M&&!T.defaultPrevented}function Jo(u,m){if(typeof u!="function")if(u&&typeof u.handleEvent=="function")u=_(u.handleEvent,u);else throw Error("Invalid listener argument");return Number(m)>2147483647?-1:h.setTimeout(u,m||0)}function Yo(u){u.g=Jo(()=>{u.g=null,u.i&&(u.i=!1,Yo(u))},u.l);const m=u.h;u.h=null,u.m.apply(null,m)}class Vl extends b{constructor(m,y){super(),this.m=m,this.l=y,this.h=null,this.i=!1,this.g=null}j(m){this.h=arguments,this.g?this.i=!0:Yo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Xr(u){b.call(this),this.h=u,this.g={}}I(Xr,b);var Xo=[];function Ui(u){ne(u.g,function(m,y){this.g.hasOwnProperty(y)&&tt(m)},u),u.g={}}Xr.prototype.N=function(){Xr.Z.N.call(this),Ui(this)},Xr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Zr=h.JSON.stringify,Ol=h.JSON.parse,Xs=class{stringify(u){return h.JSON.stringify(u,void 0)}parse(u){return h.JSON.parse(u,void 0)}};function es(){}function Ll(){}var ts={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function zi(){P.call(this,"d")}I(zi,P);function Zo(){P.call(this,"c")}I(Zo,P);var Pn={},Bi=null;function ns(){return Bi=Bi||new _t}Pn.Ia="serverreachability";function $i(u){P.call(this,Pn.Ia,u)}I($i,P);function _r(u){const m=ns();dt(m,new $i(m))}Pn.STAT_EVENT="statevent";function vr(u,m){P.call(this,Pn.STAT_EVENT,u),this.stat=m}I(vr,P);function lt(u){const m=ns();dt(m,new vr(m,u))}Pn.Ja="timingevent";function ea(u,m){P.call(this,Pn.Ja,u),this.size=m}I(ea,P);function rs(u,m){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){u()},m)}function ss(){this.g=!0}ss.prototype.ua=function(){this.g=!1};function Ml(u,m,y,T,M,B){u.info(function(){if(u.g)if(B){var te="",Re=B.split("&");for(let $e=0;$e<Re.length;$e++){var ft=Re[$e].split("=");if(ft.length>1){const vt=ft[0];ft=ft[1];const hn=vt.split("_");te=hn.length>=2&&hn[1]=="type"?te+(vt+"="+ft+"&"):te+(vt+"=redacted&")}}}else te=null;else te=B;return"XMLHTTP REQ ("+T+") [attempt "+M+"]: "+m+`
`+y+`
`+te})}function jl(u,m,y,T,M,B,te){u.info(function(){return"XMLHTTP RESP ("+T+") [ attempt "+M+"]: "+m+`
`+y+`
`+B+" "+te})}function qn(u,m,y,T){u.info(function(){return"XMLHTTP TEXT ("+m+"): "+Zs(u,y)+(T?" "+T:"")})}function Fl(u,m){u.info(function(){return"TIMEOUT: "+m})}ss.prototype.info=function(){};function Zs(u,m){if(!u.g)return m;if(!m)return null;try{const B=JSON.parse(m);if(B){for(u=0;u<B.length;u++)if(Array.isArray(B[u])){var y=B[u];if(!(y.length<2)){var T=y[1];if(Array.isArray(T)&&!(T.length<1)){var M=T[0];if(M!="noop"&&M!="stop"&&M!="close")for(let te=1;te<T.length;te++)T[te]=""}}}}return Zr(B)}catch{return m}}var is={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},os={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Ul;function wr(){}I(wr,es),wr.prototype.g=function(){return new XMLHttpRequest},Ul=new wr;function Wn(u){return encodeURIComponent(String(u))}function Hi(u){var m=1;u=u.split(":");const y=[];for(;m>0&&u.length;)y.push(u.shift()),m--;return u.length&&y.push(u.join(":")),y}function _n(u,m,y,T){this.j=u,this.i=m,this.l=y,this.S=T||1,this.V=new Xr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new zl}function zl(){this.i=null,this.g="",this.h=!1}var Bl={},ta={};function Nn(u,m,y){u.M=1,u.A=Tr(vn(m)),u.u=y,u.R=!0,na(u,null)}function na(u,m){u.F=Date.now(),ei(u),u.B=vn(u.A);var y=u.B,T=u.S;Array.isArray(T)||(T=[String(T)]),da(y.i,"t",T),u.C=0,y=u.j.L,u.h=new zl,u.g=Xl(u.j,y?m:null,!u.u),u.P>0&&(u.O=new Vl(_(u.Y,u,u.g),u.P)),m=u.V,y=u.g,T=u.ba;var M="readystatechange";Array.isArray(M)||(M&&(Xo[0]=M.toString()),M=Xo);for(let B=0;B<M.length;B++){const te=Ie(y,M[B],T||m.handleEvent,!1,m.h||m);if(!te)break;m.g[te.key]=te}m=u.J?V(u.J):{},u.u?(u.v||(u.v="POST"),m["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.B,u.v,u.u,m)):(u.v="GET",u.g.ea(u.B,u.v,null,m)),_r(),Ml(u.i,u.v,u.B,u.l,u.S,u.u)}_n.prototype.ba=function(u){u=u.target;const m=this.O;m&&Zn(u)==3?m.j():this.Y(u)},_n.prototype.Y=function(u){try{if(u==this.g)e:{const Re=Zn(this.g),ft=this.g.ya(),$e=this.g.ca();if(!(Re<3)&&(Re!=3||this.g&&(this.h.h||this.g.la()||Jl(this.g)))){this.K||Re!=4||ft==7||(ft==8||$e<=0?_r(3):_r(2)),qi(this);var m=this.g.ca();this.X=m;var y=$l(this);if(this.o=m==200,jl(this.i,this.v,this.B,this.l,this.S,Re,m),this.o){if(this.U&&!this.L){t:{if(this.g){var T,M=this.g;if((T=M.g?M.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(T)){var B=T;break t}}B=null}if(u=B)qn(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Je(this,u);else{this.o=!1,this.m=3,lt(12),Er(this),ti(this);break e}}if(this.R){u=!0;let vt;for(;!this.K&&this.C<y.length;)if(vt=ql(this,y),vt==ta){Re==4&&(this.m=4,lt(14),u=!1),qn(this.i,this.l,null,"[Incomplete Response]");break}else if(vt==Bl){this.m=4,lt(15),qn(this.i,this.l,y,"[Invalid Chunk]"),u=!1;break}else qn(this.i,this.l,vt,null),Je(this,vt);if(Hl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Re!=4||y.length!=0||this.h.h||(this.m=1,lt(16),u=!1),this.o=this.o&&u,!u)qn(this.i,this.l,y,"[Invalid Chunked Response]"),Er(this),ti(this);else if(y.length>0&&!this.W){this.W=!0;var te=this.j;te.g==this&&te.aa&&!te.P&&(te.j.info("Great, no buffering proxy detected. Bytes received: "+y.length),ci(te),te.P=!0,lt(11))}}else qn(this.i,this.l,y,null),Je(this,y);Re==4&&Er(this),this.o&&!this.K&&(Re==4?to(this.j,this):(this.o=!1,ei(this)))}else pa(this.g),m==400&&y.indexOf("Unknown SID")>0?(this.m=3,lt(12)):(this.m=0,lt(13)),Er(this),ti(this)}}}catch{}finally{}};function $l(u){if(!Hl(u))return u.g.la();const m=Jl(u.g);if(m==="")return"";let y="";const T=m.length,M=Zn(u.g)==4;if(!u.h.i){if(typeof TextDecoder>"u")return Er(u),ti(u),"";u.h.i=new h.TextDecoder}for(let B=0;B<T;B++)u.h.h=!0,y+=u.h.i.decode(m[B],{stream:!(M&&B==T-1)});return m.length=0,u.h.g+=y,u.C=0,u.h.g}function Hl(u){return u.g?u.v=="GET"&&u.M!=2&&u.j.Aa:!1}function ql(u,m){var y=u.C,T=m.indexOf(`
`,y);return T==-1?ta:(y=Number(m.substring(y,T)),isNaN(y)?Bl:(T+=1,T+y>m.length?ta:(m=m.slice(T,T+y),u.C=T+y,m)))}_n.prototype.cancel=function(){this.K=!0,Er(this)};function ei(u){u.T=Date.now()+u.H,ra(u,u.H)}function ra(u,m){if(u.D!=null)throw Error("WatchDog timer not null");u.D=rs(_(u.aa,u),m)}function qi(u){u.D&&(h.clearTimeout(u.D),u.D=null)}_n.prototype.aa=function(){this.D=null;const u=Date.now();u-this.T>=0?(Fl(this.i,this.B),this.M!=2&&(_r(),lt(17)),Er(this),this.m=2,ti(this)):ra(this,this.T-u)};function ti(u){u.j.I==0||u.K||to(u.j,u)}function Er(u){qi(u);var m=u.O;m&&typeof m.dispose=="function"&&m.dispose(),u.O=null,Ui(u.V),u.g&&(m=u.g,u.g=null,m.abort(),m.dispose())}function Je(u,m){try{var y=u.j;if(y.I!=0&&(y.g==u||ia(y.h,u))){if(!u.L&&ia(y.h,u)&&y.I==3){try{var T=y.Ba.g.parse(m)}catch{T=null}if(Array.isArray(T)&&T.length==3){var M=T;if(M[0]==0){e:if(!y.v){if(y.g)if(y.g.F+3e3<u.F)eo(y),un(y);else break e;nr(y),lt(18)}}else y.xa=M[1],0<y.xa-y.K&&M[2]<37500&&y.F&&y.A==0&&!y.C&&(y.C=rs(_(y.Va,y),6e3));ni(y.h)<=1&&y.ta&&(y.ta=void 0)}else cn(y,11)}else if((u.L||y.g==u)&&eo(y),!C(m))for(M=y.Ba.g.parse(m),m=0;m<M.length;m++){let $e=M[m];const vt=$e[0];if(!(vt<=y.K))if(y.K=vt,$e=$e[1],y.I==2)if($e[0]=="c"){y.M=$e[1],y.ba=$e[2];const hn=$e[3];hn!=null&&(y.ka=hn,y.j.info("VER="+y.ka));const kr=$e[4];kr!=null&&(y.za=kr,y.j.info("SVER="+y.za));const rr=$e[5];rr!=null&&typeof rr=="number"&&rr>0&&(T=1.5*rr,y.O=T,y.j.info("backChannelRequestTimeoutMs_="+T)),T=y;const sr=u.g;if(sr){const so=sr.g?sr.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(so){var B=T.h;B.g||so.indexOf("spdy")==-1&&so.indexOf("quic")==-1&&so.indexOf("h2")==-1||(B.j=B.l,B.g=new Set,B.h&&(Ki(B,B.h),B.h=null))}if(T.G){const ya=sr.g?sr.g.getResponseHeader("X-HTTP-Session-Id"):null;ya&&(T.wa=ya,Ue(T.J,T.G,ya))}}y.I=3,y.l&&y.l.ra(),y.aa&&(y.T=Date.now()-u.F,y.j.info("Handshake RTT: "+y.T+"ms")),T=y;var te=u;if(T.na=ga(T,T.L?T.ba:null,T.W),te.L){ri(T.h,te);var Re=te,ft=T.O;ft&&(Re.H=ft),Re.D&&(qi(Re),ei(Re)),T.g=te}else Ut(T);y.i.length>0&&Ar(y)}else $e[0]!="stop"&&$e[0]!="close"||cn(y,7);else y.I==3&&($e[0]=="stop"||$e[0]=="close"?$e[0]=="stop"?cn(y,7):Xi(y):$e[0]!="noop"&&y.l&&y.l.qa($e),y.A=0)}}_r(4)}catch{}}var gh=class{constructor(u,m){this.g=u,this.map=m}};function Wi(u){this.l=u||10,h.PerformanceNavigationTiming?(u=h.performance.getEntriesByType("navigation"),u=u.length>0&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function sa(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function ni(u){return u.h?1:u.g?u.g.size:0}function ia(u,m){return u.h?u.h==m:u.g?u.g.has(m):!1}function Ki(u,m){u.g?u.g.add(m):u.h=m}function ri(u,m){u.h&&u.h==m?u.h=null:u.g&&u.g.has(m)&&u.g.delete(m)}Wi.prototype.cancel=function(){if(this.i=on(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function on(u){if(u.h!=null)return u.i.concat(u.h.G);if(u.g!=null&&u.g.size!==0){let m=u.i;for(const y of u.g.values())m=m.concat(y.G);return m}return j(u.i)}var Wl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function an(u,m){if(u){u=u.split("&");for(let y=0;y<u.length;y++){const T=u[y].indexOf("=");let M,B=null;T>=0?(M=u[y].substring(0,T),B=u[y].substring(T+1)):M=u[y],m(M,B?decodeURIComponent(B.replace(/\+/g," ")):"")}}}function Kn(u){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let m;u instanceof Kn?(this.l=u.l,si(this,u.j),this.o=u.o,this.g=u.g,Gn(this,u.u),this.h=u.h,as(this,fa(u.i)),this.m=u.m):u&&(m=String(u).match(Wl))?(this.l=!1,si(this,m[1]||"",!0),this.o=ii(m[2]||""),this.g=ii(m[3]||"",!0),Gn(this,m[4]),this.h=ii(m[5]||"",!0),as(this,m[6]||"",!0),this.m=ii(m[7]||"")):(this.l=!1,this.i=new Le(null,this.l))}Kn.prototype.toString=function(){const u=[];var m=this.j;m&&u.push(oi(m,aa,!0),":");var y=this.g;return(y||m=="file")&&(u.push("//"),(m=this.o)&&u.push(oi(m,aa,!0),"@"),u.push(Wn(y).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.u,y!=null&&u.push(":",String(y))),(y=this.h)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push(oi(y,y.charAt(0)=="/"?ai:la,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",oi(y,ua)),u.join("")},Kn.prototype.resolve=function(u){const m=vn(this);let y=!!u.j;y?si(m,u.j):y=!!u.o,y?m.o=u.o:y=!!u.g,y?m.g=u.g:y=u.u!=null;var T=u.h;if(y)Gn(m,u.u);else if(y=!!u.h){if(T.charAt(0)!="/")if(this.g&&!this.h)T="/"+T;else{var M=m.h.lastIndexOf("/");M!=-1&&(T=m.h.slice(0,M+1)+T)}if(M=T,M==".."||M==".")T="";else if(M.indexOf("./")!=-1||M.indexOf("/.")!=-1){T=M.lastIndexOf("/",0)==0,M=M.split("/");const B=[];for(let te=0;te<M.length;){const Re=M[te++];Re=="."?T&&te==M.length&&B.push(""):Re==".."?((B.length>1||B.length==1&&B[0]!="")&&B.pop(),T&&te==M.length&&B.push("")):(B.push(Re),T=!0)}T=B.join("/")}else T=M}return y?m.h=T:y=u.i.toString()!=="",y?as(m,fa(u.i)):y=!!u.m,y&&(m.m=u.m),m};function vn(u){return new Kn(u)}function si(u,m,y){u.j=y?ii(m,!0):m,u.j&&(u.j=u.j.replace(/:$/,""))}function Gn(u,m){if(m){if(m=Number(m),isNaN(m)||m<0)throw Error("Bad port number "+m);u.u=m}else u.u=null}function as(u,m,y){m instanceof Le?(u.i=m,Qi(u.i,u.l)):(y||(m=oi(m,yh)),u.i=new Le(m,u.l))}function Ue(u,m,y){u.i.set(m,y)}function Tr(u){return Ue(u,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),u}function ii(u,m){return u?m?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function oi(u,m,y){return typeof u=="string"?(u=encodeURI(u).replace(m,oa),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function oa(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var aa=/[#\/\?@]/g,la=/[#\?:]/g,ai=/[#\?]/g,yh=/[#\?@]/g,ua=/#/g;function Le(u,m){this.h=this.g=null,this.i=u||null,this.j=!!m}function Qn(u){u.g||(u.g=new Map,u.h=0,u.i&&an(u.i,function(m,y){u.add(decodeURIComponent(m.replace(/\+/g," ")),y)}))}r=Le.prototype,r.add=function(u,m){Qn(this),this.i=null,u=Jn(this,u);let y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(m),this.h+=1,this};function ca(u,m){Qn(u),m=Jn(u,m),u.g.has(m)&&(u.i=null,u.h-=u.g.get(m).length,u.g.delete(m))}function Gi(u,m){return Qn(u),m=Jn(u,m),u.g.has(m)}r.forEach=function(u,m){Qn(this),this.g.forEach(function(y,T){y.forEach(function(M){u.call(m,M,T,this)},this)},this)};function ha(u,m){Qn(u);let y=[];if(typeof m=="string")Gi(u,m)&&(y=y.concat(u.g.get(Jn(u,m))));else for(u=Array.from(u.g.values()),m=0;m<u.length;m++)y=y.concat(u[m]);return y}r.set=function(u,m){return Qn(this),this.i=null,u=Jn(this,u),Gi(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[m]),this.h+=1,this},r.get=function(u,m){return u?(u=ha(this,u),u.length>0?String(u[0]):m):m};function da(u,m,y){ca(u,m),y.length>0&&(u.i=null,u.g.set(Jn(u,m),j(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],m=Array.from(this.g.keys());for(let T=0;T<m.length;T++){var y=m[T];const M=Wn(y);y=ha(this,y);for(let B=0;B<y.length;B++){let te=M;y[B]!==""&&(te+="="+Wn(y[B])),u.push(te)}}return this.i=u.join("&")};function fa(u){const m=new Le;return m.i=u.i,u.g&&(m.g=new Map(u.g),m.h=u.h),m}function Jn(u,m){return m=String(m),u.j&&(m=m.toLowerCase()),m}function Qi(u,m){m&&!u.j&&(Qn(u),u.i=null,u.g.forEach(function(y,T){const M=T.toLowerCase();T!=M&&(ca(this,T),da(this,M,y))},u)),u.j=m}function Yn(u,m){const y=new ss;if(h.Image){const T=new Image;T.onload=w(Dt,y,"TestLoadImage: loaded",!0,m,T),T.onerror=w(Dt,y,"TestLoadImage: error",!1,m,T),T.onabort=w(Dt,y,"TestLoadImage: abort",!1,m,T),T.ontimeout=w(Dt,y,"TestLoadImage: timeout",!1,m,T),h.setTimeout(function(){T.ontimeout&&T.ontimeout()},1e4),T.src=u}else m(!1)}function Xn(u,m){const y=new ss,T=new AbortController,M=setTimeout(()=>{T.abort(),Dt(y,"TestPingServer: timeout",!1,m)},1e4);fetch(u,{signal:T.signal}).then(B=>{clearTimeout(M),B.ok?Dt(y,"TestPingServer: ok",!0,m):Dt(y,"TestPingServer: server error",!1,m)}).catch(()=>{clearTimeout(M),Dt(y,"TestPingServer: error",!1,m)})}function Dt(u,m,y,T,M){try{M&&(M.onload=null,M.onerror=null,M.onabort=null,M.ontimeout=null),T(y)}catch{}}function li(){this.g=new Xs}function Ir(u){this.i=u.Sb||null,this.h=u.ab||!1}I(Ir,es),Ir.prototype.g=function(){return new ln(this.i,this.h)};function ln(u,m){_t.call(this),this.H=u,this.o=m,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}I(ln,_t),r=ln.prototype,r.open=function(u,m){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=u,this.D=m,this.readyState=1,bn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const m={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};u&&(m.body=u),(this.H||h).fetch(new Request(this.D,m)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,ls(this)),this.readyState=0},r.Pa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,bn(this)),this.g&&(this.readyState=3,bn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Kl(this)}else u.text().then(this.Oa.bind(this),this.ga.bind(this))};function Kl(u){u.j.read().then(u.Ma.bind(u)).catch(u.ga.bind(u))}r.Ma=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var m=u.value?u.value:new Uint8Array(0);(m=this.B.decode(m,{stream:!u.done}))&&(this.response=this.responseText+=m)}u.done?ls(this):bn(this),this.readyState==3&&Kl(this)}},r.Oa=function(u){this.g&&(this.response=this.responseText=u,ls(this))},r.Na=function(u){this.g&&(this.response=u,ls(this))},r.ga=function(){this.g&&ls(this)};function ls(u){u.readyState=4,u.l=null,u.j=null,u.B=null,bn(u)}r.setRequestHeader=function(u,m){this.A.append(u,m)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],m=this.h.entries();for(var y=m.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=m.next();return u.join(`\r
`)};function bn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(ln.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Gl(u){let m="";return ne(u,function(y,T){m+=T,m+=":",m+=y,m+=`\r
`}),m}function Ji(u,m,y){e:{for(T in y){var T=!1;break e}T=!0}T||(y=Gl(y),typeof u=="string"?y!=null&&Wn(y):Ue(u,m,y))}function Ke(u){_t.call(this),this.headers=new Map,this.L=u||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}I(Ke,_t);var Ql=/^https?$/i,_h=["POST","PUT"];r=Ke.prototype,r.Fa=function(u){this.H=u},r.ea=function(u,m,y,T){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);m=m?m.toUpperCase():"GET",this.D=u,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ul.g(),this.g.onreadystatechange=A(_(this.Ca,this));try{this.B=!0,this.g.open(m,String(u),!0),this.B=!1}catch(B){us(this,B);return}if(u=y||"",y=new Map(this.headers),T)if(Object.getPrototypeOf(T)===Object.prototype)for(var M in T)y.set(M,T[M]);else if(typeof T.keys=="function"&&typeof T.get=="function")for(const B of T.keys())y.set(B,T.get(B));else throw Error("Unknown input type for opt_headers: "+String(T));T=Array.from(y.keys()).find(B=>B.toLowerCase()=="content-type"),M=h.FormData&&u instanceof h.FormData,!(Array.prototype.indexOf.call(_h,m,void 0)>=0)||T||M||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[B,te]of y)this.g.setRequestHeader(B,te);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(u),this.v=!1}catch(B){us(this,B)}};function us(u,m){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=m,u.o=5,cs(u),Sr(u)}function cs(u){u.A||(u.A=!0,dt(u,"complete"),dt(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=u||7,dt(this,"complete"),dt(this,"abort"),Sr(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Sr(this,!0)),Ke.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?xr(this):this.Xa())},r.Xa=function(){xr(this)};function xr(u){if(u.h&&typeof l<"u"){if(u.v&&Zn(u)==4)setTimeout(u.Ca.bind(u),0);else if(dt(u,"readystatechange"),Zn(u)==4){u.h=!1;try{const B=u.ca();e:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var m=!0;break e;default:m=!1}var y;if(!(y=m)){var T;if(T=B===0){let te=String(u.D).match(Wl)[1]||null;!te&&h.self&&h.self.location&&(te=h.self.location.protocol.slice(0,-1)),T=!Ql.test(te?te.toLowerCase():"")}y=T}if(y)dt(u,"complete"),dt(u,"success");else{u.o=6;try{var M=Zn(u)>2?u.g.statusText:""}catch{M=""}u.l=M+" ["+u.ca()+"]",cs(u)}}finally{Sr(u)}}}}function Sr(u,m){if(u.g){u.m&&(clearTimeout(u.m),u.m=null);const y=u.g;u.g=null,m||dt(u,"ready");try{y.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Zn(u){return u.g?u.g.readyState:0}r.ca=function(){try{return Zn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(u){if(this.g){var m=this.g.responseText;return u&&m.indexOf(u)==0&&(m=m.substring(u.length)),Ol(m)}};function Jl(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.F){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function pa(u){const m={};u=(u.g&&Zn(u)>=2&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let T=0;T<u.length;T++){if(C(u[T]))continue;var y=Hi(u[T]);const M=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const B=m[M]||[];m[M]=B,B.push(y)}Z(m,function(T){return T.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function er(u,m,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||m}function Yi(u){this.za=0,this.i=[],this.j=new ss,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=er("failFast",!1,u),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=er("baseRetryDelayMs",5e3,u),this.Za=er("retryDelaySeedMs",1e4,u),this.Ta=er("forwardChannelMaxRetries",2,u),this.va=er("forwardChannelRequestTimeoutMs",2e4,u),this.ma=u&&u.xmlHttpFactory||void 0,this.Ua=u&&u.Rb||void 0,this.Aa=u&&u.useFetchStreams||!1,this.O=void 0,this.L=u&&u.supportsCrossDomainXhr||!1,this.M="",this.h=new Wi(u&&u.concurrentRequestLimit),this.Ba=new li,this.S=u&&u.fastHandshake||!1,this.R=u&&u.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=u&&u.Pb||!1,u&&u.ua&&this.j.ua(),u&&u.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&u&&u.detectBufferingProxy||!1,this.ia=void 0,u&&u.longPollingTimeout&&u.longPollingTimeout>0&&(this.ia=u.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Yi.prototype,r.ka=8,r.I=1,r.connect=function(u,m,y,T){lt(0),this.W=u,this.H=m||{},y&&T!==void 0&&(this.H.OSID=y,this.H.OAID=T),this.F=this.X,this.J=ga(this,null,this.W),Ar(this)};function Xi(u){if(Zi(u),u.I==3){var m=u.V++,y=vn(u.J);if(Ue(y,"SID",u.M),Ue(y,"RID",m),Ue(y,"TYPE","terminate"),tr(u,y),m=new _n(u,u.j,m),m.M=2,m.A=Tr(vn(y)),y=!1,h.navigator&&h.navigator.sendBeacon)try{y=h.navigator.sendBeacon(m.A.toString(),"")}catch{}!y&&h.Image&&(new Image().src=m.A,y=!0),y||(m.g=Xl(m.j,null),m.g.ea(m.A)),m.F=Date.now(),ei(m)}hi(u)}function un(u){u.g&&(ci(u),u.g.cancel(),u.g=null)}function Zi(u){un(u),u.v&&(h.clearTimeout(u.v),u.v=null),eo(u),u.h.cancel(),u.m&&(typeof u.m=="number"&&h.clearTimeout(u.m),u.m=null)}function Ar(u){if(!sa(u.h)&&!u.m){u.m=!0;var m=u.Ea;Te||x(),de||(Te(),de=!0),k.add(m,u),u.D=0}}function Yl(u,m){return ni(u.h)>=u.h.j-(u.m?1:0)?!1:u.m?(u.i=m.G.concat(u.i),!0):u.I==1||u.I==2||u.D>=(u.Sa?0:u.Ta)?!1:(u.m=rs(_(u.Ea,u,m),no(u,u.D)),u.D++,!0)}r.Ea=function(u){if(this.m)if(this.m=null,this.I==1){if(!u){this.V=Math.floor(Math.random()*1e5),u=this.V++;const M=new _n(this,this.j,u);let B=this.o;if(this.U&&(B?(B=V(B),le(B,this.U)):B=this.U),this.u!==null||this.R||(M.J=B,B=null),this.S)e:{for(var m=0,y=0;y<this.i.length;y++){t:{var T=this.i[y];if("__data__"in T.map&&(T=T.map.__data__,typeof T=="string")){T=T.length;break t}T=void 0}if(T===void 0)break;if(m+=T,m>4096){m=y;break e}if(m===4096||y===this.i.length-1){m=y+1;break e}}m=1e3}else m=1e3;m=ma(this,M,m),y=vn(this.J),Ue(y,"RID",u),Ue(y,"CVER",22),this.G&&Ue(y,"X-HTTP-Session-Id",this.G),tr(this,y),B&&(this.R?m="headers="+Wn(Gl(B))+"&"+m:this.u&&Ji(y,this.u,B)),Ki(this.h,M),this.Ra&&Ue(y,"TYPE","init"),this.S?(Ue(y,"$req",m),Ue(y,"SID","null"),M.U=!0,Nn(M,y,null)):Nn(M,y,m),this.I=2}}else this.I==3&&(u?ui(this,u):this.i.length==0||sa(this.h)||ui(this))};function ui(u,m){var y;m?y=m.l:y=u.V++;const T=vn(u.J);Ue(T,"SID",u.M),Ue(T,"RID",y),Ue(T,"AID",u.K),tr(u,T),u.u&&u.o&&Ji(T,u.u,u.o),y=new _n(u,u.j,y,u.D+1),u.u===null&&(y.J=u.o),m&&(u.i=m.G.concat(u.i)),m=ma(u,y,1e3),y.H=Math.round(u.va*.5)+Math.round(u.va*.5*Math.random()),Ki(u.h,y),Nn(y,T,m)}function tr(u,m){u.H&&ne(u.H,function(y,T){Ue(m,T,y)}),u.l&&ne({},function(y,T){Ue(m,T,y)})}function ma(u,m,y){y=Math.min(u.i.length,y);const T=u.l?_(u.l.Ka,u.l,u):null;e:{var M=u.i;let Re=-1;for(;;){const ft=["count="+y];Re==-1?y>0?(Re=M[0].g,ft.push("ofs="+Re)):Re=0:ft.push("ofs="+Re);let $e=!0;for(let vt=0;vt<y;vt++){var B=M[vt].g;const hn=M[vt].map;if(B-=Re,B<0)Re=Math.max(0,M[vt].g-100),$e=!1;else try{B="req"+B+"_"||"";try{var te=hn instanceof Map?hn:Object.entries(hn);for(const[kr,rr]of te){let sr=rr;f(rr)&&(sr=Zr(rr)),ft.push(B+kr+"="+encodeURIComponent(sr))}}catch(kr){throw ft.push(B+"type="+encodeURIComponent("_badmap")),kr}}catch{T&&T(hn)}}if($e){te=ft.join("&");break e}}te=void 0}return u=u.i.splice(0,y),m.G=u,te}function Ut(u){if(!u.g&&!u.v){u.Y=1;var m=u.Da;Te||x(),de||(Te(),de=!0),k.add(m,u),u.A=0}}function nr(u){return u.g||u.v||u.A>=3?!1:(u.Y++,u.v=rs(_(u.Da,u),no(u,u.A)),u.A++,!0)}r.Da=function(){if(this.v=null,hs(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var u=4*this.T;this.j.info("BP detection timer enabled: "+u),this.B=rs(_(this.Wa,this),u)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,lt(10),un(this),hs(this))};function ci(u){u.B!=null&&(h.clearTimeout(u.B),u.B=null)}function hs(u){u.g=new _n(u,u.j,"rpc",u.Y),u.u===null&&(u.g.J=u.o),u.g.P=0;var m=vn(u.na);Ue(m,"RID","rpc"),Ue(m,"SID",u.M),Ue(m,"AID",u.K),Ue(m,"CI",u.F?"0":"1"),!u.F&&u.ia&&Ue(m,"TO",u.ia),Ue(m,"TYPE","xmlhttp"),tr(u,m),u.u&&u.o&&Ji(m,u.u,u.o),u.O&&(u.g.H=u.O);var y=u.g;u=u.ba,y.M=1,y.A=Tr(vn(m)),y.u=null,y.R=!0,na(y,u)}r.Va=function(){this.C!=null&&(this.C=null,un(this),nr(this),lt(19))};function eo(u){u.C!=null&&(h.clearTimeout(u.C),u.C=null)}function to(u,m){var y=null;if(u.g==m){eo(u),ci(u),u.g=null;var T=2}else if(ia(u.h,m))y=m.G,ri(u.h,m),T=1;else return;if(u.I!=0){if(m.o)if(T==1){y=m.u?m.u.length:0,m=Date.now()-m.F;var M=u.D;T=ns(),dt(T,new ea(T,y)),Ar(u)}else Ut(u);else if(M=m.m,M==3||M==0&&m.X>0||!(T==1&&Yl(u,m)||T==2&&nr(u)))switch(y&&y.length>0&&(m=u.h,m.i=m.i.concat(y)),M){case 1:cn(u,5);break;case 4:cn(u,10);break;case 3:cn(u,6);break;default:cn(u,2)}}}function no(u,m){let y=u.Qa+Math.floor(Math.random()*u.Za);return u.isActive()||(y*=2),y*m}function cn(u,m){if(u.j.info("Error code "+m),m==2){var y=_(u.bb,u),T=u.Ua;const M=!T;T=new Kn(T||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||si(T,"https"),Tr(T),M?Yn(T.toString(),y):Xn(T.toString(),y)}else lt(2);u.I=0,u.l&&u.l.pa(m),hi(u),Zi(u)}r.bb=function(u){u?(this.j.info("Successfully pinged google.com"),lt(2)):(this.j.info("Failed to ping google.com"),lt(1))};function hi(u){if(u.I=0,u.ja=[],u.l){const m=on(u.h);(m.length!=0||u.i.length!=0)&&(W(u.ja,m),W(u.ja,u.i),u.h.i.length=0,j(u.i),u.i.length=0),u.l.oa()}}function ga(u,m,y){var T=y instanceof Kn?vn(y):new Kn(y);if(T.g!="")m&&(T.g=m+"."+T.g),Gn(T,T.u);else{var M=h.location;T=M.protocol,m=m?m+"."+M.hostname:M.hostname,M=+M.port;const B=new Kn(null);T&&si(B,T),m&&(B.g=m),M&&Gn(B,M),y&&(B.h=y),T=B}return y=u.G,m=u.wa,y&&m&&Ue(T,y,m),Ue(T,"VER",u.ka),tr(u,T),T}function Xl(u,m,y){if(m&&!u.L)throw Error("Can't create secondary domain capable XhrIo object.");return m=u.Aa&&!u.ma?new Ke(new Ir({ab:y})):new Ke(u.ma),m.Fa(u.L),m}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Zl(){}r=Zl.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function ro(){}ro.prototype.g=function(u,m){return new Vt(u,m)};function Vt(u,m){_t.call(this),this.g=new Yi(m),this.l=u,this.h=m&&m.messageUrlParams||null,u=m&&m.messageHeaders||null,m&&m.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=m&&m.initMessageHeaders||null,m&&m.messageContentType&&(u?u["X-WebChannel-Content-Type"]=m.messageContentType:u={"X-WebChannel-Content-Type":m.messageContentType}),m&&m.sa&&(u?u["X-WebChannel-Client-Profile"]=m.sa:u={"X-WebChannel-Client-Profile":m.sa}),this.g.U=u,(u=m&&m.Qb)&&!C(u)&&(this.g.u=u),this.A=m&&m.supportsCrossDomainXhr||!1,this.v=m&&m.sendRawJson||!1,(m=m&&m.httpSessionIdParam)&&!C(m)&&(this.g.G=m,u=this.h,u!==null&&m in u&&(u=this.h,m in u&&delete u[m])),this.j=new ds(this)}I(Vt,_t),Vt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Vt.prototype.close=function(){Xi(this.g)},Vt.prototype.o=function(u){var m=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.v&&(y={},y.__data__=Zr(u),u=y);m.i.push(new gh(m.Ya++,u)),m.I==3&&Ar(m)},Vt.prototype.N=function(){this.g.l=null,delete this.j,Xi(this.g),delete this.g,Vt.Z.N.call(this)};function eu(u){zi.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var m=u.__sm__;if(m){e:{for(const y in m){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,m=m!==null&&u in m?m[u]:void 0),this.data=m}else this.data=u}I(eu,zi);function tu(){Zo.call(this),this.status=1}I(tu,Zo);function ds(u){this.g=u}I(ds,Zl),ds.prototype.ra=function(){dt(this.g,"a")},ds.prototype.qa=function(u){dt(this.g,new eu(u))},ds.prototype.pa=function(u){dt(this.g,new tu)},ds.prototype.oa=function(){dt(this.g,"b")},ro.prototype.createWebChannel=ro.prototype.g,Vt.prototype.send=Vt.prototype.o,Vt.prototype.open=Vt.prototype.m,Vt.prototype.close=Vt.prototype.close,qv=function(){return new ro},Hv=function(){return ns()},$v=Pn,pf={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},is.NO_ERROR=0,is.TIMEOUT=8,is.HTTP_ERROR=6,hc=is,os.COMPLETE="complete",Bv=os,Ll.EventType=ts,ts.OPEN="a",ts.CLOSE="b",ts.ERROR="c",ts.MESSAGE="d",_t.prototype.listen=_t.prototype.J,Ga=Ll,Ke.prototype.listenOnce=Ke.prototype.K,Ke.prototype.getLastError=Ke.prototype.Ha,Ke.prototype.getLastErrorCode=Ke.prototype.ya,Ke.prototype.getStatus=Ke.prototype.ca,Ke.prototype.getResponseJson=Ke.prototype.La,Ke.prototype.getResponseText=Ke.prototype.la,Ke.prototype.send=Ke.prototype.ea,Ke.prototype.setWithCredentials=Ke.prototype.Fa,zv=Ke}).apply(typeof Xu<"u"?Xu:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */let Ho="12.14.0";function jS(r){Ho=r}/**
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
 */const Di=new Vf("@firebase/firestore");function Ao(){return Di.logLevel}function re(r,...e){if(Di.logLevel<=Oe.DEBUG){const t=e.map(Kf);Di.debug(`Firestore (${Ho}): ${r}`,...t)}}function Kr(r,...e){if(Di.logLevel<=Oe.ERROR){const t=e.map(Kf);Di.error(`Firestore (${Ho}): ${r}`,...t)}}function Vi(r,...e){if(Di.logLevel<=Oe.WARN){const t=e.map(Kf);Di.warn(`Firestore (${Ho}): ${r}`,...t)}}function Kf(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
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
 */function Ae(r,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,Wv(r,i,t)}function Wv(r,e,t){let i=`FIRESTORE (${Ho}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Kr(i),new Error(i)}function ze(r,e,t,i){let o="Unexpected state";typeof t=="string"?o=t:i=t,r||Wv(e,o,i)}function Pe(r,e){return r}/**
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
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class se extends Qr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Kv{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class FS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Wt.UNAUTHENTICATED)))}shutdown(){}}class US{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class zS{constructor(e){this.t=e,this.currentUser=Wt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ze(this.o===void 0,42304);let i=this.i;const o=g=>this.i!==i?(i=this.i,t(g)):Promise.resolve();let l=new $r;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new $r,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{re("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(re("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new $r)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(re("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(ze(typeof i.accessToken=="string",31837,{l:i}),new Kv(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ze(e===null||typeof e=="string",2055,{h:e}),new Wt(e)}}class BS{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=Wt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class $S{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new BS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Wt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ny{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class HS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,mn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ze(this.o===void 0,3512);const i=l=>{l.error!=null&&re("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,re("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>i(l)))};const o=l=>{re("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):re("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ny(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ze(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ny(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function qS(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<r;i++)t[i]=Math.floor(256*Math.random());return t}/**
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
 */class Gf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const o=qS(40);for(let l=0;l<o.length;++l)i.length<20&&o[l]<t&&(i+=e.charAt(o[l]%62))}return i}}function De(r,e){return r<e?-1:r>e?1:0}function mf(r,e){const t=Math.min(r.length,e.length);for(let i=0;i<t;i++){const o=r.charAt(i),l=e.charAt(i);if(o!==l)return Yd(o)===Yd(l)?De(o,l):Yd(o)?1:-1}return De(r.length,e.length)}const WS=55296,KS=57343;function Yd(r){const e=r.charCodeAt(0);return e>=WS&&e<=KS}function Mo(r,e,t){return r.length===e.length&&r.every(((i,o)=>t(i,e[o])))}/**
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
 */const by="__name__";class ur{constructor(e,t,i){t===void 0?t=0:t>e.length&&Ae(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&Ae(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return ur.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ur?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let o=0;o<i;o++){const l=ur.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return De(e.length,t.length)}static compareSegments(e,t){const i=ur.isNumericId(e),o=ur.isNumericId(t);return i&&!o?-1:!i&&o?1:i&&o?ur.extractNumericId(e).compare(ur.extractNumericId(t)):mf(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ls.fromString(e.substring(4,e.length-2))}}class Qe extends ur{construct(e,t,i){return new Qe(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new se(q.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((o=>o.length>0)))}return new Qe(t)}static emptyPath(){return new Qe([])}}const GS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class jt extends ur{construct(e,t,i){return new jt(e,t,i)}static isValidIdentifier(e){return GS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),jt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===by}static keyField(){return new jt([by])}static fromServerFormat(e){const t=[];let i="",o=0;const l=()=>{if(i.length===0)throw new se(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let h=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new se(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new se(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=g,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(i+=f,o++):(l(),o++)}if(l(),h)throw new se(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new jt(t)}static emptyPath(){return new jt([])}}/**
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
 */class _e{constructor(e){this.path=e}static fromPath(e){return new _e(Qe.fromString(e))}static fromName(e){return new _e(Qe.fromString(e).popFirst(5))}static empty(){return new _e(Qe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Qe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Qe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new _e(new Qe(e.slice()))}}/**
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
 */function Gv(r,e,t){if(!t)throw new se(q.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function QS(r,e,t,i){if(e===!0&&i===!0)throw new se(q.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Dy(r){if(!_e.isDocumentKey(r))throw new se(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Vy(r){if(_e.isDocumentKey(r))throw new se(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Qv(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Yc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":Ae(12329,{type:typeof r})}function yn(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new se(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Yc(r);throw new se(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
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
 */function It(r,e){const t={typeString:r};return e&&(t.value=e),t}function Al(r,e){if(!Qv(r))throw new se(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const o=e[i].typeString,l="value"in e[i]?{value:e[i].value}:void 0;if(!(i in r)){t=`JSON missing required field: '${i}'`;break}const h=r[i];if(o&&typeof h!==o){t=`JSON field '${i}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${i}' field to equal '${l.value}'`;break}}if(t)throw new se(q.INVALID_ARGUMENT,t);return!0}/**
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
 */const Oy=-62135596800,Ly=1e6;class Ze{static now(){return Ze.fromMillis(Date.now())}static fromDate(e){return Ze.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Ly);return new Ze(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new se(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new se(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Oy)throw new se(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new se(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ly}_compareTo(e){return this.seconds===e.seconds?De(this.nanoseconds,e.nanoseconds):De(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ze._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Al(e,Ze._jsonSchema))return new Ze(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Oy;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ze._jsonSchemaVersion="firestore/timestamp/1.0",Ze._jsonSchema={type:It("string",Ze._jsonSchemaVersion),seconds:It("number"),nanoseconds:It("number")};/**
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
 */class Ce{static fromTimestamp(e){return new Ce(e)}static min(){return new Ce(new Ze(0,0))}static max(){return new Ce(new Ze(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const ol=-1;function JS(r,e){const t=r.toTimestamp().seconds,i=r.toTimestamp().nanoseconds+1,o=Ce.fromTimestamp(i===1e9?new Ze(t+1,0):new Ze(t,i));return new js(o,_e.empty(),e)}function YS(r){return new js(r.readTime,r.key,ol)}class js{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new js(Ce.min(),_e.empty(),ol)}static max(){return new js(Ce.max(),_e.empty(),ol)}}function XS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=_e.comparator(r.documentKey,e.documentKey),t!==0?t:De(r.largestBatchId,e.largestBatchId))}/**
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
 */const ZS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class eA{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function qo(r){if(r.code!==q.FAILED_PRECONDITION||r.message!==ZS)throw r;re("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class G{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Ae(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new G(((i,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(i,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(i,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof G?t:G.resolve(t)}catch(t){return G.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):G.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):G.reject(t)}static resolve(e){return new G(((t,i)=>{t(e)}))}static reject(e){return new G(((t,i)=>{i(e)}))}static waitFor(e){return new G(((t,i)=>{let o=0,l=0,h=!1;e.forEach((f=>{++o,f.next((()=>{++l,h&&l===o&&t()}),(g=>i(g)))})),h=!0,l===o&&t()}))}static or(e){let t=G.resolve(!1);for(const i of e)t=t.next((o=>o?G.resolve(o):i()));return t}static forEach(e,t){const i=[];return e.forEach(((o,l)=>{i.push(t.call(this,o,l))})),this.waitFor(i)}static mapArray(e,t){return new G(((i,o)=>{const l=e.length,h=new Array(l);let f=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((w=>{h[_]=w,++f,f===l&&i(h)}),(w=>o(w)))}}))}static doWhile(e,t){return new G(((i,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):i()};l()}))}}function tA(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Wo(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class Xc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this.ae(i),this.ue=i=>t.writeSequenceNumber(i))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Xc.ce=-1;/**
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
 */const Qf=-1;function Zc(r){return r==null}function kc(r){return r===0&&1/r==-1/0}function nA(r){return typeof r=="number"&&Number.isInteger(r)&&!kc(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const Jv="";function rA(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=My(e)),e=sA(r.get(t),e);return My(e)}function sA(r,e){let t=e;const i=r.length;for(let o=0;o<i;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case Jv:t+="";break;default:t+=l}}return t}function My(r){return r+Jv+""}/**
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
 */function jy(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Qs(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Yv(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class rt{constructor(e,t){this.comparator=e,this.root=t||Mt.EMPTY}insert(e,t){return new rt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Mt.BLACK,null,null))}remove(e){return new rt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Mt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const o=this.comparator(e,i.key);if(o===0)return t+i.left.size;o<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Zu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Zu(this.root,e,this.comparator,!1)}getReverseIterator(){return new Zu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Zu(this.root,e,this.comparator,!0)}}class Zu{constructor(e,t,i,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?i(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Mt{constructor(e,t,i,o,l){this.key=e,this.value=t,this.color=i??Mt.RED,this.left=o??Mt.EMPTY,this.right=l??Mt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,o,l){return new Mt(e??this.key,t??this.value,i??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let o=this;const l=i(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,i),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,i)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Mt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Mt.EMPTY;i=o.right.min(),o=o.copy(i.key,i.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Mt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Mt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Ae(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Ae(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Ae(27949);return e+(this.isRed()?0:1)}}Mt.EMPTY=null,Mt.RED=!0,Mt.BLACK=!1;Mt.EMPTY=new class{constructor(){this.size=0}get key(){throw Ae(57766)}get value(){throw Ae(16141)}get color(){throw Ae(16727)}get left(){throw Ae(29726)}get right(){throw Ae(36894)}copy(e,t,i,o,l){return this}insert(e,t,i){return new Mt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class kt{constructor(e){this.comparator=e,this.data=new rt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const o=i.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Fy(this.data.getIterator())}getIteratorFrom(e){return new Fy(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof kt)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new kt(this.comparator);return t.data=e,t}}class Fy{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class gn{constructor(e){this.fields=e,e.sort(jt.comparator)}static empty(){return new gn([])}unionWith(e){let t=new kt(jt.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new gn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Mo(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
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
 */class Xv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ft{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Xv("Invalid base64 string: "+l):l}})(e);return new Ft(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Ft(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return De(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ft.EMPTY_BYTE_STRING=new Ft("");const iA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Fs(r){if(ze(!!r,39018),typeof r=="string"){let e=0;const t=iA.exec(r);if(ze(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const i=new Date(r);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:mt(r.seconds),nanos:mt(r.nanos)}}function mt(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Us(r){return typeof r=="string"?Ft.fromBase64String(r):Ft.fromUint8Array(r)}/**
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
 */const Zv="server_timestamp",e0="__type__",t0="__previous_value__",n0="__local_write_time__";function Jf(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[e0])==null?void 0:i.stringValue)===Zv}function eh(r){const e=r.mapValue.fields[t0];return Jf(e)?eh(e):e}function al(r){const e=Fs(r.mapValue.fields[n0].timestampValue);return new Ze(e.seconds,e.nanos)}/**
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
 */class oA{constructor(e,t,i,o,l,h,f,g,_,w,I){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=w,this.apiKey=I}}const Cc="(default)";class ll{constructor(e,t){this.projectId=e,this.database=t||Cc}static empty(){return new ll("","")}get isDefaultDatabase(){return this.database===Cc}isEqual(e){return e instanceof ll&&e.projectId===this.projectId&&e.database===this.database}}function aA(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new se(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ll(r.options.projectId,e)}/**
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
 */const r0="__type__",lA="__max__",ec={mapValue:{}},s0="__vector__",Rc="value";function zs(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Jf(r)?4:cA(r)?9007199254740991:uA(r)?10:11:Ae(28295,{value:r})}function mr(r,e){if(r===e)return!0;const t=zs(r);if(t!==zs(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return al(r).isEqual(al(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=Fs(o.timestampValue),f=Fs(l.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Us(o.bytesValue).isEqual(Us(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return mt(o.geoPointValue.latitude)===mt(l.geoPointValue.latitude)&&mt(o.geoPointValue.longitude)===mt(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return mt(o.integerValue)===mt(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=mt(o.doubleValue),f=mt(l.doubleValue);return h===f?kc(h)===kc(f):isNaN(h)&&isNaN(f)}return!1})(r,e);case 9:return Mo(r.arrayValue.values||[],e.arrayValue.values||[],mr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},f=l.mapValue.fields||{};if(jy(h)!==jy(f))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(f[g]===void 0||!mr(h[g],f[g])))return!1;return!0})(r,e);default:return Ae(52216,{left:r})}}function ul(r,e){return(r.values||[]).find((t=>mr(t,e)))!==void 0}function jo(r,e){if(r===e)return 0;const t=zs(r),i=zs(e);if(t!==i)return De(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return De(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const f=mt(l.integerValue||l.doubleValue),g=mt(h.integerValue||h.doubleValue);return f<g?-1:f>g?1:f===g?0:isNaN(f)?isNaN(g)?0:-1:1})(r,e);case 3:return Uy(r.timestampValue,e.timestampValue);case 4:return Uy(al(r),al(e));case 5:return mf(r.stringValue,e.stringValue);case 6:return(function(l,h){const f=Us(l),g=Us(h);return f.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const f=l.split("/"),g=h.split("/");for(let _=0;_<f.length&&_<g.length;_++){const w=De(f[_],g[_]);if(w!==0)return w}return De(f.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const f=De(mt(l.latitude),mt(h.latitude));return f!==0?f:De(mt(l.longitude),mt(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return zy(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var A,j,W,K;const f=l.fields||{},g=h.fields||{},_=(A=f[Rc])==null?void 0:A.arrayValue,w=(j=g[Rc])==null?void 0:j.arrayValue,I=De(((W=_==null?void 0:_.values)==null?void 0:W.length)||0,((K=w==null?void 0:w.values)==null?void 0:K.length)||0);return I!==0?I:zy(_,w)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===ec.mapValue&&h===ec.mapValue)return 0;if(l===ec.mapValue)return 1;if(h===ec.mapValue)return-1;const f=l.fields||{},g=Object.keys(f),_=h.fields||{},w=Object.keys(_);g.sort(),w.sort();for(let I=0;I<g.length&&I<w.length;++I){const A=mf(g[I],w[I]);if(A!==0)return A;const j=jo(f[g[I]],_[w[I]]);if(j!==0)return j}return De(g.length,w.length)})(r.mapValue,e.mapValue);default:throw Ae(23264,{he:t})}}function Uy(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return De(r,e);const t=Fs(r),i=Fs(e),o=De(t.seconds,i.seconds);return o!==0?o:De(t.nanos,i.nanos)}function zy(r,e){const t=r.values||[],i=e.values||[];for(let o=0;o<t.length&&o<i.length;++o){const l=jo(t[o],i[o]);if(l)return l}return De(t.length,i.length)}function Fo(r){return gf(r)}function gf(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const i=Fs(t);return`time(${i.seconds},${i.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Us(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return _e.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let i="[",o=!0;for(const l of t.values||[])o?o=!1:i+=",",i+=gf(l);return i+"]"})(r.arrayValue):"mapValue"in r?(function(t){const i=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of i)l?l=!1:o+=",",o+=`${h}:${gf(t.fields[h])}`;return o+"}"})(r.mapValue):Ae(61005,{value:r})}function dc(r){switch(zs(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=eh(r);return e?16+dc(e):16;case 5:return 2*r.stringValue.length;case 6:return Us(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((o,l)=>o+dc(l)),0)})(r.arrayValue);case 10:case 11:return(function(i){let o=0;return Qs(i.fields,((l,h)=>{o+=l.length+dc(h)})),o})(r.mapValue);default:throw Ae(13486,{value:r})}}function By(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function cl(r){return!!r&&"integerValue"in r}function i0(r){return cl(r)||(function(t){return!!t&&"doubleValue"in t})(r)}function Yf(r){return!!r&&"arrayValue"in r}function $y(r){return!!r&&"nullValue"in r}function Hy(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function fc(r){return!!r&&"mapValue"in r}function uA(r){var t,i;return((i=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[r0])==null?void 0:i.stringValue)===s0}function el(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Qs(r.mapValue.fields,((t,i)=>e.mapValue.fields[t]=el(i))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=el(r.arrayValue.values[t]);return e}return{...r}}function cA(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===lA}/**
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
 */class sn{constructor(e){this.value=e}static empty(){return new sn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!fc(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=el(t)}setAll(e){let t=jt.emptyPath(),i={},o=[];e.forEach(((h,f)=>{if(!t.isImmediateParentOf(f)){const g=this.getFieldsMap(t);this.applyChanges(g,i,o),i={},o=[],t=f.popLast()}h?i[f.lastSegment()]=el(h):o.push(f.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,i,o)}delete(e){const t=this.field(e.popLast());fc(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return mr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let o=t.mapValue.fields[e.get(i)];fc(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,i){Qs(t,((o,l)=>e[o]=l));for(const o of i)delete e[o]}clone(){return new sn(el(this.value))}}function o0(r){const e=[];return Qs(r.fields,((t,i)=>{const o=new jt([t]);if(fc(i)){const l=o0(i.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new gn(e)}/**
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
 */class Kt{constructor(e,t,i,o,l,h,f){this.key=e,this.documentType=t,this.version=i,this.readTime=o,this.createTime=l,this.data=h,this.documentState=f}static newInvalidDocument(e){return new Kt(e,0,Ce.min(),Ce.min(),Ce.min(),sn.empty(),0)}static newFoundDocument(e,t,i,o){return new Kt(e,1,t,Ce.min(),i,o,0)}static newNoDocument(e,t){return new Kt(e,2,t,Ce.min(),Ce.min(),sn.empty(),0)}static newUnknownDocument(e,t){return new Kt(e,3,t,Ce.min(),Ce.min(),sn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Ce.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=sn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=sn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ce.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Kt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Kt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Pc{constructor(e,t){this.position=e,this.inclusive=t}}function qy(r,e,t){let i=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?i=_e.comparator(_e.fromName(h.referenceValue),t.key):i=jo(h,t.data.field(l.field)),l.dir==="desc"&&(i*=-1),i!==0)break}return i}function Wy(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!mr(r.position[t],e.position[t]))return!1;return!0}/**
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
 */class hl{constructor(e,t="asc"){this.field=e,this.dir=t}}function hA(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
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
 */class a0{}class Tt extends a0{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new fA(e,t,i):t==="array-contains"?new gA(e,i):t==="in"?new yA(e,i):t==="not-in"?new _A(e,i):t==="array-contains-any"?new vA(e,i):new Tt(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new pA(e,i):new mA(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(jo(t,this.value)):t!==null&&zs(this.value)===zs(t)&&this.matchesComparison(jo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Ae(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $n extends a0{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new $n(e,t)}matches(e){return l0(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function l0(r){return r.op==="and"}function u0(r){return dA(r)&&l0(r)}function dA(r){for(const e of r.filters)if(e instanceof $n)return!1;return!0}function yf(r){if(r instanceof Tt)return r.field.canonicalString()+r.op.toString()+Fo(r.value);if(u0(r))return r.filters.map((e=>yf(e))).join(",");{const e=r.filters.map((t=>yf(t))).join(",");return`${r.op}(${e})`}}function c0(r,e){return r instanceof Tt?(function(i,o){return o instanceof Tt&&i.op===o.op&&i.field.isEqual(o.field)&&mr(i.value,o.value)})(r,e):r instanceof $n?(function(i,o){return o instanceof $n&&i.op===o.op&&i.filters.length===o.filters.length?i.filters.reduce(((l,h,f)=>l&&c0(h,o.filters[f])),!0):!1})(r,e):void Ae(19439)}function h0(r){return r instanceof Tt?(function(t){return`${t.field.canonicalString()} ${t.op} ${Fo(t.value)}`})(r):r instanceof $n?(function(t){return t.op.toString()+" {"+t.getFilters().map(h0).join(" ,")+"}"})(r):"Filter"}class fA extends Tt{constructor(e,t,i){super(e,t,i),this.key=_e.fromName(i.referenceValue)}matches(e){const t=_e.comparator(e.key,this.key);return this.matchesComparison(t)}}class pA extends Tt{constructor(e,t){super(e,"in",t),this.keys=d0("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class mA extends Tt{constructor(e,t){super(e,"not-in",t),this.keys=d0("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function d0(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((i=>_e.fromName(i.referenceValue)))}class gA extends Tt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Yf(t)&&ul(t.arrayValue,this.value)}}class yA extends Tt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ul(this.value.arrayValue,t)}}class _A extends Tt{constructor(e,t){super(e,"not-in",t)}matches(e){if(ul(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ul(this.value.arrayValue,t)}}class vA extends Tt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Yf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>ul(this.value.arrayValue,i)))}}/**
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
 */class wA{constructor(e,t=null,i=[],o=[],l=null,h=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=o,this.limit=l,this.startAt=h,this.endAt=f,this.Te=null}}function Ky(r,e=null,t=[],i=[],o=null,l=null,h=null){return new wA(r,e,t,i,o,l,h)}function Xf(r){const e=Pe(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>yf(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(l){return l.field.canonicalString()+l.dir})(i))).join(","),Zc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>Fo(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>Fo(i))).join(",")),e.Te=t}return e.Te}function Zf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!hA(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!c0(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Wy(r.startAt,e.startAt)&&Wy(r.endAt,e.endAt)}function _f(r){return _e.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class Ko{constructor(e,t=null,i=[],o=[],l=null,h="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=o,this.limit=l,this.limitType=h,this.startAt=f,this.endAt=g,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function EA(r,e,t,i,o,l,h,f){return new Ko(r,e,t,i,o,l,h,f)}function th(r){return new Ko(r)}function Gy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function TA(r){return _e.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function f0(r){return r.collectionGroup!==null}function tl(r){const e=Pe(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const l of e.explicitOrderBy)e.Ie.push(l),t.add(l.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new kt(jt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(f=f.add(_.field))}))})),f})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Ie.push(new hl(l,i))})),t.has(jt.keyField().canonicalString())||e.Ie.push(new hl(jt.keyField(),i))}return e.Ie}function dr(r){const e=Pe(r);return e.Ee||(e.Ee=IA(e,tl(r))),e.Ee}function IA(r,e){if(r.limitType==="F")return Ky(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new hl(o.field,l)}));const t=r.endAt?new Pc(r.endAt.position,r.endAt.inclusive):null,i=r.startAt?new Pc(r.startAt.position,r.startAt.inclusive):null;return Ky(r.path,r.collectionGroup,e,r.filters,r.limit,t,i)}}function vf(r,e){const t=r.filters.concat([e]);return new Ko(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function xA(r,e){const t=r.explicitOrderBy.concat([e]);return new Ko(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Nc(r,e,t){return new Ko(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function nh(r,e){return Zf(dr(r),dr(e))&&r.limitType===e.limitType}function p0(r){return`${Xf(dr(r))}|lt:${r.limitType}`}function ko(r){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((o=>h0(o))).join(", ")}]`),Zc(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((o=>Fo(o))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((o=>Fo(o))).join(",")),`Target(${i})`})(dr(r))}; limitType=${r.limitType})`}function rh(r,e){return e.isFoundDocument()&&(function(i,o){const l=o.key.path;return i.collectionGroup!==null?o.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(l):_e.isDocumentKey(i.path)?i.path.isEqual(l):i.path.isImmediateParentOf(l)})(r,e)&&(function(i,o){for(const l of tl(i))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(i,o){for(const l of i.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(i,o){return!(i.startAt&&!(function(h,f,g){const _=qy(h,f,g);return h.inclusive?_<=0:_<0})(i.startAt,tl(i),o)||i.endAt&&!(function(h,f,g){const _=qy(h,f,g);return h.inclusive?_>=0:_>0})(i.endAt,tl(i),o))})(r,e)}function SA(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function m0(r){return(e,t)=>{let i=!1;for(const o of tl(r)){const l=AA(o,e,t);if(l!==0)return l;i=i||o.field.isKeyField()}return 0}}function AA(r,e,t){const i=r.field.isKeyField()?_e.comparator(e.key,t.key):(function(l,h,f){const g=h.data.field(l),_=f.data.field(l);return g!==null&&_!==null?jo(g,_):Ae(42886)})(r.field,e,t);switch(r.dir){case"asc":return i;case"desc":return-1*i;default:return Ae(19790,{direction:r.dir})}}/**
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
 */class Mi{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[o,l]of i)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),o=this.inner[i];if(o===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return i.length===1?delete this.inner[t]:i.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Qs(this.inner,((t,i)=>{for(const[o,l]of i)e(o,l)}))}isEmpty(){return Yv(this.inner)}size(){return this.innerSize}}/**
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
 */const kA=new rt(_e.comparator);function Gr(){return kA}const g0=new rt(_e.comparator);function Qa(...r){let e=g0;for(const t of r)e=e.insert(t.key,t);return e}function y0(r){let e=g0;return r.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function Ai(){return nl()}function _0(){return nl()}function nl(){return new Mi((r=>r.toString()),((r,e)=>r.isEqual(e)))}const CA=new rt(_e.comparator),RA=new kt(_e.comparator);function Ve(...r){let e=RA;for(const t of r)e=e.add(t);return e}const PA=new kt(De);function NA(){return PA}/**
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
 */function sh(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:kc(e)?"-0":e}}function ep(r){return{integerValue:""+r}}function bA(r,e){return nA(e)?ep(e):sh(r,e)}/**
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
 */class ih{constructor(){this._=void 0}}function DA(r,e,t){return r instanceof dl?(function(o,l){const h={fields:{[e0]:{stringValue:Zv},[n0]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&Jf(l)&&(l=eh(l)),l&&(h.fields[t0]=l),{mapValue:h}})(t,e):r instanceof fl?w0(r,e):r instanceof pl?E0(r,e):r instanceof ml?(function(o,l){const h=v0(o,l),f=Vc(h)+Vc(o.Ae);return cl(h)&&cl(o.Ae)?ep(f):sh(o.serializer,f)})(r,e):r instanceof bc?(function(o,l){return Qy(o,l,Math.min)})(r,e):r instanceof Dc?(function(o,l){return Qy(o,l,Math.max)})(r,e):void 0}function VA(r,e,t){return r instanceof fl?w0(r,e):r instanceof pl?E0(r,e):t}function v0(r,e){return r instanceof ml?i0(e)?e:{integerValue:0}:null}class dl extends ih{}class fl extends ih{constructor(e){super(),this.elements=e}}function w0(r,e){const t=T0(e);for(const i of r.elements)t.some((o=>mr(o,i)))||t.push(i);return{arrayValue:{values:t}}}class pl extends ih{constructor(e){super(),this.elements=e}}function E0(r,e){let t=T0(e);for(const i of r.elements)t=t.filter((o=>!mr(o,i)));return{arrayValue:{values:t}}}class tp extends ih{constructor(e,t){super(),this.serializer=e,this.Ae=t}}class ml extends tp{}class bc extends tp{}class Dc extends tp{}function Qy(r,e,t){if(!i0(e))return r.Ae;const i=t(Vc(e),Vc(r.Ae));return cl(e)&&cl(r.Ae)?ep(i):sh(r.serializer,i)}function Vc(r){return mt(r.integerValue||r.doubleValue)}function T0(r){return Yf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class OA{constructor(e,t){this.field=e,this.transform=t}}function LA(r,e){return r.field.isEqual(e.field)&&(function(i,o){return i instanceof fl&&o instanceof fl||i instanceof pl&&o instanceof pl?Mo(i.elements,o.elements,mr):i instanceof ml&&o instanceof ml||i instanceof bc&&o instanceof bc||i instanceof Dc&&o instanceof Dc?mr(i.Ae,o.Ae):i instanceof dl&&o instanceof dl})(r.transform,e.transform)}class MA{constructor(e,t){this.version=e,this.transformResults=t}}class zn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new zn}static exists(e){return new zn(void 0,e)}static updateTime(e){return new zn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function pc(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class oh{}function I0(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new np(r.key,zn.none()):new kl(r.key,r.data,zn.none());{const t=r.data,i=sn.empty();let o=new kt(jt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?i.delete(l):i.set(l,h),o=o.add(l)}return new Js(r.key,i,new gn(o.toArray()),zn.none())}}function jA(r,e,t){r instanceof kl?(function(o,l,h){const f=o.value.clone(),g=Yy(o.fieldTransforms,l,h.transformResults);f.setAll(g),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):r instanceof Js?(function(o,l,h){if(!pc(o.precondition,l))return void l.convertToUnknownDocument(h.version);const f=Yy(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(x0(o)),g.setAll(f),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function rl(r,e,t,i){return r instanceof kl?(function(l,h,f,g){if(!pc(l.precondition,h))return f;const _=l.value.clone(),w=Xy(l.fieldTransforms,g,h);return _.setAll(w),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,i):r instanceof Js?(function(l,h,f,g){if(!pc(l.precondition,h))return f;const _=Xy(l.fieldTransforms,g,h),w=h.data;return w.setAll(x0(l)),w.setAll(_),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),f===null?null:f.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((I=>I.field)))})(r,e,t,i):(function(l,h,f){return pc(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f})(r,e,t)}function FA(r,e){let t=null;for(const i of r.fieldTransforms){const o=e.data.field(i.field),l=v0(i.transform,o||null);l!=null&&(t===null&&(t=sn.empty()),t.set(i.field,l))}return t||null}function Jy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(i,o){return i===void 0&&o===void 0||!(!i||!o)&&Mo(i,o,((l,h)=>LA(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class kl extends oh{constructor(e,t,i,o=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Js extends oh{constructor(e,t,i,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function x0(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=r.data.field(t);e.set(t,i)}})),e}function Yy(r,e,t){const i=new Map;ze(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,f=e.data.field(l.field);i.set(l.field,VA(h,f,t[o]))}return i}function Xy(r,e,t){const i=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);i.set(o.field,DA(l,h,e))}return i}class np extends oh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class UA extends oh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class zA{constructor(e,t,i,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=o}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&jA(l,e,i[o])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=rl(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=rl(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=_0();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let f=this.applyToLocalView(h,l.mutatedFields);f=t.has(o.key)?null:f;const g=I0(h,f);g!==null&&i.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(Ce.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Ve())}isEqual(e){return this.batchId===e.batchId&&Mo(this.mutations,e.mutations,((t,i)=>Jy(t,i)))&&Mo(this.baseMutations,e.baseMutations,((t,i)=>Jy(t,i)))}}class rp{constructor(e,t,i,o){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=o}static from(e,t,i){ze(e.mutations.length===i.length,58842,{me:e.mutations.length,fe:i.length});let o=(function(){return CA})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,i[h].version);return new rp(e,t,i,o)}}/**
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
 */class BA{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class $A{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var Et,Me;function HA(r){switch(r){case q.OK:return Ae(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return Ae(15467,{code:r})}}function S0(r){if(r===void 0)return Kr("GRPC error has no .code"),q.UNKNOWN;switch(r){case Et.OK:return q.OK;case Et.CANCELLED:return q.CANCELLED;case Et.UNKNOWN:return q.UNKNOWN;case Et.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case Et.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case Et.INTERNAL:return q.INTERNAL;case Et.UNAVAILABLE:return q.UNAVAILABLE;case Et.UNAUTHENTICATED:return q.UNAUTHENTICATED;case Et.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case Et.NOT_FOUND:return q.NOT_FOUND;case Et.ALREADY_EXISTS:return q.ALREADY_EXISTS;case Et.PERMISSION_DENIED:return q.PERMISSION_DENIED;case Et.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case Et.ABORTED:return q.ABORTED;case Et.OUT_OF_RANGE:return q.OUT_OF_RANGE;case Et.UNIMPLEMENTED:return q.UNIMPLEMENTED;case Et.DATA_LOSS:return q.DATA_LOSS;default:return Ae(39323,{code:r})}}(Me=Et||(Et={}))[Me.OK=0]="OK",Me[Me.CANCELLED=1]="CANCELLED",Me[Me.UNKNOWN=2]="UNKNOWN",Me[Me.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Me[Me.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Me[Me.NOT_FOUND=5]="NOT_FOUND",Me[Me.ALREADY_EXISTS=6]="ALREADY_EXISTS",Me[Me.PERMISSION_DENIED=7]="PERMISSION_DENIED",Me[Me.UNAUTHENTICATED=16]="UNAUTHENTICATED",Me[Me.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Me[Me.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Me[Me.ABORTED=10]="ABORTED",Me[Me.OUT_OF_RANGE=11]="OUT_OF_RANGE",Me[Me.UNIMPLEMENTED=12]="UNIMPLEMENTED",Me[Me.INTERNAL=13]="INTERNAL",Me[Me.UNAVAILABLE=14]="UNAVAILABLE",Me[Me.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function qA(){return new TextEncoder}/**
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
 */const WA=new Ls([4294967295,4294967295],0);function Zy(r){const e=qA().encode(r),t=new Uv;return t.update(e),new Uint8Array(t.digest())}function e_(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new Ls([t,i],0),new Ls([o,l],0)]}class sp{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new Ja(`Invalid padding: ${t}`);if(i<0)throw new Ja(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new Ja(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new Ja(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Ls.fromNumber(this.ge)}ye(e,t,i){let o=e.add(t.multiply(Ls.fromNumber(i)));return o.compare(WA)===1&&(o=new Ls([o.getBits(0),o.getBits(1)],0)),o.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Zy(e),[i,o]=e_(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);if(!this.we(h))return!1}return!0}static create(e,t,i){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new sp(l,o,t);return i.forEach((f=>h.insert(f))),h}insert(e){if(this.ge===0)return;const t=Zy(e),[i,o]=e_(t);for(let l=0;l<this.hashCount;l++){const h=this.ye(i,o,l);this.Se(h)}}Se(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class Ja extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Cl{constructor(e,t,i,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const o=new Map;return o.set(e,Rl.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new Cl(Ce.min(),o,new rt(De),Gr(),Ve())}}class Rl{constructor(e,t,i,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new Rl(i,t,Ve(),Ve(),Ve())}}/**
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
 */class mc{constructor(e,t,i,o){this.be=e,this.removedTargetIds=t,this.key=i,this.De=o}}class A0{constructor(e,t){this.targetId=e,this.Ce=t}}class k0{constructor(e,t,i=Ft.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=o}}class t_{constructor(e){this.targetId=e,this.ve=0,this.Fe=n_(),this.Me=Ft.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=Ve(),t=Ve(),i=Ve();return this.Fe.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:i=i.add(o);break;default:Ae(38017,{changeType:l})}})),new Rl(this.Me,this.xe,e,t,i)}qe(){this.Oe=!1,this.Fe=n_()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,ze(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const $a="WatchChangeAggregator";class KA{constructor(e){this.Ge=e,this.ze=new Map,this.je=Gr(),this.Je=tc(),this.He=tc(),this.Ze=new rt(De)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const i=this.ze.get(t);if(i)switch(e.state){case 0:this.nt(t)&&i.Le(e.resumeToken);break;case 1:i.We(),i.Ne||i.qe(),i.Le(e.resumeToken);break;case 2:i.We(),i.Ne||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Qe(),i.Le(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Le(e.resumeToken));break;default:Ae(56790,{state:e.state})}else re($a,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((i,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,i=e.Ce.count,o=this.st(t);if(o){const l=o.target;if(_f(l))if(i===0){const h=new _e(l.path);this.et(t,h,Kt.newNoDocument(h,Ce.min()))}else ze(i===1,20013,{expectedCount:i});else{const h=this.ot(t);if(h!==i){const f=this._t(e),g=f?this.ut(f,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,_)}}}}}_t(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:o=0},hashCount:l=0}=t;let h,f;try{h=Us(i).toUint8Array()}catch(g){if(g instanceof Xv)return Vi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{f=new sp(h,o,l)}catch(g){return Vi(g instanceof Ja?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return f.ge===0?null:f}ut(e,t,i){return t.Ce.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.Ge.getRemoteKeysForTarget(t);let o=0;return i.forEach((l=>{const h=this.Ge.lt(),f=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(f)||(this.et(t,l,null),o++)})),o}Pt(e){const t=new Map;this.ze.forEach(((l,h)=>{const f=this.st(h);if(f){if(l.current&&_f(f.target)){const g=new _e(f.target.path);this.Tt(g).has(h)||this.It(h,g)||this.et(h,g,Kt.newNoDocument(g,e))}l.Be&&(t.set(h,l.ke()),l.qe())}}));let i=Ve();this.He.forEach(((l,h)=>{let f=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)})),f&&(i=i.add(l))})),this.je.forEach(((l,h)=>h.setReadTime(e)));const o=new Cl(e,t,this.Ze,this.je,i);return this.je=Gr(),this.Je=tc(),this.He=tc(),this.Ze=new rt(De),o}Ye(e,t){const i=this.ze.get(e);if(!i||!this.nt(e))return void re($a,`addDocumentToTarget received document for unknown inactive target (${e})`);const o=this.It(e,t.key)?2:0;i.Ke(t.key,o),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Tt(t.key).add(e)),this.He=this.He.insert(t.key,this.Et(t.key).add(e))}et(e,t,i){const o=this.ze.get(e);o&&this.nt(e)?(this.It(e,t)?o.Ke(t,1):o.Ue(t),this.He=this.He.insert(t,this.Et(t).delete(e)),this.He=this.He.insert(t,this.Et(t).add(e)),i&&(this.je=this.je.insert(t,i))):re($a,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ze.delete(e)}ot(e){const t=this.ze.get(e);if(!t)return 0;const i=t.ke();return this.Ge.getRemoteKeysForTarget(e).size+i.addedDocuments.size-i.removedDocuments.size}$e(e){let t=this.ze.get(e);t||(re($a,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new t_(e),this.ze.set(e,t)),t.$e()}Et(e){let t=this.He.get(e);return t||(t=new kt(De),this.He=this.He.insert(e,t)),t}Tt(e){let t=this.Je.get(e);return t||(t=new kt(De),this.Je=this.Je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||re($a,"Detected inactive target",e),t}st(e){const t=this.ze.get(e);return t===void 0||t.Ne?null:this.Ge.Rt(e)}rt(e){this.ze.set(e,new t_(e)),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function tc(){return new rt(_e.comparator)}function n_(){return new rt(_e.comparator)}const GA={asc:"ASCENDING",desc:"DESCENDING"},QA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},JA={and:"AND",or:"OR"};class YA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function wf(r,e){return r.useProto3Json||Zc(e)?e:{value:e}}function Oc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function C0(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function XA(r,e){return Oc(r,e.toTimestamp())}function fr(r){return ze(!!r,49232),Ce.fromTimestamp((function(t){const i=Fs(t);return new Ze(i.seconds,i.nanos)})(r))}function ip(r,e){return Ef(r,e).canonicalString()}function Ef(r,e){const t=(function(o){return new Qe(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function R0(r){const e=Qe.fromString(r);return ze(V0(e),10190,{key:e.toString()}),e}function Tf(r,e){return ip(r.databaseId,e.path)}function Xd(r,e){const t=R0(e);if(t.get(1)!==r.databaseId.projectId)throw new se(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new se(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new _e(N0(t))}function P0(r,e){return ip(r.databaseId,e)}function ZA(r){const e=R0(r);return e.length===4?Qe.emptyPath():N0(e)}function If(r){return new Qe(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function N0(r){return ze(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function r_(r,e,t){return{name:Tf(r,e),fields:t.value.mapValue.fields}}function ek(r,e){let t;if("targetChange"in e){e.targetChange;const i=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:Ae(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,w){return _.useProto3Json?(ze(w===void 0||typeof w=="string",58123),Ft.fromBase64String(w||"")):(ze(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Ft.fromUint8Array(w||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,f=h&&(function(_){const w=_.code===void 0?q.UNKNOWN:S0(_.code);return new se(w,_.message||"")})(h);t=new k0(i,o,l,f||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const o=Xd(r,i.document.name),l=fr(i.document.updateTime),h=i.document.createTime?fr(i.document.createTime):Ce.min(),f=new sn({mapValue:{fields:i.document.fields}}),g=Kt.newFoundDocument(o,l,h,f),_=i.targetIds||[],w=i.removedTargetIds||[];t=new mc(_,w,g.key,g)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const o=Xd(r,i.document),l=i.readTime?fr(i.readTime):Ce.min(),h=Kt.newNoDocument(o,l),f=i.removedTargetIds||[];t=new mc([],f,h.key,h)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const o=Xd(r,i.document),l=i.removedTargetIds||[];t=new mc([],l,o,null)}else{if(!("filter"in e))return Ae(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:o=0,unchangedNames:l}=i,h=new $A(o,l),f=i.targetId;t=new A0(f,h)}}return t}function tk(r,e){let t;if(e instanceof kl)t={update:r_(r,e.key,e.value)};else if(e instanceof np)t={delete:Tf(r,e.key)};else if(e instanceof Js)t={update:r_(r,e.key,e.data),updateMask:ck(e.fieldMask)};else{if(!(e instanceof UA))return Ae(16599,{Vt:e.type});t={verify:Tf(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(l,h){const f=h.transform;if(f instanceof dl)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof fl)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof pl)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof ml)return{fieldPath:h.field.canonicalString(),increment:f.Ae};if(f instanceof bc)return{fieldPath:h.field.canonicalString(),minimum:f.Ae};if(f instanceof Dc)return{fieldPath:h.field.canonicalString(),maximum:f.Ae};throw Ae(20930,{transform:h.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:XA(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:Ae(27497)})(r,e.precondition)),t}function nk(r,e){return r&&r.length>0?(ze(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?fr(o.updateTime):fr(l);return h.isEqual(Ce.min())&&(h=fr(l)),new MA(h,o.transformResults||[])})(t,e)))):[]}function rk(r,e){return{documents:[P0(r,e.path)]}}function sk(r,e){const t={structuredQuery:{}},i=e.path;let o;e.collectionGroup!==null?(o=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=P0(r,o);const l=(function(_){if(_.length!==0)return D0($n.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((w=>(function(A){return{field:Co(A.field),direction:ak(A.dir)}})(w)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const f=wf(r,e.limit);return f!==null&&(t.structuredQuery.limit=f),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{dt:t,parent:o}}function ik(r){let e=ZA(r.parent);const t=r.structuredQuery,i=t.from?t.from.length:0;let o=null;if(i>0){ze(i===1,65062);const w=t.from[0];w.allDescendants?o=w.collectionId:e=e.child(w.collectionId)}let l=[];t.where&&(l=(function(I){const A=b0(I);return A instanceof $n&&u0(A)?A.getFilters():[A]})(t.where));let h=[];t.orderBy&&(h=(function(I){return I.map((A=>(function(W){return new hl(Ro(W.field),(function($){switch($){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(W.direction))})(A)))})(t.orderBy));let f=null;t.limit&&(f=(function(I){let A;return A=typeof I=="object"?I.value:I,Zc(A)?null:A})(t.limit));let g=null;t.startAt&&(g=(function(I){const A=!!I.before,j=I.values||[];return new Pc(j,A)})(t.startAt));let _=null;return t.endAt&&(_=(function(I){const A=!I.before,j=I.values||[];return new Pc(j,A)})(t.endAt)),EA(e,o,h,l,f,"F",g,_)}function ok(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Ae(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function b0(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=Ro(t.unaryFilter.field);return Tt.create(i,"==",{doubleValue:NaN});case"IS_NULL":const o=Ro(t.unaryFilter.field);return Tt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=Ro(t.unaryFilter.field);return Tt.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=Ro(t.unaryFilter.field);return Tt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Ae(61313);default:return Ae(60726)}})(r):r.fieldFilter!==void 0?(function(t){return Tt.create(Ro(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Ae(58110);default:return Ae(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return $n.create(t.compositeFilter.filters.map((i=>b0(i))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return Ae(1026)}})(t.compositeFilter.op))})(r):Ae(30097,{filter:r})}function ak(r){return GA[r]}function lk(r){return QA[r]}function uk(r){return JA[r]}function Co(r){return{fieldPath:r.canonicalString()}}function Ro(r){return jt.fromServerFormat(r.fieldPath)}function D0(r){return r instanceof Tt?(function(t){if(t.op==="=="){if(Hy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NAN"}};if($y(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Hy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NAN"}};if($y(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Co(t.field),op:lk(t.op),value:t.value}}})(r):r instanceof $n?(function(t){const i=t.getFilters().map((o=>D0(o)));return i.length===1?i[0]:{compositeFilter:{op:uk(t.op),filters:i}}})(r):Ae(54877,{filter:r})}function ck(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function V0(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function O0(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
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
 */class zr{constructor(e,t,i,o,l=Ce.min(),h=Ce.min(),f=Ft.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=g}withSequenceNumber(e){return new zr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new zr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new zr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new zr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class hk{constructor(e){this.gt=e}}function dk(r){const e=ik({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Nc(e,e.limit,"L"):e}/**
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
 */class fk{constructor(){this.Sn=new pk}addToCollectionParentIndex(e,t){return this.Sn.add(t),G.resolve()}getCollectionParents(e,t){return G.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return G.resolve()}deleteFieldIndex(e,t){return G.resolve()}deleteAllFieldIndexes(e){return G.resolve()}createTargetIndexes(e,t){return G.resolve()}getDocumentsMatchingTarget(e,t){return G.resolve(null)}getIndexType(e,t){return G.resolve(0)}getFieldIndexes(e,t){return G.resolve([])}getNextCollectionGroupToUpdate(e){return G.resolve(null)}getMinOffset(e,t){return G.resolve(js.min())}getMinOffsetFromCollectionGroup(e,t){return G.resolve(js.min())}updateCollectionGroup(e,t,i){return G.resolve()}updateIndexEntries(e,t){return G.resolve()}}class pk{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t]||new kt(Qe.comparator),l=!o.has(i);return this.index[t]=o.add(i),l}has(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t];return o&&o.has(i)}getEntries(e){return(this.index[e]||new kt(Qe.comparator)).toArray()}}/**
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
 */const s_={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},L0=41943040;class rn{static withCacheSize(e){return new rn(e,rn.DEFAULT_COLLECTION_PERCENTILE,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
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
 */rn.DEFAULT_COLLECTION_PERCENTILE=10,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,rn.DEFAULT=new rn(L0,rn.DEFAULT_COLLECTION_PERCENTILE,rn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),rn.DISABLED=new rn(-1,0,0);/**
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
 */class Bs{constructor(e){this.ir=e}next(){return this.ir+=2,this.ir}static sr(){return new Bs(0)}static _r(){return new Bs(-1)}}/**
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
 */const i_="LruGarbageCollector",mk=1048576;function o_([r,e],[t,i]){const o=De(r,t);return o===0?De(e,i):o}class gk{constructor(e){this.hr=e,this.buffer=new kt(o_),this.Pr=0}Tr(){return++this.Pr}Ir(e){const t=[e,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();o_(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class yk{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(e){re(i_,`Garbage collection scheduled in ${e}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Wo(t)?re(i_,"Ignoring IndexedDB error during garbage collection: ",t):await qo(t)}await this.Rr(3e5)}))}}class _k{constructor(e,t){this.Ar=e,this.params=t}calculateTargetCount(e,t){return this.Ar.Vr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return G.resolve(Xc.ce);const i=new gk(t);return this.Ar.forEachTarget(e,(o=>i.Ir(o.sequenceNumber))).next((()=>this.Ar.dr(e,(o=>i.Ir(o))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Ar.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Ar.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(re("LruGarbageCollector","Garbage collection skipped; disabled"),G.resolve(s_)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(re("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),s_):this.mr(e,t)))}getCacheSize(e){return this.Ar.getCacheSize(e)}mr(e,t){let i,o,l,h,f,g,_;const w=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((I=>(I>this.params.maximumSequenceNumbersToCollect?(re("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${I}`),o=this.params.maximumSequenceNumbersToCollect):o=I,h=Date.now(),this.nthSequenceNumber(e,o)))).next((I=>(i=I,f=Date.now(),this.removeTargets(e,i,t)))).next((I=>(l=I,g=Date.now(),this.removeOrphanedDocuments(e,i)))).next((I=>(_=Date.now(),Ao()<=Oe.DEBUG&&re("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${l} targets in `+(g-f)+`ms
	Removed ${I} documents in `+(_-g)+`ms
Total Duration: ${_-w}ms`),G.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:I}))))}}function vk(r,e){return new _k(r,e)}/**
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
 */class wk{constructor(){this.changes=new Mi((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Kt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?G.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Ek{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class Tk{constructor(e,t,i,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=o}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(i=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(i!==null&&rl(i.mutation,o,gn.empty(),Ze.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,Ve()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=Ve()){const o=Ai();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,i).next((l=>{let h=Qa();return l.forEach(((f,g)=>{h=h.insert(f,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const i=Ai();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,Ve())))}populateOverlays(e,t,i){const o=[];return i.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,f)=>{t.set(h,f)}))}))}computeViews(e,t,i,o){let l=Gr();const h=nl(),f=(function(){return nl()})();return t.forEach(((g,_)=>{const w=i.get(_.key);o.has(_.key)&&(w===void 0||w.mutation instanceof Js)?l=l.insert(_.key,_):w!==void 0?(h.set(_.key,w.mutation.getFieldMask()),rl(w.mutation,_,w.mutation.getFieldMask(),Ze.now())):h.set(_.key,gn.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,w)=>h.set(_,w))),t.forEach(((_,w)=>f.set(_,new Ek(w,h.get(_)??null)))),f)))}recalculateAndSaveOverlays(e,t){const i=nl();let o=new rt(((h,f)=>h-f)),l=Ve();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const f of h)f.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let w=i.get(g)||gn.empty();w=f.applyToLocalView(_,w),i.set(g,w);const I=(o.get(f.batchId)||Ve()).add(g);o=o.insert(f.batchId,I)}))})).next((()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const g=f.getNext(),_=g.key,w=g.value,I=_0();w.forEach((A=>{if(!l.has(A)){const j=I0(t.get(A),i.get(A));j!==null&&I.set(A,j),l=l.add(A)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,I))}return G.waitFor(h)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,o){return TA(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):f0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,o):this.getDocumentsMatchingCollectionQuery(e,t,i,o)}getNextDocuments(e,t,i,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,o-l.size):G.resolve(Ai());let f=ol,g=l;return h.next((_=>G.forEach(_,((w,I)=>(f<I.largestBatchId&&(f=I.largestBatchId),l.get(w)?G.resolve():this.remoteDocumentCache.getEntry(e,w).next((A=>{g=g.insert(w,A)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,Ve()))).next((w=>({batchId:f,changes:y0(w)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new _e(t)).next((i=>{let o=Qa();return i.isFoundDocument()&&(o=o.insert(i.key,i)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,o){const l=t.collectionGroup;let h=Qa();return this.indexManager.getCollectionParents(e,l).next((f=>G.forEach(f,(g=>{const _=(function(I,A){return new Ko(A,null,I.explicitOrderBy.slice(),I.filters.slice(),I.limit,I.limitType,I.startAt,I.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,i,o).next((w=>{w.forEach(((I,A)=>{h=h.insert(I,A)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,i,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,l,o)))).next((h=>{l.forEach(((g,_)=>{const w=_.getKey();h.get(w)===null&&(h=h.insert(w,Kt.newInvalidDocument(w)))}));let f=Qa();return h.forEach(((g,_)=>{const w=l.get(g);w!==void 0&&rl(w.mutation,_,gn.empty(),Ze.now()),rh(t,_)&&(f=f.insert(g,_))})),f}))}}/**
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
 */class Ik{constructor(e){this.serializer=e,this.Or=new Map,this.Nr=new Map}getBundleMetadata(e,t){return G.resolve(this.Or.get(t))}saveBundleMetadata(e,t){return this.Or.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:fr(o.createTime)}})(t)),G.resolve()}getNamedQuery(e,t){return G.resolve(this.Nr.get(t))}saveNamedQuery(e,t){return this.Nr.set(t.name,(function(o){return{name:o.name,query:dk(o.bundledQuery),readTime:fr(o.readTime)}})(t)),G.resolve()}}/**
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
 */class xk{constructor(){this.overlays=new rt(_e.comparator),this.Br=new Map}getOverlay(e,t){return G.resolve(this.overlays.get(t))}getOverlays(e,t){const i=Ai();return G.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&i.set(o,l)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((o,l)=>{this.wt(e,t,l)})),G.resolve()}removeOverlaysForBatchId(e,t,i){const o=this.Br.get(i);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.Br.delete(i)),G.resolve()}getOverlaysForCollection(e,t,i){const o=Ai(),l=t.length+1,h=new _e(t.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const g=f.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>i&&o.set(g.getKey(),g)}return G.resolve(o)}getOverlaysForCollectionGroup(e,t,i,o){let l=new rt(((_,w)=>_-w));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>i){let w=l.get(_.largestBatchId);w===null&&(w=Ai(),l=l.insert(_.largestBatchId,w)),w.set(_.getKey(),_)}}const f=Ai(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,w)=>f.set(_,w))),!(f.size()>=o)););return G.resolve(f)}wt(e,t,i){const o=this.overlays.get(i.key);if(o!==null){const h=this.Br.get(o.largestBatchId).delete(i.key);this.Br.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(i.key,new BA(t,i));let l=this.Br.get(t);l===void 0&&(l=Ve(),this.Br.set(t,l)),this.Br.set(t,l.add(i.key))}}/**
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
 */class Sk{constructor(){this.sessionToken=Ft.EMPTY_BYTE_STRING}getSessionToken(e){return G.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,G.resolve()}}/**
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
 */class op{constructor(){this.Lr=new kt(bt.kr),this.qr=new kt(bt.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(e,t){const i=new bt(e,t);this.Lr=this.Lr.add(i),this.qr=this.qr.add(i)}Ur(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.$r(new bt(e,t))}Wr(e,t){e.forEach((i=>this.removeReference(i,t)))}Qr(e){const t=new _e(new Qe([])),i=new bt(t,e),o=new bt(t,e+1),l=[];return this.qr.forEachInRange([i,o],(h=>{this.$r(h),l.push(h.key)})),l}Gr(){this.Lr.forEach((e=>this.$r(e)))}$r(e){this.Lr=this.Lr.delete(e),this.qr=this.qr.delete(e)}zr(e){const t=new _e(new Qe([])),i=new bt(t,e),o=new bt(t,e+1);let l=Ve();return this.qr.forEachInRange([i,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new bt(e,0),i=this.Lr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class bt{constructor(e,t){this.key=e,this.jr=t}static kr(e,t){return _e.comparator(e.key,t.key)||De(e.jr,t.jr)}static Kr(e,t){return De(e.jr,t.jr)||_e.comparator(e.key,t.key)}}/**
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
 */class Ak{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Xn=1,this.Jr=new kt(bt.kr)}checkEmpty(e){return G.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,o){const l=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new zA(l,t,i,o);this.mutationQueue.push(h);for(const f of o)this.Jr=this.Jr.add(new bt(f.key,l)),this.indexManager.addToCollectionParentIndex(e,f.key.path.popLast());return G.resolve(h)}lookupMutationBatch(e,t){return G.resolve(this.Hr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,o=this.Zr(i),l=o<0?0:o;return G.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return G.resolve(this.mutationQueue.length===0?Qf:this.Xn-1)}getAllMutationBatches(e){return G.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new bt(t,0),o=new bt(t,Number.POSITIVE_INFINITY),l=[];return this.Jr.forEachInRange([i,o],(h=>{const f=this.Hr(h.jr);l.push(f)})),G.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new kt(De);return t.forEach((o=>{const l=new bt(o,0),h=new bt(o,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([l,h],(f=>{i=i.add(f.jr)}))})),G.resolve(this.Xr(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,o=i.length+1;let l=i;_e.isDocumentKey(l)||(l=l.child(""));const h=new bt(new _e(l),0);let f=new kt(De);return this.Jr.forEachWhile((g=>{const _=g.key.path;return!!i.isPrefixOf(_)&&(_.length===o&&(f=f.add(g.jr)),!0)}),h),G.resolve(this.Xr(f))}Xr(e){const t=[];return e.forEach((i=>{const o=this.Hr(i);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){ze(this.Yr(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Jr;return G.forEach(t.mutations,(o=>{const l=new bt(o.key,t.batchId);return i=i.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Jr=i}))}tr(e){}containsKey(e,t){const i=new bt(t,0),o=this.Jr.firstAfterOrEqual(i);return G.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,G.resolve()}Yr(e,t){return this.Zr(e)}Zr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Hr(e){const t=this.Zr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class kk{constructor(e){this.ei=e,this.docs=(function(){return new rt(_e.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,o=this.docs.get(i),l=o?o.size:0,h=this.ei(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return G.resolve(i?i.document.mutableCopy():Kt.newInvalidDocument(t))}getEntries(e,t){let i=Gr();return t.forEach((o=>{const l=this.docs.get(o);i=i.insert(o,l?l.document.mutableCopy():Kt.newInvalidDocument(o))})),G.resolve(i)}getDocumentsMatchingQuery(e,t,i,o){let l=Gr();const h=t.path,f=new _e(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(f);for(;g.hasNext();){const{key:_,value:{document:w}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||XS(YS(w),i)<=0||(o.has(w.key)||rh(t,w))&&(l=l.insert(w.key,w.mutableCopy()))}return G.resolve(l)}getAllFromCollectionGroup(e,t,i,o){Ae(9500)}ti(e,t){return G.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new Ck(this)}getSize(e){return G.resolve(this.size)}}class Ck extends wk{constructor(e){super(),this.Fr=e}applyChanges(e){const t=[];return this.changes.forEach(((i,o)=>{o.isValidDocument()?t.push(this.Fr.addEntry(e,o)):this.Fr.removeEntry(i)})),G.waitFor(t)}getFromCache(e,t){return this.Fr.getEntry(e,t)}getAllFromCache(e,t){return this.Fr.getEntries(e,t)}}/**
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
 */class Rk{constructor(e){this.persistence=e,this.ni=new Mi((t=>Xf(t)),Zf),this.lastRemoteSnapshotVersion=Ce.min(),this.highestTargetId=0,this.ri=0,this.ii=new op,this.targetCount=0,this.si=Bs.sr()}forEachTarget(e,t){return this.ni.forEach(((i,o)=>t(o))),G.resolve()}getLastRemoteSnapshotVersion(e){return G.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return G.resolve(this.ri)}allocateTargetId(e){return this.highestTargetId=this.si.next(),G.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.ri&&(this.ri=t),G.resolve()}cr(e){this.ni.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.si=new Bs(t),this.highestTargetId=t),e.sequenceNumber>this.ri&&(this.ri=e.sequenceNumber)}addTargetData(e,t){return this.cr(t),this.targetCount+=1,G.resolve()}updateTargetData(e,t){return this.cr(t),G.resolve()}removeTargetData(e,t){return this.ni.delete(t.target),this.ii.Qr(t.targetId),this.targetCount-=1,G.resolve()}removeTargets(e,t,i){let o=0;const l=[];return this.ni.forEach(((h,f)=>{f.sequenceNumber<=t&&i.get(f.targetId)===null&&(this.ni.delete(h),l.push(this.removeMatchingKeysForTargetId(e,f.targetId)),o++)})),G.waitFor(l).next((()=>o))}getTargetCount(e){return G.resolve(this.targetCount)}getTargetData(e,t){const i=this.ni.get(t)||null;return G.resolve(i)}addMatchingKeys(e,t,i){return this.ii.Ur(t,i),G.resolve()}removeMatchingKeys(e,t,i){this.ii.Wr(t,i);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),G.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.ii.Qr(t),G.resolve()}getMatchingKeysForTargetId(e,t){const i=this.ii.zr(t);return G.resolve(i)}containsKey(e,t){return G.resolve(this.ii.containsKey(t))}}/**
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
 */class M0{constructor(e,t){this.oi={},this.overlays={},this._i=new Xc(0),this.ai=!1,this.ai=!0,this.ui=new Sk,this.referenceDelegate=e(this),this.ci=new Rk(this),this.indexManager=new fk,this.remoteDocumentCache=(function(o){return new kk(o)})((i=>this.referenceDelegate.li(i))),this.serializer=new hk(t),this.hi=new Ik(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new xk,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.oi[e.toKey()];return i||(i=new Ak(t,this.referenceDelegate),this.oi[e.toKey()]=i),i}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(e,t,i){re("MemoryPersistence","Starting transaction:",e);const o=new Pk(this._i.next());return this.referenceDelegate.Pi(),i(o).next((l=>this.referenceDelegate.Ti(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ii(e,t){return G.or(Object.values(this.oi).map((i=>()=>i.containsKey(e,t))))}}class Pk extends eA{constructor(e){super(),this.currentSequenceNumber=e}}class ap{constructor(e){this.persistence=e,this.Ei=new op,this.Ri=null}static Ai(e){return new ap(e)}get Vi(){if(this.Ri)return this.Ri;throw Ae(60996)}addReference(e,t,i){return this.Ei.addReference(i,t),this.Vi.delete(i.toString()),G.resolve()}removeReference(e,t,i){return this.Ei.removeReference(i,t),this.Vi.add(i.toString()),G.resolve()}markPotentiallyOrphaned(e,t){return this.Vi.add(t.toString()),G.resolve()}removeTarget(e,t){this.Ei.Qr(t.targetId).forEach((o=>this.Vi.add(o.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.Vi.add(l.toString())))})).next((()=>i.removeTargetData(e,t)))}Pi(){this.Ri=new Set}Ti(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return G.forEach(this.Vi,(i=>{const o=_e.fromPath(i);return this.di(e,o).next((l=>{l||t.removeEntry(o,Ce.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.di(e,t).next((i=>{i?this.Vi.delete(t.toString()):this.Vi.add(t.toString())}))}li(e){return 0}di(e,t){return G.or([()=>G.resolve(this.Ei.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class Lc{constructor(e,t){this.persistence=e,this.mi=new Mi((i=>rA(i.path)),((i,o)=>i.isEqual(o))),this.garbageCollector=vk(this,t)}static Ai(e,t){return new Lc(e,t)}Pi(){}Ti(e){return G.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Vr(e){const t=this.gr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((o=>i+o))))}gr(e){let t=0;return this.dr(e,(i=>{t++})).next((()=>t))}dr(e,t){return G.forEach(this.mi,((i,o)=>this.yr(e,i,o).next((l=>l?G.resolve():t(o)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ti(e,(h=>this.yr(e,h,t).next((f=>{f||(i++,l.removeEntry(h,Ce.min()))})))).next((()=>l.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.mi.set(t,e.currentSequenceNumber),G.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),G.resolve()}removeReference(e,t,i){return this.mi.set(i,e.currentSequenceNumber),G.resolve()}updateLimboDocument(e,t){return this.mi.set(t,e.currentSequenceNumber),G.resolve()}li(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=dc(e.data.value)),t}yr(e,t,i){return G.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.mi.get(t);return G.resolve(o!==void 0&&o>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class lp{constructor(e,t,i,o){this.targetId=e,this.fromCache=t,this.Ps=i,this.Ts=o}static Is(e,t){let i=Ve(),o=Ve();for(const l of t.docChanges)switch(l.type){case 0:i=i.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new lp(e,t.fromCache,i,o)}}/**
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
 */class Nk{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class bk{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return eI()?8:tA(Gt())>0?6:4})()}initialize(e,t){this.ds=e,this.indexManager=t,this.Es=!0}getDocumentsMatchingQuery(e,t,i,o){const l={result:null};return this.fs(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.gs(e,t,o,i).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new Nk;return this.ps(e,t,h).next((f=>{if(l.result=f,this.Rs)return this.ys(e,t,h,f.size)}))})).next((()=>l.result))}ys(e,t,i,o){return i.documentReadCount<this.As?(Ao()<=Oe.DEBUG&&re("QueryEngine","SDK will not create cache indexes for query:",ko(t),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),G.resolve()):(Ao()<=Oe.DEBUG&&re("QueryEngine","Query:",ko(t),"scans",i.documentReadCount,"local documents and returns",o,"documents as results."),i.documentReadCount>this.Vs*o?(Ao()<=Oe.DEBUG&&re("QueryEngine","The SDK decides to create cache indexes for query:",ko(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,dr(t))):G.resolve())}fs(e,t){if(Gy(t))return G.resolve(null);let i=dr(t);return this.indexManager.getIndexType(e,i).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=Nc(t,null,"F"),i=dr(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((l=>{const h=Ve(...l);return this.ds.getDocuments(e,h).next((f=>this.indexManager.getMinOffset(e,i).next((g=>{const _=this.ws(t,f);return this.Ss(t,_,h,g.readTime)?this.fs(e,Nc(t,null,"F")):this.bs(e,_,t,g)}))))})))))}gs(e,t,i,o){return Gy(t)||o.isEqual(Ce.min())?G.resolve(null):this.ds.getDocuments(e,i).next((l=>{const h=this.ws(t,l);return this.Ss(t,h,i,o)?G.resolve(null):(Ao()<=Oe.DEBUG&&re("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),ko(t)),this.bs(e,h,t,JS(o,ol)).next((f=>f)))}))}ws(e,t){let i=new kt(m0(e));return t.forEach(((o,l)=>{rh(e,l)&&(i=i.add(l))})),i}Ss(e,t,i,o){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ps(e,t,i){return Ao()<=Oe.DEBUG&&re("QueryEngine","Using full collection scan to execute query:",ko(t)),this.ds.getDocumentsMatchingQuery(e,t,js.min(),i)}bs(e,t,i,o){return this.ds.getDocumentsMatchingQuery(e,i,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
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
 */const up="LocalStore",Dk=3e8;class Vk{constructor(e,t,i,o){this.persistence=e,this.Ds=t,this.serializer=o,this.Cs=new rt(De),this.vs=new Mi((l=>Xf(l)),Zf),this.Fs=new Map,this.Ms=e.getRemoteDocumentCache(),this.ci=e.getTargetCache(),this.hi=e.getBundleCache(),this.xs(i)}xs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Tk(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Cs)))}}function Ok(r,e,t,i){return new Vk(r,e,t,i)}async function j0(r,e){const t=Pe(r);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let o;return t.mutationQueue.getAllMutationBatches(i).next((l=>(o=l,t.xs(e),t.mutationQueue.getAllMutationBatches(i)))).next((l=>{const h=[],f=[];let g=Ve();for(const _ of o){h.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}for(const _ of l){f.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}return t.localDocuments.getDocuments(i,g).next((_=>({Os:_,removedBatchIds:h,addedBatchIds:f})))}))}))}function Lk(r,e){const t=Pe(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const o=e.batch.keys(),l=t.Ms.newChangeBuffer({trackRemovals:!0});return(function(f,g,_,w){const I=_.batch,A=I.keys();let j=G.resolve();return A.forEach((W=>{j=j.next((()=>w.getEntry(g,W))).next((K=>{const $=_.docVersions.get(W);ze($!==null,48541),K.version.compareTo($)<0&&(I.applyToRemoteDocument(K,_),K.isValidDocument()&&(K.setReadTime(_.commitVersion),w.addEntry(K)))}))})),j.next((()=>f.mutationQueue.removeMutationBatch(g,I)))})(t,i,e,l).next((()=>l.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(f){let g=Ve();for(let _=0;_<f.mutationResults.length;++_)f.mutationResults[_].transformResults.length>0&&(g=g.add(f.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(i,o)))}))}function F0(r){const e=Pe(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ci.getLastRemoteSnapshotVersion(t)))}function Mk(r,e){const t=Pe(r),i=e.snapshotVersion;let o=t.Cs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Ms.newChangeBuffer({trackRemovals:!0});o=t.Cs;const f=[];e.targetChanges.forEach(((w,I)=>{const A=o.get(I);if(!A)return;f.push(t.ci.removeMatchingKeys(l,w.removedDocuments,I).next((()=>t.ci.addMatchingKeys(l,w.addedDocuments,I))));let j=A.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(I)!==null?j=j.withResumeToken(Ft.EMPTY_BYTE_STRING,Ce.min()).withLastLimboFreeSnapshotVersion(Ce.min()):w.resumeToken.approximateByteSize()>0&&(j=j.withResumeToken(w.resumeToken,i)),o=o.insert(I,j),(function(K,$,me){return K.resumeToken.approximateByteSize()===0||$.snapshotVersion.toMicroseconds()-K.snapshotVersion.toMicroseconds()>=Dk?!0:me.addedDocuments.size+me.modifiedDocuments.size+me.removedDocuments.size>0})(A,j,w)&&f.push(t.ci.updateTargetData(l,j))}));let g=Gr(),_=Ve();if(e.documentUpdates.forEach((w=>{e.resolvedLimboDocuments.has(w)&&f.push(t.persistence.referenceDelegate.updateLimboDocument(l,w))})),f.push(jk(l,h,e.documentUpdates).next((w=>{g=w.Ns,_=w.Bs}))),!i.isEqual(Ce.min())){const w=t.ci.getLastRemoteSnapshotVersion(l).next((I=>t.ci.setTargetsMetadata(l,l.currentSequenceNumber,i)));f.push(w)}return G.waitFor(f).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Cs=o,l)))}function jk(r,e,t){let i=Ve(),o=Ve();return t.forEach((l=>i=i.add(l))),e.getEntries(r,i).next((l=>{let h=Gr();return t.forEach(((f,g)=>{const _=l.get(f);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(f)),g.isNoDocument()&&g.version.isEqual(Ce.min())?(e.removeEntry(f,g.readTime),h=h.insert(f,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(f,g)):re(up,"Ignoring outdated watch update for ",f,". Current version:",_.version," Watch version:",g.version)})),{Ns:h,Bs:o}}))}function Fk(r,e){const t=Pe(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Qf),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function Uk(r,e){const t=Pe(r);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let o;return t.ci.getTargetData(i,e).next((l=>l?(o=l,G.resolve(o)):t.ci.allocateTargetId(i).next((h=>(o=new zr(e,h,"TargetPurposeListen",i.currentSequenceNumber),t.ci.addTargetData(i,o).next((()=>o)))))))})).then((i=>{const o=t.Cs.get(i.targetId);return(o===null||i.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Cs=t.Cs.insert(i.targetId,i),t.vs.set(e,i.targetId)),i}))}async function xf(r,e,t){const i=Pe(r),o=i.Cs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",l,(h=>i.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Wo(h))throw h;re(up,`Failed to update sequence numbers for target ${e}: ${h}`)}i.Cs=i.Cs.remove(e),i.vs.delete(o.target)}function a_(r,e,t){const i=Pe(r);let o=Ce.min(),l=Ve();return i.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,w){const I=Pe(g),A=I.vs.get(w);return A!==void 0?G.resolve(I.Cs.get(A)):I.ci.getTargetData(_,w)})(i,h,dr(e)).next((f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,i.ci.getMatchingKeysForTargetId(h,f.targetId).next((g=>{l=g}))})).next((()=>i.Ds.getDocumentsMatchingQuery(h,e,t?o:Ce.min(),t?l:Ve()))).next((f=>(zk(i,SA(e),f),{documents:f,Ls:l})))))}function zk(r,e,t){let i=r.Fs.get(e)||Ce.min();t.forEach(((o,l)=>{l.readTime.compareTo(i)>0&&(i=l.readTime)})),r.Fs.set(e,i)}class l_{constructor(){this.activeTargetIds=NA()}Ws(e){this.activeTargetIds=this.activeTargetIds.add(e)}Qs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}$s(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Bk{constructor(){this.Co=new l_,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Co.Ws(e),this.vo[e]||"not-current"}updateQueryState(e,t,i){this.vo[e]=t}removeLocalQueryTarget(e){this.Co.Qs(e)}isLocalQueryTarget(e){return this.Co.activeTargetIds.has(e)}clearQueryState(e){delete this.vo[e]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(e){return this.Co.activeTargetIds.has(e)}start(){return this.Co=new l_,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class $k{Fo(e){}shutdown(){}}/**
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
 */const u_="ConnectivityMonitor";class c_{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(e){this.Bo.push(e)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){re(u_,"Network connectivity changed: AVAILABLE");for(const e of this.Bo)e(0)}No(){re(u_,"Network connectivity changed: UNAVAILABLE");for(const e of this.Bo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let nc=null;function Sf(){return nc===null?nc=(function(){return 268435456+Math.round(2147483648*Math.random())})():nc++,"0x"+nc.toString(16)}/**
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
 */const Zd="RestConnection",Hk={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class qk{get ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Ko=`projects/${i}/databases/${o}`,this.Uo=this.databaseId.database===Cc?`project_id=${i}`:`project_id=${i}&database_id=${o}`}$o(e,t,i,o,l){const h=Sf(),f=this.Wo(e,t.toUriEncodedString());re(Zd,`Sending RPC '${e}' ${h}:`,f,i);const g={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(g,o,l);const{host:_}=new URL(f),w=El(_);return this.Go(e,f,g,i,w).then((I=>(re(Zd,`Received RPC '${e}' ${h}: `,I),I)),(I=>{throw Vi(Zd,`RPC '${e}' ${h} failed with error: `,I,"url: ",f,"request:",i),I}))}zo(e,t,i,o,l,h){return this.$o(e,t,i,o,l)}Qo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Ho})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),i&&i.headers.forEach(((o,l)=>e[l]=o))}Wo(e,t){const i=Hk[e];let o=`${this.qo}/v1/${t}:${i}`;return this.databaseInfo.apiKey&&(o=`${o}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),o}terminate(){}}/**
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
 */class Wk{constructor(e){this.jo=e.jo,this.Jo=e.Jo}Ho(e){this.Zo=e}Xo(e){this.Yo=e}e_(e){this.t_=e}onMessage(e){this.n_=e}close(){this.Jo()}send(e){this.jo(e)}r_(){this.Zo()}i_(){this.Yo()}s_(e){this.t_(e)}o_(e){this.n_(e)}}/**
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
 */const qt="WebChannelConnection",Ha=(r,e,t)=>{r.listen(e,(i=>{try{t(i)}catch(o){setTimeout((()=>{throw o}),0)}}))};class Do extends qk{constructor(e){super(e),this.__=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static a_(){if(!Do.u_){const e=Hv();Ha(e,$v.STAT_EVENT,(t=>{t.stat===pf.PROXY?re(qt,"STAT_EVENT: detected buffering proxy"):t.stat===pf.NOPROXY&&re(qt,"STAT_EVENT: detected no buffering proxy")})),Do.u_=!0}}Go(e,t,i,o,l){const h=Sf();return new Promise(((f,g)=>{const _=new zv;_.setWithCredentials(!0),_.listenOnce(Bv.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case hc.NO_ERROR:const I=_.getResponseJson();re(qt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(I)),f(I);break;case hc.TIMEOUT:re(qt,`RPC '${e}' ${h} timed out`),g(new se(q.DEADLINE_EXCEEDED,"Request time out"));break;case hc.HTTP_ERROR:const A=_.getStatus();if(re(qt,`RPC '${e}' ${h} failed with status:`,A,"response text:",_.getResponseText()),A>0){let j=_.getResponseJson();Array.isArray(j)&&(j=j[0]);const W=j==null?void 0:j.error;if(W&&W.status&&W.message){const K=(function(me){const ae=me.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(ae)>=0?ae:q.UNKNOWN})(W.status);g(new se(K,W.message))}else g(new se(q.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new se(q.UNAVAILABLE,"Connection failed."));break;default:Ae(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{re(qt,`RPC '${e}' ${h} completed.`)}}));const w=JSON.stringify(o);re(qt,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",w,i,15)}))}P_(e,t,i){const o=Sf(),l=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=this.createWebChannelTransport(),f={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},g=this.longPollingOptions.timeoutSeconds;g!==void 0&&(f.longPollingTimeout=Math.round(1e3*g)),this.useFetchStreams&&(f.useFetchStreams=!0),this.Qo(f.initMessageHeaders,t,i),f.encodeInitMessageHeaders=!0;const _=l.join("");re(qt,`Creating RPC '${e}' stream ${o}: ${_}`,f);const w=h.createWebChannel(_,f);this.T_(w);let I=!1,A=!1;const j=new Wk({jo:W=>{A?re(qt,`Not sending because RPC '${e}' stream ${o} is closed:`,W):(I||(re(qt,`Opening RPC '${e}' stream ${o} transport.`),w.open(),I=!0),re(qt,`RPC '${e}' stream ${o} sending:`,W),w.send(W))},Jo:()=>w.close()});return Ha(w,Ga.EventType.OPEN,(()=>{A||(re(qt,`RPC '${e}' stream ${o} transport opened.`),j.r_())})),Ha(w,Ga.EventType.CLOSE,(()=>{A||(A=!0,re(qt,`RPC '${e}' stream ${o} transport closed`),j.s_(),this.I_(w))})),Ha(w,Ga.EventType.ERROR,(W=>{A||(A=!0,Vi(qt,`RPC '${e}' stream ${o} transport errored. Name:`,W.name,"Message:",W.message),j.s_(new se(q.UNAVAILABLE,"The operation could not be completed")))})),Ha(w,Ga.EventType.MESSAGE,(W=>{var K;if(!A){const $=W.data[0];ze(!!$,16349);const me=$,ae=(me==null?void 0:me.error)||((K=me[0])==null?void 0:K.error);if(ae){re(qt,`RPC '${e}' stream ${o} received error:`,ae);const ce=ae.status;let xe=(function(k){const x=Et[k];if(x!==void 0)return S0(x)})(ce),Te=ae.message;ce==="NOT_FOUND"&&Te.includes("database")&&Te.includes("does not exist")&&Te.includes(this.databaseId.database)&&Vi(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),xe===void 0&&(xe=q.INTERNAL,Te="Unknown error status: "+ce+" with message "+ae.message),A=!0,j.s_(new se(xe,Te)),w.close()}else re(qt,`RPC '${e}' stream ${o} received:`,$),j.o_($)}})),Do.a_(),setTimeout((()=>{j.i_()}),0),j}terminate(){this.__.forEach((e=>e.close())),this.__=[]}T_(e){this.__.push(e)}I_(e){this.__=this.__.filter((t=>t===e))}Qo(e,t,i){super.Qo(e,t,i),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return qv()}}/**
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
 */function Kk(r){return new Do(r)}function ef(){return typeof document<"u"?document:null}/**
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
 */function ah(r){return new YA(r,!0)}/**
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
 */Do.u_=!1;class U0{constructor(e,t,i=1e3,o=1.5,l=6e4){this.Di=e,this.timerId=t,this.E_=i,this.R_=o,this.A_=l,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(e){this.cancel();const t=Math.floor(this.V_+this.p_()),i=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-i);o>0&&re("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
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
 */const h_="PersistentStream";class z0{constructor(e,t,i,o,l,h,f,g){this.Di=e,this.w_=i,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new U0(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(e,t){this.q_(),this.K_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(Kr(t.toString()),Kr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.e_(t)}U_(){}auth(){this.state=1;const e=this.W_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,o])=>{this.b_===t&&this.Q_(i,o)}),(i=>{e((()=>{const o=new se(q.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(o)}))}))}Q_(e,t){const i=this.W_(this.b_);this.stream=this.z_(e,t),this.stream.Ho((()=>{i((()=>this.listener.Ho()))})),this.stream.Xo((()=>{i((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((o=>{i((()=>this.G_(o)))})),this.stream.onMessage((o=>{i((()=>++this.v_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return re(h_,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Di.enqueueAndForget((()=>this.b_===e?t():(re(h_,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Gk extends z0{constructor(e,t,i,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=ek(this.serializer,e),i=(function(l){if(!("targetChange"in l))return Ce.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?Ce.min():h.readTime?fr(h.readTime):Ce.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=If(this.serializer),t.addTarget=(function(l,h){let f;const g=h.target;if(f=_f(g)?{documents:rk(l,g)}:{query:sk(l,g).dt},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=C0(l,h.resumeToken);const _=wf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}else if(h.snapshotVersion.compareTo(Ce.min())>0){f.readTime=Oc(l,h.snapshotVersion.toTimestamp());const _=wf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}return f})(this.serializer,e);const i=ok(this.serializer,e);i&&(t.labels=i),this.k_(t)}Z_(e){const t={};t.database=If(this.serializer),t.removeTarget=e,this.k_(t)}}class Qk extends z0{constructor(e,t,i,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return ze(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ze(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){ze(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=nk(e.writeResults,e.commitTime),i=fr(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=If(this.serializer),this.k_(e)}Y_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>tk(this.serializer,i)))};this.k_(t)}}/**
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
 */class Jk{}class Yk extends Jk{constructor(e,t,i,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new se(q.FAILED_PRECONDITION,"The client has already been terminated.")}$o(e,t,i,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.$o(e,Ef(t,i),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new se(q.UNKNOWN,l.toString())}))}zo(e,t,i,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,f])=>this.connection.zo(e,Ef(t,i),o,h,f,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new se(q.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function Xk(r,e,t,i){return new Yk(r,e,t,i)}class Zk{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
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
 */const gr="RemoteStore";class eC{constructor(e,t,i,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new Bs(1e3),this.Aa=new Bs(1001),this.Va=new Set,this.da=[],this.ma=l,this.ma.Fo((h=>{i.enqueueAndForget((async()=>{ji(this)&&(re(gr,"Restarting streams for network reachability change."),await(async function(g){const _=Pe(g);_.Va.add(4),await Pl(_),_.fa.set("Unknown"),_.Va.delete(4),await lh(_)})(this))}))})),this.fa=new Zk(i,o)}}async function lh(r){if(ji(r))for(const e of r.da)await e(!0)}async function Pl(r){for(const e of r.da)await e(!1)}function Af(r,e){return r.Ia.get(e)||void 0}function B0(r,e){const t=Pe(r),i=Af(t,e.targetId);if(i!==void 0&&t.Ta.has(i))return;const o=(function(f,g){const _=Af(f,g);_!==void 0&&f.Ea.delete(_);const w=(function(A,j){return j%2!=0?A.Aa.next():A.Ra.next()})(f,g);return f.Ia.set(g,w),f.Ea.set(w,g),w})(t,e.targetId);re(gr,"remoteStoreListen mapping SDK target ID to remote",e.targetId,o);const l=new zr(e.target,o,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ta.set(o,l),fp(t)?dp(t):Go(t).x_()&&hp(t,l)}function cp(r,e){const t=Pe(r),i=Go(t),o=Af(t,e);re(gr,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,o),t.Ta.delete(o),t.Ia.delete(e),t.Ea.delete(o),i.x_()&&$0(t,o),t.Ta.size===0&&(i.x_()?i.B_():ji(t)&&t.fa.set("Unknown"))}function hp(r,e){if(r.ga.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Ce.min())>0){const t=r.Ea.get(e.targetId);if(t===void 0)return void re(gr,"SDK target ID not found for remote ID: "+e.targetId);const i=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(i)}Go(r).H_(e)}function $0(r,e){r.ga.$e(e),Go(r).Z_(e)}function dp(r){r.ga=new KA({getRemoteKeysForTarget:e=>{const t=r.Ea.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):Ve()},Rt:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Go(r).start(),r.fa.aa()}function fp(r){return ji(r)&&!Go(r).M_()&&r.Ta.size>0}function ji(r){return Pe(r).Va.size===0}function H0(r){r.ga=void 0}async function tC(r){r.fa.set("Online")}async function nC(r){r.Ta.forEach(((e,t)=>{hp(r,e)}))}async function rC(r,e){H0(r),fp(r)?(r.fa.la(e),dp(r)):r.fa.set("Unknown")}async function sC(r,e,t){if(r.fa.set("Online"),e instanceof k0&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const f of l.targetIds){if(o.Ta.has(f)){const g=o.Ea.get(f);g!==void 0&&(await o.remoteSyncer.rejectListen(g,h),o.Ia.delete(g),o.Ea.delete(f)),o.Ta.delete(f)}o.ga.removeTarget(f)}})(r,e)}catch(i){re(gr,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await Mc(r,i)}else if(e instanceof mc?r.ga.Xe(e):e instanceof A0?r.ga.it(e):r.ga.tt(e),!t.isEqual(Ce.min()))try{const i=await F0(r.localStore);t.compareTo(i)>=0&&await(function(l,h){const f=l.ga.Pt(h);f.targetChanges.forEach(((_,w)=>{if(_.resumeToken.approximateByteSize()>0){const I=l.Ta.get(w);I&&l.Ta.set(w,I.withResumeToken(_.resumeToken,h))}})),f.targetMismatches.forEach(((_,w)=>{const I=l.Ta.get(_);if(!I)return;l.Ta.set(_,I.withResumeToken(Ft.EMPTY_BYTE_STRING,I.snapshotVersion)),$0(l,_);const A=new zr(I.target,_,w,I.sequenceNumber);hp(l,A)}));const g=(function(w,I){const A=new Map;I.targetChanges.forEach(((W,K)=>{const $=w.Ea.get(K);$!==void 0&&A.set($,W)}));let j=new rt(De);return I.targetMismatches.forEach(((W,K)=>{const $=w.Ea.get(W);$!==void 0&&(j=j.insert($,K))})),new Cl(I.snapshotVersion,A,j,I.documentUpdates,I.resolvedLimboDocuments)})(l,f);return l.remoteSyncer.applyRemoteEvent(g)})(r,t)}catch(i){re(gr,"Failed to raise snapshot:",i),await Mc(r,i)}}async function Mc(r,e,t){if(!Wo(e))throw e;r.Va.add(1),await Pl(r),r.fa.set("Offline"),t||(t=()=>F0(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{re(gr,"Retrying IndexedDB access"),await t(),r.Va.delete(1),await lh(r)}))}function q0(r,e){return e().catch((t=>Mc(r,t,e)))}async function uh(r){const e=Pe(r),t=$s(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Qf;for(;iC(e);)try{const o=await Fk(e.localStore,i);if(o===null){e.Pa.length===0&&t.B_();break}i=o.batchId,oC(e,o)}catch(o){await Mc(e,o)}W0(e)&&K0(e)}function iC(r){return ji(r)&&r.Pa.length<10}function oC(r,e){r.Pa.push(e);const t=$s(r);t.x_()&&t.X_&&t.Y_(e.mutations)}function W0(r){return ji(r)&&!$s(r).M_()&&r.Pa.length>0}function K0(r){$s(r).start()}async function aC(r){$s(r).na()}async function lC(r){const e=$s(r);for(const t of r.Pa)e.Y_(t.mutations)}async function uC(r,e,t){const i=r.Pa.shift(),o=rp.from(i,e,t);await q0(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await uh(r)}async function cC(r,e){e&&$s(r).X_&&await(async function(i,o){if((function(h){return HA(h)&&h!==q.ABORTED})(o.code)){const l=i.Pa.shift();$s(i).N_(),await q0(i,(()=>i.remoteSyncer.rejectFailedWrite(l.batchId,o))),await uh(i)}})(r,e),W0(r)&&K0(r)}async function d_(r,e){const t=Pe(r);t.asyncQueue.verifyOperationInProgress(),re(gr,"RemoteStore received new credentials");const i=ji(t);t.Va.add(3),await Pl(t),i&&t.fa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Va.delete(3),await lh(t)}async function hC(r,e){const t=Pe(r);e?(t.Va.delete(2),await lh(t)):e||(t.Va.add(2),await Pl(t),t.fa.set("Unknown"))}function Go(r){return r.pa||(r.pa=(function(t,i,o){const l=Pe(t);return l.ia(),new Gk(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:tC.bind(null,r),Xo:nC.bind(null,r),e_:rC.bind(null,r),J_:sC.bind(null,r)}),r.da.push((async e=>{e?(r.pa.N_(),fp(r)?dp(r):r.fa.set("Unknown")):(await r.pa.stop(),H0(r))}))),r.pa}function $s(r){return r.ya||(r.ya=(function(t,i,o){const l=Pe(t);return l.ia(),new Qk(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Ho:()=>Promise.resolve(),Xo:aC.bind(null,r),e_:cC.bind(null,r),ea:lC.bind(null,r),ta:uC.bind(null,r)}),r.da.push((async e=>{e?(r.ya.N_(),await uh(r)):(await r.ya.stop(),r.Pa.length>0&&(re(gr,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ya}/**
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
 */class pp{constructor(e,t,i,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=o,this.removalCallback=l,this.deferred=new $r,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,o,l){const h=Date.now()+i,f=new pp(e,t,h,o,l);return f.start(i),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new se(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function mp(r,e){if(Kr("AsyncQueue",`${e}: ${r}`),Wo(r))return new se(q.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class Vo{static emptySet(e){return new Vo(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||_e.comparator(t.key,i.key):(t,i)=>_e.comparator(t.key,i.key),this.keyedMap=Qa(),this.sortedSet=new rt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Vo)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
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
 */class f_{constructor(){this.wa=new rt(_e.comparator)}track(e){const t=e.doc.key,i=this.wa.get(t);i?e.type!==0&&i.type===3?this.wa=this.wa.insert(t,e):e.type===3&&i.type!==1?this.wa=this.wa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.wa=this.wa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.wa=this.wa.remove(t):e.type===1&&i.type===2?this.wa=this.wa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):Ae(63341,{At:e,Sa:i}):this.wa=this.wa.insert(t,e)}ba(){const e=[];return this.wa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Uo{constructor(e,t,i,o,l,h,f,g,_){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,i,o,l){const h=[];return t.forEach((f=>{h.push({type:0,doc:f})})),new Uo(e,t,Vo.emptySet(t),h,i,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&nh(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==i[o].type||!t[o].doc.isEqual(i[o].doc))return!1;return!0}}/**
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
 */class dC{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((e=>e.Fa()))}}class fC{constructor(){this.queries=p_(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(t,i){const o=Pe(t),l=o.queries;o.queries=p_(),l.forEach(((h,f)=>{for(const g of f.Ca)g.onError(i)}))})(this,new se(q.ABORTED,"Firestore shutting down"))}}function p_(){return new Mi((r=>p0(r)),nh)}async function gp(r,e){const t=Pe(r);let i=3;const o=e.query;let l=t.queries.get(o);l?!l.va()&&e.Fa()&&(i=2):(l=new dC,i=e.Fa()?0:1);try{switch(i){case 0:l.Da=await t.onListen(o,!0);break;case 1:l.Da=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const f=mp(h,`Initialization of query '${ko(e.query)}' failed`);return void e.onError(f)}t.queries.set(o,l),l.Ca.push(e),e.xa(t.onlineState),l.Da&&e.Oa(l.Da)&&_p(t)}async function yp(r,e){const t=Pe(r),i=e.query;let o=3;const l=t.queries.get(i);if(l){const h=l.Ca.indexOf(e);h>=0&&(l.Ca.splice(h,1),l.Ca.length===0?o=e.Fa()?0:1:!l.va()&&e.Fa()&&(o=2))}switch(o){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function pC(r,e){const t=Pe(r);let i=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const f of h.Ca)f.Oa(o)&&(i=!0);h.Da=o}}i&&_p(t)}function mC(r,e,t){const i=Pe(r),o=i.queries.get(e);if(o)for(const l of o.Ca)l.onError(t);i.queries.delete(e)}function _p(r){r.Ma.forEach((e=>{e.next()}))}var kf,m_;(m_=kf||(kf={})).Na="default",m_.Cache="cache";class vp{constructor(e,t,i){this.query=e,this.Ba=t,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=i||{}}Oa(e){if(!this.options.includeMetadataChanges){const i=[];for(const o of e.docChanges)o.type!==3&&i.push(o);e=new Uo(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.La?this.qa(e)&&(this.Ba.next(e),t=!0):this.Ka(e,this.onlineState)&&(this.Ua(e),t=!0),this.ka=e,t}onError(e){this.Ba.error(e)}xa(e){this.onlineState=e;let t=!1;return this.ka&&!this.La&&this.Ka(this.ka,e)&&(this.Ua(this.ka),t=!0),t}Ka(e,t){if(!e.fromCache||!this.Fa())return!0;const i=t!=="Offline";return(!this.options.$a||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.ka&&this.ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Ua(e){e=Uo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.La=!0,this.Ba.next(e)}Fa(){return this.options.source!==kf.Cache}}/**
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
 */class G0{constructor(e){this.key=e}}class Q0{constructor(e){this.key=e}}class gC{constructor(e,t){this.query=e,this.eu=t,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=Ve(),this.mutatedKeys=Ve(),this.ru=m0(e),this.iu=new Vo(this.ru)}get su(){return this.eu}ou(e,t){const i=t?t._u:new f_,o=t?t.iu:this.iu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,f=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((w,I)=>{const A=o.get(w),j=rh(this.query,I)?I:null,W=!!A&&this.mutatedKeys.has(A.key),K=!!j&&(j.hasLocalMutations||this.mutatedKeys.has(j.key)&&j.hasCommittedMutations);let $=!1;A&&j?A.data.isEqual(j.data)?W!==K&&(i.track({type:3,doc:j}),$=!0):this.au(A,j)||(i.track({type:2,doc:j}),$=!0,(g&&this.ru(j,g)>0||_&&this.ru(j,_)<0)&&(f=!0)):!A&&j?(i.track({type:0,doc:j}),$=!0):A&&!j&&(i.track({type:1,doc:A}),$=!0,(g||_)&&(f=!0)),$&&(j?(h=h.add(j),l=K?l.add(w):l.delete(w)):(h=h.delete(w),l=l.delete(w)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),l=l.delete(w.key),i.track({type:1,doc:w})}return{iu:h,_u:i,Ss:f,mutatedKeys:l}}au(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,o){const l=this.iu;this.iu=e.iu,this.mutatedKeys=e.mutatedKeys;const h=e._u.ba();h.sort(((w,I)=>(function(j,W){const K=$=>{switch($){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Ae(20277,{At:$})}};return K(j)-K(W)})(w.type,I.type)||this.ru(w.doc,I.doc))),this.uu(i),o=o??!1;const f=t&&!o?this.cu():[],g=this.nu.size===0&&this.current&&!o?1:0,_=g!==this.tu;return this.tu=g,h.length!==0||_?{snapshot:new Uo(this.query,e.iu,l,h,e.mutatedKeys,g===0,_,!1,!!i&&i.resumeToken.approximateByteSize()>0),lu:f}:{lu:f}}xa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new f_,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(e){return!this.eu.has(e)&&!!this.iu.has(e)&&!this.iu.get(e).hasLocalMutations}uu(e){e&&(e.addedDocuments.forEach((t=>this.eu=this.eu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.eu=this.eu.delete(t))),this.current=e.current)}cu(){if(!this.current)return[];const e=this.nu;this.nu=Ve(),this.iu.forEach((i=>{this.hu(i.key)&&(this.nu=this.nu.add(i.key))}));const t=[];return e.forEach((i=>{this.nu.has(i)||t.push(new Q0(i))})),this.nu.forEach((i=>{e.has(i)||t.push(new G0(i))})),t}Pu(e){this.eu=e.Ls,this.nu=Ve();const t=this.ou(e.documents);return this.applyChanges(t,!0)}Tu(){return Uo.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const wp="SyncEngine";class yC{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class _C{constructor(e){this.key=e,this.Iu=!1}}class vC{constructor(e,t,i,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.Eu={},this.Ru=new Mi((f=>p0(f)),nh),this.Au=new Map,this.Vu=new Set,this.du=new rt(_e.comparator),this.mu=new Map,this.fu=new op,this.gu={},this.pu=new Map,this.yu=Bs._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function wC(r,e,t=!0){const i=tw(r);let o;const l=i.Ru.get(e);return l?(i.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.Tu()):o=await J0(i,e,t,!0),o}async function EC(r,e){const t=tw(r);await J0(t,e,!0,!1)}async function J0(r,e,t,i){const o=await Uk(r.localStore,dr(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let f;return i&&(f=await TC(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&B0(r.remoteStore,o),f}async function TC(r,e,t,i,o){r.Su=(I,A,j)=>(async function(K,$,me,ae){let ce=$.view.ou(me);ce.Ss&&(ce=await a_(K.localStore,$.query,!1).then((({documents:k})=>$.view.ou(k,ce))));const xe=ae&&ae.targetChanges.get($.targetId),Te=ae&&ae.targetMismatches.get($.targetId)!=null,de=$.view.applyChanges(ce,K.isPrimaryClient,xe,Te);return y_(K,$.targetId,de.lu),de.snapshot})(r,I,A,j);const l=await a_(r.localStore,e,!0),h=new gC(e,l.Ls),f=h.ou(l.documents),g=Rl.createSynthesizedTargetChangeForCurrentChange(t,i&&r.onlineState!=="Offline",o),_=h.applyChanges(f,r.isPrimaryClient,g);y_(r,t,_.lu);const w=new yC(e,t,h);return r.Ru.set(e,w),r.Au.has(t)?r.Au.get(t).push(e):r.Au.set(t,[e]),_.snapshot}async function IC(r,e,t){const i=Pe(r),o=i.Ru.get(e),l=i.Au.get(o.targetId);if(l.length>1)return i.Au.set(o.targetId,l.filter((h=>!nh(h,e)))),void i.Ru.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(o.targetId),i.sharedClientState.isActiveQueryTarget(o.targetId)||await xf(i.localStore,o.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(o.targetId),t&&cp(i.remoteStore,o.targetId),Cf(i,o.targetId)})).catch(qo)):(Cf(i,o.targetId),await xf(i.localStore,o.targetId,!0))}async function xC(r,e){const t=Pe(r),i=t.Ru.get(e),o=t.Au.get(i.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),cp(t.remoteStore,i.targetId))}async function SC(r,e,t){const i=bC(r);try{const o=await(function(h,f){const g=Pe(h),_=Ze.now(),w=f.reduce(((j,W)=>j.add(W.key)),Ve());let I,A;return g.persistence.runTransaction("Locally write mutations","readwrite",(j=>{let W=Gr(),K=Ve();return g.Ms.getEntries(j,w).next(($=>{W=$,W.forEach(((me,ae)=>{ae.isValidDocument()||(K=K.add(me))}))})).next((()=>g.localDocuments.getOverlayedDocuments(j,W))).next(($=>{I=$;const me=[];for(const ae of f){const ce=FA(ae,I.get(ae.key).overlayedDocument);ce!=null&&me.push(new Js(ae.key,ce,o0(ce.value.mapValue),zn.exists(!0)))}return g.mutationQueue.addMutationBatch(j,_,me,f)})).next(($=>{A=$;const me=$.applyToLocalDocumentSet(I,K);return g.documentOverlayCache.saveOverlays(j,$.batchId,me)}))})).then((()=>({batchId:A.batchId,changes:y0(I)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(o.batchId),(function(h,f,g){let _=h.gu[h.currentUser.toKey()];_||(_=new rt(De)),_=_.insert(f,g),h.gu[h.currentUser.toKey()]=_})(i,o.batchId,t),await Nl(i,o.changes),await uh(i.remoteStore)}catch(o){const l=mp(o,"Failed to persist write");t.reject(l)}}async function Y0(r,e){const t=Pe(r);try{const i=await Mk(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.mu.get(l);h&&(ze(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.Iu=!0:o.modifiedDocuments.size>0?ze(h.Iu,14607):o.removedDocuments.size>0&&(ze(h.Iu,42227),h.Iu=!1))})),await Nl(t,i,e)}catch(i){await qo(i)}}function g_(r,e,t){const i=Pe(r);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const o=[];i.Ru.forEach(((l,h)=>{const f=h.view.xa(e);f.snapshot&&o.push(f.snapshot)})),(function(h,f){const g=Pe(h);g.onlineState=f;let _=!1;g.queries.forEach(((w,I)=>{for(const A of I.Ca)A.xa(f)&&(_=!0)})),_&&_p(g)})(i.eventManager,e),o.length&&i.Eu.J_(o),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function AC(r,e,t){const i=Pe(r);i.sharedClientState.updateQueryState(e,"rejected",t);const o=i.mu.get(e),l=o&&o.key;if(l){let h=new rt(_e.comparator);h=h.insert(l,Kt.newNoDocument(l,Ce.min()));const f=Ve().add(l),g=new Cl(Ce.min(),new Map,new rt(De),h,f);await Y0(i,g),i.du=i.du.remove(l),i.mu.delete(e),Ep(i)}else await xf(i.localStore,e,!1).then((()=>Cf(i,e,t))).catch(qo)}async function kC(r,e){const t=Pe(r),i=e.batch.batchId;try{const o=await Lk(t.localStore,e);Z0(t,i,null),X0(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await Nl(t,o)}catch(o){await qo(o)}}async function CC(r,e,t){const i=Pe(r);try{const o=await(function(h,f){const g=Pe(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let w;return g.mutationQueue.lookupMutationBatch(_,f).next((I=>(ze(I!==null,37113),w=I.keys(),g.mutationQueue.removeMutationBatch(_,I)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,w,f))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,w))).next((()=>g.localDocuments.getDocuments(_,w)))}))})(i.localStore,e);Z0(i,e,t),X0(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await Nl(i,o)}catch(o){await qo(o)}}function X0(r,e){(r.pu.get(e)||[]).forEach((t=>{t.resolve()})),r.pu.delete(e)}function Z0(r,e,t){const i=Pe(r);let o=i.gu[i.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),i.gu[i.currentUser.toKey()]=o}}function Cf(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const i of r.Au.get(e))r.Ru.delete(i),t&&r.Eu.bu(i,t);r.Au.delete(e),r.isPrimaryClient&&r.fu.Qr(e).forEach((i=>{r.fu.containsKey(i)||ew(r,i)}))}function ew(r,e){r.Vu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(cp(r.remoteStore,t),r.du=r.du.remove(e),r.mu.delete(t),Ep(r))}function y_(r,e,t){for(const i of t)i instanceof G0?(r.fu.addReference(i.key,e),RC(r,i)):i instanceof Q0?(re(wp,"Document no longer in limbo: "+i.key),r.fu.removeReference(i.key,e),r.fu.containsKey(i.key)||ew(r,i.key)):Ae(19791,{Du:i})}function RC(r,e){const t=e.key,i=t.path.canonicalString();r.du.get(t)||r.Vu.has(i)||(re(wp,"New document in limbo: "+t),r.Vu.add(i),Ep(r))}function Ep(r){for(;r.Vu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Vu.values().next().value;r.Vu.delete(e);const t=new _e(Qe.fromString(e)),i=r.yu.next();r.mu.set(i,new _C(t)),r.du=r.du.insert(t,i),B0(r.remoteStore,new zr(dr(th(t.path)),i,"TargetPurposeLimboResolution",Xc.ce))}}async function Nl(r,e,t){const i=Pe(r),o=[],l=[],h=[];i.Ru.isEmpty()||(i.Ru.forEach(((f,g)=>{h.push(i.Su(g,e,t).then((_=>{var w;if((_||t)&&i.isPrimaryClient){const I=_?!_.fromCache:(w=t==null?void 0:t.targetChanges.get(g.targetId))==null?void 0:w.current;i.sharedClientState.updateQueryState(g.targetId,I?"current":"not-current")}if(_){o.push(_);const I=lp.Is(g.targetId,_);l.push(I)}})))})),await Promise.all(h),i.Eu.J_(o),await(async function(g,_){const w=Pe(g);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",(I=>G.forEach(_,(A=>G.forEach(A.Ps,(j=>w.persistence.referenceDelegate.addReference(I,A.targetId,j))).next((()=>G.forEach(A.Ts,(j=>w.persistence.referenceDelegate.removeReference(I,A.targetId,j)))))))))}catch(I){if(!Wo(I))throw I;re(up,"Failed to update sequence numbers: "+I)}for(const I of _){const A=I.targetId;if(!I.fromCache){const j=w.Cs.get(A),W=j.snapshotVersion,K=j.withLastLimboFreeSnapshotVersion(W);w.Cs=w.Cs.insert(A,K)}}})(i.localStore,l))}async function PC(r,e){const t=Pe(r);if(!t.currentUser.isEqual(e)){re(wp,"User change. New user:",e.toKey());const i=await j0(t.localStore,e);t.currentUser=e,(function(l,h){l.pu.forEach((f=>{f.forEach((g=>{g.reject(new se(q.CANCELLED,h))}))})),l.pu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await Nl(t,i.Os)}}function NC(r,e){const t=Pe(r),i=t.mu.get(e);if(i&&i.Iu)return Ve().add(i.key);{let o=Ve();const l=t.Au.get(e);if(!l)return o;for(const h of l){const f=t.Ru.get(h);o=o.unionWith(f.view.su)}return o}}function tw(r){const e=Pe(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Y0.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=NC.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=AC.bind(null,e),e.Eu.J_=pC.bind(null,e.eventManager),e.Eu.bu=mC.bind(null,e.eventManager),e}function bC(r){const e=Pe(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=kC.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=CC.bind(null,e),e}class jc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ah(e.databaseInfo.databaseId),this.sharedClientState=this.Fu(e),this.persistence=this.Mu(e),await this.persistence.start(),this.localStore=this.xu(e),this.gcScheduler=this.Ou(e,this.localStore),this.indexBackfillerScheduler=this.Nu(e,this.localStore)}Ou(e,t){return null}Nu(e,t){return null}xu(e){return Ok(this.persistence,new bk,e.initialUser,this.serializer)}Mu(e){return new M0(ap.Ai,this.serializer)}Fu(e){return new Bk}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}jc.provider={build:()=>new jc};class DC extends jc{constructor(e){super(),this.cacheSizeBytes=e}Ou(e,t){ze(this.persistence.referenceDelegate instanceof Lc,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new yk(i,e.asyncQueue,t)}Mu(e){const t=this.cacheSizeBytes!==void 0?rn.withCacheSize(this.cacheSizeBytes):rn.DEFAULT;return new M0((i=>Lc.Ai(i,t)),this.serializer)}}class Rf{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>g_(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=PC.bind(null,this.syncEngine),await hC(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new fC})()}createDatastore(e){const t=ah(e.databaseInfo.databaseId),i=Kk(e.databaseInfo);return Xk(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,o,l,h,f){return new eC(i,o,l,h,f)})(this.localStore,this.datastore,e.asyncQueue,(t=>g_(this.syncEngine,t,0)),(function(){return c_.v()?new c_:new $k})())}createSyncEngine(e,t){return(function(o,l,h,f,g,_,w){const I=new vC(o,l,h,f,g,_);return w&&(I.wu=!0),I})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Pe(o);re(gr,"RemoteStore shutting down."),l.Va.add(5),await Pl(l),l.ma.shutdown(),l.fa.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Rf.provider={build:()=>new Rf};/**
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
 */class Tp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Lu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Lu(this.observer.error,e):Kr("Uncaught Error in snapshot listener:",e.toString()))}ku(){this.muted=!0}Lu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Hs="FirestoreClient";class VC{constructor(e,t,i,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this._databaseInfo=o,this.user=Wt.UNAUTHENTICATED,this.clientId=Gf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(i,(async h=>{re(Hs,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(i,(h=>(re(Hs,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new $r;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=mp(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function tf(r,e){r.asyncQueue.verifyOperationInProgress(),re(Hs,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let i=t.initialUser;r.setCredentialChangeListener((async o=>{i.isEqual(o)||(await j0(e.localStore,o),i=o)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function __(r,e){r.asyncQueue.verifyOperationInProgress();const t=await OC(r);re(Hs,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((i=>d_(e.remoteStore,i))),r.setAppCheckTokenChangeListener(((i,o)=>d_(e.remoteStore,o))),r._onlineComponents=e}async function OC(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){re(Hs,"Using user provided OfflineComponentProvider");try{await tf(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===q.FAILED_PRECONDITION||o.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;Vi("Error using user provided cache. Falling back to memory cache: "+t),await tf(r,new jc)}}else re(Hs,"Using default OfflineComponentProvider"),await tf(r,new DC(void 0));return r._offlineComponents}async function nw(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(re(Hs,"Using user provided OnlineComponentProvider"),await __(r,r._uninitializedComponentsProvider._online)):(re(Hs,"Using default OnlineComponentProvider"),await __(r,new Rf))),r._onlineComponents}function LC(r){return nw(r).then((e=>e.syncEngine))}async function Fc(r){const e=await nw(r),t=e.eventManager;return t.onListen=wC.bind(null,e.syncEngine),t.onUnlisten=IC.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=EC.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=xC.bind(null,e.syncEngine),t}function MC(r,e,t,i){const o=new Tp(i),l=new vp(e,o,t);return r.asyncQueue.enqueueAndForget((async()=>gp(await Fc(r),l))),()=>{o.ku(),r.asyncQueue.enqueueAndForget((async()=>yp(await Fc(r),l)))}}function jC(r,e,t={}){const i=new $r;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const w=new Tp({next:A=>{w.ku(),h.enqueueAndForget((()=>yp(l,I)));const j=A.docs.has(f);!j&&A.fromCache?_.reject(new se(q.UNAVAILABLE,"Failed to get document because the client is offline.")):j&&A.fromCache&&g&&g.source==="server"?_.reject(new se(q.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(A)},error:A=>_.reject(A)}),I=new vp(th(f.path),w,{includeMetadataChanges:!0,$a:!0});return gp(l,I)})(await Fc(r),r.asyncQueue,e,t,i))),i.promise}function FC(r,e,t={}){const i=new $r;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const w=new Tp({next:A=>{w.ku(),h.enqueueAndForget((()=>yp(l,I))),A.fromCache&&g.source==="server"?_.reject(new se(q.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):_.resolve(A)},error:A=>_.reject(A)}),I=new vp(f,w,{includeMetadataChanges:!0,$a:!0});return gp(l,I)})(await Fc(r),r.asyncQueue,e,t,i))),i.promise}function UC(r,e){const t=new $r;return r.asyncQueue.enqueueAndForget((async()=>SC(await LC(r),e,t))),t.promise}/**
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
 */function rw(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const zC="ComponentProvider",v_=new Map;function BC(r,e,t,i,o){return new oA(r,e,t,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,rw(o.experimentalLongPollingOptions),o.useFetchStreams,o.isUsingEmulator,i)}/**
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
 */const sw="firestore.googleapis.com",w_=!0;class E_{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new se(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=sw,this.ssl=w_}else this.host=e.host,this.ssl=e.ssl??w_;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=L0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<mk)throw new se(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}QS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=rw(e.experimentalLongPollingOptions??{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,o){return i.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ch{constructor(e,t,i,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new E_({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new se(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new se(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new E_(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new FS;switch(i.type){case"firstParty":return new $S(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new se(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=v_.get(t);i&&(re(zC,"Removing Datastore"),v_.delete(t),i.terminate())})(this),Promise.resolve()}}function $C(r,e,t,i={}){var _;r=yn(r,ch);const o=El(e),l=r._getSettings(),h={...l,emulatorOptions:r._getEmulatorOptions()},f=`${e}:${t}`;o&&X_(`https://${f}`),l.host!==sw&&l.host!==f&&Vi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const g={...l,host:f,ssl:o,emulatorOptions:i};if(!Ri(g,h)&&(r._setSettings(g),i.mockUserToken)){let w,I;if(typeof i.mockUserToken=="string")w=i.mockUserToken,I=Wt.MOCK_USER;else{w=KT(i.mockUserToken,(_=r._app)==null?void 0:_.options.projectId);const A=i.mockUserToken.sub||i.mockUserToken.user_id;if(!A)throw new se(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");I=new Wt(A)}r._authCredentials=new US(new Kv(w,I))}}/**
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
 */class Yr{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Yr(this.firestore,e,this._query)}}class ct{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ms(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ct(this.firestore,e,this._key)}toJSON(){return{type:ct._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(Al(t,ct._jsonSchema))return new ct(e,i||null,new _e(Qe.fromString(t.referencePath)))}}ct._jsonSchemaVersion="firestore/documentReference/1.0",ct._jsonSchema={type:It("string",ct._jsonSchemaVersion),referencePath:It("string")};class Ms extends Yr{constructor(e,t,i){super(e,t,th(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ct(this.firestore,null,new _e(e))}withConverter(e){return new Ms(this.firestore,e,this._path)}}function Ip(r,e,...t){if(r=gt(r),Gv("collection","path",e),r instanceof ch){const i=Qe.fromString(e,...t);return Vy(i),new Ms(r,null,i)}{if(!(r instanceof ct||r instanceof Ms))throw new se(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Qe.fromString(e,...t));return Vy(i),new Ms(r.firestore,null,i)}}function jr(r,e,...t){if(r=gt(r),arguments.length===1&&(e=Gf.newId()),Gv("doc","path",e),r instanceof ch){const i=Qe.fromString(e,...t);return Dy(i),new ct(r,null,new _e(i))}{if(!(r instanceof ct||r instanceof Ms))throw new se(q.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Qe.fromString(e,...t));return Dy(i),new ct(r.firestore,r instanceof Ms?r.converter:null,new _e(i))}}/**
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
 */const T_="AsyncQueue";class I_{constructor(e=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new U0(this,"async_queue_retry"),this.cc=()=>{const i=ef();i&&re(T_,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this.lc=e;const t=ef();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hc(),this.Pc(e)}enterRestrictedMode(e){if(!this.rc){this.rc=!0,this.ac=e||!1;const t=ef();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.cc)}}enqueue(e){if(this.hc(),this.rc)return new Promise((()=>{}));const t=new $r;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.nc.push(e),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(e){if(!Wo(e))throw e;re(T_,"Operation failed with retryable error: "+e)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(e){const t=this.lc.then((()=>(this._c=!0,e().catch((i=>{throw this.oc=i,this._c=!1,Kr("INTERNAL UNHANDLED ERROR: ",x_(i)),i})).then((i=>(this._c=!1,i))))));return this.lc=t,t}enqueueAfterDelay(e,t,i){this.hc(),this.uc.indexOf(e)>-1&&(t=0);const o=pp.createAndSchedule(this,e,t,i,(l=>this.Ic(l)));return this.sc.push(o),o}hc(){this.oc&&Ae(47125,{Ec:x_(this.oc)})}verifyOperationInProgress(){}async Rc(){let e;do e=this.lc,await e;while(e!==this.lc)}Ac(e){for(const t of this.sc)if(t.timerId===e)return!0;return!1}Vc(e){return this.Rc().then((()=>{this.sc.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.sc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Rc()}))}dc(e){this.uc.push(e)}Ic(e){const t=this.sc.indexOf(e);this.sc.splice(t,1)}}function x_(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class qs extends ch{constructor(e,t,i,o){super(e,t,i,o),this.type="firestore",this._queue=new I_,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new I_(e),this._firestoreClient=void 0,await e}}}function HC(r,e){const t=typeof r=="object"?r:nv(),i=typeof r=="string"?r:Cc,o=Lf(t,"firestore").getImmediate({identifier:i});if(!o._initialized){const l=qT("firestore");l&&$C(o,...l)}return o}function hh(r){if(r._terminated)throw new se(q.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||qC(r),r._firestoreClient}function qC(r){var i,o,l,h;const e=r._freezeSettings(),t=BC(r._databaseId,((i=r._app)==null?void 0:i.options.appId)||"",r._persistenceKey,(o=r._app)==null?void 0:o.options.apiKey,e);r._componentsProvider||(l=e.localCache)!=null&&l._offlineComponentProvider&&((h=e.localCache)!=null&&h._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new VC(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(g){const _=g==null?void 0:g._online.build();return{_offline:g==null?void 0:g._offline.build(_),_online:_}})(r._componentsProvider))}/**
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
 */class kn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new kn(Ft.fromBase64String(e))}catch(t){throw new se(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new kn(Ft.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:kn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Al(e,kn._jsonSchema))return kn.fromBase64String(e.bytes)}}kn._jsonSchemaVersion="firestore/bytes/1.0",kn._jsonSchema={type:It("string",kn._jsonSchemaVersion),bytes:It("string")};/**
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
 */class xp{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new se(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new jt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class dh{constructor(e){this._methodName=e}}/**
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
 */class pr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new se(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new se(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return De(this._lat,e._lat)||De(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:pr._jsonSchemaVersion}}static fromJSON(e){if(Al(e,pr._jsonSchema))return new pr(e.latitude,e.longitude)}}pr._jsonSchemaVersion="firestore/geoPoint/1.0",pr._jsonSchema={type:It("string",pr._jsonSchemaVersion),latitude:It("number"),longitude:It("number")};/**
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
 */class Bn{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,o){if(i.length!==o.length)return!1;for(let l=0;l<i.length;++l)if(i[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Bn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Al(e,Bn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Bn(e.vectorValues);throw new se(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Bn._jsonSchemaVersion="firestore/vectorValue/1.0",Bn._jsonSchema={type:It("string",Bn._jsonSchemaVersion),vectorValues:It("object")};/**
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
 */const WC=/^__.*__$/;class KC{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new Js(e,this.data,this.fieldMask,t,this.fieldTransforms):new kl(e,this.data,t,this.fieldTransforms)}}class iw{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return new Js(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function ow(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Ae(40011,{dataSource:r})}}class Sp{constructor(e,t,i,o,l,h){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=o,l===void 0&&this.mc(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Sp({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.yc(e),i}wc(e){var o;const t=(o=this.path)==null?void 0:o.child(e),i=this.i({path:t,arrayElement:!1});return i.mc(),i}Sc(e){return this.i({path:void 0,arrayElement:!0})}bc(e){return Uc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}mc(){if(this.path)for(let e=0;e<this.path.length;e++)this.yc(this.path.get(e))}yc(e){if(e.length===0)throw this.bc("Document fields must not be empty");if(ow(this.dataSource)&&WC.test(e))throw this.bc('Document fields cannot begin and end with "__"')}}class GC{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||ah(e)}V(e,t,i,o=!1){return new Sp({dataSource:e,methodName:t,targetDoc:i,path:jt.emptyPath(),arrayElement:!1,hasConverter:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ap(r){const e=r._freezeSettings(),t=ah(r._databaseId);return new GC(r._databaseId,!!e.ignoreUndefinedProperties,t)}function QC(r,e,t,i,o,l={}){const h=r.V(l.merge||l.mergeFields?2:0,e,t,o);Cp("Data must be an object, but it was:",h,i);const f=aw(i,h);let g,_;if(l.merge)g=new gn(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const w=[];for(const I of l.mergeFields){const A=Oi(e,I,t);if(!h.contains(A))throw new se(q.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);cw(w,A)||w.push(A)}g=new gn(w),_=h.fieldTransforms.filter((I=>g.covers(I.field)))}else g=null,_=h.fieldTransforms;return new KC(new sn(f),g,_)}class fh extends dh{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.bc(`${this._methodName}() can only appear at the top level of your update data`):e.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof fh}}class kp extends dh{_toFieldTransform(e){return new OA(e.path,new dl)}isEqual(e){return e instanceof kp}}function JC(r,e,t,i){const o=r.V(1,e,t);Cp("Data must be an object, but it was:",o,i);const l=[],h=sn.empty();Qs(i,((g,_)=>{const w=uw(e,g,t);_=gt(_);const I=o.wc(w);if(_ instanceof fh)l.push(w);else{const A=bl(_,I);A!=null&&(l.push(w),h.set(w,A))}}));const f=new gn(l);return new iw(h,f,o.fieldTransforms)}function YC(r,e,t,i,o,l){const h=r.V(1,e,t),f=[Oi(e,i,t)],g=[o];if(l.length%2!=0)throw new se(q.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<l.length;A+=2)f.push(Oi(e,l[A])),g.push(l[A+1]);const _=[],w=sn.empty();for(let A=f.length-1;A>=0;--A)if(!cw(_,f[A])){const j=f[A];let W=g[A];W=gt(W);const K=h.wc(j);if(W instanceof fh)_.push(j);else{const $=bl(W,K);$!=null&&(_.push(j),w.set(j,$))}}const I=new gn(_);return new iw(w,I,h.fieldTransforms)}function XC(r,e,t,i=!1){return bl(t,r.V(i?4:3,e))}function bl(r,e){if(lw(r=gt(r)))return Cp("Unsupported field value:",e,r),aw(r,e);if(r instanceof dh)return(function(i,o){if(!ow(o.dataSource))throw o.bc(`${i._methodName}() can only be used with update() and set()`);if(!o.path)throw o.bc(`${i._methodName}() is not currently supported inside arrays`);const l=i._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.bc("Nested arrays are not supported");return(function(i,o){const l=[];let h=0;for(const f of i){let g=bl(f,o.Sc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(i,o){if((i=gt(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return bA(o.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const l=Ze.fromDate(i);return{timestampValue:Oc(o.serializer,l)}}if(i instanceof Ze){const l=new Ze(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Oc(o.serializer,l)}}if(i instanceof pr)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof kn)return{bytesValue:C0(o.serializer,i._byteString)};if(i instanceof ct){const l=o.databaseId,h=i.firestore._databaseId;if(!h.isEqual(l))throw o.bc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:ip(i.firestore._databaseId||o.databaseId,i._key.path)}}if(i instanceof Bn)return(function(h,f){const g=h instanceof Bn?h.toArray():h;return{mapValue:{fields:{[r0]:{stringValue:s0},[Rc]:{arrayValue:{values:g.map((w=>{if(typeof w!="number")throw f.bc("VectorValues must only contain numeric values.");return sh(f.serializer,w)}))}}}}}})(i,o);if(O0(i))return i._toProto(o.serializer);throw o.bc(`Unsupported field value: ${Yc(i)}`)})(r,e)}function aw(r,e){const t={};return Yv(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Qs(r,((i,o)=>{const l=bl(o,e.gc(i));l!=null&&(t[i]=l)})),{mapValue:{fields:t}}}function lw(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ze||r instanceof pr||r instanceof kn||r instanceof ct||r instanceof dh||r instanceof Bn||O0(r))}function Cp(r,e,t){if(!lw(t)||!Qv(t)){const i=Yc(t);throw i==="an object"?e.bc(r+" a custom object"):e.bc(r+" "+i)}}function Oi(r,e,t){if((e=gt(e))instanceof xp)return e._internalPath;if(typeof e=="string")return uw(r,e);throw Uc("Field path arguments must be of type string or ",r,!1,void 0,t)}const ZC=new RegExp("[~\\*/\\[\\]]");function uw(r,e,t){if(e.search(ZC)>=0)throw Uc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new xp(...e.split("."))._internalPath}catch{throw Uc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Uc(r,e,t,i,o){const l=i&&!i.isEmpty(),h=o!==void 0;let f=`Function ${e}() called with invalid data`;t&&(f+=" (via `toFirestore()`)"),f+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${i}`),h&&(g+=` in document ${o}`),g+=")"),new se(q.INVALID_ARGUMENT,f+r+g)}function cw(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class eR{convertValue(e,t="none"){switch(zs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return mt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Us(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Ae(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return Qs(e,((o,l)=>{i[o]=this.convertValue(l,t)})),i}convertVectorValue(e){var i,o,l;const t=(l=(o=(i=e.fields)==null?void 0:i[Rc].arrayValue)==null?void 0:o.values)==null?void 0:l.map((h=>mt(h.doubleValue)));return new Bn(t)}convertGeoPoint(e){return new pr(mt(e.latitude),mt(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=eh(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(al(e));default:return null}}convertTimestamp(e){const t=Fs(e);return new Ze(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=Qe.fromString(e);ze(V0(i),9688,{name:e});const o=new ll(i.get(1),i.get(3)),l=new _e(i.popFirst(5));return o.isEqual(t)||Kr(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
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
 */class Rp extends eR{constructor(e){super(),this.firestore=e}convertBytes(e){return new kn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ct(this.firestore,null,t)}}function Pf(){return new kp("serverTimestamp")}const S_="@firebase/firestore",A_="4.15.0";/**
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
 */function k_(r){return(function(t,i){if(typeof t!="object"||t===null)return!1;const o=t;for(const l of i)if(l in o&&typeof o[l]=="function")return!0;return!1})(r,["next","error","complete"])}/**
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
 */class hw{constructor(e,t,i,o,l){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new tR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Oi("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class tR extends hw{data(){return super.data()}}/**
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
 */function dw(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new se(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Pp{}class Np extends Pp{}function bp(r,e,...t){let i=[];e instanceof Pp&&i.push(e),i=i.concat(t),(function(l){const h=l.filter((g=>g instanceof Dp)).length,f=l.filter((g=>g instanceof ph)).length;if(h>1||h>0&&f>0)throw new se(q.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const o of i)r=o._apply(r);return r}class ph extends Np{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new ph(e,t,i)}_apply(e){const t=this._parse(e);return mw(e._query,t),new Yr(e.firestore,e.converter,vf(e._query,t))}_parse(e){const t=Ap(e.firestore);return(function(l,h,f,g,_,w,I){let A;if(_.isKeyField()){if(w==="array-contains"||w==="array-contains-any")throw new se(q.INVALID_ARGUMENT,`Invalid Query. You can't perform '${w}' queries on documentId().`);if(w==="in"||w==="not-in"){R_(I,w);const W=[];for(const K of I)W.push(C_(g,l,K));A={arrayValue:{values:W}}}else A=C_(g,l,I)}else w!=="in"&&w!=="not-in"&&w!=="array-contains-any"||R_(I,w),A=XC(f,h,I,w==="in"||w==="not-in");return Tt.create(_,w,A)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function fw(r,e,t){const i=e,o=Oi("where",r);return ph._create(o,i,t)}class Dp extends Pp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Dp(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:$n.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const f=l.getFlattenedFilters();for(const g of f)mw(h,g),h=vf(h,g)})(e._query,t),new Yr(e.firestore,e.converter,vf(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Vp extends Np{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Vp(e,t)}_apply(e){const t=(function(o,l,h){if(o.startAt!==null)throw new se(q.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new se(q.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new hl(l,h)})(e._query,this._field,this._direction);return new Yr(e.firestore,e.converter,xA(e._query,t))}}function nR(r,e="asc"){const t=e,i=Oi("orderBy",r);return Vp._create(i,t)}class Op extends Np{constructor(e,t,i){super(),this.type=e,this._limit=t,this._limitType=i}static _create(e,t,i){return new Op(e,t,i)}_apply(e){return new Yr(e.firestore,e.converter,Nc(e._query,this._limit,this._limitType))}}function pw(r){return Op._create("limit",r,"F")}function C_(r,e,t){if(typeof(t=gt(t))=="string"){if(t==="")throw new se(q.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!f0(e)&&t.indexOf("/")!==-1)throw new se(q.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(Qe.fromString(t));if(!_e.isDocumentKey(i))throw new se(q.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return By(r,new _e(i))}if(t instanceof ct)return By(r,t._key);throw new se(q.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Yc(t)}.`)}function R_(r,e){if(!Array.isArray(r)||r.length===0)throw new se(q.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function mw(r,e){const t=(function(o,l){for(const h of o)for(const f of h.getFlattenedFilters())if(l.indexOf(f.op)>=0)return f.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new se(q.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new se(q.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function rR(r,e,t){let i;return i=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,i}class Ya{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ki extends hw{constructor(e,t,i,o,l,h){super(e,t,i,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new gc(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(Oi("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new se(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ki._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}ki._jsonSchemaVersion="firestore/documentSnapshot/1.0",ki._jsonSchema={type:It("string",ki._jsonSchemaVersion),bundleSource:It("string","DocumentSnapshot"),bundleName:It("string"),bundle:It("string")};class gc extends ki{data(e={}){return super.data(e)}}class Ci{constructor(e,t,i,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Ya(o.hasPendingWrites,o.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new gc(this._firestore,this._userDataWriter,i.key,i,new Ya(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new se(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((f=>{const g=new gc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ya(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>l||f.type!==3)).map((f=>{const g=new gc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ya(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,w=-1;return f.type!==0&&(_=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),w=h.indexOf(f.doc.key)),{type:sR(f.type),doc:g,oldIndex:_,newIndex:w}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new se(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Ci._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Gf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),i.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function sR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Ae(61501,{type:r})}}/**
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
 */Ci._jsonSchemaVersion="firestore/querySnapshot/1.0",Ci._jsonSchema={type:It("string",Ci._jsonSchemaVersion),bundleSource:It("string","QuerySnapshot"),bundleName:It("string"),bundle:It("string")};/**
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
 */function gw(r){r=yn(r,ct);const e=yn(r.firestore,qs),t=hh(e);return jC(t,r._key).then((i=>_w(e,r,i)))}function yw(r){r=yn(r,Yr);const e=yn(r.firestore,qs),t=hh(e),i=new Rp(e);return dw(r._query),FC(t,r._query).then((o=>new Ci(e,i,r,o)))}function Nf(r,e,t){r=yn(r,ct);const i=yn(r.firestore,qs),o=rR(r.converter,e,t),l=Ap(i);return Lp(i,[QC(l,"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,zn.none())])}function zc(r,e,t,...i){r=yn(r,ct);const o=yn(r.firestore,qs),l=Ap(o);let h;return h=typeof(e=gt(e))=="string"||e instanceof xp?YC(l,"updateDoc",r._key,e,t,i):JC(l,"updateDoc",r._key,e),Lp(o,[h.toMutation(r._key,zn.exists(!0))])}function Xa(r){return Lp(yn(r.firestore,qs),[new np(r._key,zn.none())])}function iR(r,...e){var _,w,I;r=gt(r);let t={includeMetadataChanges:!1,source:"default"},i=0;typeof e[i]!="object"||k_(e[i])||(t=e[i++]);const o={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(k_(e[i])){const A=e[i];e[i]=(_=A.next)==null?void 0:_.bind(A),e[i+1]=(w=A.error)==null?void 0:w.bind(A),e[i+2]=(I=A.complete)==null?void 0:I.bind(A)}let l,h,f;if(r instanceof ct)h=yn(r.firestore,qs),f=th(r._key.path),l={next:A=>{e[i]&&e[i](_w(h,r,A))},error:e[i+1],complete:e[i+2]};else{const A=yn(r,Yr);h=yn(A.firestore,qs),f=A._query;const j=new Rp(h);l={next:W=>{e[i]&&e[i](new Ci(h,j,A,W))},error:e[i+1],complete:e[i+2]},dw(r._query)}const g=hh(h);return MC(g,f,o,l)}function Lp(r,e){const t=hh(r);return UC(t,e)}function _w(r,e,t){const i=t.docs.get(e._key),o=new Rp(r);return new ki(r,o,e._key,i,new Ya(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){jS(Bo),Oo(new Pi("firestore",((i,{instanceIdentifier:o,options:l})=>{const h=i.getProvider("app").getImmediate(),f=new qs(new zS(i.getProvider("auth-internal")),new HS(h,i.getProvider("app-check-internal")),aA(h,o),h);return l={useFetchStreams:t,...l},f._setSettings(l),f}),"PUBLIC").setMultipleInstances(!0)),Os(S_,A_,e),Os(S_,A_,"esm2020")})();const oR={apiKey:"AIzaSyD05YrLl8ll974Yvh_m9VjLiiYyhpf6FBw",authDomain:"p-chats-26652.firebaseapp.com",projectId:"p-chats-26652",storageBucket:"p-chats-26652.firebasestorage.app",messagingSenderId:"277447074008",appId:"1:277447074008:web:da2e5b56682e43161077ad"},vw=tv(oR),zo=VS(vw),An=HC(vw);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aR=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ww=(...r)=>r.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var lR={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uR=Q.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:o="",children:l,iconNode:h,...f},g)=>Q.createElement("svg",{ref:g,...lR,width:e,height:e,stroke:r,strokeWidth:i?Number(t)*24/Number(e):t,className:ww("lucide",o),...f},[...h.map(([_,w])=>Q.createElement(_,w)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=(r,e)=>{const t=Q.forwardRef(({className:i,...o},l)=>Q.createElement(uR,{ref:l,iconNode:e,className:ww(`lucide-${aR(r)}`,i),...o}));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ew=st("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cR=st("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hR=st("CircleMinus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gl=st("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yl=st("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dR=st("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yc=st("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Li=st("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P_=st("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fR=st("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yr=st("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pR=st("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tw=st("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bc=st("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mR=st("Paperclip",[["path",{d:"M13.234 20.252 21 12.3",key:"1cbrk9"}],["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",key:"1pkts6"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gR=st("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yR=st("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _R=st("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N_=st("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vR=st("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wR=st("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iw=st("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ER=st("Undo2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b_=st("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);function TR({onRegister:r}){const[e,t]=Q.useState(""),[i,o]=Q.useState(""),[l,h]=Q.useState(!1),[f,g]=Q.useState(!1),_=async()=>{h(!0);try{await $x(zo,new Mr)}catch(I){He.error(I.message||"Google 登入失敗")}finally{h(!1)}},w=async I=>{if(I.preventDefault(),!e||!i){He.error("請填寫電子郵件和密碼");return}h(!0);try{await yx(zo,e,i)}catch(A){He.error(A.message||"登入失敗")}finally{h(!1)}};return E.jsx("div",{className:"min-h-full flex items-center justify-center bg-gray-950 px-4 py-8",children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-8",children:[E.jsxs("div",{className:"text-center mb-8",children:[E.jsx("div",{className:"inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 rounded-full mb-3",children:E.jsx(Li,{className:"w-10 h-10 text-orange-500"})}),E.jsx("h1",{className:"text-2xl font-bold text-white",children:"P Chats"}),E.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"端到端加密 · 訊息不存伺服器 · 閱後即焚"})]}),E.jsxs("button",{onClick:_,disabled:l,className:"w-full flex items-center justify-center gap-3 border border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50 mb-5",children:[E.jsxs("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",children:[E.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),E.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),E.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),E.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]}),"使用 Google 帳號登入"]}),E.jsxs("div",{className:"relative mb-5",children:[E.jsx("div",{className:"absolute inset-0 flex items-center",children:E.jsx("div",{className:"w-full border-t border-gray-800"})}),E.jsx("div",{className:"relative flex justify-center text-xs",children:E.jsx("span",{className:"px-3 bg-gray-900 text-gray-500",children:"或使用帳號密碼"})})]}),E.jsxs("form",{onSubmit:w,className:"space-y-3",children:[E.jsxs("div",{className:"relative",children:[E.jsx(Tw,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:"email",placeholder:"電子郵件",value:e,onChange:I=>t(I.target.value),className:"w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"})]}),E.jsxs("div",{className:"relative",children:[E.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:f?"text":"password",placeholder:"密碼",value:i,onChange:I=>o(I.target.value),className:"w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"}),E.jsx("button",{type:"button",onClick:()=>g(!f),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300",children:f?E.jsx(gl,{className:"w-4 h-4"}):E.jsx(yl,{className:"w-4 h-4"})})]}),E.jsx("button",{type:"submit",disabled:l,className:"w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center",children:l?E.jsx("span",{className:"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"}):"登入"})]}),E.jsxs("p",{className:"text-center text-sm text-gray-500 mt-4",children:["還沒有帳號？"," ",E.jsx("button",{onClick:r,className:"text-orange-500 font-medium hover:underline",children:"點此註冊"})]})]})})}function IR({onBack:r}){const[e,t]=Q.useState(""),[i,o]=Q.useState(""),[l,h]=Q.useState(""),[f,g]=Q.useState(""),[_,w]=Q.useState(!1),[I,A]=Q.useState(!1),j=async K=>{if(K.preventDefault(),!e||!i||!l||!f){He.error("請填寫所有欄位");return}if(l!==f){He.error("兩次輸入的密碼不一致");return}if(l.length<6){He.error("密碼長度至少 6 個字元");return}w(!0);try{const $=await gx(zo,i,l);await kv($.user,{displayName:e})}catch($){const me=$.code;me==="auth/email-already-in-use"?He.error("此電子郵件已被使用"):me==="auth/invalid-email"?He.error("電子郵件格式不正確"):me==="auth/weak-password"?He.error("密碼強度不足"):He.error($.message||"註冊失敗")}finally{w(!1)}},W="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";return E.jsx("div",{className:"min-h-full flex items-center justify-center bg-gray-950 px-4 py-8",children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-8",children:[E.jsxs("button",{onClick:r,className:"flex items-center gap-1 text-gray-500 hover:text-gray-300 mb-6 text-sm transition-colors",children:[E.jsx(Ew,{className:"w-4 h-4"})," 返回登入"]}),E.jsxs("div",{className:"text-center mb-7",children:[E.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-3",children:E.jsx(b_,{className:"w-8 h-8 text-orange-500"})}),E.jsx("h1",{className:"text-xl font-bold text-white",children:"建立帳號"})]}),E.jsxs("form",{onSubmit:j,className:"space-y-3",children:[E.jsxs("div",{className:"relative",children:[E.jsx(b_,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:"text",placeholder:"顯示名稱",value:e,onChange:K=>t(K.target.value),className:W})]}),E.jsxs("div",{className:"relative",children:[E.jsx(Tw,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:"email",placeholder:"電子郵件",value:i,onChange:K=>o(K.target.value),className:W})]}),E.jsxs("div",{className:"relative",children:[E.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:I?"text":"password",placeholder:"密碼（至少 6 字元）",value:l,onChange:K=>h(K.target.value),className:"w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"}),E.jsx("button",{type:"button",onClick:()=>A(!I),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300",children:I?E.jsx(gl,{className:"w-4 h-4"}):E.jsx(yl,{className:"w-4 h-4"})})]}),E.jsxs("div",{className:"relative",children:[E.jsx(yr,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:I?"text":"password",placeholder:"確認密碼",value:f,onChange:K=>g(K.target.value),className:W})]}),E.jsx("button",{type:"submit",disabled:_,className:"w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center mt-1",children:_?E.jsx("span",{className:"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"}):"建立帳號"})]})]})})}const rc=r=>btoa(String.fromCharCode(...new Uint8Array(r instanceof ArrayBuffer?r:r.buffer,r.byteOffset,r.byteLength))),sc=r=>Uint8Array.from(atob(r),e=>e.charCodeAt(0));class xR{constructor(){Gu(this,"keyPair",null);Gu(this,"_publicKeyBase64","");Gu(this,"sharedSecrets",new Map)}async generateKeyPair(){this.keyPair=await crypto.subtle.generateKey({name:"X25519"},!0,["deriveKey"]);const e=await crypto.subtle.exportKey("raw",this.keyPair.publicKey);this._publicKeyBase64=rc(e)}get publicKeyBase64(){return this._publicKeyBase64}async getSharedSecret(e,t){const i=this.sharedSecrets.get(e);if(i)return i;const o=await crypto.subtle.importKey("raw",sc(t),{name:"X25519"},!1,[]),l=await crypto.subtle.deriveKey({name:"X25519",public:o},this.keyPair.privateKey,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"]);return this.sharedSecrets.set(e,l),l}async encrypt(e,t){const i=crypto.getRandomValues(new Uint8Array(12)),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:i,tagLength:128},t,new TextEncoder().encode(e)),l=new Uint8Array(o),h=l.slice(0,l.length-16),f=l.slice(l.length-16);return{ct:rc(h),nonce:rc(i),mac:rc(f)}}async decrypt(e,t){const i=sc(e.ct),o=sc(e.mac),l=new Uint8Array(i.length+o.length);l.set(i),l.set(o,i.length);const h=await crypto.subtle.decrypt({name:"AES-GCM",iv:sc(e.nonce),tagLength:128},t,l);return new TextDecoder().decode(h)}clearSharedSecret(e){this.sharedSecrets.delete(e)}}const Lr=new xR;async function $c(r){const e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(r));return btoa(String.fromCharCode(...new Uint8Array(e)))}const Hc=r=>localStorage.getItem(`pchat_lock_${r}`),xw=(r,e)=>localStorage.setItem(`pchat_lock_${r}`,e),SR=r=>localStorage.removeItem(`pchat_lock_${r}`),Sw=location.hostname==="localhost"?"localhost":location.hostname;async function Aw(){if(!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}async function kw(r,e){try{const t=crypto.getRandomValues(new Uint8Array(32)),i=await navigator.credentials.create({publicKey:{challenge:t,rp:{id:Sw,name:"P Chats"},user:{id:new TextEncoder().encode(`${e}_${r}`),name:`pchat_${r.slice(0,8)}`,displayName:"P Chats 聊天室鎖"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"preferred"},timeout:6e4}});if(!i)return!1;const o=btoa(String.fromCharCode(...new Uint8Array(i.rawId)));return localStorage.setItem(`pchat_biometric_cred_${r}`,o),localStorage.setItem(`pchat_biometric_${r}`,"1"),!0}catch{return!1}}async function AR(r){const e=localStorage.getItem(`pchat_biometric_cred_${r}`);if(!e)return!1;try{const t=Uint8Array.from(atob(e),l=>l.charCodeAt(0)),i=crypto.getRandomValues(new Uint8Array(32));return!!await navigator.credentials.get({publicKey:{challenge:i,allowCredentials:[{type:"public-key",id:t}],userVerification:"required",rpId:Sw,timeout:6e4}})}catch{return!1}}function Cw(r){return localStorage.getItem(`pchat_biometric_${r}`)==="1"}function D_(r){localStorage.removeItem(`pchat_biometric_${r}`),localStorage.removeItem(`pchat_biometric_cred_${r}`)}const Dl="http://localhost:3001";async function mh(){var e;const r=await((e=zo.currentUser)==null?void 0:e.getIdToken());if(!r)throw new Error("Not authenticated");return{Authorization:`Bearer ${r}`}}async function kR(r,e,t){const i=await fetch(`${Dl}/api/messages`,{method:"POST",headers:{"Content-Type":"application/json",...await mh()},body:JSON.stringify({to:r,...e,burnTimer:t})});if(!i.ok)throw new Error("Failed to cache message");return i.json()}async function V_(r){const e=await fetch(`${Dl}/api/messages/${r}`,{headers:await mh()});if(!e.ok)throw new Error("Message unavailable");return e.json()}async function CR(r,e){if(!(await fetch(`${Dl}/api/messages/${r}`,{method:"PUT",headers:{"Content-Type":"application/json",...await mh()},body:JSON.stringify(e)})).ok)throw new Error("Failed to edit cached message")}async function qa(r){try{await fetch(`${Dl}/api/messages/${r}`,{method:"DELETE",headers:await mh()})}catch{}}function RR(r){return`${String(r.getHours()).padStart(2,"0")}:${String(r.getMinutes()).padStart(2,"0")}`}function PR(r){switch(r){case"exit":return"退出後";case"1m":return"1 分鐘";case"3m":return"3 分鐘";case"5m":return"5 分鐘";default:return""}}function NR({message:r,onLongPress:e}){const{isSentByMe:t,recalled:i,burnTimer:o,text:l,mediaUrl:h,mediaType:f,fileName:g,edited:_,isBurned:w,timestamp:I}=r,A=o!=="off";if(i)return E.jsx("div",{className:`flex mb-1 ${t?"justify-end":"justify-start"}`,children:E.jsxs("div",{className:"flex items-center gap-1.5 px-4 py-2 bg-gray-800 border border-gray-700 rounded-2xl max-w-xs",children:[E.jsx(hR,{className:"w-3.5 h-3.5 text-gray-500 flex-shrink-0"}),E.jsx("span",{className:"text-xs text-gray-500 italic",children:t?"你收回了一則訊息":"對方收回了一則訊息"})]})});const j=t?A?"bg-orange-600":"bg-blue-600":A?"bg-orange-900/60":"bg-gray-700",W=t?"rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm":"rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl";return E.jsx("div",{className:`flex mb-1 ${t?"justify-end":"justify-start"}`,children:E.jsxs("div",{className:`max-w-xs md:max-w-md ${j} ${W} ${h&&f!=="file"?"p-1":"px-3.5 py-2.5"} cursor-pointer select-none`,onContextMenu:K=>{K.preventDefault(),e==null||e()},onClick:K=>{K.detail===2&&(e==null||e())},children:[h&&f==="image"&&E.jsx("img",{src:h,alt:"圖片",className:"rounded-xl max-w-full object-cover cursor-zoom-in",style:{maxHeight:240},onClick:()=>window.open(h,"_blank")}),h&&f==="video"&&E.jsx("video",{src:h,controls:!0,className:"rounded-xl max-w-full",style:{maxHeight:240}}),h&&f==="file"&&E.jsxs("a",{href:h,target:"_blank",rel:"noreferrer",className:"flex items-center gap-2 py-1 hover:opacity-70 transition-opacity",children:[E.jsx(dR,{className:"w-7 h-7 text-orange-400 flex-shrink-0"}),E.jsx("span",{className:"text-sm text-blue-300 underline truncate max-w-[200px]",children:g||"檔案"})]}),l&&E.jsxs("div",{className:`flex items-start gap-1.5 ${h?"px-2.5 pt-1.5 pb-1":""}`,children:[A&&E.jsx(Li,{className:"w-3.5 h-3.5 text-orange-300 flex-shrink-0 mt-0.5"}),E.jsx("p",{className:"text-sm text-white leading-relaxed whitespace-pre-wrap break-words",children:l})]}),E.jsxs("div",{className:`flex items-center gap-1.5 mt-0.5 ${h&&f!=="file"?"px-2.5 pb-1.5":""}`,children:[!l&&A&&E.jsx(Li,{className:"w-3 h-3 text-orange-300"}),E.jsx("span",{className:"text-[10px] text-white/50",children:RR(I)}),_&&E.jsx("span",{className:"text-[10px] text-white/40",children:"已編輯"}),A&&E.jsx("span",{className:"text-[10px] text-orange-300",children:PR(o)}),w&&E.jsx("span",{className:"text-[10px] text-orange-400",children:"已焚燒"})]})]})})}const O_={off:"關閉焚燒",exit:"對方退出後","1m":"1 分鐘後","3m":"3 分鐘後","5m":"5 分鐘後"},L_={"1m":6e4,"3m":18e4,"5m":3e5};function bR(r,e){return[r,e].sort().join("_")}function DR({user:r,peer:e,onClose:t,onLock:i}){const[o,l]=Q.useState([]),[h,f]=Q.useState(""),[g,_]=Q.useState("off"),[w,I]=Q.useState(!1),[A,j]=Q.useState(!1),[W,K]=Q.useState(0),[$,me]=Q.useState(!1),[ae,ce]=Q.useState(null),[xe,Te]=Q.useState(null),[de,k]=Q.useState(!1),x=Q.useRef(null),R=Q.useRef(null),b=Q.useRef(null),P=bR(r.uid,e.userId),O=Q.useRef(new Set);Q.useEffect(()=>{let H=!1;return(async()=>{var Z,V;try{const z=jr(An,"users",r.uid),le=await gw(z);(!le.exists()||!((Z=le.data())!=null&&Z.publicKey)||((V=le.data())==null?void 0:V.publicKey)!==Lr.publicKeyBase64)&&await Nf(z,{displayName:r.displayName||r.email||"Unknown",photoURL:r.photoURL||"",publicKey:Lr.publicKeyBase64,lastSeen:Pf()},{merge:!0}),e.publicKey&&(b.current=await Lr.getSharedSecret(e.userId,e.publicKey)),H||me(!0)}catch(z){console.error(z),H||me(!0)}})(),()=>{H=!0}},[r,e]),Q.useEffect(()=>{if(!$)return;const H=bp(Ip(An,"chats",P,"messages"),nR("timestamp")),ne=iR(H,async Z=>{var V;for(const z of Z.docChanges()){if(z.type==="added"){const le=z.doc.data(),ge=le.from,pe=ge===r.uid,ye=le.burnTimer||"off";if(le.recalled){l(et=>{var tt;return et.find(at=>at.documentId===z.doc.id)?et:[...et,{documentId:z.doc.id,from:ge,to:le.to,text:"",timestamp:((tt=le.timestamp)==null?void 0:tt.toDate())??new Date,burnTimer:ye,isBurned:!1,isSentByMe:pe,recalled:!0,edited:!1}]}),qa(z.doc.id),pe||Xa(z.doc.ref).catch(()=>{});continue}let ve="",Ne,Ie,Be;try{if(b.current){const et=await V_(z.doc.id),tt=await Lr.decrypt(et,b.current),at=JSON.parse(tt);ve=at.text||"",Ne=at.mediaUrl,Ie=at.mediaType,Be=at.fileName}}catch{}const ht={documentId:z.doc.id,from:ge,to:le.to,text:ve,timestamp:((V=le.timestamp)==null?void 0:V.toDate())??new Date,burnTimer:ye,mediaUrl:Ne,mediaType:Ie,fileName:Be,isBurned:!1,isSentByMe:pe,recalled:!1,edited:le.edited||!1};if(l(et=>{const tt=et.findIndex(at=>at.documentId===ht.documentId);if(tt>=0){const at=[...et];return at[tt]={...et[tt],...ht,text:ht.text||et[tt].text,mediaUrl:ht.mediaUrl??et[tt].mediaUrl,mediaType:ht.mediaType??et[tt].mediaType,fileName:ht.fileName??et[tt].fileName},at}return[...et,ht]}),ye!=="off"&&ye!=="exit"&&L_[ye]){const et=z.doc.ref,tt=z.doc.id;setTimeout(()=>{l(at=>at.map(Hn=>Hn.documentId===tt?{...Hn,isBurned:!0}:Hn)),setTimeout(()=>{l(at=>at.filter(Hn=>Hn.documentId!==tt)),pe||Xa(et).catch(()=>{})},800)},L_[ye])}!pe&&ye==="exit"&&O.current.add(z.doc.id)}if(z.type==="modified"){const le=z.doc.data();if(le.recalled)l(ge=>ge.map(pe=>pe.documentId===z.doc.id?{...pe,recalled:!0}:pe)),setTimeout(()=>l(ge=>ge.filter(pe=>pe.documentId!==z.doc.id)),800),qa(z.doc.id),Xa(z.doc.ref).catch(()=>{});else if(le.edited&&!le.recalled&&b.current&&le.from!==r.uid)try{const pe=await V_(z.doc.id),ye=await Lr.decrypt(pe,b.current),ve=JSON.parse(ye);l(Ne=>Ne.map(Ie=>Ie.documentId===z.doc.id?{...Ie,text:ve.text||"",edited:!0}:Ie))}catch{}}if(z.type==="removed"){const ge=z.doc.data().burnTimer,pe=z.doc.id;ge!=="off"?(l(ye=>ye.map(ve=>ve.documentId===pe?{...ve,isBurned:!0}:ve)),setTimeout(()=>l(ye=>ye.filter(ve=>ve.documentId!==pe)),800)):l(ye=>ye.filter(ve=>ve.documentId!==pe))}}});return()=>{ne(),O.current.forEach(Z=>{qa(Z),Xa(jr(An,"chats",P,"messages",Z)).catch(()=>{})})}},[$,P,r.uid,e.userId]),Q.useEffect(()=>{var H;(H=x.current)==null||H.scrollIntoView({behavior:"smooth"})},[o]);const C=Q.useCallback(async(H,ne,Z,V)=>{const z=(H??h).trim();if(!z&&!ne)return;if(f(""),!b.current){He.error("尚未建立加密金鑰");return}const le=JSON.stringify({text:z,mediaUrl:ne,mediaType:Z,fileName:V});let ge;try{ge=await Lr.encrypt(le,b.current)}catch{He.error("加密失敗");return}let pe=null;try{pe=await kR(e.userId,ge,g)}catch{He.error("發送失敗，請確認後端伺服器是否啟動");return}const ye={from:r.uid,to:e.userId,burnTimer:g,mediaType:Z||null,fileName:V||null,recalled:!1,edited:!1,timestamp:Pf()},ve=pe.id;await Nf(jr(An,"chats",P,"messages",ve),ye).catch(()=>{qa(ve),He.error("發送失敗")});const Ne={documentId:ve,from:r.uid,to:e.userId,text:z,mediaUrl:ne,mediaType:Z,fileName:V,timestamp:new Date,burnTimer:g,isBurned:!1,isSentByMe:!0,recalled:!1,edited:!1};l(Ie=>{const Be=Ie.findIndex(ht=>ht.documentId===ve);if(Be>=0){const ht=[...Ie];return ht[Be]={...Ie[Be],text:z||Ie[Be].text,mediaUrl:ne??Ie[Be].mediaUrl,mediaType:Z??Ie[Be].mediaType,fileName:V??Ie[Be].fileName},ht}return[...Ie,Ne]})},[h,g,P,r.uid,e.userId]),qe=async H=>{ce(null),await qa(H.documentId),await zc(jr(An,"chats",P,"messages",H.documentId),{recalled:!0}).catch(()=>He.error("收回失敗")),l(ne=>ne.map(Z=>Z.documentId===H.documentId?{...Z,recalled:!0}:Z)),setTimeout(()=>l(ne=>ne.filter(Z=>Z.documentId!==H.documentId)),800)},yt=async(H,ne)=>{if(b.current){try{const Z=await Lr.encrypt(JSON.stringify({text:ne}),b.current);await CR(H,Z),await zc(jr(An,"chats",P,"messages",H),{edited:!0}),l(V=>V.map(z=>z.documentId===H?{...z,text:ne,edited:!0}:z))}catch{He.error("編輯失敗")}Te(null)}},Ct=async H=>{var Z;const ne=(Z=H.target.files)==null?void 0:Z[0];if(ne){if(H.target.value="",ne.size>20*1024*1024){He.error("檔案不得超過 20 MB");return}j(!0),K(10);try{const V=await fetch(`${Dl}/api/upload-credentials`);if(!V.ok)throw new Error("Cannot reach backend");const{signature:z,timestamp:le,apiKey:ge,cloudName:pe,folder:ye}=await V.json();K(20);const ve=ne.type,Ne=ve.startsWith("video/")?"video":ve.startsWith("image/")?"image":"raw",Ie=new FormData;Ie.append("file",ne),Ie.append("api_key",ge),Ie.append("timestamp",String(le)),Ie.append("signature",z),Ie.append("folder",ye);const Be=await fetch(`https://api.cloudinary.com/v1_1/${pe}/${Ne}/upload`,{method:"POST",body:Ie});if(!Be.ok)throw new Error("Cloudinary upload failed");K(90);const ht=await Be.json(),et=ve.startsWith("image/")?"image":ve.startsWith("video/")?"video":"file";await C("",ht.secure_url,et,ne.name),K(100)}catch{He.error("上傳失敗，請確認後端伺服器是否啟動")}finally{j(!1),K(0)}}},We=g!=="off";return E.jsxs("div",{className:"flex flex-col h-full bg-gray-950",children:[E.jsxs("div",{className:"flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900 flex-shrink-0",children:[E.jsx("button",{onClick:t,className:"text-gray-500 hover:text-gray-200 transition-colors",children:E.jsx(Ew,{className:"w-5 h-5"})}),E.jsx("div",{className:"w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden",children:e.photoURL?E.jsx("img",{src:e.photoURL,alt:"",className:"w-full h-full object-cover"}):E.jsx("span",{className:"text-orange-400 font-bold text-sm",children:(e.displayName[0]||"?").toUpperCase()})}),E.jsxs("div",{className:"flex-1 min-w-0",children:[E.jsx("p",{className:"font-semibold text-white text-sm truncate",children:e.displayName}),E.jsx("p",{className:"text-[10px] text-green-400 font-medium",children:"E2E 加密"})]}),E.jsx("button",{onClick:()=>k(!0),title:"鎖定設定",className:"text-gray-500 hover:text-gray-300 transition-colors",children:E.jsx(wR,{className:"w-4 h-4"})}),E.jsx("button",{onClick:i,title:"鎖定此聊天室",className:"text-gray-500 hover:text-orange-400 transition-colors",children:E.jsx(yr,{className:"w-5 h-5"})})]}),We&&E.jsxs("div",{className:"flex items-center gap-2 px-4 py-1.5 bg-orange-950/40 border-b border-orange-900/30 flex-shrink-0",children:[E.jsx(Li,{className:"w-3.5 h-3.5 text-orange-400"}),E.jsxs("span",{className:"text-xs text-orange-400",children:["焚燒模式 — ",O_[g],"自動銷毀"]})]}),A&&E.jsx("div",{className:"h-1 bg-gray-800 flex-shrink-0",children:E.jsx("div",{className:"h-full bg-orange-500 transition-all duration-200",style:{width:`${W||5}%`}})}),E.jsxs("div",{className:"flex-1 overflow-y-auto px-4 py-4",children:[!$&&E.jsx("div",{className:"flex justify-center py-8",children:E.jsx("div",{className:"w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"})}),$&&o.length===0&&E.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center",children:[E.jsx(yr,{className:"w-10 h-10 text-gray-700 mb-3"}),E.jsx("p",{className:"text-sm text-gray-500",children:"尚無訊息"}),E.jsx("p",{className:"text-xs text-gray-600 mt-1",children:"訊息閱後即從伺服器刪除"})]}),o.map(H=>E.jsx(NR,{message:H,onLongPress:H.isSentByMe&&!H.recalled?()=>ce(H):void 0},H.documentId)),E.jsx("div",{ref:x})]}),E.jsxs("div",{className:"chat-input-bar flex-shrink-0 border-t border-gray-800 bg-gray-900",children:[w&&E.jsx("div",{className:"flex items-center gap-2 px-3 py-2 border-b border-gray-800 overflow-x-auto",children:Object.entries(O_).map(([H,ne])=>E.jsx("button",{onClick:()=>{_(H),I(!1)},className:`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors active:scale-95
                  ${g===H?"bg-orange-500 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`,children:ne},H))}),E.jsxs("div",{className:"flex items-center gap-2 px-3 py-2",children:[E.jsxs("button",{onClick:()=>I(!w),className:"flex flex-col items-center p-2 -m-1 rounded-lg touch-manipulation",children:[E.jsx(Li,{className:`w-5 h-5 ${We?"text-orange-500":"text-gray-600"}`}),E.jsx("span",{className:`text-[9px] leading-none mt-0.5 ${We?"text-orange-500":"text-gray-600"}`,children:g==="off"?"關閉":g==="exit"?"退出":g})]}),E.jsx("button",{onClick:()=>{var H;return(H=R.current)==null?void 0:H.click()},disabled:A,className:"text-gray-600 hover:text-gray-300 transition-colors p-1 disabled:opacity-40",children:E.jsx(mR,{className:"w-5 h-5"})}),E.jsx("input",{ref:R,type:"file",className:"hidden",onChange:Ct}),E.jsx("input",{type:"text",placeholder:"輸入訊息（加密傳送）...",value:h,onChange:H=>f(H.target.value),onKeyDown:H=>{H.key==="Enter"&&!H.shiftKey&&(H.preventDefault(),C())},className:"flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),E.jsx("button",{onClick:()=>C(),disabled:!h.trim()&&!A,className:"w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-40",children:E.jsx(_R,{className:"w-4 h-4 text-white"})})]})]}),ae&&E.jsx("div",{className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60",onClick:()=>ce(null),children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-t-2xl py-2",onClick:H=>H.stopPropagation(),children:[E.jsx("div",{className:"w-10 h-1 bg-gray-600 rounded-full mx-auto mb-3"}),!ae.mediaUrl&&E.jsxs("button",{onClick:()=>{Te({id:ae.documentId,text:ae.text}),ce(null)},className:"w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors",children:[E.jsx(gR,{className:"w-4 h-4"})," 編輯訊息"]}),E.jsxs("button",{onClick:()=>qe(ae),className:"w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 transition-colors",children:[E.jsx(ER,{className:"w-4 h-4"})," 收回訊息"]})]})}),xe&&E.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",onClick:()=>Te(null),children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-2xl p-5",onClick:H=>H.stopPropagation(),children:[E.jsx("h3",{className:"font-semibold text-white mb-3",children:"編輯訊息"}),E.jsx("textarea",{value:xe.text,onChange:H=>Te({...xe,text:H.target.value}),rows:3,autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"}),E.jsxs("div",{className:"flex gap-2 mt-3",children:[E.jsx("button",{onClick:()=>Te(null),className:"flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),E.jsx("button",{onClick:()=>yt(xe.id,xe.text),className:"flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})}),de&&E.jsx(VR,{peerUid:e.userId,userId:r.uid,peerName:e.displayName,onClose:()=>k(!1),onLockAndClose:()=>{k(!1),i()}}),w&&E.jsx("div",{className:"fixed inset-0 z-0",onClick:()=>I(!1)})]})}function VR({peerUid:r,userId:e,peerName:t,onClose:i,onLockAndClose:o}){const l=!!Hc(r),[h,f]=Q.useState(Cw(r)),[g,_]=Q.useState(!1),[w,I]=Q.useState("main"),[A,j]=Q.useState(""),[W,K]=Q.useState(""),[$,me]=Q.useState(""),[ae,ce]=Q.useState(!1),[xe,Te]=Q.useState(""),[de,k]=Q.useState(!1);Q.useEffect(()=>{Aw().then(_)},[]);const x=async()=>{if(h)D_(r),f(!1),He.success("指紋解鎖已停用");else{k(!0);const P=await kw(r,e);k(!1),P?(f(!0),He.success("指紋解鎖已啟用")):He.error("指紋設定失敗")}},R=async()=>{if(l){if(!A){Te("請輸入舊密碼");return}if(await $c(A)!==Hc(r)){Te("舊密碼錯誤");return}}if(W.length<4){Te("新密碼至少 4 個字元");return}if(W!==$){Te("兩次密碼不一致");return}xw(r,await $c(W)),He.success("密碼已更新"),i()},b=()=>{SR(r),D_(r),He.success("鎖定已移除"),i()};return E.jsx("div",{className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60",onClick:i,children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-t-2xl pt-2 pb-6 px-5",onClick:P=>P.stopPropagation(),children:[E.jsx("div",{className:"w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4"}),w==="main"&&E.jsxs(E.Fragment,{children:[E.jsx("h3",{className:"font-bold text-white mb-1",children:"鎖定設定"}),E.jsxs("p",{className:"text-xs text-gray-500 mb-5",children:["與 ",t," 的聊天室"]}),g&&l&&E.jsxs("button",{onClick:x,disabled:de,className:"w-full flex items-center gap-3 py-3 border-b border-gray-700",children:[E.jsx("div",{className:`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${h?"bg-orange-500":"bg-gray-600"}`,children:E.jsx("div",{className:`w-5 h-5 bg-white rounded-full shadow transition-transform ${h?"translate-x-5":"translate-x-0"}`})}),E.jsxs("div",{className:"flex-1 text-left",children:[E.jsxs("p",{className:"text-sm text-gray-200 flex items-center gap-1.5",children:[E.jsx(yc,{className:"w-4 h-4 text-orange-400"}),"指紋解鎖"]}),E.jsx("p",{className:"text-xs text-gray-500",children:h?"已啟用":"已停用"})]}),de&&E.jsx("span",{className:"w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"})]}),E.jsxs("button",{onClick:()=>{I("changePw"),Te("")},className:"w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left",children:[E.jsx(yr,{className:"w-5 h-5 text-orange-500 flex-shrink-0"}),E.jsxs("div",{className:"flex-1",children:[E.jsx("p",{className:"text-sm text-gray-200",children:l?"修改密碼":"設定密碼"}),E.jsx("p",{className:"text-xs text-gray-500",children:l?"更換此聊天室的解鎖密碼":"尚未設定密碼"})]})]}),l&&E.jsxs("button",{onClick:b,className:"w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left",children:[E.jsx(Iw,{className:"w-5 h-5 text-red-400 flex-shrink-0"}),E.jsxs("div",{className:"flex-1",children:[E.jsx("p",{className:"text-sm text-red-400",children:"移除鎖定"}),E.jsx("p",{className:"text-xs text-gray-500",children:"清除此聊天室的密碼與指紋設定"})]})]}),E.jsx("button",{onClick:o,className:"w-full mt-4 py-3 bg-gray-700 text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-600",children:"立即鎖定聊天室"})]}),w==="changePw"&&E.jsxs(E.Fragment,{children:[E.jsx("button",{onClick:()=>I("main"),className:"flex items-center gap-1 text-gray-500 hover:text-gray-300 mb-4 text-sm",children:"← 返回"}),E.jsx("h3",{className:"font-bold text-white mb-4",children:l?"修改密碼":"設定密碼"}),E.jsxs("div",{className:"space-y-3",children:[l&&E.jsxs("div",{className:"relative",children:[E.jsx("input",{type:ae?"text":"password",placeholder:"舊密碼",value:A,onChange:P=>{j(P.target.value),Te("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500",autoFocus:!0}),E.jsx("button",{type:"button",onClick:()=>ce(!ae),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:ae?E.jsx(gl,{className:"w-4 h-4"}):E.jsx(yl,{className:"w-4 h-4"})})]}),E.jsxs("div",{className:"relative",children:[E.jsx("input",{type:ae?"text":"password",placeholder:"新密碼（至少 4 字元）",value:W,onChange:P=>{K(P.target.value),Te("")},autoFocus:!l,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"}),!l&&E.jsx("button",{type:"button",onClick:()=>ce(!ae),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:ae?E.jsx(gl,{className:"w-4 h-4"}):E.jsx(yl,{className:"w-4 h-4"})})]}),E.jsx("input",{type:ae?"text":"password",placeholder:"確認新密碼",value:$,onChange:P=>{me(P.target.value),Te("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),xe&&E.jsx("p",{className:"text-xs text-red-400",children:xe}),E.jsxs("div",{className:"flex gap-2 pt-1",children:[E.jsx("button",{onClick:()=>I("main"),className:"flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),E.jsx("button",{onClick:R,className:"flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})]})]})})}function OR({user:r,size:e=10}){const t=`w-${e} h-${e}`;return E.jsx("div",{className:`${t} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0`,children:r.photoURL?E.jsx("img",{src:r.photoURL,alt:"",className:"w-full h-full object-cover"}):E.jsx("span",{className:"text-orange-700 font-bold text-sm",children:(r.displayName[0]||"?").toUpperCase()})})}function Rw({user:r,trailing:e,onClick:t}){return E.jsxs("div",{onClick:t,className:"flex items-center gap-3 p-4 border border-gray-700 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer",children:[E.jsx(OR,{user:r,size:10}),E.jsxs("div",{className:"flex-1 min-w-0",children:[E.jsx("p",{className:"font-semibold text-white text-sm truncate",children:r.displayName}),E.jsxs("p",{className:"text-xs text-orange-600 truncate",children:["@",r.userHandle]})]}),e]})}function LR({peerUid:r,userId:e,onUnlock:t,onCancel:i}){const o=!Hc(r),l=Cw(r),[h,f]=Q.useState(""),[g,_]=Q.useState(""),[w,I]=Q.useState(!1),[A,j]=Q.useState(""),[W,K]=Q.useState(!1),[$,me]=Q.useState(!1),[ae,ce]=Q.useState(!l),[xe,Te]=Q.useState(!1);Q.useEffect(()=>{Aw().then(x=>{me(x),x&&!o&&l&&ce(!1)})},[]);const de=async()=>{Te(!0);const x=await AR(r);Te(!1),x?t():(j("指紋驗證失敗，請改用密碼"),ce(!0))},k=async x=>{if(x.preventDefault(),o){if(h.length<4){j("密碼至少 4 個字元");return}if(h!==g){j("兩次密碼不一致");return}xw(r,await $c(h)),W&&$&&(await kw(r,e)||He.error("指紋設定失敗，仍可使用密碼解鎖")),t()}else{if(await $c(h)!==Hc(r)){j("密碼錯誤");return}t()}};return E.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",children:E.jsxs("div",{className:"w-full max-w-xs bg-gray-800 rounded-2xl p-6",children:[E.jsxs("div",{className:"text-center mb-5",children:[E.jsx("div",{className:"inline-flex items-center justify-center w-14 h-14 bg-orange-500/10 rounded-full mb-3",children:l&&!o?E.jsx(yc,{className:"w-7 h-7 text-orange-500"}):E.jsx(yr,{className:"w-7 h-7 text-orange-500"})}),E.jsx("h2",{className:"font-bold text-white",children:o?"設定此聊天室密碼":"解鎖聊天室"}),E.jsx("p",{className:"text-xs text-gray-400 mt-1",children:o?"此聊天室可設定獨立密碼":"此聊天室已啟用獨立鎖定"})]}),!o&&l&&!ae&&E.jsxs("div",{className:"flex flex-col items-center gap-3 mb-4",children:[E.jsx("button",{type:"button",onClick:de,disabled:xe,className:"w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center hover:bg-orange-500/20 transition-colors disabled:opacity-50",children:xe?E.jsx("span",{className:"w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"}):E.jsx(yc,{className:"w-10 h-10 text-orange-400"})}),E.jsx("p",{className:"text-sm text-gray-400",children:"觸碰以進行指紋驗證"}),E.jsx("button",{type:"button",onClick:()=>{ce(!0),j("")},className:"text-xs text-gray-500 hover:text-gray-300 underline",children:"改用密碼"})]}),(o||!l||ae)&&E.jsxs("form",{onSubmit:k,className:"space-y-3",children:[E.jsxs("div",{className:"relative",children:[E.jsx("input",{type:w?"text":"password",placeholder:o?"設定密碼（至少 4 字元）":"輸入密碼",value:h,onChange:x=>{f(x.target.value),j("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"}),E.jsx("button",{type:"button",onClick:()=>I(!w),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",children:w?E.jsx(gl,{className:"w-4 h-4"}):E.jsx(yl,{className:"w-4 h-4"})})]}),o&&E.jsx("input",{type:w?"text":"password",placeholder:"確認密碼",value:g,onChange:x=>{_(x.target.value),j("")},className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"}),o&&$&&E.jsxs("button",{type:"button",onClick:()=>K(!W),className:"w-full flex items-center gap-3 px-1 py-1",children:[E.jsx("div",{className:`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${W?"bg-orange-500":"bg-gray-600"}`,children:E.jsx("div",{className:`w-5 h-5 bg-white rounded-full shadow transition-transform ${W?"translate-x-5":"translate-x-0"}`})}),E.jsxs("span",{className:"text-sm text-gray-300 flex items-center gap-1.5",children:[E.jsx(yc,{className:"w-4 h-4 text-orange-400"}),"同時啟用指紋解鎖"]})]}),A&&E.jsx("p",{className:"text-xs text-red-400",children:A}),E.jsxs("div",{className:"flex gap-2 pt-1",children:[E.jsx("button",{type:"button",onClick:i,className:"flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),E.jsx("button",{type:"submit",className:"flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:o?"設定":"解鎖"})]})]}),!o&&l&&!ae&&E.jsx("button",{type:"button",onClick:i,className:"w-full mt-3 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"})]})})}function MR({user:r}){const[e,t]=Q.useState("home"),[i,o]=Q.useState(null),[l,h]=Q.useState(!1),[f,g]=Q.useState(null),[_,w]=Q.useState(new Set),[I,A]=Q.useState(()=>{try{const k=localStorage.getItem(`pchat_recent_${r.uid}`);return k?JSON.parse(k):[]}catch{return[]}}),[j,W]=Q.useState(null),[K,$]=Q.useState(r.displayName||""),me=Q.useRef(!1);Q.useEffect(()=>{if(me.current)return;me.current=!0,(async()=>{await Lr.generateKeyPair();const x=await ae(r);W(x)})()},[r]);const ae=async k=>{const x=jr(An,"users",k.uid),b=(await gw(x)).data();let P=b==null?void 0:b.userHandle;return P||(P=`u_${k.uid.replace(/[^a-z0-9]/g,"").substring(0,8)}`),await Nf(x,{displayName:k.displayName||k.email||"Unknown",photoURL:k.photoURL||"",publicKey:Lr.publicKeyBase64,userHandle:P,lastSeen:Pf()},{merge:!0}),P},ce=k=>{if(!_.has(k.userId)){g(k),h(!0);return}de(k),o(k)},xe=()=>{h(!1),f&&(w(k=>new Set([...k,f.userId])),de(f),o(f),g(null))},Te=()=>{i&&w(k=>{const x=new Set(k);return x.delete(i.userId),x}),o(null)},de=k=>{A(x=>{const R=[k,...x.filter(b=>b.userId!==k.userId)].slice(0,50);try{localStorage.setItem(`pchat_recent_${r.uid}`,JSON.stringify(R))}catch{}return R})};return i?E.jsx("div",{className:"h-full",children:E.jsx(DR,{user:r,peer:i,onClose:()=>o(null),onLock:Te})}):E.jsxs("div",{className:"flex h-full",children:[E.jsxs("div",{className:"max-[480px]:hidden flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 w-16 sm:w-52 transition-all",children:[E.jsxs("div",{className:"flex items-center gap-2.5 px-4 py-5 border-b border-gray-800",children:[E.jsx(Li,{className:"w-7 h-7 text-orange-500 flex-shrink-0"}),E.jsx("span",{className:"hidden sm:block text-lg font-bold text-white truncate",children:"P Chats"})]}),E.jsx("nav",{className:"flex-1 py-3 space-y-1 px-2",children:[{key:"home",label:"首頁",Icon:P_},{key:"messages",label:"訊息",Icon:Bc},{key:"settings",label:"設定",Icon:N_}].map(({key:k,label:x,Icon:R})=>E.jsxs("button",{onClick:()=>t(k),className:`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                ${e===k?"bg-orange-500/10 text-orange-400":"text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,children:[E.jsx(R,{className:"w-5 h-5 flex-shrink-0"}),E.jsx("span",{className:"hidden sm:block text-sm font-medium",children:x})]},k))}),E.jsx("div",{className:"px-3 pb-4 hidden sm:block",children:E.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-2 bg-orange-950/30 rounded-xl",children:[E.jsx(yr,{className:"w-3 h-3 text-orange-400 flex-shrink-0"}),E.jsx("span",{className:"text-[10px] text-orange-400 leading-tight",children:"E2E 加密保護"})]})})]}),E.jsxs("div",{className:"flex-1 overflow-hidden max-[480px]:pb-16",children:[e==="home"&&E.jsx(jR,{user:r,myHandle:j,onOpenChat:ce}),e==="messages"&&E.jsx(FR,{recentChats:I,onOpenChat:ce}),e==="settings"&&E.jsx(UR,{user:r,myHandle:j,myDisplayName:K,onHandleUpdate:W,onDisplayNameUpdate:$})]}),E.jsx("nav",{className:`hidden max-[480px]:flex fixed bottom-0 left-0 right-0 z-20\r
        bg-gray-900 border-t border-gray-800 items-center justify-around\r
        px-2 py-1 safe-pb`,children:[{key:"home",label:"首頁",Icon:P_},{key:"messages",label:"訊息",Icon:Bc},{key:"settings",label:"設定",Icon:N_}].map(({key:k,label:x,Icon:R})=>E.jsxs("button",{onClick:()=>t(k),className:`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors
              ${e===k?"text-orange-400":"text-gray-500"}`,children:[E.jsx(R,{className:"w-5 h-5"}),E.jsx("span",{className:"text-[10px] font-medium",children:x})]},k))}),l&&f&&E.jsx(LR,{peerUid:f.userId,userId:r.uid,onUnlock:xe,onCancel:()=>{h(!1),g(null)}})]})}function jR({user:r,myHandle:e,onOpenChat:t}){const[i,o]=Q.useState(""),[l,h]=Q.useState(!1),[f,g]=Q.useState(void 0),_=async()=>{const w=i.trim().toLowerCase();if(w){h(!0),g(void 0);try{const I=await yw(bp(Ip(An,"users"),fw("userHandle","==",w),pw(1)));if(I.empty||I.docs[0].id===r.uid)g(null);else{const A=I.docs[0].data();g({userId:I.docs[0].id,displayName:A.displayName||I.docs[0].id,photoURL:A.photoURL||"",userHandle:A.userHandle||"",publicKey:A.publicKey||""})}}catch{He.error("搜尋失敗，請稍後再試"),g(void 0)}finally{h(!1)}}};return E.jsxs("div",{className:"flex flex-col h-full overflow-y-auto",children:[E.jsxs("div",{className:"flex items-center justify-between px-5 pt-5 pb-3",children:[E.jsx("h1",{className:"text-xl font-bold text-white",children:"P Chats"}),E.jsx(Li,{className:"w-6 h-6 text-orange-500"})]}),E.jsxs("div",{className:"px-5 space-y-5 pb-5",children:[E.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 bg-orange-950/30 rounded-xl",children:[E.jsx(yr,{className:"w-3.5 h-3.5 text-orange-400 flex-shrink-0"}),E.jsx("span",{className:"text-xs text-orange-400",children:"端到端加密 · 訊息閱後即從伺服器刪除"})]}),E.jsxs("div",{className:"border border-gray-700 bg-gray-800/50 rounded-xl p-4",children:[E.jsx("p",{className:"text-xs text-gray-400 font-medium mb-1.5",children:"我的用戶 ID"}),E.jsx("p",{className:"text-2xl font-bold text-white",children:e?`@${e}`:"載入中..."}),E.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"其他使用者需輸入此 ID 才能找到你（可至設定修改）"})]}),E.jsxs("div",{children:[E.jsx("p",{className:"text-xs font-semibold text-gray-400 mb-2",children:"搜尋用戶"}),E.jsxs("div",{className:"flex gap-2",children:[E.jsxs("div",{className:"relative flex-1",children:[E.jsx(yR,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),E.jsx("input",{type:"text",placeholder:"輸入對方的用戶 ID…",value:i,onChange:w=>o(w.target.value),onKeyDown:w=>w.key==="Enter"&&_(),className:"w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"})]}),E.jsx("button",{onClick:_,disabled:l,className:"px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1.5",children:l?E.jsx("span",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}):"搜尋"})]})]}),f===null&&E.jsxs("div",{className:"flex items-center gap-3 px-4 py-4 bg-gray-800 rounded-xl",children:[E.jsx("span",{className:"text-gray-500 text-2xl",children:"👤"}),E.jsx("span",{className:"text-sm text-gray-400",children:"找不到此用戶 ID"})]}),f&&E.jsx(Rw,{user:f,trailing:E.jsx("button",{onClick:()=>t(f),className:"px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600",children:"開始對話"}),onClick:()=>t(f)})]})]})}function FR({recentChats:r,onOpenChat:e}){return E.jsxs("div",{className:"flex flex-col h-full",children:[E.jsx("div",{className:"px-5 pt-5 pb-3",children:E.jsx("h1",{className:"text-xl font-bold text-white",children:"訊息"})}),r.length===0?E.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center text-center px-8",children:[E.jsx(Bc,{className:"w-16 h-16 text-gray-700 mb-4"}),E.jsx("p",{className:"text-base text-gray-400 font-medium",children:"尚無最近對話"}),E.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"從首頁搜尋用戶來開始對話"})]}):E.jsx("div",{className:"flex-1 overflow-y-auto px-5 pb-5 space-y-2",children:r.map(t=>E.jsx(Rw,{user:t,onClick:()=>e(t),trailing:E.jsx(Bc,{className:"w-4 h-4 text-gray-300"})},t.userId))})]})}function UR({user:r,myHandle:e,myDisplayName:t,onHandleUpdate:i,onDisplayNameUpdate:o}){const[l,h]=Q.useState(!1),[f,g]=Q.useState(!1),[_,w]=Q.useState(t),[I,A]=Q.useState(e||""),[j,W]=Q.useState(""),[K,$]=Q.useState(""),me=async()=>{const de=_.trim();if(!de){W("顯示名稱不得為空");return}if(de.length>30){W("最多 30 個字元");return}await kv(r,{displayName:de}),await zc(jr(An,"users",r.uid),{displayName:de}),o(de),h(!1),He.success("顯示名稱已更新")},ae=async()=>{const de=I.toLowerCase().trim();if(de.length<3){$("至少需要 3 個字元");return}if(de.length>20){$("最多 20 個字元");return}if(!/^[a-z0-9_]+$/.test(de)){$("只能使用英文小寫、數字與底線");return}const k=await yw(bp(Ip(An,"users"),fw("userHandle","==",de),pw(1)));if(!k.empty&&k.docs[0].id!==r.uid){$("此 ID 已被使用");return}await zc(jr(An,"users",r.uid),{userHandle:de}),i(de),g(!1),He.success("用戶 ID 已更新")},ce=async()=>{confirm("確定要登出嗎？")&&await Tx(zo)},xe=async()=>{if(confirm("刪除帳號後，所有資料將永久移除且無法還原。確定要繼續嗎？"))try{await Xa(jr(An,"users",r.uid)).catch(()=>{}),await Ix(r)}catch(de){de.code==="auth/requires-recent-login"?He.error("請先重新登入後再刪除帳號"):He.error("刪除帳號失敗")}},Te=(t[0]||(e==null?void 0:e[0])||"?").toUpperCase();return E.jsxs("div",{className:"flex flex-col h-full overflow-y-auto",children:[E.jsx("div",{className:"px-5 pt-5 pb-3",children:E.jsx("h1",{className:"text-xl font-bold text-white",children:"設定"})}),E.jsxs(ic,{label:"個人資料",children:[E.jsx(nf,{icon:E.jsx("div",{className:"w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm",children:Te}),title:t||"尚未設定",subtitle:"顯示名稱",onClick:()=>{w(t),W(""),h(!0)}}),E.jsx("div",{className:"h-px bg-gray-700 ml-14"}),E.jsx(nf,{icon:E.jsx("div",{className:"w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm",children:"@"}),title:e?`@${e}`:"尚未設定",subtitle:"用戶 ID",onClick:()=>{A(e||""),$(""),g(!0)}})]}),E.jsx(ic,{label:"安全性",children:E.jsxs("div",{className:"px-4 py-3 flex items-start gap-3",children:[E.jsx(yr,{className:"w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"}),E.jsxs("div",{children:[E.jsx("p",{className:"text-sm font-medium text-gray-200",children:"獨立聊天室鎖定"}),E.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["每個聊天對象可設定不同密碼及指紋解鎖，",E.jsx("br",{}),"在對話視窗中開啟鎖定設定即可管理。"]})]})]})}),E.jsxs(ic,{label:"關於",children:[E.jsxs("div",{className:"px-4 py-3 flex items-start gap-3",children:[E.jsx(vR,{className:"w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"}),E.jsxs("div",{children:[E.jsx("p",{className:"text-sm font-medium text-gray-200",children:"端到端加密"}),E.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["X25519 金鑰交換 · AES-256-GCM 加密",E.jsx("br",{}),"訊息閱後即從伺服器刪除"]})]})]}),E.jsx("div",{className:"h-px bg-gray-700 ml-14"}),E.jsxs("div",{className:"px-4 py-3 flex items-center gap-3",children:[E.jsx(fR,{className:"w-5 h-5 text-orange-500 flex-shrink-0"}),E.jsx("p",{className:"text-sm text-gray-300 flex-1",children:"版本"}),E.jsx("span",{className:"text-sm text-gray-500",children:"2.0.0"})]})]}),E.jsx(ic,{label:"帳號管理",children:E.jsx(nf,{icon:E.jsx(Iw,{className:"w-5 h-5 text-red-500"}),title:"刪除帳號",subtitle:"永久刪除帳號及所有資料",titleClass:"text-red-500",onClick:xe})}),E.jsx("div",{className:"px-5 pb-6 mt-2",children:E.jsxs("button",{onClick:ce,className:"w-full flex items-center justify-center gap-2 border border-red-800 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-950/30 transition-colors",children:[E.jsx(pR,{className:"w-4 h-4"})," 登出"]})}),l&&E.jsxs(M_,{title:"修改顯示名稱",onClose:()=>h(!1),onSave:me,children:[E.jsx("p",{className:"text-xs text-gray-400 mb-3",children:"最多 30 個字元，其他使用者看到的名稱。"}),E.jsx("input",{type:"text",value:_,onChange:de=>{w(de.target.value),W("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500",placeholder:"顯示名稱"}),j&&E.jsx("p",{className:"text-xs text-red-500 mt-1",children:j})]}),f&&E.jsxs(M_,{title:"修改用戶 ID",onClose:()=>g(!1),onSave:ae,children:[E.jsx("p",{className:"text-xs text-gray-400 mb-3",children:"3–20 字元，只能使用英文小寫字母、數字與底線 (_)。"}),E.jsxs("div",{className:"relative",children:[E.jsx("span",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm",children:"@"}),E.jsx("input",{type:"text",value:I,onChange:de=>{A(de.target.value.toLowerCase()),$("")},autoFocus:!0,className:"w-full bg-gray-700 border border-gray-600 text-white rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500",placeholder:"用戶 ID"})]}),K&&E.jsx("p",{className:"text-xs text-red-500 mt-1",children:K})]})]})}function ic({label:r,children:e}){return E.jsxs("div",{className:"mb-4",children:[E.jsx("p",{className:"px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide",children:r}),E.jsx("div",{className:"mx-5 border border-gray-800 rounded-xl overflow-hidden bg-gray-900",children:e})]})}function nf({icon:r,title:e,subtitle:t,onClick:i,titleClass:o=""}){return E.jsxs("div",{onClick:i,className:"flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer",children:[E.jsx("div",{className:"flex-shrink-0",children:r}),E.jsxs("div",{className:"flex-1 min-w-0",children:[E.jsx("p",{className:`text-sm font-medium ${o||"text-gray-200"}`,children:e}),t&&E.jsx("p",{className:"text-xs text-gray-500",children:t})]}),E.jsx(cR,{className:`w-4 h-4 ${o?"text-red-400":"text-gray-600"} flex-shrink-0`})]})}function M_({title:r,children:e,onClose:t,onSave:i}){return E.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4",onClick:t,children:E.jsxs("div",{className:"w-full max-w-sm bg-gray-800 rounded-2xl p-5",onClick:o=>o.stopPropagation(),children:[E.jsx("h3",{className:"font-bold text-white mb-3",children:r}),e,E.jsxs("div",{className:"flex gap-2 mt-4",children:[E.jsx("button",{onClick:t,className:"flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700",children:"取消"}),E.jsx("button",{onClick:i,className:"flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600",children:"儲存"})]})]})})}function zR(){const[r,e]=Q.useState(null),[t,i]=Q.useState("loading");return Q.useEffect(()=>Ex(zo,o=>{e(o),i(o?"home":"login")}),[]),t==="loading"?E.jsx("div",{className:"flex items-center justify-center h-full bg-white",children:E.jsx("div",{className:"w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"})}):t==="home"&&r?E.jsx(MR,{user:r}):t==="register"?E.jsx(IR,{onBack:()=>i("login")}):E.jsx(TR,{onRegister:()=>i("register")})}GE.createRoot(document.getElementById("root")).render(E.jsxs(zE.StrictMode,{children:[E.jsx(zR,{}),E.jsx(LT,{position:"top-center",toastOptions:{duration:3e3}})]}));
