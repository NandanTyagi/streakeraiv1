if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),d={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>d[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"03a11cd4c7f1d37ae7b76b54004701aa"},{url:"/_next/static/chunks/0e5ce63c-657a17b0276178b5.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/192-7912b7fd1ab27227.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/232-d4e39fa06b175810.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/280-8d627cba72ccd774.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/396-6ae5993bba156d34.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/561-a0eb7b328cc3be2b.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/584-f0914c2dc2469a36.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/628-262868e322b0d0bc.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/653-99039a7941fe99d2.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/749-7411ab5a469e0979.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/795-22d65f2b8e876c57.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/893-07eb359f718cf94c.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/906-385adcbe15e18a32.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/938-17d532de210fd74d.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/977-c4a9f3ea9377d147.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/9d7b1695-64f4c1ee59904f45.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/_not-found-b9d66c279ba45115.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/about/page-9059d93c8bf82d3d.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/board/page-99e87a3f4095c976.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/dashboard/page-a5ffa2180dfeecd7.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/generategoals/page-fb700b9a4d2a6ba2.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/history/layout-f5a2522058149e21.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/history/page-3a8e40c83e60a3da.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/install/page-d8351245e52a3fae.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/layout-372693fa0eb5ba64.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/loading-834c71f67447bbf7.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/page-16712c067fe8ca8f.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/panel/%5Bid%5D/page-f7033a15a18183bd.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/panel/page-141ac3c6705cd8d8.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/stats/page-444163cea4f8aa98.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/app/suggestions/page-5013a13191df7292.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/ca377847-a4b7ce8597281308.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/fd9d1056-483a2b0e96991cf9.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/framework-8883d1e9be70c3da.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/main-88ba70d54e7e6f6c.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/main-app-daf93ebba2280fed.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/pages/_app-98cb51ec6f9f135f.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/pages/_error-e87e5963ec1b8011.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-d94472e6f60ba6b7.js",revision:"qCXt6dAsbydNf0ZHRhZB1"},{url:"/_next/static/css/191b873ab916e396.css",revision:"191b873ab916e396"},{url:"/_next/static/css/221bbf45d4d354e3.css",revision:"221bbf45d4d354e3"},{url:"/_next/static/css/6c41304572517ad3.css",revision:"6c41304572517ad3"},{url:"/_next/static/css/af97f4f740ed7c93.css",revision:"af97f4f740ed7c93"},{url:"/_next/static/qCXt6dAsbydNf0ZHRhZB1/_buildManifest.js",revision:"a1b7599199e2e8c82f2c6bcf8d8aca61"},{url:"/_next/static/qCXt6dAsbydNf0ZHRhZB1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/about-btn.svg",revision:"49a8caec90139b44683e9b02ba71bf2b"},{url:"/aidentify-btn.svg",revision:"8bff98cd9c655c09b907dc4940079f1c"},{url:"/apple-touch-icon.png",revision:"78c613b5cea8606b9f2b9b7ec1d030e0"},{url:"/atomic-habits.png",revision:"3278255d9c268f739d9ebaf3e3dce871"},{url:"/burger-white-cross.svg",revision:"fab2e9015d151887e5f5246501cae5b4"},{url:"/burger-white.svg",revision:"66bfb313bcac648c741599699c8217a5"},{url:"/burger.svg",revision:"b082328820e0dc40e128a700ac251465"},{url:"/devnty-logo-new.jpg",revision:"489e18aca57a53af570d7bb5f0346b83"},{url:"/devnty-logo-svg-mini.svg",revision:"37f0ef1997fffa2f9e8cf2ab72ab2739"},{url:"/devnty-logo.png",revision:"0cb25f6bdfa4d9ae11c997cc34db6658"},{url:"/devnty.png",revision:"23976247cd9fd188c93001393e45857d"},{url:"/dog-ear.svg",revision:"648060d9a625e5e05a94ac37c5359861"},{url:"/floppy-disk-regular.svg",revision:"ffd8599829e8ee9f8f49abecb8d32bdb"},{url:"/icon-check.svg",revision:"1fdb7c12fb85a0c13e7216ea0fa245c0"},{url:"/icon-cross.svg",revision:"a4514200a06d535694e85bbb31862f3f"},{url:"/join-btn.svg",revision:"b98ab16dc2e92cf55774cf05377445f5"},{url:"/mobile-fade.webp",revision:"dc6d45788c86aa73e8930adbe874b678"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opengraph-image.png",revision:"109bf5774d0a39cb81630e509c95186e"},{url:"/poster.jpg",revision:"70451621dd154c471e188db11b23b3c2"},{url:"/share-apple-icon.svg",revision:"c2ccd777c9535f30161f3ca1e740bf22"},{url:"/spinner-purple.gif",revision:"0b259f8715e7326bbe389a66c970c7e8"},{url:"/spinner-rainbow.gif",revision:"52d7c9ba7281da0731798cf6374c2eaf"},{url:"/spinner.gif",revision:"984381ca77db27cd5428627fe933b508"},{url:"/streaker-bg-landscape-fade.webp",revision:"89b9a8a75375207b371b9a0d172dbedf"},{url:"/streaker-logo-180x180.png",revision:"78c613b5cea8606b9f2b9b7ec1d030e0"},{url:"/streaker-logo-192x192.png",revision:"9739593d49031f0c74aba8622dafa568"},{url:"/streaker-logo-512x512.png",revision:"67a3c94d234e428a2475a1cf0d12df38"},{url:"/streaker-logo-min.png",revision:"86ad1a221da1f788a6d70d7dc068a051"},{url:"/streaker-logo-min.svg",revision:"39bed1a45f6bdeb3b95f72c3d83d9083"},{url:"/streaker-logo.png",revision:"1739defed4301d3d18e727e8762bd668"},{url:"/streaker-logo.svg",revision:"f27cd65c87583919b4a26c4b5f0a5f1e"},{url:"/streaker-mobile-bg-2.png",revision:"a380d3b1a62118067eaff027f9f26f8a"},{url:"/streakerai-vid-v1.mp4",revision:"4e9d57d84a2830b185e97c0340fddae6"},{url:"/the-compound-effect.png",revision:"5032e78efce53b5399c12c79fff69480"},{url:"/track-btn.svg",revision:"69fb3db163bb7947f80508e55af8ebdc"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
