/**
 * VisualPatch v2.3.0 — Universal In-Browser Visual Feedback Tool for AI Coding Assistants
 * Compatible with Claude, Cursor, ChatGPT, Windsurf, Copilot, Antigravity, v0, Devin, etc.
 * Features: Auto Snap (Pure DOM Engine), Element Inspection, Area Screenshot Tool, Dynamic Anchors, Linear/Apple Glass UI
 */

// 1. Standalone html-to-image Pure DOM Engine
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).htmlToImage={})}(this,(function(t){"use strict";function e(t,e,n,r){return new(n||(n=Promise))((function(i,o){function u(t){try{a(r.next(t))}catch(t){o(t)}}function c(t){try{a(r.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(u,c)}a((r=r.apply(t,e||[])).next())}))}function n(t,e){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function c(c){return function(a){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,c[0]&&(u=0)),u;)try{if(n=1,r&&(i=2&c[0]?r.return:c[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,c[1])).done)return i;switch(r=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return u.label++,{value:c[1],done:!1};case 5:u.label++,r=c[1],c=[0];continue;case 7:c=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){u=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){u.label=c[1];break}if(6===c[0]&&u.label<i[1]){u.label=i[1],i=c;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(c);break}i[2]&&u.ops.pop(),u.trys.pop();continue}c=e.call(t,u)}catch(t){c=[6,t],r=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,a])}}}var r,i=(r=0,function(){return r+=1,"u".concat("0000".concat((Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)).concat(r)});function o(t){for(var e=[],n=0,r=t.length;n<r;n++)e.push(t[n]);return e}var u=null;function c(t){return void 0===t&&(t={}),u||(u=t.includeStyleProperties?t.includeStyleProperties:o(window.getComputedStyle(document.documentElement)))}function a(t,e){var n=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return n?parseFloat(n.replace("px","")):0}function s(t,e){void 0===e&&(e={});var n,r,i,o=e.width||(r=a(n=t,"border-left-width"),i=a(n,"border-right-width"),n.clientWidth+r+i),u=e.height||function(t){var e=a(t,"border-top-width"),n=a(t,"border-bottom-width");return t.clientHeight+e+n}(t);return{width:o,height:u}}var l=16384;function f(t,e){return void 0===e&&(e={}),t.toBlob?new Promise((function(n){t.toBlob(n,e.type?e.type:"image/png",e.quality?e.quality:1)})):new Promise((function(n){for(var r=window.atob(t.toDataURL(e.type?e.type:void 0,e.quality?e.quality:void 0).split(",")[1]),i=r.length,o=new Uint8Array(i),u=0;u<i;u+=1)o[u]=r.charCodeAt(u);n(new Blob([o],{type:e.type?e.type:"image/png"}))}))}function h(t){return new Promise((function(e,n){var r=new Image;r.onload=function(){r.decode().then((function(){requestAnimationFrame((function(){return e(r)}))}))},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=t}))}function d(t){return e(this,void 0,void 0,(function(){return n(this,(function(e){return[2,Promise.resolve().then((function(){return(new XMLSerializer).serializeToString(t)})).then(encodeURIComponent).then((function(t){return"data:image/svg+xml;charset=utf-8,".concat(t)}))]}))}))}function v(t,r,i){return e(this,void 0,void 0,(function(){var e,o,u;return n(this,(function(n){return e="http://www.w3.org/2000/svg",o=document.createElementNS(e,"svg"),u=document.createElementNS(e,"foreignObject"),o.setAttribute("width","".concat(r)),o.setAttribute("height","".concat(i)),o.setAttribute("viewBox","0 0 ".concat(r," ").concat(i)),u.setAttribute("width","100%"),u.setAttribute("height","100%"),u.setAttribute("x","0"),u.setAttribute("y","0"),u.setAttribute("externalResourcesRequired","true"),o.appendChild(u),u.appendChild(t),[2,d(o)]}))}))}var p=function(t,e){if(t instanceof e)return!0;var n=Object.getPrototypeOf(t);return null!==n&&(n.constructor.name===e.name||p(n,e))};function g(t,e,n,r){var i=".".concat(t,":").concat(e),o=n.cssText?function(t){var e=t.getPropertyValue("content");return"".concat(t.cssText," content: '").concat(e.replace(/'|"/g,""),"';")}(n):function(t,e){return c(e).map((function(e){var n=t.getPropertyValue(e),r=t.getPropertyPriority(e);return"".concat(e,": ").concat(n).concat(r?" !important":"",";")})).join(" ")}(n,r);return document.createTextNode("".concat(i,"{").concat(o,"}"))}function m(t,e,n,r){var o=window.getComputedStyle(t,n),u=o.getPropertyValue("content");if(""!==u&&"none"!==u){var c=i();try{e.className="".concat(e.className," ").concat(c)}catch(t){return}var a=document.createElement("style");a.appendChild(g(c,n,o,r)),e.appendChild(a)}}var w="application/font-woff",y="image/jpeg",b={woff:w,woff2:w,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:y,jpeg:y,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function S(t){var e=function(t){var e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}(t).toLowerCase();return b[e]||""}function E(t){return-1!==t.search(/^(data:)/)}function x(t,e){return"data:".concat(e,";base64,").concat(t)}function C(t,r,i){return e(this,void 0,void 0,(function(){var e,o;return n(this,(function(n){switch(n.label){case 0:return[4,fetch(t,r)];case 1:if(404===(e=n.sent()).status)throw new Error('Resource "'.concat(e.url,'" not found'));return[4,e.blob()];case 2:return o=n.sent(),[2,new Promise((function(t,n){var r=new FileReader;r.onerror=n,r.onloadend=function(){try{t(i({res:e,result:r.result}))}catch(t){n(t)}},r.readAsDataURL(o)}))]}}))}))}var P={};function R(t,r,i){return e(this,void 0,void 0,(function(){var e,o,u,c,a;return n(this,(function(n){switch(n.label){case 0:if(e=function(t,e,n){var r=t.replace(/\?.*/,"");return n&&(r=t),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),e?"[".concat(e,"]").concat(r):r}(t,r,i.includeQueryParams),null!=P[e])return[2,P[e]];i.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+(new Date).getTime()),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,C(t,i.fetchRequestInit,(function(t){var e=t.res,n=t.result;return r||(r=e.headers.get("Content-Type")||""),function(t){return t.split(/,/)[1]}(n)}))];case 2:return u=n.sent(),o=x(u,r),[3,4];case 3:return c=n.sent(),o=i.imagePlaceholder||"",a="Failed to fetch resource: ".concat(t),c&&(a="string"==typeof c?c:c.message),a&&console.warn(a),[3,4];case 4:return P[e]=o,[2,o]}}))}))}function T(t){return e(this,void 0,void 0,(function(){var e;return n(this,(function(n){return"data:,"===(e=t.toDataURL())?[2,t.cloneNode(!1)]:[2,h(e)]}))}))}function A(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return t.currentSrc?(e=document.createElement("canvas"),i=e.getContext("2d"),e.width=t.clientWidth,e.height=t.clientHeight,null==i||i.drawImage(t,0,0,e.width,e.height),[2,h(e.toDataURL())]):(o=t.poster,u=S(o),[4,R(o,u,r)]);case 1:return[2,h(n.sent())]}}))}))}function k(t,r){var i;return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return e.trys.push([0,3,,4]),(null===(i=null==t?void 0:t.contentDocument)||void 0===i?void 0:i.body)?[4,I(t.contentDocument.body,r,!0)]:[3,2];case 1:return[2,e.sent()];case 2:return[3,4];case 3:return e.sent(),[3,4];case 4:return[2,t.cloneNode(!1)]}}))}))}var L=function(t){return null!=t.tagName&&"SVG"===t.tagName.toUpperCase()};function N(t,e,n){return p(e,Element)&&(function(t,e,n){var r=e.style;if(r){var i=window.getComputedStyle(t);i.cssText?(r.cssText=i.cssText,r.transformOrigin=i.transformOrigin):c(n).forEach((function(n){var o=i.getPropertyValue(n);if("font-size"===n&&o.endsWith("px")){var u=Math.floor(parseFloat(o.substring(0,o.length-2)))-.1;o="".concat(u,"px")}p(t,HTMLIFrameElement)&&"display"===n&&"inline"===o&&(o="block"),"d"===n&&e.getAttribute("d")&&(o="path(".concat(e.getAttribute("d"),")")),r.setProperty(n,o,i.getPropertyPriority(n))}))}}(t,e,n),function(t,e,n){m(t,e,":before",n),m(t,e,":after",n)}(t,e,n),function(t,e){p(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),p(t,HTMLInputElement)&&e.setAttribute("value",t.value)}(t,e),function(t,e){if(p(t,HTMLSelectElement)){var n=e,r=Array.from(n.children).find((function(e){return t.value===e.getAttribute("value")}));r&&r.setAttribute("selected","")}}(t,e)),e}function I(t,r,i){return e(this,void 0,void 0,(function(){return n(this,(function(u){return i||!r.filter||r.filter(t)?[2,Promise.resolve(t).then((function(t){return function(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){return p(t,HTMLCanvasElement)?[2,T(t)]:p(t,HTMLVideoElement)?[2,A(t,r)]:p(t,HTMLIFrameElement)?[2,k(t,r)]:[2,t.cloneNode(L(t))]}))}))}(t,r)})).then((function(i){return function(t,r,i){var u,c;return e(this,void 0,void 0,(function(){var e;return n(this,(function(n){switch(n.label){case 0:return L(r)?[2,r]:(e=[],0===(e=null!=(a=t).tagName&&"SLOT"===a.tagName.toUpperCase()&&t.assignedNodes?o(t.assignedNodes()):p(t,HTMLIFrameElement)&&(null===(u=t.contentDocument)||void 0===u?void 0:u.body)?o(t.contentDocument.body.childNodes):o((null!==(c=t.shadowRoot)&&void 0!==c?c:t).childNodes)).length||p(t,HTMLVideoElement)?[2,r]:[4,e.reduce((function(t,e){return t.then((function(){return I(e,i)})).then((function(t){t&&r.appendChild(t)}))}),Promise.resolve())]);case 1:return n.sent(),[2,r]}var a}))}))}(t,i,r)})).then((function(e){return N(t,e,r)})).then((function(t){return function(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u,c,a,s,l,f,h,d,v,p;return n(this,(function(n){switch(n.label){case 0:if(0===(e=t.querySelectorAll?t.querySelectorAll("use"):[]).length)return[2,t];i={},p=0,n.label=1;case 1:return p<e.length?(o=e[p],(u=o.getAttribute("xlink:href"))?(c=t.querySelector(u),a=document.querySelector(u),c||!a||i[u]?[3,3]:(s=i,l=u,[4,I(a,r,!0)])):[3,3]):[3,4];case 2:s[l]=n.sent(),n.label=3;case 3:return p++,[3,1];case 4:if((f=Object.values(i)).length){for(h="http://www.w3.org/1999/xhtml",(d=document.createElementNS(h,"svg")).setAttribute("xmlns",h),d.style.position="absolute",d.style.width="0",d.style.height="0",d.style.overflow="hidden",d.style.display="none",v=document.createElementNS(h,"defs"),d.appendChild(v),p=0;p<f.length;p++)v.appendChild(f[p]);t.appendChild(d)}return[2,t]}}))}))}(t,r)}))]:[2,null]}))}))}var D=/url\((['"]?)([^'"]+?)\1\)/g,H=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,M=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function F(t,r,i,o,u){return e(this,void 0,void 0,(function(){var e,c,a,s;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,5,,6]),e=i?function(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;var n=document.implementation.createHTMLDocument(),r=n.createElement("base"),i=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(i),e&&(r.href=e),i.href=t,i.href}(r,i):r,c=S(r),a=void 0,u?[4,u(e)]:[3,2];case 1:return s=n.sent(),a=x(s,c),[3,4];case 2:return[4,R(e,c,o)];case 3:a=n.sent(),n.label=4;case 4:return[2,t.replace((l=r,f=l.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1"),new RegExp("(url\\(['\"]?)(".concat(f,")(['\"]?\\))"),"g")),"$1".concat(a,"$3"))];case 5:return n.sent(),[3,6];case 6:return[2,t]}var l,f}))}))}function V(t){return-1!==t.search(D)}function q(t,r,i){return e(this,void 0,void 0,(function(){var e,o;return n(this,(function(n){return V(t)?(e=function(t,e){var n=e.preferredFontFormat;return n?t.replace(M,(function(t){for(;;){var e=H.exec(t)||[],r=e[0],i=e[2];if(!i)return"";if(i===n)return"src: ".concat(r,";")}})):t}(t,i),o=function(t){var e=[];return t.replace(D,(function(t,n,r){return e.push(r),t})),e.filter((function(t){return!E(t)}))}(e),[2,o.reduce((function(t,e){return t.then((function(t){return F(t,e,r,i)}))}),Promise.resolve(e))]):[2,t]}))}))}function U(t,r,i){var o;return e(this,void 0,void 0,(function(){var e,u;return n(this,(function(n){switch(n.label){case 0:return(e=null===(o=r.style)||void 0===o?void 0:o.getPropertyValue(t))?[4,q(e,null,i)]:[3,2];case 1:return u=n.sent(),r.style.setProperty(t,u,r.style.getPropertyPriority(t)),[2,!0];case 2:return[2,!1]}}))}))}function j(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return[4,U("background",t,r)];case 1:return n.sent()?[3,3]:[4,U("background-image",t,r)];case 2:n.sent(),n.label=3;case 3:return[4,U("mask",t,r)];case 4:return(i=n.sent())?[3,6]:[4,U("-webkit-mask",t,r)];case 5:i=n.sent(),n.label=6;case 6:return(e=i)?[3,8]:[4,U("mask-image",t,r)];case 7:e=n.sent(),n.label=8;case 8:return e?[3,10]:[4,U("-webkit-mask-image",t,r)];case 9:n.sent(),n.label=10;case 10:return[2]}}))}))}function O(t,r){return e(this,void 0,void 0,(function(){var e,i,o;return n(this,(function(n){switch(n.label){case 0:return(e=p(t,HTMLImageElement))&&!E(t.src)||p(t,SVGImageElement)&&!E(t.href.baseVal)?[4,R(i=e?t.src:t.href.baseVal,S(i),r)]:[2];case 1:return o=n.sent(),[4,new Promise((function(n,i){t.onload=n,t.onerror=r.onImageErrorHandler?function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];try{n(r.onImageErrorHandler.apply(r,t))}catch(t){i(t)}}:i;var u=t;u.decode&&(u.decode=n),"lazy"===u.loading&&(u.loading="eager"),e?(t.srcset="",t.src=o):t.href.baseVal=o}))];case 2:return n.sent(),[2]}}))}))}function B(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return e=o(t.childNodes),i=e.map((function(t){return z(t,r)})),[4,Promise.all(i).then((function(){return t}))];case 1:return n.sent(),[2]}}))}))}function z(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return p(t,Element)?[4,j(t,r)]:[3,4];case 1:return e.sent(),[4,O(t,r)];case 2:return e.sent(),[4,B(t,r)];case 3:e.sent(),e.label=4;case 4:return[2]}}))}))}var W={};function $(t){return e(this,void 0,void 0,(function(){var e,r;return n(this,(function(n){switch(n.label){case 0:return null!=(e=W[t])?[2,e]:[4,fetch(t)];case 1:return[4,n.sent().text()];case 2:return r=n.sent(),e={url:t,cssText:r},W[t]=e,[2,e]}}))}))}function G(t,r){return e(this,void 0,void 0,(function(){var i,o,u,c,a=this;return n(this,(function(s){return i=t.cssText,o=/url\(["']?([^"')]+)["']?\)/g,u=i.match(/url\([^)]+\)/g)||[],c=u.map((function(u){return e(a,void 0,void 0,(function(){var e;return n(this,(function(n){return(e=u.replace(o,"$1")).startsWith("https://")||(e=new URL(e,t.url).href),[2,C(e,r.fetchRequestInit,(function(t){var e=t.result;return i=i.replace(u,"url(".concat(e,")")),[u,e]}))]}))}))})),[2,Promise.all(c).then((function(){return i}))]}))}))}function _(t){if(null==t)return[];for(var e=[],n=t.replace(/(\/\*[\s\S]*?\*\/)/gi,""),r=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");;){if(null===(u=r.exec(n)))break;e.push(u[0])}n=n.replace(r,"");for(var i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,o=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi");;){var u;if(null===(u=i.exec(n))){if(null===(u=o.exec(n)))break;i.lastIndex=o.lastIndex}else o.lastIndex=i.lastIndex;e.push(u[0])}return e}function J(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){return e=[],i=[],t.forEach((function(e){if("cssRules"in e)try{o(e.cssRules||[]).forEach((function(t,n){if(t.type===CSSRule.IMPORT_RULE){var o=n+1,u=$(t.href).then((function(t){return G(t,r)})).then((function(t){return _(t).forEach((function(t){try{e.insertRule(t,t.startsWith("@import")?o+=1:e.cssRules.length)}catch(e){console.error("Error inserting rule from remote css",{rule:t,error:e})}}))})).catch((function(t){console.error("Error loading remote css",t.toString())}));i.push(u)}}))}catch(o){var n=t.find((function(t){return null==t.href}))||document.styleSheets[0];null!=e.href&&i.push($(e.href).then((function(t){return G(t,r)})).then((function(t){return _(t).forEach((function(t){n.insertRule(t,n.cssRules.length)}))})).catch((function(t){console.error("Error loading remote stylesheet",t)}))),console.error("Error inlining remote css file",o)}})),[2,Promise.all(i).then((function(){return t.forEach((function(t){if("cssRules"in t)try{o(t.cssRules||[]).forEach((function(t){e.push(t)}))}catch(e){console.error("Error while reading CSS rules from ".concat(t.href),e)}})),e}))]}))}))}function Q(t){return t.filter((function(t){return t.type===CSSRule.FONT_FACE_RULE})).filter((function(t){return V(t.style.getPropertyValue("src"))}))}function X(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:if(null==t.ownerDocument)throw new Error("Provided element is not within a Document");return[4,J(o(t.ownerDocument.styleSheets),r)];case 1:return[2,Q(e.sent())]}}))}))}function K(t){return t.trim().replace(/["']/g,"")}function Y(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return[4,X(t,r)];case 1:return e=n.sent(),i=function(t){var e=new Set;return function t(n){(n.style.fontFamily||getComputedStyle(n).fontFamily).split(",").forEach((function(t){e.add(K(t))})),Array.from(n.children).forEach((function(e){e instanceof HTMLElement&&t(e)}))}(t),e}(t),[4,Promise.all(e.filter((function(t){return i.has(K(t.style.fontFamily))})).map((function(t){var e=t.parentStyleSheet?t.parentStyleSheet.href:null;return q(t.cssText,e,r)})))];case 2:return[2,n.sent().join("\n")]}}))}))}function Z(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u,c;return n(this,(function(n){switch(n.label){case 0:return null==r.fontEmbedCSS?[3,1]:(i=r.fontEmbedCSS,[3,5]);case 1:return r.skipFonts?(o=null,[3,4]):[3,2];case 2:return[4,Y(t,r)];case 3:o=n.sent(),n.label=4;case 4:i=o,n.label=5;case 5:return(e=i)&&(u=document.createElement("style"),c=document.createTextNode(e),u.appendChild(c),t.firstChild?t.insertBefore(u,t.firstChild):t.appendChild(u)),[2]}}))}))}function tt(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,I(t,r,!0)];case 1:return[4,Z(u=n.sent(),r)];case 2:return n.sent(),[4,z(u,r)];case 3:return n.sent(),function(t,e){var n=t.style;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width="".concat(e.width,"px")),e.height&&(n.height="".concat(e.height,"px"));var r=e.style;null!=r&&Object.keys(r).forEach((function(t){n[t]=r[t]}))}(u,r),[4,v(u,i,o)];case 4:return[2,n.sent()]}}))}))}function et(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u,c,a,f,d,v;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,tt(t,r)];case 1:return[4,h(n.sent())];case 2:return u=n.sent(),c=document.createElement("canvas"),a=c.getContext("2d"),f=r.pixelRatio||function(){var t,e;try{e=process}catch(t){}var n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}(),d=r.canvasWidth||i,v=r.canvasHeight||o,c.width=d*f,c.height=v*f,r.skipAutoScale||function(t){(t.width>l||t.height>l)&&(t.width>l&&t.height>l?t.width>t.height?(t.height*=l/t.width,t.width=l):(t.width*=l/t.height,t.height=l):t.width>l?(t.height*=l/t.width,t.width=l):(t.width*=l/t.height,t.height=l))}(c),c.style.width="".concat(d),c.style.height="".concat(v),r.backgroundColor&&(a.fillStyle=r.backgroundColor,a.fillRect(0,0,c.width,c.height)),a.drawImage(u,0,0,c.width,c.height),[2,c]}}))}))}t.getFontEmbedCSS=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){return[2,Y(t,r)]}))}))},t.toBlob=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[4,f(e.sent())];case 2:return[2,e.sent()]}}))}))},t.toCanvas=et,t.toJpeg=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[2,e.sent().toDataURL("image/jpeg",r.quality||1)]}}))}))},t.toPixelData=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,et(t,r)];case 1:return u=n.sent(),[2,u.getContext("2d").getImageData(0,0,i,o).data]}}))}))},t.toPng=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[2,e.sent().toDataURL()]}}))}))},t.toSvg=tt}));

// 2. Main VisualPatch Application
(function () {
  const hostname = window.location.hostname || '';
  const port = window.location.port || '';
  const protocol = window.location.protocol || '';

  // Comprehensive dev environment detection
  const isLocal =
    ['localhost', '127.0.0.1', '0.0.0.0', '::1', ''].includes(hostname) ||
    port !== '' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.test') ||
    hostname.endsWith('.dev') ||
    hostname.endsWith('.localhost') ||
    /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname) ||
    hostname.includes('.nip.io') ||
    hostname.includes('.sslip.io') ||
    hostname.includes('ngrok') ||
    hostname.includes('loca.lt') ||
    hostname.includes('trycloudflare.com') ||
    protocol === 'file:';

  if (!isLocal) return;

  // STRICT SINGLETON LOCK: Prevent duplicate toolbars from extension + script tag collision
  if (
    document.documentElement.getAttribute('data-visualpatch-active') === 'true' ||
    document.getElementById('visualpatch-host') ||
    document.getElementById('dev-annotator-fixed-root')
  ) {
    return;
  }
  document.documentElement.setAttribute('data-visualpatch-active', 'true');
  window.__visualpatch_loaded = true;

  // Global State
  let isInspectMode = false;
  let isScreenshotMode = false;
  let isVisible = true;
  let annotations = [];
  let currentPinNumber = 1;
  let hoveredElement = null;
  let currentPos = { x: null, y: null };

  // Dragging State
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let initialLeft = 0, initialTop = 0;

  // Marquee Drag State
  let isMarqueeDragging = false;
  let marqueeStartX = 0, marqueeStartY = 0;

  // Viewport Anchor Coordinate System
  function computeAnchorFromPos(x, y, elWidth = 44, elHeight = 240) {
    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? 220 : elWidth;
    const height = isMobile ? 44 : elHeight;
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;
    const isRight = x + width / 2 >= midX;
    const isBottom = y + height / 2 >= midY;

    const offsetX = isRight ? Math.max(10, window.innerWidth - (x + width)) : Math.max(10, x);
    const offsetY = isBottom ? Math.max(10, window.innerHeight - (y + height)) : Math.max(10, y);

    return {
      anchorX: isRight ? 'right' : 'left',
      anchorY: isBottom ? 'bottom' : 'top',
      offsetX: Math.round(offsetX),
      offsetY: Math.round(offsetY)
    };
  }

  function resolveAnchorToPos(anchorState, elWidth = 44, elHeight = 240) {
    if (!anchorState || !anchorState.anchorX || !anchorState.anchorY) {
      return { x: null, y: null };
    }
    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? 220 : elWidth;
    const height = isMobile ? 44 : elHeight;
    const margin = 10;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    let x = anchorState.anchorX === 'right'
      ? window.innerWidth - (anchorState.offsetX || 20) - width
      : (anchorState.offsetX || 20);
    let y = anchorState.anchorY === 'bottom'
      ? window.innerHeight - (anchorState.offsetY || 20) - height
      : (anchorState.offsetY || 20);

    return {
      x: Math.max(margin, Math.min(x, maxX)),
      y: Math.max(margin, Math.min(y, maxY))
    };
  }

  // Viewport Boundary Sanitizer
  function sanitizePos(pos) {
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number' || isNaN(pos.x) || isNaN(pos.y)) {
      return { x: null, y: null };
    }
    const margin = 10;
    const isMobile = window.innerWidth <= 768;
    const dockWidth = isMobile ? 220 : 44;
    const dockHeight = isMobile ? 44 : 240;
    const maxX = Math.max(margin, window.innerWidth - dockWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - dockHeight - margin);

    const clampedX = Math.max(margin, Math.min(pos.x, maxX));
    const clampedY = Math.max(margin, Math.min(pos.y, maxY));
    return { x: clampedX, y: clampedY };
  }

  // Load Saved Position
  try {
    const savedAnchor = localStorage.getItem('visualpatch_toolbar_anchor');
    if (savedAnchor) {
      currentPos = resolveAnchorToPos(JSON.parse(savedAnchor));
    } else {
      const savedPos = localStorage.getItem('visualpatch_toolbar_pos');
      if (savedPos) currentPos = sanitizePos(JSON.parse(savedPos));
    }
  } catch (e) {
    currentPos = { x: null, y: null };
  }

  // Resize Listener
  function handleWindowResize() {
    try {
      const savedAnchor = localStorage.getItem('visualpatch_toolbar_anchor');
      if (savedAnchor) {
        currentPos = resolveAnchorToPos(JSON.parse(savedAnchor));
        if (typeof toolbar !== 'undefined' && toolbar) {
          toolbar.style.left = `${currentPos.x}px`;
          toolbar.style.top = `${currentPos.y}px`;
        }
        if (typeof collapsedPill !== 'undefined' && collapsedPill) {
          collapsedPill.style.left = `${currentPos.x}px`;
          collapsedPill.style.top = `${currentPos.y}px`;
        }
        return;
      }
    } catch (e) {}

    if (currentPos.x !== null && currentPos.y !== null) {
      currentPos = sanitizePos(currentPos);
      try { localStorage.setItem('visualpatch_toolbar_pos', JSON.stringify(currentPos)); } catch (e) {}
      if (typeof toolbar !== 'undefined' && toolbar) {
        toolbar.style.left = `${currentPos.x}px`;
        toolbar.style.top = `${currentPos.y}px`;
      }
      if (typeof collapsedPill !== 'undefined' && collapsedPill) {
        collapsedPill.style.left = `${currentPos.x}px`;
        collapsedPill.style.top = `${currentPos.y}px`;
      }
    }
  }
  window.addEventListener('resize', handleWindowResize);
  window.addEventListener('orientationchange', handleWindowResize);

  // Mount Shadow Root Host
  const host = document.createElement('div');
  host.id = 'visualpatch-host';
  host.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 0; pointer-events: none; z-index: 2147483647;';
  
  function mountHost() {
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountHost, { once: true });
      }
      return;
    }
    if (!document.body.contains(host)) {
      document.body.appendChild(host);
    }
  }
  mountHost();
  window.addEventListener('load', mountHost);

  const shadow = host.attachShadow({ mode: 'open' });

  // Styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    .vp-toolbar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 6px 4px;
      background: rgba(14, 16, 20, 0.94);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 9999px;
      box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      color: #f8fafc;
      pointer-events: auto;
      user-select: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      touch-action: none;
      width: 38px;
    }

    .vp-toolbar.vp-dragging {
      opacity: 0.94;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      border-color: #0071e3;
      cursor: grabbing !important;
    }

    .vp-brand-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 5px 4px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: grab;
      transition: background-color 0.15s ease, transform 0.15s ease;
      width: 30px;
      height: 30px;
    }

    .vp-brand-badge:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    .vp-brand-badge:active {
      cursor: grabbing;
      transform: scale(0.96);
    }

    .vp-btn-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .vp-btn-icon:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .vp-btn-icon:active {
      transform: scale(0.95);
    }

    .vp-btn-active {
      background: #0071e3 !important;
      border-color: #0071e3 !important;
      color: #ffffff !important;
    }

    .vp-btn-copy-has-pins {
      background: #0071e3 !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
      color: #ffffff !important;
    }

    .vp-badge-count {
      position: absolute;
      top: -3px;
      right: -3px;
      min-width: 15px;
      height: 15px;
      padding: 0 3.5px;
      border-radius: 9999px;
      background: #ffffff;
      color: #0071e3;
      font-size: 9px;
      font-weight: 800;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }

    .vp-collapsed-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 12px;
      background: rgba(14, 16, 20, 0.94);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      cursor: grab;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      pointer-events: auto;
      user-select: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
    }

    .vp-collapsed-pill:hover {
      background: rgba(22, 25, 33, 0.96);
      border-color: rgba(0, 113, 227, 0.4);
    }

    .vp-highlighter {
      position: fixed;
      border: 1.5px solid #0071e3;
      background: rgba(0, 113, 227, 0.04);
      border-radius: 4px;
      pointer-events: none;
      z-index: 2147483640;
      transition: all 0.05s ease;
      display: none;
    }

    .vp-tag-badge {
      position: absolute;
      top: -24px;
      left: -2px;
      background: rgba(14, 16, 20, 0.95);
      border: 1px solid rgba(0, 113, 227, 0.4);
      color: #0071e3;
      font-size: 10px;
      font-weight: 600;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      padding: 1.5px 6.5px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      backdrop-filter: blur(12px);
    }

    .vp-marquee-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(1.5px);
      -webkit-backdrop-filter: blur(1.5px);
      cursor: crosshair;
      pointer-events: auto;
      z-index: 2147483644;
      display: none;
    }

    .vp-marquee-box {
      position: fixed;
      border: 1.5px solid rgba(255, 255, 255, 0.95);
      background: transparent;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 0 99999px rgba(14, 16, 20, 0.52);
      border-radius: 2px;
      pointer-events: none;
      display: none;
    }

    .vp-marquee-dim {
      position: absolute;
      bottom: -34px;
      right: 0;
      background: rgba(14, 16, 20, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      color: #f8fafc;
      font-size: 10.5px;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      font-weight: 600;
      padding: 2.5px 9px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .vp-pin {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0071e3;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      border: 2px solid #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      z-index: 2147483642;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;
    }

    .vp-pin:hover {
      transform: translate(-50%, -50%) scale(1.15);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
    }

    .vp-card {
      position: fixed;
      width: 390px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      box-sizing: border-box;
      background: rgba(14, 16, 20, 0.96);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 16px;
      box-shadow: 0 28px 56px -10px rgba(0, 0, 0, 0.88), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      color: #f8fafc;
      padding: 16px 18px;
      z-index: 2147483648;
      pointer-events: auto;
      user-select: none;
      animation: vp-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes vp-pop {
      from { transform: scale(0.97) translateY(4px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .vp-toolbar {
        flex-direction: row !important;
        width: auto !important;
        height: 44px !important;
        padding: 5px 8px !important;
        gap: 7px !important;
      }
      .vp-card {
        width: auto !important;
        left: 12px !important;
        right: 12px !important;
        bottom: 12px !important;
        top: auto !important;
        max-width: calc(100vw - 24px) !important;
        max-height: 82vh !important;
        padding: 14px 14px !important;
        border-radius: 16px !important;
      }
    }

    .vp-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 9px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .vp-card-pin-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 5px;
      background: rgba(0, 113, 227, 0.08);
      border: 1px solid rgba(0, 113, 227, 0.25);
      color: #0071e3;
      font-size: 10.5px;
      font-weight: 700;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      letter-spacing: 0.04em;
    }

    .vp-card-close {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
      color: #94a3b8;
      cursor: pointer;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .vp-card-close:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .vp-card-preview {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 10px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 6px 9px;
      border-radius: 7px;
      border-left: 2.5px solid #0071e3;
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .vp-thumbnail-box {
      position: relative;
      margin-bottom: 10px;
      border-radius: 9px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.6);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }

    .vp-thumbnail-img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      display: block;
      cursor: zoom-in;
    }

    .vp-thumbnail-actions {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      gap: 4px;
    }

    .vp-pill-action-btn {
      padding: 2.5px 6.5px;
      border-radius: 5px;
      background: rgba(14, 16, 20, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      backdrop-filter: blur(8px);
      transition: background 0.15s ease;
    }

    .vp-pill-action-btn:hover {
      background: rgba(26, 31, 42, 0.95);
    }

    .vp-textarea {
      width: 100%;
      height: 68px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9px;
      color: #f8fafc;
      padding: 8px 10px;
      font-size: 12.5px;
      line-height: 1.45;
      resize: vertical;
      outline: none;
      margin-bottom: 12px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
      transition: border-color 0.15s ease;
    }

    .vp-textarea:focus {
      border-color: #0071e3;
    }

    .vp-card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .vp-btn-delete {
      padding: 0 8px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .vp-btn-delete:hover {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.25);
      color: #f87171;
    }

    .vp-btn-delete:active {
      transform: scale(0.96);
    }

    .vp-segmented-capsule {
      display: inline-flex;
      align-items: center;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(15, 18, 24, 0.85);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      flex-shrink: 0;
    }

    .vp-btn-save-draft {
      padding: 0 9px;
      height: 28px;
      border: none;
      background: transparent;
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .vp-btn-save-draft:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .vp-capsule-divider {
      width: 1px;
      height: 16px;
      background: rgba(255, 255, 255, 0.12);
    }

    .vp-btn-agent-send {
      padding: 0 11px;
      height: 28px;
      border: none;
      background: #0071e3;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transition: all 0.15s ease;
    }

    .vp-btn-agent-send:hover {
      background: #007dfc;
    }

    .vp-lightbox-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      z-index: 2147483649;
      display: none;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      cursor: zoom-out;
      padding: 24px;
    }

    .vp-lightbox-content {
      position: relative;
      max-width: 92vw;
      max-height: 90vh;
      background: #0b0d11;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      cursor: default;
    }

    .vp-lightbox-img {
      display: block;
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }

    .vp-toast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      background: rgba(14, 16, 20, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      z-index: 2147483647;
      pointer-events: none;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .vp-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  `;
  shadow.appendChild(styleEl);

  // Highlighting & Overlays
  const highlighter = document.createElement('div');
  highlighter.className = 'vp-highlighter';
  const tagBadge = document.createElement('div');
  tagBadge.className = 'vp-tag-badge';
  highlighter.appendChild(tagBadge);
  shadow.appendChild(highlighter);

  const marqueeBackdrop = document.createElement('div');
  marqueeBackdrop.className = 'vp-marquee-backdrop';
  const marqueeBox = document.createElement('div');
  marqueeBox.className = 'vp-marquee-box';
  marqueeBox.innerHTML = `
    <div style="position: absolute; top: -2px; left: -2px; width: 8px; height: 8px; border-top: 2.5px solid #0071e3; border-left: 2.5px solid #0071e3;"></div>
    <div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; border-top: 2.5px solid #0071e3; border-right: 2.5px solid #0071e3;"></div>
    <div style="position: absolute; bottom: -2px; left: -2px; width: 8px; height: 8px; border-bottom: 2.5px solid #0071e3; border-left: 2.5px solid #0071e3;"></div>
    <div style="position: absolute; bottom: -2px; right: -2px; width: 8px; height: 8px; border-bottom: 2.5px solid #0071e3; border-right: 2.5px solid #0071e3;"></div>
  `;
  const marqueeDim = document.createElement('div');
  marqueeDim.className = 'vp-marquee-dim';
  marqueeBox.appendChild(marqueeDim);
  marqueeBackdrop.appendChild(marqueeBox);
  shadow.appendChild(marqueeBackdrop);

  // Lightbox
  const lightboxModal = document.createElement('div');
  lightboxModal.className = 'vp-lightbox-modal';
  lightboxModal.innerHTML = `
    <div class="vp-lightbox-content" id="vp-lightbox-box">
      <img class="vp-lightbox-img" id="vp-lightbox-image" src="" alt="Area Screenshot" />
      <div style="padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); background: rgba(12, 14, 18, 0.95);">
        <span style="font-size: 11.5px; color: #94a3b8; font-family: monospace;">Area Screenshot Preview</span>
        <button class="vp-pill-action-btn" id="vp-lightbox-close">Close (Esc)</button>
      </div>
    </div>
  `;
  shadow.appendChild(lightboxModal);
  lightboxModal.addEventListener('click', () => lightboxModal.style.display = 'none');
  shadow.getElementById('vp-lightbox-box').addEventListener('click', (e) => e.stopPropagation());
  shadow.getElementById('vp-lightbox-close').addEventListener('click', () => lightboxModal.style.display = 'none');

  function openLightbox(src) {
    shadow.getElementById('vp-lightbox-image').src = src;
    lightboxModal.style.display = 'flex';
  }

  // Pins Container
  let pinsContainer = document.getElementById('visualpatch-pins-layer');
  if (!pinsContainer) {
    pinsContainer = document.createElement('div');
    pinsContainer.id = 'visualpatch-pins-layer';
    pinsContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; z-index: 2147483640;';
    document.body.appendChild(pinsContainer);
  }

  const cardsContainer = document.createElement('div');
  shadow.appendChild(cardsContainer);

  const toast = document.createElement('div');
  toast.className = 'vp-toast';
  shadow.appendChild(toast);

  function showToast(msg) {
    toast.innerHTML = `<span style="width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span><span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Toolbar Element
  const toolbar = document.createElement('div');
  toolbar.className = 'vp-toolbar';
  toolbar.id = 'visualpatch-main-toolbar';
  if (currentPos.x !== null && currentPos.y !== null) {
    toolbar.style.left = `${currentPos.x}px`;
    toolbar.style.top = `${currentPos.y}px`;
  }
  toolbar.innerHTML = `
    <div class="vp-brand-badge" id="visualpatch-brand-btn" title="Drag to reposition VisualPatch">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 9V3H9" stroke="#0071E3" stroke-width="2.8" stroke-linecap="square"/>
        <path d="M21 15V21H15" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="square"/>
        <path d="M7 8L12 17L17 8" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="9.5" x2="12" y2="12.5" stroke="#0071E3" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="10.5" y1="11" x2="13.5" y2="11" stroke="#0071E3" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </div>
    <button class="vp-btn-icon" id="visualpatch-btn-inspect" title="Inspect & Pin Element (Alt+D or I)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    </button>
    <button class="vp-btn-icon" id="visualpatch-btn-screenshot" title="Capture Area Screenshot (S)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2v4M2 6h4M18 2v4M22 6h-4M6 22v-4M2 18h4M18 22v-4M22 18h-4" />
      </svg>
    </button>
    <button class="vp-btn-icon" id="visualpatch-btn-send-agent" title="Send All Pins Directly to Agent (Ctrl+Enter)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span class="vp-badge-count" id="visualpatch-agent-count" style="display: none;">0</span>
    </button>
    <button class="vp-btn-icon" id="visualpatch-btn-copy" title="Copy Feedback for AI (Ctrl+C)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span class="vp-badge-count" id="visualpatch-count" style="display: none;">0</span>
    </button>
    <button class="vp-btn-icon" id="visualpatch-btn-clear" title="Clear all pins on this page">
      <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
    <button class="vp-btn-icon" id="visualpatch-btn-minimize" title="Hide toolbar (Alt+T)">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  `;
  shadow.appendChild(toolbar);

  const collapsedPill = document.createElement('div');
  collapsedPill.className = 'vp-collapsed-pill';
  collapsedPill.style.display = 'none';
  if (currentPos.x !== null && currentPos.y !== null) {
    collapsedPill.style.left = `${currentPos.x}px`;
    collapsedPill.style.top = `${currentPos.y}px`;
  }
  collapsedPill.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 9V3H9" stroke="#0071E3" stroke-width="2.8" stroke-linecap="square"/>
      <path d="M21 15V21H15" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="square"/>
      <path d="M7 8L12 17L17 8" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span style="font-size: 11px; font-weight: 700;">VisualPatch</span>
    <span class="vp-badge-count" id="visualpatch-pill-count" style="display: none; position: static; margin-left: 2px;">0</span>
  `;
  shadow.appendChild(collapsedPill);

  // Dragging Toolbar
  const brandBtn = shadow.getElementById('visualpatch-brand-btn');
  function onMouseDown(e) {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = toolbar.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    toolbar.classList.add('vp-dragging');
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp, { once: true });
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    const rect = toolbar.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    const newLeft = Math.max(8, Math.min(initialLeft + deltaX, maxX));
    const newTop = Math.max(8, Math.min(initialTop + deltaY, maxY));
    toolbar.style.left = `${newLeft}px`;
    toolbar.style.top = `${newTop}px`;
    collapsedPill.style.left = `${newLeft}px`;
    collapsedPill.style.top = `${newTop}px`;
    currentPos = { x: newLeft, y: newTop };
    try { localStorage.setItem('visualpatch_toolbar_pos', JSON.stringify(currentPos)); } catch (err) {}
  }

  function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    toolbar.classList.remove('vp-dragging');
    window.removeEventListener('mousemove', onMouseMove);
  }
  brandBtn.addEventListener('mousedown', onMouseDown);

  function toggleVisibility(force) {
    isVisible = typeof force === 'boolean' ? force : !isVisible;
    if (isVisible) {
      toolbar.style.display = 'inline-flex';
      collapsedPill.style.display = 'none';
      showToast('Toolbar Visible (Alt+T)');
    } else {
      toolbar.style.display = 'none';
      collapsedPill.style.display = 'inline-flex';
      showToast('Toolbar Collapsed');
    }
  }
  shadow.getElementById('visualpatch-btn-minimize')?.addEventListener('click', () => toggleVisibility(false));
  collapsedPill.addEventListener('click', () => toggleVisibility(true));

  // CSS Selector Resolver
  function getCssSelector(el) {
    if (!(el instanceof Element)) return '';
    const path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector += `#${el.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = el;
        let nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.trim().split(/\s+/).filter(c => c && !c.startsWith('vp-') && !c.startsWith('dev-annotator')).slice(0, 2);
          if (classes.length) selector += `.${classes.join('.')}`;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      el = el.parentElement;
      if (path.length > 3) break;
    }
    return path.join(' > ');
  }

  function getComponentSourceInfo(el) {
    if (!el || !(el instanceof Element)) return { component: null, sourceFile: null };
    let component = el.getAttribute('data-component') || null;
    let sourceFile = el.getAttribute('data-source-file') || null;
    return { component, sourceFile };
  }

  function getEffectiveBackgroundColor(el) {
    let curr = el;
    while (curr && curr !== document.documentElement) {
      const bg = window.getComputedStyle(curr).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
      curr = curr.parentElement;
    }
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') return bodyBg;
    return '#0b0d12';
  }

  // Pure In-Browser DOM Canvas Auto-Snap Engine (using html-to-image)
  async function captureElementAutoSnap(targetElement, cropBox) {
    if (!targetElement || targetElement === document.body || targetElement === document.documentElement) return null;

    try {
      const effectiveBg = getEffectiveBackgroundColor(targetElement);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      if (window.htmlToImage && window.htmlToImage.toCanvas) {
        const canvas = await window.htmlToImage.toCanvas(targetElement, {
          pixelRatio: dpr,
          cacheBust: false,
          skipFonts: true,
          backgroundColor: effectiveBg,
          filter: (node) => {
            if (!node || node.nodeType !== 1) return true;
            const id = node.id || '';
            const cls = typeof node.className === 'string' ? node.className : '';
            if (id.includes('visualpatch') || id.includes('dev-annotator') || cls.includes('vp-') || cls.includes('highlighter')) {
              return false;
            }
            return true;
          }
        });

        if (canvas && canvas.width > 0 && canvas.height > 0) {
          const pad = 8;
          const padPx = Math.round(pad * dpr);
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = canvas.width + padPx * 2;
          cropCanvas.height = canvas.height + padPx * 2;
          const cropCtx = cropCanvas.getContext('2d');
          cropCtx.fillStyle = effectiveBg;
          cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
          cropCtx.drawImage(canvas, padPx, padPx, canvas.width, canvas.height);
          return cropCanvas.toDataURL('image/png');
        }
      }
    } catch (err) {
      console.warn('[VisualPatch htmlToImage snapshot error]:', err);
    }

    // Direct Image or Canvas Fallback
    if (targetElement instanceof HTMLImageElement && targetElement.complete) {
      try {
        const c = document.createElement('canvas');
        c.width = targetElement.naturalWidth || 200;
        c.height = targetElement.naturalHeight || 150;
        const ctx = c.getContext('2d');
        ctx.drawImage(targetElement, 0, 0);
        return c.toDataURL('image/png');
      } catch (e) {}
    }

    return null;
  }

  // Storage Handlers
  function loadSaved() {
    const storageKey = `visualpatch_notes_${window.location.pathname}`;
    try {
      const data = localStorage.getItem(storageKey);
      if (data) {
        annotations = JSON.parse(data);
        currentPinNumber = annotations.length ? Math.max(...annotations.map(a => a.number || 1)) + 1 : 1;
        renderPins();
        updateCount();
      }
    } catch (e) {}
  }

  function saveStorage() {
    const storageKey = `visualpatch_notes_${window.location.pathname}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(annotations));
    } catch (e) {}
    updateCount();
  }

  function updateCount() {
    const countBadge = shadow.getElementById('visualpatch-count');
    const agentBadge = shadow.getElementById('visualpatch-agent-count');
    const pillBadge = shadow.getElementById('visualpatch-pill-count');
    const copyBtn = shadow.getElementById('visualpatch-btn-copy');
    const agentBtn = shadow.getElementById('visualpatch-btn-send-agent');

    if (annotations.length > 0) {
      if (countBadge) { countBadge.textContent = annotations.length; countBadge.style.display = 'flex'; }
      if (agentBadge) { agentBadge.textContent = annotations.length; agentBadge.style.display = 'flex'; }
      if (pillBadge) { pillBadge.textContent = annotations.length; pillBadge.style.display = 'inline-flex'; }
      if (copyBtn) copyBtn.classList.add('vp-btn-copy-has-pins');
      if (agentBtn) agentBtn.classList.add('vp-btn-copy-has-pins');
    } else {
      if (countBadge) countBadge.style.display = 'none';
      if (agentBadge) agentBadge.style.display = 'none';
      if (pillBadge) pillBadge.style.display = 'none';
      if (copyBtn) copyBtn.classList.remove('vp-btn-copy-has-pins');
      if (agentBtn) agentBtn.classList.remove('vp-btn-copy-has-pins');
    }
  }

  // Render Document Pin Markers
  function renderPins() {
    pinsContainer.innerHTML = '';
    annotations.forEach((item) => {
      const pin = document.createElement('div');
      pin.className = 'vp-pin';
      pin.textContent = item.number;
      pin.style.left = `${item.x}px`;
      pin.style.top = `${item.y}px`;
      pin.title = `Pin #${item.number}: ${item.note || 'Click to edit'}`;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openNoteCard(item, pin);
      });

      pinsContainer.appendChild(pin);
    });
  }

  // Open Feedback Note Card
  function openNoteCard(item, pinEl) {
    cardsContainer.innerHTML = '';

    const scrollX = window.scrollX || 0;
    const scrollY = window.scrollY || 0;
    const clientX = item.x - scrollX;
    const clientY = item.y - scrollY;
    const cardWidth = 380;
    const estimatedHeight = item.screenshot ? 340 : 220;
    const margin = 12;

    let targetX = clientX + 14;
    if (targetX + cardWidth > window.innerWidth - margin) {
      const leftX = clientX - cardWidth - 14;
      targetX = leftX >= margin ? leftX : Math.max(margin, window.innerWidth - cardWidth - margin);
    }
    const cardX = Math.max(margin, Math.min(targetX, window.innerWidth - cardWidth - margin));

    let targetY = clientY - 10;
    const maxAllowedY = Math.max(margin, window.innerHeight - estimatedHeight - margin);
    const cardY = Math.max(margin, Math.min(targetY, maxAllowedY));

    const card = document.createElement('div');
    card.className = 'vp-card';
    card.style.left = `${cardX}px`;
    card.style.top = `${cardY}px`;

    const pinNumStr = item.number < 10 ? `0${item.number}` : item.number;

    let thumbnailHtml = '';
    if (item.screenshot) {
      if (item.screenshot === 'pending') {
        thumbnailHtml = `
          <div id="vp-thumb-placeholder" style="margin-bottom: 12px; height: 75px; border-radius: 10px; background: rgba(0, 113, 227, 0.08); border: 1px dashed rgba(0, 113, 227, 0.35); display: flex; align-items: center; justify-content: center; gap: 8px; color: #38bdf8; font-size: 11.5px; font-weight: 600;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
            <span>Processing area snapshot...</span>
          </div>
        `;
      } else {
        thumbnailHtml = `
          <div class="vp-thumbnail-box">
            <img class="vp-thumbnail-img" id="vp-thumb-img" src="${item.screenshot}" alt="Captured Area" />
            <div class="vp-thumbnail-actions">
              <button class="vp-pill-action-btn" id="vp-btn-zoom">🔍 Zoom</button>
              <a class="vp-pill-action-btn" href="${item.screenshot}" download="visualpatch-pin-${item.number}.png" style="color: #38bdf8;">💾 PNG</a>
            </div>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="vp-card-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="vp-card-pin-pill">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
            PIN ${pinNumStr}
          </span>
          <span style="font-size: 11.5px; font-weight: 600; color: #94a3b8; font-family: monospace;">&lt;${item.tag}&gt;</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button class="vp-pill-action-btn" id="vp-btn-resnap" title="Re-capture live snapshot" style="font-size: 10.5px; padding: 2px 7px; height: 22px; display: inline-flex; align-items: center; gap: 4px;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
            <span>Re-snap</span>
          </button>
          <button class="vp-card-close" id="visualpatch-card-close-btn" title="Close (Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div class="vp-card-preview">
        <span>${item.textSnippet ? `"${item.textSnippet}"` : item.selector}</span>
      </div>

      ${thumbnailHtml}

      <textarea class="vp-textarea" id="visualpatch-note-input" placeholder="What change would you like here?... (Enter to save, Shift+Enter for new line)">${item.note || ''}</textarea>

      <div class="vp-card-actions">
        <button class="vp-btn-delete" id="visualpatch-btn-del-pin" title="Delete this pin">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Delete</span>
        </button>

        <div class="vp-segmented-capsule">
          <button class="vp-btn-save-draft" id="visualpatch-btn-save-pin" title="Save draft locally (Enter)">
            <span>Save</span>
            <span style="font-size: 9.5px; opacity: 0.65; font-family: monospace;">↵</span>
          </button>
          <div class="vp-capsule-divider"></div>
          <button class="vp-btn-agent-send" id="visualpatch-btn-card-send-agent" title="Transmit to Agent (Ctrl+Enter)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Send to Agent</span>
            <span style="font-size: 8.5px; opacity: 0.85; font-family: monospace; background: rgba(0, 0, 0, 0.25); padding: 1px 3.5px; border-radius: 3px;">Ctrl+↵</span>
          </button>
        </div>
      </div>
    `;

    cardsContainer.appendChild(card);

    if (item.screenshot && item.screenshot !== 'pending') {
      card.querySelector('#vp-btn-zoom')?.addEventListener('click', () => openLightbox(item.screenshot));
      card.querySelector('#vp-thumb-img')?.addEventListener('click', () => openLightbox(item.screenshot));
    }

    // Re-snap Action
    card.querySelector('#vp-btn-resnap')?.addEventListener('click', async () => {
      showToast('Re-capturing snapshot...');
      const targetEl = item.selector ? document.querySelector(item.selector) : null;
      item.screenshot = 'pending';
      openNoteCard(item, pinEl);
      const snap = await captureElementAutoSnap(targetEl, item.cropBox);
      item.screenshot = snap || null;
      saveStorage();
      renderPins();
      openNoteCard(item, pinEl);
      if (snap) showToast('📸 Snapshot updated');
    });

    const input = card.querySelector('#visualpatch-note-input');
    setTimeout(() => {
      if (input) {
        input.focus();
        input.select();
      }
    }, 40);

    // Save Action
    const saveNote = () => {
      if (input) item.note = input.value.trim();
      saveStorage();
      renderPins();
      cardsContainer.innerHTML = '';
      showToast(`Saved Pin #${item.number}`);
    };

    // Delete Action
    const deleteNote = () => {
      annotations = annotations.filter(a => a.id !== item.id);
      saveStorage();
      renderPins();
      cardsContainer.innerHTML = '';
      showToast(`Deleted Pin #${item.number}`);
    };

    card.querySelector('#visualpatch-card-close-btn')?.addEventListener('click', () => cardsContainer.innerHTML = '');
    card.querySelector('#visualpatch-btn-save-pin')?.addEventListener('click', saveNote);
    card.querySelector('#visualpatch-btn-del-pin')?.addEventListener('click', deleteNote);
    card.querySelector('#visualpatch-btn-card-send-agent')?.addEventListener('click', () => {
      if (input) item.note = input.value.trim();
      saveStorage();
      sendToAgent();
    });

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          saveNote();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cardsContainer.innerHTML = '';
        }
      });
    }
  }

  function toggleInspect(force) {
    isInspectMode = typeof force === 'boolean' ? force : !isInspectMode;
    const btn = shadow.getElementById('visualpatch-btn-inspect');
    if (isInspectMode) {
      toggleScreenshot(false);
      btn.classList.add('vp-btn-active');
      document.body.style.cursor = 'crosshair';
      showToast('Inspect Mode Active · Click element to pin');
    } else {
      btn.classList.remove('vp-btn-active');
      highlighter.style.display = 'none';
      document.body.style.cursor = 'default';
    }
  }

  function toggleScreenshot(force) {
    isScreenshotMode = typeof force === 'boolean' ? force : !isScreenshotMode;
    const btn = shadow.getElementById('visualpatch-btn-screenshot');
    if (isScreenshotMode) {
      toggleInspect(false);
      btn.classList.add('vp-btn-active');
      marqueeBackdrop.style.display = 'block';
      showToast('Screenshot Mode · Drag marquee box to crop');
    } else {
      btn.classList.remove('vp-btn-active');
      marqueeBackdrop.style.display = 'none';
      marqueeBox.style.display = 'none';
    }
  }

  // Marquee Area Drag
  marqueeBackdrop.addEventListener('contextmenu', (e) => e.preventDefault());
  marqueeBackdrop.addEventListener('mousedown', (e) => {
    if (e.button !== 0 && e.button !== 2) return;
    isMarqueeDragging = true;
    marqueeStartX = e.clientX;
    marqueeStartY = e.clientY;
    marqueeBox.style.left = `${e.clientX}px`;
    marqueeBox.style.top = `${e.clientY}px`;
    marqueeBox.style.width = '0px';
    marqueeBox.style.height = '0px';
    marqueeBox.style.display = 'block';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMarqueeDragging || !isScreenshotMode) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const x = Math.min(marqueeStartX, currentX);
    const y = Math.min(marqueeStartY, currentY);
    const w = Math.abs(currentX - marqueeStartX);
    const h = Math.abs(currentY - marqueeStartY);

    marqueeBox.style.left = `${x}px`;
    marqueeBox.style.top = `${y}px`;
    marqueeBox.style.width = `${w}px`;
    marqueeBox.style.height = `${h}px`;
    marqueeDim.style.bottom = (y + h + 38 > window.innerHeight) ? '10px' : '-34px';
    marqueeDim.innerHTML = `<span style="width: 5px; height: 5px; border-radius: 50%; background: #38bdf8;"></span><span>${Math.round(w)} × ${Math.round(h)}</span>`;
  });

  window.addEventListener('mouseup', async (e) => {
    if (!isMarqueeDragging || !isScreenshotMode) return;
    isMarqueeDragging = false;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const x = Math.min(marqueeStartX, currentX);
    const y = Math.min(marqueeStartY, currentY);
    const w = Math.abs(currentX - marqueeStartX);
    const h = Math.abs(currentY - marqueeStartY);

    if (w < 15 || h < 15) {
      marqueeBox.style.display = 'none';
      return;
    }

    const cropRect = { x, y, width: w, height: h };
    toggleScreenshot(false);

    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const elementsAtPoint = document.elementsFromPoint ? document.elementsFromPoint(centerX, centerY) : [];
    const el = elementsAtPoint.find((node) => {
      if (!node || node === document.body || node === document.documentElement) return false;
      if (node.id === 'vp-marquee-backdrop' || node.id === 'visualpatch-host' || node.id === 'visualpatch-pins-layer') return false;
      return true;
    }) || document.body;

    const selector = getCssSelector(el);
    const sourceInfo = getComponentSourceInfo(el);
    const textSnippet = el.textContent ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) : '';

    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    const newAnnotation = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      number: currentPinNumber++,
      tag: el.tagName ? el.tagName.toLowerCase() : 'area',
      selector: selector || `area[${w}x${h}]`,
      component: sourceInfo.component,
      sourceFile: sourceInfo.sourceFile,
      textSnippet: textSnippet,
      note: '',
      x: Math.round(x + scrollX + 16),
      y: Math.round(y + scrollY + 16),
      screenshot: 'pending',
      cropBox: cropRect,
      timestamp: new Date().toISOString()
    };

    annotations.push(newAnnotation);
    saveStorage();
    renderPins();

    const pins = pinsContainer.querySelectorAll('.vp-pin');
    const lastPin = pins[pins.length - 1];
    if (lastPin) openNoteCard(newAnnotation, lastPin);

    captureElementAutoSnap(el, cropRect).then((snap) => {
      newAnnotation.screenshot = snap || null;
      saveStorage();
      renderPins();
      const thumbPlaceholder = cardsContainer.querySelector('#vp-thumb-placeholder');
      if (thumbPlaceholder) {
        if (snap) {
          const thumbDiv = document.createElement('div');
          thumbDiv.className = 'vp-thumbnail-box';
          thumbDiv.innerHTML = `
            <img class="vp-thumbnail-img" id="vp-thumb-img" src="${snap}" alt="Captured Area" />
            <div class="vp-thumbnail-actions">
              <button class="vp-pill-action-btn" id="vp-btn-zoom">🔍 Zoom</button>
              <a class="vp-pill-action-btn" href="${snap}" download="visualpatch-pin-${newAnnotation.number}.png" style="color: #38bdf8;">💾 PNG</a>
            </div>
          `;
          thumbPlaceholder.replaceWith(thumbDiv);
          thumbDiv.querySelector('#vp-btn-zoom')?.addEventListener('click', () => openLightbox(snap));
          thumbDiv.querySelector('#vp-thumb-img')?.addEventListener('click', () => openLightbox(snap));
        } else {
          thumbPlaceholder.remove();
        }
      }
    });
  });

  // Direct 0-Token AI Agent Bridge
  async function sendToAgent() {
    const input = shadow.querySelector('#visualpatch-note-input');
    if (input && annotations.length) {
      const last = annotations[annotations.length - 1];
      if (last && !last.note) last.note = input.value.trim();
      saveStorage();
      cardsContainer.innerHTML = '';
    }

    if (!annotations.length) {
      showToast('No annotations yet · Drop pins first');
      return;
    }

    const count = annotations.length;
    showToast(`⚡ Transmitting ${count} item${count > 1 ? 's' : ''} to Agent...`);

    const payload = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      items: annotations.map((item) => ({
        number: item.number,
        tag: item.tag,
        selector: item.selector,
        component: item.component || null,
        sourceFile: item.sourceFile || null,
        textSnippet: item.textSnippet,
        note: item.note,
        screenshot: item.screenshot
      }))
    };

    let sent = false;
    try {
      const bridgeRes = await fetch('http://127.0.0.1:44922/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (bridgeRes.ok) sent = true;
    } catch (e) {}

    let md = `### 📌 VisualPatch UI Task Queue\n`;
    md += `**Source URL:** \`${window.location.href}\`\n`;
    md += `**Total Items:** ${count}\n\n`;

    annotations.forEach((item, index) => {
      md += `#### ${index + 1}. Element: \`${item.selector}\`${item.screenshot ? ' 📸 [Snapshot Attached]' : ''}\n`;
      if (item.textSnippet) md += `- **Rendered Text:** "${item.textSnippet}"\n`;
      md += `- **Requested Change:** ${item.note || 'Inspect and refine component styling.'}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(md);
    } catch (e) {}

    annotations = [];
    currentPinNumber = 1;
    saveStorage();
    renderPins();
    cardsContainer.innerHTML = '';

    if (sent) {
      showToast(`⚡ Saved to .visualpatch/inbox.md!`);
    } else {
      showToast(`📋 Copied clean Markdown to clipboard`);
    }
  }

  async function copyForAI() {
    await sendToAgent();
  }

  // Hover Outline
  document.addEventListener('mousemove', (e) => {
    if (!isInspectMode || isScreenshotMode) return;
    if (e.target.closest('#visualpatch-host') || e.target.closest('#visualpatch-pins-layer')) return;

    const el = e.target;
    if (!el || el === document.body || el === document.documentElement || el.id === 'root') {
      highlighter.style.display = 'none';
      return;
    }
    if (el === hoveredElement) return;
    hoveredElement = el;

    const rect = el.getBoundingClientRect();
    if (rect.width >= window.innerWidth * 0.96 && rect.height >= window.innerHeight * 0.96) {
      highlighter.style.display = 'none';
      return;
    }

    highlighter.style.display = 'block';
    highlighter.style.left = `${rect.left}px`;
    highlighter.style.top = `${rect.top}px`;
    highlighter.style.width = `${rect.width}px`;
    highlighter.style.height = `${rect.height}px`;
    tagBadge.textContent = `${el.tagName.toLowerCase()} [${Math.round(rect.width)}×${Math.round(rect.height)}]`;
  }, true);

  // Click to Drop Pin
  document.addEventListener('click', async (e) => {
    if (!isInspectMode || isScreenshotMode) return;
    if (e.target.closest('#visualpatch-host') || e.target.closest('#visualpatch-pins-layer')) return;

    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    if (!el || el === document.body || el === document.documentElement || el.id === 'root') return;

    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const pinX = Math.round(e.pageX || rect.left + scrollX + 10);
    const pinY = Math.round(e.pageY || rect.top + scrollY + 10);

    const selector = getCssSelector(el);
    const sourceInfo = getComponentSourceInfo(el);
    const textSnippet = el.textContent ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) : '';

    const pad = 8;
    const cropX = Math.max(0, rect.left - pad);
    const cropY = Math.max(0, rect.top - pad);
    const cropW = Math.min(window.innerWidth - cropX, rect.width + pad * 2);
    const cropH = Math.min(window.innerHeight - cropY, rect.height + pad * 2);
    const cropBox = { x: cropX, y: cropY, width: Math.max(16, cropW), height: Math.max(16, cropH) };

    const newAnnotation = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      number: currentPinNumber++,
      tag: el.tagName.toLowerCase(),
      selector: selector,
      component: sourceInfo.component,
      sourceFile: sourceInfo.sourceFile,
      textSnippet: textSnippet,
      note: '',
      x: pinX,
      y: pinY,
      screenshot: 'pending',
      cropBox: cropBox,
      timestamp: new Date().toISOString()
    };

    annotations.push(newAnnotation);
    saveStorage();
    renderPins();

    const pins = pinsContainer.querySelectorAll('.vp-pin');
    const targetPinEl = pins[pins.length - 1];
    if (targetPinEl) openNoteCard(newAnnotation, targetPinEl);

    // Run Auto Snap asynchronously
    captureElementAutoSnap(el, cropBox).then((snap) => {
      newAnnotation.screenshot = snap || null;
      saveStorage();
      renderPins();

      const thumbPlaceholder = cardsContainer.querySelector('#vp-thumb-placeholder');
      if (thumbPlaceholder) {
        if (snap) {
          const thumbDiv = document.createElement('div');
          thumbDiv.className = 'vp-thumbnail-box';
          thumbDiv.innerHTML = `
            <img class="vp-thumbnail-img" id="vp-thumb-img" src="${snap}" alt="Captured Area" />
            <div class="vp-thumbnail-actions">
              <button class="vp-pill-action-btn" id="vp-btn-zoom">🔍 Zoom</button>
              <a class="vp-pill-action-btn" href="${snap}" download="visualpatch-pin-${newAnnotation.number}.png" style="color: #38bdf8;">💾 PNG</a>
            </div>
          `;
          thumbPlaceholder.replaceWith(thumbDiv);
          thumbDiv.querySelector('#vp-btn-zoom')?.addEventListener('click', () => openLightbox(snap));
          thumbDiv.querySelector('#vp-thumb-img')?.addEventListener('click', () => openLightbox(snap));
        } else {
          thumbPlaceholder.remove();
        }
      }
    });
  }, true);

  // Global Keydown Handler
  window.addEventListener('keydown', (e) => {
    const isEsc = e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape' || e.keyCode === 27;

    if (isEsc) {
      e.preventDefault();
      e.stopPropagation();

      if (lightboxModal.style.display === 'flex') {
        lightboxModal.style.display = 'none';
        return;
      }
      if (isScreenshotMode) {
        toggleScreenshot(false);
        showToast('Screenshot mode cancelled');
        return;
      }
      const card = shadow.querySelector('.vp-card');
      if (card) {
        cardsContainer.innerHTML = '';
        return;
      }
      toggleInspect();
      return;
    }

    // Ctrl + Enter to Send
    const isEnterKey = e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13;
    if (isEnterKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      sendToAgent();
      return;
    }

    const activeEl = shadow.activeElement || document.activeElement;
    const isTyping = activeEl && (
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName) ||
      activeEl.isContentEditable ||
      activeEl.getAttribute('contenteditable') === 'true' ||
      activeEl.getAttribute('role') === 'textbox'
    );

    if (isTyping) return;

    if ((e.altKey && e.code === 'KeyT') || (e.ctrlKey && e.shiftKey && e.code === 'KeyT') || e.key === 'F8') {
      e.preventDefault();
      toggleVisibility();
    }
    if ((e.altKey && e.code === 'KeyD') || (e.altKey && e.code === 'KeyA') || e.key?.toLowerCase() === 'i') {
      e.preventDefault();
      toggleInspect();
    }
    if (!e.ctrlKey && !e.metaKey && (e.key?.toLowerCase() === 's' || e.code === 'KeyS')) {
      e.preventDefault();
      toggleScreenshot();
    }
  }, true);

  shadow.getElementById('visualpatch-btn-inspect')?.addEventListener('click', () => toggleInspect());
  shadow.getElementById('visualpatch-btn-screenshot')?.addEventListener('click', () => toggleScreenshot());
  shadow.getElementById('visualpatch-btn-send-agent')?.addEventListener('click', sendToAgent);
  shadow.getElementById('visualpatch-btn-copy')?.addEventListener('click', copyForAI);
  shadow.getElementById('visualpatch-btn-clear')?.addEventListener('click', () => {
    annotations = [];
    currentPinNumber = 1;
    saveStorage();
    renderPins();
    cardsContainer.innerHTML = '';
    showToast('All pins cleared');
  });

  loadSaved();
  console.log('%c[VisualPatch] Ready! Single Dock with Pure DOM Auto-Snap, Save & Delete.', 'background: #0071e3; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
})();
